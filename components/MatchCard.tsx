import Link from "next/link";
import { MapPin, ArrowRight } from "lucide-react";
import type { ClubMatch } from "@/lib/api";
import type { ClubBrand } from "@/lib/club-brand";

const RESULT_COLOR = { V: "#1E9155", N: "#C9950A", D: "#D6301F" } as const;
const RESULT_LABEL = { fr: { V: "Victoire", N: "Nul", D: "Défaite" }, en: { V: "Win", N: "Draw", D: "Loss" } } as const;

function getResult(sc: number, sa: number): "V" | "N" | "D" {
  return sc > sa ? "V" : sc === sa ? "N" : "D";
}

function monogram(name: string): string {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0])
    .join("")
    .toUpperCase();
}

export function MatchCard({
  match,
  club,
  clubId,
  locale,
}: {
  match: ClubMatch;
  club: ClubBrand;
  clubId: string;
  locale: "fr" | "en";
}) {
  const isPast = match.status ? match.status === "completed" : new Date(match.date) < new Date();
  const hasScore = match.scoreClub != null && match.scoreAdv != null;
  const dateFmt = new Intl.DateTimeFormat(locale === "fr" ? "fr-FR" : "en-GB", {
    weekday: "short",
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date(match.date));

  return (
    <div className="bg-card border border-border flex flex-col sm:flex-row sm:items-stretch gap-0 hover:border-club/50 transition-colors">
      {/* Date tile — scoreboard split-flap */}
      <div className="scoreboard-tile flex sm:flex-col items-center justify-center gap-2 sm:gap-0 text-center px-4 py-3 sm:w-24 sm:py-4 shrink-0">
        <span className="text-[10px] font-bold uppercase leading-tight text-club tracking-wide">
          {new Date(match.date).toLocaleDateString("fr-FR", { month: "short" })}
        </span>
        <span className="font-display text-3xl font-black leading-none tabular-nums">{new Date(match.date).getDate()}</span>
        {match.heure && <span className="text-[10px] text-white/50 sm:mt-0.5">{match.heure}</span>}
      </div>

      {/* Matchup */}
      <div className="flex-1 min-w-0 flex items-center gap-4 px-4 sm:px-6 py-4">
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          <span className="font-display font-black text-sm sm:text-base uppercase text-foreground">{club.acronyme}</span>
        </div>

        <div className="flex flex-col items-center gap-1 shrink-0 min-w-[3.5rem]">
          {hasScore ? (
            <>
              <span className="font-display font-black text-xl sm:text-2xl tabular-nums text-foreground leading-none">
                {match.scoreClub}&ndash;{match.scoreAdv}
              </span>
              <span
                className="text-[9px] font-black uppercase tracking-wide px-1.5 py-0.5 text-white leading-none"
                style={{ backgroundColor: RESULT_COLOR[getResult(match.scoreClub!, match.scoreAdv!)] }}
              >
                {RESULT_LABEL[locale][getResult(match.scoreClub!, match.scoreAdv!)]}
              </span>
            </>
          ) : (
            <span className="text-[11px] font-bold text-muted-foreground tracking-wide">VS</span>
          )}
        </div>

        <div className="flex items-center gap-2 sm:gap-3 min-w-0">
          <span className="hidden sm:flex w-7 h-7 rounded-full bg-muted text-muted-foreground items-center justify-center text-[10px] font-black shrink-0">
            {monogram(match.adversaire)}
          </span>
          <span className="font-display font-black text-sm sm:text-base uppercase text-foreground truncate">{match.adversaire}</span>
        </div>
      </div>

      {/* Meta + CTA */}
      <div className="flex sm:flex-col items-center sm:items-end justify-between gap-2 px-4 sm:px-5 py-3 sm:py-4 border-t sm:border-t-0 sm:border-l border-border sm:w-56 shrink-0">
        <div className="text-left sm:text-right">
          <p className="text-xs text-muted-foreground leading-tight">{dateFmt}</p>
          <p className="text-xs text-muted-foreground leading-tight mt-0.5">
            {match.competition}{match.journee ? ` · ${match.journee}` : ""}
          </p>
          <p className="flex items-center gap-1 text-[11px] text-muted-foreground/80 mt-1 sm:justify-end">
            <MapPin size={10} />
            {match.lieu}{match.stade ? ` — ${match.stade}` : ""}
          </p>
        </div>

        {!isPast && match.lieu === "Domicile" && (
          <Link
            href={`/clubs/${clubId}/billets`}
            className="shrink-0 flex items-center gap-1.5 text-xs font-bold uppercase tracking-wide px-3.5 py-2 text-white bg-club transition-opacity hover:opacity-90"
          >
            {locale === "fr" ? "Billets" : "Tickets"} <ArrowRight size={12} />
          </Link>
        )}
      </div>
    </div>
  );
}
