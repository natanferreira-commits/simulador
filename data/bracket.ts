import type { BracketSlot, GroupLetter } from "@/types";

/**
 * Official 2026 FIFA World Cup bracket structure.
 * Round of 32: matches 73-88
 * Round of 16: matches 89-96
 * Quarterfinals: matches 97-100
 * Semifinals: matches 101-102
 * Third place: match 103
 * Final: match 104
 *
 * The R32 third-place slot allowed groups follow the published official
 * bracket. The exact mapping (which 3rd plays which 1st) depends on which
 * 8 of 12 third-placed teams qualify — Annex C with 495 scenarios.
 * We resolve this at runtime via backtracking (see lib/bracketResolver.ts).
 */

const G = (g: string): GroupLetter => g as GroupLetter;

export const BRACKET: BracketSlot[] = [
  // ---------- ROUND OF 32 ----------
  { id: 73, stage: "R32", home: { kind: "groupPos", group: G("A"), pos: 2 }, away: { kind: "groupPos", group: G("B"), pos: 2 } },
  { id: 74, stage: "R32", home: { kind: "groupPos", group: G("E"), pos: 1 }, away: { kind: "thirdFrom", allowedGroups: ["A","B","C","D","F"].map(G) } },
  { id: 75, stage: "R32", home: { kind: "groupPos", group: G("F"), pos: 1 }, away: { kind: "groupPos", group: G("C"), pos: 2 } },
  { id: 76, stage: "R32", home: { kind: "groupPos", group: G("C"), pos: 1 }, away: { kind: "groupPos", group: G("F"), pos: 2 } },
  { id: 77, stage: "R32", home: { kind: "groupPos", group: G("I"), pos: 1 }, away: { kind: "thirdFrom", allowedGroups: ["C","D","F","G","H"].map(G) } },
  { id: 78, stage: "R32", home: { kind: "groupPos", group: G("E"), pos: 2 }, away: { kind: "groupPos", group: G("I"), pos: 2 } },
  { id: 79, stage: "R32", home: { kind: "groupPos", group: G("A"), pos: 1 }, away: { kind: "thirdFrom", allowedGroups: ["C","E","F","H","I"].map(G) } },
  { id: 80, stage: "R32", home: { kind: "groupPos", group: G("L"), pos: 1 }, away: { kind: "thirdFrom", allowedGroups: ["E","H","I","J","K"].map(G) } },
  { id: 81, stage: "R32", home: { kind: "groupPos", group: G("D"), pos: 1 }, away: { kind: "thirdFrom", allowedGroups: ["B","E","F","I","J"].map(G) } },
  { id: 82, stage: "R32", home: { kind: "groupPos", group: G("G"), pos: 1 }, away: { kind: "thirdFrom", allowedGroups: ["A","E","H","I","J"].map(G) } },
  { id: 83, stage: "R32", home: { kind: "groupPos", group: G("K"), pos: 2 }, away: { kind: "groupPos", group: G("L"), pos: 2 } },
  { id: 84, stage: "R32", home: { kind: "groupPos", group: G("H"), pos: 1 }, away: { kind: "groupPos", group: G("J"), pos: 2 } },
  { id: 85, stage: "R32", home: { kind: "groupPos", group: G("B"), pos: 1 }, away: { kind: "thirdFrom", allowedGroups: ["E","F","G","I","J"].map(G) } },
  { id: 86, stage: "R32", home: { kind: "groupPos", group: G("J"), pos: 1 }, away: { kind: "groupPos", group: G("H"), pos: 2 } },
  { id: 87, stage: "R32", home: { kind: "groupPos", group: G("K"), pos: 1 }, away: { kind: "thirdFrom", allowedGroups: ["D","E","I","J","L"].map(G) } },
  { id: 88, stage: "R32", home: { kind: "groupPos", group: G("D"), pos: 2 }, away: { kind: "groupPos", group: G("G"), pos: 2 } },

  // ---------- ROUND OF 16 ----------
  { id: 89, stage: "R16", home: { kind: "winnerOf", matchId: 73 }, away: { kind: "winnerOf", matchId: 75 } },
  { id: 90, stage: "R16", home: { kind: "winnerOf", matchId: 74 }, away: { kind: "winnerOf", matchId: 77 } },
  { id: 91, stage: "R16", home: { kind: "winnerOf", matchId: 76 }, away: { kind: "winnerOf", matchId: 78 } },
  { id: 92, stage: "R16", home: { kind: "winnerOf", matchId: 79 }, away: { kind: "winnerOf", matchId: 80 } },
  { id: 93, stage: "R16", home: { kind: "winnerOf", matchId: 83 }, away: { kind: "winnerOf", matchId: 84 } },
  { id: 94, stage: "R16", home: { kind: "winnerOf", matchId: 81 }, away: { kind: "winnerOf", matchId: 82 } },
  { id: 95, stage: "R16", home: { kind: "winnerOf", matchId: 86 }, away: { kind: "winnerOf", matchId: 88 } },
  { id: 96, stage: "R16", home: { kind: "winnerOf", matchId: 85 }, away: { kind: "winnerOf", matchId: 87 } },

  // ---------- QUARTERFINALS ----------
  { id: 97,  stage: "QF", home: { kind: "winnerOf", matchId: 89 }, away: { kind: "winnerOf", matchId: 90 } },
  { id: 98,  stage: "QF", home: { kind: "winnerOf", matchId: 93 }, away: { kind: "winnerOf", matchId: 94 } },
  { id: 99,  stage: "QF", home: { kind: "winnerOf", matchId: 91 }, away: { kind: "winnerOf", matchId: 92 } },
  { id: 100, stage: "QF", home: { kind: "winnerOf", matchId: 95 }, away: { kind: "winnerOf", matchId: 96 } },

  // ---------- SEMIFINALS ----------
  { id: 101, stage: "SF", home: { kind: "winnerOf", matchId: 97 }, away: { kind: "winnerOf", matchId: 98 } },
  { id: 102, stage: "SF", home: { kind: "winnerOf", matchId: 99 }, away: { kind: "winnerOf", matchId: 100 } },

  // ---------- THIRD PLACE ----------
  { id: 103, stage: "3RD", home: { kind: "loserOf", matchId: 101 }, away: { kind: "loserOf", matchId: 102 } },

  // ---------- FINAL ----------
  { id: 104, stage: "F", home: { kind: "winnerOf", matchId: 101 }, away: { kind: "winnerOf", matchId: 102 } },
];

export const BRACKET_BY_ID: Record<number, BracketSlot> = Object.fromEntries(
  BRACKET.map((m) => [m.id, m]),
);

export const BRACKET_BY_STAGE: Record<string, BracketSlot[]> = BRACKET.reduce(
  (acc, m) => {
    (acc[m.stage] ??= []).push(m);
    return acc;
  },
  {} as Record<string, BracketSlot[]>,
);

export const STAGES_ORDER: Array<{ stage: "R32" | "R16" | "QF" | "SF" | "F" | "3RD"; label: string }> = [
  { stage: "R32", label: "Oitavas de 32" },
  { stage: "R16", label: "Oitavas de 16" },
  { stage: "QF",  label: "Quartas" },
  { stage: "SF",  label: "Semifinais" },
  { stage: "3RD", label: "3º lugar" },
  { stage: "F",   label: "Final" },
];
