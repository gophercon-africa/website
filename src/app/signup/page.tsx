import Link from 'next/link';

export default function SignUpPage() {
  return (
    <div className="min-h-screen bg-surface-sunken py-16">
      <div className="max-w-md mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-surface rounded-2xl border border-line shadow-lg p-8">
          <h1 className="text-3xl font-bold text-ink text-center">
            Sign up
          </h1>
          <p className="mt-3 text-sm text-muted text-center">
            Account creation is not available yet.
          </p>
          <div className="mt-6 flex items-center justify-center gap-4 text-sm">
            <Link className="text-muted hover:text-ink" href="/">
              Back to home
            </Link>
            <Link className="text-brand dark:text-brand-bright hover:text-brand-light font-medium" href="/signin">
              Go to sign in
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

