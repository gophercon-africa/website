import type { Metadata } from "next";
import Link from "next/link";
import { ChevronDown } from "lucide-react";
import Badge from "@components/ui/Badge";
import Button from "@components/ui/Button";
import Container from "@components/ui/Container";
import SpeakerAvatar from "@components/speakers/SpeakerAvatar";
import { TICKETS_URL } from "@/src/lib/links";

export const metadata: Metadata = {
  title: "Workshops | GopherCon Africa 2026",
  description:
    "Hands-on workshops led by experienced instructors at GopherCon Africa.",
};

type WorkshopModule = { title: string; intro: string; bullets: string[] };

type Workshop = {
  eyebrow: string;
  title: string;
  level: string;
  instructor: string;
  instructorImageSrc: string;
  description: string[];
  /** Short "What you'll learn" summary; omitted from the page when absent. */
  outcome?: string;
  /** Pull-quote; omitted from the page when absent. */
  quote?: { text: string; author: string };
  /** Syllabus accordion; the whole section is omitted when absent. */
  modules?: WorkshopModule[];
  prerequisites?: string[];
  preparation?: string[];
};

// Ainsley is sending the full description and syllabus (a working copy was
// shared 7 Sept; the level/scope is still being agreed). Until then the page
// shows the title, instructor, and a brief description only. The commented
// fields below show the shape to fill in — see the previous workshop
// (git history, "Ultimate Software Design and Engineering") for a full
// example of each.
const workshops: Workshop[] = [
  {
    eyebrow: "FULL-STACK GO",
    title: "Full-Stack Go: Domain-Driven Applications with sqlc and templ",
    // TODO(workshop): confirm level with Ainsley — the organisers asked for
    // something more advanced than the first draft.
    level: "Intermediate",
    instructor: "Ainsley Clark",
    instructorImageSrc: "/speakers-2026/ainsley-clark.jpg",
    description: [
      "A hands-on, domain-driven approach to building a complete Go application in a single day: type-safe database access with sqlc, server-rendered UI with templ, and a codebase organised around the domain rather than the framework. You'll build a working app against real external APIs, following a starter repo with checkpoints at each module so nobody gets left behind, and leave with something you built yourself.",
    ],
    outcome:
      "How to structure a Go application around its domain, generate type-safe data access with sqlc, render UI with templ, and ship a working full-stack app by the end of the day.",
    // TODO(workshop): fill in from Ainsley's syllabus when confirmed.
    // quote: { text: "…", author: "…" },
    // modules: [
    //   { title: "Module 1", intro: "One-line summary.", bullets: ["…", "…"] },
    // ],
    // prerequisites: [
    //   "Comfortable writing Go (several months of experience).",
    //   "A working Go environment on the laptop you'll bring.",
    // ],
    // preparation: [
    //   "Clone the starter repo (link to follow).",
    //   "Install the tooling listed in its README before class.",
    // ],
  },
];

function AccordionItem({
  index,
  title,
  intro,
  bullets,
}: {
  index: number;
  title: string;
  intro: string;
  bullets: string[];
}) {
  return (
    <details className="group rounded-control border border-line bg-surface">
      <summary className="flex cursor-pointer list-none items-center justify-between gap-4 px-5 py-4">
        <div className="flex min-w-0 items-start gap-3">
          <span className="mt-0.5 inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-brand/10 text-xs font-bold text-brand dark:bg-brand/20 dark:text-brand-bright">
            {index}
          </span>
          <div className="min-w-0">
            <p className="font-semibold text-ink">{title}</p>
            <p className="mt-1 text-sm text-muted">{intro}</p>
          </div>
        </div>
        <ChevronDown className="h-5 w-5 shrink-0 text-faint transition-transform group-open:rotate-180" />
      </summary>
      <div className="px-5 pb-5">
        <ul className="space-y-2 text-sm text-body list-disc pl-5">
          {bullets.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </div>
    </details>
  );
}

export default function WorkshopsPage() {
  const workshop = workshops[0];
  const hasLogistics = workshop.prerequisites || workshop.preparation;
  return (
    <div className="min-h-screen bg-surface-sunken py-12 sm:py-16">
      <Container>
        <div className="rounded-surface border border-line bg-surface overflow-hidden">
          <div className="px-6 py-7 sm:px-10 sm:py-10">
            <div className="flex flex-col gap-6">
              <div className="flex flex-col gap-4">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <p className="text-xs font-semibold uppercase tracking-wide text-brand dark:text-brand-bright">
                    {workshop.eyebrow}
                  </p>
                  <Button href={TICKETS_URL} external>
                    Buy Tickets
                  </Button>
                </div>

                <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-ink">
                  {workshop.title}
                </h1>

                <p className="text-sm text-muted">
                  Part of Day 1 — Thursday, October 15.{' '}
                  <Link
                    href="/schedule"
                    className="font-semibold text-brand hover:text-brand-dark dark:text-brand-bright dark:hover:text-brand-light hover:underline"
                  >
                    See the full schedule
                  </Link>
                </p>

                <div className="flex flex-wrap items-center gap-3">
                  <div className="flex items-center gap-3">
                    <SpeakerAvatar
                      name={workshop.instructor}
                      imageUrl={workshop.instructorImageSrc}
                      size={40}
                    />
                    <div className="leading-tight">
                      <p className="text-sm font-semibold text-ink">
                        {workshop.instructor}
                      </p>
                      <p className="text-xs text-muted">Instructor</p>
                    </div>
                  </div>
                  <Badge tone="outline">{workshop.level}</Badge>
                </div>
              </div>

              <div className="space-y-4 text-body leading-relaxed">
                {workshop.description.map((paragraph) => (
                  <p key={paragraph}>{paragraph}</p>
                ))}
              </div>

              {workshop.outcome && (
                <div className="rounded-control bg-brand-tint p-6">
                  <p className="text-xs font-semibold uppercase tracking-wide text-brand-dark dark:text-brand-bright">
                    What you&apos;ll learn
                  </p>
                  <p className="mt-2 text-sm text-body leading-relaxed">
                    {workshop.outcome}
                  </p>
                </div>
              )}

              {workshop.quote && (
                <figure className="border-l-2 border-brand pl-5">
                  <blockquote className="leading-relaxed text-body">
                    &ldquo;{workshop.quote.text}&rdquo;
                  </blockquote>
                  <figcaption className="mt-3 text-sm font-semibold text-muted">
                    {workshop.quote.author}
                  </figcaption>
                </figure>
              )}

              {workshop.modules ? (
                <div>
                  <div className="mb-4">
                    <h2 className="text-2xl font-bold tracking-tight text-ink">
                      Syllabus
                    </h2>
                    <p className="mt-1 text-sm text-muted">
                      What a student is expected to learn
                    </p>
                  </div>

                  <div className="space-y-3">
                    {workshop.modules.map((module, idx) => (
                      <AccordionItem
                        key={module.title}
                        index={idx + 1}
                        title={module.title}
                        intro={module.intro}
                        bullets={module.bullets}
                      />
                    ))}
                  </div>
                </div>
              ) : (
                <p className="text-sm text-muted">
                  Full syllabus, prerequisites, and preparation notes will be
                  published here shortly.
                </p>
              )}

              {hasLogistics && (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 pt-2">
                  {workshop.prerequisites && (
                    <div className="rounded-control bg-surface-sunken p-6">
                      <h3 className="mb-3 text-xs font-semibold uppercase tracking-wide text-ink">
                        Prerequisites
                      </h3>
                      <ul className="space-y-2 text-sm text-body list-disc pl-5">
                        {workshop.prerequisites.map((item) => (
                          <li key={item}>{item}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {workshop.preparation && (
                    <div className="rounded-control bg-surface-sunken p-6">
                      <h3 className="mb-3 text-xs font-semibold uppercase tracking-wide text-ink">
                        Recommended Preparation
                      </h3>
                      <ul className="space-y-2 text-sm text-body list-disc pl-5">
                        {workshop.preparation.map((item) => (
                          <li key={item}>{item}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
}
