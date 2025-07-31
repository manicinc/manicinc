'use client';

import { useEffect } from 'react';

interface SenderScriptProps {
  accountId?: string;
}

export function SenderScript({ accountId }: SenderScriptProps) {
  useEffect(() => {
    // Only load if accountId is provided
    if (!accountId) {
      console.log('Sender.net: No account ID provided');
      return;
    }

    // Check if script is already loaded
    if (typeof window !== 'undefined' && (window as any).sender) {
      console.log('Sender.net: Script already loaded');
      return;
    }

    try {
      // Create script element
      const script = document.createElement('script');
      script.async = true;
      
      // Use Sender.net's initialization code
      script.innerHTML = `
        (function (s, e, n, d, er) {
          s['Sender'] = er;
          s[er] = s[er] || function () {
            (s[er].q = s[er].q || []).push(arguments)
          };
          s[er].l = 1 * new Date().getTime();
          var a = e.createElement(n),
              m = e.getElementsByTagName(n)[0];
          a.async = 1;
          a.src = d;
          a.onload = function() {
            console.log('Sender.net: Script loaded successfully');
            // Initialize with account ID
            if (window.sender && typeof window.sender === 'function') {
              try {
                window.sender('${accountId}');
                console.log('Sender.net: Initialized with account:', '${accountId}');
              } catch (e) {
                console.error('Sender.net: Initialization error:', e);
              }
            }
          };
          a.onerror = function(e) {
            console.error('Sender.net: Failed to load script:', e);
          };
          m.parentNode.insertBefore(a, m);
          
          // Override XMLHttpRequest to catch 404 errors
          var originalOpen = XMLHttpRequest.prototype.open;
          XMLHttpRequest.prototype.open = function(method, url) {
            if (url && url.includes('render.json')) {
              console.warn('Sender.net: Blocking broken render.json request');
              return;
            }
            return originalOpen.apply(this, arguments);
          };
        })(window, document, 'script', 'https://cdn.sender.net/accounts_resources/universal.js', 'sender');
      `;
      
      document.head.appendChild(script);
      
    } catch (error) {
      console.error('Sender.net: Script injection error:', error);
    }
  }, [accountId]);

  return null;
}