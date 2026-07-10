"use client";

import { use, useEffect, useState } from "react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import { ClubPageHero } from "@/components/ClubPageHero";
import { ClubFooter } from "@/components/Footer";
import { PageTabs } from "@/components/PageTabs";
import { useClubBrand, clubVars } from "@/lib/club-brand";
import { fetchClubCalendar, type ClubMatch as ClubMatchApi } from "@/lib/api";
import { useLocale } from "@/lib/locale-context";
import { MapPin, ArrowRight } from "lucide-react";

type Match = ClubMatchApi;

const CATS = ["Tous", "Cadets", "Juniors", "Seniors"] as const;
type CatFilter = typeof CATS[number];

function formatDate(dateStr: string, locale: string) {
  const d = new Date(dateStr);
  return d.toLocaleDateString(locale === "fr" ? "fr-FR" : "en-GB", { weekday: "short", day: "numeric", month: "long", year: "numeric" });
}

export default function CalendrierPage({ params }: { params: Promise<{ clubId: string }> }) {
  const { clubId } = use(params);
  const { locale } = useLocale();
  const club = useClubBrand(clubId);
  const [matches, setMatches] = useState<Match[]>([]);
  const [loading, setLoading] = useState(true);
  const [cat, setCat] = useState<CatFilter>("Tous");

  useEffect(() => {
    let active = true;

    fetchClubCalendar(clubId)
      .then((items) => {
        if (active) {
          setMatches(items);
        }
      })
      .catch(() => {
        if (active) {
          setMatches([]);
        }
      })
      .finally(() => {
        if (active) {
          setLoading(false);
        }
      });

    return () => {
      active = false;
    };
  }, [clubId]);

  const orderedMatches = [...matches].sort((a, b) => a.date.localeCompare(b.date));

  const filtered = cat === "Tous" ? orderedMatches : orderedMatches.filter((m) => m.categorie === cat);

  return (
    <div className="min-h-screen bg-background" style={clubVars(club)}>
      <Navbar />

      <ClubPageHero clubId={clubId} club={club} label={locale === "fr" ? "Calendrier" : "Schedule"} />

      <PageTabs
        active={cat}
        onChange={setCat}
        options={CATS.map((c) => ({ value: c, label: c === "Tous" ? (locale === "fr" ? "Tous" : "All") : c }))}
      />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
        {loading && filtered.length === 0 && (
          <p className="text-center text-muted-foreground py-12">Chargement...</p>
        )}

        {filtered.length === 0 ? (
          <p className="text-center text-muted-foreground py-16">{locale === "fr" ? "Aucun match à venir." : "No upcoming matches."}</p>
        ) : (
          <div className="flex flex-col gap-3.5">
            {filtered.map((m) => (
              <div key={m.id} className="bg-card border border-border rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center gap-4 hover:shadow-md transition-shadow">
                {/* Date tile — scoreboard split-flap */}
                <div className="flex items-center gap-3 sm:gap-4 shrink-0">
                  <div className="scoreboard-tile w-14 h-14 rounded-xl flex flex-col items-center justify-center text-center overflow-hidden shrink-0">
                    <span className="text-[10px] font-bold uppercase leading-tight text-club">{new Date(m.date).toLocaleDateString("fr-FR", { month: "short" })}</span>
                    <span className="font-display text-2xl font-black leading-tight tabular-nums">{new Date(m.date).getDate()}</span>
                  </div>
                  <span className="inline-flex px-2.5 py-1 rounded-full text-[10px] font-bold border border-club text-club">
                    {new Date(m.date) >= new Date() ? (locale === "fr" ? "À venir" : "Upcoming") : (locale === "fr" ? "Passé" : "Played")}
                  </span>
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-muted-foreground mb-0.5">{formatDate(m.date, locale)}{m.heure ? ` • ${m.heure}` : ""} &bull; {m.competition}{m.journee ? ` ${m.journee}` : ""} &bull; {m.categorie}</p>
                  <h3 className="font-display font-black text-foreground text-lg leading-tight">
                    {club.acronyme} vs {m.adversaire}
                  </h3>
                  <div className="flex items-center gap-1 mt-1 text-xs text-muted-foreground">
                    <MapPin size={11} />
                    <span>{m.lieu}{m.stade ? ` — ${m.stade}` : ""}</span>
                  </div>
                </div>

                {/* CTA billets si Domicile */}
                {m.lieu === "Domicile" && (
                  <Link href={`/clubs/${clubId}/billets`}
                    className="shrink-0 flex items-center gap-1.5 text-xs font-bold px-4 py-2.5 rounded-full text-white bg-club transition-opacity hover:opacity-90">
                    {locale === "fr" ? "Billets" : "Tickets"} <ArrowRight size={12} />
                  </Link>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      <ClubFooter clubId={clubId} club={club} />
    </div>
  );
}
