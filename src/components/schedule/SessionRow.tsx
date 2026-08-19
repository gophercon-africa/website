import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { Session } from '@/src/types/schedule';
import { slugify } from '@/src/lib/slug';
import Badge from '@components/ui/Badge';
import SpeakerAvatar from '@components/speakers/SpeakerAvatar';
import {
  CARD_TYPES,
  SESSION_TYPE_META,
  formatDuration,
  formatTime,
} from './sessionMeta';

function TypeBadge({ session }: { session: Session }) {
  const meta = SESSION_TYPE_META[session.type];
  return <Badge tone={meta.tone}>{meta.label}</Badge>;
}

export default function SessionRow({ session }: { session: Session }) {
  const timeRange = `${formatTime(session.startTime)} – ${formatTime(session.endTime)}`;
  const duration = formatDuration(session.startTime, session.endTime);

  if (!CARD_TYPES.has(session.type)) {
    return (
      <div className="flex flex-wrap items-center gap-x-4 gap-y-1 py-3 px-4 sm:px-5">
        <span className="w-24 shrink-0 text-sm font-semibold text-muted tabular-nums">
          {formatTime(session.startTime)}
        </span>
        <span className="font-medium text-body">{session.title}</span>
        <TypeBadge session={session} />
        <span className="text-sm text-faint">{duration}</span>
      </div>
    );
  }

  return (
    <div
      className={`rounded-surface border p-4 sm:p-5 ${
        session.tba
          ? 'border-dashed border-line bg-surface-sunken'
          : 'border-line bg-surface'
      }`}
    >
      <div className="flex flex-col sm:flex-row gap-3 sm:gap-5">
        <div className="shrink-0 flex sm:flex-col items-center sm:items-start gap-2 sm:gap-1 sm:w-24">
          <span
            className={`inline-block rounded-control px-3 py-1 text-sm font-bold tabular-nums ${
              session.tba ? 'bg-gray-200 text-muted' : 'bg-brand text-white'
            }`}
          >
            {formatTime(session.startTime)}
          </span>
          <span className="text-xs text-muted">{duration}</span>
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2 mb-1">
            <span className="text-xs text-muted tabular-nums">{timeRange}</span>
            <TypeBadge session={session} />
          </div>
          <h3
            className={`text-lg font-semibold ${
              session.tba ? 'text-muted' : 'text-ink'
            }`}
          >
            {session.title}
          </h3>
          {session.speaker && (
            <Link
              href={`/speakers?speaker=${slugify(session.speaker.name)}`}
              className="mt-2 inline-flex items-center gap-2 text-sm text-body transition-colors hover:text-brand"
            >
              <SpeakerAvatar name={session.speaker.name} size={24} />
              <span className="font-medium">{session.speaker.name}</span>
            </Link>
          )}
          {!session.speaker && session.speakerLabel && (
            <p className="mt-2 text-sm text-muted">{session.speakerLabel}</p>
          )}
          {session.description && (
            <p className="mt-2 text-sm text-muted line-clamp-2">
              {session.description}
            </p>
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
