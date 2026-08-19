'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { scheduleData } from '@data/schedule';
import { Session, SessionType } from '@/src/types/schedule';
import Button from '@components/ui/Button';
import DaySection from './DaySection';
import DayTabs from './DayTabs';
import ScheduleSearch from './ScheduleSearch';
import TypeFilter from './TypeFilter';
import { CONTENT_TYPES, SESSION_TYPE_META } from './sessionMeta';

function parseDay(value: string | null): number | null {
  const day = Number(value);
  return scheduleData.some((d) => d.day === day) ? day : null;
}

function parseType(value: string | null): SessionType | null {
  return CONTENT_TYPES.includes(value as SessionType)
    ? (value as SessionType)
    : null;
}

function sessionMatches(session: Session, query: string): boolean {
  if (!query) return true;
  return [
    session.title,
    session.speaker?.name,
    session.speakerLabel,
    session.description,
    SESSION_TYPE_META[session.type].label,
  ]
    .filter(Boolean)
    .join(' ')
    .toLowerCase()
    .includes(query);
}

/** Owns the schedule's filter state (?day&q&type), synced to the URL so
 *  filtered views survive reload and are shareable. */
export default function ScheduleExplorer() {
  const searchParams = useSearchParams();
  const [day, setDay] = useState<number | null>(() =>
    parseDay(searchParams.get('day'))
  );
  const [query, setQuery] = useState(() => searchParams.get('q') ?? '');
  const [type, setType] = useState<SessionType | null>(() =>
    parseType(searchParams.get('type'))
  );

  // Mirror state into the URL (replaceState — no history spam, no scroll
  // jumps). Debounced so fast typing doesn't thrash the address bar.
  const firstRender = useRef(true);
  useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false;
      return;
    }
    const handle = setTimeout(() => {
      const params = new URLSearchParams();
      if (day !== null) params.set('day', String(day));
      if (query.trim()) params.set('q', query.trim());
      if (type) params.set('type', type);
      const qs = params.toString();
      window.history.replaceState(
        null,
        '',
        qs ? `?${qs}` : window.location.pathname
      );
    }, 150);
    return () => clearTimeout(handle);
  }, [day, query, type]);

  const normalizedQuery = query.trim().toLowerCase();
  const filtering = normalizedQuery !== '' || type !== null;

  // Chip counts reflect the current day + query, not the type selection
  // itself (so other chips stay meaningful while one is active).
  const typeCounts = useMemo(() => {
    const counts: Partial<Record<SessionType, number>> = {};
    for (const d of scheduleData) {
      if (day !== null && d.day !== day) continue;
      for (const session of d.sessions) {
        if (!sessionMatches(session, normalizedQuery)) continue;
        counts[session.type] = (counts[session.type] ?? 0) + 1;
      }
    }
    return counts;
  }, [day, normalizedQuery]);

  const visibleDays = useMemo(() => {
    return scheduleData
      .filter((d) => day === null || d.day === day)
      .map((d) => ({
        ...d,
        sessions: d.sessions.filter((session) => {
          if (type && session.type !== type) return false;
          return sessionMatches(session, normalizedQuery);
        }),
      }))
      .filter((d) => d.sessions.length > 0);
  }, [day, normalizedQuery, type]);

  const resultCount = visibleDays.reduce((n, d) => n + d.sessions.length, 0);

  const clearFilters = () => {
    setDay(null);
    setQuery('');
    setType(null);
  };

  return (
    <div>
      <div className="mb-8 space-y-4">
        <ScheduleSearch value={query} onChange={setQuery} />
        <div className="flex flex-wrap items-center justify-between gap-4">
          <DayTabs days={scheduleData} selected={day} onSelect={setDay} />
          <TypeFilter counts={typeCounts} selected={type} onSelect={setType} />
        </div>
        {filtering && (
          <p className="text-sm text-muted" role="status">
            {resultCount === 1 ? '1 session' : `${resultCount} sessions`}
            {normalizedQuery && (
              <>
                {' '}
                matching <span className="font-semibold text-ink">&ldquo;{query.trim()}&rdquo;</span>
              </>
            )}
          </p>
        )}
      </div>

      {resultCount === 0 ? (
        <div className="py-16 text-center">
          <p className="text-lg font-semibold text-ink">No sessions found</p>
          <p className="mt-1 text-sm text-muted">
            Try a different search, or clear the filters to see the full
            program.
          </p>
          <Button variant="secondary" className="mt-6" onClick={clearFilters}>
            Clear filters
          </Button>
        </div>
      ) : (
        <div className="space-y-12">
          {visibleDays.map((d) => (
            <DaySection key={d.day} schedule={d} />
          ))}
        </div>
      )}
    </div>
  );
}
