"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { MapPin, ArrowRight } from "lucide-react";
import { fetchClubCalendar, type ClubMatch } from "@/lib/api";
import type { ClubBrand } from "@/lib/club-brand";
import { useLocale } from "@/lib/locale-context";

function monogram(name: string): string {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0])
    .join("")
    .toUpperCase();
}

/** Signature banner: the club's next fixture, lit up like a stadium scoreboard.
 *  Renders nothing when there is no upcoming match — this is a highlight, not a placeholder slot. */
export function NextMatchStrip({ clubId, club }: { clubId: string; club: ClubBrand }) {
  const { locale, t } = useLocale();
  const [match, setMatch] = useState<ClubMatch | null>(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    let active = true;
    fetchClubCalendar(clubId)
      .then((items) => {
        if (!active) return;
        const upcoming = items
          .filter((m) => new Date(m.date) >= new Date())
          .sort((a, b) => a.date.localeCompare(b.date))[0];
        setMatch(upcoming ?? null);
      })
      .catch(() => active && setMatch(null))
      .finally(() => active && setLoaded(true));
    return () => {
      active = false;
    };
  }, [clubId]);

  if (!loaded || !match) return null;

  const dateFmt = new Intl.DateTimeFormat(locale === "fr" ? "fr-FR" : "en-GB", {
    weekday: "long",
    day: "numeric",
    month: "long",
  }).format(new Date(match.date));

  return (
    <div className="bg-[#0C0E11] text-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row sm:items-stretch">
        <div className="flex items-center gap-4 py-5 sm:py-6 flex-1 min-w-0">
          <div>
            <p className="eyebrow text-white/60 mb-2" style={{ color: "var(--club)" }}>
              {locale === "fr" ? "Prochain match" : "Next match"}
            </p>
            <div className="flex items-center gap-3">
              <Image src={club.logo} alt={club.nom} width={36} height={36} className="rounded-full object-cover shrink-0" />
              <span className="font-display font-black text-xl sm:text-3xl uppercase tracking-tight leading-none">
                {club.acronyme}
              </span>
              <span className="text-white/40 font-display font-bold text-lg sm:text-2xl">vs</span>
              <span className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center text-xs font-black shrink-0">
                {monogram(match.adversaire)}
              </span>
              <span className="font-display font-black text-xl sm:text-3xl uppercase tracking-tight leading-none truncate">
                {match.adversaire}
              </span>
            </div>
            <p className="flex items-center gap-1.5 text-xs text-white/50 mt-2.5">
              {dateFmt}{match.heure ? ` · ${match.heure}` : ""} &middot; {match.competition}
              <span className="hidden sm:inline-flex items-center gap-1 ml-1">
                <MapPin size={11} />
                {match.lieu}{match.stade ? ` — ${match.stade}` : ""}
              </span>
            </p>
          </div>
        </div>

        <div className="flex items-center shrink-0 -mx-4 sm:mx-0">
          <Link
            href={`/clubs/${clubId}/billets`}
            className="angle-cut-l flex items-center gap-2 h-full w-full sm:w-auto justify-center px-8 sm:px-10 py-4 text-sm font-bold uppercase tracking-wide text-white transition-opacity hover:opacity-90 bg-club"
          >
            {t.nav.billets} <ArrowRight size={14} />
          </Link>
        </div>
      </div>
    </div>
  );
}
