import type { AdminResourceName } from "@/lib/api";

export type AdminNavResourceName = "dashboard" | AdminResourceName;

export const ADMIN_NAV_ITEMS: Array<{ resource: AdminNavResourceName; label: string }> = [
  { resource: "dashboard", label: "Dashboard" },
  { resource: "clubs", label: "Clubs" },
  { resource: "players", label: "Joueurs" },
  { resource: "news", label: "Actualites" },
  { resource: "matches", label: "Matchs" },
  { resource: "standings", label: "Classements" },
  { resource: "products", label: "Produits" },
];

export const ADMIN_RESOURCE_LABELS: Record<AdminNavResourceName, string> = {
  dashboard: "Vue d'ensemble",
  clubs: "Gestion des clubs",
  players: "Gestion des joueurs",
  news: "Gestion des actualites",
  matches: "Gestion des matchs",
  standings: "Gestion des classements",
  products: "Gestion des produits",
};
