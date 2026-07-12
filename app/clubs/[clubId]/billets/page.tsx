"use client";

import { use, useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import { ClubPageHero } from "@/components/ClubPageHero";
import { ClubFooter } from "@/components/Footer";
import { useClubBrand, clubVars } from "@/lib/club-brand";
import { useLocale } from "@/lib/locale-context";
import { MapPin, CalendarDays, Ticket } from "lucide-react";
import { fetchClubBillets, type MatchBillets } from "@/lib/api";

const typeIcons: Record<string, string> = { Tribune: "🏟️", Pelouse: "🌿", VIP: "⭐", Loge: "💎" };

function formatDate(dateStr: string, locale: string) {
  return new Date(dateStr).toLocaleDateString(locale === "fr" ? "fr-FR" : "en-GB", { weekday: "long", day: "numeric", month: "long", year: "numeric" });
}

function stockPercent(dispo: number, total: number) {
  return Math.round((dispo / total) * 100);
}

export default function BilletsPage({ params }: { params: Promise<{ clubId: string }> }) {
  const { clubId } = use(params);
  const { locale } = useLocale();
  const club = useClubBrand(clubId);
  const [matches, setMatches] = useState<MatchBillets[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    fetchClubBillets(clubId)
      .then((data) => {
        if (!cancelled) setMatches(data);
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

      <ClubPageHero clubId={clubId} club={club} label={locale === "fr" ? "Billets" : "Tickets"} />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
        {loading ? (
          <p className="text-center text-muted-foreground py-16">{locale === "fr" ? "Chargement..." : "Loading..."}</p>
        ) : matches.length === 0 ? (
          <p className="text-center text-muted-foreground py-16">{locale === "fr" ? "Aucun billet disponible." : "No tickets available."}</p>
        ) : (
          <div className="flex flex-col gap-8">
            {matches.map((m) => (
              <div key={m.matchId}>
                {/* Match info — punched ticket header */}
                <div className="ticket-stub bg-card border border-border px-5 py-4 flex flex-col sm:flex-row sm:items-center gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap gap-3 text-xs text-muted-foreground mb-1">
                      <span className="flex items-center gap-1"><CalendarDays size={11} />{formatDate(m.date, locale)}</span>
                      <span className="flex items-center gap-1"><MapPin size={11} />{m.stade}</span>
                    </div>
                    <h2 className="font-display font-black text-foreground text-xl uppercase leading-tight">
                      {club.acronyme} <span className="text-muted-foreground font-normal text-sm mx-1 normal-case">vs</span> {m.adversaire}
                    </h2>
                    <p className="text-xs text-muted-foreground mt-0.5">{m.competition} &bull; {m.categorie}</p>
                  </div>
                  <span className="inline-flex items-center gap-1 px-3 py-1 text-xs font-bold border" style={{ color: club.color, borderColor: club.color }}>
                    <Ticket size={11} /> {locale === "fr" ? "Match à domicile" : "Home game"}
                  </span>
                </div>

                {/* Ticket types */}
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-px bg-border border border-border border-t-0">
                  {m.billets.map((b) => {
                    const pct = stockPercent(b.disponible, b.total);
                    const stockColor = pct > 50 ? "#16a34a" : pct > 20 ? "#ca8a04" : "#dc2626";
                    return (
                      <div key={b.type} className="bg-card px-5 py-4">
                        <div className="flex items-center gap-2 mb-3">
                          <span className="text-xl">{typeIcons[b.type] ?? "🎟️"}</span>
                          <h3 className="font-black text-foreground">{b.type}</h3>
                        </div>
                        <p className="font-display font-black text-2xl text-foreground mb-1">{b.prix}</p>
                        {/* Stock bar */}
                        <div className="mb-3">
                          <div className="flex justify-between text-xs text-muted-foreground mb-1">
                            <span>{b.disponible} {locale === "fr" ? "places" : "seats"}</span>
                            <span style={{ color: stockColor }}>{pct}%</span>
                          </div>
                          <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                            <div className="h-full rounded-full transition-all" style={{ width: `${pct}%`, backgroundColor: stockColor }} />
                          </div>
                        </div>
                        <button
                          className="w-full text-white text-sm font-bold py-2 rounded-sm transition-opacity hover:opacity-85"
                          style={{ backgroundColor: club.color }}
                        >
                          {locale === "fr" ? "Réserver" : "Book now"}
                        </button>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <ClubFooter clubId={clubId} club={club} />
    </div>
  );
}
