"use client";

import { useEffect, useMemo } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useSimulation, getMatchesWithScores } from "@/store/simulationStore";
import { computeGroupStandings } from "@/lib/standings";
import { MATCHES_BY_GROUP } from "@/data/groupMatches";
import { GROUPS } from "@/data/teams";
import { GroupCard } from "@/components/GroupCard";
import { NavTabs } from "@/components/NavTabs";

export default function SimulatorPage() {
  const router = useRouter();
  const hasHydrated = useSimulation((s) => s.hasHydrated);
  const userName = useSimulation((s) => s.userName);
  const storeMatches = useSimulation((s) => s.groupMatches);
  const setScore = useSimulation((s) => s.setScore);
  const randomizeAll = useSimulation((s) => s.randomizeAll);
  const resetAll = useSimulation((s) => s.resetAll);

  useEffect(() => {
    if (hasHydrated && !userName) {
      router.replace("/");
    }
  }, [hasHydrated, userName, router]);

  const allMatches = useMemo(
    () => getMatchesWithScores(storeMatches),
    [storeMatches],
  );

  if (!hasHydrated) {
    return (
      <div className="flex flex-1 items-center justify-center">
        <div className="text-sm text-zinc-600">Carregando...</div>
      </div>
    );
  }
  if (!userName) return null;

  const totalFilled = Object.values(storeMatches).filter(
    (m) => m.homeGoals !== null && m.awayGoals !== null,
  ).length;

  return (
    <div className="flex-1 w-full max-w-6xl mx-auto px-4 py-6">
      {/* Header */}
      <header className="flex items-center justify-between mb-4 pb-4 border-b border-zinc-800">
        <div>
          <div className="text-[10px] font-semibold uppercase tracking-widest text-zinc-500">
            Palpite de
          </div>
          <h1 className="text-xl font-bold text-zinc-50">{userName}</h1>
        </div>
        <div className="text-xs text-zinc-400 tabular-nums">
          {totalFilled} <span className="text-zinc-600">/ 72 jogos</span>
        </div>
      </header>

      <div className="mb-6">
        <NavTabs />
      </div>

      {/* Actions */}
      <div className="flex items-center justify-center gap-3 mb-10">
        <button
          onClick={() => {
            if (confirm("Preencher todos os 72 jogos com placares aleatórios?")) {
              randomizeAll();
            }
          }}
          className="px-6 h-10 rounded bg-emerald-500 text-zinc-950 font-bold uppercase text-xs tracking-wider hover:bg-emerald-400 transition"
        >
          Preencher aleatoriamente
        </button>
        <button
          onClick={() => {
            if (confirm("Apagar todos os placares (grupos + mata-mata)?")) resetAll();
          }}
          className="px-6 h-10 rounded bg-zinc-800 text-zinc-300 font-bold uppercase text-xs tracking-wider hover:bg-zinc-700 transition"
        >
          Limpar tudo
        </button>
        {totalFilled === 72 && (
          <Link
            href="/mata-mata"
            className="px-6 h-10 inline-flex items-center rounded bg-blue-500 text-zinc-950 font-bold uppercase text-xs tracking-wider hover:bg-blue-400 transition"
          >
            Ir pro mata-mata →
          </Link>
        )}
      </div>

      {/* Groups stacked vertically */}
      <div>
        {GROUPS.map((g) => {
          const standings = computeGroupStandings(g, allMatches);
          const matches = MATCHES_BY_GROUP[g].map((m) => ({
            ...m,
            homeGoals: storeMatches[m.id]?.homeGoals ?? null,
            awayGoals: storeMatches[m.id]?.awayGoals ?? null,
          }));
          return (
            <GroupCard
              key={g}
              groupLetter={g}
              standings={standings}
              matches={matches}
              onScoreChange={setScore}
            />
          );
        })}
      </div>

      <footer className="mt-12 pt-6 border-t border-zinc-900 text-center text-[10px] text-zinc-600">
        by Dupla / Arena — regras oficiais FIFA 2026
      </footer>
    </div>
  );
}
