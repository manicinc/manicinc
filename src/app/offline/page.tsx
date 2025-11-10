// src/app/offline/page.tsx
'use client';

import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Offline - Manic Agency',
  description: 'You are currently offline. Please check your internet connection.',
  robots: 'noindex, nofollow',
};

export default function OfflinePage() {
  const handleReload = () => {
    if (typeof window !== 'undefined') {
      window.location.reload();
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="max-w-md text-center">
        <div className="mb-8">
          <svg
            className="w-24 h-24 mx-auto text-[var(--accent-primary)] opacity-50"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M18.364 5.636a9 9 0 010 12.728m0 0l-2.829-2.829m2.829 2.829L21 21M15.536 8.464a5 5 0 010 7.072m0 0l-2.829-2.829m-4.243 2.829a4.978 4.978 0 01-1.414-2.83m-1.414 5.658a9 9 0 01-2.167-9.238m7.824 2.167a1 1 0 111.414 1.414m-1.414-1.414L3 3m8.293 8.293l1.414 1.414"
            />
          </svg>
        </div>

        <h1 className="text-4xl font-bold mb-4 text-[var(--text-primary)]">
          You're Offline
        </h1>

        <p className="text-lg text-[var(--text-secondary)] mb-8">
          It looks like you've lost your internet connection. Some content may not be available right now.
        </p>

        <div className="space-y-4">
          <button
            type="button"
            onClick={handleReload}
            className="w-full px-6 py-3 bg-[var(--accent-primary)] text-[var(--bg-primary)] font-semibold rounded-lg hover:opacity-90 transition-opacity"
          >
            Try Again
          </button>

          <Link
            href="/"
            className="block w-full px-6 py-3 border-2 border-[var(--accent-primary)] text-[var(--accent-primary)] font-semibold rounded-lg hover:bg-[var(--accent-primary)] hover:text-[var(--bg-primary)] transition-all"
          >
            Go to Homepage
          </Link>
        </div>

        <p className="mt-8 text-sm text-[var(--text-muted)]">
          Cached pages may still be available while offline
        </p>
      </div>
    </div>
  );
}

