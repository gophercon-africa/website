import { ScheduleActivity } from '@/src/types/schedule';
import { Clock, User, MessageSquare, Calendar, Info } from 'lucide-react';
import Modal from '@components/common/Modal';

interface TalkDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  activity: ScheduleActivity;
}

export default function TalkDetailModal({ isOpen, onClose, activity }: TalkDetailModalProps) {
  const getActivityColor = (activityType: string) => {
    switch (activityType.toLowerCase()) {
      case 'workshop':
        return 'bg-purple-100 text-purple-800';
      case 'keynote':
        return 'bg-blue-100 text-blue-800';
      case 'talk':
        return 'bg-green-100 text-green-800';
      case 'general':
        return 'bg-pink-100 text-pink-800';
      case 'breakfast':
      case 'lunch break':
        return 'bg-orange-100 text-orange-800';
      case 'break':
        return 'bg-gray-100 text-gray-800';
      case 'partna talk':
        return 'bg-indigo-100 text-indigo-800';
      case 'arrival & registration':
        return 'bg-indigo-100 text-indigo-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getActivityIcon = (activityType: string) => {
    switch (activityType.toLowerCase()) {
      case 'workshop':
      case 'keynote':
      case 'talk':
      case 'general':
        return <MessageSquare className="w-6 h-6" />;
      default:
        return <Clock className="w-6 h-6" />;
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Talk Details" size="lg">
      <div className="space-y-6">
        {/* Header Section */}
        <div className="flex items-start gap-4">
          <div className={`p-3 rounded-lg ${getActivityColor(activity.activity)}`}>
            {getActivityIcon(activity.activity)}
          </div>
          <div className="flex-1">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">{activity.activity}</h2>
            <div className="flex items-center gap-4 text-gray-600">
              <div className="flex items-center gap-2">
                <Clock className="w-5 h-5" />
                <span className="font-medium">{activity.startTime} - {activity.endTime}</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="w-5 h-5" />
                <span className="font-medium">{activity.duration}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Speaker Section */}
        {activity.speaker && (
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="flex items-center gap-3">
              <User className="w-6 h-6 text-gray-600" />
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Speaker</h3>
                <p className="text-gray-700 font-medium">{activity.speaker}</p>
              </div>
            </div>
          </div>
        )}

        {/* Talk Title Section */}
        {activity.talk && (
          <div className="bg-blue-50 rounded-lg p-4">
            <div className="flex items-center gap-3">
              <MessageSquare className="w-6 h-6 text-blue-600" />
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Talk Title</h3>
                <p className="text-gray-800 font-medium">{activity.talk}</p>
              </div>
            </div>
          </div>
        )}

        {/* Notes Section */}
        {activity.notes && (
          <div className="bg-yellow-50 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <Info className="w-6 h-6 text-yellow-600 mt-1" />
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Notes</h3>
                <div className="text-gray-700 whitespace-pre-line leading-relaxed">
                  {activity.notes}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Requirements Section */}
        {activity.requirements && (
          <div className="bg-red-50 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <Info className="w-6 h-6 text-red-600 mt-1" />
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Requirements</h3>
                <div className="text-gray-700 whitespace-pre-line leading-relaxed">
                  {activity.requirements}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </Modal>
  );
}
