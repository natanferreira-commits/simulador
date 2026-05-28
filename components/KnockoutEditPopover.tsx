"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import type { ResolvedKnockoutMatch } from "@/types";
import { TEAMS_BY_ID } from "@/data/teams";
import { Flag } from "./Flag";

interface Props {
  match: ResolvedKnockoutMatch | null;
  anchorRect: DOMRect | null;
  onClose: () => void;
  onSave: (
    homeGoals: number | null,
    awayGoals: number | null,
    penaltyWinner?: "home" | "away",
  ) => void;
}

const STAGE_LABEL: Record<string, string> = {
  R32: "16 avos de final",
  R16: "Oitavas de final",
  QF:  "Quartas de final",
  SF:  "Semifinal",
  F:   "FINAL",
  "3RD": "Disputa de 3º lugar",
};

const POPOVER_WIDTH = 300;
const POPOVER_HEIGHT_GUESS = 280; // approximate; used for initial positioning
const GAP = 12;
const VIEWPORT_MARGIN = 12;

function parseGoals(v: string): number | null {
  if (v === "") return null;
  const n = parseInt(v, 10);
  if (Number.isNaN(n) || n < 0) return null;
  return Math.min(n, 99);
}

function computePosition(anchor: DOMRect, popoverEl: HTMLElement | null) {
  if (typeof window === "undefined") return { x: 0, y: 0 };
  const vw = window.innerWidth;
  const vh = window.innerHeight;
  const w = popoverEl?.offsetWidth ?? POPOVER_WIDTH;
  const h = popoverEl?.offsetHeight ?? POPOVER_HEIGHT_GUESS;

  // Try: right of anchor, vertically centered
  let x = anchor.right + GAP;
  let y = anchor.top + anchor.height / 2 - h / 2;

  // If doesn't fit on the right, try left
  if (x + w > vw - VIEWPORT_MARGIN) {
    x = anchor.left - w - GAP;
  }

  // If still doesn't fit horizontally, fall back to below or above
  if (x < VIEWPORT_MARGIN) {
    x = Math.max(VIEWPORT_MARGIN, anchor.left + anchor.width / 2 - w / 2);
    // try below
    if (anchor.bottom + h + GAP < vh - VIEWPORT_MARGIN) {
      y = anchor.bottom + GAP;
    } else {
      // above
      y = anchor.top - h - GAP;
    }
  }

  // Clamp inside viewport
  x = Math.max(VIEWPORT_MARGIN, Math.min(x, vw - w - VIEWPORT_MARGIN));
  y = Math.max(VIEWPORT_MARGIN, Math.min(y, vh - h - VIEWPORT_MARGIN));

  return { x, y };
}

export function KnockoutEditPopover({ match, anchorRect, onClose, onSave }: Props) {
  const popoverRef = useRef<HTMLDivElement>(null);
  const [pos, setPos] = useState<{ x: number; y: number }>({ x: -9999, y: -9999 });
  const [homeGoals, setHomeGoals] = useState<number | null>(null);
  const [awayGoals, setAwayGoals] = useState<number | null>(null);
  const [penaltyWinner, setPenaltyWinner] = useState<"home" | "away" | undefined>();

  // Sync local state when match changes
  useEffect(() => {
    if (match) {
      setHomeGoals(match.score.homeGoals);
      setAwayGoals(match.score.awayGoals);
      setPenaltyWinner(match.score.penaltyWinner);
    }
  }, [match]);

  // Position the popover next to the anchor
  useLayoutEffect(() => {
    if (!match || !anchorRect) return;
    const computed = computePosition(anchorRect, popoverRef.current);
    setPos(computed);
  }, [match, anchorRect]);

  // Close on ESC and on scroll (avoid stale positioning)
  useEffect(() => {
    if (!match) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    function onScroll() {
      onClose();
    }
    window.addEventListener("keydown", onKey);
    window.addEventListener("scroll", onScroll, true);
    window.addEventListener("resize", onClose);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("scroll", onScroll, true);
      window.removeEventListener("resize", onClose);
    };
  }, [match, onClose]);

  if (!match || !anchorRect) return null;

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
    <>
      {/* Backdrop — clicar fora fecha */}
      <div
        onClick={onClose}
        className="fixed inset-0 z-40 bg-black/40 backdrop-blur-[2px]"
      />
      {/* Popover */}
      <div
        ref={popoverRef}
        className="fixed z-50 w-[300px] bg-zinc-900 border border-zinc-700 rounded-lg shadow-2xl overflow-hidden"
        style={{ left: pos.x, top: pos.y }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-4 pt-3 pb-2 border-b border-zinc-800">
          <div className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">
            {STAGE_LABEL[match.stage]} · Jogo {match.id}
          </div>
        </div>

        {!teamsKnown ? (
          <div className="px-4 py-8 text-center">
            <p className="text-xs text-zinc-400 mb-1">Confronto ainda não definido</p>
            <p className="text-[10px] text-zinc-500 leading-relaxed">
              {match.homeLabel} vs {match.awayLabel}
            </p>
          </div>
        ) : (
          <>
            <div className="px-4 py-4">
              <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-2">
                <div className="flex flex-col items-center gap-1">
                  <Flag code={home!.flag} className="!w-8 !h-6" />
                  <span className="text-[10px] font-bold text-zinc-200 text-center leading-tight">
                    {home!.name}
                  </span>
                </div>
                <div className="flex items-center gap-1">
                  <input
                    type="number"
                    min={0}
                    max={99}
                    value={homeGoals ?? ""}
                    onChange={(e) => setHomeGoals(parseGoals(e.target.value))}
                    className="w-10 h-12 text-center bg-zinc-950 border border-zinc-700 rounded text-xl font-bold text-zinc-50 outline-none focus:border-zinc-400 focus:ring-2 focus:ring-zinc-400/20 transition tabular-nums"
                    autoFocus
                    placeholder=""
                  />
                  <span className="text-[10px] text-zinc-700">x</span>
                  <input
                    type="number"
                    min={0}
                    max={99}
                    value={awayGoals ?? ""}
                    onChange={(e) => setAwayGoals(parseGoals(e.target.value))}
                    className="w-10 h-12 text-center bg-zinc-950 border border-zinc-700 rounded text-xl font-bold text-zinc-50 outline-none focus:border-zinc-400 focus:ring-2 focus:ring-zinc-400/20 transition tabular-nums"
                    placeholder=""
                  />
                </div>
                <div className="flex flex-col items-center gap-1">
                  <Flag code={away!.flag} className="!w-8 !h-6" />
                  <span className="text-[10px] font-bold text-zinc-200 text-center leading-tight">
                    {away!.name}
                  </span>
                </div>
              </div>

              {drawn && (
                <div className="mt-4 pt-3 border-t border-zinc-800">
                  <div className="text-[9px] font-bold uppercase tracking-widest text-zinc-400 mb-1.5 text-center">
                    Ganhou nos pênaltis?
                  </div>
                  <div className="flex gap-1.5">
                    <button
                      onClick={() => setPenaltyWinner("home")}
                      className={`flex-1 h-8 text-[11px] font-bold rounded border transition ${
                        penaltyWinner === "home"
                          ? "bg-zinc-50 text-zinc-950 border-zinc-50"
                          : "bg-transparent text-zinc-300 border-zinc-700 hover:border-zinc-500"
                      }`}
                    >
                      {home!.code}
                    </button>
                    <button
                      onClick={() => setPenaltyWinner("away")}
                      className={`flex-1 h-8 text-[11px] font-bold rounded border transition ${
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

            <div className="px-4 py-2.5 bg-zinc-950/60 border-t border-zinc-800 flex items-center justify-between gap-2">
              <button
                onClick={handleClear}
                className="text-[10px] text-zinc-500 hover:text-zinc-200 transition"
              >
                Limpar
              </button>
              <div className="flex gap-1.5">
                <button
                  onClick={onClose}
                  className="px-3 h-7 rounded text-[10px] font-semibold text-zinc-300 hover:bg-zinc-800 transition"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleSave}
                  disabled={drawn && !penaltyWinner}
                  className="px-3 h-7 rounded bg-zinc-50 text-zinc-950 text-[10px] font-bold uppercase tracking-wider hover:bg-white transition disabled:opacity-30 disabled:cursor-not-allowed"
                >
                  Salvar
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </>
  );
}
