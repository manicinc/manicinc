'use client';

export default function OfflineActions() {
  const handleReload = () => {
    if (typeof window !== 'undefined') {
      window.location.reload();
    }
  };

  return (
    <button
      type="button"
      onClick={handleReload}
      className="w-full px-6 py-3 bg-[var(--accent-primary)] text-[var(--bg-primary)] font-semibold rounded-lg hover:opacity-90 transition-opacity"
    >
      Try Again
    </button>
  );
}
