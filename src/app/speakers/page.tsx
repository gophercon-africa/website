'use client';

import { Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Container from '@components/ui/Container';
import SpeakerCard from '@components/speakers/SpeakerCard';
import SpeakerModal from '@components/speakers/SpeakerModal';
import { speakers2026 } from '@data/speakers-2026';
import { EVENT_DATES, CITY } from '@/src/lib/event';

function PageHeader() {
  return (
    <div className="mb-12 text-center">
      <p className="text-xs font-semibold uppercase tracking-wide text-brand">
        {EVENT_DATES} · {CITY}
      </p>
      <h1 className="mt-2 text-4xl sm:text-5xl font-bold tracking-tight text-ink">
        Speakers
      </h1>
      <p className="mx-auto mt-4 max-w-2xl text-lg text-muted">
        The first announced speakers for GopherCon Africa 2026 — more to come.
      </p>
    </div>
  );
}

function SpeakersContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const selectedSpeaker = speakers2026.find(
    (speaker) => speaker.slug === searchParams?.get('speaker'),
  ) ?? null;

  const openSpeaker = (slug: string) => {
    router.replace(`/speakers?speaker=${slug}`, { scroll: false });
  };

  const closeModal = () => {
    router.replace('/speakers', { scroll: false });
  };

  return (
    <>
      <div className="min-h-screen bg-surface-sunken py-16">
        <Container>
          <PageHeader />
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {speakers2026.map((speaker) => (
              <SpeakerCard
                key={speaker.slug}
                speaker={speaker}
                onClick={() => openSpeaker(speaker.slug)}
              />
            ))}
          </div>
        </Container>
      </div>
      <SpeakerModal
        speaker={selectedSpeaker}
        isOpen={selectedSpeaker !== null}
        onClose={closeModal}
      />
    </>
  );
}

export default function SpeakersPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-surface-sunken py-16">
          <Container>
            <PageHeader />
            <div
              className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3"
              aria-hidden
            >
              {Array.from({ length: 6 }, (_, i) => (
                <div
                  key={i}
                  className="h-56 rounded-surface border border-line bg-surface"
                />
              ))}
            </div>
          </Container>
        </div>
      }
    >
      <SpeakersContent />
    </Suspense>
  );
}
