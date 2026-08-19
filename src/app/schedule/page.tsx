import { Metadata } from 'next';
import { Suspense } from 'react';
import Container from '@components/ui/Container';
import ScheduleExplorer from '@components/schedule/ScheduleExplorer';
import { CITY, EVENT_DATES, VENUE } from '@/src/lib/event';

export const metadata: Metadata = {
  title: 'Schedule | GopherCon Africa 2026',
  description: `Three days of Go workshops, talks, and community — ${EVENT_DATES} at ${VENUE}, ${CITY}.`,
};

function ScheduleSkeleton() {
  return (
    <div aria-hidden>
      <div className="mb-8 space-y-4">
        <div className="h-10 rounded-control border border-line bg-surface" />
        <div className="h-9 w-72 rounded-control border border-line bg-surface" />
      </div>
      <div className="space-y-3">
        {Array.from({ length: 6 }, (_, i) => (
          <div
            key={i}
            className="h-24 rounded-surface border border-line bg-surface"
          />
        ))}
      </div>
    </div>
  );
}

export default function SchedulePage() {
  return (
    <div className="min-h-screen bg-surface-sunken py-16">
      <Container>
        <div className="mb-10 text-center">
          <p className="text-xs font-semibold uppercase tracking-wide text-brand">
            {EVENT_DATES} · {CITY}
          </p>
          <h1 className="mt-2 text-4xl sm:text-5xl font-bold tracking-tight text-ink">
            Schedule
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-muted">
            One workshop day and two conference days at {VENUE}.
          </p>
          <p className="mt-3 text-sm text-muted">
            Draft program — sessions and speakers update as they&apos;re
            confirmed.
          </p>
        </div>

        <Suspense fallback={<ScheduleSkeleton />}>
          <ScheduleExplorer />
        </Suspense>
      </Container>
    </div>
  );
}
