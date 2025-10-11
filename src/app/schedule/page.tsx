'use client';

import { useState } from 'react';
import DaySchedule from '@/src/components/schedule/DaySchedule';
import { scheduleData } from '@/src/data/schedule';
import { CalendarDays, Info } from 'lucide-react';

export default function SchedulePage() {
  const [selectedDay, setSelectedDay] = useState<number | null>(null);

  const displaySchedule = selectedDay
    ? scheduleData.filter((day) => day.day === selectedDay)
    : scheduleData;

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

        <div className="bg-blue-50 border-2 border-blue-200 rounded-lg p-6 mb-12">
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

        <div>
          {displaySchedule.map((daySchedule) => (
            <DaySchedule key={daySchedule.day} schedule={daySchedule} />
          ))}
        </div>

        <div className="mt-12 bg-white rounded-lg p-6 shadow-md">
          <h3 className="font-bold text-lg text-gray-900 mb-4">
            Activity Types
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-purple-200 rounded"></div>
              <span className="text-sm text-gray-700">Workshop</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-blue-200 rounded"></div>
              <span className="text-sm text-gray-700">Keynote</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-green-200 rounded"></div>
              <span className="text-sm text-gray-700">Talk</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-orange-200 rounded"></div>
              <span className="text-sm text-gray-700">Meals</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-pink-200 rounded"></div>
              <span className="text-sm text-gray-700">Women Who Go</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-indigo-200 rounded"></div>
              <span className="text-sm text-gray-700">Registration</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-gray-200 rounded"></div>
              <span className="text-sm text-gray-700">Break</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
