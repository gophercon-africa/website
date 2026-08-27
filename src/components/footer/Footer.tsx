import Image from 'next/image';
import Link from 'next/link';
import Container from '@components/ui/Container';
import {
  CODE_OF_CONDUCT_URL,
  CONTACT_EMAIL,
  SOCIAL_LINKS,
  SPONSORSHIP_PROSPECTUS_URL,
  TICKETS_URL,
} from '@/src/lib/links';

const SOCIALS = [
  {
    href: SOCIAL_LINKS.x,
    label: 'X (Twitter)',
    icon: 'https://res.cloudinary.com/dlmqe0two/image/upload/v1744803296/X_logo_2023.svg_s6irtp.png',
    // Black glyph — invert to white on the dark footer. LinkedIn/Meetup carry
    // their own brand colors and read fine, so they aren't inverted.
    invertInDark: true,
  },
  {
    href: SOCIAL_LINKS.meetup,
    label: 'Meetup',
    icon: 'https://res.cloudinary.com/dlmqe0two/image/upload/v1744802510/meetup-logo_bob5n9.png',
  },
  {
    href: SOCIAL_LINKS.linkedin,
    label: 'LinkedIn',
    icon: 'https://res.cloudinary.com/dlmqe0two/image/upload/v1744803296/LinkedIn_icon.svg_ljtvmr.png',
  },
] as const;

const COLUMNS = [
  {
    heading: 'Event',
    links: [
      { href: '/schedule', label: 'Schedule' },
      { href: '/speakers', label: 'Speakers' },
      { href: '/workshops', label: 'Workshops' },
      { href: TICKETS_URL, label: 'Tickets' },
    ],
  },
  {
    heading: 'Past editions',
    links: [
      { href: '/2025', label: 'GopherCon Africa 2025' },
      { href: '/2024', label: 'GopherCon Africa 2024' },
    ],
  },
  {
    heading: 'Contact',
    links: [
      { href: `mailto:${CONTACT_EMAIL}`, label: CONTACT_EMAIL },
      { href: CODE_OF_CONDUCT_URL, label: 'Code of Conduct' },
      { href: SPONSORSHIP_PROSPECTUS_URL, label: 'Sponsorship prospectus' },
    ],
  },
];

export default function Footer() {
  return (
    <footer className="bg-surface border-t border-line py-12 mt-12">
      <Container>
        <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <Image
              src="https://res.cloudinary.com/dlmqe0two/image/upload/v1744891071/GopherCon_Africa_25_vskz7n_obmh5q.png"
              alt="GopherCon Africa"
              // White silhouette in dark (navy wordmark is illegible on the dark
              // footer) — interim until a reversed/light logo asset exists.
              className="h-10 w-auto dark:brightness-0 dark:invert"
              width={160}
              height={160}
            />
            <p className="mt-4 text-sm text-muted">
              Africa&apos;s Go conference — talks, workshops, and community in
              Nairobi.
            </p>
            <div className="mt-4 flex gap-4">
              {SOCIALS.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={social.label}
                  className="opacity-70 transition-opacity hover:opacity-100"
                >
                  <Image
                    src={social.icon}
                    alt={social.label}
                    className={`h-6 w-6 object-contain ${
                      'invertInDark' in social && social.invertInDark
                        ? 'dark:invert'
                        : ''
                    }`}
                    width={24}
                    height={24}
                  />
                </a>
              ))}
            </div>
          </div>
          {COLUMNS.map(({ heading, links }) => (
            <div key={heading}>
              <h3 className="text-xs font-semibold uppercase tracking-wide text-ink">
                {heading}
              </h3>
              <ul className="mt-4 space-y-3">
                {links.map(({ href, label }) => (
                  <li key={label}>
                    {href.startsWith('/') ? (
                      <Link
                        href={href}
                        className="text-sm text-muted transition-colors hover:text-brand dark:hover:text-brand-bright"
                      >
                        {label}
                      </Link>
                    ) : (
                      <a
                        href={href}
                        {...(href.startsWith('http')
                          ? { target: '_blank', rel: 'noopener noreferrer' }
                          : {})}
                        className="text-sm text-muted transition-colors hover:text-brand dark:hover:text-brand-bright"
                      >
                        {label}
                      </a>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="mt-10 border-t border-line pt-8 text-center text-sm text-muted">
          <p>&copy; 2026 GopherCon Africa. All rights reserved.</p>
        </div>
      </Container>
    </footer>
  );
}
