'use client';

import { signIn } from 'next-auth/react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { Suspense, useMemo, useState } from 'react';
import { Lock, Mail } from 'lucide-react';

function SignInPageInner() {
  const searchParams = useSearchParams();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [localError, setLocalError] = useState<string | null>(null);

  const callbackUrl = useMemo(() => {
    const fromQuery = searchParams?.get('callbackUrl');
    return fromQuery && fromQuery.startsWith('/') ? fromQuery : '/';
  }, [searchParams]);

  const errorFromQuery = searchParams?.get('error');

  const onSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setLocalError(null);
    setIsSubmitting(true);

    try {
      await signIn('credentials', {
        email,
        password,
        callbackUrl,
        redirect: true,
      });
    } catch {
      setLocalError('Sign in failed. Please try again.');
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-16">
      <div className="max-w-md mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-2xl border border-gray-200 shadow-lg p-8">
          <h1 className="text-3xl font-bold text-gray-900 text-center">
            Sign in
          </h1>
          <p className="mt-2 text-sm text-gray-600 text-center">
            Use your email and password to continue.
          </p>

          {(errorFromQuery || localError) && (
            <div className="mt-6 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {localError ?? 'Authentication failed. Please try again.'}
            </div>
          )}

          <form className="mt-6 space-y-4" onSubmit={onSubmit}>
            <label className="block">
              <span className="sr-only">Email</span>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  className="w-full rounded-lg border border-gray-200 bg-white px-10 py-3 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#006B3F]"
                  type="email"
                  name="email"
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  autoComplete="email"
                  required
                />
              </div>
            </label>

            <label className="block">
              <span className="sr-only">Password</span>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  className="w-full rounded-lg border border-gray-200 bg-white px-10 py-3 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#006B3F]"
                  type="password"
                  name="password"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoComplete="current-password"
                  required
                />
              </div>
            </label>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full rounded-lg bg-[#006B3F] px-4 py-3 text-sm font-semibold text-white hover:bg-[#008751] disabled:opacity-60 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#006B3F]"
            >
              {isSubmitting ? 'Signing in...' : 'Sign in'}
            </button>
          </form>

          <div className="mt-6 flex items-center justify-between text-sm">
            <Link className="text-gray-600 hover:text-gray-900" href="/">
              Back to home
            </Link>
            <Link className="text-[#006B3F] hover:text-[#008751] font-medium" href="/workshops">
              View workshops
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function SignInPage() {
  return (
    <Suspense
      fallback={<div className="min-h-screen bg-gray-50 py-16 font-sans" />}
    >
      <SignInPageInner />
    </Suspense>
  );
}
