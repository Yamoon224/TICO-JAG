"use client";

import { use, useEffect, useState } from "react";
import Image from "next/image";
import Navbar from "@/components/Navbar";
import { ClubPageHero } from "@/components/ClubPageHero";
import { useClubBrand } from "@/lib/club-brand";
import { fetchClubGallery, type ClubGalleryPhoto } from "@/lib/api";
import { useLocale } from "@/lib/locale-context";
import { X } from "lucide-react";

const PAGE_SIZE = 9;

export default function PhotosPage({ params }: { params: Promise<{ clubId: string }> }) {
  const { clubId } = use(params);
  const { locale } = useLocale();
  const club = useClubBrand(clubId);
  const [photos, setPhotos] = useState<ClubGalleryPhoto[]>([]);
  const [loading, setLoading] = useState(true);
  const [lightbox, setLightbox] = useState<ClubGalleryPhoto | null>(null);
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

  return (
    <div className="min-h-screen bg-background">
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
              {paginatedPhotos.map((p) => (
                <button
                  key={p.id}
                  onClick={() => setLightbox(p)}
                  className="group relative aspect-video bg-muted rounded-sm overflow-hidden focus:outline-none focus:ring-2"
                  style={{ ['--tw-ring-color' as string]: club.color }}
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
                className="px-3 py-1.5 rounded border border-border hover:bg-muted disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
              >
                {locale === "fr" ? "Précédent" : "Previous"}
              </button>
              <span className="text-muted-foreground">
                {page} / {totalPages}
              </span>
              <button
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="px-3 py-1.5 rounded border border-border hover:bg-muted disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
              >
                {locale === "fr" ? "Suivant" : "Next"}
              </button>
            </div>
          </>
        )}
      </div>

      {/* Lightbox */}
      {lightbox && (
        <div
          className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4"
          onClick={() => setLightbox(null)}
        >
          <button
            className="absolute top-4 right-4 text-white/70 hover:text-white"
            onClick={() => setLightbox(null)}
          >
            <X size={28} />
          </button>
          <div className="relative max-w-3xl w-full max-h-[80vh] aspect-video" onClick={(e) => e.stopPropagation()}>
            <Image src={lightbox.url} alt={lightbox.legende ?? ""} fill className="object-contain" />
          </div>
          {lightbox.legende && (
            <div className="absolute bottom-6 left-0 right-0 text-center">
              <p className="text-white font-semibold text-sm">{lightbox.legende}</p>
              {lightbox.categorie && <p className="text-white/60 text-xs mt-0.5">{lightbox.categorie}</p>}
            </div>
          )}
        </div>
      )}

      <footer className="border-t border-border bg-muted/30 py-6 text-center text-muted-foreground text-sm">
        <p className="font-semibold text-foreground">{club.nom}</p>
      </footer>
    </div>
  );
}
