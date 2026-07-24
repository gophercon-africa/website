import type { AdminSubmission } from '@/src/types/admin';

// Selection order: best average rating first (unrated talks last), review
// count as tiebreaker.
export function sortForSelection(submissions: AdminSubmission[]): AdminSubmission[] {
  return [...submissions].sort((a, b) => {
    if (a.averageRating === null && b.averageRating === null) {
      return b.reviewCount - a.reviewCount;
    }
    if (a.averageRating === null) return 1;
    if (b.averageRating === null) return -1;
    return b.averageRating - a.averageRating || b.reviewCount - a.reviewCount;
  });
}
