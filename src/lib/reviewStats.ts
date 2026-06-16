interface ReviewLike {
  rating: number | null;
  skipped: boolean;
}

export function computeReviewStats(reviews: ReviewLike[]): {
  averageRating: number | null;
  reviewCount: number;
  skippedCount: number;
} {
  const ratedReviews = reviews.filter((r) => !r.skipped && r.rating !== null);
  const skippedCount = reviews.filter((r) => r.skipped).length;
  const reviewCount = ratedReviews.length;
  const averageRating =
    reviewCount > 0 ? ratedReviews.reduce((sum, r) => sum + (r.rating ?? 0), 0) / reviewCount : null;

  return { averageRating, reviewCount, skippedCount };
}
