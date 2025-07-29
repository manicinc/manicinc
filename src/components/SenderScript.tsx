'use client';

import { useEffect } from 'react';

interface SenderScriptProps {
  formId?: string;
}

export function SenderScript({ formId }: SenderScriptProps) {
  useEffect(() => {
    // Only load if formId is provided and script isn't already loaded
    if (!formId || (window as any).sender) {
      return;
    }

    // Load Sender.net script
    const script = document.createElement('script');
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
      sender('${formId}');
    `;
    
    document.head.appendChild(script);

    return () => {
      // Cleanup if needed
      if (script.parentNode) {
        script.parentNode.removeChild(script);
      }
    };
  }, [formId]);

  return null;
}
