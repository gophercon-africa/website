'use client';

import React from 'react';
import Image from 'next/image';
import { Speaker } from '@/src/types/speaker';

interface SpeakerCardProps {
  speaker: Speaker;
  onClick: () => void;
}

const SpeakerCard: React.FC<SpeakerCardProps> = ({ speaker, onClick }) => {
  return (
    <div
      onClick={onClick}
      className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 cursor-pointer overflow-hidden group"
    >
      <div className="relative w-full h-48 overflow-hidden">
        <Image
          src={speaker.imageUrl}
          alt={speaker.name}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-300"
        />
      </div>
      <div className="p-4">
        <h3 className="text-lg font-bold text-gray-900 mb-1 group-hover:text-[#8B4513] transition-colors">
          {speaker.name}
        </h3>
        <p className="text-[#8B4513] font-semibold text-sm mb-1">{speaker.title}</p>
        <p className="text-gray-600 text-xs">{speaker.company}</p>
      </div>
    </div>
  );
};

export default SpeakerCard;
