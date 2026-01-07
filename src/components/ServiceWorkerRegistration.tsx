// src/components/ServiceWorkerRegistration.tsx
"use client";

import { useEffect } from 'react';

export default function ServiceWorkerRegistration() {
  useEffect(() => {
    if (
      typeof window !== 'undefined' &&
      'serviceWorker' in navigator &&
      process.env.NODE_ENV === 'production'
    ) {
      // Register service worker with cache-busting query param
      // This ensures browsers fetch the latest sw.js on each page load
      navigator.serviceWorker
        .register(`/sw.js?v=${Date.now()}`)
        .then((registration) => {
          console.log('✅ Service Worker registered:', registration.scope);

          // Check for updates more frequently (every 5 minutes)
          setInterval(() => {
            registration.update();
          }, 5 * 60 * 1000); // Check every 5 minutes
        })
        .catch((error) => {
          console.error('❌ Service Worker registration failed:', error);
        });

      // Note: Removed controllerchange reload listener - it caused a refresh loop
      // when combined with clients.claim() in sw.js
    }
  }, []);

  return null;
}

