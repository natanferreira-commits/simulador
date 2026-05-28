"use client";

import type { ResolvedKnockoutMatch } from "@/types";
import { LEFT_HALF, RIGHT_HALF, CENTER } from "@/data/bracketLayout";
import { BracketCircle } from "./BracketCircle";

interface Props {
  matches: ResolvedKnockoutMatch[];
  onSelectMatch: (matchId: number) => void;
}

const STAGE_LABEL: Record<string, string> = {
  R32: "16 AVOS",
  R16: "OITAVAS",
  QF: "QUARTAS",
  SF: "SEMIS",
};

/**
 * One "match" is rendered as two stacked circles (home/away).
 * The vertical bar between them implies the H2H pairing.
 */
function MatchCell({
  match,
  onSelect,
  connector,
  size = "md",
}: {
  match: ResolvedKnockoutMatch;
  onSelect: () => void;
  /** Where the connector line should go */
  connector: "right" | "left" | "none";
  size?: "sm" | "md" | "lg";
}) {
  const connectorClass =
    connector === "right"
      ? "after:absolute after:left-full after:top-1/2 after:w-4 after:border-t after:border-dashed after:border-zinc-700"
      : connector === "left"
        ? "before:absolute before:right-full before:top-1/2 before:w-4 before:border-t before:border-dashed before:border-zinc-700"
        : "";

  return (
    <div className={`relative flex flex-col gap-1 items-center ${connectorClass}`}>
      <BracketCircle match={match} side="home" onClick={onSelect} size={size} />
      <BracketCircle match={match} side="away" onClick={onSelect} size={size} />
    </div>
  );
}

/**
 * A "pair" of two matches that feed a single next-round match.
 * Visually: two MatchCells stacked, with a vertical dashed line on the
 * outer side joining them (and a horizontal stub poking toward center).
 */
function MatchPair({
  topMatch,
  bottomMatch,
  side,
  onSelect,
  size = "md",
}: {
  topMatch: ResolvedKnockoutMatch;
  bottomMatch: ResolvedKnockoutMatch;
  side: "left" | "right";
  onSelect: (id: number) => void;
  size?: "sm" | "md" | "lg";
}) {
  // The vertical joining line lives on the inner edge (right for LEFT half,
  // left for RIGHT half). We render it as border on a small spacer column.
  const isLeft = side === "left";
  return (
    <div className="flex items-stretch gap-0">
      {!isLeft && (
        <div className="w-4 border-r border-dashed border-zinc-700 self-stretch" />
      )}
      <div className="flex flex-col justify-around gap-8">
        <MatchCell
          match={topMatch}
          onSelect={() => onSelect(topMatch.id)}
          connector={isLeft ? "right" : "left"}
          size={size}
        />
        <MatchCell
          match={bottomMatch}
          onSelect={() => onSelect(bottomMatch.id)}
          connector={isLeft ? "right" : "left"}
          size={size}
        />
      </div>
      {isLeft && (
        <div className="w-4 border-l border-dashed border-zinc-700 self-stretch" />
      )}
    </div>
  );
}

export function BracketView({ matches, onSelectMatch }: Props) {
  const byId = new Map(matches.map((m) => [m.id, m]));
  const get = (id: number) => byId.get(id)!;

  /**
   * For each round, group matches into pairs of consecutive entries.
   * Returns pairs in display order.
   */
  function pairs<T>(arr: T[]): Array<[T, T]> {
    const out: Array<[T, T]> = [];
    for (let i = 0; i < arr.length; i += 2) out.push([arr[i], arr[i + 1]]);
    return out;
  }

  return (
    <div className="w-full max-w-[1200px] mx-auto">
      {/* Stage labels */}
      <div className="grid items-center mb-4 px-2 text-[10px] font-bold uppercase tracking-widest text-zinc-500"
        style={{ gridTemplateColumns: "repeat(4, 1fr) minmax(180px, auto) repeat(4, 1fr)" }}
      >
        <div className="text-center">{STAGE_LABEL.R32}</div>
        <div className="text-center">{STAGE_LABEL.R16}</div>
        <div className="text-center">{STAGE_LABEL.QF}</div>
        <div className="text-center">{STAGE_LABEL.SF}</div>
        <div className="text-center text-zinc-300">FINAL</div>
        <div className="text-center">{STAGE_LABEL.SF}</div>
        <div className="text-center">{STAGE_LABEL.QF}</div>
        <div className="text-center">{STAGE_LABEL.R16}</div>
        <div className="text-center">{STAGE_LABEL.R32}</div>
      </div>

      <div
        className="grid items-center"
        style={{ gridTemplateColumns: "repeat(4, 1fr) minmax(180px, auto) repeat(4, 1fr)" }}
      >
        {/* ============ LEFT HALF ============ */}

        {/* R32-L: 8 matches in 4 pairs */}
        <div className="flex flex-col gap-6 items-end">
          {pairs(LEFT_HALF.R32.map(get)).map(([a, b]) => (
            <MatchPair
              key={a.id}
              topMatch={a}
              bottomMatch={b}
              side="left"
              onSelect={onSelectMatch}
              size="sm"
            />
          ))}
        </div>

        {/* R16-L: 4 matches in 2 pairs */}
        <div className="flex flex-col gap-20 items-end">
          {pairs(LEFT_HALF.R16.map(get)).map(([a, b]) => (
            <MatchPair
              key={a.id}
              topMatch={a}
              bottomMatch={b}
              side="left"
              onSelect={onSelectMatch}
              size="sm"
            />
          ))}
        </div>

        {/* QF-L: 2 matches in 1 pair */}
        <div className="flex flex-col gap-60 items-end">
          {pairs(LEFT_HALF.QF.map(get)).map(([a, b]) => (
            <MatchPair
              key={a.id}
              topMatch={a}
              bottomMatch={b}
              side="left"
              onSelect={onSelectMatch}
              size="md"
            />
          ))}
        </div>

        {/* SF-L: 1 match */}
        <div className="flex justify-end items-center">
          <MatchCell
            match={get(LEFT_HALF.SF[0])}
            onSelect={() => onSelectMatch(LEFT_HALF.SF[0])}
            connector="right"
            size="md"
          />
        </div>

        {/* ============ CENTER ============ */}
        <div className="flex flex-col items-center justify-center gap-3 px-4">
          <div className="text-3xl">🏆</div>
          <MatchCell
            match={get(CENTER.FINAL)}
            onSelect={() => onSelectMatch(CENTER.FINAL)}
            connector="none"
            size="lg"
          />
          <div className="text-center text-[10px] text-emerald-400/80 italic leading-tight max-w-[140px] mt-2">
            Clique nos vencedores de cada confronto pra fazer a sua simulação.
          </div>
          <div className="border-t border-dashed border-zinc-800 w-full my-3" />
          <div className="text-[9px] font-bold uppercase tracking-widest text-zinc-500">
            3º Lugar
          </div>
          <MatchCell
            match={get(CENTER.THIRD)}
            onSelect={() => onSelectMatch(CENTER.THIRD)}
            connector="none"
            size="md"
          />
        </div>

        {/* ============ RIGHT HALF ============ */}

        {/* SF-R: 1 match */}
        <div className="flex justify-start items-center">
          <MatchCell
            match={get(RIGHT_HALF.SF[0])}
            onSelect={() => onSelectMatch(RIGHT_HALF.SF[0])}
            connector="left"
            size="md"
          />
        </div>

        {/* QF-R: 2 matches in 1 pair */}
        <div className="flex flex-col gap-60 items-start">
          {pairs(RIGHT_HALF.QF.map(get)).map(([a, b]) => (
            <MatchPair
              key={a.id}
              topMatch={a}
              bottomMatch={b}
              side="right"
              onSelect={onSelectMatch}
              size="md"
            />
          ))}
        </div>

        {/* R16-R: 4 matches in 2 pairs */}
        <div className="flex flex-col gap-20 items-start">
          {pairs(RIGHT_HALF.R16.map(get)).map(([a, b]) => (
            <MatchPair
              key={a.id}
              topMatch={a}
              bottomMatch={b}
              side="right"
              onSelect={onSelectMatch}
              size="sm"
            />
          ))}
        </div>

        {/* R32-R: 8 matches in 4 pairs */}
        <div className="flex flex-col gap-6 items-start">
          {pairs(RIGHT_HALF.R32.map(get)).map(([a, b]) => (
            <MatchPair
              key={a.id}
              topMatch={a}
              bottomMatch={b}
              side="right"
              onSelect={onSelectMatch}
              size="sm"
            />
          ))}
        </div>
      </div>
    </div>
  );
}
