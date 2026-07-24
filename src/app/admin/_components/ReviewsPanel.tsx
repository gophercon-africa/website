'use client';

import { Ban } from 'lucide-react';
import { StarRating } from '@/src/components/common/StarRating';
import type { AdminReview } from '@/src/types/admin';

export function ReviewsPanel({
  reviews,
  reviewCount,
  averageRating,
}: {
  reviews: AdminReview[];
  reviewCount: number;
  averageRating: number | null;
}) {
  return (
    <div className="bg-white dark:bg-gray-900 rounded-lg shadow-sm border border-gray-200 dark:border-gray-800 p-5">
      <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100 mb-3">
        Reviews ({reviewCount}
        {averageRating !== null ? `, avg ${averageRating.toFixed(1)}` : ''})
      </h3>
      {reviews.length === 0 ? (
        <p className="text-sm text-gray-500 dark:text-gray-400">No reviews yet.</p>
      ) : (
        <ul className="space-y-4">
          {reviews.map((review) => (
            <li key={review.id} className="border-b border-gray-100 dark:border-gray-800 pb-3 last:border-0 last:pb-0">
              <p className="text-sm font-medium text-gray-900 dark:text-gray-100 mb-1">{review.reviewerEmail}</p>
              {review.skipped ? (
                <div className="flex items-center gap-1.5 text-xs text-gray-500 dark:text-gray-400">
                  <Ban className="w-3.5 h-3.5" />
                  Skipped{review.skipReason ? `: ${review.skipReason}` : ''}
                </div>
              ) : (
                <StarRating value={review.rating ?? 0} name={`rating-${review.id}`} onChange={() => {}} readonly />
              )}
              {review.notes && (
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-2 whitespace-pre-wrap">{review.notes}</p>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
