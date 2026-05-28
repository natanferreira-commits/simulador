import type { Team } from "@/types";

export const TEAMS: Team[] = [
  { id: "MEX", name: "México",          flag: "mx", fifaRanking: 14, group: "A" },
  { id: "RSA", name: "África do Sul",   flag: "za", fifaRanking: 56, group: "A" },
  { id: "KOR", name: "Coreia do Sul",   flag: "kr", fifaRanking: 22, group: "A" },
  { id: "CZE", name: "Rep. Tcheca",     flag: "cz", fifaRanking: 42, group: "A" },

  { id: "CAN", name: "Canadá",          flag: "ca", fifaRanking: 28, group: "B" },
  { id: "BIH", name: "Bósnia",          flag: "ba", fifaRanking: 75, group: "B" },
  { id: "QAT", name: "Catar",           flag: "qa", fifaRanking: 53, group: "B" },
  { id: "SUI", name: "Suíça",           flag: "ch", fifaRanking: 19, group: "B" },

  { id: "BRA", name: "Brasil",          flag: "br", fifaRanking: 5,  group: "C" },
  { id: "MAR", name: "Marrocos",        flag: "ma", fifaRanking: 12, group: "C" },
  { id: "HAI", name: "Haiti",           flag: "ht", fifaRanking: 83, group: "C" },
  { id: "SCO", name: "Escócia",         flag: "gb-sct", fifaRanking: 39, group: "C" },

  { id: "USA", name: "Estados Unidos",  flag: "us", fifaRanking: 16, group: "D" },
  { id: "PAR", name: "Paraguai",        flag: "py", fifaRanking: 38, group: "D" },
  { id: "AUS", name: "Austrália",       flag: "au", fifaRanking: 26, group: "D" },
  { id: "TUR", name: "Turquia",         flag: "tr", fifaRanking: 27, group: "D" },

  { id: "GER", name: "Alemanha",        flag: "de", fifaRanking: 9,  group: "E" },
  { id: "CUW", name: "Curaçao",         flag: "cw", fifaRanking: 81, group: "E" },
  { id: "CIV", name: "Costa do Marfim", flag: "ci", fifaRanking: 41, group: "E" },
  { id: "ECU", name: "Equador",         flag: "ec", fifaRanking: 23, group: "E" },

  { id: "NED", name: "Holanda",         flag: "nl", fifaRanking: 7,  group: "F" },
  { id: "JPN", name: "Japão",           flag: "jp", fifaRanking: 17, group: "F" },
  { id: "SWE", name: "Suécia",          flag: "se", fifaRanking: 36, group: "F" },
  { id: "TUN", name: "Tunísia",         flag: "tn", fifaRanking: 49, group: "F" },

  { id: "BEL", name: "Bélgica",         flag: "be", fifaRanking: 8,  group: "G" },
  { id: "EGY", name: "Egito",           flag: "eg", fifaRanking: 32, group: "G" },
  { id: "IRN", name: "Irã",             flag: "ir", fifaRanking: 18, group: "G" },
  { id: "NZL", name: "Nova Zelândia",   flag: "nz", fifaRanking: 86, group: "G" },

  { id: "ESP", name: "Espanha",         flag: "es", fifaRanking: 1,  group: "H" },
  { id: "CPV", name: "Cabo Verde",      flag: "cv", fifaRanking: 73, group: "H" },
  { id: "KSA", name: "Arábia Saudita",  flag: "sa", fifaRanking: 58, group: "H" },
  { id: "URU", name: "Uruguai",         flag: "uy", fifaRanking: 15, group: "H" },

  { id: "FRA", name: "França",          flag: "fr", fifaRanking: 2,  group: "I" },
  { id: "SEN", name: "Senegal",         flag: "sn", fifaRanking: 20, group: "I" },
  { id: "IRQ", name: "Iraque",          flag: "iq", fifaRanking: 57, group: "I" },
  { id: "NOR", name: "Noruega",         flag: "no", fifaRanking: 33, group: "I" },

  { id: "ARG", name: "Argentina",       flag: "ar", fifaRanking: 3,  group: "J" },
  { id: "ALG", name: "Argélia",         flag: "dz", fifaRanking: 34, group: "J" },
  { id: "AUT", name: "Áustria",         flag: "at", fifaRanking: 21, group: "J" },
  { id: "JOR", name: "Jordânia",        flag: "jo", fifaRanking: 64, group: "J" },

  { id: "POR", name: "Portugal",        flag: "pt", fifaRanking: 6,  group: "K" },
  { id: "COD", name: "RD Congo",        flag: "cd", fifaRanking: 60, group: "K" },
  { id: "UZB", name: "Uzbequistão",     flag: "uz", fifaRanking: 55, group: "K" },
  { id: "COL", name: "Colômbia",        flag: "co", fifaRanking: 13, group: "K" },

  { id: "ENG", name: "Inglaterra",      flag: "gb-eng", fifaRanking: 4,  group: "L" },
  { id: "CRO", name: "Croácia",         flag: "hr", fifaRanking: 10, group: "L" },
  { id: "GHA", name: "Gana",            flag: "gh", fifaRanking: 73, group: "L" },
  { id: "PAN", name: "Panamá",          flag: "pa", fifaRanking: 35, group: "L" },
];

export const TEAMS_BY_ID: Record<string, Team> = Object.fromEntries(
  TEAMS.map((t) => [t.id, t]),
);

export const TEAMS_BY_GROUP: Record<string, Team[]> = TEAMS.reduce(
  (acc, team) => {
    (acc[team.group] ??= []).push(team);
    return acc;
  },
  {} as Record<string, Team[]>,
);

export const GROUPS: Array<"A"|"B"|"C"|"D"|"E"|"F"|"G"|"H"|"I"|"J"|"K"|"L"> =
  ["A","B","C","D","E","F","G","H","I","J","K","L"];
