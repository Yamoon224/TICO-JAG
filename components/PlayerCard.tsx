import Image from "next/image";

type Player = {
  prenom: string;
  nom: string;
  dateNaissance: string;
  poste: string;
  taille: string;
  numero: number;
  photo?: string;
};

type Props = {
  player: Player;
  primaryColor: string;
};

function calcAge(dateStr: string): number {
  const birth = new Date(dateStr);
  const today = new Date();
  let age = today.getFullYear() - birth.getFullYear();
  const m = today.getMonth() - birth.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) age--;
  return age;
}

function formatDate(dateStr: string): string {
  const d = new Date(dateStr);
  return d.toLocaleDateString("fr-FR", { day: "2-digit", month: "short", year: "numeric" });
}

const POSTE_STYLE: Record<string, string> = {
  Gardien:    "bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300",
  Défenseur:  "bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300",
  Milieu:     "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300",
  Attaquant:  "bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300",
};

export default function PlayerCard({ player, primaryColor }: Props) {
  const age = calcAge(player.dateNaissance);
  const posteClass = POSTE_STYLE[player.poste] ?? "bg-muted text-muted-foreground";

  return (
    <div
      className="bg-card border border-border rounded-2xl overflow-hidden hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200 group"
      style={{ "--club": primaryColor } as React.CSSProperties}
    >
      {/* Photo area */}
      <div className="relative flex items-end justify-center h-36 sm:h-40 overflow-hidden bg-club/10">
        {/* Big ghost number */}
        <span className="font-display absolute inset-0 flex items-center justify-center text-[5.5rem] font-black leading-none select-none pointer-events-none text-club/15 tabular-nums">
          {player.numero}
        </span>
        <Image
          src={player.photo ?? "/images/player-placeholder.jpg"}
          alt={`${player.prenom} ${player.nom}`}
          width={120}
          height={140}
          loading="eager"
          className="relative z-10 h-32 sm:h-36 w-auto object-contain group-hover:scale-105 transition-transform duration-300"
        />
        {/* Number badge */}
        <span className="font-display absolute top-2.5 left-2.5 w-7 h-7 rounded-full flex items-center justify-center text-xs font-black text-white shadow bg-club tabular-nums">
          {player.numero}
        </span>
        {/* Position badge */}
        <span className={`absolute top-2.5 right-2.5 text-[10px] font-bold px-1.5 py-0.5 rounded-md ${posteClass}`}>
          {player.poste.slice(0, 3).toUpperCase()}
        </span>
      </div>

      {/* Info */}
      <div className="p-3.5">
        <p className="font-display font-black text-foreground text-sm leading-tight truncate">
          {player.prenom} <span className="uppercase">{player.nom}</span>
        </p>

        <div className="mt-2.5 grid grid-cols-2 gap-1.5">
          <div className="bg-muted rounded-lg px-2 py-1.5">
            <p className="text-muted-foreground text-[10px] leading-none mb-1">Naissance</p>
            <p className="font-semibold text-foreground text-xs leading-none">{formatDate(player.dateNaissance)}</p>
          </div>
          <div className="bg-muted rounded-lg px-2 py-1.5">
            <p className="text-muted-foreground text-[10px] leading-none mb-1">Âge</p>
            <p className="font-semibold text-foreground text-xs leading-none tabular-nums">{age} ans</p>
          </div>
          <div className="bg-muted rounded-lg px-2 py-1.5">
            <p className="text-muted-foreground text-[10px] leading-none mb-1">Taille</p>
            <p className="font-semibold text-foreground text-xs leading-none">{player.taille}</p>
          </div>
          <div className="bg-muted rounded-lg px-2 py-1.5">
            <p className="text-muted-foreground text-[10px] leading-none mb-1">N°</p>
            <p className="font-semibold text-foreground text-xs leading-none tabular-nums">{player.numero}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
