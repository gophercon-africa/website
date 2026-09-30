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
  /** "What you'll learn": a summary paragraph or a list; omitted when absent. */
  outcome?: string | string[];
  /** Pull-quote; omitted from the page when absent. */
  quote?: { text: string; author: string };
  /** Syllabus accordion; the whole section is omitted when absent. */
  modules?: WorkshopModule[];
  prerequisites?: string[];
  preparation?: string[];
};

const workshops: Workshop[] = [
  {
    eyebrow: "FULL-STACK GO",
    title: "Full-Stack Go: Domain-Driven Applications with sqlc and templ",
    level: "Intermediate",
    instructor: "Ainsley Clark",
    instructorImageSrc: "/speakers-2026/ainsley-clark.jpg",
    description: [
      "Build a complete full-stack application in Go, from data ingestion through persistence to a server-rendered UI, purely in Go. This workshop teaches you how to design maintainable full-stack applications that age well.",
      "You'll start from a working application built on a real public API, walk through five different architectures for the same feature to see what domain-driven design actually buys you. Then you'll extend the application with a new domain, a type-safe data layer with sqlc and SQLite, and a front-end written with templ.",
      "This workshop is intended to be hands-on and interactive, by making the architecture decisions yourself, with guidance at each step. You'll leave with a working application written by hand and a clear model of how to structure Go code around a domain rather than a framework.",
    ],
    outcome: [
      "How to structure a Go codebase around its domain so it ages well.",
      "How to extend an existing application with a brand-new domain, end to end.",
      "How to generate a type-safe data layer with sqlc.",
      "How to serve a user interface directly from Go with templ.",
    ],
    modules: [
      {
        title: "Architecture & Domain-Driven Design",
        intro:
          "What makes a Go project maintainable? We'll go through five different architectures with the same features and work out where each is suited best.",
        bullets: [
          "Package layout & structure.",
          "Domain-driven: what belongs where, and why.",
          "What pushes you from one architecture to the next.",
          "A brief look at the finished application.",
        ],
      },
      {
        title: "Extending the Domain",
        intro:
          "You add a brand-new domain to an existing application, sourced from a second, independent API.",
        bullets: [
          "Where does a new concept live?",
          "Modelling entities and operations.",
          "Translating API responses into domain types.",
        ],
      },
      {
        title: "A Type-Safe Data Layer with sqlc",
        intro:
          "Once you're fetching new data, it's time to store it, with sqlc and SQLite.",
        bullets: [
          "Schema design, driven by the domain.",
          "Writing & generating queries.",
          "Mapping generated types to domain types.",
          "Query tests against a real database.",
        ],
      },
      {
        title: "Ingestion",
        intro:
          "Wiring the new domain into the application's existing ingestion pipeline.",
        bullets: [
          "Enriching every record as it's ingested.",
          "Persisting and associating the result.",
        ],
      },
      {
        title: "Building the Front-End with templ",
        intro:
          "Exposing the application through handlers that call templ components and layouts.",
        bullets: [
          "templ fundamentals: components, props, layout slots.",
          "Handlers, routing & error mapping.",
          "A homepage, themed your way.",
        ],
      },
      {
        title: "Profiling",
        intro:
          "Where the application spends its time, and how you can make it faster.",
        bullets: [
          "Profiling the web handler with pprof.",
          "Load testing, and seeing where it falls over.",
          "Reducing memory usage.",
        ],
      },
    ],
    prerequisites: [
      "Several months writing Go.",
      "Familiarity with SQL and relational databases.",
      "Go 1.27.1 or newer on the device you bring, with ~/go/bin on your PATH.",
      "macOS or Linux, or Windows with WSL2. You'll need make (on macOS: xcode-select --install).",
      "A GitHub account. Send us your username beforehand so we can give you push access.",
      "Basic knowledge of git.",
      "Basic HTML and CSS. No JavaScript framework experience needed.",
    ],
    preparation: [
      "Join the dedicated Slack channel.",
      "Go 1.27.1 (or the latest version) installed.",
      "Claude Code installed and up to date.",
      "Python 3 installed (used by the design tooling).",
      "GoLand preferred — we'll provide a 3-month free licence!",
    ],
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
                    Get a workshop ticket
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

                <p className="text-sm text-muted">
                  The workshop needs its own ticket: a Workshop ticket, or a
                  Workshop + Conference ticket. Conference-days tickets do not
                  include it.
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
                  {Array.isArray(workshop.outcome) ? (
                    <ul className="mt-2 space-y-1.5 text-sm text-body leading-relaxed list-disc pl-5">
                      {workshop.outcome.map((item) => (
                        <li key={item}>{item}</li>
                      ))}
                    </ul>
                  ) : (
                    <p className="mt-2 text-sm text-body leading-relaxed">
                      {workshop.outcome}
                    </p>
                  )}
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
