'use client';

import { useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Download } from 'lucide-react';
import Modal from '@/src/components/common/Modal';
import { toCsv, downloadCsv } from '@/src/lib/csv';
import type { AdminSubmission } from '@/src/types/admin';

type StatusFilter = 'all' | 'pending' | 'accepted' | 'rejected';

const STATUS_LABELS: Record<AdminSubmission['status'], string> = {
  pending: 'Pending',
  accepted: 'Accepted',
  rejected: 'Rejected',
};

const STATUS_BADGE_CLASSES: Record<AdminSubmission['status'], string> = {
  pending: 'bg-yellow-50 text-yellow-700 border-yellow-200',
  accepted: 'bg-green-50 text-green-700 border-green-200',
  rejected: 'bg-red-50 text-red-700 border-red-200',
};

const EXPORT_COLUMNS: { key: string; label: string }[] = [
  { key: 'email', label: 'Email' },
  { key: 'talkTitle', label: 'Talk Title' },
  { key: 'fullName', label: 'Speaker Name' },
  { key: 'talkCategory', label: 'Category' },
  { key: 'status', label: 'Status' },
  { key: 'averageRating', label: 'Average Rating' },
  { key: 'reviewCount', label: 'Review Count' },
];

const DEFAULT_EXPORT_COLUMNS = new Set(['email']);

export function AdminSubmissionsTable({ submissions }: { submissions: AdminSubmission[] }) {
  const router = useRouter();
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all');
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [exportColumns, setExportColumns] = useState<Set<string>>(new Set(DEFAULT_EXPORT_COLUMNS));
  const [duplicateModalSubmission, setDuplicateModalSubmission] = useState<AdminSubmission | null>(null);

  const filteredSubmissions = useMemo(() => {
    const query = search.trim().toLowerCase();
    return submissions.filter((s) => {
      if (statusFilter !== 'all' && s.status !== statusFilter) return false;
      if (!query) return true;
      return (
        s.fullName.toLowerCase().includes(query) ||
        s.email.toLowerCase().includes(query) ||
        s.talkTitle.toLowerCase().includes(query)
      );
    });
  }, [submissions, search, statusFilter]);

  function updateSearch(value: string) {
    setSearch(value);
    setSelectedIds(new Set());
  }

  function updateStatusFilter(value: StatusFilter) {
    setStatusFilter(value);
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

  function toggleExportColumn(key: string) {
    setExportColumns((prev) => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });
  }

  function exportRows(rows: AdminSubmission[], filename: string) {
    const columns = EXPORT_COLUMNS.filter((c) => exportColumns.has(c.key));
    const csvRows = rows.map((s) => ({
      talkTitle: s.talkTitle,
      fullName: s.fullName,
      email: s.email,
      talkCategory: s.talkCategory,
      status: STATUS_LABELS[s.status],
      averageRating: s.averageRating !== null ? s.averageRating.toFixed(1) : '',
      reviewCount: s.reviewCount,
    }));
    const csv = toCsv(csvRows, columns.map((c) => c.key));
    downloadCsv(filename, csv);
  }

  const allFilteredSelected =
    filteredSubmissions.length > 0 && filteredSubmissions.every((s) => selectedIds.has(s.id));
  const selectedSubmissions = submissions.filter((s) => selectedIds.has(s.id));

  return (
    <div className="bg-white rounded-lg shadow overflow-hidden mt-8">
      <div className="px-6 py-4 border-b border-gray-200 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <h2 className="text-lg font-semibold text-gray-900">Submissions Overview</h2>
        <div className="flex flex-wrap items-center gap-2">
          <input
            type="text"
            value={search}
            onChange={(e) => updateSearch(e.target.value)}
            placeholder="Search by name, email, or title..."
            className="text-sm rounded-lg border border-gray-300 px-3 py-1.5 focus:border-[#006B3F] focus:ring-2 focus:ring-[#006B3F]/20 focus:outline-none w-full sm:w-64"
          />
          <select
            value={statusFilter}
            onChange={(e) => updateStatusFilter(e.target.value as StatusFilter)}
            className="text-sm rounded-lg border border-gray-300 px-3 py-1.5 focus:border-[#006B3F] focus:ring-2 focus:ring-[#006B3F]/20 focus:outline-none"
          >
            <option value="all">All statuses</option>
            <option value="pending">Pending</option>
            <option value="accepted">Accepted</option>
            <option value="rejected">Rejected</option>
          </select>
        </div>
      </div>

      <div className="px-6 py-3 border-b border-gray-200 flex flex-wrap items-center gap-4">
        <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
          Export columns:
        </span>
        {EXPORT_COLUMNS.map((col) => (
          <label key={col.key} className="flex items-center gap-1.5 text-sm text-gray-700">
            <input
              type="checkbox"
              checked={exportColumns.has(col.key)}
              onChange={() => toggleExportColumn(col.key)}
              className="rounded border-gray-300 text-[#006B3F] focus:ring-[#006B3F]"
            />
            {col.label}
          </label>
        ))}
        <div className="flex-1" />
        <button
          onClick={() => exportRows(filteredSubmissions, 'submissions-filtered.csv')}
          disabled={filteredSubmissions.length === 0}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-[#006B3F] bg-[#006B3F]/5 hover:bg-[#006B3F]/10 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          <Download className="w-4 h-4" />
          Export filtered ({filteredSubmissions.length})
        </button>
        <button
          onClick={() => exportRows(selectedSubmissions, 'submissions-selected.csv')}
          disabled={selectedSubmissions.length === 0}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-[#006B3F] bg-[#006B3F]/5 hover:bg-[#006B3F]/10 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          <Download className="w-4 h-4" />
          Export selected ({selectedSubmissions.length})
        </button>
      </div>

      {filteredSubmissions.length === 0 ? (
        <div className="p-8 text-center text-gray-500">No submissions found</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-4 py-3 w-10">
                  <input
                    type="checkbox"
                    checked={allFilteredSelected}
                    onChange={toggleSelectAllFiltered}
                    className="rounded border-gray-300 text-[#006B3F] focus:ring-[#006B3F]"
                    aria-label="Select all filtered submissions"
                  />
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Title</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Speaker</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Avg Rating</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Reviews</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredSubmissions.map((submission) => (
                <tr
                  key={submission.id}
                  className="hover:bg-gray-50 transition-colors cursor-pointer"
                  onClick={() => router.push(`/admin/submissions/${submission.id}`)}
                >
                  <td className="px-4 py-4 w-10" onClick={(e) => e.stopPropagation()}>
                    <input
                      type="checkbox"
                      checked={selectedIds.has(submission.id)}
                      onChange={() => toggleRow(submission.id)}
                      className="rounded border-gray-300 text-[#006B3F] focus:ring-[#006B3F]"
                      aria-label={`Select ${submission.talkTitle}`}
                    />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{submission.talkTitle}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
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
                          className="px-1.5 py-0.5 rounded text-xs font-bold border bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-100 transition-colors"
                        >
                          ×{submission.duplicateCount}
                        </button>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{submission.talkCategory}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-block px-2 py-0.5 rounded text-xs font-medium border ${STATUS_BADGE_CLASSES[submission.status]}`}>
                      {STATUS_LABELS[submission.status]}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                    {submission.averageRating !== null ? submission.averageRating.toFixed(1) : '—'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{submission.reviewCount}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

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
                className="text-sm text-[#006B3F] hover:underline text-left"
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
