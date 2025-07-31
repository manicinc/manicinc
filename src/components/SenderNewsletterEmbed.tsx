// src/components/SenderNewsletterEmbed.tsx
'use client';

import { useEffect, useRef, useState } from 'react';
import SenderNewsletterButton from './SenderNewsletterButton';

interface SenderNewsletterEmbedProps {
  className?: string;
  formId?: string;
  variant?: 'main' | 'blog';
  fallbackToButton?: boolean;
}

export default function SenderNewsletterEmbed({ 
  className = "",
  formId = process.env.NEXT_PUBLIC_SENDER_FORM_ID || '',
  variant = 'main',
  fallbackToButton = true
}: SenderNewsletterEmbedProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [status, setStatus] = useState<'loading' | 'success' | 'fallback'>('loading');
  const hasInitialized = useRef(false);

  useEffect(() => {
    console.log('📧 SenderNewsletterEmbed mounted', { formId, fallbackToButton });
    
    if (!formId) {
      console.error('📧 No form ID provided - check NEXT_PUBLIC_SENDER_FORM_ID env var');
      setStatus('fallback');
      return;
    }
    
    if (hasInitialized.current) {
      console.log('Already initialized, skipping');
      return;
    }
    
    if (!containerRef.current) {
      console.log('Container ref not ready');
      return;
    }
    
    hasInitialized.current = true;
    const container = containerRef.current;
    
    // Add the form HTML
    console.log('📧 Adding form HTML to container');
    container.innerHTML = `<div style="text-align: left" class="sender-form-field" data-sender-form-id="${formId}"></div>`;
    
    let attempts = 0;
    const maxAttempts = 20; // 10 seconds
    
    const checkAndRender = () => {
      attempts++;
      const sender = (window as any).sender;
      
      console.log(`📧 Attempt ${attempts}/${maxAttempts}:`, {
        senderExists: !!sender,
        senderType: typeof sender,
        formId
      });
      
      if (!sender || typeof sender !== 'function') {
        console.log('Sender not ready yet, will retry...');
        return;
      }
      
      try {
        // Try all methods to trigger rendering
        console.log('📧 Calling sender methods...');
        
        // Method 1: Basic call
        sender();
        
        // Method 2: Form-specific
        sender('form', formId);
        
        // Method 3: Render command
        sender('render');
        
        // Method 4: Re-scan
        sender('scan');
        
        console.log('📧 All sender methods called');
        
        // Check if form rendered after a delay
        setTimeout(() => {
          const formElements = container.querySelectorAll('input, textarea, button, iframe, form');
          const formField = container.querySelector('.sender-form-field');
          const hasChildren = formField && formField.children.length > 0;
          
          console.log('📧 Checking for form elements:', {
            formElementsCount: formElements.length,
            hasChildren,
            innerHTML: formField?.innerHTML.substring(0, 100)
          });
          
          if (formElements.length > 0 || hasChildren) {
            console.log('✅ Form successfully loaded!');
            setStatus('success');
          }
        }, 1000);
        
      } catch (error) {
        console.error('📧 Error calling sender methods:', error);
      }
    };
    
    // Start checking immediately
    console.log('📧 Starting form initialization...');
    checkAndRender();
    
    // Set up interval for retries
    const checkInterval = setInterval(() => {
      if (status !== 'loading' || attempts >= maxAttempts) {
        clearInterval(checkInterval);
        
        if (attempts >= maxAttempts && status === 'loading') {
          console.log('❌ Max attempts reached, showing fallback');
          setStatus('fallback');
        }
        return;
      }
      
      checkAndRender();
    }, 500);
    
    // Cleanup
    return () => {
      console.log('📧 Cleaning up interval');
      clearInterval(checkInterval);
    };
  }, [formId, status]);

  console.log('📧 Current status:', status);

  // Show button fallback
  if (status === 'fallback' && fallbackToButton) {
    console.log('📧 Showing button fallback');
    return <SenderNewsletterButton className={className} formId={formId} variant={variant} />;
  }

  // Show link fallback
  if (status === 'fallback' && !fallbackToButton) {
    return (
      <div className={`${className} text-center p-6 border border-border rounded-xl bg-bg-secondary`}>
        <p className="text-sm text-text-secondary mb-4">
          Newsletter form couldn&apos;t load. This might be due to ad blockers.
        </p>
        <a 
          href={formId ? `https://stats.sender.net/forms/${formId}/view` : '#'}
          target="_blank"
          rel="noopener noreferrer"
          className="text-accent-burgundy hover:underline font-medium"
        >
          Click here to subscribe →
        </a>
      </div>
    );
  }

  // Show the form container (either loading or with form)
  return (
    <div className={className}>
      <div 
        ref={containerRef}
        className="sender-form-container"
        data-form-status={status}
        style={{ 
          minHeight: status === 'loading' ? '150px' : 'auto',
          position: 'relative'
        }}
      >
        {status === 'loading' && (
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