'use client';

import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { StarRating } from '@/src/components/common/StarRating';
import Modal from '@/src/components/common/Modal';

interface Talk {
  id: string;
  fullName: string;
  email: string;
  talkTitle: string;
  talkDescription: string;
  talkCategory: string;
  talkLevel: string;
  talkDuration: string;
  bio: string;
  previousSpeakingExperience: string;
  reviews: Array<{
    id: string;
    rating: number;
    notes: string;
  }>;
}

export default function ReviewsPage() {
  const [talks, setTalks] = useState<Talk[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedTalk, setSelectedTalk] = useState<Talk | null>(null);
  const [rating, setRating] = useState(0);
  const [notes, setNotes] = useState('');
  const [saving, setSaving] = useState(false);

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

  function openModal(talk: Talk) {
    setSelectedTalk(talk);
    const existing = talk.reviews[0];
    setRating(existing?.rating || 0);
    setNotes(existing?.notes || '');
  }

  function closeModal() {
    setSelectedTalk(null);
    setRating(0);
    setNotes('');
  }

  async function saveReview() {
    if (!selectedTalk || rating === 0) {
      toast.error('Please select a rating');
      return;
    }

    setSaving(true);
    try {
      const res = await fetch('/api/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          talkId: selectedTalk.id,
          rating,
          notes,
        }),
      });

      if (!res.ok) throw new Error('Failed to save review');

      toast.success('Review saved!');
      closeModal();
      loadTalks(); // Refresh list
    } catch (error) {
      toast.error('Failed to save review');
      console.error(error);
    } finally {
      setSaving(false);
    }
  }

  const reviewedCount = talks.filter(t => t.reviews.length > 0).length;

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
          <p className="text-gray-600 mt-2">
            Progress: {reviewedCount}/{talks.length} reviewed
          </p>
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
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Speaker</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Category</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Level</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {talks.map((talk) => {
                  const reviewed = talk.reviews.length > 0;
                  return (
                    <tr
                      key={talk.id}
                      onClick={() => openModal(talk)}
                      className="hover:bg-gray-50 cursor-pointer transition-colors"
                    >
                      <td className="px-6 py-4">
                        <p className="font-medium text-gray-900">{talk.talkTitle}</p>
                      </td>
                      <td className="px-6 py-4 text-gray-600">{talk.fullName}</td>
                      <td className="px-6 py-4 text-gray-600">{talk.talkCategory}</td>
                      <td className="px-6 py-4 text-gray-600">{talk.talkLevel}</td>
                      <td className="px-6 py-4">
                        {reviewed ? (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                            ✓ Reviewed
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

      {selectedTalk && (
        <Modal isOpen={true} onClose={closeModal} title="Review Submission">
          <div className="space-y-6">
            <div>
              <h3 className="font-semibold text-gray-900">{selectedTalk.talkTitle}</h3>
              <p className="text-sm text-gray-600 mt-1">by {selectedTalk.fullName}</p>
            </div>

            <div>
              <p className="text-sm font-medium text-gray-700">Description</p>
              <p className="text-sm text-gray-600 mt-1">{selectedTalk.talkDescription}</p>
            </div>

            <div className="grid grid-cols-3 gap-4 text-sm">
              <div>
                <p className="font-medium text-gray-700">Category</p>
                <p className="text-gray-600">{selectedTalk.talkCategory}</p>
              </div>
              <div>
                <p className="font-medium text-gray-700">Level</p>
                <p className="text-gray-600">{selectedTalk.talkLevel}</p>
              </div>
              <div>
                <p className="font-medium text-gray-700">Duration</p>
                <p className="text-gray-600">{selectedTalk.talkDuration}</p>
              </div>
            </div>

            <div>
              <p className="text-sm font-medium text-gray-700">Speaker Bio</p>
              <p className="text-sm text-gray-600 mt-1">{selectedTalk.bio}</p>
            </div>

            <div>
              <p className="text-sm font-medium text-gray-700">Previous Experience</p>
              <p className="text-sm text-gray-600 mt-1">{selectedTalk.previousSpeakingExperience}</p>
            </div>

            <div className="border-t pt-6">
              <StarRating
                value={rating}
                name="rating"
                onChange={setRating}
                label="Your Rating"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Notes (private, for committee)
              </label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={4}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-[#006B3F] focus:ring-2 focus:ring-[#006B3F] focus:outline-none"
                placeholder="Add your review notes..."
              />
            </div>

            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={closeModal}
                className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={saveReview}
                disabled={saving || rating === 0}
                className="px-4 py-2 text-sm font-medium text-white bg-[#006B3F] hover:bg-[#008751] rounded-lg disabled:opacity-60 transition-colors"
              >
                {saving ? 'Saving...' : 'Save Review'}
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
