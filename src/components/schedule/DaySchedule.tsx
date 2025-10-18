import { DaySchedule as DayScheduleType } from '@/src/types/schedule';
import ScheduleCard from './ScheduleCard';
import { Calendar } from 'lucide-react';

interface DayScheduleProps {
  schedule: DayScheduleType;
  highlightedSpeaker?: string | null;
}

export default function DaySchedule({ schedule, highlightedSpeaker }: DayScheduleProps) {
  return (
    <div className="mb-12">
      <div className="flex items-center gap-3 mb-6 pb-4 border-b-4 border-blue-600">
        <Calendar className="w-8 h-8 text-blue-600" />
        <h2 className="text-3xl font-bold text-gray-900">
          Day {schedule.day}
          {schedule.date && (
            <span className="text-xl text-gray-600 ml-3">{schedule.date}</span>
          )}
        </h2>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {schedule.activities.map((activity, index) => (
          <ScheduleCard 
            key={index} 
            activity={activity} 
            isHighlighted={highlightedSpeaker === activity.speaker}
          />
        ))}
      </div>
    </div>
  );
}
