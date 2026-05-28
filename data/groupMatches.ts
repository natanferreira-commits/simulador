import type { GroupMatch, GroupLetter } from "@/types";
import { GROUPS, TEAMS_BY_GROUP } from "./teams";

// Round robin pattern for 4 teams (indexes 0,1,2,3):
// Round 1: (0 vs 1), (2 vs 3)
// Round 2: (0 vs 2), (1 vs 3)
// Round 3: (0 vs 3), (1 vs 2)
const ROUND_ROBIN: Array<[number, number, 1 | 2 | 3]> = [
  [0, 1, 1],
  [2, 3, 1],
  [0, 2, 2],
  [1, 3, 2],
  [0, 3, 3],
  [1, 2, 3],
];

// Calculated dates per round (real WC opens 11 jun 2026)
// R1: 11-16 jun, R2: 17-22 jun, R3: 23-27 jun
const ROUND_DATE_BASE: Record<1 | 2 | 3, Date> = {
  1: new Date("2026-06-11"),
  2: new Date("2026-06-17"),
  3: new Date("2026-06-23"),
};

function formatDate(d: Date): string {
  return d.toISOString().slice(0, 10);
}

/**
 * Generates synthetic but plausible dates: distributes groups across the
 * 6-day window of each round. Not the official FIFA fixture list yet —
 * will be replaced when we have the official schedule.
 */
function dateForMatch(groupIndex: number, round: 1 | 2 | 3, matchInRound: 0 | 1): string {
  const base = new Date(ROUND_DATE_BASE[round]);
  // Group index 0-11, spread across the 6-day window
  const dayOffset = Math.floor(groupIndex / 2) + matchInRound * 0;
  base.setUTCDate(base.getUTCDate() + (dayOffset % 6));
  return formatDate(base);
}

export const GROUP_MATCHES: GroupMatch[] = GROUPS.flatMap((g: GroupLetter, gIdx: number) => {
  const teams = TEAMS_BY_GROUP[g];
  return ROUND_ROBIN.map(([h, a, round], idx) => {
    const matchInRound = (idx % 2) as 0 | 1;
    return {
      id: `${g}-${idx + 1}`,
      group: g,
      round,
      date: dateForMatch(gIdx, round, matchInRound),
      homeId: teams[h].id,
      awayId: teams[a].id,
      homeGoals: null,
      awayGoals: null,
    };
  });
});

export const MATCHES_BY_GROUP: Record<string, GroupMatch[]> = GROUP_MATCHES.reduce(
  (acc, m) => {
    (acc[m.group] ??= []).push(m);
    return acc;
  },
  {} as Record<string, GroupMatch[]>,
);
