"use client";

import { use, useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import { ClubPageHero } from "@/components/ClubPageHero";
import { ClubFooter } from "@/components/Footer";
import { PageTabs } from "@/components/PageTabs";
import { MatchCard } from "@/components/MatchCard";
import { useClubBrand, clubVars } from "@/lib/club-brand";
import { fetchClubResults, type ClubMatch as ClubMatchApi } from "@/lib/api";
import { useLocale } from "@/lib/locale-context";

type Resultat = ClubMatchApi;

const CATS = ["Tous", "Cadets", "Juniors", "Seniors"] as const;
type CatFilter = typeof CATS[number];

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
          <div className="flex flex-col gap-3">
            {filtered.map((r) => (
              <MatchCard key={r.id} match={{ ...r, status: "completed" }} club={club} clubId={clubId} locale={locale} />
            ))}
          </div>
        )}
      </div>

      <ClubFooter clubId={clubId} club={club} />
    </div>
  );
}
