import { speakers2026 } from '@/src/data/speakers-2026';
import { slugify } from '@/src/lib/slug';

/**
 * Bridge between the schedule (which knows a speaker only by name) and the
 * speakers lineup (which holds photos + roles). Keyed by the same deterministic
 * `slugify` used for the /speakers?speaker= links, so there's one source of
 * truth: photos/titles/companies flow into the schedule automatically as they
 * are added to `speakers2026`.
 */
const bySlug = new Map(speakers2026.map((s) => [s.slug, s]));

export interface SpeakerProfile {
  imageUrl?: string;
  title?: string;
  company?: string;
}

export function getSpeakerProfile(name: string): SpeakerProfile {
  const speaker = bySlug.get(slugify(name));
  if (!speaker) return {};
  return {
    imageUrl: speaker.imageUrl,
    title: speaker.title,
    company: speaker.company,
  };
}
