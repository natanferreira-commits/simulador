"use client";

import type { GroupMatch } from "@/types";
import { TEAMS_BY_ID } from "@/data/teams";
import { Flag } from "./Flag";

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
    <div className="py-3 px-1 border-b border-zinc-100 last:border-0">
      <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-3">
        <div className="flex items-center gap-2 justify-end min-w-0">
          <span className="text-sm text-zinc-900 truncate text-right">{home.name}</span>
          <Flag code={home.flag} />
        </div>
        <div className="flex items-center gap-1.5">
          <input
            type="number"
            min={0}
            max={99}
            value={match.homeGoals ?? ""}
            onChange={(e) => onScoreChange(parseGoals(e.target.value), match.awayGoals)}
            className="w-9 h-9 text-center border border-zinc-300 rounded font-bold text-zinc-900 outline-none focus:border-zinc-900 focus:ring-2 focus:ring-zinc-900/10 transition tabular-nums"
            placeholder="-"
          />
          <span className="text-zinc-300 text-xs font-light">×</span>
          <input
            type="number"
            min={0}
            max={99}
            value={match.awayGoals ?? ""}
            onChange={(e) => onScoreChange(match.homeGoals, parseGoals(e.target.value))}
            className="w-9 h-9 text-center border border-zinc-300 rounded font-bold text-zinc-900 outline-none focus:border-zinc-900 focus:ring-2 focus:ring-zinc-900/10 transition tabular-nums"
            placeholder="-"
          />
        </div>
        <div className="flex items-center gap-2 min-w-0">
          <Flag code={away.flag} />
          <span className="text-sm text-zinc-900 truncate">{away.name}</span>
        </div>
      </div>
    </div>
  );
}
