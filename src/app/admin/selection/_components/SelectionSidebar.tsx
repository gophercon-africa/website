'use client';

import type { RefObject } from 'react';
import { ChevronLeft, ChevronRight, Star } from 'lucide-react';
import { STATUS_LABELS, STATUS_BADGE_CLASSES } from '@/src/app/admin/_components/statusBadges';
import { TALK_STATUSES, type TalkStatus } from '@/src/lib/talkStatus';
import type { AdminSubmission } from '@/src/types/admin';

export type SelectionFilter = 'all' | TalkStatus;

export function SelectionSidebar({
  talks,
  counts,
  filter,
  onFilterChange,
  search,
  onSearchChange,
  searchRef,
  currentTalkId,
  onNavigate,
  collapsed,
  onToggleCollapsed,
}: {
  talks: AdminSubmission[];
  counts: Record<SelectionFilter, number>;
  filter: SelectionFilter;
  onFilterChange: (filter: SelectionFilter) => void;
  search: string;
  onSearchChange: (value: string) => void;
  searchRef: RefObject<HTMLInputElement | null>;
  currentTalkId: string | undefined;
  onNavigate: (id: string) => void;
  collapsed: boolean;
  onToggleCollapsed: () => void;
}) {
  return (
    <div
      className={`shrink-0 bg-gray-50 dark:bg-gray-950 sm:border-l border-gray-200 dark:border-gray-800 flex flex-col transition-all duration-200 ease-in-out
        ${collapsed
          ? 'w-full sm:w-9 h-9 sm:h-auto border-t sm:border-t-0 overflow-hidden'
          : 'w-full sm:w-80 lg:w-96 h-52 sm:h-auto border-t sm:border-t-0'
        }`}
    >
      {/* Sidebar header: filter tabs + collapse toggle */}
      <div className="flex items-start bg-gray-100/50 dark:bg-gray-900/50 border-b border-gray-200 dark:border-gray-800 shrink-0">
        {!collapsed && (
          <div className="flex flex-1 flex-wrap p-2 gap-0">
            {(['all', ...TALK_STATUSES] as SelectionFilter[]).map((f) => (
              <button
                key={f}
                onClick={() => onFilterChange(f)}
                className={`flex-1 min-w-[31%] py-2 text-xs font-semibold rounded-md capitalize transition-all ${
                  filter === f
                    ? 'bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 shadow-sm ring-1 ring-gray-200 dark:ring-gray-700'
                    : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 hover:bg-gray-200/50 dark:hover:bg-gray-800/50'
                }`}
              >
                {f} ({counts[f]})
              </button>
            ))}
          </div>
        )}
        <button
          onClick={onToggleCollapsed}
          title={collapsed ? 'Show talks' : 'Hide talks'}
          className={`hidden sm:flex items-center justify-center text-gray-400 dark:text-gray-500 hover:text-gray-700 dark:hover:text-gray-200 hover:bg-gray-200/60 dark:hover:bg-gray-800/60 transition-colors shrink-0
            ${collapsed ? 'w-9 h-9' : 'w-8 h-9 mr-1 mt-1'}`}
        >
          {collapsed ? <ChevronLeft className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
        </button>
      </div>

      {!collapsed && (
        <>
          <div className="p-2 border-b border-gray-200 dark:border-gray-800 shrink-0">
            <input
              ref={searchRef}
              type="text"
              value={search}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Search speaker or title... ( / )"
              className="w-full text-sm rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 placeholder:text-gray-400 dark:placeholder:text-gray-500 px-3 py-1.5 focus:border-brand focus:ring-2 focus:ring-brand/20 focus:outline-none"
            />
          </div>

          <div className="flex-1 overflow-y-auto p-2 space-y-1">
            {talks.length === 0 ? (
              <div className="p-8 text-center text-sm text-gray-500 dark:text-gray-400">
                No talks match this filter.
              </div>
            ) : (
              talks.map((talk) => {
                const isSelected = talk.id === currentTalkId;
                return (
                  <button
                    key={talk.id}
                    onClick={() => onNavigate(talk.id)}
                    className={`w-full text-left p-3 rounded-lg border transition-all ${
                      isSelected
                        ? 'bg-brand/5 dark:bg-emerald-500/10 border-brand/20 dark:border-emerald-500/30 ring-1 ring-brand/20 dark:ring-emerald-500/30'
                        : 'bg-white dark:bg-gray-900 border-transparent hover:border-gray-200 dark:hover:border-gray-700 hover:shadow-sm'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3 mb-1">
                      <h4
                        className={`text-sm font-semibold line-clamp-2 leading-snug ${
                          isSelected ? 'text-brand dark:text-emerald-400' : 'text-gray-900 dark:text-gray-100'
                        }`}
                      >
                        {talk.talkTitle}
                      </h4>
                      <div className="flex items-center gap-1 bg-gray-50 dark:bg-gray-800 text-gray-700 dark:text-gray-300 px-1.5 py-0.5 rounded text-xs font-bold border border-gray-200 dark:border-gray-700 shrink-0">
                        <Star className="w-3 h-3 fill-current text-amber-500" />
                        <span>{talk.averageRating !== null ? talk.averageRating.toFixed(1) : '—'}</span>
                        <span className="font-normal text-gray-400 dark:text-gray-500">·{talk.reviewCount}</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-xs text-gray-500 dark:text-gray-400 truncate">{talk.fullName}</span>
                      <span className={`inline-block px-1.5 py-0.5 rounded text-[10px] font-medium border shrink-0 ${STATUS_BADGE_CLASSES[talk.status]}`}>
                        {STATUS_LABELS[talk.status]}
                      </span>
                    </div>
                  </button>
                );
              })
            )}
          </div>
        </>
      )}
    </div>
  );
}
