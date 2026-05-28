"use client";

import type { ResolvedKnockoutMatch } from "@/types";
import { STAGES_ORDER } from "@/data/bracket";
import { KnockoutMatchCard } from "./KnockoutMatchCard";

interface Props {
  matches: ResolvedKnockoutMatch[];
  onScoreChange: (
    matchId: number,
    homeGoals: number | null,
    awayGoals: number | null,
    penaltyWinner?: "home" | "away",
  ) => void;
}

export function BracketView({ matches, onScoreChange }: Props) {
  const byStage = STAGES_ORDER.map((s) => ({
    ...s,
    matches: matches.filter((m) => m.stage === s.stage),
  }));

  return (
    <div className="overflow-x-auto pb-4">
      <div className="flex gap-4 min-w-max">
        {byStage.map(({ stage, label, matches: stageMatches }) => (
          <div key={stage} className="w-[260px] shrink-0">
            <div className="text-[10px] font-bold uppercase tracking-widest text-zinc-700 mb-3 sticky top-0">
              {label}
              <span className="ml-2 text-zinc-400 font-normal">
                {stageMatches.length} {stageMatches.length === 1 ? "jogo" : "jogos"}
              </span>
            </div>
            <div className="space-y-2">
              {stageMatches.map((m) => (
                <KnockoutMatchCard
                  key={m.id}
                  match={m}
                  onScoreChange={(h, a, pw) => onScoreChange(m.id, h, a, pw)}
                />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
