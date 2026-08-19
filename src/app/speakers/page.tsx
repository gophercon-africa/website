'use client';

import { Suspense, useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Container from '@components/ui/Container';
import SpeakerCard from '@components/speakers/SpeakerCard';
import SpeakerModal from '@components/speakers/SpeakerModal';
import { speakers2026 } from '@data/speakers-2026';
import { Speaker } from '@/src/types/speaker';
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
  const [selectedSpeaker, setSelectedSpeaker] = useState<Speaker | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const searchParams = useSearchParams();

  // Deep link: /speakers?speaker=<slug> opens that speaker's modal (the
  // schedule's speaker rows link here).
  useEffect(() => {
    const slug = searchParams?.get('speaker');
    if (!slug) return;
    const speaker = speakers2026.find((s) => s.slug === slug);
    if (speaker) {
      setSelectedSpeaker(speaker);
      setIsModalOpen(true);
    }
  }, [searchParams]);

  const openSpeaker = (speaker: Speaker) => {
    setSelectedSpeaker(speaker);
    setIsModalOpen(true);
    window.history.replaceState(null, '', `?speaker=${speaker.slug}`);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    window.history.replaceState(null, '', window.location.pathname);
    setTimeout(() => setSelectedSpeaker(null), 300);
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
                onClick={() => openSpeaker(speaker)}
              />
            ))}
          </div>
        </Container>
      </div>
      <SpeakerModal
        speaker={selectedSpeaker}
        isOpen={isModalOpen}
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
