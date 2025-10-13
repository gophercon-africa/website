import { ScheduleActivity } from '@/src/types/schedule';
import { Clock, User, MessageSquare, ExternalLink } from 'lucide-react';
import Link from 'next/link';

interface ScheduleCardProps {
  activity: ScheduleActivity;
}

export default function ScheduleCard({ activity }: ScheduleCardProps) {
  const getActivityColor = (activityType: string) => {
    switch (activityType.toLowerCase()) {
      case 'workshop':
        return 'bg-purple-50 border-purple-200';
      case 'keynote':
        return 'bg-blue-50 border-blue-200';
      case 'talk':
        return 'bg-green-50 border-green-200';
      case 'breakfast':
      case 'lunch break':
        return 'bg-orange-50 border-orange-200';
      case 'break':
        return 'bg-gray-50 border-gray-200';
      case 'women who go':
        return 'bg-pink-50 border-pink-200';
      case 'arrival & registration':
        return 'bg-indigo-50 border-indigo-200';
      default:
        return 'bg-white border-gray-200';
    }
  };

  const getActivityIcon = (activityType: string) => {
    switch (activityType.toLowerCase()) {
      case 'workshop':
      case 'keynote':
      case 'talk':
        return <MessageSquare className="w-5 h-5" />;
      default:
        return <Clock className="w-5 h-5" />;
    }
  };

  return (
    <div
      className={`border-2 rounded-lg p-4 hover:shadow-md transition-shadow ${getActivityColor(
        activity.activity
      )}`}
    >
      <div className="flex items-start justify-between mb-2">
        <div className="flex items-center gap-2">
          {getActivityIcon(activity.activity)}
          <h3 className="font-bold text-lg text-gray-900">
            {activity.activity}
          </h3>
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <Clock className="w-4 h-4" />
          <span className="font-medium">
            {activity.startTime} - {activity.endTime}
          </span>
        </div>
      </div>

      {activity.speaker && (
        <Link 
          href={`/speakers?name=${encodeURIComponent(activity.speaker)}`}
          className="flex items-center gap-2 mb-2 group w-fit"
        >
          <User className="w-4 h-4 text-gray-600 group-hover:text-blue-600 transition-colors" />
          <span className="text-sm font-medium text-gray-700 group-hover:text-blue-600 group-hover:underline transition-colors">
            {activity.speaker}
          </span>
          <ExternalLink className="w-3 h-3 text-gray-400 group-hover:text-blue-600 transition-colors" />
        </Link>
      )}

      {activity.talk && (
        <p className="text-sm text-gray-800 mb-2 font-medium">
          {activity.talk}
        </p>
      )}

      {activity.notes && (
        <p className="text-xs text-gray-600 italic mt-2 border-t pt-2">
          Note: {activity.notes}
        </p>
      )}

      {activity.requirements && (
        <p className="text-xs text-gray-600 mt-1">
          <span className="font-semibold">Requirements:</span>{' '}
          {activity.requirements}
        </p>
      )}
    </div>
  );
}
