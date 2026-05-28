import type { GroupLetter, GroupMatch, GroupStanding, TeamId } from "@/types";
import { GROUPS, TEAMS_BY_ID } from "@/data/teams";
import { computeGroupStandings } from "./standings";

export interface ThirdPlaceEntry {
  teamId: TeamId;
  group: GroupLetter;
  points: number;
  goalDiff: number;
  goalsFor: number;
  fifaRanking: number;
  /** position 1..12 among third placers */
  rank: number;
  /** True if this team is among the 8 best (qualifies for R32) */
  qualifies: boolean;
}

/**
 * Rank all 12 third-placed teams across groups.
 * FIFA criteria: points → goal difference → goals scored → fair play (omitted in MVP) → FIFA ranking.
 * Returns the 12 entries ranked, with `qualifies` flag set for the top 8.
 */
export function rankThirdPlaceTeams(allMatches: GroupMatch[]): ThirdPlaceEntry[] {
  const thirds: ThirdPlaceEntry[] = [];

  for (const g of GROUPS) {
    const standings: GroupStanding[] = computeGroupStandings(g, allMatches);
    const third = standings[2]; // index 2 = 3rd place
    if (!third) continue;
    thirds.push({
      teamId: third.teamId,
      group: g,
      points: third.points,
      goalDiff: third.goalDiff,
      goalsFor: third.goalsFor,
      fifaRanking: TEAMS_BY_ID[third.teamId]?.fifaRanking ?? 999,
      rank: 0,
      qualifies: false,
    });
  }

  thirds.sort((a, b) => {
    if (b.points !== a.points) return b.points - a.points;
    if (b.goalDiff !== a.goalDiff) return b.goalDiff - a.goalDiff;
    if (b.goalsFor !== a.goalsFor) return b.goalsFor - a.goalsFor;
    // Fair play skipped in MVP
    return a.fifaRanking - b.fifaRanking;
  });

  return thirds.map((t, idx) => ({
    ...t,
    rank: idx + 1,
    qualifies: idx < 8,
  }));
}
