"use client";

import { useEffect, useState, type CSSProperties } from "react";
import Link from "next/link";
import Image from "next/image";
import Navbar from "@/components/Navbar";
import { SiteFooter } from "@/components/Footer";
import { useLocale } from "@/lib/locale-context";
import { fetchClubsWithTeams, type ClubApiModel } from "@/lib/api";

const FALLBACK_LOGO: Record<string, string> = {
    jag: "/images/jag-logo.png",
    atletico: "/images/atletico-logo.png",
};
const FALLBACK_HERO: Record<string, string> = {
    jag: "/images/jag-hero.png",
    atletico: "/images/atletico-hero.png",
};

type HomeClub = {
    id: string;
    nom: string;
    acronyme: string;
    ville: string;
    logo: string;
    hero: string;
    couleurPrimaire: string;
    description: string;
    stats: { label: { fr: string; en: string }; value: string | number }[];
};

function toHomeClub(club: ClubApiModel, locale: "fr" | "en"): HomeClub {
    const foundedYear = club.founded_at ? new Date(club.founded_at).getFullYear() : undefined;

    return {
        id: club.slug,
        nom: club.name,
        acronyme: club.acronym ?? club.name,
        ville: club.city ?? "",
        logo: club.logo || FALLBACK_LOGO[club.slug] || "/images/jag-logo.png",
        hero: club.hero || FALLBACK_HERO[club.slug] || "/images/jag-hero.png",
        couleurPrimaire: club.primary_color || "#CC0000",
        description: (locale === "en" ? club.description_en : club.description) || club.description || "",
        stats: [
            { label: { fr: "Fondation", en: "Founded" }, value: foundedYear ?? "—" },
            { label: { fr: "Joueurs", en: "Players" }, value: club.stats ? `${club.stats.players_count}+` : "—" },
            { label: { fr: "Équipes", en: "Squads" }, value: club.stats?.teams_count ?? "—" },
            { label: { fr: "Ville", en: "City" }, value: club.city ?? "—" },
        ],
    };
}

const CATEGORIES = ["cadets", "juniors", "seniors"] as const;

export default function HomePage() {
    const { locale, t } = useLocale();
    const [clubs, setClubs] = useState<HomeClub[]>([]);

    useEffect(() => {
        let cancelled = false;
        fetchClubsWithTeams().then((data) => {
            if (!cancelled) setClubs(data.map((club) => toHomeClub(club, locale)));
        });
        return () => {
            cancelled = true;
        };
    }, [locale]);

    return (
        <div className="min-h-screen bg-background">
            <Navbar />

            {/* ── Hero ────────────────────────────────────────── */}
            <section className="relative overflow-hidden bg-[#0C0E11] text-white">
                <Image
                    src="/images/jag-hero.png"
                    alt="Football guinéen"
                    fill
                    className="object-cover opacity-20"
                    priority
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0C0E11] via-[#0C0E11]/70 to-[#0C0E11]/30" />
                <div className="relative max-w-5xl mx-auto px-4 sm:px-6 py-28 md:py-40 text-center">
                    <p className="eyebrow text-white/60 mb-5 justify-center flex">
                        {t.home.tagline}
                    </p>
                    <h1 className="font-display text-5xl sm:text-7xl md:text-8xl font-black uppercase text-balance leading-[0.92] tracking-tight mb-7">
                        {t.home.heroTitle}
                    </h1>
                    <p className="text-base md:text-lg text-white/55 max-w-xl mx-auto leading-relaxed mb-11">
                        {t.home.heroSub}
                    </p>
                    <div className="flex flex-wrap gap-3 justify-center">
                        {clubs.map((club) => (
                            <Link
                                key={club.id}
                                href={`/clubs/${club.id}`}
                                className="px-7 py-3.5 font-display font-bold text-sm uppercase tracking-wide transition-transform hover:scale-105"
                                style={{ backgroundColor: club.couleurPrimaire, color: "#fff" }}
                            >
                                {club.nom}
                            </Link>
                        ))}
                    </div>
                </div>
                <div className="relative h-[3px] bg-gradient-to-r from-jag via-white/25 to-atletico" aria-hidden />
            </section>

            {/* ── Message du Président ────────────────────────── */}
            <section className="max-w-6xl mx-auto px-4 sm:px-6 py-16 md:py-24">
                <div className="mb-10">
                    <p className="eyebrow mb-2">{locale === "fr" ? "Direction" : "Leadership"}</p>
                    <h2 className="font-display text-2xl md:text-3xl font-black text-foreground uppercase tracking-tight mb-3">
                        Message du Président
                    </h2>
                    <span className="section-rule" style={{ background: "var(--foreground)" }} />
                </div>
                <div className="bg-card border border-border flex flex-col md:flex-row gap-0">
                    {/* Photo */}
                    <div className="relative md:w-72 shrink-0 h-64 md:h-auto">
                        <Image
                            src="/images/president.png"
                            alt="Le Président"
                            fill
                            className="object-cover object-top"
                        />
                    </div>
                    {/* Text */}
                    <div className="flex flex-col justify-center p-7 md:p-10 gap-5">
                        <p className="text-muted-foreground text-sm md:text-base leading-relaxed">
                            C&apos;est avec une immense fierté que je dirige ces deux institutions de football. Je suis une personne qui agit rapidement et efficacement, car les projets qui stagnent finissent par tomber dans l&apos;oubli. Mon ambition est de moderniser le football guinéen, en favorisant bien sûr des collaborations mutuellement bénéfiques. Je reste à l&apos;écoute et disponible à tout moment.
                        </p>
                        <blockquote className="border-l-4 border-foreground/20 pl-4">
                            <p className="text-foreground font-semibold text-sm md:text-base italic leading-snug">
                                &ldquo;La stagnation mène à l&apos;oubli&nbsp;; c&apos;est à travers l&apos;action et la collaboration que nous façonnerons l&apos;avenir du football guinéen.&rdquo;
                            </p>
                        </blockquote>
                        <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
                            — Moussa TOURE, Le Président, Guinée Football Clubs
                        </p>
                    </div>
                </div>
            </section>

            {/* ── Club cards ──────────────────────────────────── */}
            <section className="max-w-6xl mx-auto px-4 sm:px-6 py-16 md:py-24">
                <div className="mb-10">
                    <p className="eyebrow mb-2">{locale === "fr" ? "Nos institutions" : "Our institutions"}</p>
                    <h2 className="font-display text-2xl md:text-3xl font-black text-foreground uppercase tracking-tight mb-3">
                        {t.home.ourClubs}
                    </h2>
                    <span className="section-rule" style={{ background: "var(--foreground)" }} />
                </div>

                <div className="grid sm:grid-cols-2 gap-6">
                    {clubs.map((club) => (
                        <div
                            key={club.id}
                            className="group bg-card border border-border hover:border-club/50 hover:shadow-xl transition-all duration-300"
                            style={{ "--club": club.couleurPrimaire } as CSSProperties}
                        >
                            {/* Hero image */}
                            <div className="relative h-44 sm:h-52 overflow-hidden">
                                <Image
                                    src={club.hero}
                                    alt={club.nom}
                                    fill
                                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/25 to-transparent" />
                                <div className="scoreboard-tile absolute inset-x-0 bottom-0 h-[3px]" aria-hidden />
                                <div className="absolute bottom-4 left-4 flex items-end gap-3">
                                    <Image
                                        src={club.logo}
                                        alt={club.nom}
                                        width={48}
                                        height={48}
                                        className="rounded-full border-2 border-white object-cover shadow"
                                    />
                                    <div>
                                        <p className="font-display text-white font-black text-xl uppercase leading-tight">{club.acronyme}</p>
                                        <p className="text-white/60 text-xs">{club.ville}</p>
                                    </div>
                                </div>
                            </div>

                            <div className="p-5 sm:p-6">
                                <h3 className="font-display font-black text-foreground text-lg uppercase mb-1.5">{club.nom}</h3>
                                <p className="text-muted-foreground text-sm leading-relaxed line-clamp-2 mb-4">
                                    {club.description}
                                </p>

                                {/* Stats */}
                                <div className="grid grid-cols-4 gap-1.5 mb-5">
                                    {club.stats.map((s) => (
                                        <div key={s.label.fr} className="text-center bg-muted py-2 px-1">
                                            <p className="font-display font-black text-base text-foreground leading-none mb-1 tabular-nums">{s.value}</p>
                                            <p className="text-[11px] text-muted-foreground truncate">{s.label[locale]}</p>
                                        </div>
                                    ))}
                                </div>

                                {/* Category links */}
                                <div className="flex flex-wrap gap-1.5 mb-4">
                                    {CATEGORIES.map((cat) => (
                                        <Link
                                            key={cat}
                                            href={`/clubs/${club.id}/equipe/${cat}`}
                                            className="text-xs font-bold uppercase px-3 py-1.5 border border-club/40 text-club hover:bg-club hover:text-white hover:border-club transition-colors"
                                        >
                                            {t.categories[cat.charAt(0).toUpperCase() + cat.slice(1) as keyof typeof t.categories]}
                                        </Link>
                                    ))}
                                </div>

                                <Link
                                    href={`/clubs/${club.id}`}
                                    className="flex items-center justify-center w-full py-3 font-display font-bold text-sm uppercase tracking-wide transition-opacity hover:opacity-90 text-white bg-club"
                                >
                                    {t.home.viewClub} &rarr;
                                </Link>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            <SiteFooter />
        </div>
    );
}
