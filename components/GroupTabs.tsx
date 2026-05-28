"use client";

import { GROUPS } from "@/data/teams";

interface Props {
  current: string;
  onSelect: (group: string) => void;
}

export function GroupTabs({ current, onSelect }: Props) {
  return (
    <div className="flex gap-1 overflow-x-auto pb-2 -mx-1 px-1">
      {GROUPS.map((g) => (
        <button
          key={g}
          onClick={() => onSelect(g)}
          className={`shrink-0 w-10 h-10 rounded-md font-bold text-sm transition ${
            current === g
              ? "bg-zinc-900 text-white"
              : "bg-zinc-100 text-zinc-600 hover:bg-zinc-200"
          }`}
        >
          {g}
        </button>
      ))}
    </div>
  );
}
