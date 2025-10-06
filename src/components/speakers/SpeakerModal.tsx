'use client';

import React from 'react';
import Image from 'next/image';
import { Speaker } from '@/src/types/speaker';
import { FaTwitter, FaLinkedin, FaGithub, FaGlobe } from 'react-icons/fa';
import Modal from '@/src/components/common/Modal';

interface SpeakerModalProps {
  speaker: Speaker | null;
  isOpen: boolean;
  onClose: () => void;
}

const SpeakerModal: React.FC<SpeakerModalProps> = ({ speaker, isOpen, onClose }) => {
  if (!speaker) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={speaker.name}
      size="xl"
    >
      <div className="flex flex-col md:flex-row gap-6">
        <div className="flex-shrink-0">
          <Image
            src={speaker.imageUrl}
            alt={speaker.name}
            width={200}
            height={200}
            className="rounded-lg object-cover w-48 h-48"
          />
        </div>

        <div className="flex-1">
          <p className="text-lg text-[#006B3F] font-semibold mb-1">{speaker.title}</p>
          <p className="text-md text-gray-600 mb-4">{speaker.company}</p>

          <div className="flex gap-3 mb-6">
            {speaker.twitter && (
              <a
                href={speaker.twitter}
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-600 hover:text-[#006B3F] transition-colors"
              >
                <FaTwitter className="h-5 w-5" />
              </a>
            )}
            {speaker.linkedin && (
              <a
                href={speaker.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-600 hover:text-[#006B3F] transition-colors"
              >
                <FaLinkedin className="h-5 w-5" />
              </a>
            )}
            {speaker.github && (
              <a
                href={speaker.github}
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-600 hover:text-[#006B3F] transition-colors"
              >
                <FaGithub className="h-5 w-5" />
              </a>
            )}
            {speaker.website && (
              <a
                href={speaker.website}
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-600 hover:text-[#006B3F] transition-colors"
              >
                <FaGlobe className="h-5 w-5" />
              </a>
            )}
          </div>

          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Bio</h3>
              <p className="text-gray-700 leading-relaxed">{speaker.bio}</p>
            </div>

            {speaker.talkTitle && (
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Talk</h3>
                <p className="text-[#006B3F] font-semibold mb-1">{speaker.talkTitle}</p>
                {speaker.talkDescription && (
                  <p className="text-gray-700 leading-relaxed">{speaker.talkDescription}</p>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default SpeakerModal;
