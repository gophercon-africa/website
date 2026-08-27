import Button from '@components/ui/Button';
import Container from '@components/ui/Container';
import Section from '@components/ui/Section';
import SectionHeading from '@components/ui/SectionHeading';
import SponsorShowcase, { SponsorTier } from './SponsorShowcase';
import { CONTACT_EMAIL, SPONSORSHIP_PROSPECTUS_URL } from '@/src/lib/links';

const TIERS: SponsorTier[] = [
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
        // DRAFT copy written by us from public info — NOT Tailscale-approved.
        // Replace with official sponsor copy before merge.
        tagline: 'Zero-config networking, built on WireGuard',
        blurb: [
          'Tailscale builds a secure, encrypted network between your servers, laptops, and cloud instances — across firewalls and NAT, with no central chokepoint.',
          'Built on the open-source WireGuard protocol, devices connect directly and safely, so teams can replace legacy VPNs and reach internal services with zero configuration.',
        ],
        careersUrl: 'https://tailscale.com/careers',
      },
      {
        name: 'Moniepoint',
        href: 'https://moniepoint.com',
        logo: 'https://res.cloudinary.com/dlmqe0two/image/upload/v1744802584/moniepoint_tgy3ii.jpg',
        height: 'h-12',
        tagline: "Africa's all-in-one financial platform",
        blurb: [
          "Over the last decade, we've built financial infrastructure that's powering the dreams of more than 20 million businesses and individuals by giving them access to seamless payments, banking, credit, and business management solutions.",
          "As Nigeria's largest merchant acquirer, we power most of the country's point-of-sale (POS) transactions. Through our subsidiaries, Moniepoint processes more than $250 billion in digital payment transaction value annually.",
          "As we work towards creating financial happiness for every African, everywhere, we're looking for engineers who want to solve complex problems at massive scale.",
        ],
        careersUrl: 'https://moniepoint.com/careers',
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

        <SponsorShowcase tiers={TIERS} />

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
