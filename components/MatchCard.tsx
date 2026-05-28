"use client";

import type { GroupMatch } from "@/types";
import { TEAMS_BY_ID } from "@/data/teams";
import { Flag } from "./Flag";
import { formatMatchDate } from "@/lib/dateFormat";

interface Props {
  match: GroupMatch;
  onScoreChange: (homeGoals: number | null, awayGoals: number | null) => void;
}

function parseGoals(v: string): number | null {
  if (v === "") return null;
  const n = parseInt(v, 10);
  if (Number.isNaN(n) || n < 0) return null;
  return Math.min(n, 99);
}

export function MatchCard({ match, onScoreChange }: Props) {
  const home = TEAMS_BY_ID[match.homeId];
  const away = TEAMS_BY_ID[match.awayId];

  return (
    <div className="py-2.5">
      <div className="text-[10px] font-medium uppercase tracking-wider text-zinc-400 mb-1.5">
        {formatMatchDate(match.date)}
      </div>
      <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-2">
        <div className="flex items-center justify-end gap-1.5 min-w-0">
          <span className="text-xs font-semibold text-zinc-700 truncate">{home.code}</span>
          <Flag code={home.flag} />
        </div>
        <div className="flex items-center gap-1">
          <input
            type="number"
            min={0}
            max={99}
            value={match.homeGoals ?? ""}
            onChange={(e) => onScoreChange(parseGoals(e.target.value), match.awayGoals)}
            className="w-8 h-8 text-center border border-zinc-300 rounded text-sm font-bold text-zinc-900 outline-none focus:border-zinc-900 focus:ring-2 focus:ring-zinc-900/10 transition tabular-nums"
            placeholder=""
          />
          <span className="text-zinc-300 text-[10px] font-light">x</span>
          <input
            type="number"
            min={0}
            max={99}
            value={match.awayGoals ?? ""}
            onChange={(e) => onScoreChange(match.homeGoals, parseGoals(e.target.value))}
            className="w-8 h-8 text-center border border-zinc-300 rounded text-sm font-bold text-zinc-900 outline-none focus:border-zinc-900 focus:ring-2 focus:ring-zinc-900/10 transition tabular-nums"
            placeholder=""
          />
        </div>
        <div className="flex items-center gap-1.5 min-w-0">
          <Flag code={away.flag} />
          <span className="text-xs font-semibold text-zinc-700 truncate">{away.code}</span>
        </div>
      </div>
    </div>
  );
}
