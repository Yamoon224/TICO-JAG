import { useEffect, useState, type CSSProperties } from "react";
import { fetchClubBySlug } from "@/lib/api";

export type ClubBrand = {
  nom: string;
  acronyme: string;
  logo: string;
  hero: string;
  color: string;
  colorDark: string;
  social?: { facebook?: string; youtube?: string };
};

function shade(hex: string, amount: number): string {
  const n = parseInt(hex.replace("#", ""), 16);
  const r = Math.max(0, Math.min(255, (n >> 16) + amount));
  const g = Math.max(0, Math.min(255, ((n >> 8) & 0xff) + amount));
  const b = Math.max(0, Math.min(255, (n & 0xff) + amount));
  return `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)}`;
}

export const CLUB_FALLBACK: Record<string, ClubBrand> = {
  jag: {
    nom: "Jaguar Académie Guinée",
    acronyme: "JAG",
    logo: "/images/jag-logo.png",
    hero: "/images/jag-hero.png",
    color: "#CC0000",
    colorDark: "#990000",
  },
  atletico: {
    nom: "Club Atlético de Colèah",
    acronyme: "Atlético",
    logo: "/images/atletico-logo.png",
    hero: "/images/atletico-hero.png",
    color: "#F5B800",
    colorDark: "#C9950A",
  },
};

/** CSS custom properties carrying the active club's color, for `var(--club)` / `.text-club` / `.bg-club` utilities. */
export function clubVars(brand: Pick<ClubBrand, "color" | "colorDark">): CSSProperties {
  return { "--club": brand.color, "--club-dark": brand.colorDark } as CSSProperties;
}

/** Returns club branding instantly from a static fallback, then refreshes from the API. */
export function useClubBrand(clubSlug: string): ClubBrand {
  const fallback = CLUB_FALLBACK[clubSlug] ?? CLUB_FALLBACK.jag;
  const [brand, setBrand] = useState<ClubBrand>(fallback);

  useEffect(() => {
    let cancelled = false;
    setBrand(CLUB_FALLBACK[clubSlug] ?? CLUB_FALLBACK.jag);

    fetchClubBySlug(clubSlug).then((club) => {
      if (cancelled || !club) return;
      const base = CLUB_FALLBACK[clubSlug] ?? CLUB_FALLBACK.jag;
      const color = club.primary_color || base.color;
      setBrand({
        nom: club.name || base.nom,
        acronyme: club.acronym || base.acronyme,
        logo: club.logo || base.logo,
        hero: club.hero || base.hero,
        color,
        colorDark: club.secondary_color || shade(color, -40),
        social: club.social,
      });
    });

    return () => {
      cancelled = true;
    };
  }, [clubSlug]);

  return brand;
}
