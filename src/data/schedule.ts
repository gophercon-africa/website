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
        notes: 'Some prep should be ongoing here - for the first speaker',
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
      },
      {
        activity: 'Talk',
        startTime: '12:30',
        endTime: '13:00',
        duration: '0:30',
        speaker: 'Utee Akaninyene',
        talk: "Unlocking Go's Potential: Navigating Modern Challenges with Internal Insights",
      },
      {
        activity: 'Talk',
        startTime: '13:00',
        endTime: '13:20',
        duration: '0:20',
        speaker: 'Rodney Osodo',
        talk: 'Expanding Kubernetes Ability with Controllers',
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
        notes: 'Partna will take 10mins to talk',
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
      },
      {
        activity: 'Talk',
        startTime: '16:25',
        endTime: '16:45',
        duration: '0:20',
        speaker: 'Narcisse Egonu',
        talk: 'Non-Deadlock Concurrency Bugs in Go',
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
        notes: `This session will be moderated by Irene and Rebeccah.

Agenda:
1️⃣ Introduction
2️⃣ About Women Who Go (WWG)
3️⃣ Purpose & Vision
4️⃣ Global Footprint
5️⃣ What WWG Does
6️⃣ Impact
7️⃣ How to Get Involved
8️⃣ Takeaways
9️⃣ Q&A / Open Discussion
✨ Closing Message`,
      },
      {
        activity: 'Talk',
        startTime: '13:00',
        endTime: '13:20',
        duration: '0:20',
        speaker: 'David Aniebo',
        talk: 'Behavior-Driven Development in Go: Automating Acceptance Criteria with GoDog',
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
      },
      {
        activity: 'Talk',
        startTime: '14:35',
        endTime: '14:55',
        duration: '0:20',
        speaker: 'Daniel Adeboye',
        talk: 'Shipping Go Apps at Startup Speed—Without Security Regrets',
      },
      {
        activity: 'Talk',
        startTime: '14:55',
        endTime: '15:25',
        duration: '0:30',
        speaker: 'Sammy Kerata Oina',
        talk: 'Bootstrapping with Gophers: How Go Compiles Itself and What That Means for You',
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
      },
      {
        activity: 'Talk',
        startTime: '16:15',
        endTime: '16:35',
        duration: '0:20',
        speaker: 'Jubril Oyetunji',
        talk: "The Gophers Guide to Kubernetes API's",
      },
    ],
  },
];

export default scheduleData;