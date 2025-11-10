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
      // Register service worker
      navigator.serviceWorker
        .register('/sw.js')
        .then((registration) => {
          console.log('✅ Service Worker registered:', registration.scope);

          // Check for updates periodically
          setInterval(() => {
            registration.update();
          }, 60 * 60 * 1000); // Check every hour
        })
        .catch((error) => {
          console.error('❌ Service Worker registration failed:', error);
        });

      // Listen for updates
      navigator.serviceWorker.addEventListener('controllerchange', () => {
        console.log('🔄 Service Worker updated - reloading page');
        window.location.reload();
      });
    }
  }, []);

  return null;
}

