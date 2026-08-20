import type { ReactNode } from 'react';

const TONES = {
  default: 'bg-surface',
  sunken: 'bg-surface-sunken',
} as const;

/** Vertical page band. Alternate default/sunken tones instead of gradients. */
export default function Section({
  id,
  tone = 'default',
  className = '',
  children,
}: {
  id?: string;
  tone?: keyof typeof TONES;
  className?: string;
  children: ReactNode;
}) {
  return (
    <section id={id} className={`${TONES[tone]} py-16 sm:py-24 ${className}`}>
      {children}
    </section>
  );
}
