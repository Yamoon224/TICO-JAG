"use client";

import { use, useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import { ClubPageHero } from "@/components/ClubPageHero";
import { ClubFooter } from "@/components/Footer";
import { PageTabs } from "@/components/PageTabs";
import { useClubBrand, clubVars } from "@/lib/club-brand";
import { fetchClubResults, type ClubMatch as ClubMatchApi } from "@/lib/api";
import { useLocale } from "@/lib/locale-context";
import { MapPin } from "lucide-react";

type Resultat = ClubMatchApi;

const CATS = ["Tous", "Cadets", "Juniors", "Seniors"] as const;
type CatFilter = typeof CATS[number];

function getResult(sc: number, sa: number): "V" | "N" | "D" {
  return sc > sa ? "V" : sc === sa ? "N" : "D";
}
const resultColors = { V: "#1E9155", N: "#C9950A", D: "#D6301F" } as const;
const resultLabels = { fr: { V: "Victoire", N: "Nul", D: "Défaite" }, en: { V: "Win", N: "Draw", D: "Loss" } } as const;

function formatDate(dateStr: string, locale: string) {
  return new Date(dateStr).toLocaleDateString(locale === "fr" ? "fr-FR" : "en-GB", { day: "numeric", month: "long", year: "numeric" });
}

export default function ResultatsPage({ params }: { params: Promise<{ clubId: string }> }) {
  const { clubId } = use(params);
  const { locale } = useLocale();
  const club = useClubBrand(clubId);
  const [resultats, setResultats] = useState<Resultat[]>([]);
  const [loading, setLoading] = useState(true);
  const [cat, setCat] = useState<CatFilter>("Tous");

  useEffect(() => {
    let active = true;

    fetchClubResults(clubId)
      .then((items) => {
        if (active) {
          setResultats(items);
        }
      })
      .catch(() => {
        if (active) {
          setResultats([]);
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

  const orderedResults = [...resultats].sort((a, b) => b.date.localeCompare(a.date));

  const filtered = cat === "Tous" ? orderedResults : orderedResults.filter((r) => r.categorie === cat);

  return (
    <div className="min-h-screen bg-background" style={clubVars(club)}>
      <Navbar />

      <ClubPageHero clubId={clubId} club={club} label={locale === "fr" ? "Résultats" : "Results"} />

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
          <p className="text-center text-muted-foreground py-16">{locale === "fr" ? "Aucun résultat." : "No results yet."}</p>
        ) : (
          <div className="flex flex-col gap-3.5">
            {filtered.map((r) => {
              const scoreClub = r.scoreClub ?? 0;
              const scoreAdv = r.scoreAdv ?? 0;
              const res = getResult(scoreClub, scoreAdv);
              return (
                <div key={r.id} className="bg-card border border-border rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center gap-4 hover:shadow-md transition-shadow">
                  {/* Score — scoreboard tile */}
                  <div className="scoreboard-tile flex items-center gap-3 shrink-0 rounded-xl px-4 py-3 overflow-hidden">
                    <span className="font-display font-black text-3xl tabular-nums">{scoreClub}</span>
                    <span className="opacity-40 font-bold">—</span>
                    <span className="font-display font-black text-3xl tabular-nums">{scoreAdv}</span>
                    <span
                      className="ml-2 text-[10px] font-black px-2 py-1 rounded-md uppercase tracking-wide text-white"
                      style={{ backgroundColor: resultColors[res] }}
                    >
                      {resultLabels[locale as "fr" | "en"][res]}
                    </span>
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-muted-foreground mb-0.5">{formatDate(r.date, locale)} &bull; {r.competition} &bull; {r.categorie}</p>
                    <h3 className="font-display font-black text-foreground text-base leading-tight">
                      {club.acronyme} vs {r.adversaire}
                    </h3>
                    <div className="flex items-center gap-1 mt-1 text-xs text-muted-foreground">
                      <MapPin size={11} /><span>{r.lieu}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <ClubFooter clubId={clubId} club={club} />
    </div>
  );
}
