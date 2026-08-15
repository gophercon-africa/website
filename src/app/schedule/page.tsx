import { Metadata } from 'next';
import { CalendarDays, Info } from 'lucide-react';
import ScheduleTabs from '@components/schedule/ScheduleTabs';

export const metadata: Metadata = {
  title: 'Schedule | GopherCon Africa 2026',
  description:
    'Three days of Go workshops, talks, and community — October 15–17, 2026 at PrideInn Westlands, Nairobi, Kenya.',
};

export default function SchedulePage() {
  return (
    <div className="min-h-screen bg-gray-50 py-16">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <div className="flex items-center justify-center gap-3 mb-4">
            <CalendarDays className="w-12 h-12 text-brand" aria-hidden />
            <h1 className="text-5xl font-bold text-gray-900">Schedule</h1>
          </div>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            October 15–17, 2026 · PrideInn Westlands, Nairobi, Kenya
          </p>
        </div>

        <div className="border border-amber-200 bg-amber-50 rounded-lg p-4 mb-10 max-w-3xl mx-auto">
          <div className="flex items-start gap-3">
            <Info className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" aria-hidden />
            <p className="text-sm text-amber-900">
              <span className="font-semibold">Draft program — subject to change.</span>{' '}
              Sessions and speakers will be updated as they are confirmed.
            </p>
          </div>
        </div>

        <ScheduleTabs />
      </div>
    </div>
  );
}
