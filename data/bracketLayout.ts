/**
 * Mirror layout for the Y-shaped bracket.
 * Left half flows toward semifinal 101 → final 104.
 * Right half flows toward semifinal 102 → final 104.
 * Match 103 is the 3rd-place match (losers of 101 and 102).
 */

export const LEFT_HALF = {
  R32: [73, 75, 74, 77, 83, 84, 81, 82],
  R16: [89, 90, 93, 94],
  QF:  [97, 98],
  SF:  [101],
};

export const RIGHT_HALF = {
  R32: [76, 78, 79, 80, 86, 88, 85, 87],
  R16: [91, 92, 95, 96],
  QF:  [99, 100],
  SF:  [102],
};

export const CENTER = {
  FINAL: 104,
  THIRD: 103,
};
