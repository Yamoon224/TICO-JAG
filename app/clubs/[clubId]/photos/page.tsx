"use client";

import { use, useEffect, useState } from "react";
import Image from "next/image";
import Navbar from "@/components/Navbar";
import { ClubPageHero } from "@/components/ClubPageHero";
import { ClubFooter } from "@/components/Footer";
import { useClubBrand, clubVars } from "@/lib/club-brand";
import { fetchClubGallery, type ClubGalleryPhoto } from "@/lib/api";
import { useLocale } from "@/lib/locale-context";
import { ChevronLeft, ChevronRight, X } from "lucide-react";

const PAGE_SIZE = 9;

export default function PhotosPage({ params }: { params: Promise<{ clubId: string }> }) {
  const { clubId } = use(params);
  const { locale } = useLocale();
  const club = useClubBrand(clubId);
  const [photos, setPhotos] = useState<ClubGalleryPhoto[]>([]);
  const [loading, setLoading] = useState(true);
  const [lightboxIdx, setLightboxIdx] = useState<number | null>(null);
  const [page, setPage] = useState(1);

  useEffect(() => {
    let active = true;

    setLoading(true);
    setPage(1);

    fetchClubGallery(clubId)
      .then((items) => {
        if (active) {
          setPhotos(items);
        }
      })
      .catch(() => {
        if (active) {
          setPhotos([]);
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

  const totalPages = Math.max(1, Math.ceil(photos.length / PAGE_SIZE));
  const paginatedPhotos = photos.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);
  const lightbox = lightboxIdx !== null ? paginatedPhotos[lightboxIdx] : null;

  return (
    <div className="min-h-screen bg-background" style={clubVars(club)}>
      <Navbar />

      <ClubPageHero clubId={clubId} club={club} label={locale === "fr" ? "Galerie photos" : "Photo gallery"} dim={false} />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
        {loading ? (
          <p className="text-center text-muted-foreground py-16">Chargement...</p>
        ) : photos.length === 0 ? (
          <p className="text-center text-muted-foreground py-16">{locale === "fr" ? "Aucune photo disponible." : "No photos available."}</p>
        ) : (
          <>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4">
              {paginatedPhotos.map((p, i) => (
                <button
                  key={p.id}
                  onClick={() => setLightboxIdx(i)}
                  className="group relative aspect-video bg-muted rounded-xl overflow-hidden focus:outline-none focus:ring-2 focus:ring-club"
                >
                  <Image src={p.url} alt={p.legende ?? ""} fill className="object-cover group-hover:scale-105 transition-transform duration-500" />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors" />
                  {p.legende && (
                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent px-3 py-2">
                      <p className="text-white text-xs font-semibold text-left line-clamp-1">{p.legende}</p>
                      {p.categorie && <p className="text-white/60 text-[10px]">{p.categorie}</p>}
                    </div>
                  )}
                </button>
              ))}
            </div>

            {/* Pagination */}
            <div className="flex items-center justify-center gap-4 mt-8 text-sm font-medium">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className="px-4 py-2 rounded-full border border-border hover:bg-muted disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
              >
                {locale === "fr" ? "Précédent" : "Previous"}
              </button>
              <span className="text-muted-foreground tabular-nums">
                {page} / {totalPages}
              </span>
              <button
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="px-4 py-2 rounded-full border border-border hover:bg-muted disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
              >
                {locale === "fr" ? "Suivant" : "Next"}
              </button>
            </div>
          </>
        )}
      </div>

      {/* Lightbox */}
      {lightbox && lightboxIdx !== null && (
        <div
          className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4"
          onClick={() => setLightboxIdx(null)}
        >
          <button
            className="absolute top-4 right-4 text-white/70 hover:text-white"
            onClick={() => setLightboxIdx(null)}
            aria-label="Fermer"
          >
            <X size={28} />
          </button>
          {lightboxIdx > 0 && (
            <button
              className="absolute left-2 sm:left-6 text-white/60 hover:text-white p-2"
              onClick={(e) => { e.stopPropagation(); setLightboxIdx(lightboxIdx - 1); }}
              aria-label="Précédent"
            >
              <ChevronLeft size={32} />
            </button>
          )}
          {lightboxIdx < paginatedPhotos.length - 1 && (
            <button
              className="absolute right-2 sm:right-6 text-white/60 hover:text-white p-2"
              onClick={(e) => { e.stopPropagation(); setLightboxIdx(lightboxIdx + 1); }}
              aria-label="Suivant"
            >
              <ChevronRight size={32} />
            </button>
          )}
          <div className="relative max-w-3xl w-full max-h-[80vh] aspect-video" onClick={(e) => e.stopPropagation()}>
            <Image src={lightbox.url} alt={lightbox.legende ?? ""} fill className="object-contain" />
          </div>
          {lightbox.legende && (
            <div className="absolute bottom-6 left-0 right-0 text-center px-4">
              <p className="text-white font-semibold text-sm">{lightbox.legende}</p>
              {lightbox.categorie && <p className="text-white/60 text-xs mt-0.5">{lightbox.categorie}</p>}
            </div>
          )}
        </div>
      )}

      <ClubFooter clubId={clubId} club={club} />
    </div>
  );
}
