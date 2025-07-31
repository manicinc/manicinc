// src/components/SenderNewsletterIframe.tsx
'use client';

import { useState } from 'react';

interface SenderNewsletterIframeProps {
  className?: string;
  formId?: string;
  height?: number;
}

export default function SenderNewsletterIframe({ 
  className = "",
  formId = "",
  height = 400
}: SenderNewsletterIframeProps) {
  const [isLoading, setIsLoading] = useState(true);

  return (
    <div className={`sender-iframe-container ${className}`}>
      {isLoading && (
        <div className="flex flex-col items-center justify-center py-8">
          <div className="w-8 h-8 border-3 border-accent-burgundy border-t-transparent rounded-full animate-spin mb-3"></div>
          <p className="text-sm text-text-secondary">Loading newsletter form...</p>
        </div>
      )}
      
      <iframe
        src={`https://stats.sender.net/forms/${formId}/view`}
        width="100%"
        height={height}
        frameBorder="0"
        scrolling="no"
        onLoad={() => setIsLoading(false)}
        className={`sender-form-iframe ${isLoading ? 'hidden' : 'block'} rounded-lg`}
        title="Newsletter Signup"
        style={{
          maxWidth: '100%',
          border: 'none',
          borderRadius: '12px',
          backgroundColor: 'transparent'
        }}
      />
      
      <p className="text-xs text-text-muted text-center mt-4">
        Secure form powered by Sender.net •{' '}
        <a 
          href="/privacy" 
          className="text-accent-burgundy hover:underline"
        >
          Privacy Policy
        </a>
      </p>
    </div>
  );
}