export type NewsArticle = {
  id: number;
  titre: string;
  contenu: string;
  image?: string;
  datePublication: string;
  categorie: string;
};

export type ClubMatch = {
  id: number;
  date: string;
  heure?: string;
  journee?: string;
  adversaire: string;
  competition: string;
  lieu: "Domicile" | "Extérieur";
  stade?: string;
  categorie: "Cadets" | "Juniors" | "Seniors";
  status?: "scheduled" | "completed";
  scoreClub?: number | null;
  scoreAdv?: number | null;
};

export type StandingEntry = {
  position: number;
  equipe: string;
  joues?: number;
  victoires?: number;
  nuls?: number;
  defaites?: number;
  butsPour?: number;
  butsContre?: number;
  gd?: number | null;
  points: number;
  isClub?: boolean;
};

export type StandingGroup = {
  competition: string;
  categorie: string;
  saison: string;
  entrees: StandingEntry[];
};

export type ShopProduct = {
  id: number;
  name: { fr: string; en: string };
  category: "jerseys" | "accessories" | "bags";
  price: string;
  image: string;
  isNew?: boolean;
  isSale?: boolean;
  oldPrice?: string;
  rating: number;
  reviews: number;
};

export type ClubApiTeam = {
  id: number;
  club_id: number;
  name: string;
  category: "Cadets" | "Juniors" | "Seniors";
  coach?: string;
};

export type ClubApiModel = {
  id: number;
  slug: string;
  name: string;
  acronym?: string;
  founded_at?: string;
  city?: string;
  description?: string;
  logo?: string;
  hero?: string;
  primary_color?: string;
  secondary_color?: string;
  social?: { facebook?: string; youtube?: string };
  teams?: ClubApiTeam[];
};

export type ClubPlayerApiModel = {
  id: number;
  number: number;
  first_name: string;
  last_name: string;
  date_of_birth: string;
  position: string;
  height: string;
  photo?: string;
};

export type TeamPlayerCardModel = {
  id: number;
  numero: number;
  prenom: string;
  nom: string;
  dateNaissance: string;
  poste: string;
  taille: string;
  photo?: string;
};

export type ClubGalleryPhoto = {
  id: number;
  url: string;
  legende?: string;
  categorie?: string;
};

export type AdminUser = {
  id: number;
  name: string;
  email: string;
  is_admin: boolean;
};

export type AdminAuthResponse = {
  token: string;
  user: AdminUser;
};

export type AdminResourceName =
  | "clubs"
  | "players"
  | "news"
  | "matches"
  | "standings"
  | "products";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL ?? "https://ticojag.jss-gn.com/api/v1";

function toAbsoluteAssetUrl(value?: string): string | undefined {
  if (!value) {
    return undefined;
  }

  if (/^https?:\/\//i.test(value)) {
    return value;
  }

  const origin = new URL(API_BASE_URL).origin;
  const normalized = value.startsWith("/") ? value : `/${value}`;

  return `${origin}${normalized}`;
}

async function requestJson<T>(
  path: string,
  options?: {
    method?: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
    body?: unknown;
    token?: string;
  }
): Promise<T> {
  const method = options?.method ?? "GET";
  const headers: Record<string, string> = {
    Accept: "application/json",
  };

  if (options?.token) {
    headers.Authorization = `Bearer ${options.token}`;
  }

  if (options?.body !== undefined) {
    headers["Content-Type"] = "application/json";
  }

  const response = await fetch(`${API_BASE_URL}${path}`, {
    method,
    cache: "no-store",
    headers,
    body: options?.body !== undefined ? JSON.stringify(options.body) : undefined,
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(errorText || `API error ${response.status} for ${path}`);
  }

  if (response.status === 204) {
    return {} as T;
  }

  return (await response.json()) as T;
}

async function getJson<T>(path: string): Promise<T> {
  return requestJson<T>(path, { method: "GET" });
}

function pickArray<T>(payload: unknown): T[] {
  if (Array.isArray(payload)) {
    return payload as T[];
  }

  if (
    payload &&
    typeof payload === "object" &&
    "data" in payload &&
    Array.isArray((payload as { data: unknown }).data)
  ) {
    return (payload as { data: T[] }).data;
  }

  return [];
}

export async function fetchClubArticles(clubSlug: string): Promise<NewsArticle[]> {
  const payload = await getJson<unknown>(`/clubs/${clubSlug}/actualites`);
  return pickArray<NewsArticle>(payload);
}

export async function fetchClubCalendar(clubSlug: string): Promise<ClubMatch[]> {
  const payload = await getJson<unknown>(`/clubs/${clubSlug}/calendrier`);
  return pickArray<ClubMatch>(payload);
}

export async function fetchClubResults(clubSlug: string): Promise<ClubMatch[]> {
  const payload = await getJson<unknown>(`/clubs/${clubSlug}/resultats`);
  return pickArray<ClubMatch>(payload);
}

export async function fetchClubStandings(clubSlug: string): Promise<StandingGroup[]> {
  const payload = await getJson<unknown>(`/clubs/${clubSlug}/classement`);
  const groups = pickArray<StandingGroup>(payload);

  return groups.map((group) => ({
    ...group,
    entrees: pickArray<StandingEntry>(group.entrees),
  }));
}

export async function fetchClubProducts(clubSlug: string): Promise<ShopProduct[]> {
  const payload = await getJson<unknown>(`/clubs/${clubSlug}/boutique`);
  return pickArray<ShopProduct>(payload);
}

export async function fetchClubBySlug(clubSlug: string): Promise<ClubApiModel | null> {
  const payload = await getJson<{ data?: ClubApiModel } | ClubApiModel>(
    `/clubs/${clubSlug}?include=teams`
  );

  if (payload && typeof payload === "object" && "data" in payload) {
    return (payload as { data?: ClubApiModel }).data ?? null;
  }

  return (payload as ClubApiModel) ?? null;
}

export async function fetchClubsWithTeams(): Promise<ClubApiModel[]> {
  const payload = await getJson<unknown>("/clubs?include=teams&per_page=100");
  return pickArray<ClubApiModel>(payload);
}

export async function fetchClubPlayersByCategory(
  clubSlug: string,
  categorySlug: string
): Promise<TeamPlayerCardModel[]> {
  const payload = await getJson<unknown>(`/clubs/${clubSlug}/players/${categorySlug}`);
  const players = pickArray<ClubPlayerApiModel>(payload);

  return players.map((player) => ({
    id: player.id,
    numero: player.number,
    prenom: player.first_name,
    nom: player.last_name,
    dateNaissance: player.date_of_birth,
    poste: player.position,
    taille: player.height,
    photo: toAbsoluteAssetUrl(player.photo),
  }));
}

export async function fetchClubGallery(clubSlug: string): Promise<ClubGalleryPhoto[]> {
  const club = await fetchClubBySlug(clubSlug);

  if (!club?.id) {
    return [];
  }

  const payload = await getJson<unknown>(`/media?mediable_type=club&mediable_id=${club.id}`);

  return pickArray<Record<string, unknown>>(payload)
    .map((item) => ({
      id: Number(item.id),
      url: toAbsoluteAssetUrl(String(item.url ?? "")) || "",
      legende: typeof item.title === "string" ? item.title : undefined,
      categorie: typeof item.type === "string" ? item.type : undefined,
    }))
    .filter((item) => item.url);
}

export async function adminLogin(email: string, password: string): Promise<AdminAuthResponse> {
  return requestJson<AdminAuthResponse>("/auth/login", {
    method: "POST",
    body: { email, password },
  });
}

export async function adminMe(token: string): Promise<AdminUser> {
  const response = await requestJson<{ user: AdminUser }>("/auth/me", {
    method: "GET",
    token,
  });

  return response.user;
}

export async function adminLogout(token: string): Promise<void> {
  await requestJson("/auth/logout", {
    method: "POST",
    token,
  });
}

export async function adminList<T = unknown>(resource: AdminResourceName, token: string): Promise<T[]> {
  const payload = await requestJson<unknown>(`/${resource}`, {
    method: "GET",
    token,
  });

  return pickArray<T>(payload);
}

export async function adminCreate<T = unknown>(
  resource: AdminResourceName,
  token: string,
  body: Record<string, unknown>
): Promise<T> {
  const payload = await requestJson<{ data?: T } | T>(`/${resource}`, {
    method: "POST",
    token,
    body,
  });

  return payload && typeof payload === "object" && "data" in payload
    ? ((payload as { data?: T }).data as T)
    : (payload as T);
}

export async function adminUpdate<T = unknown>(
  resource: AdminResourceName,
  id: number,
  token: string,
  body: Record<string, unknown>
): Promise<T> {
  const payload = await requestJson<{ data?: T } | T>(`/${resource}/${id}`, {
    method: "PUT",
    token,
    body,
  });

  return payload && typeof payload === "object" && "data" in payload
    ? ((payload as { data?: T }).data as T)
    : (payload as T);
}

export async function adminDelete(resource: AdminResourceName, id: number, token: string): Promise<void> {
  await requestJson(`/${resource}/${id}`, {
    method: "DELETE",
    token,
  });
}
