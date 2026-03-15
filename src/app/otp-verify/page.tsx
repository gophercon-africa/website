'use client';

import { useState, useRef } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Suspense } from 'react';
import { signIn } from 'next-auth/react';
import { toast } from 'sonner';

function OtpVerifyForm() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const email = searchParams?.get('email') ?? '';
  const [isPending, setIsPending] = useState(false);
  const [otpError, setOtpError] = useState<string | null>(null);
  const otpRef = useRef<HTMLInputElement>(null);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const otp = otpRef.current?.value ?? '';

    if (!otp || otp.length !== 6) {
      setOtpError('Enter the 6-digit code from your email');
      return;
    }

    setIsPending(true);
    setOtpError(null);

    const result = await signIn('credentials', {
      email,
      otp,
      redirect: false,
    });

    setIsPending(false);

    if (result?.error) {
      setOtpError('Incorrect or expired code. Please try again.');
      toast.error('Incorrect or expired code');
      return;
    }

    if (result?.ok) {
      toast.success('Signed in successfully!');
      const { getSession } = await import('next-auth/react');
      const session = await getSession();
      const role = (session?.user as { role?: string } | undefined)?.role;
      router.push(role === 'admin' ? '/admin' : '/reviews');
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-lg p-8">
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold text-gray-900">Enter your code</h1>
            <p className="text-gray-500 mt-2">
              We sent a 6-digit code to <strong>{email || 'your email'}</strong>
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="otp" className="block text-sm font-medium text-gray-700 mb-1">
                Sign-in code
              </label>
              <input
                id="otp"
                name="otp"
                type="text"
                inputMode="numeric"
                pattern="[0-9]{6}"
                maxLength={6}
                required
                autoComplete="one-time-code"
                placeholder="000000"
                ref={otpRef}
                className="w-full rounded-lg border border-gray-300 px-4 py-3 text-center text-2xl font-mono tracking-widest focus:border-[#006B3F] focus:ring-2 focus:ring-[#006B3F] focus:outline-none"
              />
              {otpError && (
                <p className="mt-1 text-sm text-red-600">{otpError}</p>
              )}
            </div>

            <button
              type="submit"
              disabled={isPending}
              className="w-full rounded-lg bg-[#006B3F] px-4 py-3 text-sm font-semibold text-white hover:bg-[#008751] disabled:opacity-60 transition-colors focus:ring-2 focus:ring-[#006B3F] focus:ring-offset-2"
            >
              {isPending ? 'Verifying...' : 'Verify code'}
            </button>

            <p className="text-center text-sm text-gray-500">
              Didn&apos;t receive a code?{' '}
              <a href="/otp-login" className="text-[#006B3F] hover:underline font-medium">
                Try again
              </a>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}

export default function OtpVerifyPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading...</div>}>
      <OtpVerifyForm />
    </Suspense>
  );
}
