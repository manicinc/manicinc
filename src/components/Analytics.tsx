'use client';

import React, { useEffect } from 'react';
import { Analytics as VercelAnalytics } from '@vercel/analytics/react';
import { SpeedInsights } from '@vercel/speed-insights/next';
import Script from 'next/script';
import Clarity from '@microsoft/clarity';
import { useCookieConsent } from '@/hooks/useCookieConsent';

const GA_ID = process.env.NEXT_PUBLIC_GA_ID;
const CLARITY_PROJECT_ID = process.env.NEXT_PUBLIC_CLARITY_PROJECT_ID;

export function Analytics() {
  const { canUseAnalytics } = useCookieConsent();

  useEffect(() => {
    // Initialize analytics if consent is given
    if (canUseAnalytics && typeof window !== 'undefined') {
      
      // Initialize Google Analytics if GA_ID is set
      if (GA_ID && !(window as any).gtag) {
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

      // Initialize Microsoft Clarity if CLARITY_PROJECT_ID is set
      if (CLARITY_PROJECT_ID && !(window as any).clarity) {
        try {
          Clarity.init(CLARITY_PROJECT_ID);
          // Give consent to Clarity for cookie usage
          Clarity.consent(true);
          console.log('Microsoft Clarity initialized with consent');
        } catch (error) {
          console.error('Failed to initialize Microsoft Clarity:', error);
        }
      }
    }
  }, [canUseAnalytics]);

  // Only render analytics components if consent is given
  if (!canUseAnalytics) {
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
    if (!canUseAnalytics) {
      console.log('Analytics tracking blocked - no consent');
      return;
    }

    // Track with Google Analytics
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('event', eventName, parameters);
    }

    // Track with Microsoft Clarity
    if (typeof window !== 'undefined' && CLARITY_PROJECT_ID) {
      try {
        Clarity.event(eventName);
        // Add custom tags if parameters provided
        if (parameters) {
          Object.entries(parameters).forEach(([key, value]) => {
            Clarity.setTag(key, String(value));
          });
        }
      } catch (error) {
        console.error('Clarity event tracking failed:', error);
      }
    }

    // Track with Vercel Analytics (automatic, no additional code needed)
    console.log('Event tracked:', eventName, parameters);
  };

  const trackPageView = (path: string, pageId?: string) => {
    if (!canUseAnalytics) {
      console.log('Page view tracking blocked - no consent');
      return;
    }

    // Google Analytics page view
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('config', GA_ID, {
        page_path: path,
      });
    }

    // Microsoft Clarity page identification
    if (typeof window !== 'undefined' && CLARITY_PROJECT_ID) {
      try {
        // Call identify for each page view for optimal tracking
        Clarity.identify(
          `user-${Date.now()}`, // custom-id (required) - using timestamp as fallback
          undefined, // custom-session-id (optional)
          pageId || path, // custom-page-id (optional)
          undefined // friendly-name (optional)
        );
      } catch (error) {
        console.error('Clarity page view tracking failed:', error);
      }
    }
  };

  const upgradeSession = (reason: string) => {
    if (!canUseAnalytics) {
      console.log('Session upgrade blocked - no consent');
      return;
    }

    if (typeof window !== 'undefined' && CLARITY_PROJECT_ID) {
      try {
        Clarity.upgrade(reason);
      } catch (error) {
        console.error('Clarity session upgrade failed:', error);
      }
    }
  };

  const setUserTag = (key: string, value: string | string[]) => {
    if (!canUseAnalytics) {
      console.log('User tagging blocked - no consent');
      return;
    }

    if (typeof window !== 'undefined' && CLARITY_PROJECT_ID) {
      try {
        Clarity.setTag(key, value);
      } catch (error) {
        console.error('Clarity user tagging failed:', error);
      }
    }
  };

  return {
    trackEvent,
    trackPageView,
    upgradeSession,
    setUserTag,
    canTrack: canUseAnalytics,
  };
}

export default Analytics; 