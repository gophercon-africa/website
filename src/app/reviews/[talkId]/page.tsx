'use client';

import { useEffect, useState, useRef, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { StarRating } from '@/src/components/common/StarRating';
import {
  Star,
  Circle,
  Clock,
  BookOpen,
  Award,
  ChevronRight,
  ArrowLeft,
  List,
  Keyboard,
  SkipForward,
  Ban,
} from 'lucide-react';

interface Talk {
  id: string;
  talkTitle: string;
  talkDescription: string;
  talkCategory: string;
  talkLevel: string;
  talkDuration: string;
  bio: string;
  previousSpeakingExperience: string;
  additionalNotes: string;
  reviews: Array<{
    id: string;
    rating: number | null;
    notes: string;
    skipped: boolean;
  }>;
}

type FilterType = 'all' | 'reviewed' | 'pending' | 'skipped';

export default function ReviewWorkspacePage() {
  const params = useParams<{ talkId: string }>();
  const router = useRouter();

  const [talks, setTalks] = useState<Talk[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<FilterType>('all');
  const [rating, setRating] = useState(0);
  const [notes, setNotes] = useState('');
  const [saving, setSaving] = useState(false);

  const notesTextareaRef = useRef<HTMLTextAreaElement>(null);

  const currentTalkId = params?.talkId;

  const reviewedTalks = talks.filter((t) => t.reviews.length > 0 && !t.reviews[0].skipped);
  const skippedTalks = talks.filter((t) => t.reviews.length > 0 && t.reviews[0].skipped);
  const pendingTalks = talks.filter((t) => t.reviews.length === 0);

  const filteredTalks =
    filter === 'all'
      ? talks
      : filter === 'reviewed'
        ? reviewedTalks
        : filter === 'skipped'
          ? skippedTalks
          : pendingTalks;

  const currentTalk = talks.find((t) => t.id === currentTalkId) || null;
  const progressPercentage =
    talks.length > 0 ? Math.round(((reviewedTalks.length + skippedTalks.length) / talks.length) * 100) : 0;

  useEffect(() => {
    loadTalks();
  }, []);

  useEffect(() => {
    if (!currentTalk) return;
    const existing = currentTalk.reviews[0];
    setRating(existing?.rating || 0);
    setNotes(existing?.notes || '');
  }, [currentTalk]);

  async function loadTalks() {
    try {
      const res = await fetch('/api/reviews');
      if (!res.ok) throw new Error('Failed to load submissions');
      const data: Talk[] = await res.json();
      setTalks(data);
    } catch (error) {
      toast.error('Failed to load submissions');
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  const navigateToTalk = useCallback(
    (id: string) => {
      router.push(`/reviews/${id}`);
    },
    [router]
  );

  const findNextUnreviewed = useCallback(
    (currentTalksState: Talk[]) => {
      return currentTalksState.find(
        (t) => t.reviews.length === 0 && t.id !== currentTalkId
      );
    },
    [currentTalkId]
  );

  const isCurrentTalkSkipped = currentTalk?.reviews[0]?.skipped ?? false;

  const handleSkip = useCallback(() => {
    const next = findNextUnreviewed(talks);
    if (next) {
      navigateToTalk(next.id);
    } else {
      toast.success('All talks reviewed!');
      router.push('/reviews');
    }
  }, [findNextUnreviewed, talks, navigateToTalk, router]);

  const handlePermanentSkip = useCallback(async () => {
    if (!currentTalk) return;

    setSaving(true);
    try {
      const res = await fetch('/api/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          talkId: currentTalk.id,
          skipped: true,
          notes,
        }),
      });

      if (!res.ok) throw new Error('Failed to save skip');

      toast.success('Talk permanently skipped');

      const updatedTalks = talks.map((t) => {
        if (t.id === currentTalk.id) {
          return {
            ...t,
            reviews: [{ id: 'temp-' + Date.now(), rating: null, notes, skipped: true }],
          };
        }
        return t;
      });

      setTalks(updatedTalks);

      const next = updatedTalks.find(
        (t) => t.reviews.length === 0 && t.id !== currentTalk.id
      );
      if (next) {
        navigateToTalk(next.id);
      } else {
        toast.success('All talks reviewed!');
        router.push('/reviews');
      }
    } catch (error) {
      toast.error('Failed to skip talk');
      console.error(error);
    } finally {
      setSaving(false);
    }
  }, [currentTalk, notes, talks, navigateToTalk, router]);

  const saveReview = useCallback(async () => {
    if (!currentTalk || rating === 0 || isCurrentTalkSkipped) {
      if (!isCurrentTalkSkipped) toast.error('Please select a rating');
      return;
    }

    setSaving(true);
    try {
      const res = await fetch('/api/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          talkId: currentTalk.id,
          rating,
          notes,
        }),
      });

      if (!res.ok) throw new Error('Failed to save review');

      toast.success('Review saved');

      const updatedTalks = talks.map((t) => {
        if (t.id === currentTalk.id) {
          return {
            ...t,
            reviews: [{ id: 'temp-' + Date.now(), rating, notes, skipped: false }],
          };
        }
        return t;
      });

      setTalks(updatedTalks);

      const next = updatedTalks.find(
        (t) => t.reviews.length === 0 && t.id !== currentTalk.id
      );
      if (next) {
        navigateToTalk(next.id);
      } else {
        toast.success('All talks reviewed!');
        router.push('/reviews');
      }
    } catch (error) {
      toast.error('Failed to save review');
      console.error(error);
    } finally {
      setSaving(false);
    }
  }, [currentTalk, rating, notes, talks, navigateToTalk, router]);

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      const activeTag = document.activeElement?.tagName;
      const isInputFocused = activeTag === 'TEXTAREA' || activeTag === 'INPUT';

      if (isInputFocused) {
        if (e.key === 'Escape') {
          (document.activeElement as HTMLElement).blur();
        }
        return;
      }

      switch (e.key) {
        case 's':
          if (isCurrentTalkSkipped) return;
          e.preventDefault();
          notesTextareaRef.current?.focus();
          break;
        case 'Enter':
          e.preventDefault();
          if (!saving && !isCurrentTalkSkipped) saveReview();
          break;
        case '1':
        case '2':
        case '3':
        case '4':
        case '5':
          if (isCurrentTalkSkipped) return;
          e.preventDefault();
          setRating(parseInt(e.key, 10));
          break;
        case 'ArrowUp':
        case 'k': {
          e.preventDefault();
          if (filteredTalks.length === 0) return;
          const idx = filteredTalks.findIndex((t) => t.id === currentTalkId);
          if (idx > 0) navigateToTalk(filteredTalks[idx - 1].id);
          break;
        }
        case 'ArrowDown':
        case 'j': {
          e.preventDefault();
          if (filteredTalks.length === 0) return;
          const idx = filteredTalks.findIndex((t) => t.id === currentTalkId);
          if (idx < filteredTalks.length - 1) navigateToTalk(filteredTalks[idx + 1].id);
          break;
        }
      }
    }

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentTalkId, filteredTalks, saving, saveReview, navigateToTalk, isCurrentTalkSkipped]);

  if (loading) {
    return (
      <div className="min-h-[calc(100vh-80px)] flex items-center justify-center bg-gray-50">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-4 border-[#006B3F]/20 border-t-[#006B3F] rounded-full animate-spin" />
          <p className="text-gray-500 font-medium">Loading workspace...</p>
        </div>
      </div>
    );
  }

  if (talks.length === 0 || !currentTalk) {
    return (
      <div className="min-h-[calc(100vh-80px)] flex items-center justify-center bg-gray-50 p-4">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center max-w-md w-full">
          <List className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            {talks.length === 0 ? 'No Submissions Yet' : 'Talk Not Found'}
          </h2>
          <p className="text-gray-500 mb-4">
            {talks.length === 0
              ? 'There are no talks available to review at this time.'
              : 'The requested talk could not be found.'}
          </p>
          <button
            onClick={() => router.push('/reviews')}
            className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-[#006B3F] hover:bg-[#006B3F]/5 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to submissions
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="h-[calc(100vh-80px)] min-h-[600px] flex flex-col bg-gray-50 overflow-hidden">

      <div className="bg-white border-b border-gray-200 shrink-0">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between px-4 sm:px-6 py-3 gap-3">
          <div className="flex items-center gap-4 flex-1 w-full">
            <button
              onClick={() => router.push('/reviews')}
              className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-900 transition-colors shrink-0"
            >
              <ArrowLeft className="w-4 h-4" />
              <span className="hidden sm:inline">All submissions</span>
            </button>

            <div className="flex-1 max-w-md">
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm font-semibold text-gray-900">Review Progress</span>
                <span className="text-sm text-gray-500 font-medium">
                  {reviewedTalks.length + skippedTalks.length} / {talks.length} ({progressPercentage}%)
                </span>
              </div>
              <div className="w-full bg-gray-100 rounded-full h-2 overflow-hidden">
                <div
                  className="bg-[#006B3F] h-2 rounded-full transition-all duration-500 ease-out"
                  style={{ width: `${progressPercentage}%` }}
                />
              </div>
            </div>
          </div>

          <div className="hidden lg:flex items-center gap-4 text-xs text-gray-500 bg-gray-50 px-3 py-2 rounded-md border border-gray-100">
            <Keyboard className="w-4 h-4" />
            <div className="flex gap-3">
              <span title="Navigate up/down">
                <kbd className="bg-white border border-gray-200 rounded px-1 font-mono">
                  ↑↓
                </kbd>{' '}
                Nav
              </span>
              <span title="Set rating">
                <kbd className="bg-white border border-gray-200 rounded px-1 font-mono">
                  1-5
                </kbd>{' '}
                Rate
              </span>
              <span title="Focus notes">
                <kbd className="bg-white border border-gray-200 rounded px-1 font-mono">s</kbd>{' '}
                Notes
              </span>
              <span title="Save and Next">
                <kbd className="bg-white border border-gray-200 rounded px-1 font-mono">
                  ↵
                </kbd>{' '}
                Save
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
        <div className="flex-1 overflow-y-auto bg-white flex flex-col relative">
          <div className="flex-1 flex flex-col max-w-4xl mx-auto w-full">
            <div className="p-6 md:p-8 flex-1">
              <div className="mb-6">
                <h1 className="text-2xl font-bold text-gray-900 leading-tight">
                  {currentTalk.talkTitle}
                </h1>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
                <div className="bg-gray-50 rounded-lg p-3 border border-gray-100 flex items-start gap-3">
                  <BookOpen className="w-5 h-5 text-[#006B3F] shrink-0 mt-0.5" />
                  <div>
                    <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-0.5">
                      Category
                    </p>
                    <p className="text-sm font-medium text-gray-900">
                      {currentTalk.talkCategory}
                    </p>
                  </div>
                </div>
                <div className="bg-gray-50 rounded-lg p-3 border border-gray-100 flex items-start gap-3">
                  <Award className="w-5 h-5 text-[#006B3F] shrink-0 mt-0.5" />
                  <div>
                    <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-0.5">
                      Level
                    </p>
                    <p className="text-sm font-medium text-gray-900">
                      {currentTalk.talkLevel}
                    </p>
                  </div>
                </div>
                <div className="bg-gray-50 rounded-lg p-3 border border-gray-100 flex items-start gap-3">
                  <Clock className="w-5 h-5 text-[#006B3F] shrink-0 mt-0.5" />
                  <div>
                    <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-0.5">
                      Duration
                    </p>
                    <p className="text-sm font-medium text-gray-900">
                      {currentTalk.talkDuration}
                    </p>
                  </div>
                </div>
              </div>

              <div className="prose prose-sm sm:prose-base max-w-none text-gray-700 mb-8 space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Description</h3>
                  <div className="bg-gray-50 rounded-lg p-4 border border-gray-100 whitespace-pre-wrap">
                    {currentTalk.talkDescription}
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Speaker Bio</h3>
                  <div className="bg-gray-50 rounded-lg p-4 border border-gray-100 whitespace-pre-wrap">
                    {currentTalk.bio}
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    Previous Experience
                  </h3>
                  <div className="bg-gray-50 rounded-lg p-4 border border-gray-100 whitespace-pre-wrap">
                    {currentTalk.previousSpeakingExperience}
                  </div>
                </div>

                {currentTalk.additionalNotes && (
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      Additional Notes
                    </h3>
                    <div className="bg-amber-50 rounded-lg p-4 border border-amber-100 whitespace-pre-wrap text-gray-700">
                      {currentTalk.additionalNotes}
                    </div>
                  </div>
                )}
              </div>
            </div>


            <div className="bg-gray-50 border-t border-gray-200 p-6 md:p-8 shrink-0">
              <div className={`mb-6 ${isCurrentTalkSkipped ? 'opacity-50 pointer-events-none' : ''}`}>
                <StarRating
                  value={rating}
                  name="rating"
                  onChange={setRating}
                  label="Your Rating"
                  required
                />
              </div>

              <div className="mb-6">
                <label
                  htmlFor="notes-textarea"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Review Notes{' '}
                  <span className="text-gray-400 font-normal">
                    (Private, visible to committee)
                  </span>
                </label>
                <textarea
                  id="notes-textarea"
                  ref={notesTextareaRef}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  rows={3}
                  disabled={isCurrentTalkSkipped}
                  className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm focus:border-[#006B3F] focus:ring-2 focus:ring-[#006B3F]/20 focus:outline-none transition-shadow bg-white resize-y disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-gray-50"
                  placeholder={isCurrentTalkSkipped ? 'This talk has been permanently skipped' : "Add your thoughts here... (Press 's' to focus)"}
                />
              </div>

              <div className="flex flex-col-reverse sm:flex-row items-center justify-between gap-4">
                <div className="flex gap-2 w-full sm:w-auto">
                  <button
                    onClick={handleSkip}
                    className="flex-1 sm:flex-none px-4 py-2.5 text-sm font-medium text-gray-600 bg-white border border-gray-300 hover:bg-gray-50 hover:text-gray-900 rounded-lg transition-colors focus:ring-2 focus:ring-[#006B3F] focus:outline-none"
                  >
                    Skip for now
                  </button>
                  <button
                    onClick={handlePermanentSkip}
                    disabled={saving || isCurrentTalkSkipped}
                    className="flex-1 sm:flex-none inline-flex items-center justify-center gap-1.5 px-4 py-2.5 text-sm font-medium text-orange-700 bg-orange-50 border border-orange-200 hover:bg-orange-100 rounded-lg disabled:opacity-60 disabled:cursor-not-allowed transition-colors focus:ring-2 focus:ring-orange-400 focus:outline-none"
                  >
                    <SkipForward className="w-4 h-4" />
                    {isCurrentTalkSkipped ? 'Skipped' : 'Permanently Skip'}
                  </button>
                </div>
                <button
                  onClick={saveReview}
                  disabled={saving || rating === 0 || isCurrentTalkSkipped}
                  className="w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-2.5 text-sm font-medium text-white bg-[#006B3F] hover:bg-[#008751] rounded-lg disabled:opacity-60 disabled:cursor-not-allowed transition-colors focus:ring-2 focus:ring-[#006B3F] focus:ring-offset-2 focus:outline-none shadow-sm"
                >
                  {saving ? 'Saving...' : 'Save & Next'}
                  {!saving && <ChevronRight className="w-4 h-4" />}
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="w-full md:w-80 lg:w-96 shrink-0 bg-gray-50 border-t md:border-t-0 md:border-l border-gray-200 flex flex-col h-64 md:h-auto">
          <div className="flex items-center p-2 bg-gray-100/50 border-b border-gray-200 shrink-0">
            {(['all', 'pending', 'reviewed', 'skipped'] as FilterType[]).map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`flex-1 py-2 text-xs font-semibold rounded-md capitalize transition-all ${
                  filter === f
                    ? 'bg-white text-gray-900 shadow-sm ring-1 ring-gray-200'
                    : 'text-gray-500 hover:text-gray-700 hover:bg-gray-200/50'
                }`}
              >
                {f} (
                {f === 'all'
                  ? talks.length
                  : f === 'pending'
                    ? pendingTalks.length
                    : f === 'skipped'
                      ? skippedTalks.length
                      : reviewedTalks.length}
                )
              </button>
            ))}
          </div>


          <div className="flex-1 overflow-y-auto p-2 space-y-1">
            {filteredTalks.length === 0 ? (
              <div className="p-8 text-center text-sm text-gray-500">
                No talks found in this category.
              </div>
            ) : (
              filteredTalks.map((talk) => {
                const isSelected = talk.id === currentTalkId;
                const review = talk.reviews[0];
                const isReviewed = !!review && !review.skipped;
                const isSkipped = !!review && review.skipped;

                return (
                  <button
                    key={talk.id}
                    onClick={() => navigateToTalk(talk.id)}
                    className={`w-full text-left p-3 rounded-lg border transition-all ${
                      isSelected
                        ? 'bg-[#006B3F]/5 border-[#006B3F]/20 ring-1 ring-[#006B3F]/20'
                        : 'bg-white border-transparent hover:border-gray-200 hover:shadow-sm'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3 mb-1">
                      <h4
                        className={`text-sm font-semibold line-clamp-2 leading-snug ${
                          isSelected ? 'text-[#006B3F]' : 'text-gray-900'
                        }`}
                      >
                        {talk.talkTitle}
                      </h4>
                      {isSkipped ? (
                        <div className="flex items-center gap-1 bg-gray-50 text-gray-500 px-1.5 py-0.5 rounded text-xs font-bold border border-gray-200 shrink-0">
                          <Ban className="w-3 h-3" />
                          <span>Skipped</span>
                        </div>
                      ) : isReviewed ? (
                        <div className="flex items-center gap-1 bg-green-50 text-green-700 px-1.5 py-0.5 rounded text-xs font-bold border border-green-100 shrink-0">
                          <Star className="w-3 h-3 fill-current" />
                          <span>{review.rating?.toFixed(1)}</span>
                        </div>
                      ) : (
                        <Circle className="w-2.5 h-2.5 text-yellow-500 fill-yellow-500 mt-1 shrink-0" />
                      )}
                    </div>
                    <div className="flex items-center justify-between">
                      {isSelected && (
                        <span className="text-[10px] font-bold uppercase text-[#006B3F] tracking-wider shrink-0">
                          Selected
                        </span>
                      )}
                    </div>
                  </button>
                );
              })
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
