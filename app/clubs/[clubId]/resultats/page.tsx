"use client";

import { use, useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import { ClubPageHero } from "@/components/ClubPageHero";
import { useClubBrand } from "@/lib/club-brand";
import { fetchClubResults, type ClubMatch as ClubMatchApi } from "@/lib/api";
import { useLocale } from "@/lib/locale-context";
import { MapPin } from "lucide-react";

type Resultat = ClubMatchApi;

const CATS = ["Tous", "Cadets", "Juniors", "Seniors"] as const;
type CatFilter = typeof CATS[number];

function getResult(sc: number, sa: number): "V" | "N" | "D" {
  return sc > sa ? "V" : sc === sa ? "N" : "D";
}
const resultColors = { V: "#16a34a", N: "#ca8a04", D: "#dc2626" } as const;
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
    <div className="min-h-screen bg-background">
      <Navbar />

      <ClubPageHero clubId={clubId} club={club} label={locale === "fr" ? "Résultats" : "Results"} />

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
          <p className="text-center text-muted-foreground py-16">{locale === "fr" ? "Aucun résultat." : "No results yet."}</p>
        ) : (
          <div className="flex flex-col gap-4">
            {filtered.map((r) => {
              const scoreClub = r.scoreClub ?? 0;
              const scoreAdv = r.scoreAdv ?? 0;
              const res = getResult(scoreClub, scoreAdv);
              return (
                <div key={r.id} className="bg-card border border-border rounded-sm p-5 flex flex-col sm:flex-row sm:items-center gap-4">
                  {/* Result badge */}
                  <div className="flex items-center gap-3 shrink-0">
                    <div className="w-10 h-10 rounded-sm flex items-center justify-center text-white text-sm font-black" style={{ backgroundColor: resultColors[res] }}>
                      {res}
                    </div>
                    <span className="text-xs font-semibold" style={{ color: resultColors[res] }}>
                      {resultLabels[locale as "fr" | "en"][res]}
                    </span>
                  </div>

                  {/* Score */}
                  <div className="flex items-center gap-3 shrink-0">
                    <span className="font-display font-black text-3xl text-foreground tabular-nums">{scoreClub}</span>
                    <span className="text-muted-foreground font-bold">—</span>
                    <span className="font-display font-black text-3xl text-foreground tabular-nums">{scoreAdv}</span>
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

      <footer className="border-t border-border bg-muted/30 py-6 text-center text-muted-foreground text-sm">
        <p className="font-semibold text-foreground">{club.nom}</p>
      </footer>
    </div>
  );
}
