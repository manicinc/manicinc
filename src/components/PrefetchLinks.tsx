// src/components/PrefetchLinks.tsx
"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

/**
 * Prefetches links on hover and when they become visible
 * Significantly improves perceived navigation speed
 */
export default function PrefetchLinks() {
  const router = useRouter();

  useEffect(() => {
    // Only run in browser
    if (typeof window === 'undefined') return;

    // Defer prefetch setup to idle time to reduce hydration cost
    const setupPrefetch = () => {
      const prefetchedUrls = new Set<string>();

      // Prefetch link on hover
      const handleMouseEnter = (e: MouseEvent) => {
        const target = e.target as HTMLElement;
        const link = target.closest('a[href^="/"]') as HTMLAnchorElement;
        
        if (link && link.href && !prefetchedUrls.has(link.href)) {
          const url = new URL(link.href);
          if (url.origin === window.location.origin) {
            prefetchedUrls.add(link.href);
            router.prefetch(url.pathname);
          }
        }
      };

      // Prefetch visible links using IntersectionObserver
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              const link = entry.target as HTMLAnchorElement;
              if (link.href && !prefetchedUrls.has(link.href)) {
                const url = new URL(link.href);
                if (url.origin === window.location.origin) {
                  prefetchedUrls.add(link.href);
                  // Delay prefetch slightly to prioritize critical resources
                  setTimeout(() => router.prefetch(url.pathname), 100);
                }
              }
            }
          });
        },
        {
          rootMargin: '50px', // Start prefetching slightly before visible
        }
      );

      // Observe all internal links
      const observeLinks = () => {
        const links = document.querySelectorAll('a[href^="/"]');
        links.forEach((link) => observer.observe(link));
      };

      // Initial observation
      observeLinks();

      // Re-observe on DOM changes (for dynamic content)
      const mutationObserver = new MutationObserver(() => {
        observeLinks();
      });

      mutationObserver.observe(document.body, {
        childList: true,
        subtree: true,
      });

      // Add hover listeners
      document.addEventListener('mouseover', handleMouseEnter, { passive: true });

      // Return cleanup function
      return () => {
        observer.disconnect();
        mutationObserver.disconnect();
        document.removeEventListener('mouseover', handleMouseEnter);
      };
    };

    // Use requestIdleCallback if available, otherwise setTimeout
    let cleanup: (() => void) | undefined;
    if ('requestIdleCallback' in window) {
      const idleId = requestIdleCallback(() => {
        cleanup = setupPrefetch();
      }, { timeout: 2000 });
      return () => {
        cancelIdleCallback(idleId);
        cleanup?.();
      };
    } else {
      // Fallback for browsers without requestIdleCallback
      const timeoutId = setTimeout(() => {
        cleanup = setupPrefetch();
      }, 1000);
      return () => {
        clearTimeout(timeoutId);
        cleanup?.();
      };
    }
  }, [router]);

  return null; // This component doesn't render anything
}

