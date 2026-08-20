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

const workshops = [
  {
  eyebrow: "ULTIMATE SOFTWARE DESIGN",
  title: "Ultimate Software Design and Engineering",
  level: "Intermediate",
  instructor: "Bill Kennedy",
  instructorImageSrc: "/speakers-2026/workshops/bill-kenedy.jpg",
  quote: {
    text: "As a program evolves and acquires more features, it becomes complicated, with subtle dependencies between components. Over time, complexity accumulates, and it becomes harder and harder for programmers to keep all the relevant factors in their minds as they modify the system. This slows down development and leads to bugs, which slow development even more and add to its cost. Complexity increases inevitably over the life of any program. The larger the program, and the more people that work on it, the more difficult it is to manage complexity.",
    author: "John Ousterhout",
  },
  description: [
    "This class teaches you how to structure and architect software to take advantage of AI coding tools for the long term maintenance of your software. From the beginning, you will program along with the instructor as he walks through the design philosophies and guidelines for engineering software in Go leveraging AI tooling. With each new feature added to the project, you will learn how to think about, read, maintain, manage, and debug code. The core of this class is to teach you how to handle and reduce the spread of complexity in the systems you are building.",
  ],
  modules: [
    {
      title: "Deploy First Mentality",
      intro:
        "We begin to build a service with a focus on the ability to maintain, manage, and debug the service in Kubernetes.",
      bullets: [
        "Design Philosophy, Guidelines, What to Expect",
        "Project Layers, Policies, and Guidelines",
        "AI Tooling",
      ],
    },
    {
      title: "Kubernetes",
      intro:
        "We introduce Kubernetes and get a K8s environment up and running. At this point, everything we do runs in the K8s environment.",
      bullets: [
        "Clusters, Nodes and Pods",
        "Start the Kubernetes Cluster",
        "Create/Build a Dockerfile for the Service",
        "Create/Apply K8s Deployment for the Service",
      ],
    },
    {
      title: "Go Scheduler and Kubernetes Quotas",
      intro:
        "We introduce applying Quotas to the deployment and discuss the problems that can result when using quotas.",
      bullets: [
        "Understanding CPU Quotas",
        "Understanding the Go Scheduler",
        "Adjust GOMAXPROCS to maximize performance",
      ],
    },
    {
      title: "Domain-Driven, Data-Oriented Architecture",
      intro:
        "We talk about the data-driven, data-oriented architecture. We discuss the design philosophy, guidelines, and semantics of how the three layers of App, Business, and Storage work together.",
      bullets: [
        "Architecture Review",
        "Applying and Implementing Firewalls",
        "Data Flow Trust vs Non-Trust",
        "Data Isolation, Shaping, and Data Validation",
        "Developer Isolation with Domains",
        "Leveraging AI Tooling",
      ],
    },
  ],
  prerequisites: [
    "It is expected that you will have been coding in Go for several months.",
    "A working Go environment running on the device you will be bringing to class.",
  ],
  preparation: [
    "Please clone the main repo for the class.",
    "Please read the notes in the makefile for installing all the tooling and testing the code before class.",
    "Please email the instructor, Bill Kennedy, for assistance.",
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
          <span className="mt-0.5 inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-brand/10 text-xs font-bold text-brand">
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
  return (
    <div className="min-h-screen bg-surface-sunken py-12 sm:py-16">
      <Container>
        <div className="rounded-surface border border-line bg-surface overflow-hidden">
          <div className="px-6 py-7 sm:px-10 sm:py-10">
            <div className="flex flex-col gap-6">
              <div className="flex flex-col gap-4">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <p className="text-xs font-semibold uppercase tracking-wide text-brand">
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

              <div className="rounded-control bg-brand-tint p-6">
                <p className="text-xs font-semibold uppercase tracking-wide text-brand-dark dark:text-brand-bright">
                  What you&apos;ll learn
                </p>
                <p className="mt-2 text-sm text-body leading-relaxed">
                  Learn how to structure and architect Go software for long-term
                  maintainability, with a deploy-first mentality in Kubernetes
                  and practical guidance for leveraging AI tooling.
                </p>
              </div>

              <figure className="border-l-2 border-brand pl-5">
                <blockquote className="leading-relaxed text-body">
                  &ldquo;{workshop.quote.text}&rdquo;
                </blockquote>
                <figcaption className="mt-3 text-sm font-semibold text-muted">
                  {workshop.quote.author}
                </figcaption>
              </figure>

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

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 pt-2">
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
              </div>
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
}
