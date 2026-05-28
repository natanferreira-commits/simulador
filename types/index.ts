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

export interface SimulationState {
  userName: string;
  groupMatches: Record<string, { homeGoals: number | null; awayGoals: number | null }>;
  version: string;
}
