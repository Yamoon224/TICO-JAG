"use client";

import { use, useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import { fetchClubArticles, type NewsArticle } from "@/lib/api";
import { useLocale } from "@/lib/locale-context";
import { ChevronLeft, CalendarDays } from "lucide-react";

const clubData: Record<string, { nom: string; acronyme: string; logo: string; hero: string; color: string; colorDark: string }> = {
  jag: { nom: "Jaguar Académie Guinée", acronyme: "JAG", logo: "/images/jag-logo.png", hero: "/images/jag-hero.png", color: "#CC0000", colorDark: "#990000" },
  atletico: { nom: "Club Atlético de Colèah", acronyme: "Atlético", logo: "/images/atletico-logo.png", hero: "/images/atletico-hero.png", color: "#F5B800", colorDark: "#C9950A" },
};

function formatDate(dateStr: string, locale: string) {
  return new Date(dateStr).toLocaleDateString(locale === "fr" ? "fr-FR" : "en-GB", { day: "numeric", month: "long", year: "numeric" });
}

export default function ActualitesPage({ params }: { params: Promise<{ clubId: string }> }) {
  const { clubId } = use(params);
  const { locale } = useLocale();
  const club = clubData[clubId] ?? clubData.jag;
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
              <p className="text-white/60 text-xs uppercase tracking-widest font-semibold">{locale === "fr" ? "Actualités" : "News"}</p>
              <h1 className="text-white font-black text-xl sm:text-2xl leading-tight">{club.nom}</h1>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
        {loading && orderedArticles.length === 0 && (
          <p className="text-center text-muted-foreground py-12">Chargement...</p>
        )}

        {!loading && orderedArticles.length === 0 && (
          <p className="text-center text-muted-foreground py-12">
            {locale === "fr" ? "Aucune actualité disponible." : "No news available."}
          </p>
        )}

        <div className="grid sm:grid-cols-2 gap-5">
          {orderedArticles.map((a, i) => (
            <article key={a.id} className={`bg-card border border-border rounded-sm overflow-hidden hover:shadow-md transition-shadow ${
              i === 0 ? "sm:col-span-2" : ""
            }`}>
              {a.image && (
                <div className={`relative bg-muted overflow-hidden ${
                  i === 0 ? "h-52 sm:h-72" : "h-40"
                }`}>
                  <Image src={a.image} alt={a.titre} fill className="object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  <span
                    className="absolute top-3 left-3 text-white text-[10px] font-black px-2 py-0.5 rounded-sm"
                    style={{ backgroundColor: club.color }}
                  >{a.categorie}</span>
                </div>
              )}
              <div className="p-4 sm:p-5">
                <div className="flex items-center gap-1.5 text-xs text-muted-foreground mb-2">
                  <CalendarDays size={11} />
                  <span>{formatDate(a.datePublication, locale)}</span>
                </div>
                <h2 className={`font-black text-foreground leading-tight mb-2 ${
                  i === 0 ? "text-xl sm:text-2xl" : "text-base"
                }`}>{a.titre}</h2>
                <p className="text-sm text-muted-foreground leading-relaxed line-clamp-3">{a.contenu}</p>
              </div>
            </article>
          ))}
        </div>
      </div>

      <footer className="border-t border-border bg-muted/30 py-6 text-center text-muted-foreground text-sm">
        <p className="font-semibold text-foreground">{club.nom}</p>
      </footer>
    </div>
  );
}
