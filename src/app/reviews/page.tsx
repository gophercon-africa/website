'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { Star, Ban } from 'lucide-react';

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

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-500">Loading submissions...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Review Submissions</h1>
          <div className="mt-3 flex items-center gap-4">
            <div className="flex-1 max-w-md">
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm text-gray-600">
                  Progress: {completedCount}/{talks.length} reviewed
                </span>
                <span className="text-sm font-medium text-gray-700">{progressPercentage}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-[#006B3F] h-2 rounded-full transition-all duration-500"
                  style={{ width: `${progressPercentage}%` }}
                />
              </div>
            </div>
          </div>
        </div>

        {talks.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-8 text-center">
            <p className="text-gray-500">No submissions to review</p>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Title</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Category</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Level</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {talks.map((talk) => {
                  const review = talk.reviews[0];
                  const reviewed = !!review && !review.skipped;
                  const skipped = !!review && review.skipped;
                  return (
                    <tr
                      key={talk.id}
                      onClick={() => router.push(`/reviews/${talk.id}`)}
                      className="hover:bg-gray-50 cursor-pointer transition-colors"
                    >
                      <td className="px-6 py-4">
                        <p className="font-medium text-gray-900">{talk.talkTitle}</p>
                      </td>
                      <td className="px-6 py-4 text-gray-600">{talk.talkCategory}</td>
                      <td className="px-6 py-4 text-gray-600">{talk.talkLevel}</td>
                      <td className="px-6 py-4">
                        {skipped ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-600">
                            <Ban className="w-3 h-3" />
                            Skipped
                          </span>
                        ) : reviewed ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                            <Star className="w-3 h-3 fill-current" />
                            {review.rating?.toFixed(1)}
                          </span>
                        ) : (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
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
