import { SessionType } from '@/src/types/schedule';
import { CONTENT_TYPES, SESSION_TYPE_META } from './sessionMeta';

/** Single-select session-type chips with live counts. Click the active chip
 *  to clear it. Types with zero matches under the current day/query hide. */
export default function TypeFilter({
  counts,
  selected,
  onSelect,
}: {
  counts: Partial<Record<SessionType, number>>;
  selected: SessionType | null;
  onSelect: (type: SessionType | null) => void;
}) {
  return (
    <div className="flex flex-wrap gap-2" aria-label="Filter by session type">
      {CONTENT_TYPES.map((type) => {
        const count = counts[type] ?? 0;
        if (count === 0 && selected !== type) return null;
        const active = selected === type;
        return (
          <button
            key={type}
            aria-pressed={active}
            onClick={() => onSelect(active ? null : type)}
            className={`rounded-control px-3 py-1.5 text-xs font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand/40 ${
              active
                ? 'bg-brand text-white'
                : 'border border-line bg-surface text-muted hover:border-brand/40 hover:text-body'
            }`}
          >
            {SESSION_TYPE_META[type].label}
            <span className={active ? 'ml-1.5 opacity-80' : 'ml-1.5 text-faint'}>
              {count}
            </span>
          </button>
        );
      })}
    </div>
  );
}
