'use client';

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { Session, SessionSpeaker } from '@/src/types/schedule';
import SpeakerAvatar from '@components/speakers/SpeakerAvatar';
import { getSpeakerProfile, speakerExists } from '@/src/lib/speakerLookup';
import { useOpenSpeaker } from './ScheduleSpeakerModal';
import { formatDuration, formatTime } from './sessionMeta';

/** Collapsed preview height for the abstract (~2 lines). */
const COLLAPSED_PX = 48;

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

/** One presenter. Real lineup speakers open the profile modal in place;
 *  placeholder co-presenters render un-linked. */
function SpeakerBlock({ speaker, role }: { speaker: SessionSpeaker; role: string }) {
  const openSpeaker = useOpenSpeaker();
  const profile = getSpeakerProfile(speaker.name);
  const imageUrl = speaker.imageUrl ?? profile.imageUrl;
  const title = speaker.title ?? profile.title;
  const company = speaker.company ?? profile.company;
  const linked = speakerExists(speaker.name);

  const inner = (
    <>
      <SpeakerAvatar
        name={speaker.name}
        imageUrl={imageUrl}
        size={48}
        rounded="control"
      />
      <div className="min-w-0 text-sm leading-tight">
        <p
          className={`font-semibold text-ink ${
            linked
              ? 'transition-colors group-hover:text-brand dark:group-hover:text-brand-bright'
              : ''
          }`}
        >
          {speaker.name}
        </p>
        {title && <p className="mt-0.5 text-muted">{title}</p>}
        {company && <p className="text-muted">{company}</p>}
        <p className="mt-0.5 text-brand dark:text-brand-bright">{role}</p>
      </div>
    </>
  );

  return linked ? (
    <button
      type="button"
      onClick={() => openSpeaker(speaker.name)}
      className="group flex w-fit items-center gap-3 text-left"
    >
      {inner}
    </button>
  ) : (
    <div className="flex w-fit items-center gap-3">{inner}</div>
  );
}

/** GopherCon-US style session card: a left-rail time pill, then a card showing
 *  the time range, title, a 2-line abstract preview that fades and — only when
 *  the text overflows — expands smoothly on click, plus the speaker(s). */
export default function SessionCard({ session }: { session: Session }) {
  const [expanded, setExpanded] = useState(false);
  const [contentHeight, setContentHeight] = useState(0);
  const contentRef = useRef<HTMLDivElement>(null);

  // Measure the abstract's natural height so we can (a) decide whether it
  // overflows the 2-line preview and (b) animate max-height to a real target.
  useEffect(() => {
    const el = contentRef.current;
    if (!el) return;
    const ro = new ResizeObserver(() => setContentHeight(el.scrollHeight));
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const overflowing = contentHeight > COLLAPSED_PX + 2;
  const timeRange = `${formatTime(session.startTime)} – ${formatTime(session.endTime)}`;
  // Full-day is already flagged in the eyebrow, so don't repeat it here.
  const duration = session.fullDay
    ? null
    : formatDuration(session.startTime, session.endTime);
  const label = eyebrow(session);
  const speakerList = session.speakers ?? (session.speaker ? [session.speaker] : []);

  const head = (
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
      {session.description && (
        <div
          className="relative mt-3 overflow-hidden transition-[max-height] duration-300 ease-out"
          style={{ maxHeight: expanded ? contentHeight : COLLAPSED_PX }}
        >
          <div
            ref={contentRef}
            className="whitespace-pre-line text-sm leading-relaxed text-body"
          >
            {session.description}
          </div>
          {overflowing && !expanded && (
            <span className="pointer-events-none absolute inset-x-0 bottom-0 h-8 bg-linear-to-t from-surface to-transparent" />
          )}
        </div>
      )}
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
        {overflowing ? (
          <button
            type="button"
            onClick={() => setExpanded((v) => !v)}
            aria-expanded={expanded}
            className="block w-full cursor-pointer text-left"
          >
            {head}
          </button>
        ) : (
          head
        )}

        {session.segments && (
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

        {speakerList.length > 0 && (
          <div className="mt-4 space-y-3">
            {speakerList.map((s) => (
              <SpeakerBlock key={s.name} speaker={s} role={roleLabel(session)} />
            ))}
          </div>
        )}

        {speakerList.length === 0 && session.speakerLabel && (
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

        {session.link && (
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
