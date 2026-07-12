"use client";

import { use, useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import { ClubPageHero } from "@/components/ClubPageHero";
import { ClubFooter } from "@/components/Footer";
import { useClubBrand, clubVars } from "@/lib/club-brand";
import { fetchClubStandings, type StandingEntry, type StandingGroup } from "@/lib/api";
import { useLocale } from "@/lib/locale-context";

export default function ClassementPage({ params }: { params: Promise<{ clubId: string }> }) {
    const { clubId } = use(params);
    const { locale } = useLocale();
    const club = useClubBrand(clubId);
    const [groupes, setGroupes] = useState<StandingGroup[]>([]);
    const [loading, setLoading] = useState(true);
    const [activeIdx, setActiveIdx] = useState(0);
    const groupe = groupes[activeIdx];

    useEffect(() => {
        let active = true;

        fetchClubStandings(clubId)
            .then((items) => {
                if (active) {
                    setGroupes(items);
                    setActiveIdx(0);
                }
            })
            .catch(() => {
                if (active) {
                    setGroupes([]);
                }
            })
            .finally(() => {
                if (active) {
                    setLoading(false);
                }
            });

        return () => {
            active = false;
        };
    }, [clubId]);

    const th = "text-xs font-semibold text-muted-foreground px-2 py-2.5 text-center";
    const td = "text-sm text-center px-2 py-3 tabular-nums";
    const renderStat = (value?: number) => (typeof value === "number" ? value : "-");
    const renderGd = (e: StandingEntry) => {
        if (typeof e.gd === "number") return e.gd;
        if (typeof e.butsPour === "number" && typeof e.butsContre === "number") return e.butsPour - e.butsContre;
        return "-";
    };

    return (
        <div className="min-h-screen bg-background" style={clubVars(club)}>
            <Navbar />

            <ClubPageHero clubId={clubId} club={club} label={locale === "fr" ? "Classement" : "Standings"} />

            {/* Group tabs */}
            {groupes.length > 1 && (
                <div className="border-b border-border bg-card">
                    <div className="max-w-5xl mx-auto px-4 sm:px-6 flex gap-6 overflow-x-auto">
                        {groupes.map((g, i) => (
                            <button key={i} onClick={() => setActiveIdx(i)}
                                className={`relative py-3.5 text-sm font-bold uppercase tracking-wide whitespace-nowrap transition-colors ${
                                    activeIdx === i ? "text-foreground" : "text-muted-foreground hover:text-foreground"
                                }`}>
                                {g.categorie}
                                <span className={`absolute left-0 right-0 -bottom-px h-[3px] bg-club transition-transform origin-left duration-200 ${activeIdx === i ? "scale-x-100" : "scale-x-0"}`} />
                            </button>
                        ))}
                    </div>
                </div>
            )}

            <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
                {loading && !groupe && (
                    <p className="text-center text-muted-foreground py-12">Chargement...</p>
                )}

                {groupe && (
                    <>
                        <div className="mb-5">
                            <p className="eyebrow mb-1.5">{groupe.competition} — {groupe.categorie}</p>
                            <span className="text-sm text-muted-foreground">{locale === "fr" ? `Saison ${groupe.saison}` : `Season ${groupe.saison}`}</span>
                        </div>

                        {/* Desktop / tablet table */}
                        <div className="hidden sm:block overflow-x-auto bg-card border border-border">
                            <table className="w-full">
                                <thead>
                                    <tr className="border-b border-border">
                                        <th className={`${th} text-left pl-4 w-8`}>#</th>
                                        <th className={`${th} text-left pl-2`}>{locale === "fr" ? "Équipe" : "Team"}</th>
                                        <th className={th}>J</th>
                                        <th className={th}>V</th>
                                        <th className={th}>N</th>
                                        <th className={th}>D</th>
                                        <th className={th}>Bp</th>
                                        <th className={th}>Bc</th>
                                        <th className={th}>GD</th>
                                        <th className={`${th} font-black text-foreground`}>Pts</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {groupe.entrees.map((e) => (
                                        <tr key={e.position}
                                            className={`border-b border-border last:border-0 ${e.isClub ? "font-bold bg-club/[0.06] border-l-2 border-l-club" : ""}`}>
                                            <td className={`${td} pl-4 font-black ${e.isClub ? "text-club" : ""}`}>{e.position}</td>
                                            <td className={`${td} text-left font-semibold text-foreground ${e.isClub ? "text-club" : ""}`}>
                                                {e.equipe}
                                            </td>
                                            <td className={td}>{renderStat(e.joues)}</td>
                                            <td className={`${td} text-emerald-600 dark:text-emerald-400`}>{renderStat(e.victoires)}</td>
                                            <td className={`${td} text-amber-600 dark:text-amber-400`}>{renderStat(e.nuls)}</td>
                                            <td className={`${td} text-red-600 dark:text-red-400`}>{renderStat(e.defaites)}</td>
                                            <td className={td}>{renderStat(e.butsPour)}</td>
                                            <td className={td}>{renderStat(e.butsContre)}</td>
                                            <td className={td}>{renderGd(e)}</td>
                                            <td className={`${td} font-display font-black text-foreground text-base`}>{e.points}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        {/* Mobile stacked cards */}
                        <div className="sm:hidden flex flex-col gap-2">
                            {groupe.entrees.map((e) => (
                                <div
                                    key={e.position}
                                    className={`bg-card border border-border px-3.5 py-3 ${e.isClub ? "border-l-2 border-l-club bg-club/[0.06]" : ""}`}
                                >
                                    <div className="flex items-center gap-3">
                                        <span className={`font-display font-black text-lg w-6 text-center tabular-nums ${e.isClub ? "text-club" : "text-muted-foreground"}`}>
                                            {e.position}
                                        </span>
                                        <span className={`flex-1 min-w-0 font-semibold text-sm truncate ${e.isClub ? "text-club" : "text-foreground"}`}>
                                            {e.equipe}
                                        </span>
                                        <span className="font-display font-black text-foreground text-lg tabular-nums shrink-0">{e.points}</span>
                                        <span className="text-[10px] text-muted-foreground uppercase shrink-0">pts</span>
                                    </div>
                                    <div className="flex items-center gap-3 mt-2 pl-9 text-xs text-muted-foreground tabular-nums">
                                        <span>{renderStat(e.joues)} J</span>
                                        <span className="text-emerald-600 dark:text-emerald-400">{renderStat(e.victoires)} V</span>
                                        <span className="text-amber-600 dark:text-amber-400">{renderStat(e.nuls)} N</span>
                                        <span className="text-red-600 dark:text-red-400">{renderStat(e.defaites)} D</span>
                                        <span>{renderGd(e)} GD</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </>
                )}
            </div>

            <ClubFooter clubId={clubId} club={club} />
        </div>
    );
}
