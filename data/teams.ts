import type { Team } from "@/types";

export const TEAMS: Team[] = [
  { id: "MEX", name: "México",          code: "MEX", flag: "mx", fifaRanking: 14, group: "A" },
  { id: "RSA", name: "África do Sul",   code: "AFS", flag: "za", fifaRanking: 56, group: "A" },
  { id: "KOR", name: "Coreia do Sul",   code: "COR", flag: "kr", fifaRanking: 22, group: "A" },
  { id: "CZE", name: "Rep. Tcheca",     code: "TCH", flag: "cz", fifaRanking: 42, group: "A" },

  { id: "CAN", name: "Canadá",          code: "CAN", flag: "ca", fifaRanking: 28, group: "B" },
  { id: "BIH", name: "Bósnia",          code: "BOS", flag: "ba", fifaRanking: 75, group: "B" },
  { id: "QAT", name: "Catar",           code: "CAT", flag: "qa", fifaRanking: 53, group: "B" },
  { id: "SUI", name: "Suíça",           code: "SUI", flag: "ch", fifaRanking: 19, group: "B" },

  { id: "BRA", name: "Brasil",          code: "BRA", flag: "br", fifaRanking: 5,  group: "C" },
  { id: "MAR", name: "Marrocos",        code: "MAR", flag: "ma", fifaRanking: 12, group: "C" },
  { id: "HAI", name: "Haiti",           code: "HAI", flag: "ht", fifaRanking: 83, group: "C" },
  { id: "SCO", name: "Escócia",         code: "ESC", flag: "gb-sct", fifaRanking: 39, group: "C" },

  { id: "USA", name: "Estados Unidos",  code: "EUA", flag: "us", fifaRanking: 16, group: "D" },
  { id: "PAR", name: "Paraguai",        code: "PAR", flag: "py", fifaRanking: 38, group: "D" },
  { id: "AUS", name: "Austrália",       code: "AUS", flag: "au", fifaRanking: 26, group: "D" },
  { id: "TUR", name: "Turquia",         code: "TUR", flag: "tr", fifaRanking: 27, group: "D" },

  { id: "GER", name: "Alemanha",        code: "ALE", flag: "de", fifaRanking: 9,  group: "E" },
  { id: "CUW", name: "Curaçao",         code: "CUR", flag: "cw", fifaRanking: 81, group: "E" },
  { id: "CIV", name: "Costa do Marfim", code: "CMF", flag: "ci", fifaRanking: 41, group: "E" },
  { id: "ECU", name: "Equador",         code: "EQU", flag: "ec", fifaRanking: 23, group: "E" },

  { id: "NED", name: "Holanda",         code: "HOL", flag: "nl", fifaRanking: 7,  group: "F" },
  { id: "JPN", name: "Japão",           code: "JAP", flag: "jp", fifaRanking: 17, group: "F" },
  { id: "SWE", name: "Suécia",          code: "SUE", flag: "se", fifaRanking: 36, group: "F" },
  { id: "TUN", name: "Tunísia",         code: "TUN", flag: "tn", fifaRanking: 49, group: "F" },

  { id: "BEL", name: "Bélgica",         code: "BEL", flag: "be", fifaRanking: 8,  group: "G" },
  { id: "EGY", name: "Egito",           code: "EGI", flag: "eg", fifaRanking: 32, group: "G" },
  { id: "IRN", name: "Irã",             code: "IRA", flag: "ir", fifaRanking: 18, group: "G" },
  { id: "NZL", name: "Nova Zelândia",   code: "NZL", flag: "nz", fifaRanking: 86, group: "G" },

  { id: "ESP", name: "Espanha",         code: "ESP", flag: "es", fifaRanking: 1,  group: "H" },
  { id: "CPV", name: "Cabo Verde",      code: "CBV", flag: "cv", fifaRanking: 73, group: "H" },
  { id: "KSA", name: "Arábia Saudita",  code: "ASA", flag: "sa", fifaRanking: 58, group: "H" },
  { id: "URU", name: "Uruguai",         code: "URU", flag: "uy", fifaRanking: 15, group: "H" },

  { id: "FRA", name: "França",          code: "FRA", flag: "fr", fifaRanking: 2,  group: "I" },
  { id: "SEN", name: "Senegal",         code: "SEN", flag: "sn", fifaRanking: 20, group: "I" },
  { id: "IRQ", name: "Iraque",          code: "IRQ", flag: "iq", fifaRanking: 57, group: "I" },
  { id: "NOR", name: "Noruega",         code: "NOR", flag: "no", fifaRanking: 33, group: "I" },

  { id: "ARG", name: "Argentina",       code: "ARG", flag: "ar", fifaRanking: 3,  group: "J" },
  { id: "ALG", name: "Argélia",         code: "AGL", flag: "dz", fifaRanking: 34, group: "J" },
  { id: "AUT", name: "Áustria",         code: "AUT", flag: "at", fifaRanking: 21, group: "J" },
  { id: "JOR", name: "Jordânia",        code: "JOR", flag: "jo", fifaRanking: 64, group: "J" },

  { id: "POR", name: "Portugal",        code: "POR", flag: "pt", fifaRanking: 6,  group: "K" },
  { id: "COD", name: "RD Congo",        code: "RDC", flag: "cd", fifaRanking: 60, group: "K" },
  { id: "UZB", name: "Uzbequistão",     code: "UZB", flag: "uz", fifaRanking: 55, group: "K" },
  { id: "COL", name: "Colômbia",        code: "COL", flag: "co", fifaRanking: 13, group: "K" },

  { id: "ENG", name: "Inglaterra",      code: "ING", flag: "gb-eng", fifaRanking: 4,  group: "L" },
  { id: "CRO", name: "Croácia",         code: "CRO", flag: "hr", fifaRanking: 10, group: "L" },
  { id: "GHA", name: "Gana",            code: "GAN", flag: "gh", fifaRanking: 73, group: "L" },
  { id: "PAN", name: "Panamá",          code: "PAN", flag: "pa", fifaRanking: 35, group: "L" },
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
