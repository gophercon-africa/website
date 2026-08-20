import Image from 'next/image';
import Button from '@components/ui/Button';
import Container from '@components/ui/Container';
import Section from '@components/ui/Section';
import SectionHeading from '@components/ui/SectionHeading';
import { CONTACT_EMAIL, SPONSORSHIP_PROSPECTUS_URL } from '@/src/lib/links';

const TIERS = [
  {
    label: 'Platinum Partner',
    sponsors: [
      {
        name: 'Google',
        href: 'https://www.google.com',
        logo: 'https://res.cloudinary.com/dlmqe0two/image/upload/v1744802584/google_rcjqn1.png',
        height: 'h-16',
      },
    ],
  },
  {
    label: 'Community Partners',
    sponsors: [
      {
        name: 'Tailscale',
        href: 'https://tailscale.com',
        logo: '/sponsors/tailscale-logo.svg',
        height: 'h-12',
      },
      {
        name: 'Moniepoint',
        href: 'https://moniepoint.com',
        logo: 'https://res.cloudinary.com/dlmqe0two/image/upload/v1744802584/moniepoint_tgy3ii.jpg',
        height: 'h-12',
      },
    ],
  },
];

export default function Sponsors() {
  return (
    <Section id="sponsors">
      <Container>
        <SectionHeading
          overline="Sponsors"
          title="Our Partners"
          description="Thank you to the organizations supporting GopherCon Africa."
        />

        <div className="mt-12 space-y-12">
          {TIERS.map(({ label, sponsors }) => (
            <div key={label} className="text-center">
              <p className="text-xs font-semibold uppercase tracking-wide text-muted">
                {label}
              </p>
              <div className="mt-6 flex flex-wrap items-stretch justify-center gap-6">
                {sponsors.map(({ name, href, logo, height }) => (
                  <a
                    key={name}
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={name}
                    // Tiles stay white in both themes — sponsor logos are drawn
                    // for light backgrounds and would vanish on a dark surface.
                    className="flex min-w-56 items-center justify-center rounded-surface border border-line bg-white p-8 shadow-sm transition hover:shadow-md sm:min-w-64 sm:p-10"
                  >
                    <Image
                      src={logo}
                      alt={name}
                      width={280}
                      height={96}
                      className={`w-auto object-contain ${height}`}
                    />
                  </a>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="mx-auto mt-20 max-w-2xl border-t border-line pt-12 text-center">
          <h3 className="text-2xl font-bold tracking-tight text-ink">
            Become a partner
          </h3>
          <p className="mt-3 text-body">
            Showcase your brand to hundreds of Go developers from across the
            continent.
          </p>
          <div className="mt-6 flex flex-col justify-center gap-4 sm:flex-row">
            <Button href={SPONSORSHIP_PROSPECTUS_URL} external variant="secondary">
              Download the prospectus
            </Button>
            <Button href={`mailto:${CONTACT_EMAIL}`} variant="ghost">
              {CONTACT_EMAIL}
            </Button>
          </div>
        </div>
      </Container>
    </Section>
  );
}
