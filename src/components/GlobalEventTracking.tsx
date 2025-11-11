'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { useAnalytics } from '@/components/Analytics';

export default function GlobalEventTracking() {
  const pathname = usePathname();
  const { trackPageView, trackEvent, setUserTag, canTrack } = useAnalytics();
  const videoQuartiles = new WeakMap<HTMLMediaElement, Set<string>>();

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

      // Code block copy button instrumentation
      const copyBtn = target.closest('[data-copy], .copy-button, .code-copy') as HTMLElement | null;
      if (copyBtn) {
        const id = copyBtn.id || '';
        const text = (copyBtn.textContent || '').trim().slice(0, 40);
        trackEvent('code_copy_click', { id, text });
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

    const handleTimeUpdate = (e: Event) => {
      const el = e.target as HTMLMediaElement | null;
      if (!el || !el.duration || !isFinite(el.duration)) return;
      const fired = videoQuartiles.get(el) || new Set<string>();
      const p = (el.currentTime / el.duration) * 100;
      const marks: [number, string][] = [[25, 'q1'], [50, 'q2'], [75, 'q3'], [99, 'q4']];
      for (const [percent, key] of marks) {
        if (p >= percent && !fired.has(key)) {
          fired.add(key);
          videoQuartiles.set(el, fired);
          trackEvent('media_progress', {
            quartile: key,
            src: (el.currentSrc || el.src || '').toString(),
            duration: Math.round(el.duration || 0)
          });
        }
      }
    };

    document.addEventListener('click', handleClick);
    document.addEventListener('copy', handleCopy);
    document.addEventListener('play', handleMedia, true);
    document.addEventListener('pause', handleMedia, true);
    document.addEventListener('timeupdate', handleTimeUpdate, true);

    return () => {
      document.removeEventListener('click', handleClick);
      document.removeEventListener('copy', handleCopy);
      document.removeEventListener('play', handleMedia, true);
      document.removeEventListener('pause', handleMedia, true);
      document.removeEventListener('timeupdate', handleTimeUpdate, true);
    };
  }, [canTrack, trackEvent]);

  return null;
}


