// Canonical talk categories — shared by the CFP form and the admin category editor.
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
