'use client'

import { useEffect } from 'react'

interface ErrorProps {
  error: Error & { digest?: string }
  reset: () => void
}

export default function Error({ error, reset }: ErrorProps) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error('App error:', error)
  }, [error])

  return (
    <div className="min-h-screen flex items-center justify-center bg-bg-primary">
      <div className="max-w-md w-full mx-auto text-center p-6">
        <div className="mb-6">
          <h1 className="text-6xl font-bold text-accent-primary mb-2">500</h1>
          <h2 className="text-2xl font-semibold text-text-primary mb-4">
            Something went wrong
          </h2>
          <p className="text-text-secondary mb-6">
            We encountered an unexpected error. Our team has been notified and is working to fix this issue.
          </p>
        </div>
        
        <div className="space-y-4">
          <button
            onClick={reset}
            className="w-full bg-accent-primary text-white py-3 px-6 rounded-lg font-medium hover:bg-accent-primary/90 transition-colors"
          >
            Try again
          </button>
          
          <a
            href="/"
            className="block w-full bg-bg-secondary text-text-primary py-3 px-6 rounded-lg font-medium hover:bg-bg-secondary/80 transition-colors border border-border-primary"
          >
            Go home
          </a>
        </div>
        
        {process.env.NODE_ENV === 'development' && (
          <details className="mt-6 text-left">
            <summary className="cursor-pointer text-text-secondary hover:text-text-primary">
              Debug information
            </summary>
            <pre className="mt-2 p-4 bg-bg-secondary rounded-lg text-sm text-text-secondary overflow-auto">
              {error.message}
              {error.digest && `\nError ID: ${error.digest}`}
            </pre>
          </details>
        )}
      </div>
    </div>
  )
}
