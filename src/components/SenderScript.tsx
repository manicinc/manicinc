'use client';

import { useEffect } from 'react';

interface SenderScriptProps {
  accountId?: string;
}

export function SenderScript({ accountId }: SenderScriptProps) {
  useEffect(() => {
    // Only load if accountId is provided
    if (!accountId) {
      console.warn('SenderScript: No accountId provided');
      return;
    }

    // Check if script is already loaded
    if (typeof window !== 'undefined' && (window as any).sender) {
      console.log('Sender script already loaded');
      // Initialize with account ID if not already initialized
      try {
        (window as any).sender(accountId);
      } catch (e) {
        console.error('Error initializing Sender:', e);
      }
      return;
    }

    try {
      // Load the Sender script
      const script = document.createElement('script');
      script.src = 'https://cdn.sender.net/accounts_resources/universal.js';
      script.async = true;
      
      script.onload = () => {
        console.log('Sender script loaded successfully');
        
        // Initialize Sender after script loads
        if ((window as any).sender) {
          try {
            (window as any).sender(accountId);
            console.log('Sender initialized with account:', accountId);
          } catch (e) {
            console.error('Error initializing Sender after load:', e);
          }
        }
      };
      
      script.onerror = () => {
        console.error('Failed to load Sender script');
      };
      
      document.head.appendChild(script);
      
      // Cleanup
      return () => {
        // Don't remove the script as it might be used by other components
        console.log('SenderScript cleanup');
      };
    } catch (error) {
      console.error('Failed to load Sender.net script:', error);
    }
  }, [accountId]);

  return null;
}