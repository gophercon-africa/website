import { DaySchedule } from '@/src/types/schedule';

export const scheduleData: DaySchedule[] = [
  {
    day: 1,
    activities: [
      {
        activity: 'Arrival & Registration',
        startTime: '7:30',
        endTime: '9:00',
        duration: '1:30:00',
      },
      {
        activity: 'Workshop',
        startTime: '9:00',
        endTime: '11:00',
        duration: '2:00',
        speaker: 'Paul Arah',
        talk: 'Unlocking eBPF Superpowers for Go Developers',
        notes: `eBPF enables us to dynamically program and extend the functionality of operating systems quickly and securely. Over the last few years, eBPF has sparked a new wave of innovation, resulting in an entirely new generation of tools that are redefining how we approach networking, observability, security, tracing and more. eBPF has become a crucial part of the modern cloud native infrastructure stack. 

In this talk, we will demonstrate how Go developers can leverage the tools in the Go ecosystem to build applications that use eBPF. We will walk through the current state of the Go ecosystem for eBPF development, including key libraries. Attendees will learn how to write eBPF programs, load them into the kernel, and interact with them from Go user-space applications. Through practical examples and live demos, we'll cover important topics like working with maps, handling events, and understanding typical workflows for building and debugging eBPF applications in Go.

This talk will give you the knowledge and confidence to incorporate eBPF into your Go projects. No kernel experience required, just curiosity and a passion for building better software.`,
      },
      {
        activity: 'Breakfast',
        startTime: '11:30',
        endTime: '12:00',
        duration: '0:30',
        notes: 'Assign volunteers and one co-org',
      },
      {
        activity: 'Keynote',
        startTime: '12:00',
        endTime: '12:30',
        duration: '0:30',
        speaker: 'Marvin Collins',
        notes: ''
      },
      {
        activity: 'Talk',
        startTime: '12:30',
        endTime: '13:00',
        duration: '0:30',
        speaker: 'Utee Akaninyene',
        talk: "Unlocking Go's Potential: Navigating Modern Challenges with Internal Insights",
        notes: `Abstract: Go's elegant simplicity often belies the sophisticated engineering under its hood. In an era where modern software demands high concurrency, fault tolerance, and efficient resource utilisation, understanding Go's internals isn't just academic – it's crucial for building robust, scalable, and maintainable applications.
This talk will dive into the core mechanisms that make Go powerful, exploring the goroutine scheduler (M, P, G model), the garbage collector's operation and tuning, and the nuances of interface dispatch. We'll then bridge this knowledge to practical challenges faced by developers today, such as:
Optimising performance in high-throughput services.
Debugging complex concurrent systems.
Minimising latency in I/O-bound applications.
Designing maintainable APIs and distributed architectures.
Leveraging Go's tooling for observability and profiling.
Attendees will leave with a deeper appreciation for Go's design philosophy and actionable insights on how to harness its unique capabilities to overcome the complexities of modern software development.

Target Audience: This session is designed for intermediate to advanced Go developers who want to move beyond basic syntax and gain a profound understanding of how Go works internally to solve real-world engineering challenges. It's particularly relevant for those building highly concurrent services, distributed systems, or performance-sensitive applications, while also aimed at increasing the adoration and passion for the language by beginners.

Key Takeaways
Attendees will learn to:
Demystify the Go Scheduler: Understand the M, P, G model and its implications for concurrent program design and performance.
Optimise for GC: Gain insights into how Go's garbage collector operates and learn strategies to minimise GC pauses and memory footprint.
Master Interfaces: Comprehend the runtime mechanics of Go interfaces and how they impact performance and design patterns.
Tackle Concurrency Headaches: Identify common pitfalls in concurrent programming and apply Go's idiomatic patterns (goroutines, channels, sync package) more effectively.
Design Resilient Systems: Apply internal knowledge to build more scalable, fault-tolerant, and observable services.

Presentation Description: I've had the privilege of working with Go for over four years in production environments, building everything from automated scripts and robust web and mobile application servers to engaging CLI tools and various side projects. This journey has given me a deep appreciation for Go's capabilities, especially when confronting the complexities of modern software development.
Currently, I'm CTO of Orbit, a company I'm building with a friend. Orbit is an ambitious, AI-powered automated HR & Payroll system, fortified with Web3 superpowers. As you can imagine, a system of this nature demands exceptional technical resilience, robust automation, and unparalleled reliability. When it came time to select the foundational language for Orbit, after documentation of our technical requirements and software specifications, Go emerged as our definitive choice. I distinctly remember that night, weighing Go against other strong contenders, a decision that I even tweeted about at the time. You might be wondering, why Go?

Beyond the widely celebrated features like its inherent concurrency model, blazing speed, and remarkable efficiency – features you likely already know (and if not, I highly recommend exploring them!) – there's one aspect of Go that often doesn't receive enough praise, especially when compared to languages like Java, Rust, Zig, or C++ (two of which I also write professionally): Go's profound simplicity.
But I won't simply extol Go's simplicity in isolation. Instead, I'll paint a vivid picture of the very complexities we face in modern software development – the challenges of building scalable, fault-tolerant, high-performance systems for demanding domains like fintech or large-scale HR/payroll. Then, I'll demonstrate precisely how Go, through its elegant design and powerful internals, provides remarkably straightforward solutions to these seemingly daunting problems.

Just to underscore the language's versatility and my deep engagement with the broader ecosystem: two years ago, my co-author Chris and I created DolphJS, an open-source server-side framework built to address specific challenges we identified within the JavaScript ecosystem. Its first open-source version was released in Lagos last year, and it has since powered numerous projects, including some of our own. However, DolphJS didn't make it into Orbit's core main service. Why? This talk will discuss those critical technical distinctions, explaining how Go's fundamental design choices provided the superior foundation required for Orbit's robust and automated nature, particularly when considering its internal workings. 

We'll explore how Go's scheduler, garbage collector, and interface mechanics are directly translated into architectural decisions that ensure Orbit's stability, performance, and scalability.
Join me as we peel back the layers of Go, connect its powerful internals to the realities of modern software engineering, and discover why it's not just a language of choice, but a strategic advantage.
        `
      },
      {
        activity: 'Talk',
        startTime: '13:00',
        endTime: '13:20',
        duration: '0:20',
        speaker: 'Rodney Osodo',
        talk: 'Expanding Kubernetes Ability with Controllers',
        notes: `Kubernetes is powerful, but its true potential comes when you extend it. In this talk, we’ll explore how to build custom controllers in Go using CRDs. We’ll see real-world examples of automating infrastructure and edge workloads.
`
      },
      {
        activity: 'Lunch Break',
        startTime: '13:20',
        endTime: '14:05',
        duration: '0:45',
        notes: 'Assign volunteers and one co-org',
      },
      {
        activity: 'Talk',
        startTime: '14:05',
        endTime: '14:35',
        duration: '0:30',
        speaker: 'Olusola Enoch Alao',
        talk: 'AI Agents the Go Way: Production Patterns Without Python',
        notes: `The era of AI agents is here, and Go is exceptionally positioned to power them. This talk demystifies building sophisticated, agentic AI web applications using Go, moving beyond simple model serving to showcase true intelligent behavior.
Attendees will witness a live demo of a "GopherCon Africa Info Agent." This Go-based agent will:
  1. Understand Voice: Utilize Gowhisper (a Go binding for OpenAI's Whisper model) for seamless speech-to-text input.
  2. Reason & Plan: Leverage langchaingo to interpret queries and decide on actions.
  3. Access Knowledge: Query a local knowledge base (e.g., GopherCon schedule in a Weaviate vector DB via its Go client).
  4. Use Tools: Dynamically perform internet searches via SerpApi's Go client for real-time information.
  5. Synthesize & Respond: Employ LLMs (Google Gemini) orchestrated by langchaingo to generate comprehensive answers.
6. Text to Speech service: Sends text answer to a TTS service (Google Cloud TTS) which converts it to audio, and plays back to the user.
We'll dive into the architectural patterns for such Go agents, including defining tools, managing agentic loops, prompt engineering for tool use, and integrating these components into a responsive web service. 
The session will cover practical Go libraries and techniques, offering a clear roadmap for developers to build their own intelligent, tool-using AI applications. 
This is a chance to see how Go’s performance, concurrency, and growing AI ecosystem make it a prime choice for the next generation of AI, addressing unique challenges and opportunities, particularly within the African tech landscape.
        `
      },
      {
        activity: 'General',
        startTime: '14:35',
        endTime: '15:25',
        duration: '0:50',
        talk: 'Round-Table Discussions',
        notes: `We will be hosting three engaging round-table sessions, each designed to encourage open dialogue and knowledge sharing among participants:

1. AI: Perspectives and Practices
   This session will explore participants' thoughts on artificial intelligence — what it means to them, how they currently use it in their work or projects, and their views on its potential benefits and challenges. We'll discuss practical applications, ethical considerations, and the evolving role of AI in various industries.

2. Go Internals: Under the Hood
   A deep-dive discussion focused on the inner workings of the Go programming language. Participants will exchange insights about Go's internal mechanisms, explore recent updates or proposed changes, and share experiences with performance optimization, tooling, and debugging.

3. Community Development: Building Together
   This round-table will center on how we can strengthen and grow our community. We'll reflect on what's working well, identify areas for improvement, and collect actionable ideas and suggestions to make our community more inclusive, collaborative, and impactful.`,
      },
      {
        activity: 'Partna Talk',
        startTime: '15:25',
        endTime: '15:35',
        duration: '0:10',
        notes: 'Partna will take 10mins to talk about their product',
      },
      {
        activity: 'Break',
        startTime: '15:35',
        endTime: '15:55',
        duration: '0:20',
      },
      {
        activity: 'Talk',
        startTime: '15:55',
        endTime: '16:25',
        duration: '0:30',
        speaker: 'Desmond Obisi',
        talk: 'Build Your First Developer Tool with Go: From Idea to CLI in 30 Minutes',
        notes: `Go is a powerful choice for building fast, portable, and reliable tools — and it's especially great for improving developer experience. In this beginner-friendly talk, we'll walk through how to create your first custom dev tool using Go, and show how just a few lines of code can automate workflows, reduce friction, and save time for developers.

We’ll start with the basics of Go's CLI capabilities, including flag parsing, directory scanning, and file I/O — then put it all together in a live demo where we build a simple, yet impactful CLI tool: a DX helper that scans a project for .env files, checks for missing variables, and optionally generates a sample .env.example file. The kind of tool your team would actually use.

You’ll leave this talk with:
- A clear understanding of how to build and structure Go CLI tools
- A live-coded example of a practical developer tool focused on real-world DX
- Tips for packaging and sharing your tool internally or as open source
- Motivation to build your own dev tools with Go, no matter your level of experience

No prior Go knowledge required — just curiosity and a passion for improving the developer workflow!
        `
      },
      {
        activity: 'Talk',
        startTime: '16:25',
        endTime: '16:45',
        duration: '0:20',
        speaker: 'Narcisse Egonu',
        talk: 'Non-Deadlock Concurrency Bugs in Go',
        notes: `Go's concurrency model is powerful, but complex concurrent systems can still hide subtle bugs that don't cause deadlocks. These "non-deadlock concurrency bugs" lead to silent failures like data corruption, inconsistent states, performance issues, and goroutine leaks, making them notoriously hard to debug.

This talk will explore these critical, often-overlooked concurrency issues in Go. We'll cover:

Understanding the "Silent Killers": Defining common non-deadlock bugs like data races, atomicity/order violations, goroutine leaks, livelocks, and subtle channel misuses.
Real-World Manifestations: Examining practical code examples to illustrate how these bugs sneak into Go applications.
Detection & Diagnosis: Effective use of Go's Race Detector, robust testing (stress/integration), context for timeouts/cancellation, and profiling (pprof) for identification.
Prevention Strategies: Best practices and idiomatic Go concurrency patterns to architect resilient applications, emphasizing structured concurrency, careful channel design, sync primitives, and immutable data.`
      },
    ],
  },
  {
    day: 2,
    activities: [
      {
        activity: 'Arrival & Registration',
        startTime: '7:30',
        endTime: '9:00',
        duration: '1:30:00',
      },
      {
        activity: 'Workshop',
        startTime: '9:00',
        endTime: '11:00',
        duration: '2:00',
        speaker: 'Alex Rios',
        talk: 'Modern Go Testing: Building Reliable and Deterministic Test Suites',
        notes: `Go's testing package has evolved significantly, but many developers still use patterns from 2015. This workshop covers the modern testing features introduced in recent Go versions that make tests more reliable, maintainable, and expressive. Learn to test time-dependent code deterministically with "time bubbles," validate structured logging with slogtest, use test contexts for automatic cleanup, and leverage new synchronization testing tools. Through a comprehensive hands-on lab, you'll build a complete test suite for a realistic HTTP service using these modern techniques.

By the end of this workshop, participants will:

Use T.Context and T.Cleanup for proper test lifecycle management
Test time-dependent code deterministically without time.Sleep
Validate structured logs as test assertions with slogtest
Apply testing.synctest for goroutine synchronization testing
Leverage fstest for filesystem testing without real I/O
Organize tests effectively with attributes and metadata
Profile memory allocations in benchmarks with AllocPerRun
Identify and avoid common testing anti-patterns
Target Audience
Go developers who:

Write tests but want to modernize their approach
Struggle with flaky or slow tests
Need to test concurrent or time-dependent code
Want to improve test reliability and maintainability
Are building production systems with comprehensive test coverage
Prerequisites
Intermediate Go experience
Familiarity with basic testing package usage
Laptop with Go 1.23+ installed
Basic understanding of goroutines and contexts
The workshop culminates in building a comprehensive test suite for an HTTP service with logging, time dependencies, and file I/O, applying all learned techniques.`,
        requirements: 'IMPORTANT: Please bring your laptop as this session will be completely practical and hands-on.',
      },
      {
        activity: 'Breakfast',
        startTime: '11:30',
        endTime: '12:00',
        duration: '0:30',
      },
      {
        activity: 'General',
        startTime: '12:00',
        endTime: '13:00',
        duration: '1:00',
        talk: 'Women Who Go - Interactive Session',
        notes: `This session shall be moderated by Irene and/or Cecilia and will cover the following topics:

Agenda – Women Who Go Africa Panel @ GopherCon Africa 2025
1️⃣ Introduction & Welcome
2️⃣ About Women Who Go (WWG)
3️⃣ Purpose & Vision of WWG
4️⃣ Meet the Panelists
5️⃣ Building with Go: Experiences & Challenges
6️⃣ Career Growth & Community Impact
7️⃣ Advice for Women Entering the Go Ecosystem
8️⃣ Audience Q&A & Closing Reflections`,
      },
      {
        activity: 'Talk',
        startTime: '13:00',
        endTime: '13:20',
        duration: '0:20',
        speaker: 'David Aniebo',
        talk: 'Behavior-Driven Development in Go: Automating Acceptance Criteria with GoDog',
        notes: `Go's concurrency model is powerful, but complex concurrent systems can still hide subtle bugs that don't cause deadlocks. These "non-deadlock concurrency bugs" lead to silent failures like data corruption, inconsistent states, performance issues, and goroutine leaks, making them notoriously hard to debug.

This talk will explore these critical, often-overlooked concurrency issues in Go. We'll cover:

Understanding the "Silent Killers": Defining common non-deadlock bugs like data races, atomicity/order violations, goroutine leaks, livelocks, and subtle channel misuses.
Real-World Manifestations: Examining practical code examples to illustrate how these bugs sneak into Go applications.
Detection & Diagnosis: Effective use of Go's Race Detector, robust testing (stress/integration), context for timeouts/cancellation, and profiling (pprof) for identification.
Prevention Strategies: Best practices and idiomatic Go concurrency patterns to architect resilient applications, emphasizing structured concurrency, careful channel design, sync primitives, and immutable data.
        `
      },
      {
        activity: 'Lunch Break',
        startTime: '13:20',
        endTime: '14:05',
        duration: '0:45',
      },
      {
        activity: 'Talk',
        startTime: '14:05',
        endTime: '14:35',
        duration: '0:30',
        speaker: 'Ayooluwa Isaiah',
        talk: 'Building Command Line Applications in Go',
        notes: `Many of the command-line tools we use daily, like Docker, the GitHub CLI, and Hugo are built with Go. It's a major use case for the language, but there is a surprising lack of consolidated learning resources that guide a developer through the process from start to finish.

As an author of several successful CLI tools, I'm well placed to provide guidance on how to build with them Go effectively. In this talk, I'll start with the fundamentals by covering relevant language features, common design patterns, and how to structure such projects. 

From there, I'll introduce essential community tools like Cobra for building complex commands and Bubbletea for creating beautiful terminal UIs.  I'll also share helpful resources like clig.dev that attendees can use to guide their CLI designs. Finally, I'll touch on distribution using Goreleaser.

My goal is to inspire attendees to build command-line tools with Go, and equip them to start by providing a sample project template they can clone to get started quickly.
        `
      },
      {
        activity: 'Talk',
        startTime: '14:35',
        endTime: '14:55',
        duration: '0:20',
        speaker: 'Daniel Adeboye',
        talk: 'Shipping Go Apps at Startup Speed—Without Security Regrets',
        notes: `In this talk, I’ll show you how to keep your Go apps secure from day one, without slowing down your team. Drawing from my experience building  Gitsecure and Wasps in the past, we’ll go over practical strategies to avoid common security pitfalls in early Go code. 
        We’ll cover things like handling authentication (JWTs, sessions, OAuth), managing secrets in the cloud, and securing your Go module dependencies.
        I’ll also share simple tips for logging and observability that work well for small teams. By the end, you’ll have a practical security checklist to start using right away.
        `
      },
      {
        activity: 'Talk',
        startTime: '14:55',
        endTime: '15:25',
        duration: '0:30',
        speaker: 'Sammy Kerata Oina',
        talk: 'Bootstrapping with Gophers: How Go Compiles Itself and What That Means for You',
        notes: `One of Go's most fascinating aspects is that the Go compiler is written in Go itself. But how is this possible? How do you compile a compiler that's written in the same language it compiles? This talk explores the elegant solution behind Go's self-hosting compiler and the journey from C to Go that made it possible.
We'll dive into the concept of compiler bootstrapping, examining how the Go team accomplished the remarkable feat of rewriting the entire Go toolchain from C to Go in version 1.5. You'll learn about the clever techniques used during this transition, including the temporary use of a translator tool that converted the C-based compiler to Go, and how the team maintained compatibility while completely changing the implementation language.
Beyond the historical journey, we'll explore what this self-hosting architecture means for Go developers today. We'll examine how the compiler's Go implementation makes it more accessible for contributions, enables better testing and debugging of the compiler itself, and allows for innovative features like compile-time code generation and advanced static analysis tools.
Attendees will gain insights into compiler design principles, understand the technical challenges of language bootstrapping, and discover how Go's unique approach influences the language's evolution. We'll also look at practical implications, including how understanding the compiler's Go implementation can help you write more efficient code and contribute to the Go ecosystem.
This session combines computer science fundamentals with practical insights, showing how elegant engineering decisions shape the tools we use every day.
        `
      },
      {
        activity: 'Break',
        startTime: '15:25',
        endTime: '15:45',
        duration: '0:20',
      },
      {
        activity: 'Talk',
        startTime: '15:45',
        endTime: '16:15',
        duration: '0:30',
        speaker: 'Chukwuemeka Chukwurah',
        talk: 'Querying the Wire: Building a Postgres Protocol Sniffer in Go',
        notes: `Abstract:
Ever wondered how Postgres clients and servers establish communication before a single query is run? In this talk, we’ll peel back the curtain on the Postgres wire protocol—starting with its handshake—and show how understanding it unlocks powerful infrastructure capabilities. You'll learn how to build a Postgres-aware reverse proxy in Go that can parse, inspect, and route queries in real time.

Description:
Before a single SELECT * is executed, Postgres clients and servers perform a series of low-level message exchanges—startup packets, authentication negotiation, parameter syncing, and readiness signals. Most engineers never see this, yet it holds the key to building smarter infrastructure around Postgres.

This talk is about demystifying that handshake.

We’ll walk through the Postgres wire protocol handshake step by step, using Go to inspect each message exchanged between client and server. Then, we’ll take that understanding further—applying it to build a Postgres-aware reverse proxy in Go that:

Intercepts TCP connections and performs protocol-aware routing

Handles the startup/authentication handshake seamlessly

Enables advanced behaviors like query-based filtering or logging

You’ll see real code and packet captures, understand how Go's networking primitives (like net.Conn) come into play, and get a clear mental model of how Postgres communication works at the wire level.

Talk Outline:
Why Should You Care About the PostgreSQL Wire Protocol?

Real-world motivation: observability, control, and debugging at the protocol layer

Step-by-Step: The Postgres Handshake

Startup packet

Authentication methods


Building the Proxy in Go

TCP interception and connection multiplexing

Handling the handshake transparently

Real use cases: logging, filtering, intelligent routing

Challenges & Lessons Learned

TLS negotiation and pitfalls

Connection management and timeouts

Transparency vs control

Next Steps & Takeaways

Extending the proxy

Applying these concepts to other databases

Tools and resources for deeper learning

Why This Talk Matters:
Unique & Under-discussed Topic: Few engineers understand the Postgres handshake, yet it’s foundational for advanced infrastructure.

Practical Value: Attendees walk away with knowledge and code they can apply in real-world tools.

Technical Depth: Combines networking, databases, and Go—all in one focused session.

Great Fit for Backend/System Engineers: Ideal for those working on developer tooling, observability, or backend performance optimization.
        `
      },
      {
        activity: 'Talk',
        startTime: '16:15',
        endTime: '16:35',
        duration: '0:20',
        speaker: 'Jubril Oyetunji',
        talk: "The Gophers Guide to Kubernetes API's",
        notes: `Kubernetes is a wonderful piece of technology that has transformed the way we think about deploying and scaling our applications. However, its true potential has always lied in its extendable and API-driven nature, which has given birth to most of the CNCF landscape as we know it. If you have ever tried to extend Kubernetes in any way, you’ve likely been burned by the confusing package names, the multiple ways to achieve the same outcome or the sheer lack of information on how to perform specific tasks. Navigating the Kubernetes APIs can be a daunting experience, filled with pain points such as unclear documentation, intricate dependencies, and unexpected behaviour. 

This talk aims to demystify the complexities of the Kubernetes API, offering attendees practical insights and strategies to overcome these challenges. By highlighting some of the most common use cases for extending the Kubernetes API and providing practical code snippets, attendees will learn how to effectively navigate the many hurdles they might encounter when building custom controllers or operators.
        `
      },
    ],
  },
];

export default scheduleData;