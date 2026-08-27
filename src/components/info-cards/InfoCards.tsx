import Image from 'next/image';
import Button from '@components/ui/Button';
import Card from '@components/ui/Card';
import Container from '@components/ui/Container';
import Section from '@components/ui/Section';

export default function InfoCards({ cfsOpen = false }: { cfsOpen?: boolean }) {
  return (
    <Section>
      <Container>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <Card className="flex items-end justify-between gap-4 p-8">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-brand dark:text-brand-bright">
                Third edition
              </p>
              <h2 className="mt-2 text-2xl font-bold tracking-tight text-ink">
                Returning for our 3rd year
              </h2>
              <p className="mt-3 text-body">
                After Nairobi 2024 and Lagos 2025, GopherCon Africa returns to
                Nairobi — bigger, with a full workshop day and two conference
                days.
              </p>
              <div className="mt-5 flex flex-wrap gap-4">
                <Button href="/2025" variant="ghost">
                  GopherCon Africa 2025 →
                </Button>
                <Button href="/2024" variant="ghost">
                  2024 →
                </Button>
              </div>
            </div>
            <Image
              src="https://res.cloudinary.com/dlmqe0two/image/upload/v1744802566/mascot-kenya_pxfwhg.png"
              alt=""
              aria-hidden
              width={128}
              height={128}
              className="hidden shrink-0 object-contain sm:block"
            />
          </Card>

          <Card className="p-8">
            <p className="text-xs font-semibold uppercase tracking-wide text-muted">
              Call for Speakers
            </p>
            {cfsOpen ? (
              <>
                <h2 className="mt-2 text-2xl font-bold tracking-tight text-ink">
                  Call for Speakers is open
                </h2>
                <p className="mt-3 text-body">
                  Share your expertise and passion for Go with the GopherCon
                  Africa community — we&apos;re looking for talks across the
                  whole Go spectrum.
                </p>
                <div className="mt-5">
                  <Button href="/call-for-speakers" variant="secondary">
                    Submit your proposal
                  </Button>
                </div>
              </>
            ) : (
              <>
                <h2 className="mt-2 text-2xl font-bold tracking-tight text-ink">
                  Submissions are closed
                </h2>
                <p className="mt-3 text-body">
                  Thank you to everyone who submitted a talk. The first accepted
                  speakers are live — more announcements to come.
                </p>
                <div className="mt-5">
                  <Button href="/speakers" variant="secondary">
                    Meet the speakers
                  </Button>
                </div>
              </>
            )}
          </Card>
        </div>

        <figure className="mx-auto mt-16 max-w-3xl text-center">
          <blockquote className="text-xl leading-relaxed text-body sm:text-2xl">
            &ldquo;The talks were truly inspiring, with deep insights into
            efficiency and performance, the importance of testing, and the value
            of clean coding.&rdquo;
          </blockquote>
          <figcaption className="mt-4 text-sm font-semibold text-muted">
            Blessed Rafael · GopherCon Africa attendee
          </figcaption>
        </figure>
      </Container>
    </Section>
  );
}
