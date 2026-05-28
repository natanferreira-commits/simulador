"use client";

import type { ResolvedKnockoutMatch } from "@/types";
import { TEAMS_BY_ID } from "@/data/teams";
import { Flag } from "./Flag";

interface Props {
  match: ResolvedKnockoutMatch;
  onScoreChange: (
    homeGoals: number | null,
    awayGoals: number | null,
    penaltyWinner?: "home" | "away",
  ) => void;
}

function parseGoals(v: string): number | null {
  if (v === "") return null;
  const n = parseInt(v, 10);
  if (Number.isNaN(n) || n < 0) return null;
  return Math.min(n, 99);
}

function SlotSide({
  teamId,
  label,
  isWinner,
}: {
  teamId: string | null;
  label: string;
  isWinner: boolean;
}) {
  const team = teamId ? TEAMS_BY_ID[teamId] : null;
  return (
    <div className="flex items-center gap-2 min-w-0">
      {team ? <Flag code={team.flag} /> : <div className="w-6 h-[18px] bg-zinc-100 rounded-sm shrink-0" />}
      <span
        className={`text-xs truncate ${
          isWinner ? "font-bold text-zinc-900" : team ? "text-zinc-800" : "text-zinc-400 italic"
        }`}
      >
        {team?.name ?? label}
      </span>
    </div>
  );
}

export function KnockoutMatchCard({ match, onScoreChange }: Props) {
  const inputsDisabled = !match.homeTeamId || !match.awayTeamId;
  const score = match.score;
  const drawn =
    score.homeGoals !== null &&
    score.awayGoals !== null &&
    score.homeGoals === score.awayGoals;
  const homeWinner = match.winnerId !== null && match.winnerId === match.homeTeamId;
  const awayWinner = match.winnerId !== null && match.winnerId === match.awayTeamId;

  return (
    <div className="border border-zinc-200 rounded-md bg-white px-3 py-2.5 hover:border-zinc-300 transition">
      <div className="flex items-center justify-between mb-2">
        <span className="text-[9px] font-mono uppercase tracking-wider text-zinc-400">
          Jogo {match.id}
        </span>
        {match.needsPenaltyDecision && (
          <span className="text-[9px] font-semibold uppercase text-amber-600">
            definir pênaltis
          </span>
        )}
      </div>

      <div className="space-y-1.5">
        {/* HOME */}
        <div className="flex items-center justify-between gap-2">
          <div className="flex-1 min-w-0">
            <SlotSide
              teamId={match.homeTeamId}
              label={match.homeLabel}
              isWinner={homeWinner}
            />
          </div>
          <input
            type="number"
            min={0}
            max={99}
            disabled={inputsDisabled}
            value={score.homeGoals ?? ""}
            onChange={(e) =>
              onScoreChange(parseGoals(e.target.value), score.awayGoals, score.penaltyWinner)
            }
            className="w-8 h-7 text-center border border-zinc-300 rounded text-xs font-bold outline-none focus:border-zinc-900 focus:ring-2 focus:ring-zinc-900/10 tabular-nums disabled:bg-zinc-50 disabled:text-zinc-300"
            placeholder="-"
          />
        </div>
        {/* AWAY */}
        <div className="flex items-center justify-between gap-2">
          <div className="flex-1 min-w-0">
            <SlotSide
              teamId={match.awayTeamId}
              label={match.awayLabel}
              isWinner={awayWinner}
            />
          </div>
          <input
            type="number"
            min={0}
            max={99}
            disabled={inputsDisabled}
            value={score.awayGoals ?? ""}
            onChange={(e) =>
              onScoreChange(score.homeGoals, parseGoals(e.target.value), score.penaltyWinner)
            }
            className="w-8 h-7 text-center border border-zinc-300 rounded text-xs font-bold outline-none focus:border-zinc-900 focus:ring-2 focus:ring-zinc-900/10 tabular-nums disabled:bg-zinc-50 disabled:text-zinc-300"
            placeholder="-"
          />
        </div>
      </div>

      {drawn && (
        <div className="mt-2 pt-2 border-t border-zinc-100">
          <div className="text-[9px] uppercase tracking-wider text-zinc-500 mb-1">
            Pênaltis
          </div>
          <div className="flex gap-1">
            <button
              onClick={() => onScoreChange(score.homeGoals, score.awayGoals, "home")}
              className={`flex-1 h-6 text-[10px] rounded border transition ${
                score.penaltyWinner === "home"
                  ? "bg-zinc-900 text-white border-zinc-900"
                  : "bg-white text-zinc-600 border-zinc-300 hover:border-zinc-500"
              }`}
            >
              {match.homeTeamId ? TEAMS_BY_ID[match.homeTeamId]?.name.slice(0, 12) : "Mandante"}
            </button>
            <button
              onClick={() => onScoreChange(score.homeGoals, score.awayGoals, "away")}
              className={`flex-1 h-6 text-[10px] rounded border transition ${
                score.penaltyWinner === "away"
                  ? "bg-zinc-900 text-white border-zinc-900"
                  : "bg-white text-zinc-600 border-zinc-300 hover:border-zinc-500"
              }`}
            >
              {match.awayTeamId ? TEAMS_BY_ID[match.awayTeamId]?.name.slice(0, 12) : "Visitante"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
