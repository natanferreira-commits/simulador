"use client";

import type { ResolvedKnockoutMatch } from "@/types";
import { TEAMS_BY_ID } from "@/data/teams";
import { Flag } from "./Flag";

interface Props {
  match: ResolvedKnockoutMatch;
  onClick: () => void;
  size?: "sm" | "md" | "lg";
}

function Side({
  teamId,
  label,
  goals,
  isWinner,
  isLoser,
  penaltyMark,
}: {
  teamId: string | null;
  label: string;
  goals: number | null;
  isWinner: boolean;
  isLoser: boolean;
  penaltyMark?: boolean;
}) {
  const team = teamId ? TEAMS_BY_ID[teamId] : null;
  return (
    <div
      className={`flex items-center gap-2.5 px-3 py-2 min-w-0 ${
        isWinner ? "" : isLoser ? "opacity-50" : ""
      }`}
    >
      {team ? (
        <Flag code={team.flag} className="!w-5 !h-4" />
      ) : (
        <div className="w-5 h-4 bg-zinc-100 rounded-sm shrink-0" />
      )}
      <span
        className={`text-sm truncate flex-1 ${
          team
            ? isWinner
              ? "font-bold text-zinc-900"
              : "text-zinc-700"
            : "text-zinc-400 italic"
        }`}
      >
        {team?.code ?? label}
      </span>
      {penaltyMark && (
        <span className="text-[10px] text-zinc-400 font-mono">pen</span>
      )}
      <span
        className={`text-sm tabular-nums w-4 text-right ${
          isWinner ? "font-bold text-zinc-900" : "text-zinc-500"
        }`}
      >
        {goals !== null ? goals : ""}
      </span>
    </div>
  );
}

export function BracketSlot({ match, onClick, size = "sm" }: Props) {
  const score = match.score;
  const homeWinner = !!match.winnerId && match.winnerId === match.homeTeamId;
  const awayWinner = !!match.winnerId && match.winnerId === match.awayTeamId;
  const homeLoser = !!match.loserId && match.loserId === match.homeTeamId;
  const awayLoser = !!match.loserId && match.loserId === match.awayTeamId;
  const drawn =
    score.homeGoals !== null &&
    score.awayGoals !== null &&
    score.homeGoals === score.awayGoals;

  const widthClass = size === "lg" ? "w-64" : size === "md" ? "w-56" : "w-48";

  return (
    <button
      onClick={onClick}
      className={`${widthClass} bg-white border border-zinc-200 rounded-md hover:border-zinc-900 hover:shadow-md focus:border-zinc-900 focus:outline-none focus:ring-2 focus:ring-zinc-900/10 transition group text-left`}
    >
      <Side
        teamId={match.homeTeamId}
        label={match.homeLabel}
        goals={score.homeGoals}
        isWinner={homeWinner}
        isLoser={homeLoser}
        penaltyMark={drawn && score.penaltyWinner === "home"}
      />
      <div className="h-px bg-zinc-100" />
      <Side
        teamId={match.awayTeamId}
        label={match.awayLabel}
        goals={score.awayGoals}
        isWinner={awayWinner}
        isLoser={awayLoser}
        penaltyMark={drawn && score.penaltyWinner === "away"}
      />
      {match.needsPenaltyDecision && (
        <div className="text-[10px] text-amber-600 font-bold uppercase text-center py-1 border-t border-amber-200 bg-amber-50">
          definir pênaltis
        </div>
      )}
    </button>
  );
}
