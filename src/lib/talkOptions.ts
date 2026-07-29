// Canonical talk field options — shared by the CFP form, the admin editors,
// and API validation.
export const TALK_CATEGORIES = [
  'AI',
  'DevOps/Infrastructure',
  'Compiler/Interpreter',
  'Security',
  'API',
  'Observability',
  'Others',
] as const;

export type TalkCategory = (typeof TALK_CATEGORIES)[number];

export const TALK_LEVELS = ['beginner', 'intermediate', 'advanced'] as const;

export type TalkLevel = (typeof TALK_LEVELS)[number];

export const TALK_LEVEL_LABELS: Record<TalkLevel, string> = {
  beginner: 'Beginner',
  intermediate: 'Intermediate',
  advanced: 'Advanced',
};

// Stored as minutes; the label is what submitters and admins see.
export const TALK_DURATIONS = ['20', '30'] as const;

export type TalkDuration = (typeof TALK_DURATIONS)[number];

export const TALK_DURATION_LABELS: Record<TalkDuration, string> = {
  '20': '20 minutes',
  '30': '30 minutes',
};
