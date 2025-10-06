'use client';

import { useState } from 'react';
import SpeakerCard from '@/src/components/speakers/SpeakerCard';
import SpeakerModal from '@/src/components/speakers/SpeakerModal';
import { speakers } from '@/src/data/speakers';
import { Speaker } from '@/src/types/speaker';

export default function SpeakersPage() {
  const [selectedSpeaker, setSelectedSpeaker] = useState<Speaker | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleSpeakerClick = (speaker: Speaker) => {
    setSelectedSpeaker(speaker);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setTimeout(() => setSelectedSpeaker(null), 300);
  };

  return (
    <>
      <div className="min-h-screen bg-gray-50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h1 className="text-5xl font-bold text-gray-900 mb-4">
              Our Speakers
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Meet the amazing speakers who will be sharing their knowledge and experience at GopherCon Africa
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {speakers.map((speaker) => (
              <SpeakerCard
                key={speaker.id}
                speaker={speaker}
                onClick={() => handleSpeakerClick(speaker)}
              />
            ))}
          </div>
        </div>
      </div>
      <SpeakerModal
        speaker={selectedSpeaker}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
      />
    </>
  );
}
