'use client'

import { useEffect } from 'react'

interface GlobalErrorProps {
  error: Error & { digest?: string }
  reset: () => void
}

export default function GlobalError({ error, reset }: GlobalErrorProps) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error('Global app error:', error)
  }, [error])

  return (
    <html>
      <body>
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <div className="max-w-md w-full mx-auto text-center p-6">
            <div className="mb-6">
              <h1 className="text-6xl font-bold text-red-600 mb-2">500</h1>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                Application Error
              </h2>
              <p className="text-gray-600 mb-6">
                A critical error occurred. Please try refreshing the page.
              </p>
            </div>
            
            <div className="space-y-4">
              <button
                onClick={reset}
                className="w-full bg-red-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-red-700 transition-colors"
              >
                Try again
              </button>
              
              <a
                href="/"
                className="block w-full bg-gray-200 text-gray-900 py-3 px-6 rounded-lg font-medium hover:bg-gray-300 transition-colors"
              >
                Go home
              </a>
            </div>
            
            {process.env.NODE_ENV === 'development' && (
              <details className="mt-6 text-left">
                <summary className="cursor-pointer text-gray-600 hover:text-gray-900">
                  Debug information
                </summary>
                <pre className="mt-2 p-4 bg-gray-100 rounded-lg text-sm text-gray-800 overflow-auto">
                  {error.message}
                  {error.digest && `\nError ID: ${error.digest}`}
                </pre>
              </details>
            )}
          </div>
        </div>
      </body>
    </html>
  )
}
