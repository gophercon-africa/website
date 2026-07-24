import { CheckCircle2 } from 'lucide-react';

export default function ReviewPeriodClosed() {
  return (
    <div className="flex flex-1 items-center justify-center px-4 py-24">
      <div className="max-w-md w-full text-center bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl shadow-sm p-10">
        <CheckCircle2 className="w-12 h-12 mx-auto text-green-500 dark:text-green-400 mb-4" />
        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">
          The review period has closed
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Thank you for reviewing! The committee is now finalizing the selection.
          We&apos;ll be in touch about the next steps.
        </p>
      </div>
    </div>
  );
}
