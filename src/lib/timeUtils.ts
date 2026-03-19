/**
 * Convert "HH:mm" (24h) to "h:mm AM/PM"
 */
export function formatTime12h(time: string): string {
  const [hStr, mStr] = time.split(':');
  let h = parseInt(hStr);
  const m = mStr || '00';
  const ampm = h >= 12 ? 'PM' : 'AM';
  if (h === 0) h = 12;
  else if (h > 12) h -= 12;
  return `${h}:${m} ${ampm}`;
}

/**
 * Get the fractional hour from "HH:mm" — e.g. "09:30" → 9.5
 */
export function timeToHours(time: string): number {
  const [h, m] = time.split(':').map(Number);
  return h + (m || 0) / 60;
}
