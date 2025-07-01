'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface CookiePreferences {
  essential: boolean;
  analytics: boolean;
  functional: boolean;
  marketing: boolean;
}

interface CookieConsentContextType {
  preferences: CookiePreferences | null;
  hasConsent: boolean;
  updatePreferences: (prefs: CookiePreferences) => void;
  canUseAnalytics: () => boolean;
  canUseFunctional: () => boolean;
  canUseMarketing: () => boolean;
  setItem: (key: string, value: string, category?: keyof CookiePreferences) => boolean;
  getItem: (key: string) => string | null;
  removeItem: (key: string) => void;
}

const CookieConsentContext = createContext<CookieConsentContextType | null>(null);

const CONSENT_STORAGE_KEY = 'manic_cookie_consent';
const CONSENT_VERSION = '1.0';

interface CookieConsentProviderProps {
  children: ReactNode;
}

export function CookieConsentProvider({ children }: CookieConsentProviderProps) {
  const [preferences, setPreferences] = useState<CookiePreferences | null>(null);
  const [hasConsent, setHasConsent] = useState(false);

  useEffect(() => {
    // Check for existing consent
    try {
      const savedConsent = localStorage.getItem(CONSENT_STORAGE_KEY);
      if (savedConsent) {
        const { preferences: savedPrefs, version } = JSON.parse(savedConsent);
        if (version === CONSENT_VERSION) {
          setPreferences(savedPrefs);
          setHasConsent(true);
        }
      }
    } catch (e) {
      console.warn('Failed to load cookie consent preferences:', e);
    }
  }, []);

  const updatePreferences = (prefs: CookiePreferences) => {
    setPreferences(prefs);
    setHasConsent(true);
  };

  const canUseAnalytics = () => {
    return hasConsent && preferences?.analytics === true;
  };

  const canUseFunctional = () => {
    return hasConsent && preferences?.functional === true;
  };

  const canUseMarketing = () => {
    return hasConsent && preferences?.marketing === true;
  };

  // Safe localStorage wrapper that respects consent
  const setItem = (key: string, value: string, category: keyof CookiePreferences = 'essential'): boolean => {
    try {
      // Always allow essential cookies
      if (category === 'essential') {
        localStorage.setItem(key, value);
        return true;
      }

      // Check consent for other categories
      if (!hasConsent || !preferences) {
        console.warn(`Cookie consent required for ${category} cookies. Item "${key}" not stored.`);
        return false;
      }

      if (preferences[category]) {
        localStorage.setItem(key, value);
        return true;
      } else {
        console.warn(`${category} cookies not consented. Item "${key}" not stored.`);
        return false;
      }
    } catch (e) {
      console.error('Failed to store item:', e);
      return false;
    }
  };

  const getItem = (key: string): string | null => {
    try {
      return localStorage.getItem(key);
    } catch (e) {
      console.error('Failed to retrieve item:', e);
      return null;
    }
  };

  const removeItem = (key: string): void => {
    try {
      localStorage.removeItem(key);
    } catch (e) {
      console.error('Failed to remove item:', e);
    }
  };

  const value: CookieConsentContextType = {
    preferences,
    hasConsent,
    updatePreferences,
    canUseAnalytics,
    canUseFunctional,
    canUseMarketing,
    setItem,
    getItem,
    removeItem,
  };

  return (
    <CookieConsentContext.Provider value={value}>
      {children}
    </CookieConsentContext.Provider>
  );
}

export function useCookieConsent(): CookieConsentContextType {
  const context = useContext(CookieConsentContext);
  if (!context) {
    throw new Error('useCookieConsent must be used within a CookieConsentProvider');
  }
  return context;
}

// Hook for checking specific consent categories
export function useConsentCategory(category: keyof CookiePreferences): boolean {
  const { preferences, hasConsent } = useCookieConsent();
  
  if (category === 'essential') return true; // Essential always allowed
  if (!hasConsent || !preferences) return false;
  
  return preferences[category];
}

export default CookieConsentContext; 