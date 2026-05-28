"use client";

import { useEffect, useRef, useState } from "react";
import type { ResolvedKnockoutMatch } from "@/types";
import { TEAMS_BY_ID } from "@/data/teams";
import { Flag } from "./Flag";

interface Props {
  match: ResolvedKnockoutMatch | null;
  onClose: () => void;
  onSave: (
    homeGoals: number | null,
    awayGoals: number | null,
    penaltyWinner?: "home" | "away",
  ) => void;
}

const STAGE_LABEL: Record<string, string> = {
  R32: "Oitavas de 32",
  R16: "Oitavas de 16",
  QF:  "Quartas de final",
  SF:  "Semifinal",
  F:   "FINAL",
  "3RD": "Disputa de 3º lugar",
};

function parseGoals(v: string): number | null {
  if (v === "") return null;
  const n = parseInt(v, 10);
  if (Number.isNaN(n) || n < 0) return null;
  return Math.min(n, 99);
}

export function KnockoutEditDialog({ match, onClose, onSave }: Props) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [homeGoals, setHomeGoals] = useState<number | null>(null);
  const [awayGoals, setAwayGoals] = useState<number | null>(null);
  const [penaltyWinner, setPenaltyWinner] = useState<"home" | "away" | undefined>();

  useEffect(() => {
    if (match) {
      setHomeGoals(match.score.homeGoals);
      setAwayGoals(match.score.awayGoals);
      setPenaltyWinner(match.score.penaltyWinner);
    }
  }, [match]);

  useEffect(() => {
    const dlg = dialogRef.current;
    if (!dlg) return;
    if (match) {
      if (!dlg.open) dlg.showModal();
    } else {
      if (dlg.open) dlg.close();
    }
  }, [match]);

  if (!match) {
    return (
      <dialog
        ref={dialogRef}
        className="rounded-lg p-0 bg-transparent"
        onClose={onClose}
      />
    );
  }

  const home = match.homeTeamId ? TEAMS_BY_ID[match.homeTeamId] : null;
  const away = match.awayTeamId ? TEAMS_BY_ID[match.awayTeamId] : null;
  const teamsKnown = !!home && !!away;
  const drawn = homeGoals !== null && awayGoals !== null && homeGoals === awayGoals;

  function handleSave() {
    onSave(homeGoals, awayGoals, drawn ? penaltyWinner : undefined);
    onClose();
  }

  function handleClear() {
    setHomeGoals(null);
    setAwayGoals(null);
    setPenaltyWinner(undefined);
    onSave(null, null, undefined);
    onClose();
  }

  return (
    <dialog
      ref={dialogRef}
      className="rounded-lg p-0 bg-transparent w-full max-w-md"
      onClose={onClose}
    >
      <div className="bg-zinc-900 border border-zinc-800 rounded-lg overflow-hidden">
        {/* Header */}
        <div className="px-6 pt-5 pb-3 border-b border-zinc-800">
          <div className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">
            {STAGE_LABEL[match.stage]} · Jogo {match.id}
          </div>
        </div>

        {!teamsKnown ? (
          <div className="px-6 py-12 text-center">
            <p className="text-sm text-zinc-400 mb-1">Confronto ainda não definido</p>
            <p className="text-xs text-zinc-500 leading-relaxed">
              {match.homeLabel} vs {match.awayLabel}
              <br />
              Preencha as rodadas anteriores primeiro.
            </p>
          </div>
        ) : (
          <>
            <div className="px-6 py-6">
              <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-4">
                <div className="flex flex-col items-center gap-2">
                  <Flag code={home!.flag} className="!w-10 !h-7" />
                  <span className="text-xs font-bold text-zinc-200 text-center">
                    {home!.name}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    min={0}
                    max={99}
                    value={homeGoals ?? ""}
                    onChange={(e) => setHomeGoals(parseGoals(e.target.value))}
                    className="w-12 h-14 text-center bg-zinc-950 border border-zinc-700 rounded-lg text-2xl font-bold text-zinc-50 outline-none focus:border-zinc-400 focus:ring-2 focus:ring-zinc-400/20 transition tabular-nums"
                    autoFocus
                    placeholder=""
                  />
                  <span className="text-xs text-zinc-700">x</span>
                  <input
                    type="number"
                    min={0}
                    max={99}
                    value={awayGoals ?? ""}
                    onChange={(e) => setAwayGoals(parseGoals(e.target.value))}
                    className="w-12 h-14 text-center bg-zinc-950 border border-zinc-700 rounded-lg text-2xl font-bold text-zinc-50 outline-none focus:border-zinc-400 focus:ring-2 focus:ring-zinc-400/20 transition tabular-nums"
                    placeholder=""
                  />
                </div>
                <div className="flex flex-col items-center gap-2">
                  <Flag code={away!.flag} className="!w-10 !h-7" />
                  <span className="text-xs font-bold text-zinc-200 text-center">
                    {away!.name}
                  </span>
                </div>
              </div>

              {drawn && (
                <div className="mt-6 pt-4 border-t border-zinc-800">
                  <div className="text-[10px] font-bold uppercase tracking-widest text-zinc-400 mb-2 text-center">
                    Quem ganhou nos pênaltis?
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setPenaltyWinner("home")}
                      className={`flex-1 h-10 text-xs font-bold rounded border transition ${
                        penaltyWinner === "home"
                          ? "bg-zinc-50 text-zinc-950 border-zinc-50"
                          : "bg-transparent text-zinc-300 border-zinc-700 hover:border-zinc-500"
                      }`}
                    >
                      {home!.code}
                    </button>
                    <button
                      onClick={() => setPenaltyWinner("away")}
                      className={`flex-1 h-10 text-xs font-bold rounded border transition ${
                        penaltyWinner === "away"
                          ? "bg-zinc-50 text-zinc-950 border-zinc-50"
                          : "bg-transparent text-zinc-300 border-zinc-700 hover:border-zinc-500"
                      }`}
                    >
                      {away!.code}
                    </button>
                  </div>
                </div>
              )}
            </div>

            <div className="px-6 py-4 bg-zinc-950/60 border-t border-zinc-800 flex items-center justify-between gap-2">
              <button
                onClick={handleClear}
                className="text-xs text-zinc-500 hover:text-zinc-200 transition"
              >
                Limpar
              </button>
              <div className="flex gap-2">
                <button
                  onClick={onClose}
                  className="px-4 h-9 rounded text-xs font-semibold text-zinc-300 hover:bg-zinc-800 transition"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleSave}
                  disabled={drawn && !penaltyWinner}
                  className="px-5 h-9 rounded bg-zinc-50 text-zinc-950 text-xs font-bold uppercase tracking-wider hover:bg-white transition disabled:opacity-30 disabled:cursor-not-allowed"
                >
                  Salvar
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </dialog>
  );
}
