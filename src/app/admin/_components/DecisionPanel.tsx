'use client';

import type { RefObject } from 'react';
import { TALK_STATUSES, type TalkStatus } from '@/src/lib/talkStatus';
import { STATUS_LABELS } from './statusBadges';

// Solid fills for the selected status so the choice reads at a glance
// (e.g. on a screen share during the selection call).
const SELECTED_CLASSES: Record<TalkStatus, string> = {
  pending: 'bg-yellow-500 text-white border-yellow-500',
  shortlisted: 'bg-blue-600 text-white border-blue-600',
  waitlisted: 'bg-purple-600 text-white border-purple-600',
  accepted: 'bg-brand text-white border-brand',
  rejected: 'bg-red-600 text-white border-red-600',
};

export function DecisionPanel({
  status,
  onStatusChange,
  decisionNotes,
  onNotesChange,
  followUpRequested,
  onFollowUpChange,
  notifiedAt,
  onSave,
  saving,
  saveLabel = 'Save Decision',
  notesRef,
}: {
  status: TalkStatus;
  onStatusChange: (status: TalkStatus) => void;
  decisionNotes: string;
  onNotesChange: (value: string) => void;
  followUpRequested?: boolean;
  onFollowUpChange?: (value: boolean) => void;
  notifiedAt?: string | null;
  onSave: () => void;
  saving: boolean;
  saveLabel?: string;
  notesRef?: RefObject<HTMLTextAreaElement | null>;
}) {
  return (
    <div>
      <div className="flex flex-wrap gap-2 mb-4">
        {TALK_STATUSES.map((s) => (
          <button
            key={s}
            onClick={() => onStatusChange(s)}
            className={`flex-1 min-w-[100px] px-3 py-2 text-sm font-medium rounded-lg border transition-colors ${
              status === s
                ? SELECTED_CLASSES[s]
                : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 border-gray-300 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700'
            }`}
          >
            {STATUS_LABELS[s]}
          </button>
        ))}
      </div>
      <label htmlFor="decision-notes" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
        Decision Notes
      </label>
      <textarea
        id="decision-notes"
        ref={notesRef}
        value={decisionNotes}
        onChange={(e) => onNotesChange(e.target.value)}
        rows={3}
        placeholder="Optional notes about this decision..."
        className="w-full rounded-lg border border-gray-300 dark:border-gray-700 px-4 py-3 text-sm text-gray-900 dark:text-gray-100 placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:border-brand focus:ring-2 focus:ring-brand/20 focus:outline-none transition-shadow bg-white dark:bg-gray-800 resize-y mb-4"
      />
      {onFollowUpChange && (
        <label className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300 mb-4 cursor-pointer select-none">
          <input
            type="checkbox"
            checked={followUpRequested ?? false}
            onChange={(e) => onFollowUpChange(e.target.checked)}
            className="rounded border-gray-300 dark:border-gray-700 text-brand focus:ring-2 focus:ring-brand/20"
          />
          Speaker requested follow-up
        </label>
      )}
      {notifiedAt && (
        <p className="text-xs text-gray-500 dark:text-gray-400 mb-4">
          Notified on{' '}
          {new Date(notifiedAt).toLocaleDateString('en-GB', {
            day: 'numeric',
            month: 'short',
            year: 'numeric',
          })}
        </p>
      )}
      <button
        onClick={onSave}
        disabled={saving}
        className="w-full flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-medium text-white bg-brand hover:bg-brand-light rounded-lg disabled:opacity-60 disabled:cursor-not-allowed transition-colors"
      >
        {saving ? 'Saving...' : saveLabel}
      </button>
    </div>
  );
}
