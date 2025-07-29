'use client';

import { useEffect, useState } from 'react';

interface SenderScriptProps {
  accountId?: string;
}

export function SenderScript({ accountId }: SenderScriptProps) {
  const [scriptLoaded, setScriptLoaded] = useState(false);

  useEffect(() => {
    // Only load if accountId is provided and script isn't already loaded
    if (!accountId || (window as any).sender) {
      if ((window as any).sender) setScriptLoaded(true);
      return;
    }

    let script: HTMLScriptElement | null = null;

    try {
      // Create and load the external Sender.net script directly
      script = document.createElement('script');
      script.async = true;
      script.src = 'https://cdn.sender.net/accounts_resources/universal.js';
      script.onload = () => {
        setScriptLoaded(true);
        // Initialize Sender with account ID after script loads
        setTimeout(() => {
          if ((window as any).sender && accountId) {
            try {
              (window as any).sender(accountId);
            } catch (err) {
              console.warn('Sender initialization failed:', err);
            }
          }
        }, 100);
      };
      script.onerror = () => {
        console.warn('Failed to load Sender.net script from CDN');
      };
      
      document.head.appendChild(script);
    } catch (error) {
      console.warn('Failed to load Sender.net script:', error);
    }

    return () => {
      // Cleanup if needed
      if (script && script.parentNode) {
        script.parentNode.removeChild(script);
      }
    };
  }, [accountId]);

  return null;
}
