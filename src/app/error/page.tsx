'use client';

import { useSearchParams } from 'next/navigation';
import { Suspense } from 'react';

function ErrorContent() {
  const searchParams = useSearchParams();
  const error = searchParams?.get('error') || 'An error occurred during authentication';

  return (
    <div className="min-h-screen flex items-center justify-center bg-surface-sunken">
      <div className="max-w-md w-full space-y-8 p-8 bg-surface rounded-lg shadow-lg">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-red-600 dark:text-red-400">
            Authentication Error
          </h2>
          <p className="mt-2 text-center text-muted">
            {error}
          </p>
        </div>
        <div className="mt-8">
          <a
            href="/signin"
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-brand hover:bg-brand-light focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand"
          >
            Return to Sign In
          </a>
        </div>
      </div>
    </div>
  );
}

export default function ErrorPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-surface-sunken">
        <div className="max-w-md w-full space-y-8 p-8 bg-surface rounded-lg shadow-lg">
          <div>
            <h2 className="mt-6 text-center text-3xl font-extrabold text-muted">
              Loading...
            </h2>
          </div>
        </div>
      </div>
    }>
      <ErrorContent />
    </Suspense>
  );
} 