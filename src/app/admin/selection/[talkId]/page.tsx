'use client';

import { useEffect, useMemo, useRef, useState, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { toast } from 'sonner';
import {
  ArrowLeft,
  BookOpen,
  Award,
  Clock,
  List,
  Keyboard,
  ExternalLink,
} from 'lucide-react';
import { ReviewsPanel } from '@/src/app/admin/_components/ReviewsPanel';
import { DecisionPanel } from '@/src/app/admin/_components/DecisionPanel';
import { STATUS_LABELS, STATUS_BADGE_CLASSES } from '@/src/app/admin/_components/statusBadges';
import { SelectionSidebar, type SelectionFilter } from '../_components/SelectionSidebar';
import { sortForSelection } from '../sortForSelection';
import { TALK_STATUSES, type TalkStatus } from '@/src/lib/talkStatus';
import type { AdminSubmission, AdminSubmissionDetail } from '@/src/types/admin';

// Keys that pick a decision status (committed with Enter).
const STATUS_HOTKEYS: Record<string, TalkStatus> = {
  a: 'accepted',
  r: 'rejected',
  s: 'shortlisted',
  w: 'waitlisted',
  p: 'pending',
};

export default function SelectionWorkspacePage() {
  const params = useParams<{ talkId: string }>();
  const router = useRouter();
  const currentTalkId = params?.talkId;

  const [list, setList] = useState<AdminSubmission[]>([]);
  const [loading, setLoading] = useState(true);
  const [detail, setDetail] = useState<AdminSubmissionDetail | null>(null);
  const [detailLoading, setDetailLoading] = useState(false);
  const [filter, setFilter] = useState<SelectionFilter>('all');
  const [search, setSearch] = useState('');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [status, setStatus] = useState<TalkStatus>('pending');
  const [decisionNotes, setDecisionNotes] = useState('');
  const [saving, setSaving] = useState(false);

  const detailCache = useRef(new Map<string, AdminSubmissionDetail>());
  const notesRef = useRef<HTMLTextAreaElement>(null);
  const searchRef = useRef<HTMLInputElement>(null);
  const mainScrollRef = useRef<HTMLDivElement>(null);

  const sortedTalks = useMemo(() => sortForSelection(list), [list]);

  const filteredTalks = useMemo(() => {
    const query = search.trim().toLowerCase();
    return sortedTalks.filter((t) => {
      if (filter !== 'all' && t.status !== filter) return false;
      if (!query) return true;
      return (
        t.fullName.toLowerCase().includes(query) ||
        t.email.toLowerCase().includes(query) ||
        t.talkTitle.toLowerCase().includes(query)
      );
    });
  }, [sortedTalks, filter, search]);

  const counts = useMemo(() => {
    const result = { all: sortedTalks.length } as Record<SelectionFilter, number>;
    for (const s of TALK_STATUSES) {
      result[s] = sortedTalks.filter((t) => t.status === s).length;
    }
    return result;
  }, [sortedTalks]);

  const triagedCount = sortedTalks.length - counts.pending;
  const triagedPercentage =
    sortedTalks.length > 0 ? Math.round((triagedCount / sortedTalks.length) * 100) : 0;

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch('/api/admin/submissions');
        if (!res.ok) throw new Error('Failed to load submissions');
        setList(await res.json());
      } catch (error) {
        toast.error('Failed to load submissions');
        console.error(error);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  // Cap the shared <body> to viewport height while the workspace is mounted so
  // the main column and sidebar list scroll independently instead of the window.
  useEffect(() => {
    document.body.classList.add('review-workspace-lock');
    return () => document.body.classList.remove('review-workspace-lock');
  }, []);

  useEffect(() => {
    const storedCollapsed = localStorage.getItem('selection-sidebar-collapsed');
    if (storedCollapsed !== null) setSidebarCollapsed(storedCollapsed === 'true');
    const storedFilter = localStorage.getItem('selection-filter');
    if (storedFilter && (storedFilter === 'all' || (TALK_STATUSES as readonly string[]).includes(storedFilter))) {
      setFilter(storedFilter as SelectionFilter);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('selection-sidebar-collapsed', String(sidebarCollapsed));
  }, [sidebarCollapsed]);

  useEffect(() => {
    localStorage.setItem('selection-filter', filter);
  }, [filter]);

  // Load the current talk's detail (cache hits render instantly) and reset the
  // main column to the top; the sidebar keeps its scroll position on purpose.
  useEffect(() => {
    if (!currentTalkId) return;
    let cancelled = false;

    const cached = detailCache.current.get(currentTalkId);
    if (cached) {
      setDetail(cached);
      setStatus(cached.status);
      setDecisionNotes(cached.decisionNotes ?? '');
      // A cancelled in-flight fetch skips its finally, so clear here too.
      setDetailLoading(false);
    } else {
      setDetailLoading(true);
      (async () => {
        try {
          const res = await fetch(`/api/admin/submissions/${currentTalkId}`);
          if (!res.ok) throw new Error('Failed to load submission');
          const data: AdminSubmissionDetail = await res.json();
          if (cancelled) return;
          detailCache.current.set(currentTalkId, data);
          setDetail(data);
          setStatus(data.status);
          setDecisionNotes(data.decisionNotes ?? '');
        } catch (error) {
          if (!cancelled) {
            toast.error('Failed to load submission');
            console.error(error);
            setDetail(null);
          }
        } finally {
          if (!cancelled) setDetailLoading(false);
        }
      })();
    }
    mainScrollRef.current?.scrollTo({ top: 0 });

    return () => {
      cancelled = true;
    };
  }, [currentTalkId]);

  const navigateToTalk = useCallback(
    (id: string) => {
      router.push(`/admin/selection/${id}`);
    },
    [router]
  );

  const saveDecision = useCallback(async () => {
    // detail.id must match the route: right after save-&-next the previous
    // talk's state lingers while the new talk's fetch is in flight, and a
    // quick second Enter would write it onto the new talk.
    if (!currentTalkId || !detail || detail.id !== currentTalkId) return;

    // Compute "next" from the pre-save order: the talk may leave the active
    // filter once its status changes.
    const preSaveIndex = filteredTalks.findIndex((t) => t.id === currentTalkId);
    const next = preSaveIndex >= 0 ? filteredTalks[preSaveIndex + 1] : undefined;

    setSaving(true);
    try {
      const res = await fetch(`/api/admin/submissions/${currentTalkId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status, decisionNotes }),
      });
      if (!res.ok) throw new Error('Failed to save decision');

      toast.success(`Saved: ${STATUS_LABELS[status]}`);

      const updatedDetail = { ...detail, status, decisionNotes };
      detailCache.current.set(currentTalkId, updatedDetail);
      setDetail(updatedDetail);
      setList((prev) => prev.map((t) => (t.id === currentTalkId ? { ...t, status } : t)));

      if (next) {
        navigateToTalk(next.id);
      } else {
        toast('End of list — pick a talk from the sidebar.');
      }
    } catch (error) {
      toast.error('Failed to save decision');
      console.error(error);
    } finally {
      setSaving(false);
    }
  }, [currentTalkId, detail, status, decisionNotes, filteredTalks, navigateToTalk]);

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      // Leave browser shortcuts alone — Cmd+A must select text, not accept.
      if (e.metaKey || e.ctrlKey || e.altKey) return;

      const activeTag = document.activeElement?.tagName;
      const isInputFocused = activeTag === 'TEXTAREA' || activeTag === 'INPUT';

      if (isInputFocused) {
        if (e.key === 'Escape') {
          (document.activeElement as HTMLElement).blur();
        }
        return;
      }

      const hotkeyStatus = STATUS_HOTKEYS[e.key];
      if (hotkeyStatus) {
        e.preventDefault();
        setStatus(hotkeyStatus);
        return;
      }

      switch (e.key) {
        case 'Enter':
          e.preventDefault();
          if (!saving) saveDecision();
          break;
        case 'n':
          e.preventDefault();
          notesRef.current?.focus();
          break;
        case '/':
          e.preventDefault();
          searchRef.current?.focus();
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
  }, [currentTalkId, filteredTalks, saving, saveDecision, navigateToTalk]);

  if (loading) {
    return (
      <div className="min-h-[calc(100vh-80px)] flex items-center justify-center bg-gray-50 dark:bg-gray-950">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-4 border-brand/20 border-t-brand rounded-full animate-spin" />
          <p className="text-gray-500 dark:text-gray-400 font-medium">Loading selection workspace...</p>
        </div>
      </div>
    );
  }

  const currentInList = sortedTalks.find((t) => t.id === currentTalkId);

  if (sortedTalks.length === 0 || !currentInList) {
    return (
      <div className="min-h-[calc(100vh-80px)] flex items-center justify-center bg-gray-50 dark:bg-gray-950 p-4">
        <div className="bg-white dark:bg-gray-900 rounded-lg shadow-sm border border-gray-200 dark:border-gray-800 p-8 text-center max-w-md w-full">
          <List className="w-12 h-12 text-gray-400 dark:text-gray-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
            {sortedTalks.length === 0 ? 'No Submissions' : 'Talk Not Found'}
          </h2>
          <p className="text-gray-500 dark:text-gray-400 mb-4">
            {sortedTalks.length === 0
              ? 'There are no submissions for this year’s selection.'
              : 'The requested talk could not be found.'}
          </p>
          <button
            onClick={() => router.push('/admin')}
            className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-brand dark:text-emerald-400 hover:bg-brand/5 dark:hover:bg-emerald-500/10 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 min-h-0 flex flex-col bg-gray-50 dark:bg-gray-950 overflow-hidden">
      <div className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 shrink-0">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between px-4 sm:px-6 py-3 gap-3">
          <div className="flex items-center gap-4 sm:gap-6 flex-1 w-full">
            <button
              onClick={() => router.push('/admin')}
              className="inline-flex items-center gap-1.5 text-sm text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 transition-colors shrink-0"
            >
              <ArrowLeft className="w-4 h-4" />
              <span className="hidden sm:inline">Dashboard</span>
            </button>

            <div className="flex-1 max-w-xl sm:pl-6 sm:border-l border-gray-200 dark:border-gray-800">
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm font-semibold text-gray-900 dark:text-gray-100">Selection Progress</span>
                <span className="text-sm text-gray-500 dark:text-gray-400 font-medium">
                  {triagedCount} / {sortedTalks.length} triaged ({triagedPercentage}%)
                </span>
              </div>
              <div className="w-full bg-gray-100 dark:bg-gray-800 rounded-full h-2 overflow-hidden">
                <div
                  className="bg-brand h-2 rounded-full transition-all duration-500 ease-out"
                  style={{ width: `${triagedPercentage}%` }}
                />
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <Link
              href={`/admin/submissions/${currentInList.id}`}
              className="inline-flex items-center gap-1.5 text-xs font-medium text-brand dark:text-emerald-400 hover:underline"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span>Full submission</span>
            </Link>

            <div className="hidden lg:flex items-center gap-4 text-xs text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-gray-800 px-3 py-2 rounded-md border border-gray-100 dark:border-gray-700">
              <Keyboard className="w-4 h-4" />
              <div className="flex gap-3">
                <span title="Navigate up/down">
                  <kbd className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded px-1 font-mono">↑↓</kbd>{' '}
                  Nav
                </span>
                <span title="Accept / Reject / Shortlist / Waitlist / Pending">
                  <kbd className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded px-1 font-mono">a r s w p</kbd>{' '}
                  Status
                </span>
                <span title="Focus decision notes">
                  <kbd className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded px-1 font-mono">n</kbd>{' '}
                  Notes
                </span>
                <span title="Save and next">
                  <kbd className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded px-1 font-mono">↵</kbd>{' '}
                  Save
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex-1 flex flex-col sm:flex-row overflow-hidden min-h-0">
        <div ref={mainScrollRef} className="flex-1 overflow-y-auto bg-white dark:bg-gray-900 flex flex-col relative min-w-0">
          {detailLoading || !detail ? (
            <div className="flex-1 flex items-center justify-center">
              <div className="w-8 h-8 border-4 border-brand/20 border-t-brand rounded-full animate-spin" />
            </div>
          ) : (
            <div className={`flex-1 flex flex-col mx-auto w-full ${sidebarCollapsed ? 'max-w-5xl' : 'max-w-4xl'}`}>
              <div className="p-6 md:p-8 flex-1">
                <div className="mb-6">
                  <div className="flex items-start justify-between gap-4">
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 leading-tight">
                      {detail.talkTitle}
                    </h1>
                    <span className={`inline-block px-2 py-0.5 rounded text-xs font-medium border shrink-0 mt-1.5 ${STATUS_BADGE_CLASSES[detail.status]}`}>
                      {STATUS_LABELS[detail.status]}
                    </span>
                  </div>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                    {detail.fullName} &lt;{detail.email}&gt; · {detail.company}
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
                  <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-3 border border-gray-100 dark:border-gray-700 flex items-start gap-3">
                    <BookOpen className="w-5 h-5 text-brand shrink-0 mt-0.5" />
                    <div>
                      <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-0.5">Category</p>
                      <p className="text-sm font-medium text-gray-900 dark:text-gray-100">{detail.talkCategory}</p>
                    </div>
                  </div>
                  <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-3 border border-gray-100 dark:border-gray-700 flex items-start gap-3">
                    <Award className="w-5 h-5 text-brand shrink-0 mt-0.5" />
                    <div>
                      <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-0.5">Level</p>
                      <p className="text-sm font-medium text-gray-900 dark:text-gray-100">{detail.talkLevel}</p>
                    </div>
                  </div>
                  <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-3 border border-gray-100 dark:border-gray-700 flex items-start gap-3">
                    <Clock className="w-5 h-5 text-brand shrink-0 mt-0.5" />
                    <div>
                      <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-0.5">Duration</p>
                      <p className="text-sm font-medium text-gray-900 dark:text-gray-100">{detail.talkDuration}</p>
                    </div>
                  </div>
                </div>

                <div className="prose prose-sm sm:prose-base max-w-none text-gray-700 dark:text-gray-300 mb-8 space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">Description</h3>
                    <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 border border-gray-100 dark:border-gray-700 whitespace-pre-wrap">
                      {detail.talkDescription}
                    </div>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">Speaker Bio</h3>
                    <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 border border-gray-100 dark:border-gray-700 whitespace-pre-wrap">
                      {detail.bio}
                    </div>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">Previous Experience</h3>
                    <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 border border-gray-100 dark:border-gray-700 whitespace-pre-wrap">
                      {detail.previousSpeakingExperience}
                    </div>
                  </div>
                  {detail.additionalNotes && (
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">Additional Notes</h3>
                      <div className="bg-amber-50 dark:bg-amber-950/40 rounded-lg p-4 border border-amber-100 dark:border-amber-900/50 whitespace-pre-wrap text-gray-700 dark:text-amber-100/90">
                        {detail.additionalNotes}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div className="bg-gray-50 dark:bg-gray-950/60 border-t border-gray-200 dark:border-gray-800 p-6 md:p-8 shrink-0">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
                  <ReviewsPanel
                    reviews={detail.reviews}
                    reviewCount={detail.reviewCount}
                    averageRating={detail.averageRating}
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
                      saveLabel="Save & Next"
                      notesRef={notesRef}
                    />
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        <SelectionSidebar
          talks={filteredTalks}
          counts={counts}
          filter={filter}
          onFilterChange={setFilter}
          search={search}
          onSearchChange={setSearch}
          searchRef={searchRef}
          currentTalkId={currentTalkId}
          onNavigate={navigateToTalk}
          collapsed={sidebarCollapsed}
          onToggleCollapsed={() => setSidebarCollapsed((c) => !c)}
        />
      </div>
    </div>
  );
}
