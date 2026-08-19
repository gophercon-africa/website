import type { ReactNode } from 'react';

/** Surface-level card. Cards never nest inside other cards. */
export default function Card({
  interactive = false,
  className = '',
  children,
}: {
  interactive?: boolean;
  className?: string;
  children: ReactNode;
}) {
  return (
    <div
      className={`rounded-surface border border-line bg-surface p-6 ${
        interactive ? 'transition-colors hover:border-brand/40' : ''
      } ${className}`}
    >
      {children}
    </div>
  );
}
