import type { GroupLetter } from "@/types";
import { BRACKET } from "@/data/bracket";
import type { ThirdPlaceEntry } from "./thirdPlaceRanking";

/**
 * Annex C resolution — given the 8 qualified third-placed teams,
 * find a valid assignment to the 8 "thirdFrom" slots in the R32,
 * respecting the allowedGroups whitelist of each slot.
 *
 * This uses backtracking. Returns a map from R32 match id → group letter
 * of the third-placed team assigned to that slot.
 *
 * Returns null if no valid assignment exists (shouldn't happen with
 * the official allowedGroups lists for any combination of 8 of 12).
 *
 * NOTE: FIFA's official Annex C pre-defines a *specific* assignment per
 * scenario. Our backtracking finds *a* valid assignment which respects
 * the same constraints (no same-group rematch before QF), but the exact
 * match-up may differ from the official table. Sufficient for an MVP.
 */
export function assignThirdsToSlots(
  qualifiedThirds: ThirdPlaceEntry[],
): Map<number, GroupLetter> | null {
  const slots = BRACKET.filter(
    (m) => m.stage === "R32" && m.away.kind === "thirdFrom",
  ).map((m) => ({
    matchId: m.id,
    allowedGroups: m.away.kind === "thirdFrom" ? m.away.allowedGroups : [],
  }));

  // Order slots by most constrained first (smallest pool of valid thirds).
  // This makes backtracking fast.
  const thirdsByGroup = new Map(qualifiedThirds.map((t) => [t.group, t]));
  const orderedSlots = [...slots].sort((a, b) => {
    const validA = a.allowedGroups.filter((g) => thirdsByGroup.has(g)).length;
    const validB = b.allowedGroups.filter((g) => thirdsByGroup.has(g)).length;
    return validA - validB;
  });

  const assignment = new Map<number, GroupLetter>();
  const usedGroups = new Set<GroupLetter>();

  function backtrack(idx: number): boolean {
    if (idx === orderedSlots.length) return true;
    const slot = orderedSlots[idx];
    for (const group of slot.allowedGroups) {
      if (usedGroups.has(group)) continue;
      if (!thirdsByGroup.has(group)) continue;
      usedGroups.add(group);
      assignment.set(slot.matchId, group);
      if (backtrack(idx + 1)) return true;
      usedGroups.delete(group);
      assignment.delete(slot.matchId);
    }
    return false;
  }

  return backtrack(0) ? assignment : null;
}
