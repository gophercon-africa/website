import type { TalkStatus } from '@/src/lib/talkStatus';

export const STATUS_LABELS: Record<TalkStatus, string> = {
  pending: 'Pending',
  shortlisted: 'Shortlisted',
  waitlisted: 'Waitlisted',
  accepted: 'Accepted',
  rejected: 'Rejected',
};

export const STATUS_BADGE_CLASSES: Record<TalkStatus, string> = {
  pending: 'bg-yellow-50 text-yellow-700 border-yellow-200 dark:bg-yellow-950/40 dark:text-yellow-400 dark:border-yellow-900/50',
  shortlisted: 'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950/40 dark:text-blue-400 dark:border-blue-900/50',
  waitlisted: 'bg-purple-50 text-purple-700 border-purple-200 dark:bg-purple-950/40 dark:text-purple-400 dark:border-purple-900/50',
  accepted: 'bg-green-50 text-green-700 border-green-200 dark:bg-green-950/40 dark:text-green-400 dark:border-green-900/50',
  rejected: 'bg-red-50 text-red-700 border-red-200 dark:bg-red-950/40 dark:text-red-400 dark:border-red-900/50',
};
