'use client';

import { useCookieConsent } from '@/hooks/useCookieConsent';
import { motion } from 'framer-motion';

export function CookiePreferences() {
  const { preferences, updatePreferences, showBanner } = useCookieConsent();

  if (!preferences) {
    return (
      <div className="max-w-2xl mx-auto p-6">
        <h2 className="text-2xl font-display font-semibold mb-6">Cookie Preferences</h2>
        <p className="text-text-secondary mb-6">
          No cookie preferences found. Please accept cookies first.
        </p>
        <button
          onClick={showBanner}
          className="px-6 py-3 bg-accent-burgundy text-white rounded-xl hover:bg-accent-burgundy/90 transition-colors"
        >
          Show Cookie Banner
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h2 className="text-2xl font-display font-semibold mb-6">Cookie Preferences</h2>
      
      <div className="space-y-4">
        {/* Essential - Always on */}
        <div className="bg-bg-secondary rounded-xl p-6 border border-border">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-medium text-text-primary mb-1">Essential Cookies</h3>
              <p className="text-sm text-text-secondary">Required for basic site functionality</p>
            </div>
            <div className="text-sm text-accent-sage font-medium">Always Active</div>
          </div>
        </div>

        {/* Analytics */}
        <div className="bg-bg-secondary rounded-xl p-6 border border-border">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <h3 className="font-medium text-text-primary mb-1">Analytics Cookies</h3>
              <p className="text-sm text-text-secondary">Help us understand site usage</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={preferences.analytics}
                onChange={(e) => updatePreferences({ analytics: e.target.checked })}
                className="sr-only"
              />
              <div className={`w-11 h-6 rounded-full transition-colors ${
                preferences.analytics ? 'bg-accent-sage' : 'bg-bg-tertiary'
              }`}>
                <div className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full transition-transform ${
                  preferences.analytics ? 'translate-x-5' : 'translate-x-0'
                }`} />
              </div>
            </label>
          </div>
        </div>

        {/* Marketing */}
        <div className="bg-bg-secondary rounded-xl p-6 border border-border">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <h3 className="font-medium text-text-primary mb-1">Marketing Cookies</h3>
              <p className="text-sm text-text-secondary">Enable newsletter subscriptions and social features</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={preferences.marketing}
                onChange={(e) => updatePreferences({ marketing: e.target.checked })}
                className="sr-only"
              />
              <div className={`w-11 h-6 rounded-full transition-colors ${
                preferences.marketing ? 'bg-accent-sage' : 'bg-bg-tertiary'
              }`}>
                <div className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full transition-transform ${
                  preferences.marketing ? 'translate-x-5' : 'translate-x-0'
                }`} />
              </div>
            </label>
          </div>
        </div>

        {/* Functional */}
        <div className="bg-bg-secondary rounded-xl p-6 border border-border">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <h3 className="font-medium text-text-primary mb-1">Functional Cookies</h3>
              <p className="text-sm text-text-secondary">Enhanced features and personalization</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={preferences.functional}
                onChange={(e) => updatePreferences({ functional: e.target.checked })}
                className="sr-only"
              />
              <div className={`w-11 h-6 rounded-full transition-colors ${
                preferences.functional ? 'bg-accent-sage' : 'bg-bg-tertiary'
              }`}>
                <div className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full transition-transform ${
                  preferences.functional ? 'translate-x-5' : 'translate-x-0'
                }`} />
              </div>
            </label>
          </div>
        </div>
      </div>

      <div className="mt-6 flex gap-4">
        <button
          onClick={() => showBanner()}
          className="px-4 py-2 border border-accent-secondary text-accent-secondary rounded-lg hover:bg-accent-secondary hover:text-white transition-colors"
        >
          Review Banner
        </button>
        <button
          onClick={() => updatePreferences({
            analytics: false,
            marketing: false,
            functional: false
          })}
          className="px-4 py-2 border border-border text-text-secondary rounded-lg hover:bg-bg-tertiary transition-colors"
        >
          Reset to Essential Only
        </button>
      </div>
    </div>
  );
}
