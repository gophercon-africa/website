'use client';

import { useState } from 'react';
import Image from 'next/image';
import { ArrowUpRight } from 'lucide-react';
import Modal from '@components/common/Modal';

export interface Sponsor {
  name: string;
  href: string;
  logo: string;
  height: string;
  tagline?: string;
  blurb?: string[];
  careersUrl?: string;
}

export interface SponsorTier {
  label: string;
  sponsors: Sponsor[];
}

const TILE =
  'flex min-w-56 items-center justify-center rounded-surface border border-line bg-white p-8 shadow-sm transition hover:shadow-md sm:min-w-64 sm:p-10';

function Logo({ sponsor }: { sponsor: Sponsor }) {
  return (
    <Image
      src={sponsor.logo}
      alt={sponsor.name}
      width={280}
      height={96}
      className={`w-auto object-contain ${sponsor.height}`}
    />
  );
}

/** Sponsor tiles. Sponsors with a blurb open an "about" modal on click (details
 *  live behind the logo, per team feedback); the rest link out to their site.
 *  Tiles stay white in both themes — the logos are drawn for light backgrounds. */
export default function SponsorShowcase({ tiers }: { tiers: SponsorTier[] }) {
  const [active, setActive] = useState<Sponsor | null>(null);

  return (
    <>
      <div className="mt-12 space-y-12">
        {tiers.map(({ label, sponsors }) => (
          <div key={label} className="text-center">
            <p className="text-xs font-semibold uppercase tracking-wide text-muted">
              {label}
            </p>
            <div className="mt-6 flex flex-wrap items-stretch justify-center gap-6">
              {sponsors.map((sponsor) =>
                sponsor.blurb && sponsor.blurb.length > 0 ? (
                  <button
                    key={sponsor.name}
                    type="button"
                    onClick={() => setActive(sponsor)}
                    aria-label={`About ${sponsor.name}`}
                    className={`${TILE} cursor-pointer hover:border-brand/40`}
                  >
                    <Logo sponsor={sponsor} />
                  </button>
                ) : (
                  <a
                    key={sponsor.name}
                    href={sponsor.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={sponsor.name}
                    className={TILE}
                  >
                    <Logo sponsor={sponsor} />
                  </a>
                )
              )}
            </div>
          </div>
        ))}
      </div>

      <Modal
        isOpen={active !== null}
        onClose={() => setActive(null)}
        title={active?.name ?? ''}
        size="lg"
      >
        {active && (
          <div className="space-y-4">
            {active.tagline && (
              <p className="text-base font-semibold text-ink">{active.tagline}</p>
            )}
            {active.blurb?.map((paragraph) => (
              <p
                key={paragraph.slice(0, 32)}
                className="text-sm leading-relaxed text-body"
              >
                {paragraph}
              </p>
            ))}
            <div className="flex flex-wrap gap-x-6 gap-y-2 pt-2">
              <a
                href={active.href}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-sm font-semibold text-brand transition-colors hover:text-brand-dark dark:text-brand-bright dark:hover:text-brand-light"
              >
                Visit {active.name}
                <ArrowUpRight className="h-4 w-4" aria-hidden />
              </a>
              {active.careersUrl && (
                <a
                  href={active.careersUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-sm font-semibold text-brand transition-colors hover:text-brand-dark dark:text-brand-bright dark:hover:text-brand-light"
                >
                  Careers at {active.name}
                  <ArrowUpRight className="h-4 w-4" aria-hidden />
                </a>
              )}
            </div>
          </div>
        )}
      </Modal>
    </>
  );
}
