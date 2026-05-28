"use client";

import type { ResolvedKnockoutMatch, TeamId } from "@/types";
import { TEAMS_BY_ID } from "@/data/teams";
import { Flag } from "./Flag";

interface Props {
  /** The match this circle belongs to */
  match: ResolvedKnockoutMatch;
  /** Which side of the match this circle is for */
  side: "home" | "away";
  onClick: () => void;
  size?: "sm" | "md" | "lg";
}

function shortLabel(label: string): string {
  // "3º Grupo C/E/F/H/I" → "3ºs" (generic third placeholder)
  // "1º Grupo E" → "1ºE"
  // "Vencedor M73" → "V73"
  // "Perdedor M101" → "P101"
  if (label.startsWith("3º Grupo")) return "3ºs";
  if (label.startsWith("1º Grupo ")) return `1º${label.slice(9, 10)}`;
  if (label.startsWith("2º Grupo ")) return `2º${label.slice(9, 10)}`;
  if (label.startsWith("Vencedor M")) return `V${label.slice(10)}`;
  if (label.startsWith("Perdedor M")) return `P${label.slice(10)}`;
  return label;
}

export function BracketCircle({ match, side, onClick, size = "md" }: Props) {
  const teamId: TeamId | null = side === "home" ? match.homeTeamId : match.awayTeamId;
  const label = side === "home" ? match.homeLabel : match.awayLabel;
  const goals = side === "home" ? match.score.homeGoals : match.score.awayGoals;
  const winnerId = match.winnerId;
  const loserId = match.loserId;
  const isWinner = !!winnerId && winnerId === teamId;
  const isLoser = !!loserId && loserId === teamId;

  const team = teamId ? TEAMS_BY_ID[teamId] : null;

  const sizeClass =
    size === "lg" ? "w-14 h-14" : size === "md" ? "w-11 h-11" : "w-9 h-9";

  // Resolved team: filled with bandeira; unresolved: empty with label
  return (
    <button
      onClick={onClick}
      title={team?.name ?? label}
      className={`${sizeClass} relative rounded-full border flex items-center justify-center transition shrink-0 ${
        isWinner
          ? "bg-zinc-100 border-zinc-100 text-zinc-950 hover:bg-white"
          : isLoser
            ? "bg-zinc-900 border-zinc-800 opacity-30 hover:opacity-50"
            : team
              ? "bg-zinc-900 border-zinc-700 hover:border-zinc-400"
              : "bg-transparent border-zinc-800 hover:border-zinc-600"
      }`}
    >
      {team ? (
        <Flag code={team.flag} className="!w-5 !h-4 rounded-sm" />
      ) : (
        <span className="text-[9px] font-bold text-zinc-500 tabular-nums">
          {shortLabel(label)}
        </span>
      )}
      {goals !== null && team && (
        <span
          className={`absolute -right-1 -bottom-1 text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center tabular-nums ${
            isWinner
              ? "bg-emerald-500 text-zinc-950"
              : "bg-zinc-800 text-zinc-400"
          }`}
        >
          {goals}
        </span>
      )}
    </button>
  );
}
