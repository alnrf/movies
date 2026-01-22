export function getYearFromDate(
  date?: string | null,
): number | null {
  if (!date) return null;

  const year = new Date(date).getFullYear();

  return Number.isNaN(year) ? null : year;
}
