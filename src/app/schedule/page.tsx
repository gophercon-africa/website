'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import DaySchedule from '@/src/components/schedule/DaySchedule';
import { scheduleData } from '@/src/data/schedule';
import { ScheduleActivity } from '@/src/types/schedule';
import { CalendarDays, Info } from 'lucide-react';

function ScheduleContent() {
  const [selectedDay, setSelectedDay] = useState<number | null>(null);
  const [selectedActivityTypes, setSelectedActivityTypes] = useState<string[]>([]);
  const [highlightedSpeaker, setHighlightedSpeaker] = useState<string | null>(null);
  const searchParams = useSearchParams();

  useEffect(() => {
    if (!searchParams) return;
    const speakerName = searchParams.get('speaker');
    if (speakerName) {
      setHighlightedSpeaker(speakerName);
      setTimeout(() => setHighlightedSpeaker(null), 3000);
    }
  }, [searchParams]);

  const activityTypes = [
    { name: 'Workshop', color: 'bg-purple-200' },
    { name: 'Keynote', color: 'bg-blue-200' },
    { name: 'Talk', color: 'bg-green-200' },
    { name: 'General', color: 'bg-pink-200' },
    { name: 'Meals', color: 'bg-orange-200' },
    { name: 'Registration', color: 'bg-indigo-200' },
    { name: 'Break', color: 'bg-gray-200' },
  ];

  const toggleActivityType = (activityType: string) => {
    setSelectedActivityTypes((prev) =>
      prev.includes(activityType)
        ? prev.filter((type) => type !== activityType)
        : [...prev, activityType]
    );
  };

  const filterActivities = (activities: ScheduleActivity[]) => {
    if (selectedActivityTypes.length === 0) return activities;
    
    return activities.filter((activity) => {
      const activityLower = activity.activity.toLowerCase();
      return selectedActivityTypes.some((type) => {
        const typeLower = type.toLowerCase();
        if (typeLower === 'meals') {
          return activityLower.includes('breakfast') || activityLower.includes('lunch');
        }
        if (typeLower === 'registration') {
          return activityLower.includes('registration');
        }
        if (typeLower === 'general') {
          return activityLower.includes('general');
        }
        return activityLower.includes(typeLower);
      });
    });
  };

  const displaySchedule = selectedDay
    ? scheduleData.filter((day) => day.day === selectedDay).map((day) => ({
        ...day,
        activities: filterActivities(day.activities),
      }))
    : scheduleData.map((day) => ({
        ...day,
        activities: filterActivities(day.activities),
      }));

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-4">
            <CalendarDays className="w-12 h-12 text-blue-600" />
            <h1 className="text-5xl font-bold text-gray-900">
              Conference Schedule
            </h1>
          </div>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Join us for two days of amazing talks, workshops, and networking at
            GopherCon Africa
          </p>
        </div>

        <div className="flex justify-center gap-4 mb-12">
          <button
            onClick={() => setSelectedDay(null)}
            className={`px-6 py-3 rounded-lg font-semibold transition-all ${
              selectedDay === null
                ? 'bg-blue-600 text-white shadow-lg'
                : 'bg-white text-gray-700 hover:bg-gray-100'
            }`}
          >
            All Days
          </button>
          <button
            onClick={() => setSelectedDay(1)}
            className={`px-6 py-3 rounded-lg font-semibold transition-all ${
              selectedDay === 1
                ? 'bg-blue-600 text-white shadow-lg'
                : 'bg-white text-gray-700 hover:bg-gray-100'
            }`}
          >
            Day 1
          </button>
          <button
            onClick={() => setSelectedDay(2)}
            className={`px-6 py-3 rounded-lg font-semibold transition-all ${
              selectedDay === 2
                ? 'bg-blue-600 text-white shadow-lg'
                : 'bg-white text-gray-700 hover:bg-gray-100'
            }`}
          >
            Day 2
          </button>
        </div>

        <div className="bg-blue-50 border-2 border-blue-200 rounded-lg p-6 mb-6">
          <div className="flex items-start gap-3">
            <Info className="w-6 h-6 text-blue-600 flex-shrink-0 mt-1" />
            <div>
              <h3 className="font-bold text-lg text-gray-900 mb-2">
                Important Notes
              </h3>
              <ul className="space-y-1 text-sm text-gray-700">
                <li>• There will be no questions during talks</li>
                <li>• All talks will be 20/30 minutes</li>
                <li>• Venue time constraint: 5:00 PM each day</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg p-6 shadow-md mb-12">
          <h3 className="font-bold text-lg text-gray-900 mb-4">
            Filter by Activity Type
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {activityTypes.map((type) => (
              <button
                key={type.name}
                onClick={() => toggleActivityType(type.name)}
                className={`flex items-center gap-2 p-2 rounded-lg border-2 transition-all ${
                  selectedActivityTypes.includes(type.name)
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className={`w-4 h-4 ${type.color} rounded`}></div>
                <span className="text-sm text-gray-700 font-medium">{type.name}</span>
              </button>
            ))}
          </div>
          {selectedActivityTypes.length > 0 && (
            <button
              onClick={() => setSelectedActivityTypes([])}
              className="mt-4 text-sm text-blue-600 hover:text-blue-700 font-medium"
            >
              Clear all filters
            </button>
          )}
        </div>

        <div>
          {displaySchedule.map((daySchedule) => (
            <DaySchedule 
              key={daySchedule.day} 
              schedule={daySchedule} 
              highlightedSpeaker={highlightedSpeaker}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

export default function SchedulePage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <div className="flex items-center justify-center gap-3 mb-4">
              <CalendarDays className="w-12 h-12 text-blue-600" />
              <h1 className="text-5xl font-bold text-gray-900">
                Conference Schedule
              </h1>
            </div>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Join us for two days of amazing talks, workshops, and networking at
              GopherCon Africa
            </p>
          </div>
          <div className="flex justify-center gap-4 mb-12">
            <div className="animate-pulse bg-gray-200 rounded-lg px-6 py-3 w-24 h-12"></div>
            <div className="animate-pulse bg-gray-200 rounded-lg px-6 py-3 w-16 h-12"></div>
            <div className="animate-pulse bg-gray-200 rounded-lg px-6 py-3 w-16 h-12"></div>
          </div>
          <div className="bg-blue-50 border-2 border-blue-200 rounded-lg p-6 mb-6">
            <div className="flex items-start gap-3">
              <Info className="w-6 h-6 text-blue-600 flex-shrink-0 mt-1" />
              <div>
                <h3 className="font-bold text-lg text-gray-900 mb-2">
                  Important Notes
                </h3>
                <ul className="space-y-1 text-sm text-gray-700">
                  <li>• There will be no questions during talks</li>
                  <li>• All talks will be 20/30 minutes</li>
                  <li>• Venue time constraint: 5:00 PM each day</li>
                </ul>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg p-6 shadow-md mb-12">
            <h3 className="font-bold text-lg text-gray-900 mb-4">
              Filter by Activity Type
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {Array.from({ length: 7 }).map((_, i) => (
                <div key={i} className="animate-pulse bg-gray-200 rounded-lg h-10"></div>
              ))}
            </div>
          </div>
          <div className="space-y-8">
            {Array.from({ length: 2 }).map((_, i) => (
              <div key={i} className="bg-white rounded-lg p-6 shadow-md">
                <div className="animate-pulse">
                  <div className="bg-gray-200 rounded-lg h-8 w-32 mb-4"></div>
                  <div className="space-y-4">
                    {Array.from({ length: 6 }).map((_, j) => (
                      <div key={j} className="bg-gray-200 rounded-lg h-24"></div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    }>
      <ScheduleContent />
    </Suspense>
  );
}