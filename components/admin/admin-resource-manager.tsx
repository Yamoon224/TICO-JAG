"use client";

import { useAdminSession } from "@/components/admin/admin-context";
import {
  adminCreate,
  adminDelete,
  adminList,
  adminUpdate,
  type AdminResourceName,
} from "@/lib/api";
import { useEffect, useMemo, useState } from "react";

const inputClass = "w-full border border-slate-300 rounded-md px-3 py-2 bg-white text-sm";

type ResourceRecord = Record<string, unknown>;

type Props = {
  resource: AdminResourceName;
};

type ClubForm = {
  slug: string;
  name: string;
  acronym: string;
  founded_at: string;
  city: string;
  description: string;
  logo: string;
  hero: string;
  primary_color: string;
  secondary_color: string;
  facebook: string;
  youtube: string;
  instagram: string;
};

type PlayerForm = {
  team_id: string;
  number: string;
  first_name: string;
  last_name: string;
  date_of_birth: string;
  position: string;
  height: string;
  photo: string;
};

type NewsForm = {
  club_id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  image: string;
  category: string;
  published_at: string;
  is_published: boolean;
};

type MatchForm = {
  club_id: string;
  category: string;
  opponent: string;
  competition: string;
  match_date: string;
  match_time: string;
  day_label: string;
  venue: string;
  stadium: string;
  status: "scheduled" | "completed";
  club_score: string;
  opponent_score: string;
};

type StandingForm = {
  club_id: string;
  competition: string;
  category: string;
  season: string;
  position: string;
  team_name: string;
  played: string;
  wins: string;
  draws: string;
  losses: string;
  goals_for: string;
  goals_against: string;
  points: string;
  is_club: boolean;
};

type ProductForm = {
  club_id: string;
  slug: string;
  name_fr: string;
  name_en: string;
  category: string;
  price: string;
  image: string;
  is_new: boolean;
  is_sale: boolean;
  old_price: string;
  rating: string;
  reviews: string;
  is_active: boolean;
};

const EMPTY_CLUB: ClubForm = {
  slug: "",
  name: "",
  acronym: "",
  founded_at: "",
  city: "",
  description: "",
  logo: "",
  hero: "",
  primary_color: "#CC0000",
  secondary_color: "#111111",
  facebook: "",
  youtube: "",
  instagram: "",
};

const EMPTY_PLAYER: PlayerForm = {
  team_id: "",
  number: "",
  first_name: "",
  last_name: "",
  date_of_birth: "",
  position: "",
  height: "",
  photo: "",
};

const EMPTY_NEWS: NewsForm = {
  club_id: "",
  slug: "",
  title: "",
  excerpt: "",
  content: "",
  image: "",
  category: "",
  published_at: "",
  is_published: true,
};

const EMPTY_MATCH: MatchForm = {
  club_id: "",
  category: "Seniors",
  opponent: "",
  competition: "",
  match_date: "",
  match_time: "",
  day_label: "",
  venue: "home",
  stadium: "",
  status: "scheduled",
  club_score: "",
  opponent_score: "",
};

const EMPTY_STANDING: StandingForm = {
  club_id: "",
  competition: "",
  category: "Seniors",
  season: "",
  position: "",
  team_name: "",
  played: "",
  wins: "",
  draws: "",
  losses: "",
  goals_for: "",
  goals_against: "",
  points: "",
  is_club: false,
};

const EMPTY_PRODUCT: ProductForm = {
  club_id: "",
  slug: "",
  name_fr: "",
  name_en: "",
  category: "jerseys",
  price: "",
  image: "",
  is_new: false,
  is_sale: false,
  old_price: "",
  rating: "",
  reviews: "",
  is_active: true,
};

function asString(value: unknown): string {
  if (typeof value === "string") return value;
  if (typeof value === "number") return String(value);
  return "";
}

function asBoolean(value: unknown): boolean {
  return value === true;
}

function parseNumeric(value: string): number | null {
  if (!value.trim()) return null;
  const n = Number(value);
  return Number.isNaN(n) ? null : n;
}

function withOptional<T extends Record<string, unknown>>(payload: T): T {
  const next = { ...payload };
  Object.keys(next).forEach((key) => {
    if (next[key] === "") next[key] = null;
  });
  return next;
}

export function AdminResourceManager({ resource }: Props) {
  const { token, clubsWithTeams, refreshReferenceData } = useAdminSession();

  const [records, setRecords] = useState<ResourceRecord[]>([]);
  const [manualRecordId, setManualRecordId] = useState("");
  const [editingId, setEditingId] = useState<number | null>(null);
  const [query, setQuery] = useState("");
  const [sortAsc, setSortAsc] = useState(false);
  const [page, setPage] = useState(1);

  const [clubForm, setClubForm] = useState<ClubForm>(EMPTY_CLUB);
  const [playerForm, setPlayerForm] = useState<PlayerForm>(EMPTY_PLAYER);
  const [newsForm, setNewsForm] = useState<NewsForm>(EMPTY_NEWS);
  const [matchForm, setMatchForm] = useState<MatchForm>(EMPTY_MATCH);
  const [standingForm, setStandingForm] = useState<StandingForm>(EMPTY_STANDING);
  const [productForm, setProductForm] = useState<ProductForm>(EMPTY_PRODUCT);

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const clubOptions = useMemo(
    () => clubsWithTeams.map((club) => ({ id: club.id, name: club.name })),
    [clubsWithTeams]
  );

  const teamOptions = useMemo(
    () =>
      clubsWithTeams.flatMap((club) =>
        (club.teams ?? []).map((team) => ({ id: team.id, label: `${club.name} - ${team.category}` }))
      ),
    [clubsWithTeams]
  );

  const filteredSorted = useMemo(() => {
    const items = records.filter((item) => summary(item).toLowerCase().includes(query.toLowerCase()));
    const sorted = [...items].sort((a, b) => {
      const left = summary(a).toLowerCase();
      const right = summary(b).toLowerCase();
      if (left === right) return 0;
      return sortAsc ? (left > right ? 1 : -1) : (left > right ? -1 : 1);
    });
    return sorted;
  }, [records, query, sortAsc]);

  const pageSize = 8;
  const totalPages = Math.max(1, Math.ceil(filteredSorted.length / pageSize));
  const currentRows = filteredSorted.slice((page - 1) * pageSize, page * pageSize);

  useEffect(() => {
    if (resource === "news" && clubOptions[0] && !newsForm.club_id) {
      setNewsForm((prev) => ({ ...prev, club_id: String(clubOptions[0].id) }));
    }
    if (resource === "matches" && clubOptions[0] && !matchForm.club_id) {
      setMatchForm((prev) => ({ ...prev, club_id: String(clubOptions[0].id) }));
    }
    if (resource === "standings" && clubOptions[0] && !standingForm.club_id) {
      setStandingForm((prev) => ({ ...prev, club_id: String(clubOptions[0].id) }));
    }
    if (resource === "products" && clubOptions[0] && !productForm.club_id) {
      setProductForm((prev) => ({ ...prev, club_id: String(clubOptions[0].id) }));
    }
    if (resource === "players" && teamOptions[0] && !playerForm.team_id) {
      setPlayerForm((prev) => ({ ...prev, team_id: String(teamOptions[0].id) }));
    }
  }, [resource, clubOptions, teamOptions]);

  useEffect(() => {
    setEditingId(null);
    setManualRecordId("");
    setQuery("");
    setPage(1);
    setMessage("");
    setError("");
    void loadRecords();
  }, [resource]);

  useEffect(() => {
    if (page > totalPages) {
      setPage(totalPages);
    }
  }, [page, totalPages]);

  async function loadRecords() {
    if (!token) return;

    setLoading(true);
    setError("");

    try {
      const list = await adminList(resource, token);
      setRecords(list as ResourceRecord[]);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur lors du chargement.");
    } finally {
      setLoading(false);
    }
  }

  function currentPayload(): Record<string, unknown> {
    if (resource === "clubs") {
      return withOptional({
        slug: clubForm.slug,
        name: clubForm.name,
        acronym: clubForm.acronym,
        founded_at: clubForm.founded_at,
        city: clubForm.city,
        description: clubForm.description,
        logo: clubForm.logo,
        hero: clubForm.hero,
        primary_color: clubForm.primary_color,
        secondary_color: clubForm.secondary_color,
        social: {
          facebook: clubForm.facebook || null,
          youtube: clubForm.youtube || null,
          instagram: clubForm.instagram || null,
        },
      });
    }

    if (resource === "players") {
      return withOptional({
        team_id: parseNumeric(playerForm.team_id),
        number: parseNumeric(playerForm.number),
        first_name: playerForm.first_name,
        last_name: playerForm.last_name,
        date_of_birth: playerForm.date_of_birth,
        position: playerForm.position,
        height: playerForm.height,
        photo: playerForm.photo,
      });
    }

    if (resource === "news") {
      return withOptional({
        club_id: parseNumeric(newsForm.club_id),
        slug: newsForm.slug,
        title: newsForm.title,
        excerpt: newsForm.excerpt,
        content: newsForm.content,
        image: newsForm.image,
        category: newsForm.category,
        published_at: newsForm.published_at,
        is_published: newsForm.is_published,
      });
    }

    if (resource === "matches") {
      return withOptional({
        club_id: parseNumeric(matchForm.club_id),
        category: matchForm.category,
        opponent: matchForm.opponent,
        competition: matchForm.competition,
        match_date: matchForm.match_date,
        match_time: matchForm.match_time,
        day_label: matchForm.day_label,
        venue: matchForm.venue,
        stadium: matchForm.stadium,
        is_home: matchForm.venue === "home",
        status: matchForm.status,
        club_score: parseNumeric(matchForm.club_score),
        opponent_score: parseNumeric(matchForm.opponent_score),
      });
    }

    if (resource === "standings") {
      return withOptional({
        club_id: parseNumeric(standingForm.club_id),
        competition: standingForm.competition,
        category: standingForm.category,
        season: standingForm.season,
        position: parseNumeric(standingForm.position),
        team_name: standingForm.team_name,
        played: parseNumeric(standingForm.played),
        wins: parseNumeric(standingForm.wins),
        draws: parseNumeric(standingForm.draws),
        losses: parseNumeric(standingForm.losses),
        goals_for: parseNumeric(standingForm.goals_for),
        goals_against: parseNumeric(standingForm.goals_against),
        points: parseNumeric(standingForm.points),
        is_club: standingForm.is_club,
      });
    }

    return withOptional({
      club_id: parseNumeric(productForm.club_id),
      slug: productForm.slug,
      name_fr: productForm.name_fr,
      name_en: productForm.name_en,
      category: productForm.category,
      price: productForm.price,
      image: productForm.image,
      is_new: productForm.is_new,
      is_sale: productForm.is_sale,
      old_price: productForm.old_price,
      rating: parseNumeric(productForm.rating),
      reviews: parseNumeric(productForm.reviews),
      is_active: productForm.is_active,
    });
  }

  function extractId(record: ResourceRecord): number | null {
    const id = record.id;
    return typeof id === "number" ? id : null;
  }

  function targetId(): number | null {
    if (editingId !== null) return editingId;
    return parseNumeric(manualRecordId);
  }

  async function submitCreate() {
    if (!token) return;
    setLoading(true);
    setError("");
    setMessage("");

    try {
      await adminCreate(resource, token, currentPayload());
      setMessage("Creation effectuee.");
      await loadRecords();
      await refreshReferenceData();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Creation impossible.");
    } finally {
      setLoading(false);
    }
  }

  async function submitUpdate() {
    if (!token) return;
    const id = targetId();
    if (!id) {
      setError("Selectionne une ligne ou renseigne un ID pour la mise a jour.");
      return;
    }

    setLoading(true);
    setError("");
    setMessage("");

    try {
      await adminUpdate(resource, id, token, currentPayload());
      setMessage("Mise a jour effectuee.");
      await loadRecords();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Mise a jour impossible.");
    } finally {
      setLoading(false);
    }
  }

  async function submitDelete(idFromRow?: number) {
    if (!token) return;
    const id = idFromRow ?? targetId();
    if (!id) {
      setError("Selectionne une ligne ou renseigne un ID pour la suppression.");
      return;
    }

    setLoading(true);
    setError("");
    setMessage("");

    try {
      await adminDelete(resource, id, token);
      setMessage("Suppression effectuee.");
      await loadRecords();
      if (editingId === id) setEditingId(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Suppression impossible.");
    } finally {
      setLoading(false);
    }
  }

  function resetForm() {
    setEditingId(null);
    setManualRecordId("");
    if (resource === "clubs") setClubForm(EMPTY_CLUB);
    if (resource === "players") setPlayerForm((prev) => ({ ...EMPTY_PLAYER, team_id: prev.team_id }));
    if (resource === "news") setNewsForm((prev) => ({ ...EMPTY_NEWS, club_id: prev.club_id }));
    if (resource === "matches") setMatchForm((prev) => ({ ...EMPTY_MATCH, club_id: prev.club_id }));
    if (resource === "standings") setStandingForm((prev) => ({ ...EMPTY_STANDING, club_id: prev.club_id }));
    if (resource === "products") setProductForm((prev) => ({ ...EMPTY_PRODUCT, club_id: prev.club_id }));
  }

  function startEdit(record: ResourceRecord) {
    const id = extractId(record);
    if (id) {
      setEditingId(id);
      setManualRecordId(String(id));
    }

    if (resource === "clubs") {
      const social = (record.social as Record<string, unknown> | undefined) ?? {};
      setClubForm({
        slug: asString(record.slug),
        name: asString(record.name),
        acronym: asString(record.acronym),
        founded_at: asString(record.founded_at),
        city: asString(record.city),
        description: asString(record.description),
        logo: asString(record.logo),
        hero: asString(record.hero),
        primary_color: asString(record.primary_color),
        secondary_color: asString(record.secondary_color),
        facebook: asString(social.facebook),
        youtube: asString(social.youtube),
        instagram: asString(social.instagram),
      });
      return;
    }

    if (resource === "players") {
      setPlayerForm({
        team_id: asString(record.team_id),
        number: asString(record.number),
        first_name: asString(record.first_name),
        last_name: asString(record.last_name),
        date_of_birth: asString(record.date_of_birth),
        position: asString(record.position),
        height: asString(record.height),
        photo: asString(record.photo),
      });
      return;
    }

    if (resource === "news") {
      setNewsForm((prev) => ({
        ...prev,
        slug: asString(record.slug),
        title: asString(record.title) || asString(record.titre),
        excerpt: asString(record.excerpt),
        content: asString(record.content) || asString(record.contenu),
        image: asString(record.image),
        category: asString(record.category) || asString(record.categorie),
        published_at: asString(record.published_at) || asString(record.datePublication),
        is_published: typeof record.is_published === "boolean" ? record.is_published : prev.is_published,
      }));
      return;
    }

    if (resource === "matches") {
      const lieu = asString(record.lieu).toLowerCase();
      setMatchForm((prev) => ({
        ...prev,
        category: asString(record.category) || asString(record.categorie),
        opponent: asString(record.opponent) || asString(record.adversaire),
        competition: asString(record.competition),
        match_date: asString(record.match_date) || asString(record.date),
        match_time: asString(record.match_time) || asString(record.heure),
        day_label: asString(record.day_label) || asString(record.journee),
        venue: lieu.includes("domic") ? "home" : asString(record.venue) || "away",
        stadium: asString(record.stadium) || asString(record.stade),
        status: asString(record.status) === "completed" ? "completed" : "scheduled",
        club_score: asString(record.club_score) || asString(record.scoreClub),
        opponent_score: asString(record.opponent_score) || asString(record.scoreAdv),
      }));
      return;
    }

    if (resource === "standings") {
      setStandingForm((prev) => ({
        ...prev,
        competition: asString(record.competition),
        category: asString(record.category) || prev.category,
        season: asString(record.season),
        position: asString(record.position),
        team_name: asString(record.team_name) || asString(record.equipe),
        played: asString(record.played) || asString(record.joues),
        wins: asString(record.wins) || asString(record.victoires),
        draws: asString(record.draws) || asString(record.nuls),
        losses: asString(record.losses) || asString(record.defaites),
        goals_for: asString(record.goals_for) || asString(record.butsPour),
        goals_against: asString(record.goals_against) || asString(record.butsContre),
        points: asString(record.points),
        is_club: typeof record.is_club === "boolean" ? record.is_club : asBoolean(record.isClub),
      }));
      return;
    }

    const names = (record.name as Record<string, unknown> | undefined) ?? {};
    setProductForm((prev) => ({
      ...prev,
      slug: asString(record.slug),
      name_fr: asString(record.name_fr) || asString(names.fr),
      name_en: asString(record.name_en) || asString(names.en),
      category: asString(record.category),
      price: asString(record.price),
      image: asString(record.image),
      is_new: typeof record.is_new === "boolean" ? record.is_new : asBoolean(record.isNew),
      is_sale: typeof record.is_sale === "boolean" ? record.is_sale : asBoolean(record.isSale),
      old_price: asString(record.old_price) || asString(record.oldPrice),
      rating: asString(record.rating),
      reviews: asString(record.reviews),
      is_active: typeof record.is_active === "boolean" ? record.is_active : prev.is_active,
    }));
  }

  function summary(record: ResourceRecord): string {
    if (resource === "clubs") return `${asString(record.name)} (${asString(record.slug)})`;
    if (resource === "players") return `#${asString(record.number)} ${asString(record.first_name)} ${asString(record.last_name)}`;
    if (resource === "news") return asString(record.title) || asString(record.titre);
    if (resource === "matches") return `${asString(record.competition)} - ${asString(record.opponent) || asString(record.adversaire)}`;
    if (resource === "standings") return `${asString(record.position)} - ${asString(record.team_name) || asString(record.equipe)}`;
    const names = (record.name as Record<string, unknown> | undefined) ?? {};
    return asString(record.name_fr) || asString(names.fr);
  }

  function renderForm() {
    if (resource === "clubs") {
      return (
        <div className="grid md:grid-cols-2 gap-3">
          <input className={inputClass} placeholder="Slug" value={clubForm.slug} onChange={(e) => setClubForm({ ...clubForm, slug: e.target.value })} />
          <input className={inputClass} placeholder="Nom" value={clubForm.name} onChange={(e) => setClubForm({ ...clubForm, name: e.target.value })} />
          <input className={inputClass} placeholder="Acronyme" value={clubForm.acronym} onChange={(e) => setClubForm({ ...clubForm, acronym: e.target.value })} />
          <input className={inputClass} type="date" value={clubForm.founded_at} onChange={(e) => setClubForm({ ...clubForm, founded_at: e.target.value })} />
          <input className={inputClass} placeholder="Ville" value={clubForm.city} onChange={(e) => setClubForm({ ...clubForm, city: e.target.value })} />
          <input className={inputClass} placeholder="Couleur primaire" value={clubForm.primary_color} onChange={(e) => setClubForm({ ...clubForm, primary_color: e.target.value })} />
          <input className={inputClass} placeholder="Couleur secondaire" value={clubForm.secondary_color} onChange={(e) => setClubForm({ ...clubForm, secondary_color: e.target.value })} />
          <input className={inputClass} placeholder="Logo URL" value={clubForm.logo} onChange={(e) => setClubForm({ ...clubForm, logo: e.target.value })} />
          <input className={inputClass} placeholder="Hero URL" value={clubForm.hero} onChange={(e) => setClubForm({ ...clubForm, hero: e.target.value })} />
          <input className={inputClass} placeholder="Facebook URL" value={clubForm.facebook} onChange={(e) => setClubForm({ ...clubForm, facebook: e.target.value })} />
          <input className={inputClass} placeholder="YouTube URL" value={clubForm.youtube} onChange={(e) => setClubForm({ ...clubForm, youtube: e.target.value })} />
          <input className={inputClass} placeholder="Instagram URL" value={clubForm.instagram} onChange={(e) => setClubForm({ ...clubForm, instagram: e.target.value })} />
          <textarea className={`${inputClass} md:col-span-2`} rows={4} placeholder="Description" value={clubForm.description} onChange={(e) => setClubForm({ ...clubForm, description: e.target.value })} />
        </div>
      );
    }

    if (resource === "players") {
      return (
        <div className="grid md:grid-cols-2 gap-3">
          <select className={inputClass} value={playerForm.team_id} onChange={(e) => setPlayerForm({ ...playerForm, team_id: e.target.value })}>
            <option value="">Selectionner une equipe</option>
            {teamOptions.map((team) => (
              <option key={team.id} value={team.id}>{team.label}</option>
            ))}
          </select>
          <input className={inputClass} placeholder="Numero" type="number" value={playerForm.number} onChange={(e) => setPlayerForm({ ...playerForm, number: e.target.value })} />
          <input className={inputClass} placeholder="Prenom" value={playerForm.first_name} onChange={(e) => setPlayerForm({ ...playerForm, first_name: e.target.value })} />
          <input className={inputClass} placeholder="Nom" value={playerForm.last_name} onChange={(e) => setPlayerForm({ ...playerForm, last_name: e.target.value })} />
          <input className={inputClass} type="date" value={playerForm.date_of_birth} onChange={(e) => setPlayerForm({ ...playerForm, date_of_birth: e.target.value })} />
          <input className={inputClass} placeholder="Poste" value={playerForm.position} onChange={(e) => setPlayerForm({ ...playerForm, position: e.target.value })} />
          <input className={inputClass} placeholder="Taille" value={playerForm.height} onChange={(e) => setPlayerForm({ ...playerForm, height: e.target.value })} />
          <input className={inputClass} placeholder="Photo URL" value={playerForm.photo} onChange={(e) => setPlayerForm({ ...playerForm, photo: e.target.value })} />
        </div>
      );
    }

    if (resource === "news") {
      return (
        <div className="grid md:grid-cols-2 gap-3">
          <select className={inputClass} value={newsForm.club_id} onChange={(e) => setNewsForm({ ...newsForm, club_id: e.target.value })}>
            <option value="">Selectionner un club</option>
            {clubOptions.map((club) => (
              <option key={club.id} value={club.id}>{club.name}</option>
            ))}
          </select>
          <input className={inputClass} placeholder="Slug" value={newsForm.slug} onChange={(e) => setNewsForm({ ...newsForm, slug: e.target.value })} />
          <input className={`${inputClass} md:col-span-2`} placeholder="Titre" value={newsForm.title} onChange={(e) => setNewsForm({ ...newsForm, title: e.target.value })} />
          <input className={`${inputClass} md:col-span-2`} placeholder="Extrait" value={newsForm.excerpt} onChange={(e) => setNewsForm({ ...newsForm, excerpt: e.target.value })} />
          <textarea className={`${inputClass} md:col-span-2`} rows={5} placeholder="Contenu" value={newsForm.content} onChange={(e) => setNewsForm({ ...newsForm, content: e.target.value })} />
          <input className={inputClass} placeholder="Image" value={newsForm.image} onChange={(e) => setNewsForm({ ...newsForm, image: e.target.value })} />
          <input className={inputClass} placeholder="Categorie" value={newsForm.category} onChange={(e) => setNewsForm({ ...newsForm, category: e.target.value })} />
          <input className={inputClass} type="date" value={newsForm.published_at} onChange={(e) => setNewsForm({ ...newsForm, published_at: e.target.value })} />
          <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={newsForm.is_published} onChange={(e) => setNewsForm({ ...newsForm, is_published: e.target.checked })} /> Publie</label>
        </div>
      );
    }

    if (resource === "matches") {
      return (
        <div className="grid md:grid-cols-2 gap-3">
          <select className={inputClass} value={matchForm.club_id} onChange={(e) => setMatchForm({ ...matchForm, club_id: e.target.value })}>
            <option value="">Selectionner un club</option>
            {clubOptions.map((club) => (
              <option key={club.id} value={club.id}>{club.name}</option>
            ))}
          </select>
          <input className={inputClass} placeholder="Categorie" value={matchForm.category} onChange={(e) => setMatchForm({ ...matchForm, category: e.target.value })} />
          <input className={inputClass} placeholder="Adversaire" value={matchForm.opponent} onChange={(e) => setMatchForm({ ...matchForm, opponent: e.target.value })} />
          <input className={inputClass} placeholder="Competition" value={matchForm.competition} onChange={(e) => setMatchForm({ ...matchForm, competition: e.target.value })} />
          <input className={inputClass} type="date" value={matchForm.match_date} onChange={(e) => setMatchForm({ ...matchForm, match_date: e.target.value })} />
          <input className={inputClass} placeholder="Heure" value={matchForm.match_time} onChange={(e) => setMatchForm({ ...matchForm, match_time: e.target.value })} />
          <input className={inputClass} placeholder="Journee" value={matchForm.day_label} onChange={(e) => setMatchForm({ ...matchForm, day_label: e.target.value })} />
          <select className={inputClass} value={matchForm.venue} onChange={(e) => setMatchForm({ ...matchForm, venue: e.target.value })}><option value="home">Domicile</option><option value="away">Exterieur</option></select>
          <input className={inputClass} placeholder="Stade" value={matchForm.stadium} onChange={(e) => setMatchForm({ ...matchForm, stadium: e.target.value })} />
          <select className={inputClass} value={matchForm.status} onChange={(e) => setMatchForm({ ...matchForm, status: e.target.value as "scheduled" | "completed" })}><option value="scheduled">Programme</option><option value="completed">Termine</option></select>
          <input className={inputClass} placeholder="Score club" type="number" value={matchForm.club_score} onChange={(e) => setMatchForm({ ...matchForm, club_score: e.target.value })} />
          <input className={inputClass} placeholder="Score adversaire" type="number" value={matchForm.opponent_score} onChange={(e) => setMatchForm({ ...matchForm, opponent_score: e.target.value })} />
        </div>
      );
    }

    if (resource === "standings") {
      return (
        <div className="grid md:grid-cols-2 gap-3">
          <select className={inputClass} value={standingForm.club_id} onChange={(e) => setStandingForm({ ...standingForm, club_id: e.target.value })}>
            <option value="">Selectionner un club</option>
            {clubOptions.map((club) => (
              <option key={club.id} value={club.id}>{club.name}</option>
            ))}
          </select>
          <input className={inputClass} placeholder="Competition" value={standingForm.competition} onChange={(e) => setStandingForm({ ...standingForm, competition: e.target.value })} />
          <input className={inputClass} placeholder="Categorie" value={standingForm.category} onChange={(e) => setStandingForm({ ...standingForm, category: e.target.value })} />
          <input className={inputClass} placeholder="Saison" value={standingForm.season} onChange={(e) => setStandingForm({ ...standingForm, season: e.target.value })} />
          <input className={inputClass} placeholder="Position" type="number" value={standingForm.position} onChange={(e) => setStandingForm({ ...standingForm, position: e.target.value })} />
          <input className={inputClass} placeholder="Equipe" value={standingForm.team_name} onChange={(e) => setStandingForm({ ...standingForm, team_name: e.target.value })} />
          <input className={inputClass} placeholder="Joues" type="number" value={standingForm.played} onChange={(e) => setStandingForm({ ...standingForm, played: e.target.value })} />
          <input className={inputClass} placeholder="Victoires" type="number" value={standingForm.wins} onChange={(e) => setStandingForm({ ...standingForm, wins: e.target.value })} />
          <input className={inputClass} placeholder="Nuls" type="number" value={standingForm.draws} onChange={(e) => setStandingForm({ ...standingForm, draws: e.target.value })} />
          <input className={inputClass} placeholder="Defaites" type="number" value={standingForm.losses} onChange={(e) => setStandingForm({ ...standingForm, losses: e.target.value })} />
          <input className={inputClass} placeholder="Buts pour" type="number" value={standingForm.goals_for} onChange={(e) => setStandingForm({ ...standingForm, goals_for: e.target.value })} />
          <input className={inputClass} placeholder="Buts contre" type="number" value={standingForm.goals_against} onChange={(e) => setStandingForm({ ...standingForm, goals_against: e.target.value })} />
          <input className={inputClass} placeholder="Points" type="number" value={standingForm.points} onChange={(e) => setStandingForm({ ...standingForm, points: e.target.value })} />
          <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={standingForm.is_club} onChange={(e) => setStandingForm({ ...standingForm, is_club: e.target.checked })} /> Correspond au club courant</label>
        </div>
      );
    }

    return (
      <div className="grid md:grid-cols-2 gap-3">
        <select className={inputClass} value={productForm.club_id} onChange={(e) => setProductForm({ ...productForm, club_id: e.target.value })}>
          <option value="">Selectionner un club</option>
          {clubOptions.map((club) => (
            <option key={club.id} value={club.id}>{club.name}</option>
          ))}
        </select>
        <input className={inputClass} placeholder="Slug" value={productForm.slug} onChange={(e) => setProductForm({ ...productForm, slug: e.target.value })} />
        <input className={inputClass} placeholder="Nom FR" value={productForm.name_fr} onChange={(e) => setProductForm({ ...productForm, name_fr: e.target.value })} />
        <input className={inputClass} placeholder="Nom EN" value={productForm.name_en} onChange={(e) => setProductForm({ ...productForm, name_en: e.target.value })} />
        <input className={inputClass} placeholder="Categorie" value={productForm.category} onChange={(e) => setProductForm({ ...productForm, category: e.target.value })} />
        <input className={inputClass} placeholder="Prix" value={productForm.price} onChange={(e) => setProductForm({ ...productForm, price: e.target.value })} />
        <input className={inputClass} placeholder="Image" value={productForm.image} onChange={(e) => setProductForm({ ...productForm, image: e.target.value })} />
        <input className={inputClass} placeholder="Ancien prix" value={productForm.old_price} onChange={(e) => setProductForm({ ...productForm, old_price: e.target.value })} />
        <input className={inputClass} placeholder="Rating (0-5)" type="number" value={productForm.rating} onChange={(e) => setProductForm({ ...productForm, rating: e.target.value })} />
        <input className={inputClass} placeholder="Nombre d'avis" type="number" value={productForm.reviews} onChange={(e) => setProductForm({ ...productForm, reviews: e.target.value })} />
        <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={productForm.is_new} onChange={(e) => setProductForm({ ...productForm, is_new: e.target.checked })} /> Nouveau produit</label>
        <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={productForm.is_sale} onChange={(e) => setProductForm({ ...productForm, is_sale: e.target.checked })} /> En promotion</label>
        <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={productForm.is_active} onChange={(e) => setProductForm({ ...productForm, is_active: e.target.checked })} /> Actif</label>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <section className="bg-white border border-slate-200 rounded-lg p-4 sm:p-5 space-y-4">
        <div className="flex flex-wrap items-center gap-2 justify-between">
          <h2 className="font-semibold text-slate-900">Formulaire metier</h2>
          <div className="flex gap-2">
            <button onClick={resetForm} className="px-3 py-2 text-xs font-medium border border-slate-300 rounded-md hover:bg-slate-100">Nouveau</button>
            <button onClick={() => void submitCreate()} className="px-3 py-2 text-xs font-medium rounded-md bg-emerald-600 text-white">Creer</button>
            <button onClick={() => void submitUpdate()} className="px-3 py-2 text-xs font-medium rounded-md bg-blue-600 text-white">Mettre a jour</button>
            <button onClick={() => void submitDelete()} className="px-3 py-2 text-xs font-medium rounded-md bg-red-600 text-white">Supprimer</button>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center">
          <input
            type="number"
            placeholder="ID technique (update/delete)"
            value={manualRecordId}
            onChange={(e) => setManualRecordId(e.target.value)}
            className="sm:w-64 border border-slate-300 rounded-md px-3 py-2 bg-white text-sm"
          />
          {editingId !== null && <p className="text-xs text-slate-500">Edition en cours ID: {editingId}</p>}
        </div>

        {renderForm()}
      </section>

      <section className="bg-white border border-slate-200 rounded-lg p-4 sm:p-5 space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <h2 className="font-semibold text-slate-900">DataTable</h2>
          <div className="flex items-center gap-2">
            <input
              className="border border-slate-300 rounded-md px-3 py-1.5 text-sm"
              placeholder="Rechercher..."
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                setPage(1);
              }}
            />
            <button
              onClick={() => setSortAsc((prev) => !prev)}
              className="px-3 py-1.5 text-xs border border-slate-300 rounded-md hover:bg-slate-100"
            >
              Tri: {sortAsc ? "A->Z" : "Z->A"}
            </button>
            <button
              onClick={() => void loadRecords()}
              className="px-3 py-1.5 text-xs border border-slate-300 rounded-md hover:bg-slate-100"
            >
              Rafraichir
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="border-b border-slate-200 text-left">
                <th className="py-2 px-2 text-slate-600 font-medium">ID</th>
                <th className="py-2 px-2 text-slate-600 font-medium">Resume</th>
                <th className="py-2 px-2 text-slate-600 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {currentRows.map((record, idx) => {
                const id = extractId(record);
                return (
                  <tr key={id ?? `${resource}-${idx}`} className="border-b border-slate-100">
                    <td className="py-2 px-2 text-slate-600">{id ?? "n/a"}</td>
                    <td className="py-2 px-2 text-slate-900">{summary(record)}</td>
                    <td className="py-2 px-2">
                      <div className="flex gap-2">
                        <button onClick={() => startEdit(record)} className="px-2 py-1 text-xs border border-slate-300 rounded hover:bg-slate-100">Modifier</button>
                        {id && <button onClick={() => void submitDelete(id)} className="px-2 py-1 text-xs bg-red-600 text-white rounded">Suppr.</button>}
                      </div>
                    </td>
                  </tr>
                );
              })}
              {currentRows.length === 0 && (
                <tr>
                  <td colSpan={3} className="py-6 text-center text-slate-500 text-sm">Aucun resultat.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="flex items-center justify-between">
          <p className="text-xs text-slate-500">
            {filteredSorted.length} element(s) - page {page}/{totalPages}
          </p>
          <div className="flex gap-2">
            <button onClick={() => setPage((p) => Math.max(1, p - 1))} className="px-3 py-1 text-xs border border-slate-300 rounded disabled:opacity-50" disabled={page <= 1}>Precedent</button>
            <button onClick={() => setPage((p) => Math.min(totalPages, p + 1))} className="px-3 py-1 text-xs border border-slate-300 rounded disabled:opacity-50" disabled={page >= totalPages}>Suivant</button>
          </div>
        </div>
      </section>

      {loading && <p className="text-xs text-slate-500">Traitement en cours...</p>}
      {message && <p className="text-xs text-emerald-600">{message}</p>}
      {error && <p className="text-xs text-red-600">{error}</p>}
    </div>
  );
}
