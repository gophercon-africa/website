import { ScheduleDay } from '@/src/types/schedule';
import SessionRow from './SessionRow';

export default function DaySection({ schedule }: { schedule: ScheduleDay }) {
  return (
    <section aria-labelledby={`day-${schedule.day}-heading`}>
      <div className="mb-4 border-b border-line pb-3">
        <h2
          id={`day-${schedule.day}-heading`}
          className="text-2xl font-bold tracking-tight text-ink"
        >
          {schedule.dayLabel}
          <span className="text-brand"> — {schedule.date}</span>
        </h2>
        <p className="text-sm font-medium text-muted mt-0.5">{schedule.theme}</p>
      </div>
      <div className="space-y-3">
        {schedule.sessions.map((session) => (
          <SessionRow key={session.id} session={session} />
        ))}
      </div>
    </section>
  );
}
