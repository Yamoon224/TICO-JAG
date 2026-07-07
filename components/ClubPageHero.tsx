"use client";

import Image from "next/image";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import type { ClubBrand } from "@/lib/club-brand";

export function ClubPageHero({
  clubId,
  club,
  label,
  dim = true,
}: {
  clubId: string;
  club: ClubBrand;
  label: string;
  /** Tint the hero image with the club's dark color (default). Set false for full-brightness imagery, e.g. a photo gallery. */
  dim?: boolean;
}) {
  return (
    <div className="relative h-40 sm:h-52 overflow-hidden" style={{ backgroundColor: dim ? club.colorDark : undefined }}>
      <Image src={club.hero} alt={club.nom} fill className={`object-cover ${dim ? "opacity-15" : ""}`} />
      <div
        className="absolute inset-x-0 bottom-0 h-1"
        style={{ backgroundColor: club.color }}
        aria-hidden
      />
      <div className="relative max-w-5xl mx-auto px-4 sm:px-6 h-full flex flex-col justify-end pb-6">
        <Link
          href={`/clubs/${clubId}`}
          className="flex items-center gap-1.5 text-white/60 hover:text-white text-xs mb-3 transition-colors w-fit"
        >
          <ChevronLeft size={14} />
          {club.acronyme}
        </Link>
        <div className="flex items-center gap-3">
          <Image
            src={club.logo}
            alt={club.nom}
            width={44}
            height={44}
            className="rounded-full border-2 border-white/30 object-cover bg-white/10"
          />
          <div>
            <p className="text-white/60 text-xs uppercase tracking-widest font-semibold">{label}</p>
            <h1 className="font-display text-white font-black text-xl sm:text-2xl leading-tight tracking-tight">
              {club.nom}
            </h1>
          </div>
        </div>
      </div>
    </div>
  );
}
