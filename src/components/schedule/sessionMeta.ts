import { SessionType } from '@/src/types/schedule';

/** Label + badge tone per session type. Tones map to the Badge primitive:
 *  keynote is the only brand-tinted badge; other content is neutral; the
 *  logistical rows (breaks etc.) are outline. No per-type color rainbow. */
export const SESSION_TYPE_META: Record<
  SessionType,
  { label: string; tone: 'brand' | 'neutral' | 'outline' }
> = {
  keynote: { label: 'Keynote', tone: 'brand' },
  talk: { label: 'Talk', tone: 'neutral' },
  lightning: { label: 'Lightning Talk', tone: 'neutral' },
  workshop: { label: 'Workshop', tone: 'neutral' },
  panel: { label: 'Panel', tone: 'neutral' },
  sponsor: { label: 'Sponsor', tone: 'neutral' },
  break: { label: 'Break', tone: 'outline' },
  networking: { label: 'Networking', tone: 'outline' },
  registration: { label: 'Registration', tone: 'outline' },
  remarks: { label: 'Remarks', tone: 'outline' },
};

/** Session types rendered as full cards; the rest render as slim rows. */
export const CARD_TYPES: ReadonlySet<SessionType> = new Set<SessionType>([
  'keynote',
  'talk',
  'lightning',
  'workshop',
  'panel',
  'sponsor',
]);

/** Filterable content types, in display order for the type chips. */
export const CONTENT_TYPES: readonly SessionType[] = [
  'keynote',
  'talk',
  'lightning',
  'workshop',
  'panel',
  'sponsor',
];

function toMinutes(time: string): number {
  const [hours, minutes] = time.split(':').map(Number);
  return hours * 60 + minutes;
}

/** '09:20' → '9:20 AM' */
export function formatTime(time: string): string {
  const [hours, minutes] = time.split(':').map(Number);
  const period = hours >= 12 ? 'PM' : 'AM';
  const displayHours = hours % 12 === 0 ? 12 : hours % 12;
  return `${displayHours}:${String(minutes).padStart(2, '0')} ${period}`;
}

/** ('09:30', '11:30') → '2 hr'; ('09:20', '09:50') → '30 min' */
export function formatDuration(startTime: string, endTime: string): string {
  const total = toMinutes(endTime) - toMinutes(startTime);
  const hours = Math.floor(total / 60);
  const minutes = total % 60;
  if (hours === 0) return `${minutes} min`;
  if (minutes === 0) return `${hours} hr`;
  return `${hours} hr ${minutes} min`;
}
