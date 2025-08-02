// src/components/SenderNewsletterUnified.tsx
'use client';

import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface SenderNewsletterUnifiedProps {
  formId?: string;
  className?: string;
  variant?: 'main' | 'blog';
  showTitle?: boolean;
}

export default function SenderNewsletterUnified({ 
  formId = process.env.NEXT_PUBLIC_SENDER_FORM_ID || '',
  className = '',
  variant = 'main',
  showTitle = true
}: SenderNewsletterUnifiedProps) {
  const [method, setMethod] = useState<'iframe' | 'button' | 'loading'>('loading');
  const [iframeError, setIframeError] = useState(false);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const checkTimeoutRef = useRef<NodeJS.Timeout>();

  useEffect(() => {
    // Check if iframe loads successfully
    const checkIframeLoad = () => {
      if (iframeRef.current) {
        // Try to access iframe content (will fail cross-origin but that's ok)
        try {
          // If we can access the iframe, it loaded
          const iframeDoc = iframeRef.current.contentDocument || iframeRef.current.contentWindow?.document;
          if (iframeDoc) {
            setMethod('iframe');
            console.log('✅ Iframe loaded successfully');
          }
        } catch (e) {
          // Cross-origin error is expected and means iframe loaded
          setMethod('iframe');
          console.log('✅ Iframe loaded (cross-origin)');
        }
      }
    };

    // Set a timeout to fallback to button if iframe doesn't load
    checkTimeoutRef.current = setTimeout(() => {
      if (method === 'loading') {
        console.log('⏱️ Iframe timeout, falling back to button');
        setMethod('button');
      }
    }, 5000); // 5 second timeout

    // Check immediately and after a delay
    checkIframeLoad();
    const checkInterval = setInterval(checkIframeLoad, 500);

    return () => {
      if (checkTimeoutRef.current) clearTimeout(checkTimeoutRef.current);
      clearInterval(checkInterval);
    };
  }, [method]);

  // Validate form ID
  if (!formId || formId.trim() === '') {
    return (
      <div className={`${className} p-8 bg-yellow-50 border border-yellow-200 rounded-lg text-center`}>
        <p className="text-yellow-800 font-semibold mb-2">Newsletter form not configured</p>
        <p className="text-yellow-600 text-sm">
          Please set NEXT_PUBLIC_SENDER_FORM_ID in your environment variables.
        </p>
      </div>
    );
  }

  const handleIframeError = () => {
    console.log('❌ Iframe failed to load');
    setIframeError(true);
    setMethod('button');
  };

  const handleIframeLoad = () => {
    console.log('✅ Iframe onload event fired');
    if (checkTimeoutRef.current) clearTimeout(checkTimeoutRef.current);
    setMethod('iframe');
  };

  // Newsletter button component
  const NewsletterButton = () => (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="text-center space-y-6"
    >
      {showTitle && (
        <div>
          <h3 className="text-2xl font-display font-bold text-text-primary mb-3">
            {variant === 'blog' ? 'Join The Looking Glass' : 'Subscribe to Our Newsletter'}
          </h3>
          <p className="text-text-secondary">
            {variant === 'blog' 
              ? 'Get weekly insights on digital consciousness and creative technology.'
              : 'Stay updated with our latest insights and announcements.'
            }
          </p>
        </div>
      )}
      
      <div className="space-y-4">
        <a
          href={`https://app.sender.net/forms/${formId}`}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-3 px-8 py-4 bg-accent-burgundy text-white rounded-lg hover:bg-accent-burgundy/90 transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                  d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
          </svg>
          <span className="font-semibold">Subscribe Now</span>
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                  d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
          </svg>
        </a>
        
        <p className="text-xs text-text-muted">
          Opens in a new secure window. We respect your privacy.
        </p>
      </div>
      
      {iframeError && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-md"
        >
          <p className="text-sm text-blue-800">
            <strong>Note:</strong> The embedded form couldn&apos;t load. This might be due to browser privacy settings or ad blockers. 
            Click the button above to subscribe directly.
          </p>
        </motion.div>
      )}
    </motion.div>
  );

  return (
    <div className={`${className} sender-newsletter-unified`}>
      <AnimatePresence mode="wait">
        {method === 'loading' && (
          <motion.div
            key="loading"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="relative"
          >
            {/* Hidden iframe that we're testing */}
            <div style={{ position: 'absolute', left: '-9999px', width: '1px', height: '1px', overflow: 'hidden' }}>
              <iframe
                ref={iframeRef}
                src={`https://app.sender.net/forms/${formId}/embedded`}
                onLoad={handleIframeLoad}
                onError={handleIframeError}
                title="Newsletter Test"
              />
            </div>
            
            {/* Loading state */}
            <div className="flex flex-col items-center justify-center py-12 space-y-4">
              <div className="relative">
                <div className="w-12 h-12 border-3 border-gray-200 rounded-full"></div>
                <div className="w-12 h-12 border-3 border-accent-burgundy border-t-transparent rounded-full animate-spin absolute inset-0"></div>
              </div>
              <p className="text-text-secondary text-sm">Loading newsletter form...</p>
            </div>
          </motion.div>
        )}

        {method === 'iframe' && (
          <motion.div
            key="iframe"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.3 }}
          >
            <iframe
              src={`https://app.sender.net/forms/${formId}/embedded`}
              width="100%"
              height="500"
              frameBorder="0"
              className="rounded-lg shadow-inner"
              style={{ 
                border: 'none',
                width: '100%',
                minHeight: '480px',
                maxHeight: '600px',
                backgroundColor: 'transparent'
              }}
              title="Newsletter Signup Form"
              loading="lazy"
              sandbox="allow-forms allow-scripts allow-same-origin allow-popups"
            />
            
            {/* Fallback link below iframe */}
            <div className="mt-4 text-center">
              <a
                href={`https://app.sender.net/forms/${formId}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-text-muted hover:text-accent-burgundy transition-colors"
              >
                Having trouble? Open form in new window →
              </a>
            </div>
          </motion.div>
        )}

        {method === 'button' && (
          <motion.div
            key="button"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
          >
            <NewsletterButton />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// Simple iframe-only version for guaranteed compatibility
export function SenderIframeSimple({ 
  formId = process.env.NEXT_PUBLIC_SENDER_FORM_ID || '',
  height = 500,
  className = ''
}: { 
  formId?: string;
  height?: number;
  className?: string;
}) {
  if (!formId) {
    return <div>Newsletter form not configured</div>;
  }

  return (
    <div className={`sender-iframe-simple ${className}`}>
      <iframe
        src={`https://app.sender.net/forms/${formId}/embedded`}
        width="100%"
        height={height}
        frameBorder="0"
        style={{ 
          border: 'none',
          width: '100%',
          minHeight: `${height}px`,
          borderRadius: '8px'
        }}
        title="Newsletter Signup"
        loading="lazy"
      />
    </div>
  );
}

// Button-only version for maximum compatibility
export function SenderButtonOnly({ 
  formId = process.env.NEXT_PUBLIC_SENDER_FORM_ID || '',
  text = 'Subscribe to Newsletter',
  className = '',
  variant = 'primary' as 'primary' | 'secondary' | 'minimal'
}: { 
  formId?: string;
  text?: string;
  className?: string;
  variant?: 'primary' | 'secondary' | 'minimal';
}) {
  if (!formId) {
    return null;
  }

  const variantStyles = {
    primary: 'px-8 py-4 bg-accent-burgundy text-white rounded-lg hover:bg-accent-burgundy/90 shadow-lg hover:shadow-xl transform hover:scale-105',
    secondary: 'px-6 py-3 bg-bg-secondary text-text-primary border border-border rounded-lg hover:bg-bg-tertiary',
    minimal: 'text-accent-burgundy hover:text-accent-highlight underline'
  };

  return (
    <a
      href={`https://app.sender.net/forms/${formId}`}
      target="_blank"
      rel="noopener noreferrer"
      className={`inline-flex items-center gap-2 transition-all duration-200 ${variantStyles[variant]} ${className}`}
    >
      <span>{text}</span>
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
              d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
      </svg>
    </a>
  );
}