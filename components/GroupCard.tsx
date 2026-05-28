"use client";

import { useState } from "react";
import type { GroupMatch, GroupStanding } from "@/types";
import { MatchCard } from "./MatchCard";
import { GroupTable } from "./GroupTable";

interface Props {
  groupLetter: string;
  standings: GroupStanding[];
  matches: GroupMatch[];
  onScoreChange: (matchId: string, homeGoals: number | null, awayGoals: number | null) => void;
}

const ROUND_LABELS = ["1ª RODADA", "2ª RODADA", "3ª RODADA"];

export function GroupCard({
  groupLetter,
  standings,
  matches,
  onScoreChange,
}: Props) {
  const [round, setRound] = useState<1 | 2 | 3>(1);

  const matchesInRound = matches.filter((m) => m.round === round);

  return (
    <section className="mb-10">
      <h2 className="text-2xl font-extrabold text-zinc-50 mb-3 tracking-tight">
        GRUPO {groupLetter}
      </h2>
      <div className="grid lg:grid-cols-[1fr_300px] gap-8 items-start border-t border-zinc-800 pt-1">
        {/* Standings */}
        <div>
          <GroupTable standings={standings} />
        </div>

        {/* Matches for selected round */}
        <div className="lg:border-l lg:border-zinc-900 lg:pl-6">
          <div className="flex items-center justify-between mb-1 py-2 border-b border-zinc-900">
            <button
              onClick={() => setRound((r) => (r > 1 ? ((r - 1) as 1 | 2 | 3) : 1))}
              disabled={round === 1}
              className="w-6 h-6 flex items-center justify-center text-zinc-500 hover:text-zinc-100 disabled:opacity-20 disabled:cursor-not-allowed transition"
              aria-label="Rodada anterior"
            >
              ◀
            </button>
            <div className="text-xs font-bold uppercase tracking-widest text-zinc-300">
              {ROUND_LABELS[round - 1]}
            </div>
            <button
              onClick={() => setRound((r) => (r < 3 ? ((r + 1) as 1 | 2 | 3) : 3))}
              disabled={round === 3}
              className="w-6 h-6 flex items-center justify-center text-zinc-500 hover:text-zinc-100 disabled:opacity-20 disabled:cursor-not-allowed transition"
              aria-label="Próxima rodada"
            >
              ▶
            </button>
          </div>
          <div className="divide-y divide-zinc-900">
            {matchesInRound.map((m) => (
              <MatchCard
                key={m.id}
                match={m}
                onScoreChange={(h, a) => onScoreChange(m.id, h, a)}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
