"use client";

import Image from "next/image";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import type { ClubBrand } from "@/lib/club-brand";
import { clubVars } from "@/lib/club-brand";

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
    <div className="relative h-56 sm:h-72 md:h-80 overflow-hidden bg-[#0C0E11]" style={clubVars(club)}>
      <Image src={club.hero} alt={club.nom} fill className={`object-cover ${dim ? "opacity-30" : ""}`} priority />
      <div className="absolute inset-0 bg-gradient-to-t from-[#0C0E11] via-[#0C0E11]/45 to-[#0C0E11]/10" />
      <div className="scoreboard-tile absolute inset-x-0 bottom-0 h-[3px]" aria-hidden />

      <div className="relative max-w-6xl mx-auto px-4 sm:px-6 h-full flex flex-col justify-end pb-8">
        <Link
          href={`/clubs/${clubId}`}
          className="flex items-center gap-1 text-white/55 hover:text-white text-xs font-bold uppercase tracking-wide mb-4 transition-colors w-fit"
        >
          <ChevronLeft size={14} />
          {club.acronyme}
        </Link>
        <div className="flex items-center gap-4">
          <Image
            src={club.logo}
            alt={club.nom}
            width={64}
            height={64}
            className="rounded-full border-2 object-cover bg-white/10 shrink-0"
            style={{ borderColor: "var(--club)" }}
          />
          <div className="min-w-0">
            <p className="eyebrow text-white/70 mb-1.5" style={{ color: "var(--club)" }}>{label}</p>
            <h1 className="font-display text-white font-black text-3xl sm:text-4xl md:text-5xl uppercase leading-[0.95] tracking-tight text-balance">
              {club.nom}
            </h1>
          </div>
        </div>
      </div>
    </div>
  );
}
