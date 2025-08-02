'use client';

interface ErrorFallbackProps {
  onRetry?: () => void;
  message?: string;
  title?: string;
}

export default function ErrorFallback({ 
  onRetry = () => window.location.reload(),
  message = "Please refresh the page to continue.",
  title = "Something went wrong"
}: ErrorFallbackProps) {
  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="text-center">
        <h1 className="text-2xl font-bold mb-4 text-text-primary">{title}</h1>
        <p className="text-text-secondary mb-4">{message}</p>
        <button 
          onClick={onRetry}
          className="px-4 py-2 bg-accent-burgundy text-white rounded hover:bg-accent-burgundy/90 transition-colors"
        >
          Refresh Page
        </button>
      </div>
    </div>
  );
}
