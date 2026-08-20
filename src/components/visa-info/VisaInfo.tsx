import { Check } from 'lucide-react';
import Button from '@components/ui/Button';
import Container from '@components/ui/Container';
import Section from '@components/ui/Section';
import SectionHeading from '@components/ui/SectionHeading';
import { CONTACT_EMAIL } from '@/src/lib/links';

const TIPS = [
  'Check if your country is exempt from the eTA',
  'Prepare your passport and travel documents',
  'Apply at least 72 hours before travel',
  'Keep digital copies of your eTA approval',
];

export default function VisaInfo() {
  return (
    <Section id="visa-info" tone="sunken">
      <Container size="narrow">
        <SectionHeading
          title="Visa Information"
          description="Essential information for international attendees traveling to Kenya."
          align="left"
        />

        <div className="mt-8 space-y-8">
          <p className="text-body">
            Depending on your nationality, you&apos;ll need an Electronic Travel
            Authorization (eTA) or visa to enter Kenya. The official government
            portal covers requirements, application steps, and the list of
            exempt countries.
          </p>

          <div className="flex flex-col gap-4 sm:flex-row">
            <Button
              href="https://etakenya.go.ke/general-information"
              external
              variant="secondary"
            >
              eTA requirements
            </Button>
            <Button href="https://etakenya.go.ke/" external variant="secondary">
              Apply for an eTA
            </Button>
          </div>

          <div className="border-l-2 border-brand pl-4">
            <p className="text-sm leading-relaxed text-body">
              Start your application well in advance of the conference —
              processing times vary and some countries need additional
              documentation.
            </p>
          </div>

          <ul className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            {TIPS.map((tip) => (
              <li key={tip} className="flex items-start gap-2 text-sm text-body">
                <Check className="mt-0.5 h-4 w-4 shrink-0 text-brand" aria-hidden />
                {tip}
              </li>
            ))}
          </ul>

          <p className="text-sm text-muted">
            Questions about the process?{' '}
            <a
              href={`mailto:${CONTACT_EMAIL}`}
              className="font-semibold text-brand transition-colors hover:text-brand-dark dark:text-brand-bright dark:hover:text-brand-light"
            >
              {CONTACT_EMAIL}
            </a>
          </p>
        </div>
      </Container>
    </Section>
  );
}
