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
          <tr className="text-[10px] font-semibold uppercase tracking-wider text-zinc-500 border-b border-zinc-200">
            <th className="text-left py-2 px-1 w-8">#</th>
            <th className="text-left py-2 px-1">Classificação</th>
            <th className="text-center py-2 px-2 w-9">P</th>
            <th className="text-center py-2 px-2 w-9">J</th>
            <th className="text-center py-2 px-2 w-9">V</th>
            <th className="text-center py-2 px-2 w-9">E</th>
            <th className="text-center py-2 px-2 w-9">D</th>
            <th className="text-center py-2 px-2 w-10">GP</th>
            <th className="text-center py-2 px-2 w-10">GC</th>
            <th className="text-center py-2 px-2 w-10">SG</th>
          </tr>
        </thead>
        <tbody>
          {standings.map((s) => {
            const team = TEAMS_BY_ID[s.teamId];
            const qualifies = s.position <= 2;
            const isThird = s.position === 3;
            return (
              <tr
                key={s.teamId}
                className={`border-b border-zinc-100 hover:bg-zinc-50/70 transition ${
                  s.position === 2 ? "border-b-2 border-dashed border-zinc-300" : ""
                } ${isThird ? "border-b-2 border-dashed border-zinc-200" : ""}`}
                title={s.tiebreakerReason ? `Desempate: ${s.tiebreakerReason}` : undefined}
              >
                <td className="py-2.5 px-1 text-zinc-400 text-xs tabular-nums">
                  {s.position}
                </td>
                <td className="py-2.5 px-1">
                  <div className="flex items-center gap-2">
                    <Flag code={team.flag} />
                    <span className={`text-zinc-900 ${qualifies ? "font-semibold" : ""}`}>
                      {team.name}
                    </span>
                    {s.tiebreakerReason && (
                      <span className="text-[10px] text-zinc-400 italic">
                        ({s.tiebreakerReason})
                      </span>
                    )}
                  </div>
                </td>
                <td className="text-center py-2.5 px-2 font-bold tabular-nums">{s.points}</td>
                <td className="text-center py-2.5 px-2 tabular-nums text-zinc-600">{s.played}</td>
                <td className="text-center py-2.5 px-2 tabular-nums text-zinc-600">{s.wins}</td>
                <td className="text-center py-2.5 px-2 tabular-nums text-zinc-600">{s.draws}</td>
                <td className="text-center py-2.5 px-2 tabular-nums text-zinc-600">{s.losses}</td>
                <td className="text-center py-2.5 px-2 tabular-nums text-zinc-600">{s.goalsFor}</td>
                <td className="text-center py-2.5 px-2 tabular-nums text-zinc-600">{s.goalsAgainst}</td>
                <td className={`text-center py-2.5 px-2 tabular-nums font-medium ${
                  s.goalDiff > 0 ? "text-emerald-600" : s.goalDiff < 0 ? "text-red-600" : "text-zinc-600"
                }`}>
                  {s.goalDiff > 0 ? "+" : ""}{s.goalDiff}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
      <div className="mt-3 flex items-center gap-4 text-[10px] text-zinc-500">
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-0.5 bg-zinc-300" style={{ borderTop: "2px dashed" }} />
          <span>Corte de classificação</span>
        </div>
      </div>
    </div>
  );
}
