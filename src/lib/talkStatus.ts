export const TALK_STATUSES = ['pending', 'shortlisted', 'waitlisted', 'accepted', 'rejected'] as const;

export type TalkStatus = (typeof TALK_STATUSES)[number];

function isTalkStatus(value: string | null | undefined): value is TalkStatus {
  return (TALK_STATUSES as readonly string[]).includes(value ?? '');
}

export function getTalkStatus(talk: {
  status?: string | null;
  IsPendingReview: boolean;
  IsAccepted: boolean;
}): TalkStatus {
  // status is authoritative; the boolean derivation is a safety net for rows
  // written outside the app before the column existed.
  if (isTalkStatus(talk.status)) return talk.status;
  if (talk.IsPendingReview) return 'pending';
  return talk.IsAccepted ? 'accepted' : 'rejected';
}

// Booleans stay synced with status: only a final accept/reject takes a talk
// out of IsPendingReview — shortlisted/waitlisted are deliberation buckets,
// not decisions.
export function statusToBooleans(status: TalkStatus): { IsPendingReview: boolean; IsAccepted: boolean } {
  switch (status) {
    case 'pending':
    case 'shortlisted':
    case 'waitlisted':
      return { IsPendingReview: true, IsAccepted: false };
    case 'accepted':
      return { IsPendingReview: false, IsAccepted: true };
    case 'rejected':
      return { IsPendingReview: false, IsAccepted: false };
  }
}
