'use client';

import { useEffect } from 'react';

interface SenderScriptProps {
  accountId?: string;
}

export function SenderScript({ accountId }: SenderScriptProps) {
  useEffect(() => {
    // Only load if accountId is provided and script isn't already loaded
    if (!accountId || (window as any).sender) {
      return;
    }

    let script: HTMLScriptElement | null = null;

    try {
      // Load Sender.net script
      script = document.createElement('script');
      script.async = true;
      script.innerHTML = `
        (function (s, e, n, d, er) {
          s['Sender'] = er;
          s[er] = s[er] || function () {
            (s[er].q = s[er].q || []).push(arguments)
          }, s[er].l = 1 * new Date();
          var a = e.createElement(n),
              m = e.getElementsByTagName(n)[0];
          a.async = 1;
          a.src = d;
          m.parentNode.insertBefore(a, m)
        })(window, document, 'script', 'https://cdn.sender.net/accounts_resources/universal.js', 'sender');
        sender('${accountId}');
      `;
      
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
