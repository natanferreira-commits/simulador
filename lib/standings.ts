import type { GroupMatch, GroupStanding, TeamId } from "@/types";
import { TEAMS_BY_ID } from "@/data/teams";

interface PlayedMatch {
  homeId: TeamId;
  awayId: TeamId;
  homeGoals: number;
  awayGoals: number;
}

function isPlayed(m: GroupMatch): m is GroupMatch & {
  homeGoals: number;
  awayGoals: number;
} {
  return m.homeGoals !== null && m.awayGoals !== null;
}

function aggregateStats(teamId: TeamId, matches: PlayedMatch[]) {
  let wins = 0, draws = 0, losses = 0, gf = 0, ga = 0;
  for (const m of matches) {
    const isHome = m.homeId === teamId;
    const isAway = m.awayId === teamId;
    if (!isHome && !isAway) continue;
    const my = isHome ? m.homeGoals : m.awayGoals;
    const their = isHome ? m.awayGoals : m.homeGoals;
    gf += my;
    ga += their;
    if (my > their) wins++;
    else if (my < their) losses++;
    else draws++;
  }
  return {
    played: wins + draws + losses,
    wins,
    draws,
    losses,
    goalsFor: gf,
    goalsAgainst: ga,
    goalDiff: gf - ga,
    points: wins * 3 + draws,
  };
}

/**
 * Recursive tiebreaker — FIFA 2026 rules:
 * 1. Points in head-to-head between tied teams
 * 2. Goal difference H2H
 * 3. Goals scored H2H
 * 4. Goal difference overall
 * 5. Goals scored overall
 * 6. (Fair play — omitted in MVP)
 * 7. FIFA ranking
 */
function rankTiedTeams(
  tiedIds: TeamId[],
  allMatches: PlayedMatch[],
): Array<{ teamId: TeamId; reason: string }> {
  if (tiedIds.length === 1) {
    return [{ teamId: tiedIds[0], reason: "" }];
  }

  // Head-to-head matches between tied teams only
  const h2hMatches = allMatches.filter(
    (m) => tiedIds.includes(m.homeId) && tiedIds.includes(m.awayId),
  );

  const stats = tiedIds.map((id) => ({
    id,
    h2h: aggregateStats(id, h2hMatches),
    overall: aggregateStats(id, allMatches),
    fifa: TEAMS_BY_ID[id]?.fifaRanking ?? 999,
  }));

  // Criterion → (label, sort fn)
  const criteria: Array<{ label: string; cmp: (a: typeof stats[0], b: typeof stats[0]) => number }> = [
    { label: "pontos no confronto direto",  cmp: (a, b) => b.h2h.points       - a.h2h.points       },
    { label: "saldo no confronto direto",   cmp: (a, b) => b.h2h.goalDiff     - a.h2h.goalDiff     },
    { label: "gols no confronto direto",    cmp: (a, b) => b.h2h.goalsFor     - a.h2h.goalsFor     },
    { label: "saldo total",                  cmp: (a, b) => b.overall.goalDiff - a.overall.goalDiff },
    { label: "gols totais",                  cmp: (a, b) => b.overall.goalsFor - a.overall.goalsFor },
    { label: "ranking FIFA",                 cmp: (a, b) => a.fifa             - b.fifa             },
  ];

  for (const { label, cmp } of criteria) {
    stats.sort(cmp);
    // group by tiebreaker key to detect remaining ties
    const groups: Array<typeof stats> = [];
    let current: typeof stats = [stats[0]];
    for (let i = 1; i < stats.length; i++) {
      if (cmp(stats[i - 1], stats[i]) === 0) {
        current.push(stats[i]);
      } else {
        groups.push(current);
        current = [stats[i]];
      }
    }
    groups.push(current);

    // If all in one group, this criterion didn't separate — try next
    if (groups.length === 1) continue;

    // Otherwise, recurse per subgroup
    const result: Array<{ teamId: TeamId; reason: string }> = [];
    for (const g of groups) {
      if (g.length === 1) {
        result.push({ teamId: g[0].id, reason: label });
      } else {
        // For sub-tied teams, recurse with only those teams
        const subIds = g.map((s) => s.id);
        const subResult = rankTiedTeams(subIds, allMatches);
        result.push(...subResult);
      }
    }
    return result;
  }

  // Should never reach here — FIFA ranking is unique
  return stats.map((s) => ({ teamId: s.id, reason: "indefinido" }));
}

export function computeGroupStandings(
  group: string,
  matches: GroupMatch[],
): GroupStanding[] {
  const groupMatches = matches.filter((m) => m.group === group);
  const teamIds = Array.from(
    new Set(groupMatches.flatMap((m) => [m.homeId, m.awayId])),
  );
  const played = groupMatches.filter(isPlayed) as PlayedMatch[];

  // First pass: order by overall criteria (points, GD, GF)
  const initialStats = teamIds.map((id) => ({
    id,
    ...aggregateStats(id, played),
    fifa: TEAMS_BY_ID[id]?.fifaRanking ?? 999,
  }));

  // Group teams by points, then resolve each pointwise tie via H2H
  initialStats.sort((a, b) => b.points - a.points);

  const pointGroups: Array<typeof initialStats> = [];
  let current: typeof initialStats = [initialStats[0]];
  for (let i = 1; i < initialStats.length; i++) {
    if (initialStats[i].points === initialStats[i - 1].points) {
      current.push(initialStats[i]);
    } else {
      pointGroups.push(current);
      current = [initialStats[i]];
    }
  }
  pointGroups.push(current);

  const finalOrder: Array<{ teamId: TeamId; reason: string }> = [];
  for (const pg of pointGroups) {
    if (pg.length === 1) {
      finalOrder.push({ teamId: pg[0].id, reason: "" });
    } else {
      finalOrder.push(...rankTiedTeams(pg.map((p) => p.id), played));
    }
  }

  return finalOrder.map((entry, idx) => {
    const stats = aggregateStats(entry.teamId, played);
    // Only surface tiebreaker reason if at least one match has been played
    // and the reason is meaningful (not just default ordering of zero-rows).
    const showReason = stats.played > 0 && !!entry.reason;
    return {
      teamId: entry.teamId,
      position: idx + 1,
      ...stats,
      tiebreakerReason: showReason ? entry.reason : undefined,
    };
  });
}
