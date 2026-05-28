"use client";

import type { GroupStanding } from "@/types";
import { TEAMS_BY_ID } from "@/data/teams";
import { Flag } from "./Flag";

interface Props {
  standings: GroupStanding[];
}

export function GroupTable({ standings }: Props) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="text-[10px] font-semibold uppercase tracking-wider text-zinc-500 border-b border-zinc-800">
            <th className="text-left py-2 px-1 w-6"></th>
            <th className="text-left py-2 px-1 font-medium">Classificação</th>
            <th className="text-center py-2 px-2 w-8">P</th>
            <th className="text-center py-2 px-2 w-8">J</th>
            <th className="text-center py-2 px-2 w-8">V</th>
            <th className="text-center py-2 px-2 w-8">E</th>
            <th className="text-center py-2 px-2 w-8">D</th>
            <th className="text-center py-2 px-2 w-9">GP</th>
            <th className="text-center py-2 px-2 w-9">GC</th>
            <th className="text-center py-2 px-2 w-9">SG</th>
          </tr>
        </thead>
        <tbody>
          {standings.map((s) => {
            const team = TEAMS_BY_ID[s.teamId];
            return (
              <tr
                key={s.teamId}
                className="border-b border-zinc-900 hover:bg-zinc-900/50 transition"
                title={s.tiebreakerReason ? `Desempate: ${s.tiebreakerReason}` : undefined}
              >
                <td className="py-2.5 px-1 text-blue-400 text-xs font-medium tabular-nums">
                  {s.position}
                </td>
                <td className="py-2.5 px-1">
                  <div className="flex items-center gap-2">
                    <Flag code={team.flag} />
                    <span className="text-zinc-100 font-medium">{team.name}</span>
                  </div>
                </td>
                <td className="text-center py-2.5 px-2 font-bold tabular-nums text-zinc-50">{s.points}</td>
                <td className="text-center py-2.5 px-2 tabular-nums text-zinc-500">{s.played}</td>
                <td className="text-center py-2.5 px-2 tabular-nums text-zinc-500">{s.wins}</td>
                <td className="text-center py-2.5 px-2 tabular-nums text-zinc-500">{s.draws}</td>
                <td className="text-center py-2.5 px-2 tabular-nums text-zinc-500">{s.losses}</td>
                <td className="text-center py-2.5 px-2 tabular-nums text-zinc-500">{s.goalsFor}</td>
                <td className="text-center py-2.5 px-2 tabular-nums text-zinc-500">{s.goalsAgainst}</td>
                <td className="text-center py-2.5 px-2 tabular-nums text-zinc-500">{s.goalDiff}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
