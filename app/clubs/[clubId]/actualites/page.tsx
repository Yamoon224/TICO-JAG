"use client";

import { use, useEffect, useState } from "react";
import Image from "next/image";
import Navbar from "@/components/Navbar";
import { ClubPageHero } from "@/components/ClubPageHero";
import { ClubFooter } from "@/components/Footer";
import { useClubBrand, clubVars } from "@/lib/club-brand";
import { fetchClubArticles, type NewsArticle } from "@/lib/api";
import { useLocale } from "@/lib/locale-context";
import { CalendarDays } from "lucide-react";

function formatDate(dateStr: string, locale: string) {
  return new Date(dateStr).toLocaleDateString(locale === "fr" ? "fr-FR" : "en-GB", { day: "numeric", month: "long", year: "numeric" });
}

export default function ActualitesPage({ params }: { params: Promise<{ clubId: string }> }) {
  const { clubId } = use(params);
  const { locale } = useLocale();
  const club = useClubBrand(clubId);
  const [articles, setArticles] = useState<NewsArticle[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;

    fetchClubArticles(clubId)
      .then((items) => {
        if (active) {
          setArticles(items);
        }
      })
      .catch(() => {
        if (active) {
          setArticles([]);
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

  const orderedArticles = [...articles].sort((a, b) => b.datePublication.localeCompare(a.datePublication));

  return (
    <div className="min-h-screen bg-background" style={clubVars(club)}>
      <Navbar />

      <ClubPageHero clubId={clubId} club={club} label={locale === "fr" ? "Actualités" : "News"} />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10 md:py-12">
        {loading && orderedArticles.length === 0 && (
          <p className="text-center text-muted-foreground py-12">Chargement...</p>
        )}

        {!loading && orderedArticles.length === 0 && (
          <p className="text-center text-muted-foreground py-12">
            {locale === "fr" ? "Aucune actualité disponible." : "No news available."}
          </p>
        )}

        <div className="grid sm:grid-cols-2 gap-px bg-border">
          {orderedArticles.map((a, i) => (
            <article key={a.id} className={`group bg-card overflow-hidden ${
              i === 0 ? "sm:col-span-2" : ""
            }`}>
              {a.image && (
                <div className={`relative bg-muted overflow-hidden ${
                  i === 0 ? "h-64 sm:h-[26rem]" : "h-48"
                }`}>
                  <Image src={a.image} alt={a.titre} fill className="object-cover group-hover:scale-105 transition-transform duration-500" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
                  <span className="absolute top-3 left-3 text-white text-[10px] font-black uppercase tracking-wide px-2.5 py-1 bg-club">
                    {a.categorie}
                  </span>
                  <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-6">
                    <div className="flex items-center gap-1.5 text-[11px] text-white/60 mb-1.5">
                      <CalendarDays size={11} />
                      <span>{formatDate(a.datePublication, locale)}</span>
                    </div>
                    <h2 className={`font-display font-black text-white uppercase leading-[0.98] ${
                      i === 0 ? "text-2xl sm:text-4xl max-w-2xl" : "text-lg"
                    }`}>{a.titre}</h2>
                  </div>
                </div>
              )}
              <div className="p-4 sm:p-6">
                <p className={`text-sm text-muted-foreground leading-relaxed ${i === 0 ? "line-clamp-2 max-w-2xl" : "line-clamp-3"}`}>{a.contenu}</p>
              </div>
            </article>
          ))}
        </div>
      </div>

      <ClubFooter clubId={clubId} club={club} />
    </div>
  );
}
