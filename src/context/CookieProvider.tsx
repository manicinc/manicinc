'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { CookieConsentBanner } from '@/components/CookieConsentBanner';
import { useCookieConsent } from '@/hooks/useCookieConsent';

interface CookiePreferences {
  essential: boolean;
  analytics: boolean;
  functional: boolean;
  marketing: boolean;
}

interface CookieProviderContextType {
  showBanner: () => void;
}

const CookieProviderContext = createContext<CookieProviderContextType | undefined>(undefined);

export function CookieProvider({ children }: { children: ReactNode }) {
  const [showConsentBanner, setShowConsentBanner] = useState(false);
  const { updatePreferences } = useCookieConsent();

  useEffect(() => {
    // Check if user has already made a choice
    const savedConsent = localStorage.getItem('manic_cookie_consent');
    if (!savedConsent) {
      // Show banner after a short delay for better UX
      const timer = setTimeout(() => setShowConsentBanner(true), 1000);
      return () => clearTimeout(timer);
    }

    // Listen for show banner events
    const handleShowBanner = () => setShowConsentBanner(true);
    window.addEventListener('cookie-consent-show-banner', handleShowBanner);
    
    return () => {
      window.removeEventListener('cookie-consent-show-banner', handleShowBanner);
    };
  }, []);

  const showBanner = () => setShowConsentBanner(true);

  const value: CookieProviderContextType = {
    showBanner,
  };

  return (
    <CookieProviderContext.Provider value={value}>
      {children}
      {showConsentBanner && (
        <CookieConsentBanner 
          onConsentChange={(prefs) => {
            try {
              updatePreferences(prefs);
              // Fire event for listeners that want to know consent granted
              if (prefs?.analytics) {
                window.dispatchEvent(new CustomEvent('cookie-consent-given'));
              }
            } catch {}
            setShowConsentBanner(false);
          }}
        />
      )}
    </CookieProviderContext.Provider>
  );
}

export function useCookieProvider() {
  const context = useContext(CookieProviderContext);
  if (!context) {
    throw new Error('useCookieProvider must be used within CookieProvider');
  }
  return context;
}
