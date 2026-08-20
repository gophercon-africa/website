import Image from 'next/image';
import Button from '@components/ui/Button';
import Container from '@components/ui/Container';
import { TICKETS_URL } from '@/src/lib/links';
import { CITY, EVENT_DATES, VENUE } from '@/src/lib/event';

export default function Hero({ cfsOpen = false }: { cfsOpen?: boolean }) {
  return (
    <div className="border-b border-line bg-linear-to-b from-earth-deep to-earth">
      <Container className="pt-16 pb-12 sm:pt-24 sm:pb-20">
        <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wide text-white/70">
              {EVENT_DATES} · {CITY}
            </p>
            <h1 className="mt-4 text-5xl font-bold tracking-tight text-white sm:text-6xl">
              GopherCon
              <span className="block">Africa 2026</span>
            </h1>
            <p className="mt-6 max-w-xl text-lg leading-relaxed text-white/85 sm:text-xl">
              Africa&apos;s Go conference — three days of talks, workshops, and
              community at {VENUE}.
            </p>
            <div className="mt-8 flex flex-col gap-4 sm:flex-row">
              <Button href={TICKETS_URL} external size="lg">
                Get Tickets
              </Button>
              <Button href="/schedule" variant="secondary" size="lg">
                View Schedule
              </Button>
              {cfsOpen && (
                <Button href="/call-for-speakers" variant="ghost" size="lg">
                  Submit a talk
                </Button>
              )}
            </div>
          </div>
          <div className="relative mx-auto h-72 w-72 sm:h-96 sm:w-96">
            <Image
              src="https://res.cloudinary.com/dlmqe0two/image/upload/v1744802566/mascot-kenya_pxfwhg.png"
              alt="The GopherCon Africa gopher mascot"
              fill
              className="object-contain"
              priority
            />
          </div>
        </div>
      </Container>
    </div>
  );
}
