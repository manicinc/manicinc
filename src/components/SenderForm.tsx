'use client';

import { useEffect, useRef, useState } from 'react';

interface SenderFormProps {
  formId: string;
  className?: string;
}

export default function SenderForm({ formId, className = '' }: SenderFormProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const formInitialized = useRef(false);
  const [showFallback, setShowFallback] = useState(false);

  useEffect(() => {
    // Prevent double initialization
    if (formInitialized.current) return;
    
    let attempts = 0;
    const maxAttempts = 30;
    
    const initializeForm = () => {
      attempts++;
      
      // Check if senderForms is available
      if (!window.senderForms || !window.senderForms.render) {
        if (attempts >= maxAttempts) {
          console.log('❌ Timeout waiting for senderForms');
          setShowFallback(true);
        }
        return false;
      }
      
      // Only initialize once
      if (formInitialized.current || !containerRef.current) return true;
      
      try {
        console.log('🎨 Initializing Sender form...');
        
        // Create form div if it doesn't exist
        let formDiv = containerRef.current.querySelector('.sender-form-field');
        if (!formDiv) {
          formDiv = document.createElement('div');
          formDiv.className = 'sender-form-field';
          formDiv.setAttribute('data-sender-form-id', formId);
          // Cast to HTMLElement to access style property
          (formDiv as HTMLElement).style.textAlign = 'left';
          containerRef.current.appendChild(formDiv);
        }
        
        // Mark as initialized BEFORE calling render to prevent double render
        formInitialized.current = true;
        
        // Render the form
        window.senderForms.render(formId);
        console.log('✅ Form render called');
        
        // Check if it worked after a delay
        setTimeout(() => {
          const hasContent = containerRef.current?.querySelector('iframe, form, input');
          if (!hasContent) {
            console.log('⚠️ Form did not render');
            setShowFallback(true);
          }
        }, 2000);
        
        return true;
      } catch (error) {
        console.error('❌ Error rendering form:', error);
        setShowFallback(true);
        return true;
      }
    };

    // Try immediately if senderForms exists
    if (window.senderFormsLoaded) {
      initializeForm();
    }

    // Set up polling
    const interval = setInterval(() => {
      if (initializeForm()) {
        clearInterval(interval);
      }
    }, 500);

    // Listen for the onSenderFormsLoaded event
    const handleLoaded = () => initializeForm();
    window.addEventListener('onSenderFormsLoaded', handleLoaded);

    // Cleanup
    return () => {
      clearInterval(interval);
      window.removeEventListener('onSenderFormsLoaded', handleLoaded);
      // Don't destroy the form on cleanup to prevent React conflicts
    };
  }, [formId]);

  if (showFallback) {
    return (
      <div className={`${className} text-center p-6 bg-gray-50 rounded-lg`}>
        <p className="mb-4">Subscribe to our newsletter</p>
        <a
          href={`https://stats.sender.net/forms/${formId}/view`}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block px-6 py-3 bg-accent-burgundy text-white rounded hover:bg-accent-burgundy/90"
        >
          Subscribe Here →
        </a>
      </div>
    );
  }

  return (
    <div className={className}>
      {/* IMPORTANT: This div should never be re-rendered by React */}
      <div 
        ref={containerRef}
        style={{ minHeight: '400px' }}
        // Prevent React from managing this div's children
        suppressHydrationWarning
      />
    </div>
  );
}