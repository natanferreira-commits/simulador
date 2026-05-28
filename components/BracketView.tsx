"use client";

import type { ResolvedKnockoutMatch } from "@/types";
import { LEFT_HALF, RIGHT_HALF, CENTER } from "@/data/bracketLayout";
import { BracketSlot } from "./BracketSlot";

interface Props {
  matches: ResolvedKnockoutMatch[];
  onSelectMatch: (matchId: number) => void;
}

const STAGE_LABEL: Record<string, string> = {
  R32: "OITAVAS DE 32",
  R16: "OITAVAS DE 16",
  QF:  "QUARTAS",
  SF:  "SEMIFINAIS",
  F:   "FINAL",
  "3RD": "3º LUGAR",
};

export function BracketView({ matches, onSelectMatch }: Props) {
  const byId = new Map(matches.map((m) => [m.id, m]));
  const get = (id: number) => byId.get(id)!;

  function Column({
    title,
    ids,
    align,
    size = "sm",
  }: {
    title: string;
    ids: number[];
    align: "start" | "around" | "end";
    size?: "sm" | "md" | "lg";
  }) {
    return (
      <div className="flex flex-col items-center">
        <div className="text-xs font-bold uppercase tracking-widest text-zinc-400 mb-5 whitespace-nowrap">
          {title}
        </div>
        <div
          className={`flex flex-col gap-5 flex-1 ${
            align === "start" ? "justify-start" : align === "end" ? "justify-end" : "justify-around"
          }`}
        >
          {ids.map((id) => {
            const m = get(id);
            if (!m) return null;
            return (
              <BracketSlot
                key={id}
                match={m}
                size={size}
                onClick={() => onSelectMatch(id)}
              />
            );
          })}
        </div>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto pb-8 pt-2">
      <div
        className="grid gap-6 min-w-max mx-auto"
        style={{
          gridTemplateColumns:
            "repeat(4, max-content) max-content repeat(4, max-content)",
        }}
      >
        {/* LEFT HALF */}
        <Column title={STAGE_LABEL.R32} ids={LEFT_HALF.R32} align="around" />
        <Column title={STAGE_LABEL.R16} ids={LEFT_HALF.R16} align="around" />
        <Column title={STAGE_LABEL.QF}  ids={LEFT_HALF.QF}  align="around" />
        <Column title={STAGE_LABEL.SF}  ids={LEFT_HALF.SF}  align="around" size="md" />

        {/* CENTER */}
        <div className="flex flex-col items-center justify-center gap-8 px-6 min-w-[280px]">
          <div className="text-sm font-bold uppercase tracking-widest text-zinc-200 mb-1">
            {STAGE_LABEL.F}
          </div>
          <div className="text-5xl text-center">🏆</div>
          <BracketSlot
            match={get(CENTER.FINAL)}
            size="lg"
            onClick={() => onSelectMatch(CENTER.FINAL)}
          />
          <div className="border-t border-dashed border-zinc-800 w-full my-4" />
          <div className="text-xs font-bold uppercase tracking-widest text-zinc-400">
            {STAGE_LABEL["3RD"]}
          </div>
          <BracketSlot
            match={get(CENTER.THIRD)}
            size="md"
            onClick={() => onSelectMatch(CENTER.THIRD)}
          />
        </div>

        {/* RIGHT HALF */}
        <Column title={STAGE_LABEL.SF}  ids={RIGHT_HALF.SF}  align="around" size="md" />
        <Column title={STAGE_LABEL.QF}  ids={RIGHT_HALF.QF}  align="around" />
        <Column title={STAGE_LABEL.R16} ids={RIGHT_HALF.R16} align="around" />
        <Column title={STAGE_LABEL.R32} ids={RIGHT_HALF.R32} align="around" />
      </div>
    </div>
  );
}
