'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, ChevronDown } from 'lucide-react';
import { Session } from '@/src/types/schedule';
import { slugify } from '@/src/lib/slug';
import { getSpeakerProfile } from '@/src/lib/speakerLookup';
import SpeakerAvatar from '@components/speakers/SpeakerAvatar';
import { formatDuration, formatTime } from './sessionMeta';

function roleLabel(session: Session): string {
  if (session.type === 'workshop') return 'Instructor';
  if (session.type === 'panel') return 'Panellists';
  return 'Speaker';
}

function eyebrow(session: Session): string | null {
  if (session.fullDay) return 'Full day';
  if (session.type === 'keynote') return 'Keynote';
  return null;
}

/** GopherCon-US style session card: a brand time pill on the left rail, then a
 *  collapsible card. Collapsed shows the time range, title and speaker; expanding
 *  reveals the abstract, any full-day segments and the details link. */
export default function SessionCard({ session }: { session: Session }) {
  const expandable = Boolean(
    session.description || session.segments || session.link
  );
  const [expanded, setExpanded] = useState(Boolean(session.fullDay));

  const timeRange = `${formatTime(session.startTime)} – ${formatTime(session.endTime)}`;
  // Full-day is already flagged in the eyebrow, so don't repeat it here.
  const duration = session.fullDay
    ? null
    : formatDuration(session.startTime, session.endTime);
  const label = eyebrow(session);

  const header = (
    <>
      {label && (
        <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-brand dark:text-brand-bright">
          {label}
        </p>
      )}
      <p className="text-sm text-muted tabular-nums">
        {timeRange}
        {duration && <span className="text-faint"> · {duration}</span>}
      </p>
      <h3
        className={`mt-1 text-lg font-semibold ${
          session.tba ? 'text-muted' : 'text-ink'
        }`}
      >
        {session.title}
      </h3>
    </>
  );

  return (
    <div className="flex gap-3 sm:gap-4">
      <div className="shrink-0 pt-4">
        <span
          className={`inline-block rounded-control px-2.5 py-1 text-xs font-bold tabular-nums ${
            session.tba ? 'bg-line text-muted' : 'bg-brand text-white'
          }`}
        >
          {formatTime(session.startTime)}
        </span>
      </div>

      <article
        className={`min-w-0 flex-1 rounded-surface border p-4 shadow-sm transition sm:p-5 ${
          session.tba
            ? 'border-dashed border-line bg-surface-sunken'
            : session.fullDay
              ? 'border-brand/30 bg-surface'
              : 'border-line bg-surface hover:border-brand/30 hover:shadow'
        }`}
      >
        {expandable ? (
          <button
            type="button"
            onClick={() => setExpanded((v) => !v)}
            aria-expanded={expanded}
            className="flex w-full items-start justify-between gap-3 text-left"
          >
            <span className="min-w-0">{header}</span>
            <ChevronDown
              className={`mt-1 h-5 w-5 shrink-0 text-muted transition-transform ${
                expanded ? 'rotate-180' : ''
              }`}
              aria-hidden
            />
          </button>
        ) : (
          header
        )}

        {expanded && session.description && (
          <p className="mt-3 whitespace-pre-line text-sm leading-relaxed text-body">
            {session.description}
          </p>
        )}

        {expanded && session.segments && (
          <ol className="mt-4 space-y-1.5 border-l-2 border-line pl-4">
            {session.segments.map((seg) => (
              <li key={seg.startTime} className="flex flex-wrap gap-x-3 text-sm">
                <span className="w-32 shrink-0 tabular-nums text-muted">
                  {formatTime(seg.startTime)} – {formatTime(seg.endTime)}
                </span>
                <span
                  className={
                    seg.type === 'break' ? 'text-muted' : 'font-medium text-body'
                  }
                >
                  {seg.title}
                </span>
              </li>
            ))}
          </ol>
        )}

        {session.speaker &&
          (() => {
            const profile = getSpeakerProfile(session.speaker!.name);
            return (
              <Link
                href={`/speakers?speaker=${slugify(session.speaker!.name)}`}
                className="group mt-4 flex w-fit items-center gap-3"
              >
                <SpeakerAvatar
                  name={session.speaker!.name}
                  imageUrl={profile.imageUrl}
                  size={48}
                  rounded="control"
                />
                <div className="min-w-0 text-sm leading-tight">
                  <p className="font-semibold text-ink transition-colors group-hover:text-brand">
                    {session.speaker!.name}
                  </p>
                  {profile.title && <p className="mt-0.5 text-muted">{profile.title}</p>}
                  {profile.company && <p className="text-muted">{profile.company}</p>}
                  <p className="mt-0.5 text-brand dark:text-brand-bright">
                    {roleLabel(session)}
                  </p>
                </div>
              </Link>
            );
          })()}

        {!session.speaker && session.speakerLabel && (
          <p className="mt-4 text-sm text-muted">{session.speakerLabel}</p>
        )}

        {session.sponsor && (
          <div className="mt-4">
            <p className="text-xs font-semibold uppercase tracking-wide text-muted">
              Sponsored By
            </p>
            <span className="mt-2 inline-flex items-center justify-center rounded-control border border-line bg-white p-3">
              <Image
                src={session.sponsor.logo}
                alt={session.sponsor.name}
                width={180}
                height={48}
                className="h-8 w-auto object-contain"
              />
            </span>
          </div>
        )}

        {expanded && session.link && (
          <Link
            href={session.link.href}
            className="mt-4 flex w-fit items-center gap-1 text-sm font-semibold text-brand transition-colors hover:text-brand-dark dark:text-brand-bright dark:hover:text-brand-light"
          >
            {session.link.label}
            <ArrowRight className="h-4 w-4" aria-hidden />
          </Link>
        )}
      </article>
    </div>
  );
}
