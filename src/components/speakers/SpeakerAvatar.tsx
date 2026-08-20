import Image from 'next/image';

function initials(name: string): string {
  const parts = name.trim().split(/\s+/);
  const first = parts[0]?.[0] ?? '';
  const last = parts.length > 1 ? parts[parts.length - 1][0] : '';
  return (first + last).toUpperCase();
}

/** Speaker photo with a deterministic initials placeholder until real
 *  headshots land. Defaults to a circle (the one sanctioned rounded-full use);
 *  the schedule opts into `rounded="control"` for GopherCon-US squared thumbs. */
export default function SpeakerAvatar({
  name,
  imageUrl,
  size = 40,
  rounded = 'full',
  className = '',
}: {
  name: string;
  imageUrl?: string;
  size?: number;
  rounded?: 'full' | 'control';
  className?: string;
}) {
  const radius = rounded === 'control' ? 'rounded-control' : 'rounded-full';
  if (imageUrl) {
    return (
      <Image
        src={imageUrl}
        alt={name}
        width={size}
        height={size}
        className={`${radius} object-cover ${className}`}
        style={{ width: size, height: size }}
      />
    );
  }
  return (
    <span
      aria-hidden
      className={`inline-flex shrink-0 select-none items-center justify-center ${radius} bg-brand-tint font-semibold text-brand-dark dark:text-brand-bright ${className}`}
      style={{ width: size, height: size, fontSize: Math.round(size * 0.38) }}
    >
      {initials(name)}
    </span>
  );
}
