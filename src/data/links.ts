import { CODE_OF_CONDUCT_URL, SOCIAL_LINKS } from '@/src/lib/links';

/** One tappable row on the /links page. */
export interface LinkItem {
  href: string;
  label: string;
  /** Short second line, e.g. who took the photos or what the link is for. */
  note?: string;
}

export interface LinkGroup {
  id: string;
  title: string;
  /** Short line under the group title. */
  blurb?: string;
  items: LinkItem[];
}

/** Venue Wi-Fi shown on the /links page with copy buttons. */
export const WIFI = {
  ssid: 'PRIDEINN_AZURE_GUEST',
  password: 'Pride1@Azure',
} as const;

const DRIVE = 'https://drive.google.com/drive/folders/';

/** Everything the printed QR codes point to, in one place. Order matters:
 *  the groups render top to bottom. */
export const LINK_GROUPS: LinkGroup[] = [
  {
    id: 'event',
    title: 'At the event',
    items: [
      { href: '/schedule', label: 'Schedule', note: 'Live times for all three days' },
      {
        href: 'https://forms.gle/5oDnkYML5fXXvca88',
        label: 'Feedback form',
        note: 'Tell us what you loved and what we can do better',
      },
      {
        href: CODE_OF_CONDUCT_URL,
        label: 'Go Community Code of Conduct',
        note: 'Applies to everyone at GopherCon Africa',
      },
    ],
  },
  {
    id: 'photos-day-1',
    title: 'Day 1 photos',
    blurb: 'Thursday 15 October — workshop day',
    items: [
      { href: `${DRIVE}10jAqitMXyF2eU0LnwvKzl-w_6ZEiVg1O`, label: 'Dukaloco Studios', note: 'Day 1 photos' },
      { href: `${DRIVE}17wf0CsEp72IQpeZnS1dNRJG1hvhvlmiq`, label: 'TTHS Production House', note: 'Day 1 photos' },
    ],
  },
  {
    id: 'photos-day-2',
    title: 'Day 2 photos',
    blurb: 'Friday 16 October — conference day 1',
    items: [
      { href: `${DRIVE}1qVst2Frqd4uJEtBsWyUC6meuSGYGTJeW`, label: 'Dukaloco Studios', note: 'Day 2 photos' },
      { href: `${DRIVE}1g3r9-MxT1sIayDGqYXM5WSCqMevJWwNI`, label: 'Dukaloco Studios', note: 'Photo session' },
      { href: `${DRIVE}1ADfndEvHFz5qI5c4uBR78TMhtkDOJ8m4`, label: 'Dukaloco Studios', note: 'Sponsors' },
      { href: `${DRIVE}10gjV0JYcmM3fw3_XCMWRK2PTXCxjXqcc`, label: 'TTHS Production House', note: 'Day 2 photos' },
    ],
  },
  {
    id: 'photos-day-3',
    title: 'Day 3 photos',
    blurb: 'Saturday 17 October — conference day 2',
    items: [
      { href: `${DRIVE}1E4yosUuWJsbR7wY0QMjZlDdAL6uVAG9-`, label: 'Dukaloco Studios', note: 'Day 3 photos' },
      { href: `${DRIVE}1-6bbsKRxXSBfO4PhIGF4kOPXyziogLKQ`, label: 'TTHS Production House', note: 'Day 3 photos' },
    ],
  },
  {
    id: 'community',
    title: 'Stay connected',
    items: [
      {
        href: 'https://gophers.slack.com/archives/C0C4RP4LU1F',
        label: '#gophercon-africa on Gophers Slack',
        note: 'Not on Gophers Slack yet? Get an invite below',
      },
      {
        href: 'https://gophers.slack.com/archives/C0C8LMDS58W',
        label: 'Workshop channel on Gophers Slack',
        note: 'Setup help and materials from the workshop day',
      },
      {
        href: 'https://invite.slack.golangbridge.org',
        label: 'Join Gophers Slack',
        note: 'Free invite via GoBridge',
      },
      {
        href: 'https://chat.whatsapp.com/Kgn2nnGQJQB2HUbRFxFser',
        label: 'Women Who Go Africa on WhatsApp',
        note: 'Community group',
      },
      { href: 'https://x.com/wwgafrica', label: 'Women Who Go Africa on X' },
      { href: SOCIAL_LINKS.x, label: 'GopherCon Africa on X' },
      { href: SOCIAL_LINKS.linkedin, label: 'GopherCon Africa on LinkedIn' },
      { href: SOCIAL_LINKS.meetup, label: 'Golang Nigeria on Meetup' },
    ],
  },
  {
    id: 'sponsors',
    title: 'From our sponsors',
    items: [
      {
        href: 'https://tailscale.com/',
        label: 'Sign up for Tailscale',
        note: 'Free for personal use. Unlimited devices, up to 6 users',
      },
      {
        href: 'https://discord.gg/tailscale',
        label: 'Join the Tailscale Discord',
        note: 'Community support and chat',
      },
    ],
  },
];
