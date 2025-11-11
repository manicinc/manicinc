'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { useAnalytics } from '@/components/Analytics';

export default function GlobalEventTracking() {
  const pathname = usePathname();
  const { trackPageView, trackEvent, setUserTag, canTrack } = useAnalytics();

  useEffect(() => {
    if (!canTrack) return;

    // Tag current route for segmentation
    setUserTag('route', pathname || '/');

    // Track SPA page view on route change
    trackPageView(pathname || '/', pathname || '/');
  }, [pathname, canTrack, trackPageView, setUserTag]);

  useEffect(() => {
    if (!canTrack) return;

    const handleClick = (event: MouseEvent) => {
      const target = event.target as HTMLElement | null;
      if (!target) return;

      const link = target.closest('a') as HTMLAnchorElement | null;
      if (link && link.href) {
        const href = link.href;

        // mailto/tel tracking
        if (href.startsWith('mailto:')) {
          trackEvent('contact_click', { method: 'email', href });
          return;
        }
        if (href.startsWith('tel:')) {
          trackEvent('contact_click', { method: 'phone', href });
          return;
        }

        // Outbound link tracking
        try {
          const url = new URL(href);
          if (url.origin !== window.location.origin) {
            trackEvent('outbound_click', {
              href,
              text: (link.textContent || '').trim().slice(0, 80),
              rel: link.rel || '',
              target: link.target || '',
            });
            return;
          }
        } catch {
          // Ignore invalid URL
        }
      }

      // CTA/buttons tracking (generic)
      const button = target.closest('button, .cta-button') as HTMLElement | null;
      if (button) {
        const id = button.id || '';
        const text = (button.textContent || '').trim().slice(0, 80);
        const classes = button.className || '';
        trackEvent('cta_click', { id, text, classes });
      }
    };

    const handleCopy = () => {
      const selection = window.getSelection?.()?.toString() || '';
      if (selection.length >= 12) {
        trackEvent('copy', { length: selection.length });
      }
    };

    const handleMedia = (e: Event) => {
      const el = e.target as HTMLMediaElement | null;
      if (!el) return;
      const src = (el.currentSrc || el.src || '').toString();
      const eventName = e.type === 'play' ? 'media_play' : e.type === 'pause' ? 'media_pause' : 'media_event';
      trackEvent(eventName, { src, duration: Math.round(el.duration || 0) });
    };

    document.addEventListener('click', handleClick);
    document.addEventListener('copy', handleCopy);
    document.addEventListener('play', handleMedia, true);
    document.addEventListener('pause', handleMedia, true);

    return () => {
      document.removeEventListener('click', handleClick);
      document.removeEventListener('copy', handleCopy);
      document.removeEventListener('play', handleMedia, true);
      document.removeEventListener('pause', handleMedia, true);
    };
  }, [canTrack, trackEvent]);

  return null;
}


