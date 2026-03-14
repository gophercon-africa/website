'use client';

import { useActionState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { Suspense } from 'react';
import { toast } from 'sonner';
import { OtpFormState } from '@/src/types/otp';

// Placeholder action — will be replaced when Task 7 (verifyOtp) is implemented
async function verifyOtpPlaceholder(_: OtpFormState, formData: FormData): Promise<OtpFormState> {
  // This will be replaced with: import { verifyOtpAction } from '@/src/actions/auth/otp'
  return { errors: { _form: ['Verify action not yet implemented'] } };
}

function OtpVerifyForm() {
  const searchParams = useSearchParams();
  const email = searchParams.get('email') ?? '';
  const [state, formAction, isPending] = useActionState(verifyOtpPlaceholder, {});

  useEffect(() => {
    if (state.success) {
      toast.success('Signed in successfully!');
    }
    if (state.errors?._form) {
      toast.error(state.errors._form[0]);
    }
  }, [state]);

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

          <form action={formAction} className="space-y-6">
            <input type="hidden" name="email" value={email} />

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
                className="w-full rounded-lg border border-gray-300 px-4 py-3 text-center text-2xl font-mono tracking-widest focus:border-[#006B3F] focus:ring-2 focus:ring-[#006B3F] focus:outline-none"
              />
              {state.errors?.otp && (
                <p className="mt-1 text-sm text-red-600">{state.errors.otp[0]}</p>
              )}
              {state.errors?._form && (
                <p className="mt-1 text-sm text-red-600">{state.errors._form[0]}</p>
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
              <a href="/auth/otp-login" className="text-[#006B3F] hover:underline font-medium">
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
