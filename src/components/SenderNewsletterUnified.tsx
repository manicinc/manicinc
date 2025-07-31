// src/components/SenderNewsletterUnified.tsx
'use client';

import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { useAnalytics } from './Analytics';

type FormMode = 'embed' | 'iframe' | 'button';

interface SenderNewsletterUnifiedProps {
  className?: string;
  formId?: string;
  variant?: 'main' | 'blog';
}

export default function SenderNewsletterUnified({ 
  className = "",
  formId = process.env.NEXT_PUBLIC_SENDER_FORM_ID || '',
  variant = 'main'
}: SenderNewsletterUnifiedProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [mode, setMode] = useState<FormMode>('embed');
  const [isLoading, setIsLoading] = useState(true);
  const hasInitialized = useRef(false);
  const { trackEvent, canTrack } = useAnalytics();

  useEffect(() => {
    console.log('📧 SenderNewsletterUnified starting', { formId, mode });
    
    if (!formId) {
      console.error('📧 No form ID - check NEXT_PUBLIC_SENDER_FORM_ID');
      setMode('button');
      setIsLoading(false);
      return;
    }
    
    if (hasInitialized.current || mode !== 'embed') return;
    hasInitialized.current = true;
    
    const container = containerRef.current;
    if (!container) return;
    
    // Try embed form
    console.log('📧 Trying embed form...');
    container.innerHTML = `<div style="text-align: left" class="sender-form-field" data-sender-form-id="${formId}"></div>`;
    
    let attempts = 0;
    const maxAttempts = 16; // 8 seconds for embed
    
    const tryEmbed = () => {
      attempts++;
      const sender = (window as any).sender;
      
      if (!sender || typeof sender !== 'function') {
        console.log(`📧 Embed attempt ${attempts}: Sender not ready`);
        return false;
      }
      
      try {
        // Try all render methods
        sender();
        sender('form', formId);
        sender('render');
        sender('scan');
        
        // Check if rendered
        setTimeout(() => {
          const hasForm = container.querySelector('input, textarea, button, iframe, form');
          const formField = container.querySelector('.sender-form-field');
          const hasChildren = formField && formField.children.length > 0;
          
          if (hasForm || hasChildren) {
            console.log('✅ Embed form loaded!');
            setIsLoading(false);
          }
        }, 500);
        
        return true;
      } catch (error) {
        console.error('📧 Embed error:', error);
        return false;
      }
    };
    
    // Try embed immediately
    tryEmbed();
    
    // Retry embed
    const embedInterval = setInterval(() => {
      if (attempts >= maxAttempts) {
        clearInterval(embedInterval);
        console.log('❌ Embed failed, trying iframe...');
        setMode('iframe');
        setIsLoading(true);
        return;
      }
      
      tryEmbed();
    }, 500);
    
    return () => clearInterval(embedInterval);
  }, [formId, mode]);

  // Try iframe after embed fails
  useEffect(() => {
    if (mode !== 'iframe') return;
    
    console.log('📧 Testing iframe...');
    
    // Test if iframe will work
    const testTimeout = setTimeout(() => {
      // Since we know iframe is blocked by X-Frame-Options, skip to button
      console.log('❌ Iframe blocked (X-Frame-Options), showing button...');
      setMode('button');
      setIsLoading(false);
    }, 1000);
    
    return () => clearTimeout(testTimeout);
  }, [mode]);

  // Button click handler
  const handleButtonClick = () => {
    if (canTrack) {
      trackEvent('newsletter_button_click', { variant, formId, fallback_reason: 'all_methods_failed' });
    }
  };

  // Render based on mode
  if (mode === 'button') {
    return (
      <div className={`text-center ${className}`}>
        <h3 className="text-lg font-semibold text-text-primary mb-3">
          Subscribe to Our Newsletter
        </h3>
        <p className="text-sm text-text-secondary mb-6 max-w-md mx-auto">
          Join our digital collective for exclusive insights on AI, metaverse architecture, 
          and cutting-edge technology trends.
        </p>
        
        <motion.a 
          href={formId ? `https://stats.sender.net/forms/${formId}/view` : '#'}
          target="_blank"
          rel="noopener noreferrer"
          onClick={handleButtonClick}
          className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-accent-burgundy to-accent-sage text-white rounded-xl hover:opacity-90 transition-all font-medium shadow-lg hover:shadow-xl"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <span>Subscribe Now</span>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M7 17L17 7M17 7H7M17 7V17" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </motion.a>
        
        <div className="mt-6 flex items-center justify-center gap-6 text-xs text-text-secondary">
          <div className="flex items-center gap-1">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M12 11V17M8 14L12 18L16 14M20 6H4L12 13L20 6Z" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <span>Weekly insights</span>
          </div>
          <div className="flex items-center gap-1">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M9 11L12 14L22 4M21 12V19C21 20 20 21 19 21H5C4 21 3 20 3 19V5C3 4 4 3 5 3H16" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <span>No spam</span>
          </div>
          <div className="flex items-center gap-1">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M12 2L4 7V11C4 16 7 20 12 21C17 20 20 16 20 11V7L12 2Z" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <span>Privacy first</span>
          </div>
        </div>
      </div>
    );
  }

  if (mode === 'iframe') {
    return (
      <div className={className}>
        {isLoading && (
          <div className="flex flex-col items-center justify-center py-8">
            <div className="w-8 h-8 border-3 border-accent-burgundy border-t-transparent rounded-full animate-spin mb-3"></div>
            <p className="text-sm text-text-secondary">Trying iframe...</p>
          </div>
        )}
        
        <iframe
          src={`https://stats.sender.net/forms/${formId}/view`}
          width="100%"
          height="400"
          frameBorder="0"
          scrolling="no"
          onLoad={() => setIsLoading(false)}
          onError={() => {
            console.log('❌ Iframe failed, showing button...');
            setMode('button');
          }}
          className={`sender-form-iframe ${isLoading ? 'hidden' : 'block'} rounded-lg`}
          title="Newsletter Signup"
          style={{
            maxWidth: '100%',
            border: 'none',
            borderRadius: '12px',
            backgroundColor: 'transparent'
          }}
        />
      </div>
    );
  }

  // Default: embed mode
  return (
    <div className={className}>
      <div 
        ref={containerRef}
        className="sender-form-container"
        style={{ 
          minHeight: isLoading ? '150px' : 'auto',
          position: 'relative'
        }}
      >
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="text-center">
              <div className="w-6 h-6 border-2 border-accent-burgundy border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
              <p className="text-xs text-text-secondary">Loading form...</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}