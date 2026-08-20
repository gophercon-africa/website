import { Session } from '@/src/types/schedule';
import SessionCard from './SessionCard';
import { CARD_TYPES, formatDuration, formatTime } from './sessionMeta';

export default function SessionRow({ session }: { session: Session }) {
  if (CARD_TYPES.has(session.type)) {
    return <SessionCard session={session} />;
  }

  // Logistics (breaks, registration, networking, remarks) — slim rows.
  const duration = formatDuration(session.startTime, session.endTime);
  return (
    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 rounded-control border border-line/70 bg-surface/60 px-4 py-2.5 sm:px-5">
      <span className="w-24 shrink-0 text-sm font-semibold tabular-nums text-muted">
        {formatTime(session.startTime)}
      </span>
      <span className="font-medium text-body">{session.title}</span>
      <span className="text-sm text-faint">{duration}</span>
    </div>
  );
}
