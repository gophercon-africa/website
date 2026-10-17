import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowUpRight, ChevronRight, Wifi } from 'lucide-react';
import { LINK_GROUPS, WIFI, type LinkItem } from '@/src/data/links';
import CopyField from '@components/links/CopyField';

export const metadata: Metadata = {
  title: 'Links | GopherCon Africa 2026',
  description:
    'Schedule, Wi-Fi, feedback form, event photos and community links for GopherCon Africa 2026 in Nairobi.',
};

function LinkRow({ item }: { item: LinkItem }) {
  const external = item.href.startsWith('http');
  const className =
    'flex min-h-14 items-center gap-3 rounded-surface border border-line bg-surface px-4 py-3 no-underline transition-colors hover:border-brand/40 active:bg-brand-tint';
  const body = (
    <>
      <span className="min-w-0 flex-1">
        <span className="block font-semibold leading-snug text-ink">{item.label}</span>
        {item.note && (
          <span className="mt-0.5 block text-sm leading-snug text-muted">{item.note}</span>
        )}
      </span>
      {external ? (
        <ArrowUpRight className="h-5 w-5 shrink-0 text-faint" aria-hidden />
      ) : (
        <ChevronRight className="h-5 w-5 shrink-0 text-faint" aria-hidden />
      )}
    </>
  );

  return external ? (
    <a href={item.href} target="_blank" rel="noopener noreferrer" className={className}>
      {body}
    </a>
  ) : (
    <Link href={item.href} className={className}>
      {body}
    </Link>
  );
}

export default function LinksPage() {
  return (
    <div className="min-h-screen bg-surface-sunken py-10 sm:py-16">
      <div className="mx-auto max-w-md px-4 sm:max-w-lg sm:px-6">
        <header className="text-center">
          <p className="text-xs font-semibold uppercase tracking-wide text-brand dark:text-brand-bright">
            GopherCon Africa 2026
          </p>
          <h1 className="mt-2 text-3xl font-bold tracking-tight text-ink sm:text-4xl">
            Links
          </h1>
          <p className="mt-3 text-muted">
            Everything from the QR codes around the venue, in one place.
          </p>
        </header>

        <section className="mt-8" aria-labelledby="wifi-heading">
          <div className="rounded-surface border border-brand/30 bg-surface p-4 sm:p-5">
            <h2
              id="wifi-heading"
              className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-brand dark:text-brand-bright"
            >
              <Wifi className="h-4 w-4" aria-hidden />
              Venue Wi-Fi
            </h2>
            <div className="mt-4 space-y-4">
              <CopyField label="Network" value={WIFI.ssid} />
              <CopyField label="Password" value={WIFI.password} />
            </div>
          </div>
        </section>

        {LINK_GROUPS.map((group) => (
          <section key={group.id} className="mt-8" aria-labelledby={`${group.id}-heading`}>
            <h2
              id={`${group.id}-heading`}
              className="px-1 text-xs font-semibold uppercase tracking-wide text-muted"
            >
              {group.title}
            </h2>
            {group.blurb && <p className="mt-1 px-1 text-sm text-faint">{group.blurb}</p>}
            <ul className="mt-3 space-y-2">
              {group.items.map((item) => (
                <li key={item.href}>
                  <LinkRow item={item} />
                </li>
              ))}
            </ul>
          </section>
        ))}
      </div>
    </div>
  );
}
