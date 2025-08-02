// src/components/EmailOctopusForm.tsx
'use client';

import { useEffect } from 'react';

interface EmailOctopusFormProps {
  formId: string;
  className?: string;
  variant?: 'main' | 'blog';
  showTitle?: boolean;
}

export default function EmailOctopusForm({ 
  formId,
  className = '',
  variant = 'main',
  showTitle = true
}: EmailOctopusFormProps) {

  useEffect(() => {
    // Skip script injection during SSR or in test environments
    if (typeof window === 'undefined') return;
    
    // Get the container
    const container = document.querySelector('.emailoctopus-script-container');
    if (!container) return;

    // Clear any existing content to prevent duplicates
    container.innerHTML = '';

    // Create and inject the EmailOctopus script
    const script = document.createElement('script');
    script.src = `https://eocampaign1.com/form/${formId}.js`;
    script.async = true;
    script.setAttribute('data-form', formId);
    
    // Add error handling for CI/CD environments
    script.onerror = () => {
      console.warn('EmailOctopus script failed to load - this is expected in build/test environments');
    };

    // Append to container instead of body for better cleanup
    container.appendChild(script);

    // Cleanup function to prevent memory leaks
    return () => {
      if (container && script.parentNode === container) {
        container.removeChild(script);
      }
    };
  }, [formId]);

  const copy = variant === 'blog' ? {
    title: 'Join The Looking Glass',
    subtitle: 'Weekly insights on digital consciousness and creative technology.'
  } : {
    title: 'Subscribe to Our Newsletter',
    subtitle: 'Strategic intelligence on digital transformation and innovation.'
  };

  return (
    <div className={`email-octopus-form ${className}`}>
      {showTitle && (
        <div className="text-center mb-6">
          <h3 className="text-2xl font-display font-bold text-text-primary mb-3">
            {copy.title}
          </h3>
          <p className="text-text-secondary">
            {copy.subtitle}
          </p>
        </div>
      )}

      {/* Container for the EmailOctopus script */}
      <div className="emailoctopus-script-container" />

      {/* Privacy notice */}
      <p className="mt-4 text-xs text-text-muted text-center">
        We respect your privacy. Unsubscribe at any time.
        {' '}
        <a href="/privacy" className="text-accent-burgundy hover:text-accent-highlight underline">
          Privacy Policy
        </a>
      </p>
    </div>
  );
}