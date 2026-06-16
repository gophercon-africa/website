'use client';

import { useEffect, useState, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { StarRating } from '@/src/components/common/StarRating';
import { ArrowLeft, BookOpen, Award, Clock, List, Ban } from 'lucide-react';
import type { AdminSubmissionDetail, AdminReview } from '@/src/types/admin';

type Status = AdminSubmissionDetail['status'];

const STATUS_LABELS: Record<Status, string> = {
  pending: 'Pending',
  accepted: 'Accepted',
  rejected: 'Rejected',
};

export default function AdminSubmissionDetailPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const [submission, setSubmission] = useState<AdminSubmissionDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState<Status>('pending');
  const [decisionNotes, setDecisionNotes] = useState('');
  const [saving, setSaving] = useState(false);

  const id = params?.id;

  const load = useCallback(async () => {
    if (!id) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/submissions/${id}`);
      if (!res.ok) throw new Error('Failed to load submission');
      const data: AdminSubmissionDetail = await res.json();
      setSubmission(data);
      setStatus(data.status);
      setDecisionNotes(data.decisionNotes ?? '');
    } catch (error) {
      toast.error('Failed to load submission');
      console.error(error);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    load();
  }, [load]);

  async function saveDecision() {
    if (!id) return;
    setSaving(true);
    try {
      const res = await fetch(`/api/admin/submissions/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status, decisionNotes }),
      });
      if (!res.ok) throw new Error('Failed to save decision');
      toast.success('Decision saved');
      await load();
    } catch (error) {
      toast.error('Failed to save decision');
      console.error(error);
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <div className="min-h-[calc(100vh-80px)] flex items-center justify-center bg-gray-50">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-4 border-[#006B3F]/20 border-t-[#006B3F] rounded-full animate-spin" />
          <p className="text-gray-500 font-medium">Loading submission...</p>
        </div>
      </div>
    );
  }

  if (!submission) {
    return (
      <div className="min-h-[calc(100vh-80px)] flex items-center justify-center bg-gray-50 p-4">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center max-w-md w-full">
          <List className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Submission Not Found</h2>
          <button
            onClick={() => router.push('/admin')}
            className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-[#006B3F] hover:bg-[#006B3F]/5 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b border-gray-200">
        <div className="px-4 sm:px-6 py-3 max-w-6xl mx-auto">
          <button
            onClick={() => router.push('/admin')}
            className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-900 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to dashboard
          </button>
        </div>
      </div>

      <div className="max-w-6xl mx-auto p-4 sm:p-6 flex flex-col md:flex-row gap-6">
        <div className="flex-1 bg-white rounded-lg shadow-sm border border-gray-200 p-6 md:p-8">
          <h1 className="text-2xl font-bold text-gray-900 leading-tight mb-1">{submission.talkTitle}</h1>
          <p className="text-sm text-gray-500 mb-6">
            {submission.fullName} &lt;{submission.email}&gt; · {submission.company} · {submission.phone}
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
            <div className="bg-gray-50 rounded-lg p-3 border border-gray-100 flex items-start gap-3">
              <BookOpen className="w-5 h-5 text-[#006B3F] shrink-0 mt-0.5" />
              <div>
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-0.5">Category</p>
                <p className="text-sm font-medium text-gray-900">{submission.talkCategory}</p>
              </div>
            </div>
            <div className="bg-gray-50 rounded-lg p-3 border border-gray-100 flex items-start gap-3">
              <Award className="w-5 h-5 text-[#006B3F] shrink-0 mt-0.5" />
              <div>
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-0.5">Level</p>
                <p className="text-sm font-medium text-gray-900">{submission.talkLevel}</p>
              </div>
            </div>
            <div className="bg-gray-50 rounded-lg p-3 border border-gray-100 flex items-start gap-3">
              <Clock className="w-5 h-5 text-[#006B3F] shrink-0 mt-0.5" />
              <div>
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-0.5">Duration</p>
                <p className="text-sm font-medium text-gray-900">{submission.talkDuration}</p>
              </div>
            </div>
          </div>

          <div className="prose prose-sm sm:prose-base max-w-none text-gray-700 space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Description</h3>
              <div className="bg-gray-50 rounded-lg p-4 border border-gray-100 whitespace-pre-wrap">
                {submission.talkDescription}
              </div>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Speaker Bio</h3>
              <div className="bg-gray-50 rounded-lg p-4 border border-gray-100 whitespace-pre-wrap">
                {submission.bio}
              </div>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Previous Experience</h3>
              <div className="bg-gray-50 rounded-lg p-4 border border-gray-100 whitespace-pre-wrap">
                {submission.previousSpeakingExperience}
              </div>
            </div>
            {submission.additionalNotes && (
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Additional Notes</h3>
                <div className="bg-amber-50 rounded-lg p-4 border border-amber-100 whitespace-pre-wrap text-gray-700">
                  {submission.additionalNotes}
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="w-full md:w-96 shrink-0 flex flex-col gap-6">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-5">
            <h3 className="text-sm font-semibold text-gray-900 mb-3">
              Reviews ({submission.reviewCount}
              {submission.averageRating !== null ? `, avg ${submission.averageRating.toFixed(1)}` : ''})
            </h3>
            {submission.reviews.length === 0 ? (
              <p className="text-sm text-gray-500">No reviews yet.</p>
            ) : (
              <ul className="space-y-4">
                {submission.reviews.map((review: AdminReview) => (
                  <li key={review.id} className="border-b border-gray-100 pb-3 last:border-0 last:pb-0">
                    <p className="text-sm font-medium text-gray-900 mb-1">{review.reviewerEmail}</p>
                    {review.skipped ? (
                      <div className="flex items-center gap-1.5 text-xs text-gray-500">
                        <Ban className="w-3.5 h-3.5" />
                        Skipped{review.skipReason ? `: ${review.skipReason}` : ''}
                      </div>
                    ) : (
                      <StarRating value={review.rating ?? 0} name={`rating-${review.id}`} onChange={() => {}} readonly />
                    )}
                    {review.notes && (
                      <p className="text-sm text-gray-600 mt-2 whitespace-pre-wrap">{review.notes}</p>
                    )}
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-5">
            <h3 className="text-sm font-semibold text-gray-900 mb-3">Decision</h3>
            <div className="flex gap-2 mb-4">
              {(['pending', 'accepted', 'rejected'] as Status[]).map((s) => (
                <button
                  key={s}
                  onClick={() => setStatus(s)}
                  className={`flex-1 px-3 py-2 text-sm font-medium rounded-lg border transition-colors ${
                    status === s
                      ? 'bg-[#006B3F] text-white border-[#006B3F]'
                      : 'bg-white text-gray-600 border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  {STATUS_LABELS[s]}
                </button>
              ))}
            </div>
            <label htmlFor="decision-notes" className="block text-sm font-medium text-gray-700 mb-1">
              Decision Notes
            </label>
            <textarea
              id="decision-notes"
              value={decisionNotes}
              onChange={(e) => setDecisionNotes(e.target.value)}
              rows={4}
              placeholder="Optional notes about this decision..."
              className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm focus:border-[#006B3F] focus:ring-2 focus:ring-[#006B3F]/20 focus:outline-none transition-shadow bg-white resize-y mb-4"
            />
            <button
              onClick={saveDecision}
              disabled={saving}
              className="w-full flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-medium text-white bg-[#006B3F] hover:bg-[#008751] rounded-lg disabled:opacity-60 disabled:cursor-not-allowed transition-colors"
            >
              {saving ? 'Saving...' : 'Save Decision'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
