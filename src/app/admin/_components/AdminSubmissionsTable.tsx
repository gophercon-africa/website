'use client';

import { Fragment, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { Download } from 'lucide-react';
import Modal from '@/src/components/common/Modal';
import { toCsv, downloadCsv } from '@/src/lib/csv';
import { STATUS_LABELS, STATUS_BADGE_CLASSES } from './statusBadges';
import { TALK_STATUSES, type TalkStatus } from '@/src/lib/talkStatus';
import { TALK_DURATION_LABELS } from '@/src/lib/talkOptions';
import type { AdminSubmission } from '@/src/types/admin';

type StatusFilter = 'all' | TalkStatus;

// Single registry for the column checkboxes, the table, and the CSV export —
// all three follow this order.
const COLUMNS: { key: string; label: string }[] = [
  { key: 'talkTitle', label: 'Title' },
  { key: 'fullName', label: 'Speaker' },
  { key: 'email', label: 'Email' },
  { key: 'talkCategory', label: 'Category' },
  { key: 'talkDuration', label: 'Duration' },
  { key: 'status', label: 'Status' },
  { key: 'averageRating', label: 'Avg Rating' },
  { key: 'reviewCount', label: 'Reviews' },
];

const DEFAULT_COLUMNS = new Set(COLUMNS.map((c) => c.key).filter((key) => key !== 'email'));

const UNCATEGORIZED = 'Uncategorized';

// Stored as raw minutes; show the friendly label when we have one.
function durationLabel(value: string) {
  return (TALK_DURATION_LABELS as Record<string, string>)[value] ?? value;
}

export function AdminSubmissionsTable({
  submissions,
  onChanged,
}: {
  submissions: AdminSubmission[];
  onChanged?: () => void;
}) {
  const router = useRouter();
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [groupByCategory, setGroupByCategory] = useState(false);
  const [ratingMin, setRatingMin] = useState('');
  const [ratingMax, setRatingMax] = useState('');
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [enabledColumns, setEnabledColumns] = useState<Set<string>>(new Set(DEFAULT_COLUMNS));
  const [duplicateModalSubmission, setDuplicateModalSubmission] = useState<AdminSubmission | null>(null);
  const [bulkStatus, setBulkStatus] = useState<TalkStatus>('shortlisted');
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [isApplying, setIsApplying] = useState(false);

  const categories = useMemo(() => {
    const names = new Set(submissions.map((s) => s.talkCategory.trim() || UNCATEGORIZED));
    return [...names].sort((a, b) => a.localeCompare(b));
  }, [submissions]);

  const filteredSubmissions = useMemo(() => {
    const query = search.trim().toLowerCase();
    const min = ratingMin.trim() === '' ? null : Number(ratingMin);
    const max = ratingMax.trim() === '' ? null : Number(ratingMax);
    const minValid = min !== null && !Number.isNaN(min);
    const maxValid = max !== null && !Number.isNaN(max);
    return submissions.filter((s) => {
      if (statusFilter !== 'all' && s.status !== statusFilter) return false;
      if (categoryFilter !== 'all' && (s.talkCategory.trim() || UNCATEGORIZED) !== categoryFilter) return false;
      if (minValid || maxValid) {
        // Any rating bound excludes talks with no average rating yet.
        if (s.averageRating === null) return false;
        if (minValid && s.averageRating < min) return false;
        if (maxValid && s.averageRating > max) return false;
      }
      if (!query) return true;
      return (
        s.fullName.toLowerCase().includes(query) ||
        s.email.toLowerCase().includes(query) ||
        s.talkTitle.toLowerCase().includes(query)
      );
    });
  }, [submissions, search, statusFilter, categoryFilter, ratingMin, ratingMax]);

  const groupedSubmissions = useMemo(() => {
    if (!groupByCategory) return [{ category: null, rows: filteredSubmissions }];
    const groups = new Map<string, AdminSubmission[]>();
    for (const s of filteredSubmissions) {
      const category = s.talkCategory.trim() || UNCATEGORIZED;
      const rows = groups.get(category);
      if (rows) rows.push(s);
      else groups.set(category, [s]);
    }
    return [...groups.entries()]
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([category, rows]) => ({ category, rows }));
  }, [filteredSubmissions, groupByCategory]);

  function updateSearch(value: string) {
    setSearch(value);
    setSelectedIds(new Set());
  }

  function updateStatusFilter(value: StatusFilter) {
    setStatusFilter(value);
    setSelectedIds(new Set());
  }

  function updateCategoryFilter(value: string) {
    setCategoryFilter(value);
    setSelectedIds(new Set());
  }

  function updateRatingMin(value: string) {
    setRatingMin(value);
    setSelectedIds(new Set());
  }

  function updateRatingMax(value: string) {
    setRatingMax(value);
    setSelectedIds(new Set());
  }

  function toggleRow(id: string) {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  function toggleSelectAllFiltered() {
    const filteredIds = filteredSubmissions.map((s) => s.id);
    const allSelected = filteredIds.every((id) => selectedIds.has(id));
    setSelectedIds(allSelected ? new Set() : new Set(filteredIds));
  }

  function toggleColumn(key: string) {
    setEnabledColumns((prev) => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });
  }

  const visibleColumns = COLUMNS.filter((c) => enabledColumns.has(c.key));

  function exportRows(rows: AdminSubmission[], filename: string) {
    const csvRows = rows.map((s) => ({
      talkTitle: s.talkTitle,
      fullName: s.fullName,
      email: s.email,
      talkCategory: s.talkCategory,
      talkDuration: durationLabel(s.talkDuration),
      status: STATUS_LABELS[s.status],
      averageRating: s.averageRating !== null ? s.averageRating.toFixed(1) : '',
      reviewCount: s.reviewCount,
    }));
    const csv = toCsv(csvRows, visibleColumns.map((c) => c.key));
    downloadCsv(filename, csv);
  }

  async function applyBulkStatus() {
    const ids = [...selectedIds];
    if (ids.length === 0) return;
    setIsApplying(true);
    try {
      const res = await fetch('/api/admin/submissions', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ids, status: bulkStatus }),
      });
      if (!res.ok) throw new Error('Request failed');
      const data = await res.json();
      toast.success(`Updated ${data.count} submission${data.count === 1 ? '' : 's'} to ${STATUS_LABELS[bulkStatus]}`);
      setConfirmOpen(false);
      setSelectedIds(new Set());
      onChanged?.();
    } catch (error) {
      console.error('Bulk status update failed:', error);
      toast.error('Failed to update submissions');
    } finally {
      setIsApplying(false);
    }
  }

  const allFilteredSelected =
    filteredSubmissions.length > 0 && filteredSubmissions.every((s) => selectedIds.has(s.id));
  const selectedSubmissions = submissions.filter((s) => selectedIds.has(s.id));

  function renderCell(key: string, submission: AdminSubmission) {
    switch (key) {
      case 'talkTitle':
        return (
          <td key={key} className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">{submission.talkTitle}</td>
        );
      case 'fullName':
        return (
          <td key={key} className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-400">
            <div className="flex items-center gap-2">
              <span>{submission.fullName}</span>
              {submission.duplicateCount > 1 && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    if (submission.duplicateTalks.length === 1) {
                      router.push(`/admin/submissions/${submission.duplicateTalks[0].id}`);
                    } else {
                      setDuplicateModalSubmission(submission);
                    }
                  }}
                  title={`Also submitted: ${submission.duplicateTalks.map((t) => t.talkTitle).join(', ')}`}
                  className="px-1.5 py-0.5 rounded text-xs font-bold border bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/40 dark:text-amber-400 dark:border-amber-900/50 hover:bg-amber-100 dark:hover:bg-amber-950/60 transition-colors"
                >
                  ×{submission.duplicateCount}
                </button>
              )}
            </div>
          </td>
        );
      case 'email':
        return (
          <td key={key} className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-400">{submission.email}</td>
        );
      case 'talkCategory':
        return (
          <td key={key} className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-400">{submission.talkCategory}</td>
        );
      case 'talkDuration':
        return (
          <td key={key} className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-400">
            {durationLabel(submission.talkDuration) || '—'}
          </td>
        );
      case 'status':
        return (
          <td key={key} className="px-6 py-4 whitespace-nowrap">
            <span className={`inline-block px-2 py-0.5 rounded text-xs font-medium border ${STATUS_BADGE_CLASSES[submission.status]}`}>
              {STATUS_LABELS[submission.status]}
            </span>
          </td>
        );
      case 'averageRating':
        return (
          <td key={key} className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-400">
            {submission.averageRating !== null ? submission.averageRating.toFixed(1) : '—'}
          </td>
        );
      case 'reviewCount':
        return (
          <td key={key} className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-400">{submission.reviewCount}</td>
        );
      default:
        return null;
    }
  }

  return (
    <div>
      <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-800 flex flex-col sm:flex-row sm:items-center sm:justify-end gap-3">
        <div className="flex flex-wrap items-center gap-2">
          <input
            type="text"
            value={search}
            onChange={(e) => updateSearch(e.target.value)}
            placeholder="Search by name, email, or title..."
            className="text-sm rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder:text-gray-400 dark:placeholder:text-gray-500 px-3 py-1.5 focus:border-[#006B3F] focus:ring-2 focus:ring-[#006B3F]/20 focus:outline-none w-full sm:w-64"
          />
          <select
            value={statusFilter}
            onChange={(e) => updateStatusFilter(e.target.value as StatusFilter)}
            className="text-sm rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 px-3 py-1.5 focus:border-[#006B3F] focus:ring-2 focus:ring-[#006B3F]/20 focus:outline-none"
          >
            <option value="all">All statuses</option>
            {TALK_STATUSES.map((status) => (
              <option key={status} value={status}>{STATUS_LABELS[status]}</option>
            ))}
          </select>
          <select
            value={categoryFilter}
            onChange={(e) => updateCategoryFilter(e.target.value)}
            aria-label="Filter by category"
            className="text-sm rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 px-3 py-1.5 focus:border-[#006B3F] focus:ring-2 focus:ring-[#006B3F]/20 focus:outline-none max-w-52"
          >
            <option value="all">All categories</option>
            {categories.map((category) => (
              <option key={category} value={category}>{category}</option>
            ))}
          </select>
          <label className="flex items-center gap-1.5 text-sm text-gray-600 dark:text-gray-400 whitespace-nowrap">
            <input
              type="checkbox"
              checked={groupByCategory}
              onChange={(e) => setGroupByCategory(e.target.checked)}
              className="rounded border-gray-300 dark:border-gray-600 text-[#006B3F] focus:ring-[#006B3F]"
            />
            Group by category
          </label>
          <div className="flex items-center gap-1.5 text-sm text-gray-600 dark:text-gray-400">
            <span>Rating</span>
            <input
              type="number"
              inputMode="decimal"
              step="0.1"
              min="0"
              value={ratingMin}
              onChange={(e) => updateRatingMin(e.target.value)}
              placeholder="min"
              aria-label="Minimum average rating"
              className="text-sm rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder:text-gray-400 dark:placeholder:text-gray-500 px-2 py-1.5 w-20 focus:border-[#006B3F] focus:ring-2 focus:ring-[#006B3F]/20 focus:outline-none"
            />
            <span>–</span>
            <input
              type="number"
              inputMode="decimal"
              step="0.1"
              min="0"
              value={ratingMax}
              onChange={(e) => updateRatingMax(e.target.value)}
              placeholder="max"
              aria-label="Maximum average rating"
              className="text-sm rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder:text-gray-400 dark:placeholder:text-gray-500 px-2 py-1.5 w-20 focus:border-[#006B3F] focus:ring-2 focus:ring-[#006B3F]/20 focus:outline-none"
            />
          </div>
        </div>
      </div>

      <div className="px-6 py-3 border-b border-gray-200 dark:border-gray-800 flex flex-wrap items-center gap-4">
        <span className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
          Columns:
        </span>
        {COLUMNS.map((col) => (
          <label key={col.key} className="flex items-center gap-1.5 text-sm text-gray-700 dark:text-gray-300">
            <input
              type="checkbox"
              checked={enabledColumns.has(col.key)}
              onChange={() => toggleColumn(col.key)}
              className="rounded border-gray-300 dark:border-gray-600 text-[#006B3F] focus:ring-[#006B3F]"
            />
            {col.label}
          </label>
        ))}
        <div className="flex-1" />
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
            Set status:
          </span>
          <select
            value={bulkStatus}
            onChange={(e) => setBulkStatus(e.target.value as TalkStatus)}
            disabled={selectedSubmissions.length === 0}
            className="text-sm rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 px-3 py-1.5 focus:border-[#006B3F] focus:ring-2 focus:ring-[#006B3F]/20 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {TALK_STATUSES.map((status) => (
              <option key={status} value={status}>{STATUS_LABELS[status]}</option>
            ))}
          </select>
          <button
            onClick={() => setConfirmOpen(true)}
            disabled={selectedSubmissions.length === 0}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-white bg-[#006B3F] hover:bg-[#00552f] dark:bg-emerald-600 dark:hover:bg-emerald-500 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            Apply ({selectedSubmissions.length})
          </button>
        </div>
        <button
          onClick={() => exportRows(filteredSubmissions, 'submissions-filtered.csv')}
          disabled={filteredSubmissions.length === 0}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-[#006B3F] dark:text-emerald-400 bg-[#006B3F]/5 dark:bg-emerald-500/10 hover:bg-[#006B3F]/10 dark:hover:bg-emerald-500/20 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          <Download className="w-4 h-4" />
          Export filtered ({filteredSubmissions.length})
        </button>
        <button
          onClick={() => exportRows(selectedSubmissions, 'submissions-selected.csv')}
          disabled={selectedSubmissions.length === 0}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-[#006B3F] dark:text-emerald-400 bg-[#006B3F]/5 dark:bg-emerald-500/10 hover:bg-[#006B3F]/10 dark:hover:bg-emerald-500/20 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          <Download className="w-4 h-4" />
          Export selected ({selectedSubmissions.length})
        </button>
      </div>

      {filteredSubmissions.length === 0 ? (
        <div className="p-8 text-center text-gray-500 dark:text-gray-400">No submissions found</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-800">
            <thead className="bg-gray-50 dark:bg-gray-800/50">
              <tr>
                <th scope="col" className="px-4 py-3 w-10">
                  <input
                    type="checkbox"
                    checked={allFilteredSelected}
                    onChange={toggleSelectAllFiltered}
                    className="rounded border-gray-300 dark:border-gray-600 text-[#006B3F] focus:ring-[#006B3F]"
                    aria-label="Select all filtered submissions"
                  />
                </th>
                {visibleColumns.map((col) => (
                  <th key={col.key} scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">{col.label}</th>
                ))}
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-800">
              {groupedSubmissions.map((group) => (
                <Fragment key={group.category ?? 'all'}>
                  {group.category !== null && (
                    <tr className="bg-gray-50 dark:bg-gray-800/50">
                      <td colSpan={visibleColumns.length + 1} className="px-6 py-2 text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">
                        {group.category}
                        <span className="ml-2 font-normal normal-case tracking-normal text-gray-400 dark:text-gray-500">
                          {group.rows.length} submission{group.rows.length === 1 ? '' : 's'}
                        </span>
                      </td>
                    </tr>
                  )}
                  {group.rows.map((submission) => (
                    <tr
                      key={submission.id}
                      className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors cursor-pointer"
                      onClick={() => router.push(`/admin/submissions/${submission.id}`)}
                    >
                      <td className="px-4 py-4 w-10" onClick={(e) => e.stopPropagation()}>
                        <input
                          type="checkbox"
                          checked={selectedIds.has(submission.id)}
                          onChange={() => toggleRow(submission.id)}
                          className="rounded border-gray-300 dark:border-gray-600 text-[#006B3F] focus:ring-[#006B3F]"
                          aria-label={`Select ${submission.talkTitle}`}
                        />
                      </td>
                      {visibleColumns.map((col) => renderCell(col.key, submission))}
                    </tr>
                  ))}
                </Fragment>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <Modal
        isOpen={confirmOpen}
        onClose={() => (isApplying ? undefined : setConfirmOpen(false))}
        title="Change status"
        size="sm"
      >
        <p className="text-sm text-gray-700 dark:text-gray-300">
          Set{' '}
          <span className="font-semibold">
            {selectedSubmissions.length} submission{selectedSubmissions.length === 1 ? '' : 's'}
          </span>{' '}
          to{' '}
          <span className={`inline-block px-2 py-0.5 rounded text-xs font-medium border ${STATUS_BADGE_CLASSES[bulkStatus]}`}>
            {STATUS_LABELS[bulkStatus]}
          </span>
          ?
        </p>
        <div className="mt-6 flex justify-end gap-2">
          <button
            onClick={() => setConfirmOpen(false)}
            disabled={isApplying}
            className="px-3 py-1.5 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={applyBulkStatus}
            disabled={isApplying}
            className="px-3 py-1.5 text-sm font-medium text-white bg-[#006B3F] hover:bg-[#00552f] dark:bg-emerald-600 dark:hover:bg-emerald-500 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {isApplying ? 'Applying…' : 'Confirm'}
          </button>
        </div>
      </Modal>

      <Modal
        isOpen={!!duplicateModalSubmission}
        onClose={() => setDuplicateModalSubmission(null)}
        title={`Other submissions by ${duplicateModalSubmission?.fullName ?? ''}`}
        size="sm"
      >
        <ul className="space-y-2">
          {duplicateModalSubmission?.duplicateTalks.map((t) => (
            <li key={t.id}>
              <button
                onClick={() => {
                  setDuplicateModalSubmission(null);
                  router.push(`/admin/submissions/${t.id}`);
                }}
                className="text-sm text-[#006B3F] dark:text-emerald-400 hover:underline text-left"
              >
                {t.talkTitle}
              </button>
            </li>
          ))}
        </ul>
      </Modal>
    </div>
  );
}
