'use client';

import { useState } from 'react';
import { scheduleData } from '@data/schedule';
import DaySection from './DaySection';

export default function ScheduleTabs() {
  const [selectedDay, setSelectedDay] = useState<number | null>(null);

  const visibleDays =
    selectedDay === null
      ? scheduleData
      : scheduleData.filter((day) => day.day === selectedDay);

  const tabClass = (active: boolean) =>
    `px-5 py-2.5 rounded-lg font-semibold transition-all ${
      active
        ? 'bg-brand text-white shadow-md'
        : 'bg-white text-gray-700 border border-gray-200 hover:bg-gray-50'
    }`;

  return (
    <div>
      <div className="flex flex-wrap justify-center gap-3 mb-10">
        <button
          onClick={() => setSelectedDay(null)}
          className={tabClass(selectedDay === null)}
        >
          All Days
        </button>
        {scheduleData.map((day) => (
          <button
            key={day.day}
            onClick={() => setSelectedDay(day.day)}
            className={tabClass(selectedDay === day.day)}
          >
            {day.dayLabel}
          </button>
        ))}
      </div>
      <div className="space-y-12">
        {visibleDays.map((day) => (
          <DaySection key={day.day} schedule={day} />
        ))}
      </div>
    </div>
  );
}
