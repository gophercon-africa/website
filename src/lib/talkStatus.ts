export type TalkStatus = 'pending' | 'accepted' | 'rejected';

export function getTalkStatus(talk: { IsPendingReview: boolean; IsAccepted: boolean }): TalkStatus {
  if (talk.IsPendingReview) return 'pending';
  return talk.IsAccepted ? 'accepted' : 'rejected';
}

export function statusToBooleans(status: TalkStatus): { IsPendingReview: boolean; IsAccepted: boolean } {
  switch (status) {
    case 'pending':
      return { IsPendingReview: true, IsAccepted: false };
    case 'accepted':
      return { IsPendingReview: false, IsAccepted: true };
    case 'rejected':
      return { IsPendingReview: false, IsAccepted: false };
  }
}
