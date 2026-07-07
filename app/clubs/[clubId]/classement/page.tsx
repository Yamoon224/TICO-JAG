"use client";

import { use, useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import { ClubPageHero } from "@/components/ClubPageHero";
import { useClubBrand } from "@/lib/club-brand";
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

    const th = "text-xs font-semibold text-muted-foreground px-2 py-2 text-center";
    const td = "text-sm text-center px-2 py-3";
    const renderStat = (value?: number) => (typeof value === "number" ? value : "-");
    const renderGd = (e: StandingEntry) => {
        if (typeof e.gd === "number") return e.gd;
        if (typeof e.butsPour === "number" && typeof e.butsContre === "number") return e.butsPour - e.butsContre;
        return "-";
    };

    return (
        <div className="min-h-screen bg-background">
            <Navbar />

            <ClubPageHero clubId={clubId} club={club} label={locale === "fr" ? "Classement" : "Standings"} />

            {/* Group tabs */}
            {groupes.length > 1 && (
                <div className="border-b border-border bg-card">
                    <div className="max-w-5xl mx-auto px-4 sm:px-6 flex gap-1 py-2 overflow-x-auto">
                        {groupes.map((g, i) => (
                            <button key={i} onClick={() => setActiveIdx(i)}
                                className={`px-4 py-1.5 rounded-sm text-sm font-semibold whitespace-nowrap transition-colors ${activeIdx === i ? "text-white" : "text-muted-foreground hover:text-foreground"
                                    }`}
                                style={activeIdx === i ? { backgroundColor: club.color } : {}}>
                                {g.categorie}
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
                        <div className="mb-4 flex flex-wrap gap-2 items-baseline">
                            <h2 className="font-display font-black text-foreground text-lg">{groupe.competition} — {groupe.categorie}</h2>
                            <span className="text-sm text-muted-foreground">{locale === "fr" ? `Saison ${groupe.saison}` : `Season ${groupe.saison}`}</span>
                        </div>

                        <div className="overflow-x-auto bg-card border border-border rounded-sm">
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
                                            className={`border-b border-border last:border-0 ${e.isClub ? "font-bold" : ""
                                                }`}
                                            style={e.isClub ? { backgroundColor: `${club.color}15` } : {}}>
                                            <td className={`${td} pl-4 font-black`} style={e.isClub ? { color: club.color } : {}}>{e.position}</td>
                                            <td className={`${td} text-left font-semibold text-foreground`}>
                                                {e.isClub ? <span style={{ color: club.color }}>{e.equipe}</span> : e.equipe}
                                            </td>
                                            <td className={td}>{renderStat(e.joues)}</td>
                                            <td className={`${td} text-green-600`}>{renderStat(e.victoires)}</td>
                                            <td className={`${td} text-amber-500`}>{renderStat(e.nuls)}</td>
                                            <td className={`${td} text-red-500`}>{renderStat(e.defaites)}</td>
                                            <td className={td}>{renderStat(e.butsPour)}</td>
                                            <td className={td}>{renderStat(e.butsContre)}</td>
                                            <td className={td}>{renderGd(e)}</td>
                                            <td className={`${td} font-display font-black text-foreground text-base`}>{e.points}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </>
                )}
            </div>

            <footer className="border-t border-border bg-muted/30 py-6 text-center text-muted-foreground text-sm">
                <p className="font-semibold text-foreground">{club.nom}</p>
            </footer>
        </div>
    );
}
