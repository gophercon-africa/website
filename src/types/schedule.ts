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
