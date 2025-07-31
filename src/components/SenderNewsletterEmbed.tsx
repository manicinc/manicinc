// src/components/SenderNewsletterEmbed.tsx
'use client';

import { useEffect, useRef, useState } from 'react';
import SenderNewsletterButton from './SenderNewsletterButton';

interface SenderNewsletterEmbedProps {
  className?: string;
  formId?: string;
  variant?: 'main' | 'blog';
  fallbackToButton?: boolean; // If true, shows button after timeout
}

export default function SenderNewsletterEmbed({ 
  className = "",
  formId = "",
  variant = 'main',
  fallbackToButton = true
}: SenderNewsletterEmbedProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [status, setStatus] = useState<'loading' | 'success' | 'fallback'>('loading');
  const initAttemptedRef = useRef(false);

  useEffect(() => {
    if (!containerRef.current || initAttemptedRef.current) return;
    initAttemptedRef.current = true;
    
    const container = containerRef.current;
    
    // Create form container
    const formContainer = document.createElement('div');
    formContainer.innerHTML = `<div style="text-align: left" class="sender-form-field" data-sender-form-id="${formId}"></div>`;
    container.appendChild(formContainer);
    
    let attempts = 0;
    const maxAttempts = 20; // 10 seconds total
    
    const tryInitialize = () => {
      attempts++;
      
      const sender = (window as any).sender;
      if (!sender) {
        console.log(`Attempt ${attempts}: Sender not loaded yet`);
        return false;
      }
      
      try {
        // Multiple initialization attempts
        console.log(`Attempt ${attempts}: Trying to render form ${formId}`);
        
        // Method 1: Direct call
        sender();
        
        // Method 2: Form-specific call
        sender('form', formId);
        
        // Method 3: Explicit render
        sender('render');
        
        // Method 4: Re-scan DOM
        sender('scan');
        
        // Check if form rendered after a short delay
        setTimeout(() => {
          const hasFormElements = container.querySelector('input, textarea, button, iframe, form');
          const formField = container.querySelector('.sender-form-field');
          
          if (hasFormElements) {
            console.log('✅ Form elements detected - embed successful!');
            setStatus('success');
          } else if (formField && formField.children.length > 0) {
            console.log('✅ Form container has children - embed successful!');
            setStatus('success');
          } else if (attempts >= maxAttempts) {
            console.log('❌ Max attempts reached - showing fallback');
            setStatus('fallback');
          }
        }, 500);
        
        return true;
      } catch (error) {
        console.error(`Attempt ${attempts} error:`, error);
        return false;
      }
    };
    
    // Initial attempt
    tryInitialize();
    
    // Retry every 500ms
    const retryInterval = setInterval(() => {
      if (status !== 'loading' || attempts >= maxAttempts) {
        clearInterval(retryInterval);
        if (attempts >= maxAttempts && status === 'loading') {
          setStatus('fallback');
        }
        return;
      }
      
      tryInitialize();
    }, 500);
    
    return () => clearInterval(retryInterval);
  }, [formId, status]);

  // Show button fallback if configured and embed failed
  if (status === 'fallback' && fallbackToButton) {
    return <SenderNewsletterButton className={className} formId={formId} variant={variant} />;
  }

  // Show direct link fallback if button fallback is disabled
  if (status === 'fallback' && !fallbackToButton) {
    return (
      <div className={`${className} text-center p-6 border border-border rounded-xl bg-bg-secondary`}>
        <p className="text-sm text-text-secondary mb-4">
          Newsletter form couldn&apos;t load. This might be due to ad blockers.
        </p>
        <a 
          href={`https://stats.sender.net/forms/${formId}/view`}
          target="_blank"
          rel="noopener noreferrer"
          className="text-accent-burgundy hover:underline font-medium"
        >
          Click here to subscribe →
        </a>
      </div>
    );
  }

  return (
    <div className={className}>
      <div 
        ref={containerRef}
        className="sender-form-container"
        style={{ 
          minHeight: status === 'loading' ? '150px' : 'auto',
          position: 'relative'
        }}
      >
        {status === 'loading' && (
          <div className="absolute inset-0 flex items-center justify-center">
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