"use client";

import { use, useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import { fetchClubCalendar, type ClubMatch as ClubMatchApi } from "@/lib/api";
import { useLocale } from "@/lib/locale-context";
import { CalendarDays, ChevronLeft, MapPin, ArrowRight } from "lucide-react";

const clubData: Record<string, { nom: string; acronyme: string; logo: string; hero: string; color: string; colorDark: string }> = {
  jag: { nom: "Jaguar Académie Guinée", acronyme: "JAG", logo: "/images/jag-logo.png", hero: "/images/jag-hero.png", color: "#CC0000", colorDark: "#990000" },
  atletico: { nom: "Club Atlético de Colèah", acronyme: "Atlético", logo: "/images/atletico-logo.png", hero: "/images/atletico-hero.png", color: "#F5B800", colorDark: "#C9950A" },
};

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
  const club = clubData[clubId] ?? clubData.jag;
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
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Hero */}
      <div className="relative h-40 sm:h-52 overflow-hidden" style={{ backgroundColor: club.colorDark }}>
        <Image src={club.hero} alt={club.nom} fill className="object-cover opacity-15" />
        <div className="relative max-w-5xl mx-auto px-4 sm:px-6 h-full flex flex-col justify-end pb-6">
          <Link href={`/clubs/${clubId}`} className="flex items-center gap-1.5 text-white/60 hover:text-white text-xs mb-3 transition-colors w-fit">
            <ChevronLeft size={14} />{club.acronyme}
          </Link>
          <div className="flex items-center gap-3">
            <Image src={club.logo} alt={club.nom} width={44} height={44} className="rounded-full border-2 border-white/30 object-cover" />
            <div>
              <p className="text-white/60 text-xs uppercase tracking-widest font-semibold">{locale === "fr" ? "Calendrier" : "Schedule"}</p>
              <h1 className="text-white font-black text-xl sm:text-2xl leading-tight">{club.nom}</h1>
            </div>
          </div>
        </div>
      </div>

      {/* Category tabs */}
      <div className="border-b border-border bg-card">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 flex gap-1 py-2 overflow-x-auto">
          {CATS.map((c) => (
            <button key={c} onClick={() => setCat(c)}
              className={`px-4 py-1.5 rounded-sm text-sm font-semibold whitespace-nowrap transition-colors ${
                cat === c ? "text-white" : "text-muted-foreground hover:text-foreground"
              }`}
              style={cat === c ? { backgroundColor: club.color } : {}}>
              {c === "Tous" ? (locale === "fr" ? "Tous" : "All") : c}
            </button>
          ))}
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
        {loading && filtered.length === 0 && (
          <p className="text-center text-muted-foreground py-12">Chargement...</p>
        )}

        {filtered.length === 0 ? (
          <p className="text-center text-muted-foreground py-16">{locale === "fr" ? "Aucun match à venir." : "No upcoming matches."}</p>
        ) : (
          <div className="flex flex-col gap-4">
            {filtered.map((m) => (
              <div key={m.id} className="bg-card border border-border rounded-sm p-5 flex flex-col sm:flex-row sm:items-center gap-4">
                {/* Date block */}
                <div className="flex items-center gap-3 sm:gap-4 shrink-0">
                  <div className="w-14 h-14 rounded-sm flex flex-col items-center justify-center text-white text-center" style={{ backgroundColor: club.color }}>
                    <span className="text-xs font-semibold leading-tight">{new Date(m.date).toLocaleDateString("fr-FR", { month: "short" }).toUpperCase()}</span>
                    <span className="text-2xl font-black leading-tight">{new Date(m.date).getDate()}</span>
                  </div>
                  <span className="inline-flex px-2 py-0.5 rounded-sm text-[10px] font-bold border" style={{ color: club.color, borderColor: club.color }}>
                    {new Date(m.date) >= new Date() ? (locale === "fr" ? "À venir" : "Upcoming") : (locale === "fr" ? "Passé" : "Played")}
                  </span>
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-muted-foreground mb-0.5">{formatDate(m.date, locale)}{m.heure ? ` • ${m.heure}` : ""} &bull; {m.competition}{m.journee ? ` ${m.journee}` : ""} &bull; {m.categorie}</p>
                  <h3 className="font-black text-foreground text-lg leading-tight">
                    {locale === "fr" ? `${club.acronyme} vs ${m.adversaire}` : `${club.acronyme} vs ${m.adversaire}`}
                  </h3>
                  <div className="flex items-center gap-1 mt-1 text-xs text-muted-foreground">
                    <MapPin size={11} />
                    <span>{m.lieu}{m.stade ? ` — ${m.stade}` : ""}</span>
                  </div>
                </div>

                {/* CTA billets si Domicile */}
                {m.lieu === "Domicile" && (
                  <Link href={`/clubs/${clubId}/billets`}
                    className="shrink-0 flex items-center gap-1.5 text-xs font-bold px-4 py-2 rounded-sm text-white transition-opacity hover:opacity-85"
                    style={{ backgroundColor: club.color }}>
                    {locale === "fr" ? "Billets" : "Tickets"} <ArrowRight size={12} />
                  </Link>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      <footer className="border-t border-border bg-muted/30 py-6 text-center text-muted-foreground text-sm">
        <p className="font-semibold text-foreground">{club.nom}</p>
      </footer>
    </div>
  );
}
