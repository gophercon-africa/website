'use client';

import { createContext, useCallback, useContext, useState } from 'react';
import { speakers2026 } from '@data/speakers-2026';
import { slugify } from '@/src/lib/slug';
import { Speaker } from '@/src/types/speaker';
import SpeakerModal from '@components/speakers/SpeakerModal';

const OpenSpeakerContext = createContext<(name: string) => void>(() => {});

/** Lets schedule rows open a speaker's profile modal *in place* — closing it
 *  returns to the schedule instead of navigating to /speakers. */
export function useOpenSpeaker() {
  return useContext(OpenSpeakerContext);
}

export default function ScheduleSpeakerModalProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [active, setActive] = useState<Speaker | null>(null);

  const open = useCallback((name: string) => {
    const speaker = speakers2026.find((s) => s.slug === slugify(name)) ?? null;
    if (speaker) setActive(speaker);
  }, []);

  return (
    <OpenSpeakerContext.Provider value={open}>
      {children}
      <SpeakerModal
        speaker={active}
        isOpen={active !== null}
        onClose={() => setActive(null)}
      />
    </OpenSpeakerContext.Provider>
  );
}
