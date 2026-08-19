import type { ReactNode } from 'react';

const SIZES = {
  default: 'max-w-6xl',
  narrow: 'max-w-3xl',
} as const;

/** The one content width for the marketing site. `narrow` is for prose pages. */
export default function Container({
  size = 'default',
  className = '',
  children,
}: {
  size?: keyof typeof SIZES;
  className?: string;
  children: ReactNode;
}) {
  return (
    <div className={`mx-auto ${SIZES[size]} px-4 sm:px-6 lg:px-8 ${className}`}>
      {children}
    </div>
  );
}
