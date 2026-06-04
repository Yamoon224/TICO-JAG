"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import Navbar from "@/components/Navbar";
import { fetchClubBySlug, type ClubApiModel } from "@/lib/api";
import { useLocale } from "@/lib/locale-context";
import { Facebook, Youtube } from "lucide-react";

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
  const { t } = useLocale();
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
            <Link href="/" className="text-sm font-semibold hover:underline" style={{ color: "#CC0000" }}>
              Retour à l&apos;accueil
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* ── Hero banner ──────────────────────────────────── */}
      <section className="relative h-56 sm:h-72 md:h-88 overflow-hidden">
        <Image src={club.hero || "/images/jag-hero.png"} alt={club.name} fill className="object-cover" priority />
        <div className="absolute inset-0 bg-black/55" />
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-4 gap-3">
          <Image
            src={club.logo || "/images/jag-logo.png"}
            alt={club.name}
            width={72}
            height={72}
            className="rounded-full border-4 border-white shadow-xl object-cover"
          />
          <h1 className="text-white font-black text-2xl sm:text-4xl md:text-5xl text-balance leading-tight">
            {club.name}
          </h1>
          <p className="text-white/60 text-sm">
            {t.club.founded} {formatFoundedDate(club.founded_at)} &mdash; {club.city || "-"}
          </p>
        </div>
      </section>

      {/* ── Stats bar ────────────────────────────────────── */}
      <div className="grid grid-cols-2 sm:grid-cols-4" style={{ backgroundColor: club.primary_color || "#CC0000" }}>
        {[
          { label: "Cadets", value: String(teamCount.Cadets) },
          { label: "Juniors", value: String(teamCount.Juniors) },
          { label: "Seniors", value: String(teamCount.Seniors) },
          { label: t.club.ourTeams, value: String((club.teams ?? []).length) },
        ].map((s) => (
          <div key={s.label} className="py-4 text-center border-r border-white/20 last:border-0">
            <p className="font-black text-xl md:text-2xl text-white leading-tight">{s.value}</p>
            <p className="text-white/70 text-xs uppercase tracking-wide mt-0.5">{s.label}</p>
          </div>
        ))}
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-12 md:py-16">

        {/* ── About ────────────────────────────────────────── */}
        <section className="mb-12">
          <h2 className="text-lg md:text-xl font-black text-foreground mb-3 tracking-tight">
            {t.club.about}
          </h2>
          <p className="text-muted-foreground leading-relaxed text-sm md:text-base">
            {club.description || "Aucune description disponible pour ce club."}
          </p>
        </section>

        {/* ── Teams grid ───────────────────────────────────── */}
        <section>
          <h2 className="text-lg md:text-xl font-black text-foreground mb-5 tracking-tight">
            {t.club.ourTeams}
          </h2>
          <div className="grid sm:grid-cols-3 gap-4">
            {CATEGORIES.map((cat) => {
              const playersCount = teamCount[cat];
              return (
                <Link
                  key={cat}
                  href={`/clubs/${club.slug}/equipe/${cat.toLowerCase()}`}
                  className="group block bg-card border border-border rounded-sm p-5 hover:shadow-md transition-shadow"
                >
                  <div
                    className="w-10 h-10 rounded-sm flex items-center justify-center mb-4 font-black text-base text-white"
                    style={{ backgroundColor: club.primary_color || "#CC0000" }}
                  >
                    {cat[0]}
                  </div>
                  <h3 className="font-black text-foreground text-base mb-1">
                    {t.categories[cat]}
                  </h3>
                  <p className="text-muted-foreground text-sm mb-4">
                    {playersCount} {t.club.players}
                  </p>
                  <span
                    className="text-xs font-semibold group-hover:underline"
                    style={{ color: club.primary_color || "#CC0000" }}
                  >
                    {t.club.viewTeam} &rarr;
                  </span>
                </Link>
              );
            })}
          </div>
        </section>
      </div>

      {/* ── Footer ───────────────────────────────────────── */}
      <footer className="border-t border-border bg-muted/30 py-8 text-center text-muted-foreground text-sm">
        <p className="font-semibold text-foreground mb-1">{club.name}</p>
        <p>{club.city || "-"} &mdash; {t.club.founded} {formatFoundedDate(club.founded_at)}</p>
        {club.social && (
          <div className="flex items-center justify-center gap-4 mt-4">
            {club.social.facebook && (
              <a
                href={club.social.facebook}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 text-xs font-semibold hover:text-foreground transition-colors"
                style={{ color: club.primary_color || "#CC0000" }}
              >
                <Facebook size={16} /> Facebook
              </a>
            )}
            {club.social.youtube && (
              <a
                href={club.social.youtube}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 text-xs font-semibold hover:text-foreground transition-colors"
                style={{ color: club.primary_color || "#CC0000" }}
              >
                <Youtube size={16} /> YouTube
              </a>
            )}
          </div>
        )}
      </footer>
    </div>
  );
}
