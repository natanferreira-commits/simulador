import type {
  GroupMatch,
  KnockoutScore,
  ResolvedKnockoutMatch,
  SlotRef,
  TeamId,
} from "@/types";
import { BRACKET, BRACKET_BY_ID } from "@/data/bracket";
import { TEAMS_BY_ID } from "@/data/teams";
import { computeGroupStandings } from "./standings";
import { rankThirdPlaceTeams } from "./thirdPlaceRanking";
import { assignThirdsToSlots } from "./bracketResolver";

interface ResolutionContext {
  /** group letter → standings */
  groupStandings: Map<string, ReturnType<typeof computeGroupStandings>>;
  /** R32 match id → group letter assigned to its "thirdFrom" slot */
  thirdAssignment: Map<number, string>;
  /** match id → team that won (or null if not resolvable yet) */
  matchWinners: Map<number, TeamId | null>;
  /** match id → team that lost */
  matchLosers: Map<number, TeamId | null>;
  /** scores from the store */
  knockoutScores: Record<number, KnockoutScore>;
  /** whether all group matches are complete */
  groupsComplete: boolean;
}

/** Have all 72 group matches been played? */
function areGroupsComplete(allMatches: GroupMatch[]): boolean {
  return allMatches.every(
    (m) => m.homeGoals !== null && m.awayGoals !== null,
  );
}

function resolveSlot(
  ref: SlotRef,
  hostMatchId: number,
  ctx: ResolutionContext,
): { teamId: TeamId | null; label: string } {
  switch (ref.kind) {
    case "groupPos": {
      if (!ctx.groupsComplete) {
        return { teamId: null, label: `${ref.pos}º Grupo ${ref.group}` };
      }
      const standings = ctx.groupStandings.get(ref.group);
      const entry = standings?.[ref.pos - 1];
      if (!entry) return { teamId: null, label: `${ref.pos}º Grupo ${ref.group}` };
      return {
        teamId: entry.teamId,
        label: TEAMS_BY_ID[entry.teamId]?.name ?? entry.teamId,
      };
    }
    case "thirdFrom": {
      if (!ctx.groupsComplete) {
        return {
          teamId: null,
          label: `3º Grupo ${ref.allowedGroups.join("/")}`,
        };
      }
      const assignedGroup = ctx.thirdAssignment.get(hostMatchId);
      if (!assignedGroup) {
        return {
          teamId: null,
          label: `3º Grupo ${ref.allowedGroups.join("/")}`,
        };
      }
      const standings = ctx.groupStandings.get(assignedGroup);
      const third = standings?.[2];
      if (!third) {
        return { teamId: null, label: `3º Grupo ${assignedGroup}` };
      }
      return {
        teamId: third.teamId,
        label: TEAMS_BY_ID[third.teamId]?.name ?? third.teamId,
      };
    }
    case "winnerOf": {
      const winner = ctx.matchWinners.get(ref.matchId);
      if (!winner) {
        return { teamId: null, label: `Vencedor M${ref.matchId}` };
      }
      return { teamId: winner, label: TEAMS_BY_ID[winner]?.name ?? winner };
    }
    case "loserOf": {
      const loser = ctx.matchLosers.get(ref.matchId);
      if (!loser) {
        return { teamId: null, label: `Perdedor M${ref.matchId}` };
      }
      return { teamId: loser, label: TEAMS_BY_ID[loser]?.name ?? loser };
    }
  }
}

function resolveMatchOutcome(
  homeId: TeamId | null,
  awayId: TeamId | null,
  score: KnockoutScore,
): { winnerId: TeamId | null; loserId: TeamId | null; needsPenaltyDecision: boolean } {
  if (!homeId || !awayId) {
    return { winnerId: null, loserId: null, needsPenaltyDecision: false };
  }
  if (score.homeGoals === null || score.awayGoals === null) {
    return { winnerId: null, loserId: null, needsPenaltyDecision: false };
  }
  if (score.homeGoals > score.awayGoals) {
    return { winnerId: homeId, loserId: awayId, needsPenaltyDecision: false };
  }
  if (score.awayGoals > score.homeGoals) {
    return { winnerId: awayId, loserId: homeId, needsPenaltyDecision: false };
  }
  // Drawn — need penalty decision
  if (!score.penaltyWinner) {
    return { winnerId: null, loserId: null, needsPenaltyDecision: true };
  }
  if (score.penaltyWinner === "home") {
    return { winnerId: homeId, loserId: awayId, needsPenaltyDecision: false };
  }
  return { winnerId: awayId, loserId: homeId, needsPenaltyDecision: false };
}

/**
 * Resolve the entire knockout bracket given the group matches and current
 * knockout scores. Returns one ResolvedKnockoutMatch per slot (32 matches).
 */
export function resolveBracket(
  allGroupMatches: GroupMatch[],
  knockoutScores: Record<number, KnockoutScore>,
): ResolvedKnockoutMatch[] {
  const groupsComplete = areGroupsComplete(allGroupMatches);

  // Compute group standings
  const groupStandings = new Map<string, ReturnType<typeof computeGroupStandings>>();
  const allGroups = Array.from(new Set(allGroupMatches.map((m) => m.group)));
  for (const g of allGroups) {
    groupStandings.set(g, computeGroupStandings(g, allGroupMatches));
  }

  // Compute Annex C assignment (only if groups complete)
  let thirdAssignment = new Map<number, string>();
  if (groupsComplete) {
    const ranked = rankThirdPlaceTeams(allGroupMatches);
    const qualified = ranked.filter((t) => t.qualifies);
    const result = assignThirdsToSlots(qualified);
    if (result) thirdAssignment = result;
  }

  const ctx: ResolutionContext = {
    groupStandings,
    thirdAssignment,
    matchWinners: new Map(),
    matchLosers: new Map(),
    knockoutScores,
    groupsComplete,
  };

  const resolved: ResolvedKnockoutMatch[] = [];

  // Process in order — matches reference earlier match results
  for (const slot of BRACKET) {
    const home = resolveSlot(slot.home, slot.id, ctx);
    const away = resolveSlot(slot.away, slot.id, ctx);
    const score = knockoutScores[slot.id] ?? { homeGoals: null, awayGoals: null };
    const outcome = resolveMatchOutcome(home.teamId, away.teamId, score);

    ctx.matchWinners.set(slot.id, outcome.winnerId);
    ctx.matchLosers.set(slot.id, outcome.loserId);

    resolved.push({
      id: slot.id,
      stage: slot.stage,
      homeTeamId: home.teamId,
      awayTeamId: away.teamId,
      homeLabel: home.label,
      awayLabel: away.label,
      score,
      winnerId: outcome.winnerId,
      loserId: outcome.loserId,
      needsPenaltyDecision: outcome.needsPenaltyDecision,
    });
  }

  return resolved;
}

/** Used by UI: which group + position appears as label for a slot */
export function describeSlotShort(ref: SlotRef): string {
  switch (ref.kind) {
    case "groupPos":
      return `${ref.pos}${ref.group}`;
    case "thirdFrom":
      return `3º ${ref.allowedGroups.join("/")}`;
    case "winnerOf":
      return `V.M${ref.matchId}`;
    case "loserOf":
      return `P.M${ref.matchId}`;
  }
}

export { BRACKET_BY_ID };
