'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { List, ArrowLeft } from 'lucide-react';
import { sortForSelection } from './sortForSelection';
import type { AdminSubmission } from '@/src/types/admin';

// Entry point: forwards to the top-rated talk's workspace URL so mid-call
// reloads and shared links always land on a concrete talk.
export default function SelectionIndexPage() {
  const router = useRouter();
  const [empty, setEmpty] = useState(false);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch('/api/admin/submissions');
        if (!res.ok) throw new Error('Failed to load submissions');
        const submissions: AdminSubmission[] = await res.json();
        if (cancelled) return;
        if (submissions.length === 0) {
          setEmpty(true);
          return;
        }
        const sorted = sortForSelection(submissions);
        router.replace(`/admin/selection/${sorted[0].id}`);
      } catch (error) {
        if (!cancelled) {
          toast.error('Failed to load submissions');
          console.error(error);
          setEmpty(true);
        }
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [router]);

  if (empty) {
    return (
      <div className="min-h-[calc(100vh-80px)] flex items-center justify-center bg-gray-50 dark:bg-gray-950 p-4">
        <div className="bg-white dark:bg-gray-900 rounded-lg shadow-sm border border-gray-200 dark:border-gray-800 p-8 text-center max-w-md w-full">
          <List className="w-12 h-12 text-gray-400 dark:text-gray-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">No Submissions</h2>
          <p className="text-gray-500 dark:text-gray-400 mb-4">
            There are no submissions for this year&apos;s selection.
          </p>
          <button
            onClick={() => router.push('/admin')}
            className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-brand dark:text-emerald-400 hover:bg-brand/5 dark:hover:bg-emerald-500/10 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-80px)] flex items-center justify-center bg-gray-50 dark:bg-gray-950">
      <div className="flex flex-col items-center gap-3">
        <div className="w-8 h-8 border-4 border-brand/20 border-t-brand rounded-full animate-spin" />
        <p className="text-gray-500 dark:text-gray-400 font-medium">Loading selection...</p>
      </div>
    </div>
  );
}
