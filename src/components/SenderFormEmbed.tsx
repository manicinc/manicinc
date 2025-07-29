'use client';

import { useEffect, useRef } from 'react';

interface SenderFormEmbedProps {
  formId?: string;
  className?: string;
}

export function SenderFormEmbed({ 
  formId = process.env.NEXT_PUBLIC_SENDER_FORM_ID || '', 
  className = '' 
}: SenderFormEmbedProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const scriptLoadedRef = useRef(false);

  useEffect(() => {
    if (!formId || scriptLoadedRef.current) return;

    // Create the form container
    if (containerRef.current) {
      containerRef.current.innerHTML = `<div data-sender-form-id="${formId}"></div>`;
    }

    // Load Sender.net script if not already loaded
    if (!window.Sender && !document.querySelector('script[src*="sender.net"]')) {
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
      scriptLoadedRef.current = true;
    } else if (window.Sender) {
      // If script already loaded, just initialize the form
      window.Sender('form', formId);
    }

  }, [formId]);

  if (!formId) {
    return (
      <div className={`p-6 bg-bg-secondary rounded-lg border border-border ${className}`}>
        <p className="text-text-muted text-center">
          Newsletter signup temporarily unavailable.
          <br />
          <a href="mailto:team@manic.agency" className="text-accent-burgundy hover:underline">
            Email us to subscribe manually
          </a>
        </p>
      </div>
    );
  }

  return (
    <div 
      ref={containerRef}
      className={`sender-form-wrapper ${className}`}
      style={{
        // Override Sender.net default styles to match your theme
        '--sender-primary-color': '#b66880',
        '--sender-secondary-color': '#7ea196',
        '--sender-text-color': 'var(--text-primary)',
        '--sender-background-color': 'var(--bg-primary)',
        '--sender-border-color': 'var(--border)',
      } as React.CSSProperties}
    >
      {/* Loading placeholder */}
      <div className="animate-pulse">
        <div className="h-12 bg-bg-tertiary rounded mb-3"></div>
        <div className="h-10 bg-bg-tertiary rounded"></div>
      </div>
    </div>
  );
}

// Global type augmentation for Sender
declare global {
  interface Window {
    Sender: any;
  }
}
