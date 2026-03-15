'use client';

import { useActionState, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { OtpFormState } from '@/src/types/otp';
import { sendOtp } from '@/src/actions/auth/otp';

export default function OtpLoginPage() {
  const router = useRouter();
  const [state, formAction, isPending] = useActionState(sendOtp, {});
  const [email, setEmail] = useState('');

  useEffect(() => {
    if (state.success) {
      toast.success('Code sent! Check your email.');
      router.push('/otp-verify?email=' + encodeURIComponent(email));
    }
    if (state.errors?._form) {
      toast.error(state.errors._form[0]);
    }
  }, [state, router, email]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-lg p-8">
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold text-gray-900">Welcome</h1>
            <p className="text-gray-500 mt-2">Enter your email to receive a sign-in code</p>
          </div>

          <form action={formAction} className="space-y-6">
            <div>
              <input
                 id="email"
                 name="email"
                 type="email"
                 required
                 autoComplete="email"
                 placeholder="you@example.com"
                 value={email}
                 onChange={(e) => setEmail(e.target.value)}
                 className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm focus:border-[#006B3F] focus:ring-2 focus:ring-[#006B3F] focus:outline-none"
               />
              {state.errors?.email && (
                <p className="mt-1 text-sm text-red-600">{state.errors.email[0]}</p>
              )}
            </div>

            <button
              type="submit"
              disabled={isPending}
              className="w-full rounded-lg bg-[#006B3F] px-4 py-3 text-sm font-semibold text-white hover:bg-[#008751] disabled:opacity-60 transition-colors focus:ring-2 focus:ring-[#006B3F] focus:ring-offset-2"
            >
              {isPending ? 'Sending...' : 'Send sign-in code'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
