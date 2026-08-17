'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { Star, Ban, ArrowRight } from 'lucide-react';

interface Talk {
  id: string;
  talkTitle: string;
  talkDescription: string;
  talkCategory: string;
  talkLevel: string;
  talkDuration: string;
  bio: string;
  previousSpeakingExperience: string;
  reviews: Array<{
    id: string;
    rating: number | null;
    notes: string;
    skipped: boolean;
  }>;
}

export default function ReviewsPage() {
  const [talks, setTalks] = useState<Talk[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    loadTalks();
  }, []);

  async function loadTalks() {
    try {
      const res = await fetch('/api/reviews');
      if (!res.ok) throw new Error('Failed to load submissions');
      const data = await res.json();
      setTalks(data);
    } catch (error) {
      toast.error('Failed to load submissions');
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  const reviewedCount = talks.filter(t => t.reviews.length > 0 && !t.reviews[0].skipped).length;
  const skippedCount = talks.filter(t => t.reviews.length > 0 && t.reviews[0].skipped).length;
  const completedCount = reviewedCount + skippedCount;
  const progressPercentage = talks.length > 0 ? Math.round((completedCount / talks.length) * 100) : 0;
  const nextPendingTalk = talks.find(t => t.reviews.length === 0);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-950">
        <p className="text-gray-500 dark:text-gray-400">Loading submissions...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <div className="flex items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">Review Submissions</h1>
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                {completedCount} of {talks.length} completed
              </p>
            </div>
            {nextPendingTalk ? (
              <button
                onClick={() => router.push(`/reviews/${nextPendingTalk.id}`)}
                className="flex items-center gap-2 bg-brand hover:bg-brand-dark text-white text-sm font-semibold px-4 py-2.5 rounded-lg transition-colors shrink-0"
              >
                Continue reviewing
                <ArrowRight className="w-4 h-4" />
              </button>
            ) : completedCount > 0 ? (
              <span className="text-sm font-medium text-brand">All done ✓</span>
            ) : null}
          </div>
          <div className="mt-4 flex items-center gap-3">
            <div className="flex-1 bg-gray-200 dark:bg-gray-800 rounded-full h-2">
              <div
                className="bg-brand h-2 rounded-full transition-all duration-500"
                style={{ width: `${progressPercentage}%` }}
              />
            </div>
            <span className="text-sm font-medium text-gray-600 dark:text-gray-400 w-9 text-right">{progressPercentage}%</span>
          </div>
        </div>

        {talks.length === 0 ? (
          <div className="bg-white dark:bg-gray-900 rounded-lg shadow dark:shadow-black/40 p-8 text-center">
            <p className="text-gray-500 dark:text-gray-400">No submissions to review</p>
          </div>
        ) : (
          <div className="bg-white dark:bg-gray-900 rounded-lg shadow dark:shadow-black/40 overflow-hidden border border-transparent dark:border-gray-800">
            <table className="w-full">
              <thead className="bg-gray-50 dark:bg-gray-800/50 border-b border-gray-200 dark:border-gray-800">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Title</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Category</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Level</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-800">
                {talks.map((talk) => {
                  const review = talk.reviews[0];
                  const reviewed = !!review && !review.skipped;
                  const skipped = !!review && review.skipped;
                  return (
                    <tr
                      key={talk.id}
                      onClick={() => router.push(`/reviews/${talk.id}`)}
                      className="hover:bg-gray-50 dark:hover:bg-gray-800/50 cursor-pointer transition-colors"
                    >
                      <td className="px-6 py-4">
                        <p className="font-medium text-gray-900 dark:text-gray-100">{talk.talkTitle}</p>
                      </td>
                      <td className="px-6 py-4 text-gray-600 dark:text-gray-400">{talk.talkCategory}</td>
                      <td className="px-6 py-4 text-gray-600 dark:text-gray-400">{talk.talkLevel}</td>
                      <td className="px-6 py-4">
                        {skipped ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300">
                            <Ban className="w-3 h-3" />
                            Skipped
                          </span>
                        ) : reviewed ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 dark:bg-green-950/50 text-green-800 dark:text-green-400">
                            <Star className="w-3 h-3 fill-current" />
                            {review.rating?.toFixed(1)}
                          </span>
                        ) : (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 dark:bg-yellow-950/50 text-yellow-800 dark:text-yellow-400">
                            Pending
                          </span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
