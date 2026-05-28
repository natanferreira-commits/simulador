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

export const GROUP_MATCHES: GroupMatch[] = GROUPS.flatMap((g: GroupLetter) => {
  const teams = TEAMS_BY_GROUP[g];
  return ROUND_ROBIN.map(([h, a, round], idx) => ({
    id: `${g}-${idx + 1}`,
    group: g,
    round,
    homeId: teams[h].id,
    awayId: teams[a].id,
    homeGoals: null,
    awayGoals: null,
  }));
});

export const MATCHES_BY_GROUP: Record<string, GroupMatch[]> = GROUP_MATCHES.reduce(
  (acc, m) => {
    (acc[m.group] ??= []).push(m);
    return acc;
  },
  {} as Record<string, GroupMatch[]>,
);
