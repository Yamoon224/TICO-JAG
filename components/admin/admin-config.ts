import type { AdminResourceName } from "@/lib/api";

export const ADMIN_NAV_ITEMS: Array<{ resource: AdminResourceName; label: string }> = [
  { resource: "clubs", label: "Clubs" },
  { resource: "players", label: "Joueurs" },
  { resource: "news", label: "Actualites" },
  { resource: "matches", label: "Matchs" },
  { resource: "standings", label: "Classements" },
  { resource: "products", label: "Produits" },
];

export const ADMIN_RESOURCE_LABELS: Record<AdminResourceName, string> = {
  clubs: "Gestion des clubs",
  players: "Gestion des joueurs",
  news: "Gestion des actualites",
  matches: "Gestion des matchs",
  standings: "Gestion des classements",
  products: "Gestion des produits",
};
