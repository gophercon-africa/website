'use client';

import { useEffect, useState, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { ArrowLeft, BookOpen, Award, Clock, List } from 'lucide-react';
import { ReviewsPanel } from '@/src/app/admin/_components/ReviewsPanel';
import { DecisionPanel } from '@/src/app/admin/_components/DecisionPanel';
import { TALK_CATEGORIES } from '@/src/lib/talkCategories';
import type { AdminSubmissionDetail } from '@/src/types/admin';

type Status = AdminSubmissionDetail['status'];

export default function AdminSubmissionDetailPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const [submission, setSubmission] = useState<AdminSubmissionDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState<Status>('pending');
  const [decisionNotes, setDecisionNotes] = useState('');
  const [saving, setSaving] = useState(false);
  const [changingCategory, setChangingCategory] = useState(false);

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

  async function changeCategory(talkCategory: string) {
    if (!id || !submission || talkCategory === submission.talkCategory) return;
    setChangingCategory(true);
    try {
      const res = await fetch(`/api/admin/submissions/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ talkCategory }),
      });
      if (!res.ok) throw new Error('Failed to change category');
      setSubmission({ ...submission, talkCategory });
      toast.success(`Category changed to ${talkCategory}`);
    } catch (error) {
      toast.error('Failed to change category');
      console.error(error);
    } finally {
      setChangingCategory(false);
    }
  }

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
      <div className="min-h-[calc(100vh-80px)] flex items-center justify-center bg-gray-50 dark:bg-gray-950">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-4 border-[#006B3F]/20 border-t-[#006B3F] rounded-full animate-spin" />
          <p className="text-gray-500 dark:text-gray-400 font-medium">Loading submission...</p>
        </div>
      </div>
    );
  }

  if (!submission) {
    return (
      <div className="min-h-[calc(100vh-80px)] flex items-center justify-center bg-gray-50 dark:bg-gray-950 p-4">
        <div className="bg-white dark:bg-gray-900 rounded-lg shadow-sm border border-gray-200 dark:border-gray-800 p-8 text-center max-w-md w-full">
          <List className="w-12 h-12 text-gray-400 dark:text-gray-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">Submission Not Found</h2>
          <button
            onClick={() => router.push('/admin')}
            className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-[#006B3F] dark:text-emerald-400 hover:bg-[#006B3F]/5 dark:hover:bg-emerald-500/10 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      <div className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800">
        <div className="px-4 sm:px-6 py-3 max-w-6xl mx-auto">
          <button
            onClick={() => router.push('/admin')}
            className="inline-flex items-center gap-1.5 text-sm text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to dashboard
          </button>
        </div>
      </div>

      <div className="max-w-6xl mx-auto p-4 sm:p-6 flex flex-col md:flex-row gap-6">
        <div className="flex-1 bg-white dark:bg-gray-900 rounded-lg shadow-sm border border-gray-200 dark:border-gray-800 p-6 md:p-8">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 leading-tight mb-1">{submission.talkTitle}</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
            {submission.fullName} &lt;{submission.email}&gt; · {submission.company} · {submission.phone}
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
            <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-3 border border-gray-100 dark:border-gray-700 flex items-start gap-3">
              <BookOpen className="w-5 h-5 text-[#006B3F] shrink-0 mt-0.5" />
              <div>
                <label
                  htmlFor="talk-category"
                  className="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-0.5"
                >
                  Category
                </label>
                <select
                  id="talk-category"
                  value={submission.talkCategory}
                  onChange={(e) => changeCategory(e.target.value)}
                  disabled={changingCategory}
                  className="w-full text-sm font-medium text-gray-900 dark:text-gray-100 bg-transparent border-0 p-0 pr-6 focus:ring-0 focus:outline-none cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {!(TALK_CATEGORIES as readonly string[]).includes(submission.talkCategory) && (
                    <option value={submission.talkCategory}>{submission.talkCategory || 'Uncategorized'}</option>
                  )}
                  {TALK_CATEGORIES.map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-3 border border-gray-100 dark:border-gray-700 flex items-start gap-3">
              <Award className="w-5 h-5 text-[#006B3F] shrink-0 mt-0.5" />
              <div>
                <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-0.5">Level</p>
                <p className="text-sm font-medium text-gray-900 dark:text-gray-100">{submission.talkLevel}</p>
              </div>
            </div>
            <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-3 border border-gray-100 dark:border-gray-700 flex items-start gap-3">
              <Clock className="w-5 h-5 text-[#006B3F] shrink-0 mt-0.5" />
              <div>
                <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-0.5">Duration</p>
                <p className="text-sm font-medium text-gray-900 dark:text-gray-100">{submission.talkDuration}</p>
              </div>
            </div>
          </div>

          <div className="prose prose-sm sm:prose-base max-w-none text-gray-700 dark:text-gray-300 space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">Description</h3>
              <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 border border-gray-100 dark:border-gray-700 whitespace-pre-wrap">
                {submission.talkDescription}
              </div>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">Speaker Bio</h3>
              <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 border border-gray-100 dark:border-gray-700 whitespace-pre-wrap">
                {submission.bio}
              </div>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">Previous Experience</h3>
              <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 border border-gray-100 dark:border-gray-700 whitespace-pre-wrap">
                {submission.previousSpeakingExperience}
              </div>
            </div>
            {submission.additionalNotes && (
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">Additional Notes</h3>
                <div className="bg-amber-50 dark:bg-amber-950/40 rounded-lg p-4 border border-amber-100 dark:border-amber-900/50 whitespace-pre-wrap text-gray-700 dark:text-amber-100/90">
                  {submission.additionalNotes}
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="w-full md:w-96 shrink-0 flex flex-col gap-6">
          <ReviewsPanel
            reviews={submission.reviews}
            reviewCount={submission.reviewCount}
            averageRating={submission.averageRating}
          />

          <div className="bg-white dark:bg-gray-900 rounded-lg shadow-sm border border-gray-200 dark:border-gray-800 p-5">
            <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100 mb-3">Decision</h3>
            <DecisionPanel
              status={status}
              onStatusChange={setStatus}
              decisionNotes={decisionNotes}
              onNotesChange={setDecisionNotes}
              onSave={saveDecision}
              saving={saving}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
