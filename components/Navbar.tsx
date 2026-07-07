"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useRef, useEffect } from "react";
import { Menu, X, Sun, Moon, ChevronDown, ShoppingBag } from "lucide-react";
import { useTheme } from "next-themes";
import { useLocale } from "@/lib/locale-context";
import type { Translations } from "@/lib/i18n";
import { fetchClubsWithTeams } from "@/lib/api";

type NavClub = { id: string; nom: string; acronyme: string; logo: string; color: string };

const FALLBACK_LOGO: Record<string, string> = {
  jag: "/images/jag-logo.png",
  atletico: "/images/atletico-logo.png",
};

function getClubMenuItems(clubId: string, t: Translations) {
  return [
    { label: t.nav.actualites, href: `/clubs/${clubId}/actualites` },
    { label: t.nav.calendrier, href: `/clubs/${clubId}/calendrier` },
    { label: t.nav.billets, href: `/clubs/${clubId}/billets` },
    { label: t.nav.resultats, href: `/clubs/${clubId}/resultats` },
    { label: t.nav.classement, href: `/clubs/${clubId}/classement` },
    { label: t.nav.joueurs, href: `/clubs/${clubId}` },
    { label: t.nav.photos, href: `/clubs/${clubId}/photos` },
    { label: t.nav.palmares, href: `/clubs/${clubId}/palmares` },
  ];
}

const categories = [
  { key: "cadets" as const },
  { key: "juniors" as const },
  { key: "seniors" as const },
];

function DesktopClubDropdown({ club, t }: { club: NavClub; t: Translations }) {
  const menuItems = getClubMenuItems(club.id, t);

  return (
    <div className="relative group">
      <Link
        href={`/clubs/${club.id}`}
        className="flex items-center gap-1.5 px-3 py-2 rounded-sm text-sm font-display font-bold text-foreground hover:bg-muted transition-colors"
      >
        <Image src={club.logo} alt={club.nom} width={20} height={20} className="rounded-full object-cover shrink-0" />
        {club.acronyme}
        <ChevronDown size={12} className="opacity-40 group-hover:opacity-100 transition-opacity" />
      </Link>

      <div className="absolute top-full left-0 mt-1 w-48 bg-card border border-border rounded-sm shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-150 z-50 overflow-hidden">
        <div className="px-3 py-2 border-b border-border">
          <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">
            {club.nom}
          </span>
        </div>

        {menuItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="block px-3 py-2 text-sm text-foreground hover:bg-muted transition-colors"
          >
            {item.label}
          </Link>
        ))}

        <div className="border-t border-border mt-1 px-3 pt-2 pb-1">
          <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">
            {t.club.ourTeams}
          </span>
        </div>
        {categories.map((cat) => (
          <Link
            key={cat.key}
            href={`/clubs/${club.id}/equipe/${cat.key}`}
            className="block px-3 py-2 text-sm text-foreground hover:bg-muted transition-colors"
          >
            {t.nav[cat.key]}
          </Link>
        ))}

        <div className="border-t border-border">
          <Link
            href={`/clubs/${club.id}/boutique`}
            className="flex items-center gap-2 px-3 py-2.5 text-sm font-semibold text-white transition-opacity hover:opacity-85"
            style={{ backgroundColor: club.color }}
          >
            <ShoppingBag size={14} />
            {t.nav.boutique}
          </Link>
        </div>
      </div>
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
  const mobileRef = useRef<HTMLDivElement>(null);

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
        }))
      );
    });
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <header className="bg-card border-b border-border sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between h-14 md:h-16">

        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 shrink-0">
          <Image src="/images/FGF-Logo.png" alt="FGF" width={36} height={36} className="object-contain" />
          <span className="hidden sm:block text-muted-foreground text-xs font-medium border-l border-border pl-2">
            Fédération Guinéenne de Football <span className="font-bold text-foreground">(FGF)</span>
          </span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-0.5">
          {clubs.map((club) => (
            <DesktopClubDropdown key={club.id} club={club} t={t} />
          ))}
        </nav>

        {/* Right controls */}
        <div className="flex items-center gap-1">
          <button
            onClick={() => setLocale(locale === "fr" ? "en" : "fr")}
            className="hidden sm:flex items-center gap-1.5 px-2.5 py-1.5 rounded-sm text-xs font-bold border border-border text-foreground hover:bg-muted transition-colors"
            aria-label="Toggle language"
          >
            {locale === "fr" ? (
              <><span className="text-base leading-none">🇬🇧</span><span>EN</span></>
            ) : (
              <><span className="text-base leading-none">🇫🇷</span><span>FR</span></>
            )}
          </button>

          {mounted && (
            <button
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className="p-2 rounded-sm text-foreground hover:bg-muted transition-colors"
              aria-label="Toggle theme"
            >
              {theme === "dark" ? <Sun size={17} /> : <Moon size={17} />}
            </button>
          )}

          <button
            className="md:hidden p-2 rounded-sm text-foreground hover:bg-muted transition-colors"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Menu"
          >
            {menuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div ref={mobileRef} className="md:hidden bg-card border-t border-border max-h-[80vh] overflow-y-auto">
          {clubs.map((club) => {
            const menuItems = getClubMenuItems(club.id, t);
            return (
              <div key={club.id} className="border-b border-border last:border-b-0">
                <button
                  onClick={() => setExpandedClub(expandedClub === club.id ? null : club.id)}
                  className="w-full flex items-center justify-between gap-2 px-4 py-3 text-sm font-semibold text-foreground hover:bg-muted transition-colors"
                >
                  <span className="flex items-center gap-2">
                    <Image src={club.logo} alt={club.nom} width={20} height={20} className="rounded-full object-cover" />
                    {club.nom}
                  </span>
                  <ChevronDown
                    size={15}
                    className={`opacity-50 transition-transform duration-200 ${expandedClub === club.id ? "rotate-180" : ""}`}
                  />
                </button>

                {expandedClub === club.id && (
                  <div className="bg-muted/30 pb-2">
                    {menuItems.map((item) => (
                      <Link
                        key={item.href}
                        href={item.href}
                        onClick={() => setMenuOpen(false)}
                        className="block px-6 py-2 text-sm text-foreground hover:bg-muted transition-colors"
                      >
                        {item.label}
                      </Link>
                    ))}
                    <div className="px-4 pt-2 pb-1">
                      <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">
                        {t.club.ourTeams}
                      </span>
                    </div>
                    {categories.map((cat) => (
                      <Link
                        key={cat.key}
                        href={`/clubs/${club.id}/equipe/${cat.key}`}
                        onClick={() => setMenuOpen(false)}
                        className="block px-6 py-2 text-sm text-muted-foreground hover:text-foreground hover:bg-muted transition-colors border-l-2 border-border ml-4"
                      >
                        {t.nav[cat.key]}
                      </Link>
                    ))}
                    <div className="px-4 pt-2">
                      <Link
                        href={`/clubs/${club.id}/boutique`}
                        onClick={() => setMenuOpen(false)}
                        className="flex items-center justify-center gap-2 w-full py-2.5 rounded-sm text-sm font-semibold text-white"
                        style={{ backgroundColor: club.color }}
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

          <div className="px-4 py-3 flex items-center justify-between border-t border-border">
            <button
              onClick={() => setLocale(locale === "fr" ? "en" : "fr")}
              className="flex items-center gap-2 text-sm font-semibold px-3 py-1.5 border border-border rounded-sm text-foreground hover:bg-muted transition-colors"
            >
              {locale === "fr" ? (
                <><span className="text-base">🇬🇧</span> English</>
              ) : (
                <><span className="text-base">🇫🇷</span> Français</>
              )}
            </button>
            {mounted && (
              <button
                onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                className="p-2 rounded-sm text-foreground hover:bg-muted transition-colors border border-border"
              >
                {theme === "dark" ? <Sun size={16} /> : <Moon size={16} />}
              </button>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
