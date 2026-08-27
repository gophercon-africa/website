import { Speaker } from '@/src/types/speaker';
import { FaTwitter, FaLinkedin, FaGithub, FaGlobe } from 'react-icons/fa';
import Modal from '@components/common/Modal';
import SpeakerAvatar from './SpeakerAvatar';

const SOCIALS = [
  { key: 'twitter', Icon: FaTwitter, label: 'Twitter' },
  { key: 'linkedin', Icon: FaLinkedin, label: 'LinkedIn' },
  { key: 'github', Icon: FaGithub, label: 'GitHub' },
  { key: 'website', Icon: FaGlobe, label: 'Website' },
] as const;

export default function SpeakerModal({
  speaker,
  isOpen,
  onClose,
}: {
  speaker: Speaker | null;
  isOpen: boolean;
  onClose: () => void;
}) {
  if (!speaker) return null;

  const socials = SOCIALS.filter(({ key }) => speaker[key]);

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={speaker.name} size="xl">
      <div className="flex flex-col gap-6 md:flex-row">
        <div className="flex shrink-0 flex-col items-center gap-4 md:items-start">
          <SpeakerAvatar
            name={speaker.name}
            imageUrl={speaker.imageUrl}
            size={144}
          />
          {socials.length > 0 && (
            <div className="flex gap-3">
              {socials.map(({ key, Icon, label }) => (
                <a
                  key={key}
                  href={speaker[key]}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`${speaker.name} on ${label}`}
                  className="text-muted transition-colors hover:text-brand dark:hover:text-brand-bright"
                >
                  <Icon className="h-5 w-5" aria-hidden />
                </a>
              ))}
            </div>
          )}
        </div>

        <div className="min-w-0 flex-1">
          {(speaker.title || speaker.company) && (
            <p className="text-sm text-muted">
              {[speaker.title, speaker.company].filter(Boolean).join(' · ')}
            </p>
          )}

          <div className="mt-4 space-y-6">
            {speaker.talkTitle && (
              <div>
                <h3 className="text-xs font-semibold uppercase tracking-wide text-muted">
                  Talk
                </h3>
                <p className="mt-1 text-lg font-semibold text-ink">
                  {speaker.talkTitle}
                </p>
                {speaker.talkDescription && (
                  <p className="mt-2 whitespace-pre-line text-sm leading-relaxed text-body">
                    {speaker.talkDescription}
                  </p>
                )}
              </div>
            )}

            {speaker.bio && (
              <div>
                <h3 className="text-xs font-semibold uppercase tracking-wide text-muted">
                  About
                </h3>
                <p className="mt-2 whitespace-pre-line text-sm leading-relaxed text-body">
                  {speaker.bio}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </Modal>
  );
}
