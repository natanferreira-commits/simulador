export type GroupLetter =
  | "A" | "B" | "C" | "D" | "E" | "F"
  | "G" | "H" | "I" | "J" | "K" | "L";

export type TeamId = string;

export interface Team {
  id: TeamId;
  name: string;
  flag: string;
  fifaRanking: number;
  group: GroupLetter;
}

export interface GroupMatch {
  id: string;
  group: GroupLetter;
  round: 1 | 2 | 3;
  homeId: TeamId;
  awayId: TeamId;
  homeGoals: number | null;
  awayGoals: number | null;
}

export interface GroupStanding {
  teamId: TeamId;
  position: number;
  played: number;
  wins: number;
  draws: number;
  losses: number;
  goalsFor: number;
  goalsAgainst: number;
  goalDiff: number;
  points: number;
  tiebreakerReason?: string;
}

/* ------------ KNOCKOUT ------------ */

export type KnockoutStage = "R32" | "R16" | "QF" | "SF" | "F" | "3RD";

/**
 * A slot reference: either a group-position (winner/runner-up of a group),
 * a third-place pool (3rd from one of N possible groups, decided by Annex C),
 * or a "winner of match M" / "loser of match M" reference.
 */
export type SlotRef =
  | { kind: "groupPos"; group: GroupLetter; pos: 1 | 2 }
  | { kind: "thirdFrom"; allowedGroups: GroupLetter[] }
  | { kind: "winnerOf"; matchId: number }
  | { kind: "loserOf"; matchId: number };

export interface BracketSlot {
  id: number; // match number, 73..104
  stage: KnockoutStage;
  home: SlotRef;
  away: SlotRef;
}

export interface KnockoutScore {
  homeGoals: number | null;
  awayGoals: number | null;
  /** When regulation+extra time ended in a draw, which side won pens */
  penaltyWinner?: "home" | "away";
}

export interface ResolvedKnockoutMatch {
  id: number;
  stage: KnockoutStage;
  /** null when not yet resolvable (previous match still pending) */
  homeTeamId: TeamId | null;
  awayTeamId: TeamId | null;
  /** Friendly label when team isn't resolved yet: "Vencedor do M73", "3º Grupo C/E/F/H/I" */
  homeLabel: string;
  awayLabel: string;
  score: KnockoutScore;
  /** Resolved winner team id, if match has a result */
  winnerId: TeamId | null;
  loserId: TeamId | null;
  /** True if regulation ended drawn AND no penaltyWinner is set yet */
  needsPenaltyDecision: boolean;
}

export interface SimulationState {
  userName: string;
  groupMatches: Record<string, { homeGoals: number | null; awayGoals: number | null }>;
  knockoutMatches: Record<number, KnockoutScore>;
  version: string;
}
