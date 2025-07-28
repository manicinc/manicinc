'use client';

import { useState, useEffect } from 'react';

interface CookiePreferences {
  essential: boolean;
  analytics: boolean;
  functional: boolean;
  marketing: boolean;
}

interface UseCookieConsentReturn {
  hasConsent: boolean;
  canUseMarketing: boolean;
  canUseAnalytics: boolean;
  canUseFunctional: boolean;
  preferences: CookiePreferences | null;
  updatePreferences: (newPrefs: Partial<CookiePreferences>) => void;
  showBanner: () => void;
}

const CONSENT_STORAGE_KEY = 'manic_cookie_consent';
const CONSENT_VERSION = '1.0';

export function useCookieConsent(): UseCookieConsentReturn {
  const [preferences, setPreferences] = useState<CookiePreferences | null>(null);
  const [hasConsent, setHasConsent] = useState(false);

  useEffect(() => {
    // Check for existing consent
    const checkConsent = () => {
      const savedConsent = localStorage.getItem(CONSENT_STORAGE_KEY);
      if (savedConsent) {
        try {
          const { preferences: savedPrefs, version } = JSON.parse(savedConsent);
          if (version === CONSENT_VERSION) {
            setPreferences(savedPrefs);
            setHasConsent(true);
            // Update actual cookies based on preferences
            updateCookieSettings(savedPrefs);
            return;
          }
        } catch (e) {
          console.warn('Invalid cookie consent data');
        }
      }
      setHasConsent(false);
    };

    checkConsent();

    // Listen for consent changes
    const handleConsentChange = () => checkConsent();
    window.addEventListener('cookie-consent-updated', handleConsentChange);
    
    return () => {
      window.removeEventListener('cookie-consent-updated', handleConsentChange);
    };
  }, []);

  const updateCookieSettings = (prefs: CookiePreferences) => {
    // Set consent tracking cookie
    document.cookie = `manic_consent=true; path=/; max-age=${60 * 60 * 24 * 365}; SameSite=Lax`;
    
    if (prefs.analytics) {
      // Enable analytics cookies
      document.cookie = `manic_analytics=enabled; path=/; max-age=${60 * 60 * 24 * 365}; SameSite=Lax`;
      // Initialize analytics if available
      if (typeof window !== 'undefined' && window.gtag) {
        window.gtag('consent', 'update', {
          'analytics_storage': 'granted'
        });
      }
    } else {
      // Clear analytics cookies
      document.cookie = `manic_analytics=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT`;
      if (typeof window !== 'undefined' && window.gtag) {
        window.gtag('consent', 'update', {
          'analytics_storage': 'denied'
        });
      }
    }
    
    if (prefs.marketing) {
      // Enable marketing cookies (newsletter, etc.)
      document.cookie = `manic_marketing=enabled; path=/; max-age=${60 * 60 * 24 * 365}; SameSite=Lax`;
    } else {
      // Clear marketing cookies
      document.cookie = `manic_marketing=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT`;
    }
    
    if (prefs.functional) {
      // Enable functional cookies (form submissions, etc.)
      document.cookie = `manic_functional=enabled; path=/; max-age=${60 * 60 * 24 * 365}; SameSite=Lax`;
    } else {
      // Clear functional cookies
      document.cookie = `manic_functional=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT`;
    }
  };

  const updatePreferences = (newPrefs: Partial<CookiePreferences>) => {
    const currentPrefs = preferences || {
      essential: true,
      analytics: false,
      functional: false,
      marketing: false,
    };
    
    const updatedPrefs = { ...currentPrefs, ...newPrefs };
    setPreferences(updatedPrefs);
    setHasConsent(true);
    
    // Save to localStorage
    const consentData = {
      preferences: updatedPrefs,
      version: CONSENT_VERSION,
      timestamp: Date.now()
    };
    
    localStorage.setItem(CONSENT_STORAGE_KEY, JSON.stringify(consentData));
    
    // Update actual cookies
    updateCookieSettings(updatedPrefs);
    
    // Trigger event for other components
    window.dispatchEvent(new CustomEvent('cookie-consent-updated'));
  };

  const showBanner = () => {
    // Trigger banner display by clearing consent
    localStorage.removeItem(CONSENT_STORAGE_KEY);
    setHasConsent(false);
    setPreferences(null);
    window.dispatchEvent(new CustomEvent('cookie-consent-show-banner'));
  };

  return {
    hasConsent,
    canUseMarketing: hasConsent && (preferences?.marketing ?? false),
    canUseAnalytics: hasConsent && (preferences?.analytics ?? false),
    canUseFunctional: hasConsent && (preferences?.functional ?? false),
    preferences,
    updatePreferences,
    showBanner
  };
}

// Extend Window interface for gtag
declare global {
  interface Window {
    gtag?: (...args: any[]) => void;
  }
}
