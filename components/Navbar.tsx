"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";
import { Menu, X, Sun, Moon, ChevronDown, ShoppingBag, Globe, ArrowRight } from "lucide-react";
import { useTheme } from "next-themes";
import { useLocale } from "@/lib/locale-context";
import type { Translations } from "@/lib/i18n";
import { fetchClubsWithTeams } from "@/lib/api";
import { getClubMenuItems, TEAM_CATEGORIES } from "@/lib/club-nav";

type NavClub = { id: string; nom: string; acronyme: string; logo: string; color: string; colorDark: string };

const FALLBACK_LOGO: Record<string, string> = {
  jag: "/images/jag-logo.png",
  atletico: "/images/atletico-logo.png",
};

function ClubMegaPanel({ club, t }: { club: NavClub; t: Translations }) {
  const menuItems = getClubMenuItems(club.id, t);

  return (
    <div className="absolute top-full left-0 pt-3 w-[30rem] opacity-0 invisible translate-y-1 group-hover:opacity-100 group-hover:visible group-hover:translate-y-0 transition-all duration-200 z-50">
      <div className="bg-popover border border-border shadow-2xl overflow-hidden" style={{ "--club": club.color } as React.CSSProperties}>
        <div className="grid grid-cols-[1fr_1fr]">
          {/* Section links */}
          <div className="p-5 border-r border-border">
            <span className="eyebrow block mb-3">{club.nom}</span>
            <ul className="flex flex-col gap-0.5">
              {menuItems.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="flex items-center justify-between py-1.5 text-sm font-semibold text-foreground hover:text-club transition-colors group/link"
                  >
                    {item.label}
                    <ArrowRight size={12} className="opacity-0 -translate-x-1 group-hover/link:opacity-60 group-hover/link:translate-x-0 transition-all" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Teams + CTA */}
          <div className="flex flex-col">
            <div className="p-5 flex-1">
              <span className="eyebrow block mb-3">{t.club.ourTeams}</span>
              <ul className="flex flex-col gap-0.5">
                {TEAM_CATEGORIES.map((cat) => (
                  <li key={cat}>
                    <Link
                      href={`/clubs/${club.id}/equipe/${cat}`}
                      className="block py-1.5 text-sm font-semibold text-foreground hover:text-club transition-colors"
                    >
                      {t.nav[cat]}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <Link
              href={`/clubs/${club.id}/boutique`}
              className="flex items-center gap-2 px-5 py-3.5 text-sm font-bold uppercase tracking-wide text-white bg-club transition-opacity hover:opacity-90"
            >
              <ShoppingBag size={14} />
              {t.nav.boutique}
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

function DesktopClubTab({ club, t }: { club: NavClub; t: Translations }) {
  return (
    <div className="relative group h-full" style={{ "--club": club.color } as React.CSSProperties}>
      <Link
        href={`/clubs/${club.id}`}
        className="relative flex items-center gap-2.5 h-full px-4 font-display font-bold text-[15px] uppercase tracking-wide text-foreground"
      >
        <Image src={club.logo} alt={club.nom} width={28} height={28} className="rounded-full object-cover shrink-0" />
        {club.acronyme}
        <ChevronDown size={13} className="opacity-40 group-hover:opacity-100 group-hover:rotate-180 transition-all duration-200" />
        <span className="absolute left-4 right-4 -bottom-px h-[3px] bg-club scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-200" />
      </Link>
      <ClubMegaPanel club={club} t={t} />
    </div>
  );
}

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [expandedClub, setExpandedClub] = useState<string | null>(null);
  const { theme, setTheme } = useTheme();
  const { locale, setLocale, t } = useLocale();
  const [mounted, setMounted] = useState(false);
  const [clubs, setClubs] = useState<NavClub[]>([]);

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    let cancelled = false;
    fetchClubsWithTeams().then((data) => {
      if (cancelled) return;
      setClubs(
        data.map((club) => ({
          id: club.slug,
          nom: club.name,
          acronyme: club.acronym ?? club.name,
          logo: club.logo || FALLBACK_LOGO[club.slug] || "/images/jag-logo.png",
          color: club.primary_color || "#CC0000",
          colorDark: club.secondary_color || "#8F0000",
        }))
      );
    });
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <header className="sticky top-0 z-50">
      {/* ── Utility bar ──────────────────────────────────── */}
      <div className="hidden md:block bg-[#0C0E11] text-white/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between h-8 text-xs">
          <div className="flex items-center gap-1.5">
            <Image src="/images/FGF-Logo.png" alt="FGF" width={16} height={16} className="object-contain" />
            <span>Fédération Guinéenne de Football <span className="font-bold text-white/90">(FGF)</span></span>
          </div>
          <div className="flex items-center gap-4">
            <button
              onClick={() => setLocale(locale === "fr" ? "en" : "fr")}
              className="flex items-center gap-1.5 font-bold hover:text-white transition-colors"
              aria-label="Toggle language"
            >
              <Globe size={12} />
              {locale === "fr" ? "FR" : "EN"}
            </button>
            {mounted && (
              <button
                onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                className="flex items-center gap-1.5 hover:text-white transition-colors"
                aria-label="Toggle theme"
              >
                {theme === "dark" ? <Sun size={12} /> : <Moon size={12} />}
                {theme === "dark" ? (locale === "fr" ? "Clair" : "Light") : (locale === "fr" ? "Sombre" : "Dark")}
              </button>
            )}
          </div>
        </div>
      </div>

      {/* ── Main bar ─────────────────────────────────────── */}
      <div className="bg-card/95 backdrop-blur-md border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between h-16 md:h-[4.25rem]">
          <Link href="/" className="flex items-center gap-2.5 shrink-0 md:hidden">
            <Image src="/images/FGF-Logo.png" alt="FGF" width={30} height={30} className="object-contain" />
          </Link>

          <Link href="/" className="hidden md:flex items-center shrink-0 pr-6 mr-2 border-r border-border h-9">
            <span className="font-display font-black text-lg uppercase tracking-tight text-foreground leading-none">
              Guinée<span className="text-jag">FC</span>
            </span>
          </Link>

          {/* Desktop club tabs */}
          <nav className="hidden md:flex items-center gap-2 h-full flex-1">
            {clubs.map((club) => (
              <DesktopClubTab key={club.id} club={club} t={t} />
            ))}
          </nav>

          {/* Right controls */}
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setLocale(locale === "fr" ? "en" : "fr")}
              className="md:hidden flex items-center gap-1.5 h-9 px-3 rounded-full text-xs font-bold border border-border text-foreground hover:bg-muted transition-colors"
              aria-label="Toggle language"
            >
              <Globe size={13} className="opacity-60" />
              {locale === "fr" ? "FR" : "EN"}
            </button>

            {mounted && (
              <button
                onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                className="md:hidden flex items-center justify-center w-9 h-9 rounded-full text-foreground hover:bg-muted transition-colors"
                aria-label="Toggle theme"
              >
                {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
              </button>
            )}

            <button
              className="md:hidden flex items-center justify-center w-9 h-9 rounded-full text-foreground hover:bg-muted transition-colors"
              onClick={() => setMenuOpen(!menuOpen)}
              aria-label="Menu"
              aria-expanded={menuOpen}
            >
              {menuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <div
        className={`md:hidden bg-card border-b border-border overflow-y-auto transition-[max-height] duration-300 ease-in-out ${
          menuOpen ? "max-h-[85vh]" : "max-h-0"
        }`}
      >
        {clubs.map((club) => {
          const menuItems = getClubMenuItems(club.id, t);
          const isExpanded = expandedClub === club.id;
          return (
            <div key={club.id} className="border-b border-border last:border-b-0" style={{ "--club": club.color } as React.CSSProperties}>
              <button
                onClick={() => setExpandedClub(isExpanded ? null : club.id)}
                className="w-full flex items-center justify-between gap-2 px-4 py-3.5 text-sm font-display font-bold uppercase tracking-wide text-foreground active:bg-muted transition-colors"
                aria-expanded={isExpanded}
              >
                <span className="flex items-center gap-2.5">
                  <Image src={club.logo} alt={club.nom} width={26} height={26} className="rounded-full object-cover" />
                  {club.nom}
                </span>
                <ChevronDown
                  size={16}
                  className={`opacity-50 transition-transform duration-200 ${isExpanded ? "rotate-180" : ""}`}
                />
              </button>

              {isExpanded && (
                <div className="bg-muted/40 pb-2">
                  {menuItems.map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setMenuOpen(false)}
                      className="block px-6 py-2.5 text-sm text-foreground active:bg-muted transition-colors"
                    >
                      {item.label}
                    </Link>
                  ))}
                  <div className="px-4 pt-2 pb-1">
                    <span className="eyebrow">{t.club.ourTeams}</span>
                  </div>
                  {TEAM_CATEGORIES.map((cat) => (
                    <Link
                      key={cat}
                      href={`/clubs/${club.id}/equipe/${cat}`}
                      onClick={() => setMenuOpen(false)}
                      className="block px-6 py-2.5 text-sm text-muted-foreground active:text-foreground active:bg-muted transition-colors border-l-2 border-border ml-4"
                    >
                      {t.nav[cat]}
                    </Link>
                  ))}
                  <div className="px-4 pt-2.5">
                    <Link
                      href={`/clubs/${club.id}/boutique`}
                      onClick={() => setMenuOpen(false)}
                      className="flex items-center justify-center gap-2 w-full py-3 rounded-full text-sm font-bold uppercase tracking-wide text-white bg-club"
                    >
                      <ShoppingBag size={14} />
                      {t.nav.boutique}
                    </Link>
                  </div>
                </div>
              )}
            </div>
          );
        })}

        <div className="px-4 py-3.5 flex items-center justify-between border-t border-border">
          <button
            onClick={() => setLocale(locale === "fr" ? "en" : "fr")}
            className="flex items-center gap-2 text-sm font-semibold h-10 px-4 border border-border rounded-full text-foreground active:bg-muted transition-colors"
          >
            {locale === "fr" ? (
              <>🇬🇧 English</>
            ) : (
              <>🇫🇷 Français</>
            )}
          </button>
          {mounted && (
            <button
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className="flex items-center justify-center w-10 h-10 rounded-full text-foreground border border-border active:bg-muted transition-colors"
            >
              {theme === "dark" ? <Sun size={17} /> : <Moon size={17} />}
            </button>
          )}
        </div>
      </div>
    </header>
  );
}
