import { Speaker } from '@/src/types/speaker';

/**
 * The announced GopherCon Africa 2026 lineup.
 *
 * Sourced from accepted CFP submissions (bios and abstracts are the authors'
 * own words) plus the invited workshop instructor. Photos are initials
 * placeholders until headshots are collected — add imageUrl per speaker as
 * they arrive. Two further accepted talks are held back until they appear on
 * the public schedule.
 */
export const speakers2026: Speaker[] = [
{
  "slug": "ainsley-clark",
  "name": "Ainsley Clark",
  "title": "Senior Software Engineer",
  "company": "Just Eat & ainsley.dev",
  "bio": "Ainsley Clark is a Senior Software Engineer and Go Developer Advocate specialising in Go, scalable backend systems & modern front-end designs.\n\nWith a background in full-stack development, Ainsley is passionate about using Go beyond traditional backends, including for frontends and web applications. He also runs ainsley.dev, a web development and design company where he builds bespoke websites and Go APIs.\n\nWhen he's not on the keyboard, he enjoys scuba diving and tinkering with new tech.",
  "talkTitle": "//go:embed: From Comment to Binary - Discover Linker Internals, Tradeoffs and Production Patterns",
  "talkDescription": "TBA"},
{
  "slug": "ajitem-sahasrabuddhe",
  "name": "Ajitem Sahasrabuddhe",
  "title": "Lead Technology Consultant",
  "company": "Technogise",
  "bio": "Ajitem Sahasrabuddhe is a Lead Technology Consultant and long-time Go developer who enjoys building systems close to the metal. He uses Go extensively for backend services, infrastructure tooling, and cloud-native experimentation.\n\nOver the past several years, Ajitem has explored the internals of containers, networking, and operating system primitives using Go—building tools and demos that explain how technologies like namespaces, cgroups, and container runtimes work under the hood.\n\nHe regularly shares these learnings through conference talks and technical writing, with a focus on helping developers understand not just how to use Go, but how Go interacts with the systems it runs on.",
  "talkTitle": "Building a Container Runtime from Scratch",
  "talkDescription": "TBA"},
{
  "slug": "alex-rios",
  "name": "Alex Rios",
  "title": "Principal Engineer",
  "company": "Memed",
  "bio": "Alex is a Principal Engineer at Memed, where he builds developer platforms and internal tools that empower engineering teams across the organization. With 17+ years of experience, he's the author of System Programming Essentials with Go and Learning Zig, and writes about staff engineering and systems thinking on Substack and his personal blog.\n\nAlex speaks regularly at international conferences and is passionate about data-oriented design, making complex systems understandable, and helping engineers grow into technical leadership roles.",
  "talkTitle": "Why Go Hides Its Spinlocks",
  "talkDescription": "TBA"},
{
  "slug": "anthony-alaribe",
  "name": "Anthony Alaribe",
  "title": "Cofounder",
  "company": "Monoscope",
  "bio": "Anthony has spent over a decade building software at companies like Opera, and DeliveryHero. \nNow he’s a founder of a AI friendly software monitoring startup, [Monoscope.tech](http://Monoscope.tech) . Say hi when you see him. He loves conversations about abusing tech, databases and less popular programming languages.",
  "talkTitle": "Runbooks That Think: Executable Checklists with AI in the Loop",
  "talkDescription": "TBA"},
{
  "slug": "bala-grivine-ochieng",
  "name": "Bala Grivine Ochieng",
  "title": "Software Engineer",
  "company": "Savannah Informatics Limited",
  "bio": "I am a backend/systems engineer focused on building scalable systems and exploring the internals of storage and database infrastructure. My work involves designing and debugging low-level components such as write-ahead logs, file I/O pipelines, and distributed cloud infrastructure in Go.\n\nI contribute to TidesDB, an open-source LSM-tree storage engine in C, where I work on WAL recovery, durability semantics, and low-level I/O correctness. I also write publicly about storage systems and Linux internals.",
  "talkTitle": "Write-Ahead Logging in Go: The Subtle Bugs That Corrupt Databases",
  "talkDescription": "TBA"},
{
  "slug": "bill-kennedy",
  "name": "Bill Kennedy",
  "title": "Managing Partner",
  "company": "Ardan Labs",
  "imageUrl": "/speakers-2026/workshops/bill-kenedy.jpg",
  "bio": "Bill Kennedy is a managing partner at Ardan Labs, a Go training and consulting company. He is the author of the Ultimate Go training series and has taught Go to thousands of engineers around the world.",
  "talkTitle": "Ultimate Software Design and Engineering (workshop)",
  "talkDescription": "TBA"},
{
  "slug": "desmond-obisi",
  "name": "Desmond Obisi",
  "title": "Product Engineer",
  "company": "Mono",
  "bio": "I am a Product Engineer, I bridge the gap between complex engineering, developer experience, and user-centric product leadership. Currently working full-time on open banking and financial data infrastructure at Mono and bootstrapping Ritestack(A digital products startup).",
  "talkTitle": "Beyond RBAC: Building Team-Scoped Authorization in Go",
  "talkDescription": "TBA"},
{
  "slug": "ige-oluwasegun-oluwajubelo",
  "name": "Ige Oluwasegun Oluwajubelo",
  "title": "Software Engineer & Open Source Author (Class54 · BudgIT · Vesicash)",
  "company": "class54 Educational limited",
  "bio": "Ige Oluwasegun is Engineering Lead at Class54, the only African company selected for Google's inaugural Play Apps Accelerator, and Tech Lead at BudgIT, a civic technology organisation operating across Nigeria, Ghana, Sierra Leone, Senegal, and the USA. He organises the SeGoM conference for software engineers in Nigeria and is currently pursuing an MSc at the University of Lagos. Otellix is his first open-source Go library.",
  "talkTitle": "When Your AI Costs More Than Your Infrastructure: LLM Observability in Go",
  "talkDescription": "TBA"},
{
  "slug": "kennedy-karoko",
  "name": "Kennedy Karoko",
  "title": "Senior Software Engineer",
  "company": "Safaricom",
  "bio": "Kennedy is a Senior Software Engineer with 6+ years of experience building cloud native, distributed systems in Go. His production work spans healthcare, fintech, and adtech infrastructure. He also writes about Go at blog.karoko.dev.",
  "talkTitle": "1 Million Transactions in Under a Second",
  "talkDescription": "TBA"},
{
  "slug": "mugirase-emmanuel",
  "name": "Mugirase Emmanuel",
  "title": "Head Of Engineering",
  "company": "Ironji Trade Ltd",
  "bio": "Emmanuel is a software engineer with nine years of software engineering experience. He has been building production Go systems since 2021 and currently serves as Head of Engineering at Ironji Trade Ltd, where he leads system architecture, engineering standards, and team development. He is working on gofasta, an open-source Go backend toolkit. His interests sit at the intersection of developer productivity, idiomatic language design, and the cultural norms that shape how communities adopt (or reject) tooling.",
  "talkTitle": "Opt-Out Defaults: Designing a Go Backend Toolkit Without Becoming a Framework",
  "talkDescription": "TBA"},
{
  "slug": "timilehin-omolana",
  "name": "Timilehin Omolana",
  "title": "Software Engineer",
  "company": "Fairmoney MFB",
  "bio": "Timilehin Omolana is a Software Engineer at Fairmoney and a researcher in Math and Computing. With a career spanning from building state-of-the-art Ground Control Stations for UAVs, to architecting financial systems for millions of users across Africa, Timilehin specializes in high-stakes, resilient distributed systems. A Go enthusiast at heart, he is obsessed with the intersection of mathematical determinism and system reliability. When he isn't optimizing backend pipelines or exploring intelligent systems, you’ll find him at a piano or dissecting audio signals for his research.",
  "talkTitle": "The Gopher's Trident: Conquering the Saga Pattern in Distributed Systems",
  "talkDescription": "TBA"},
{
  "slug": "utibeabasi-umanah",
  "name": "Utibeabasi Umanah",
  "title": "Senior DevOps Engineer",
  "company": "Heartstamp",
  "bio": "Utibeabasi Umanah is a software engineer focused on distributed systems and cloud-native infrastructure in Go. His work spans Kubernetes tooling, Terraform providers, and platform engineering systems built at companies like Fleek and Matrica. Lately, he’s been exploring eBPF and Linux internals, with projects ranging from web application firewalls to distributed schedulers and blockchain infrastructure.",
  "talkTitle": "Don't Let Your AI Agents Run Wild: Building Secure Sandboxes with Firecracker and Go",
  "talkDescription": "TBA"},
{
  "slug": "beryl-christine-atieno",
  "name": "Beryl Christine Atieno",
  "title": "Backend Software Developer",
  "bio": "I am a self-taught backend developer with around two years of experience working primarily with Go. I am interested in backend systems design, developer experience, and the internals of how programming languages like Go behave under the hood. I have worked projects focused on system design, APIs, and developer tools, with a growing interest in how backend systems behave in production environments. I enjoy learning through hands-on building and exploring the tradeoffs behind software design decisions.",
  "talkTitle": "Hidden Behaviors of Go Structs in Production",
  "talkDescription": "TBA"}
];
