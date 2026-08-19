import { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight, Calendar, MapPin } from 'lucide-react';

export const metadata: Metadata = {
  title: 'GopherCon Africa 2024 | Nairobi, Kenya',
  description:
    'A look back at GopherCon Africa 2024 at iHub in Nairobi, Kenya — the first edition, with two days of Go workshops, talks, and community.',
};

export default function Year2024Page() {
  return (
    <div className="min-h-screen bg-surface-sunken py-16">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <p className="text-xs font-semibold uppercase tracking-wide text-brand mb-3">
            Looking back
          </p>
          <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-ink mb-4">
            GopherCon Africa 2024
          </h1>
          <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-muted">
            <span className="inline-flex items-center gap-2">
              <MapPin className="w-5 h-5 text-brand" aria-hidden />
              iHub, Nairobi, Kenya
            </span>
            <span className="inline-flex items-center gap-2">
              <Calendar className="w-5 h-5 text-brand" aria-hidden />
              October 18–19, 2024
            </span>
          </div>
        </div>

        <div className="max-w-3xl mx-auto space-y-10">
          <section>
            <h2 className="text-2xl font-bold text-ink mb-3">The event</h2>
            <div className="space-y-4 text-body leading-relaxed">
              <p>
                GopherCon Africa began in Nairobi, Kenya. Hosted by the Nairobi
                Gophers at iHub on 18–19 October 2024, the first edition packed
                keynotes, hands-on workshops, talks, and community sessions
                into two days — and set the tone for everything that followed.
              </p>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-ink mb-3">
              Day one — Friday, October 18
            </h2>
            <div className="space-y-4 text-body leading-relaxed">
              <p>
                Adesina Hassan opened the conference with the keynote{' '}
                <em>
                  Empowering the Future with Go: Africa&apos;s Role in the Go
                  Community
                </em>
                . The morning was workshop territory: Chris Otta led{' '}
                <em>Go for Infrastructure Test Automation</em>, and Anthony
                Alaribe followed with{' '}
                <em>
                  Advanced Monitoring and Observability with OpenTelemetry and
                  APItoolkit
                </em>
                .
              </p>
              <p>
                The afternoon talks covered community and craft alike: Mudasiru
                Rasheed on <em>Building a Local Go Community as a Student</em>,
                Aryan Mehrotra on{' '}
                <em>
                  GoFr: High-Performance Go Framework for Scalable Web
                  Applications
                </em>
                , Joseph Augustine Asuquo on <em>Clean Code in Go</em>, and
                Amarachi Iheanacho on{' '}
                <em>Event-Driven Architecture with Go and Kafka</em>, before the
                day wound down with closing remarks and networking.
              </p>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-ink mb-3">
              Day two — Saturday, October 19
            </h2>
            <div className="space-y-4 text-body leading-relaxed">
              <p>
                Anthony Alaribe returned to open day two with a keynote,
                followed by Ufia Irene on{' '}
                <em>
                  Effective Testing Strategies for Large Data Inserts into
                  PostgreSQL Tables
                </em>
                , Ehi Enabs on <em>SDK Secrets: Unlocking API Magic</em>, Sammy
                Oina on{' '}
                <em>Unveiling the Power of Interfaces: Go&apos;s Secret Weapon</em>,
                and Nwokoye Chigozie on{' '}
                <em>Understanding Entropy in Design Systems</em>, capped by a
                community roundtable before lunch.
              </p>
              <p>
                The afternoon brought Kathurima on{' '}
                <em>Realizing Hexagonal Architecture in Go</em>, Kennedy Karoko
                on{' '}
                <em>Mastering Intra-Service Communication in Go with gRPC</em>,
                Rodney Osodo on{' '}
                <em>
                  Engineering Reliable gRPC APIs: The World of Instrumentation
                </em>
                , and Kalio Princewill on{' '}
                <em>Testing in Go: Unlocking Confidence and Efficiency</em>. The
                conference closed with a live panel-discussion podcast on{' '}
                <em>The State of Golang in Africa</em>, sponsor appreciation,
                and farewells.
              </p>
            </div>
          </section>

          <section className="border-t border-line pt-8">
            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                href="/2025"
                className="inline-flex items-center justify-center gap-2 rounded-control border border-brand px-5 py-2.5 text-sm font-semibold text-brand hover:bg-brand/5 transition-colors"
              >
                GopherCon Africa 2025 in Lagos
                <ArrowRight className="w-4 h-4" aria-hidden />
              </Link>
              <Link
                href="/schedule"
                className="inline-flex items-center justify-center gap-2 rounded-control bg-brand px-5 py-2.5 text-sm font-semibold text-white hover:bg-brand-dark transition-colors"
              >
                See the 2026 schedule
                <ArrowRight className="w-4 h-4" aria-hidden />
              </Link>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
