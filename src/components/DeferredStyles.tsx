'use client';

import { useEffect } from 'react';

/**
 * Defers non-critical CSS by loading it after initial paint
 * Uses media="print" trick to load without blocking, then switches to "all"
 */
export default function DeferredStyles() {
  useEffect(() => {
    // Defer non-critical stylesheets
    const deferredStyles = [
      '/styles/animations.css',
      '/styles/blog-newsletter.css',
    ];

    deferredStyles.forEach((href) => {
      const link = document.createElement('link');
      link.rel = 'stylesheet';
      link.href = href;
      link.media = 'print'; // Load without blocking
      link.onload = () => {
        link.media = 'all'; // Switch to all media after load
      };
      document.head.appendChild(link);
    });
  }, []);

  return null;
}

