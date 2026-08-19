import type { ReactNode } from 'react';

const TONES = {
  brand: 'bg-brand-tint text-brand-dark',
  neutral: 'bg-gray-100 text-muted',
  outline: 'border border-line bg-surface text-muted',
} as const;

/** Three tones only. If you need a fourth color, you need fewer badges. */
export default function Badge({
  tone = 'neutral',
  className = '',
  children,
}: {
  tone?: keyof typeof TONES;
  className?: string;
  children: ReactNode;
}) {
  return (
    <span
      className={`inline-flex items-center rounded-control px-2 py-0.5 text-xs font-semibold ${TONES[tone]} ${className}`}
    >
      {children}
    </span>
  );
}
