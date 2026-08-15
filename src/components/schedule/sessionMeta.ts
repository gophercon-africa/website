import { SessionType } from '@/src/types/schedule';

export const SESSION_TYPE_META: Record<
  SessionType,
  { label: string; className: string }
> = {
  keynote: { label: 'Keynote', className: 'bg-amber-100 text-amber-800' },
  talk: { label: 'Talk', className: 'bg-emerald-100 text-emerald-800' },
  lightning: {
    label: 'Lightning Talk',
    className: 'bg-yellow-100 text-yellow-800',
  },
  workshop: { label: 'Workshop', className: 'bg-purple-100 text-purple-800' },
  panel: { label: 'Panel', className: 'bg-pink-100 text-pink-800' },
  sponsor: { label: 'Sponsor', className: 'bg-indigo-100 text-indigo-800' },
  break: { label: 'Break', className: 'bg-gray-100 text-gray-600' },
  networking: { label: 'Networking', className: 'bg-teal-100 text-teal-800' },
  registration: {
    label: 'Registration',
    className: 'bg-gray-100 text-gray-600',
  },
  remarks: { label: 'Remarks', className: 'bg-gray-100 text-gray-600' },
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
