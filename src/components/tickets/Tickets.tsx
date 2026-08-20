'use client';

import { useState } from 'react';
import Badge from '@components/ui/Badge';
import Button from '@components/ui/Button';
import Container from '@components/ui/Container';
import Section from '@components/ui/Section';
import SectionHeading from '@components/ui/SectionHeading';
import ToastWrapper from '@components/common/ToastWrapper';
import { TICKETS_URL } from '@/src/lib/links';

type TicketDay = 'workshop' | 'conference';

type TicketOption = {
  title: string;
  price: string;
  description: string;
  days: TicketDay[];
};

const ticketOptions: TicketOption[] = [
  {
    title: 'Student Conference Ticket',
    price: 'KSh 750',
    description: 'Both conference days, valid with a student ID.',
    days: ['conference'],
  },
  {
    title: 'Conference Days Standard',
    price: 'KSh 1,500',
    description: 'Both conference days.',
    days: ['conference'],
  },
  {
    title: 'Student Workshop Ticket',
    price: 'KSh 2,000',
    description: 'The workshop day, valid with a student ID.',
    days: ['workshop'],
  },
  {
    title: 'Workshop Ticket',
    price: 'KSh 2,500',
    description: "Bill Kennedy's full workshop day.",
    days: ['workshop'],
  },
  {
    title: 'Student Workshop + Conference',
    price: 'KSh 2,500',
    description: 'All three days, valid with a student ID.',
    days: ['workshop', 'conference'],
  },
  {
    title: 'Workshop + Conference Days',
    price: 'KSh 3,500',
    description: 'All three days.',
    days: ['workshop', 'conference'],
  },
];

const DAY_FILTERS = [
  { key: 'all', label: 'All days', includes: 'all' },
  { key: 'thu', label: 'Thu 15 · Workshop', includes: 'workshop' },
  { key: 'fri-sat', label: 'Fri–Sat · Conference', includes: 'conference' },
] as const;

export default function Tickets() {
  const [activeKey, setActiveKey] =
    useState<(typeof DAY_FILTERS)[number]['key']>('all');
  const active = DAY_FILTERS.find((f) => f.key === activeKey) ?? DAY_FILTERS[0];
  const filtered =
    active.includes === 'all'
      ? ticketOptions
      : ticketOptions.filter((t) =>
          t.days.includes(active.includes as TicketDay)
        );

  return (
    <Section id="tickets" tone="sunken">
      <Container>
        <SectionHeading
          title="Tickets"
          description="Workshop: Thursday, October 15. Conference: Friday and Saturday, October 16–17."
        />

        <div className="mx-auto mt-10 max-w-3xl">
          <div className="mb-4 flex justify-center">
            <div
              role="tablist"
              aria-label="Filter tickets by day"
              className="inline-flex overflow-hidden rounded-control border border-line divide-x divide-line"
            >
              {DAY_FILTERS.map((filter) => (
                <button
                  key={filter.key}
                  role="tab"
                  aria-selected={activeKey === filter.key}
                  onClick={() => setActiveKey(filter.key)}
                  className={`px-4 py-2 text-sm font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand/40 ${
                    activeKey === filter.key
                      ? 'bg-brand text-white'
                      : 'bg-surface text-body hover:bg-surface-sunken'
                  }`}
                >
                  {filter.label}
                </button>
              ))}
            </div>
          </div>

          <div className="divide-y divide-line overflow-hidden rounded-surface border border-line bg-surface">
            {filtered.map((ticket) => (
              <div
                key={ticket.title}
                className="flex flex-col gap-3 p-6 sm:flex-row sm:items-center sm:justify-between"
              >
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="text-lg font-semibold text-ink">
                      {ticket.title}
                    </h3>
                    {ticket.days.includes('workshop') && (
                      <Badge tone="outline">Workshop</Badge>
                    )}
                    {ticket.days.includes('conference') && (
                      <Badge tone="outline">Conference</Badge>
                    )}
                  </div>
                  <p className="mt-1 text-sm text-muted">{ticket.description}</p>
                </div>
                <div className="flex shrink-0 items-center gap-4">
                  <span className="text-lg font-semibold tabular-nums text-ink">
                    {ticket.price}
                  </span>
                  <Button href={TICKETS_URL} external variant="secondary">
                    Buy
                  </Button>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-8 flex justify-center">
            <Button href={TICKETS_URL} external size="lg">
              Get Tickets
            </Button>
          </div>
        </div>

        <div className="mx-auto mt-16 max-w-2xl space-y-10 text-center">
          <div>
            <h3 className="text-xl font-semibold text-ink">Scholarships</h3>
            <p className="mt-2 text-body">
              We offer diversity scholarships to support members of
              underrepresented groups who may not otherwise be able to attend.
              The application deadline will be announced soon.
            </p>
            <div className="mt-4 flex justify-center">
              <ToastWrapper message="To be announced soon!">
                <Button variant="secondary">Apply for a scholarship</Button>
              </ToastWrapper>
            </div>
          </div>
          <div>
            <h3 className="text-xl font-semibold text-ink">Refund policy</h3>
            <p className="mt-2 text-body">
              Refunds are available for all requests made before the refund
              deadline (to be announced), minus a 10% fee covering ticketing and
              payment processing.
            </p>
          </div>
        </div>
      </Container>
    </Section>
  );
}
