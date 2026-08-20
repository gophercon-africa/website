'use client';

import { useState } from 'react';
import { ChevronDown } from 'lucide-react';

/** Expandable "about this sponsor" blurb shown under the partner logos. */
export default function SponsorBlurb({
  name,
  tagline,
  blurb,
  careersUrl,
}: {
  name: string;
  tagline?: string;
  blurb: string[];
  careersUrl?: string;
}) {
  const [open, setOpen] = useState(false);

  return (
    <div className="rounded-surface border border-line bg-surface text-left">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        className="flex w-full items-center justify-between gap-3 p-4 text-left sm:p-5"
      >
        <span className="min-w-0">
          <span className="block font-semibold text-ink">About {name}</span>
          {tagline && (
            <span className="mt-0.5 block text-sm text-muted">{tagline}</span>
          )}
        </span>
        <ChevronDown
          className={`h-5 w-5 shrink-0 text-muted transition-transform ${
            open ? 'rotate-180' : ''
          }`}
          aria-hidden
        />
      </button>
      {open && (
        <div className="space-y-3 px-4 pb-4 text-sm leading-relaxed text-body sm:px-5 sm:pb-5">
          {blurb.map((paragraph) => (
            <p key={paragraph.slice(0, 32)}>{paragraph}</p>
          ))}
          {careersUrl && (
            <a
              href={careersUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block font-semibold text-brand transition-colors hover:text-brand-dark dark:text-brand-bright dark:hover:text-brand-light"
            >
              Careers at {name} →
            </a>
          )}
        </div>
      )}
    </div>
  );
}
