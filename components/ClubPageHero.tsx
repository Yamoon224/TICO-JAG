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
    <div className="relative h-44 sm:h-56 overflow-hidden bg-[#101214]" style={clubVars(club)}>
      <Image src={club.hero} alt={club.nom} fill className={`object-cover ${dim ? "opacity-25" : ""}`} priority />
      <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/35 to-black/10" />
      <div className="scoreboard-tile absolute inset-x-0 bottom-0 h-[3px]" aria-hidden />

      <div className="relative max-w-5xl mx-auto px-4 sm:px-6 h-full flex flex-col justify-end pb-7">
        <Link
          href={`/clubs/${clubId}`}
          className="flex items-center gap-1 text-white/55 hover:text-white text-xs font-semibold mb-3 transition-colors w-fit"
        >
          <ChevronLeft size={14} />
          {club.acronyme}
        </Link>
        <div className="flex items-center gap-3.5">
          <Image
            src={club.logo}
            alt={club.nom}
            width={48}
            height={48}
            className="rounded-full border-2 object-cover bg-white/10 shrink-0"
            style={{ borderColor: "var(--club)" }}
          />
          <div className="min-w-0">
            <p className="text-club text-[11px] uppercase tracking-[0.15em] font-bold">{label}</p>
            <h1 className="font-display text-white font-black text-2xl sm:text-3xl leading-[1.1] tracking-tight text-balance">
              {club.nom}
            </h1>
          </div>
        </div>
      </div>
    </div>
  );
}
