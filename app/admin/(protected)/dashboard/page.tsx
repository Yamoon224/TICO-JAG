"use client";

import { ChartContainer, ChartTooltip, ChartTooltipContent, type ChartConfig } from "@/components/ui/chart";
import { useAdminSession } from "@/components/admin/admin-context";
import { adminList } from "@/lib/api";
import { BarChart3, Calendar, Newspaper, Plus, ShoppingBag, Users } from "lucide-react";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { Bar, BarChart, CartesianGrid, Line, LineChart, XAxis, YAxis } from "recharts";

type DashboardStats = {
  clubs: number;
  teams: number;
  players: number;
  news: number;
  matches: number;
  standings: number;
  products: number;
};

type TrendPoint = {
  month: string;
  matches: number;
  news: number;
  products: number;
};

const INITIAL_STATS: DashboardStats = {
  clubs: 0,
  teams: 0,
  players: 0,
  news: 0,
  matches: 0,
  standings: 0,
  products: 0,
};

const TREND_CONFIG = {
  matches: { label: "Matchs", color: "#0f766e" },
  news: { label: "Actualites", color: "#1d4ed8" },
  products: { label: "Produits", color: "#b45309" },
} satisfies ChartConfig;

function parseDateFromItem(item: unknown, keys: string[]): Date | null {
  if (!item || typeof item !== "object") {
    return null;
  }

  for (const key of keys) {
    const value = (item as Record<string, unknown>)[key];
    if (typeof value === "string" || typeof value === "number") {
      const date = new Date(value);
      if (!Number.isNaN(date.getTime())) {
        return date;
      }
    }
  }

  return null;
}

function buildMonthlyTrend(
  matches: unknown[],
  news: unknown[],
  products: unknown[],
  monthsCount = 6
): TrendPoint[] {
  const now = new Date();
  const formatter = new Intl.DateTimeFormat("fr-FR", { month: "short" });
  const months: Array<{ key: string; label: string; start: Date; end: Date }> = [];

  for (let i = monthsCount - 1; i >= 0; i -= 1) {
    const start = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const end = new Date(now.getFullYear(), now.getMonth() - i + 1, 0, 23, 59, 59, 999);
    const key = `${start.getFullYear()}-${String(start.getMonth() + 1).padStart(2, "0")}`;

    months.push({
      key,
      label: formatter.format(start).replace(".", ""),
      start,
      end,
    });
  }

  const base = months.map((m) => ({ month: m.label, matches: 0, news: 0, products: 0 }));

  const fillSeries = (
    items: unknown[],
    dateKeys: string[],
    target: "matches" | "news" | "products"
  ) => {
    for (const item of items) {
      const date = parseDateFromItem(item, dateKeys);
      if (!date) {
        continue;
      }

      const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
      const monthIndex = months.findIndex((m) => m.key === monthKey);

      if (monthIndex >= 0) {
        base[monthIndex][target] += 1;
      }
    }
  };

  fillSeries(matches, ["date", "match_date", "played_at", "created_at"], "matches");
  fillSeries(news, ["published_at", "date", "created_at"], "news");
  fillSeries(products, ["created_at", "updated_at", "date"], "products");

  return base;
}

export default function AdminDashboardPage() {
  const { token, clubsWithTeams } = useAdminSession();
  const [stats, setStats] = useState<DashboardStats>(INITIAL_STATS);
  const [periodMonths, setPeriodMonths] = useState<3 | 6 | 12>(6);
  const [trendSource, setTrendSource] = useState<{
    matches: unknown[];
    news: unknown[];
    products: unknown[];
  }>({
    matches: [],
    news: [],
    products: [],
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadStats() {
      if (!token) {
        setLoading(false);
        return;
      }

      setLoading(true);
      setError("");

      try {
        const [players, news, matches, standings, products] = await Promise.all([
          adminList("players", token),
          adminList("news", token),
          adminList("matches", token),
          adminList("standings", token),
          adminList("products", token),
        ]);

        const teams = clubsWithTeams.reduce((total, club) => total + (club.teams?.length ?? 0), 0);

        setStats({
          clubs: clubsWithTeams.length,
          teams,
          players: players.length,
          news: news.length,
          matches: matches.length,
          standings: standings.length,
          products: products.length,
        });

        setTrendSource({
          matches,
          news,
          products,
        });
      } catch (err) {
        setError(err instanceof Error ? err.message : "Impossible de charger les statistiques.");
      } finally {
        setLoading(false);
      }
    }

    void loadStats();
  }, [token, clubsWithTeams]);

  const cards = useMemo(
    () => [
      { label: "Clubs", value: stats.clubs, href: "/admin/clubs" },
      { label: "Equipes", value: stats.teams, href: "/admin/clubs" },
      { label: "Joueurs", value: stats.players, href: "/admin/players" },
      { label: "Actualites", value: stats.news, href: "/admin/news" },
      { label: "Matchs", value: stats.matches, href: "/admin/matches" },
      { label: "Classements", value: stats.standings, href: "/admin/standings" },
      { label: "Produits", value: stats.products, href: "/admin/products" },
    ],
    [stats]
  );

  const trendData: TrendPoint[] = useMemo(
    () => buildMonthlyTrend(trendSource.matches, trendSource.news, trendSource.products, periodMonths),
    [trendSource, periodMonths]
  );

  const quickActions = [
    { label: "Nouveau match", href: "/admin/matches", icon: Calendar },
    { label: "Nouvelle actualite", href: "/admin/news", icon: Newspaper },
    { label: "Nouveau produit", href: "/admin/products", icon: ShoppingBag },
    { label: "Nouveau joueur", href: "/admin/players", icon: Users },
  ];

  const volumeData = [
    { name: "Matchs", total: stats.matches },
    { name: "Actualites", total: stats.news },
    { name: "Produits", total: stats.products },
  ];

  return (
    <div className="space-y-5">
      <section className="bg-white border border-slate-200 rounded-xl p-5 sm:p-6">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-xs uppercase tracking-wide text-slate-500">Vue metier</p>
            <h2 className="text-lg sm:text-xl font-semibold text-slate-900 mt-1">
              Dashboard administration
            </h2>
            <p className="text-sm text-slate-600 mt-2">
              Suivi des operations et evolution des contenus matchs, actualites et produits.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-2 sm:flex sm:flex-wrap">
            {quickActions.map((action) => {
              const Icon = action.icon;
              return (
                <Link
                  key={action.label}
                  href={action.href}
                  className="inline-flex items-center gap-2 rounded-md border border-slate-300 bg-white px-3 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50"
                >
                  <Plus size={13} />
                  <Icon size={14} />
                  {action.label}
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-sm text-red-700">{error}</div>
      )}

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {cards.map((card) => (
          <Link
            key={card.label}
            href={card.href}
            className="bg-white border border-slate-200 rounded-xl p-4 hover:border-slate-300 transition-colors"
          >
            <p className="text-xs text-slate-500">{card.label}</p>
            <p className="text-2xl font-bold text-slate-900 mt-2">{loading ? "..." : card.value}</p>
            <p className="text-xs text-slate-500 mt-2">Ouvrir le module</p>
          </Link>
        ))}
      </section>

      <section className="grid gap-4 xl:grid-cols-3">
        <div className="xl:col-span-2 bg-white border border-slate-200 rounded-xl p-4 sm:p-5">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between mb-3">
            <div>
              <p className="text-xs uppercase tracking-wide text-slate-500">Evolution</p>
              <h3 className="text-sm font-semibold text-slate-900">{periodMonths} derniers mois</h3>
            </div>

            <div className="flex items-center gap-2">
              <div className="inline-flex items-center rounded-md border border-slate-300 bg-white p-1">
                {[3, 6, 12].map((value) => (
                  <button
                    key={value}
                    type="button"
                    onClick={() => setPeriodMonths(value as 3 | 6 | 12)}
                    className={`px-2.5 py-1 text-xs rounded-sm transition-colors ${
                      periodMonths === value
                        ? "bg-slate-900 text-white"
                        : "text-slate-600 hover:bg-slate-100"
                    }`}
                  >
                    {value}m
                  </button>
                ))}
              </div>
              <BarChart3 size={16} className="text-slate-500" />
            </div>
          </div>

          <ChartContainer config={TREND_CONFIG} className="h-[260px] w-full">
            <LineChart data={trendData} margin={{ left: 4, right: 10, top: 10, bottom: 0 }}>
              <CartesianGrid vertical={false} strokeDasharray="3 3" />
              <XAxis dataKey="month" tickLine={false} axisLine={false} />
              <YAxis allowDecimals={false} tickLine={false} axisLine={false} width={24} />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Line
                type="monotone"
                dataKey="matches"
                stroke="var(--color-matches)"
                strokeWidth={2.5}
                dot={{ r: 3 }}
              />
              <Line
                type="monotone"
                dataKey="news"
                stroke="var(--color-news)"
                strokeWidth={2.5}
                dot={{ r: 3 }}
              />
              <Line
                type="monotone"
                dataKey="products"
                stroke="var(--color-products)"
                strokeWidth={2.5}
                dot={{ r: 3 }}
              />
            </LineChart>
          </ChartContainer>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-4 sm:p-5">
          <p className="text-xs uppercase tracking-wide text-slate-500">Comparatif volume</p>
          <h3 className="text-sm font-semibold text-slate-900 mb-3">Total actuel</h3>

          <ChartContainer
            config={{ total: { label: "Total", color: "#334155" } }}
            className="h-[260px] w-full"
          >
            <BarChart data={volumeData} margin={{ left: 6, right: 6, top: 10, bottom: 0 }}>
              <CartesianGrid vertical={false} strokeDasharray="3 3" />
              <XAxis dataKey="name" tickLine={false} axisLine={false} />
              <YAxis allowDecimals={false} tickLine={false} axisLine={false} width={24} />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Bar dataKey="total" fill="var(--color-total)" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ChartContainer>
        </div>
      </section>
    </div>
  );
}
