import type { Translations } from "@/lib/i18n";

export const TEAM_CATEGORIES = ["cadets", "juniors", "seniors"] as const;

export function getClubMenuItems(clubId: string, t: Translations) {
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
