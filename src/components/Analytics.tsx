'use client';

import React, { useEffect } from 'react';
import { Analytics as VercelAnalytics } from '@vercel/analytics/react';
import { SpeedInsights } from '@vercel/speed-insights/next';
import Script from 'next/script';
import { useCookieConsent } from '@/context/CookieConsentContext';

const GA_ID = process.env.NEXT_PUBLIC_GA_ID;

export function Analytics() {
  const { canUseAnalytics } = useCookieConsent();

  useEffect(() => {
    // Initialize Google Analytics if consent is given
    if (canUseAnalytics() && GA_ID && typeof window !== 'undefined') {
      // Check if GA is already loaded
      if (!(window as any).gtag) {
        // Load Google Analytics
        const script = document.createElement('script');
        script.async = true;
        script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_ID}`;
        document.head.appendChild(script);

        // Initialize gtag
        (window as any).dataLayer = (window as any).dataLayer || [];
        const gtag = (...args: any[]) => {
          (window as any).dataLayer.push(args);
        };
        (window as any).gtag = gtag;

        gtag('js', new Date());
        gtag('config', GA_ID, {
          page_path: window.location.pathname,
          anonymize_ip: true, // GDPR compliance
          allow_ad_personalization_signals: false, // GDPR compliance
        });

        console.log('Google Analytics initialized with consent');
      }
    }
  }, [canUseAnalytics]);

  // Only render analytics components if consent is given
  if (!canUseAnalytics()) {
    return null;
  }

  return (
    <>
      {/* Vercel Analytics - Privacy-friendly, no cookies */}
      <VercelAnalytics />
      
      {/* Vercel Speed Insights - Performance monitoring */}
      <SpeedInsights />

      {/* Google Analytics - Only if GA_ID is set */}
      {GA_ID && (
        <>
          <Script
            strategy="afterInteractive"
            src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}
          />
          <Script
            id="google-analytics"
            strategy="afterInteractive"
            dangerouslySetInnerHTML={{
              __html: `
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('config', '${GA_ID}', {
                  page_path: window.location.pathname,
                  anonymize_ip: true,
                  allow_ad_personalization_signals: false,
                });
              `,
            }}
          />
        </>
      )}
    </>
  );
}

// Custom hook for tracking events with consent checking
export function useAnalytics() {
  const { canUseAnalytics } = useCookieConsent();

  const trackEvent = (eventName: string, parameters?: Record<string, any>) => {
    if (!canUseAnalytics()) {
      console.log('Analytics tracking blocked - no consent');
      return;
    }

    // Track with Google Analytics
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('event', eventName, parameters);
    }

    // Track with Vercel Analytics (automatic, no additional code needed)
    console.log('Event tracked:', eventName, parameters);
  };

  const trackPageView = (path: string) => {
    if (!canUseAnalytics()) {
      console.log('Page view tracking blocked - no consent');
      return;
    }

    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('config', GA_ID, {
        page_path: path,
      });
    }
  };

  return {
    trackEvent,
    trackPageView,
    canTrack: canUseAnalytics(),
  };
}

export default Analytics; 