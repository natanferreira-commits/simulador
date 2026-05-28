const DAYS_PT = ["DOM", "SEG", "TER", "QUA", "QUI", "SEX", "SÁB"];

/** Formats an ISO date like "2026-06-11" into "QUI 11/06" */
export function formatMatchDate(iso: string): string {
  // Parse as UTC to avoid timezone shifts
  const [y, m, d] = iso.split("-").map(Number);
  const date = new Date(Date.UTC(y, m - 1, d));
  const dayName = DAYS_PT[date.getUTCDay()];
  const dd = String(d).padStart(2, "0");
  const mm = String(m).padStart(2, "0");
  return `${dayName} ${dd}/${mm}`;
}
