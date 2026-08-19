import { ScheduleDay } from '@/src/types/schedule';

/** Segmented control: All Days + one segment per day. */
export default function DayTabs({
  days,
  selected,
  onSelect,
}: {
  days: ScheduleDay[];
  selected: number | null;
  onSelect: (day: number | null) => void;
}) {
  const segment = (active: boolean) =>
    `px-4 py-2 text-sm font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand/40 ${
      active ? 'bg-brand text-white' : 'bg-surface text-body hover:bg-surface-sunken'
    }`;

  return (
    <div
      role="tablist"
      aria-label="Filter by day"
      className="inline-flex overflow-hidden rounded-control border border-line divide-x divide-line"
    >
      <button
        role="tab"
        aria-selected={selected === null}
        onClick={() => onSelect(null)}
        className={segment(selected === null)}
      >
        All Days
      </button>
      {days.map((day) => (
        <button
          key={day.day}
          role="tab"
          aria-selected={selected === day.day}
          onClick={() => onSelect(day.day)}
          className={segment(selected === day.day)}
        >
          {day.dayLabel}
        </button>
      ))}
    </div>
  );
}
