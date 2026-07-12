"use client";

import { useEffect, useMemo, useState, type CSSProperties } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import Navbar from "@/components/Navbar";
import { ClubFooter } from "@/components/Footer";
import { NextMatchStrip } from "@/components/NextMatchStrip";
import { fetchClubBySlug, type ClubApiModel } from "@/lib/api";
import { useLocale } from "@/lib/locale-context";

const CATEGORIES = ["Cadets", "Juniors", "Seniors"] as const;

function formatFoundedDate(value?: string): string {
  if (!value) {
    return "-";
  }

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return date.toLocaleDateString("fr-FR", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
}

export default function ClubPage() {
  const params = useParams<{ clubId: string }>();
  const { t, locale } = useLocale();
  const [club, setClub] = useState<ClubApiModel | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;

    async function run() {
      try {
        setLoading(true);
        setError(null);
        const result = await fetchClubBySlug(params.clubId);

        if (mounted) {
          setClub(result);
        }
      } catch {
        if (mounted) {
          setError("Impossible de charger les informations du club.");
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
  }, [params.clubId]);

  const teamCount = useMemo(() => {
    const map = new Map<string, number>();
    (club?.teams ?? []).forEach((team) => {
      map.set(team.category, (map.get(team.category) ?? 0) + 1);
    });

    return {
      Cadets: map.get("Cadets") ?? 0,
      Juniors: map.get("Juniors") ?? 0,
      Seniors: map.get("Seniors") ?? 0,
    };
  }, [club]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <Navbar />
        <div className="flex-1 flex items-center justify-center px-4">
          <p className="text-muted-foreground text-sm">Chargement du club...</p>
        </div>
      </div>
    );
  }

  if (!club || error) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <Navbar />
        <div className="flex-1 flex items-center justify-center px-4">
          <div className="text-center">
            <p className="text-xl font-black text-foreground mb-2">Club introuvable</p>
            {error && <p className="text-xs text-muted-foreground mb-2">{error}</p>}
            <Link href="/" className="text-sm font-semibold hover:underline text-jag">
              Retour à l&apos;accueil
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const clubVars = { "--club": club.primary_color || "#CC0000" } as CSSProperties;

  return (
    <div className="min-h-screen bg-background" style={clubVars}>
      <Navbar />

      {/* ── Hero banner ──────────────────────────────────── */}
      <section className="relative h-64 sm:h-80 md:h-96 overflow-hidden bg-[#0C0E11]">
        <Image src={club.hero || "/images/jag-hero.png"} alt={club.name} fill className="object-cover opacity-55" priority />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0C0E11] via-[#0C0E11]/45 to-[#0C0E11]/10" />
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-4 gap-4">
          <Image
            src={club.logo || "/images/jag-logo.png"}
            alt={club.name}
            width={84}
            height={84}
            className="rounded-full border-4 shadow-xl object-cover bg-white/10"
            style={{ borderColor: "var(--club)" }}
          />
          <h1 className="font-display text-white font-black text-4xl sm:text-5xl md:text-6xl uppercase text-balance leading-[0.95] tracking-tight">
            {club.name}
          </h1>
          <p className="text-white/55 text-xs uppercase tracking-wide font-bold">
            {t.club.founded} {formatFoundedDate(club.founded_at)} &mdash; {club.city || "-"}
          </p>
        </div>
        <div className="scoreboard-tile absolute inset-x-0 bottom-0 h-[3px]" aria-hidden />
      </section>

      <NextMatchStrip clubId={club.slug} club={{ nom: club.name, acronyme: club.acronym ?? club.name, logo: club.logo || "/images/jag-logo.png", hero: club.hero || "/images/jag-hero.png", color: club.primary_color || "#CC0000", colorDark: club.secondary_color || "#8F0000" }} />

      {/* ── Scoreboard stats strip ──────────────────────────── */}
      <div className="scoreboard-tile grid grid-cols-2 sm:grid-cols-4 max-w-6xl mx-auto overflow-hidden">
        {[
          { label: "Cadets", value: String(teamCount.Cadets) },
          { label: "Juniors", value: String(teamCount.Juniors) },
          { label: "Seniors", value: String(teamCount.Seniors) },
          { label: t.club.ourTeams, value: String((club.teams ?? []).length) },
        ].map((s, i) => (
          <div key={s.label} className={`py-4 sm:py-5 text-center border-white/10 ${i % 2 === 0 ? "border-r" : "sm:border-r"} ${i < 2 ? "border-b sm:border-b-0" : ""} last:border-r-0`}>
            <p className="font-display font-black text-2xl md:text-3xl text-club leading-tight tabular-nums">{s.value}</p>
            <p className="text-white/50 text-[11px] uppercase tracking-wide mt-1">{s.label}</p>
          </div>
        ))}
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-16 md:py-20">

        {/* ── About ────────────────────────────────────────── */}
        <section className="mb-16">
          <p className="eyebrow mb-2">{t.club.about}</p>
          <span className="section-rule mb-4" />
          <p className="text-muted-foreground leading-relaxed text-sm md:text-base max-w-2xl">
            {(locale === "en" ? club.description_en : club.description) || club.description || "Aucune description disponible pour ce club."}
          </p>
        </section>

        {/* ── Teams grid ───────────────────────────────────── */}
        <section>
          <p className="eyebrow mb-2">{t.club.ourTeams}</p>
          <span className="section-rule mb-6" />
          <div className="grid sm:grid-cols-3 gap-4">
            {CATEGORIES.map((cat) => {
              const playersCount = teamCount[cat];
              return (
                <Link
                  key={cat}
                  href={`/clubs/${club.slug}/equipe/${cat.toLowerCase()}`}
                  className="group block bg-card border border-border p-5 hover:border-club/50 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200"
                >
                  <div className="w-11 h-11 flex items-center justify-center mb-4 font-display font-black text-base text-white bg-club">
                    {cat[0]}
                  </div>
                  <h3 className="font-display font-black text-foreground text-lg uppercase mb-1">
                    {t.categories[cat]}
                  </h3>
                  <p className="text-muted-foreground text-sm mb-4 tabular-nums">
                    {playersCount} {t.club.players}
                  </p>
                  <span className="text-xs font-bold uppercase text-club group-hover:underline">
                    {t.club.viewTeam} &rarr;
                  </span>
                </Link>
              );
            })}
          </div>
        </section>
      </div>

      <ClubFooter
        clubId={club.slug}
        club={{
          nom: club.name,
          acronyme: club.acronym ?? club.name,
          logo: club.logo || "/images/jag-logo.png",
          hero: club.hero || "/images/jag-hero.png",
          color: club.primary_color || "#CC0000",
          colorDark: club.secondary_color || "#8F0000",
          social: club.social,
        }}
      />
    </div>
  );
}
