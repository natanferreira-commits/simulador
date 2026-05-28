"use client";

import { useEffect, useMemo } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useSimulation, getMatchesWithScores } from "@/store/simulationStore";
import { resolveBracket } from "@/lib/knockoutResolution";
import { rankThirdPlaceTeams } from "@/lib/thirdPlaceRanking";
import { BracketView } from "@/components/BracketView";
import { NavTabs } from "@/components/NavTabs";
import { TEAMS_BY_ID } from "@/data/teams";
import { Flag } from "@/components/Flag";

export default function KnockoutPage() {
  const router = useRouter();
  const hasHydrated = useSimulation((s) => s.hasHydrated);
  const userName = useSimulation((s) => s.userName);
  const groupMatches = useSimulation((s) => s.groupMatches);
  const knockoutMatches = useSimulation((s) => s.knockoutMatches);
  const setKnockoutScore = useSimulation((s) => s.setKnockoutScore);
  const resetKnockout = useSimulation((s) => s.resetKnockout);

  useEffect(() => {
    if (hasHydrated && !userName) {
      router.replace("/");
    }
  }, [hasHydrated, userName, router]);

  const allMatches = useMemo(
    () => getMatchesWithScores(groupMatches),
    [groupMatches],
  );

  const groupsComplete = allMatches.every(
    (m) => m.homeGoals !== null && m.awayGoals !== null,
  );

  const totalGroupFilled = allMatches.filter(
    (m) => m.homeGoals !== null && m.awayGoals !== null,
  ).length;

  const thirdRanking = useMemo(
    () => (groupsComplete ? rankThirdPlaceTeams(allMatches) : []),
    [allMatches, groupsComplete],
  );

  const resolvedBracket = useMemo(
    () => resolveBracket(allMatches, knockoutMatches),
    [allMatches, knockoutMatches],
  );

  if (!hasHydrated) {
    return (
      <div className="flex flex-1 items-center justify-center">
        <div className="text-sm text-zinc-400">Carregando...</div>
      </div>
    );
  }
  if (!userName) return null;

  return (
    <div className="flex-1 w-full max-w-7xl mx-auto px-4 py-6">
      <header className="flex items-center justify-between mb-4 pb-4 border-b border-zinc-200">
        <div>
          <div className="text-[10px] font-semibold uppercase tracking-widest text-zinc-500">
            Palpite de
          </div>
          <h1 className="text-xl font-bold text-zinc-900">{userName}</h1>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              if (confirm("Apagar todos os placares do mata-mata?"))
                resetKnockout();
            }}
            className="text-xs px-3 h-8 rounded border border-zinc-300 text-zinc-700 hover:bg-zinc-50 transition"
          >
            Limpar mata-mata
          </button>
        </div>
      </header>

      <div className="mb-6">
        <NavTabs />
      </div>

      {!groupsComplete && (
        <div className="mb-6 p-4 border border-amber-200 bg-amber-50 rounded-md">
          <div className="text-sm font-semibold text-amber-900 mb-1">
            Fase de grupos ainda não terminou
          </div>
          <p className="text-xs text-amber-800 leading-relaxed">
            Você preencheu <strong>{totalGroupFilled} de 72 jogos</strong> da fase de grupos.
            O chaveamento abaixo só vai mostrar os times corretos quando todos os
            grupos estiverem fechados.{" "}
            <Link href="/simulador" className="underline font-semibold">
              Voltar pra fase de grupos
            </Link>
          </p>
        </div>
      )}

      {/* Ranking dos 8 melhores 3ºs */}
      {groupsComplete && (
        <section className="mb-8">
          <h2 className="text-xs font-bold uppercase tracking-widest text-zinc-700 mb-3">
            Ranking dos terceiros colocados
            <span className="ml-2 text-zinc-400 font-normal normal-case tracking-normal">
              8 melhores avançam
            </span>
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
            {thirdRanking.map((t) => {
              const team = TEAMS_BY_ID[t.teamId];
              return (
                <div
                  key={t.teamId}
                  className={`flex items-center gap-2 px-3 py-2 rounded border text-xs ${
                    t.qualifies
                      ? "border-emerald-200 bg-emerald-50/50"
                      : "border-zinc-200 bg-zinc-50/50 opacity-60"
                  }`}
                >
                  <span
                    className={`w-5 text-[10px] font-bold tabular-nums ${
                      t.qualifies ? "text-emerald-700" : "text-zinc-400"
                    }`}
                  >
                    {t.rank}º
                  </span>
                  <Flag code={team.flag} />
                  <span className="flex-1 truncate">{team.name}</span>
                  <span className="text-[10px] text-zinc-500 tabular-nums">
                    {t.points}pts
                  </span>
                </div>
              );
            })}
          </div>
        </section>
      )}

      <section>
        <h2 className="text-xs font-bold uppercase tracking-widest text-zinc-700 mb-3">
          Chaveamento
        </h2>
        <BracketView
          matches={resolvedBracket}
          onScoreChange={setKnockoutScore}
        />
      </section>

      <footer className="mt-12 pt-6 border-t border-zinc-100 text-center text-[10px] text-zinc-400">
        by Dupla / Arena — regras oficiais FIFA 2026
      </footer>
    </div>
  );
}
