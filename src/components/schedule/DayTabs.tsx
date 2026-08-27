import { ScheduleDay } from '@/src/types/schedule';

/** 'Thursday, October 15' → 'Thu Oct 15' for compact day tabs. */
function shortDate(date: string): string {
  const [weekday, rest] = date.split(', ');
  if (!rest) return date;
  const [month, dayNum] = rest.split(' ');
  return `${weekday.slice(0, 3)} ${month.slice(0, 3)} ${dayNum}`;
}

/** GopherCon-US style underline tabs: All Days + one tab per day. */
export default function DayTabs({
  days,
  selected,
  onSelect,
}: {
  days: ScheduleDay[];
  selected: number | null;
  onSelect: (day: number | null) => void;
}) {
  const tab = (active: boolean) =>
    `-mb-px border-b-2 px-1 py-3 text-sm font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand/40 ${
      active
        ? 'border-brand text-brand dark:text-brand-bright'
        : 'border-transparent text-muted hover:text-ink'
    }`;

  return (
    <div
      role="tablist"
      aria-label="Filter by day"
      className="flex flex-wrap gap-x-6 border-b border-line"
    >
      <button
        role="tab"
        aria-selected={selected === null}
        onClick={() => onSelect(null)}
        className={tab(selected === null)}
      >
        All Days
      </button>
      {days.map((day) => (
        <button
          key={day.day}
          role="tab"
          aria-selected={selected === day.day}
          onClick={() => onSelect(day.day)}
          className={tab(selected === day.day)}
        >
          {shortDate(day.date)}
        </button>
      ))}
    </div>
  );
}
