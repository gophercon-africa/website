export type SessionType =
  | 'keynote'
  | 'talk'
  | 'lightning'
  | 'workshop'
  | 'panel'
  | 'sponsor'
  | 'break'
  | 'networking'
  | 'registration'
  | 'remarks';

export interface SessionSpeaker {
  name: string;
  bio?: string;
  /** Inline overrides for speakers not (yet) in the `speakers2026` lineup —
      e.g. placeholder co-presenters. When present these win over the lookup. */
  title?: string;
  company?: string;
  imageUrl?: string;
}

/** A slice inside a full-day session (workshop parts + the breaks between). */
export interface SessionSegment {
  /** 24-hour 'HH:MM' */
  startTime: string;
  /** 24-hour 'HH:MM' */
  endTime: string;
  title: string;
  type?: SessionType;
}

export interface Session {
  id: string;
  title: string;
  type: SessionType;
  /** 24-hour 'HH:MM' */
  startTime: string;
  /** 24-hour 'HH:MM' */
  endTime: string;
  /** Slot not yet filled — rendered as a muted placeholder card. */
  tba?: boolean;
  speaker?: SessionSpeaker;
  /** Multiple presenters (co-stage sessions). Rendered in place of `speaker`. */
  speakers?: SessionSpeaker[];
  /** Shown in the speaker position when no one can be named yet,
      e.g. 'Event MC' or 'Speaker to be announced'. */
  speakerLabel?: string;
  description?: string;
  link?: { href: string; label: string };
  /** Full-day block (e.g. the workshop day): rendered taller with a
      "Full day" eyebrow and an inline `segments` timeline. */
  fullDay?: boolean;
  segments?: SessionSegment[];
  /** Sponsored session — renders a "Sponsored By:" logo instead of a speaker. */
  sponsor?: { name: string; logo: string };
}

export interface ScheduleDay {
  day: 1 | 2 | 3;
  date: string;
  dayLabel: string;
  theme: string;
  sessions: Session[];
}
