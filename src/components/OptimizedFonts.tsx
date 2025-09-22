'use client';

import { useEffect } from 'react';

export default function OptimizedFonts() {
  useEffect(() => {
    // Preload critical fonts
    const fontLinks = [
      {
        href: '/fonts/Mona-Sans.var.woff2',
        as: 'font',
        type: 'font/woff2',
        crossOrigin: 'anonymous',
      },
    ];

    fontLinks.forEach(font => {
      const link = document.createElement('link');
      link.rel = 'preload';
      link.href = font.href;
      link.as = font.as;
      link.type = font.type;
      link.crossOrigin = font.crossOrigin;
      document.head.appendChild(link);
    });

    // Add font-display: swap to Google Fonts
    const googleFontLinks = document.querySelectorAll('link[href*="fonts.googleapis.com"]');
    googleFontLinks.forEach((link: Element) => {
      const href = link.getAttribute('href');
      if (href && !href.includes('&display=')) {
        link.setAttribute('href', href + '&display=swap');
      }
    });
  }, []);

  return null;
}