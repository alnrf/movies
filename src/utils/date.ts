export function getYearFromDate(
  date?: string | null,
): number | null {
  if (!date) return null;

  const year = new Date(date).getFullYear();

  return Number.isNaN(year) ? null : year;
}

export function formatDate(date?: string | null): string | null {
  if (!date) return null;

  const dateObj = new Date(date);
  if (Number.isNaN(dateObj.getTime())) return null;

  const day = String(dateObj.getDate()).padStart(2, "0");
  const month = String(dateObj.getMonth() + 1).padStart(2, "0");
  const year = dateObj.getFullYear();

  return `${day}/${month}/${year}`;
}

export function calculateAgeDetailed(birthDate: string, endDate?: string): string {
  const birth = new Date(birthDate);
  const end = endDate ? new Date(endDate) : new Date();

  if (Number.isNaN(birth.getTime()) || Number.isNaN(end.getTime())) return "—";

  let years = end.getFullYear() - birth.getFullYear();
  let months = end.getMonth() - birth.getMonth();
  let days = end.getDate() - birth.getDate();

  if (days < 0) {
    months--;
    const prevMonth = new Date(end.getFullYear(), end.getMonth(), 0);
    days += prevMonth.getDate();
  }

  if (months < 0) {
    years--;
    months += 12;
  }

  return `${years} a, ${months} m, ${days} d`;
}
