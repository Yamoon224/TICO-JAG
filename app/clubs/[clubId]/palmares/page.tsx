"use client";

import { use, useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import { ClubPageHero } from "@/components/ClubPageHero";
import { ClubFooter } from "@/components/Footer";
import { useClubBrand, clubVars } from "@/lib/club-brand";
import { useLocale } from "@/lib/locale-context";
import { Trophy, Medal, Star } from "lucide-react";
import { fetchClubPalmares, type Palmares } from "@/lib/api";

function getRangIcon(rang: string) {
  if (rang === "1er") return <Trophy size={22} className="text-amber-500" />;
  if (rang === "2ème") return <Medal size={22} className="text-slate-400" />;
  return <Star size={22} className="text-blue-400" />;
}
function getRangColor(rang: string) {
  if (rang === "1er") return "#D9970A";
  if (rang === "2ème") return "#8B93A0";
  return "#4C86E0";
}

export default function PalmaresPage({ params }: { params: Promise<{ clubId: string }> }) {
  const { clubId } = use(params);
  const { locale } = useLocale();
  const club = useClubBrand(clubId);
  const [palmares, setPalmares] = useState<Palmares[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    fetchClubPalmares(clubId)
      .then((data) => {
        if (!cancelled) setPalmares([...data].sort((a, b) => b.annee - a.annee));
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [clubId]);

  return (
    <div className="min-h-screen bg-background" style={clubVars(club)}>
      <Navbar />

      <ClubPageHero clubId={clubId} club={club} label={locale === "fr" ? "Palmarès" : "Honours"} />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
        {loading ? (
          <p className="text-center text-muted-foreground py-16">{locale === "fr" ? "Chargement..." : "Loading..."}</p>
        ) : palmares.length === 0 ? (
          <p className="text-center text-muted-foreground py-16">{locale === "fr" ? "Palmarès à venir." : "No honours yet."}</p>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {palmares.map((p) => (
              <div key={p.id} className="bg-card border border-border rounded-2xl p-5 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200">
                <div className="flex items-start gap-3 mb-3">
                  <div
                    className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0"
                    style={{ backgroundColor: `${getRangColor(p.rang)}18`, border: `1.5px solid ${getRangColor(p.rang)}40` }}
                  >
                    {getRangIcon(p.rang)}
                  </div>
                  <div className="min-w-0">
                    <p className="font-display font-black text-xl tabular-nums" style={{ color: getRangColor(p.rang) }}>{p.annee}</p>
                    <p className="text-xs font-bold uppercase tracking-wide" style={{ color: getRangColor(p.rang) }}>{p.rang}</p>
                  </div>
                </div>
                <h3 className="font-display font-black text-foreground text-sm leading-tight mb-1.5">{p.competition}</h3>
                {p.description && (
                  <p className="text-xs text-muted-foreground leading-relaxed">{p.description}</p>
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
