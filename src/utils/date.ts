export function getNextSunday(date = new Date()): string {
  const dayOfWeek = date.getDay();
  const daysUntilSunday = dayOfWeek === 0 ? 0 : 7 - dayOfWeek;
  const nextSunday = new Date(date);
  nextSunday.setDate(date.getDate() + daysUntilSunday);

  const year = nextSunday.getFullYear();
  const month = String(nextSunday.getMonth() + 1).padStart(2, '0');
  const day = String(nextSunday.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function isFirstSundayOfMonth(dateStr: string): boolean {
  const date = new Date(`${dateStr}T12:00:00`);
  return date.getDay() === 0 && date.getDate() <= 7;
}
