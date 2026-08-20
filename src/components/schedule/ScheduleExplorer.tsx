'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { scheduleData } from '@data/schedule';
import { Session } from '@/src/types/schedule';
import Button from '@components/ui/Button';
import DaySection from './DaySection';
import DayTabs from './DayTabs';
import ScheduleSearch from './ScheduleSearch';
import { SESSION_TYPE_META } from './sessionMeta';

function parseDay(value: string | null): number | null {
  const day = Number(value);
  return scheduleData.some((d) => d.day === day) ? day : null;
}

function sessionMatches(session: Session, query: string): boolean {
  if (!query) return true;
  return [
    session.title,
    session.speaker?.name,
    session.speakerLabel,
    session.sponsor?.name,
    session.description,
    SESSION_TYPE_META[session.type].label,
  ]
    .filter(Boolean)
    .join(' ')
    .toLowerCase()
    .includes(query);
}

/** Owns the schedule's filter state (?day&q), synced to the URL so filtered
 *  views survive reload and are shareable. */
export default function ScheduleExplorer() {
  const searchParams = useSearchParams();
  const [day, setDay] = useState<number | null>(() =>
    parseDay(searchParams.get('day'))
  );
  const [query, setQuery] = useState(() => searchParams.get('q') ?? '');

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
      const qs = params.toString();
      window.history.replaceState(
        null,
        '',
        qs ? `?${qs}` : window.location.pathname
      );
    }, 150);
    return () => clearTimeout(handle);
  }, [day, query]);

  const normalizedQuery = query.trim().toLowerCase();
  const filtering = normalizedQuery !== '';

  const visibleDays = useMemo(() => {
    return scheduleData
      .filter((d) => day === null || d.day === day)
      .map((d) => ({
        ...d,
        sessions: d.sessions.filter((session) =>
          sessionMatches(session, normalizedQuery)
        ),
      }))
      .filter((d) => d.sessions.length > 0);
  }, [day, normalizedQuery]);

  const resultCount = visibleDays.reduce((n, d) => n + d.sessions.length, 0);

  const clearFilters = () => {
    setDay(null);
    setQuery('');
  };

  return (
    <div>
      <div className="mb-8 space-y-4">
        <ScheduleSearch value={query} onChange={setQuery} />
        <DayTabs days={scheduleData} selected={day} onSelect={setDay} />
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
