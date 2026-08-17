import Link from 'next/link';
import { ArrowRight, User } from 'lucide-react';
import { Session } from '@/src/types/schedule';
import {
  CARD_TYPES,
  SESSION_TYPE_META,
  formatDuration,
  formatTime,
} from './sessionMeta';

function TypeBadge({ session }: { session: Session }) {
  const meta = SESSION_TYPE_META[session.type];
  return (
    <span
      className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-semibold ${meta.className}`}
    >
      {meta.label}
    </span>
  );
}

export default function SessionRow({ session }: { session: Session }) {
  const timeRange = `${formatTime(session.startTime)} – ${formatTime(session.endTime)}`;
  const duration = formatDuration(session.startTime, session.endTime);

  if (!CARD_TYPES.has(session.type)) {
    return (
      <div className="flex flex-wrap items-center gap-x-4 gap-y-1 py-3 px-4 sm:px-5">
        <span className="w-24 shrink-0 text-sm font-semibold text-gray-500 tabular-nums">
          {formatTime(session.startTime)}
        </span>
        <span className="font-medium text-gray-700">{session.title}</span>
        <TypeBadge session={session} />
        <span className="text-sm text-gray-400">{duration}</span>
      </div>
    );
  }

  return (
    <div
      className={`rounded-xl p-4 sm:p-5 ${
        session.tba
          ? 'border border-dashed border-gray-300 bg-gray-50/60'
          : 'border border-gray-200 bg-white shadow-sm'
      }`}
    >
      <div className="flex flex-col sm:flex-row gap-3 sm:gap-5">
        <div className="shrink-0 flex sm:flex-col items-center sm:items-start gap-2 sm:gap-1 sm:w-24">
          <span
            className={`inline-block px-3 py-1 rounded-lg text-sm font-bold tabular-nums ${
              session.tba ? 'bg-gray-200 text-gray-500' : 'bg-brand text-white'
            }`}
          >
            {formatTime(session.startTime)}
          </span>
          <span className="text-xs text-gray-500">{duration}</span>
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2 mb-1">
            <span className="text-xs text-gray-500 tabular-nums">{timeRange}</span>
            <TypeBadge session={session} />
          </div>
          <h3
            className={`text-lg font-bold ${
              session.tba ? 'text-gray-500 italic' : 'text-gray-900'
            }`}
          >
            {session.title}
          </h3>
          {(session.speaker || session.speakerLabel) && (
            <p className="mt-1 flex items-center gap-1.5 text-sm text-gray-600">
              <User className="w-4 h-4 text-gray-400" aria-hidden />
              {session.speaker ? (
                <span className="font-medium">{session.speaker.name}</span>
              ) : (
                <span className="italic text-gray-500">{session.speakerLabel}</span>
              )}
            </p>
          )}
          {session.description && (
            <p className="mt-2 text-sm text-gray-600">{session.description}</p>
          )}
          {session.link && (
            <Link
              href={session.link.href}
              className="mt-2 inline-flex items-center gap-1 text-sm font-semibold text-brand hover:text-brand-dark transition-colors"
            >
              {session.link.label}
              <ArrowRight className="w-4 h-4" aria-hidden />
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
