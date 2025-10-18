import { ScheduleActivity } from '@/src/types/schedule';
import { Clock, User, MessageSquare, ExternalLink, Eye } from 'lucide-react';
import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import TalkDetailModal from './TalkDetailModal';

interface ScheduleCardProps {
  activity: ScheduleActivity;
  isHighlighted?: boolean;
}

export default function ScheduleCard({ activity, isHighlighted = false }: ScheduleCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    if (isHighlighted && cardRef.current) {
      cardRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }, [isHighlighted]);
  const getActivityColor = (activityType: string) => {
    switch (activityType.toLowerCase()) {
      case 'workshop':
        return 'bg-purple-50 border-purple-200';
      case 'keynote':
        return 'bg-blue-50 border-blue-200';
      case 'talk':
        return 'bg-green-50 border-green-200';
      case 'general':
        return 'bg-pink-50 border-pink-200';
      case 'breakfast':
      case 'lunch break':
        return 'bg-orange-50 border-orange-200';
      case 'break':
        return 'bg-gray-50 border-gray-200';
      case 'partna talk':
        return 'bg-indigo-50 border-indigo-200';
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
      case 'general':
        return <MessageSquare className="w-5 h-5" />;
      default:
        return <Clock className="w-5 h-5" />;
    }
  };

  return (
    <div
      ref={cardRef}
      className={`border-2 rounded-lg p-4 hover:shadow-md transition-all ${getActivityColor(
        activity.activity
      )} ${isHighlighted ? 'ring-4 ring-blue-500 shadow-xl scale-105' : ''}`}
    >
      <div className="flex items-start justify-between mb-2">
        <div className="flex items-center gap-2">
          {getActivityIcon(activity.activity)}
          <h3 className="font-bold text-xl text-gray-900">
            {activity.activity}
          </h3>
        </div>
        <div className="flex items-center gap-2 text-base text-gray-600">
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
          <span className="text-base font-medium text-gray-700 group-hover:text-blue-600 group-hover:underline transition-colors">
            {activity.speaker}
          </span>
          <ExternalLink className="w-3 h-3 text-gray-400 group-hover:text-blue-600 transition-colors" />
        </Link>
      )}

      {activity.talk && (
        <p className="text-base text-gray-800 mb-2 font-medium">
          {activity.talk}
        </p>
      )}

      {activity.requirements && (
        <div className="text-sm text-gray-600 mt-1">
          <span className="font-semibold">Requirements:</span>
          <div className="whitespace-pre-line leading-relaxed mt-1">
            {activity.requirements}
          </div>
        </div>
      )}

      {/* View Detail Button - Only show for talks, workshops, keynotes, general sessions, and other relevant activities */}
      {(activity.activity.toLowerCase().includes('talk') || 
        activity.activity.toLowerCase().includes('workshop') || 
        activity.activity.toLowerCase().includes('keynote') ||
        activity.activity.toLowerCase().includes('general') ||
        activity.activity.toLowerCase().includes('partna talk')) && (
        <div className="mt-4 pt-3 border-t border-gray-200">
          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
          >
            <Eye className="w-4 h-4" />
            View Details
          </button>
        </div>
      )}

      {/* Talk Detail Modal */}
      <TalkDetailModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        activity={activity}
      />
    </div>
  );
}
