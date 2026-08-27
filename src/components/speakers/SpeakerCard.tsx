import { Speaker } from '@/src/types/speaker';
import SpeakerAvatar from './SpeakerAvatar';

export default function SpeakerCard({
  speaker,
  onClick,
}: {
  speaker: Speaker;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className="group flex w-full flex-col items-center rounded-surface border border-line bg-surface p-6 text-center transition-colors hover:border-brand/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand/40"
    >
      <SpeakerAvatar name={speaker.name} imageUrl={speaker.imageUrl} size={96} />
      <h3 className="mt-4 text-lg font-semibold text-ink transition-colors group-hover:text-brand dark:group-hover:text-brand-bright">
        {speaker.name}
      </h3>
      {(speaker.title || speaker.company) && (
        <p className="mt-1 text-sm text-muted">
          {[speaker.title, speaker.company].filter(Boolean).join(' · ')}
        </p>
      )}
      {speaker.talkTitle && (
        <p className="mt-3 text-sm font-medium text-body line-clamp-2">
          {speaker.talkTitle}
        </p>
      )}
    </button>
  );
}
