export interface Speaker {
  /** URL-safe identity, shared with the schedule via src/lib/slug.ts. */
  slug: string;
  name: string;
  title?: string;
  company?: string;
  bio?: string;
  /** Absent → initials placeholder (SpeakerAvatar). */
  imageUrl?: string;
  talkTitle?: string;
  talkDescription?: string;
  /** Only real, verified profiles — absent fields render nothing. */
  twitter?: string;
  linkedin?: string;
  github?: string;
  website?: string;
}
