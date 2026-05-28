"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useSimulation, getMatchesWithScores } from "@/store/simulationStore";
import { computeGroupStandings } from "@/lib/standings";
import { MATCHES_BY_GROUP } from "@/data/groupMatches";
import { GroupTable } from "@/components/GroupTable";
import { MatchCard } from "@/components/MatchCard";
import { GroupTabs } from "@/components/GroupTabs";
import { NavTabs } from "@/components/NavTabs";

export default function SimulatorPage() {
  const router = useRouter();
  const hasHydrated = useSimulation((s) => s.hasHydrated);
  const userName = useSimulation((s) => s.userName);
  const storeMatches = useSimulation((s) => s.groupMatches);
  const setScore = useSimulation((s) => s.setScore);
  const randomizeAll = useSimulation((s) => s.randomizeAll);
  const resetAll = useSimulation((s) => s.resetAll);
  const [currentGroup, setCurrentGroup] = useState("A");

  useEffect(() => {
    if (hasHydrated && !userName) {
      router.replace("/");
    }
  }, [hasHydrated, userName, router]);

  const allMatches = useMemo(
    () => getMatchesWithScores(storeMatches),
    [storeMatches],
  );

  const standings = useMemo(
    () => computeGroupStandings(currentGroup, allMatches),
    [currentGroup, allMatches],
  );

  const groupMatches = MATCHES_BY_GROUP[currentGroup].map((m) => ({
    ...m,
    homeGoals: storeMatches[m.id]?.homeGoals ?? null,
    awayGoals: storeMatches[m.id]?.awayGoals ?? null,
  }));

  const matchesByRound = [1, 2, 3].map((r) =>
    groupMatches.filter((m) => m.round === r),
  );

  // Avoid hydration mismatch
  if (!hasHydrated) {
    return (
      <div className="flex flex-1 items-center justify-center">
        <div className="text-sm text-zinc-400">Carregando...</div>
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
      <header className="flex items-center justify-between mb-6 pb-4 border-b border-zinc-200">
        <div>
          <div className="text-[10px] font-semibold uppercase tracking-widest text-zinc-500">
            Palpite de
          </div>
          <h1 className="text-xl font-bold text-zinc-900">{userName}</h1>
        </div>
        <div className="flex items-center gap-2">
          <div className="text-xs text-zinc-500 mr-2 tabular-nums">
            {totalFilled} <span className="text-zinc-400">/ 72 jogos</span>
          </div>
          <button
            onClick={() => {
              if (confirm("Preencher todos os 72 jogos com placares aleatórios?")) {
                randomizeAll();
              }
            }}
            className="text-xs px-3 h-8 rounded border border-zinc-300 text-zinc-700 hover:bg-zinc-50 transition"
          >
            Aleatório
          </button>
          <button
            onClick={() => {
              if (confirm("Apagar todos os placares?")) resetAll();
            }}
            className="text-xs px-3 h-8 rounded border border-zinc-300 text-zinc-700 hover:bg-zinc-50 transition"
          >
            Limpar
          </button>
          {totalFilled === 72 && (
            <Link
              href="/mata-mata"
              className="text-xs px-3 h-8 inline-flex items-center rounded bg-emerald-600 text-white font-semibold hover:bg-emerald-700 transition"
            >
              Ir pro mata-mata →
            </Link>
          )}
        </div>
      </header>

      <div className="mb-6">
        <NavTabs />
      </div>

      {/* Group tabs */}
      <div className="mb-6">
        <GroupTabs current={currentGroup} onSelect={setCurrentGroup} />
      </div>

      {/* Main grid: standings + matches */}
      <div className="grid lg:grid-cols-[1fr_400px] gap-8">
        {/* Standings */}
        <section>
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-xs font-bold uppercase tracking-widest text-zinc-700">
              Tabela — Grupo {currentGroup}
            </h2>
          </div>
          <GroupTable standings={standings} />
        </section>

        {/* Matches */}
        <section>
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-xs font-bold uppercase tracking-widest text-zinc-700">
              Jogos
            </h2>
          </div>
          <div className="space-y-5">
            {matchesByRound.map((roundMatches, idx) => (
              <div key={idx}>
                <div className="text-[10px] font-semibold uppercase tracking-wider text-zinc-400 mb-1">
                  Rodada {idx + 1}
                </div>
                <div>
                  {roundMatches.map((m) => (
                    <MatchCard
                      key={m.id}
                      match={m}
                      onScoreChange={(h, a) => setScore(m.id, h, a)}
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>

      <footer className="mt-12 pt-6 border-t border-zinc-100 text-center text-[10px] text-zinc-400">
        by Dupla / Arena — regras oficiais FIFA 2026
      </footer>
    </div>
  );
}
