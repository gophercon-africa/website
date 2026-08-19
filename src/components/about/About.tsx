import YouTubePlayer from 'react-youtube';
import Button from '@components/ui/Button';
import Container from '@components/ui/Container';
import Section from '@components/ui/Section';
import SectionHeading from '@components/ui/SectionHeading';

const FEATURES = [
  {
    title: 'Expert-led sessions',
    body: 'Keynotes, technical talks, and hands-on workshops from Go practitioners across Africa and beyond.',
  },
  {
    title: 'Networking',
    body: 'Hundreds of Go developers in one place — meet maintainers, hiring teams, and your next collaborators.',
  },
  {
    title: 'Social events',
    body: 'Lightning talks, socials, and cultural experiences unique to the host city.',
  },
];

export default function About() {
  return (
    <Section id="about" tone="sunken">
      <Container>
        <SectionHeading
          overline="About GopherCon Africa"
          title="Africa's Premier Go Conference"
          description="The third annual GopherCon Africa: three days of talks, workshops, networking, and socials, with the most up-to-date Go programming information and training."
        />

        <div className="mt-10 grid grid-cols-1 gap-10 md:grid-cols-3">
          {FEATURES.map(({ title, body }) => (
            <div key={title}>
              <h3 className="text-lg font-semibold text-ink">{title}</h3>
              <p className="mt-2 text-body">{body}</p>
            </div>
          ))}
        </div>

        <div className="mx-auto mt-14 max-w-3xl">
          <div className="overflow-hidden rounded-surface border border-line bg-surface">
            <div className="relative aspect-video">
              <YouTubePlayer
                videoId="zwkomnt--Lg"
                opts={{
                  height: '100%',
                  width: '100%',
                  playerVars: { modestbranding: 1, rel: 0, playsinline: 1 },
                }}
                className="absolute inset-0 h-full w-full"
                iframeClassName="w-full h-full"
              />
            </div>
            <div className="flex flex-wrap items-center justify-between gap-3 p-6">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-muted">
                  From GopherCon Africa 2025
                </p>
                <h3 className="mt-1 text-lg font-semibold text-ink">
                  Querying the Wire: Building a Postgres Protocol Sniffer in Go
                </h3>
                <p className="mt-1 text-sm text-muted">Chukwuemeka Chukwurah</p>
              </div>
              <Button
                href="https://www.youtube.com/playlist?list=PLQGlpekanU1NJyfMpWOM2NgMKtibmi86V"
                external
                variant="ghost"
              >
                Watch all talks →
              </Button>
            </div>
          </div>
        </div>
      </Container>
    </Section>
  );
}
