"use client";

import { useParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { useState, useMemo, useEffect, type CSSProperties } from "react";
import Navbar from "@/components/Navbar";
import { ClubFooter } from "@/components/Footer";
import PlayerCard from "@/components/PlayerCard";
import {
  fetchClubBySlug,
  fetchClubPlayersByCategory,
  type ClubApiModel,
  type TeamPlayerCardModel,
} from "@/lib/api";
import { useLocale } from "@/lib/locale-context";
import { Search, X } from "lucide-react";

const CAT_MAP: Record<string, "Cadets" | "Juniors" | "Seniors"> = {
  cadets: "Cadets",
  juniors: "Juniors",
  seniors: "Seniors",
};

const POSTES_FR = ["Tous", "Gardien", "Défenseur", "Milieu", "Attaquant"] as const;

export default function TeamPage() {
  const params = useParams<{ clubId: string; categorie: string }>();
  const { t } = useLocale();
  const catKey = params.categorie?.toLowerCase();
  const category = CAT_MAP[catKey];

  const [search, setSearch] = useState("");
  const [posteFilter, setPosteFilter] = useState<string>("Tous");
  const [club, setClub] = useState<ClubApiModel | null>(null);
  const [players, setPlayers] = useState<TeamPlayerCardModel[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;

    async function run() {
      if (!category) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);
        const [clubResult, playersResult] = await Promise.all([
          fetchClubBySlug(params.clubId),
          fetchClubPlayersByCategory(params.clubId, catKey ?? ""),
        ]);

        if (mounted) {
          setClub(clubResult);
          setPlayers(playersResult);
        }
      } catch {
        if (mounted) {
          setError("Impossible de charger l'effectif.");
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    }

    run();

    return () => {
      mounted = false;
    };
  }, [params.clubId, catKey, category]);

  const filtered = useMemo(() => {
    return players.filter((p) => {
      const fullName = `${p.prenom} ${p.nom}`.toLowerCase();
      const matchSearch =
        fullName.includes(search.toLowerCase()) || String(p.numero).includes(search);
      const matchPoste = posteFilter === "Tous" || p.poste === posteFilter;
      return matchSearch && matchPoste;
    });
  }, [players, search, posteFilter]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <Navbar />
        <div className="flex-1 flex items-center justify-center px-4">
          <p className="text-muted-foreground text-sm">Chargement de l&apos;équipe...</p>
        </div>
      </div>
    );
  }

  if (!club || !category) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <Navbar />
        <div className="flex-1 flex items-center justify-center px-4">
          <div className="text-center">
            <p className="text-xl font-black text-foreground mb-2">Page introuvable</p>
            {error && <p className="text-xs text-muted-foreground mb-2">{error}</p>}
            <Link href="/" className="text-sm font-semibold hover:underline text-jag">
              Retour à l&apos;accueil
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const categories: Array<"Cadets" | "Juniors" | "Seniors"> = ["Cadets", "Juniors", "Seniors"];
  const hasFilters = search !== "" || posteFilter !== "Tous";
  const primaryColor = club.primary_color || "#CC0000";
  const clubVars = { "--club": primaryColor } as CSSProperties;

  return (
    <div className="min-h-screen bg-background" style={clubVars}>
      <Navbar />

      {/* ── Club mini-header ──────────────────────────────── */}
      <div className="relative h-44 sm:h-56 overflow-hidden bg-[#0C0E11]">
        <Image src={club.hero || "/images/jag-hero.png"} alt={club.name} fill className="object-cover opacity-35" priority />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0C0E11] via-[#0C0E11]/45 to-[#0C0E11]/10" />
        <div className="absolute inset-0 flex items-center px-4 sm:px-8 gap-4">
          <Link href={`/clubs/${club.slug}`} className="shrink-0">
            <Image
              src={club.logo || "/images/jag-logo.png"}
              alt={club.name}
              width={56}
              height={56}
              className="rounded-full border-2 shadow-lg object-cover bg-white/10"
              style={{ borderColor: "var(--club)" }}
            />
          </Link>
          <div className="min-w-0">
            <p className="eyebrow text-white/60 mb-1 truncate" style={{ color: "var(--club)" }}>{club.name}</p>
            <h1 className="font-display text-white font-black text-3xl sm:text-5xl uppercase leading-[0.95] tracking-tight">
              {t.categories[category]}
            </h1>
            <p className="text-white/40 text-xs mt-1 tabular-nums">
              {players.length} {t.team.players}
            </p>
          </div>
        </div>
        <div className="scoreboard-tile absolute inset-x-0 bottom-0 h-[3px]" aria-hidden />
      </div>

      {/* ── Category tabs ─────────────────────────────────── */}
      <div className="flex bg-club">
        {categories.map((cat) => (
          <Link
            key={cat}
            href={`/clubs/${club.slug}/equipe/${cat.toLowerCase()}`}
            className={`flex-1 py-3 text-center font-display text-xs sm:text-sm font-bold uppercase tracking-wide transition-colors border-b-2 ${
              cat === category
                ? "border-white text-white"
                : "border-transparent text-white/50 hover:text-white"
            }`}
          >
            {t.categories[cat]}
          </Link>
        ))}
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 md:py-8">

        {/* ── Filters ───────────────────────────────────────── */}
        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          {/* Search */}
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground" size={15} />
            <input
              type="text"
              placeholder={t.team.searchPlaceholder}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-8 py-2.5 rounded-full border border-border bg-card text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-club transition-colors"
            />
            {search && (
              <button
                onClick={() => setSearch("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              >
                <X size={14} />
              </button>
            )}
          </div>

          {/* Position filter */}
          <div className="flex flex-wrap gap-1.5">
            {POSTES_FR.map((p) => {
              const label = t.positions[p as keyof typeof t.positions] ?? p;
              const isActive = posteFilter === p;
              return (
                <button
                  key={p}
                  onClick={() => setPosteFilter(p)}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-semibold border transition-colors ${
                    isActive
                      ? "bg-club text-white border-club"
                      : "border-border text-muted-foreground hover:text-foreground hover:border-foreground/30"
                  }`}
                >
                  {label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Count */}
        <p className="text-muted-foreground text-xs mb-5">
          {filtered.length}{" "}
          {filtered.length <= 1 ? t.team.playerFound : t.team.playersFound}
          {!hasFilters && ` — ${category}`}
        </p>

        {/* ── Player grid ──────────────────────────────────── */}
        {filtered.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 md:gap-4">
            {filtered.map((player) => (
              <PlayerCard key={player.id} player={player} primaryColor={primaryColor} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16 px-4">
            <p className="text-muted-foreground text-base mb-3">{t.team.noPlayer}</p>
            <button
              onClick={() => { setSearch(""); setPosteFilter("Tous"); }}
              className="text-xs font-semibold hover:underline text-club"
            >
              {t.team.resetFilters}
            </button>
          </div>
        )}
      </div>

      <ClubFooter
        clubId={club.slug}
        club={{
          nom: club.name,
          acronyme: club.acronym ?? club.name,
          logo: club.logo || "/images/jag-logo.png",
          hero: club.hero || "/images/jag-hero.png",
          color: primaryColor,
          colorDark: club.secondary_color || "#8F0000",
          social: club.social,
        }}
      />
    </div>
  );
}
