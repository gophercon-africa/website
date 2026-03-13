import Link from 'next/link';

export default function SignUpPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-16">
      <div className="max-w-md mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-2xl border border-gray-200 shadow-lg p-8">
          <h1 className="text-3xl font-bold text-gray-900 text-center">
            Sign up
          </h1>
          <p className="mt-3 text-sm text-gray-600 text-center">
            Account creation is not available yet.
          </p>
          <div className="mt-6 flex items-center justify-center gap-4 text-sm">
            <Link className="text-gray-600 hover:text-gray-900" href="/">
              Back to home
            </Link>
            <Link className="text-[#006B3F] hover:text-[#008751] font-medium" href="/signin">
              Go to sign in
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

