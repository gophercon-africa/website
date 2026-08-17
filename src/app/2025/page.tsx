import { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight, Calendar, MapPin } from 'lucide-react';

export const metadata: Metadata = {
  title: 'GopherCon Africa 2025 | Lagos, Nigeria',
  description:
    'A look back at GopherCon Africa 2025 in Lagos, Nigeria — two days of Go workshops, talks, and community.',
};

export default function Year2025Page() {
  return (
    <div className="min-h-screen bg-gray-50 py-16">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <p className="text-xs tracking-[0.28em] uppercase text-brand font-semibold mb-3">
            Looking back
          </p>
          <h1 className="text-5xl font-bold text-gray-900 mb-4">
            GopherCon Africa 2025
          </h1>
          <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-gray-600">
            <span className="inline-flex items-center gap-2">
              <MapPin className="w-5 h-5 text-brand" aria-hidden />
              Lagos, Nigeria
            </span>
            <span className="inline-flex items-center gap-2">
              <Calendar className="w-5 h-5 text-brand" aria-hidden />
              November 2025
            </span>
          </div>
        </div>

        <div className="max-w-3xl mx-auto space-y-10">
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-3">The event</h2>
            <div className="space-y-4 text-gray-700 leading-relaxed">
              <p>
                In November 2025, GopherCon Africa brought the Go community to
                Lagos, Nigeria — two packed days of hands-on workshops,
                conference talks, and community sessions that drew developers,
                engineers, and students from across the continent and beyond.
              </p>
              <p>
                Each day opened with a deep-dive workshop before rolling into a
                full afternoon of talks, round-table discussions, and plenty of
                hallway-track networking over breakfast and lunch breaks.
              </p>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-3">Day one</h2>
            <div className="space-y-4 text-gray-700 leading-relaxed">
              <p>
                The first day kicked off with Paul Arah&apos;s workshop{' '}
                <em>Unlocking eBPF Superpowers for Go Developers</em>, followed
                by a keynote from Marvin Collins. The talk lineup ranged from
                language internals to cloud infrastructure and AI: Utee
                Akaninyene on{' '}
                <em>
                  Unlocking Go&apos;s Potential: Navigating Modern Challenges
                  with Internal Insights
                </em>
                , Rodney Osodo on <em>Expanding Kubernetes Ability with
                Controllers</em>, and Olusola Enoch Alao on{' '}
                <em>AI Agents the Go Way: Production Patterns Without Python</em>.
              </p>
              <p>
                After round-table discussions and a partner session, the day
                closed with Desmond Obisi&apos;s{' '}
                <em>
                  Build Your First Developer Tool with Go: From Idea to CLI in
                  30 Minutes
                </em>{' '}
                and Narcisse Egonu&apos;s{' '}
                <em>Non-Deadlock Concurrency Bugs in Go</em>.
              </p>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-3">Day two</h2>
            <div className="space-y-4 text-gray-700 leading-relaxed">
              <p>
                Day two opened with Alex Rios&apos;s workshop{' '}
                <em>
                  Modern Go Testing: Building Reliable and Deterministic Test
                  Suites
                </em>
                , followed by an interactive Women Who Go session. David Aniebo
                covered{' '}
                <em>
                  Behavior-Driven Development in Go: Automating Acceptance
                  Criteria with GoDog
                </em>
                , and Ayooluwa Isaiah walked through{' '}
                <em>Building Command Line Applications in Go</em>.
              </p>
              <p>
                The afternoon featured Daniel Adeboye on{' '}
                <em>Shipping Go Apps at Startup Speed — Without Security
                Regrets</em>, Sammy Kerata Oina on{' '}
                <em>
                  Bootstrapping with Gophers: How Go Compiles Itself and What
                  That Means for You
                </em>
                , Chukwuemeka Chukwurah on{' '}
                <em>Querying the Wire: Building a Postgres Protocol Sniffer in
                Go</em>, and Jubril Oyetunji closing with{' '}
                <em>The Gophers Guide to Kubernetes APIs</em>.
              </p>
            </div>
          </section>

          <section className="border-t border-gray-200 pt-8">
            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                href="/speakers"
                className="inline-flex items-center justify-center gap-2 rounded-lg border border-brand px-5 py-2.5 text-sm font-semibold text-brand hover:bg-brand/5 transition-colors"
              >
                Meet the 2025 speakers
                <ArrowRight className="w-4 h-4" aria-hidden />
              </Link>
              <Link
                href="/2024"
                className="inline-flex items-center justify-center gap-2 rounded-lg border border-brand px-5 py-2.5 text-sm font-semibold text-brand hover:bg-brand/5 transition-colors"
              >
                GopherCon Africa 2024 in Nairobi
                <ArrowRight className="w-4 h-4" aria-hidden />
              </Link>
              <Link
                href="/schedule"
                className="inline-flex items-center justify-center gap-2 rounded-lg bg-brand px-5 py-2.5 text-sm font-semibold text-white hover:bg-brand-dark transition-colors"
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
