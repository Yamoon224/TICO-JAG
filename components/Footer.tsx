import Link from "next/link";
import Image from "next/image";
import { Facebook, Youtube } from "lucide-react";
import { useLocale } from "@/lib/locale-context";
import { getClubMenuItems, TEAM_CATEGORIES } from "@/lib/club-nav";
import type { ClubBrand } from "@/lib/club-brand";

const YEAR = new Date().getFullYear();

function FooterShell({ children }: { children: React.ReactNode }) {
  const { t } = useLocale();
  return (
    <footer className="bg-[#101214] text-[#F2F1EE]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12 md:py-14">{children}</div>
      <div className="border-t border-white/10">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-4 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-white/40">
          <p>&copy; {YEAR} Guinée Football Clubs &mdash; {t.footer.rights}</p>
          <p>{t.footer.city}</p>
        </div>
      </div>
    </footer>
  );
}

/** Site-wide footer for the homepage: introduces both clubs under the FGF umbrella. */
export function SiteFooter() {
  const { locale, t } = useLocale();

  const clubs: { id: string; nom: string; color: string }[] = [
    { id: "jag", nom: "Jaguar Académie Guinée", color: "var(--color-jag)" },
    { id: "atletico", nom: "Club Atlético de Colèah", color: "var(--color-atletico)" },
  ];

  return (
    <FooterShell>
      <div className="grid gap-10 sm:grid-cols-3">
        <div>
          <div className="flex items-center gap-2.5 mb-3">
            <Image src="/images/FGF-Logo.png" alt="FGF" width={32} height={32} className="object-contain" />
            <p className="font-display font-black text-sm tracking-tight">Guinée Football Clubs</p>
          </div>
          <p className="text-sm text-white/50 leading-relaxed max-w-xs">{t.home.heroSub}</p>
        </div>

        {clubs.map((club) => (
          <div key={club.id}>
            <p
              className="font-display text-xs font-black uppercase tracking-widest mb-3"
              style={{ color: club.color }}
            >
              {club.nom}
            </p>
            <ul className="flex flex-col gap-2 text-sm text-white/60">
              {TEAM_CATEGORIES.map((cat) => (
                <li key={cat}>
                  <Link href={`/clubs/${club.id}/equipe/${cat}`} className="hover:text-white transition-colors">
                    {t.nav[cat]}
                  </Link>
                </li>
              ))}
              <li>
                <Link href={`/clubs/${club.id}`} className="hover:text-white transition-colors">
                  {locale === "fr" ? "Voir le club" : "View club"} &rarr;
                </Link>
              </li>
            </ul>
          </div>
        ))}
      </div>
    </FooterShell>
  );
}

/** Per-club footer: identity, quick navigation and socials for a single club's pages. */
export function ClubFooter({ club, clubId }: { club: ClubBrand; clubId: string }) {
  const { t } = useLocale();
  const menuItems = getClubMenuItems(clubId, t);
  const social = club.social;

  return (
    <FooterShell>
      <div className="grid gap-10 sm:grid-cols-[auto_1fr] sm:gap-14">
        <div className="flex sm:flex-col items-center sm:items-start gap-3">
          <Image
            src={club.logo}
            alt={club.nom}
            width={52}
            height={52}
            className="rounded-full border-2 border-white/15 object-cover bg-white/5"
          />
          <div>
            <p className="font-display font-black text-base leading-tight" style={{ color: club.color }}>
              {club.nom}
            </p>
            {social && (social.facebook || social.youtube) && (
              <div className="flex items-center gap-3 mt-2">
                {social.facebook && (
                  <a href={social.facebook} target="_blank" rel="noopener noreferrer" aria-label="Facebook" className="text-white/50 hover:text-white transition-colors">
                    <Facebook size={16} />
                  </a>
                )}
                {social.youtube && (
                  <a href={social.youtube} target="_blank" rel="noopener noreferrer" aria-label="YouTube" className="text-white/50 hover:text-white transition-colors">
                    <Youtube size={16} />
                  </a>
                )}
              </div>
            )}
          </div>
        </div>

        <nav className="grid grid-cols-2 sm:grid-cols-4 gap-x-6 gap-y-2.5 text-sm text-white/60">
          {menuItems.map((item) => (
            <Link key={item.href} href={item.href} className="hover:text-white transition-colors">
              {item.label}
            </Link>
          ))}
        </nav>
      </div>
    </FooterShell>
  );
}
