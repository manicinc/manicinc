// ==========================================
// FINAL SOLUTION - Works with just window.sender
// ==========================================

// FILE 1: components/SenderNewsletterUnified.tsx
'use client';

import { useEffect, useRef, useState } from 'react';

interface SenderNewsletterUnifiedProps {
  className?: string;
  formId?: string;
  variant?: 'main' | 'blog';
}

export default function SenderNewsletterUnified({ 
  className = "",
  formId = process.env.NEXT_PUBLIC_SENDER_FORM_ID || 'dBBEwn',
  variant = 'main'
}: SenderNewsletterUnifiedProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [showFallback, setShowFallback] = useState(false);
  const formCreated = useRef(false);
  const renderAttempts = useRef(0);

  useEffect(() => {
    // Only run once
    if (formCreated.current) return;
    formCreated.current = true;

    // Create form HTML immediately
    if (containerRef.current) {
      containerRef.current.innerHTML = `
        <div style="text-align: left" class="sender-form-field" data-sender-form-id="${formId}"></div>
      `;
      console.log('✅ Form HTML added to DOM');
    }

    // Function to trigger Sender
    const triggerSender = () => {
      renderAttempts.current++;
      console.log(`Attempt ${renderAttempts.current}: Trying to trigger Sender...`);
      
      if (window.sender && typeof window.sender === 'function') {
        try {
          // Call sender multiple times with different arguments
          window.sender();
          window.sender('init');
          window.sender('render');
          window.sender('scan');
          window.sender('refresh');
          
          // Also try calling with the form ID
          window.sender('form', formId);
          window.sender(formId);
          
          console.log('✅ Called all sender methods');
        } catch (error) {
          console.error('Error calling sender:', error);
        }
      } else {
        console.log('❌ window.sender not available yet');
      }
    };

    // Check if form actually rendered
    const checkFormRendered = () => {
      const formField = containerRef.current?.querySelector('.sender-form-field');
      if (!formField) return false;
      
      // Check for any content
      const hasIframe = !!formField.querySelector('iframe');
      const hasForm = !!formField.querySelector('form');
      const hasInput = !!formField.querySelector('input');
      const hasChildren = formField.children.length > 0;
      const hasInnerHTML = formField.innerHTML.length > 100; // More than just the initial div
      
      const isRendered = hasIframe || hasForm || hasInput || hasChildren || hasInnerHTML;
      
      if (isRendered) {
        console.log('✅ Form successfully rendered!', {
          hasIframe,
          hasForm,
          hasInput,
          hasChildren,
          innerHTMLLength: formField.innerHTML.length
        });
      }
      
      return isRendered;
    };

    // Start trying immediately
    triggerSender();
    
    // Keep trying every 500ms
    const interval = setInterval(() => {
      if (renderAttempts.current > 30) { // 15 seconds
        clearInterval(interval);
        if (!checkFormRendered()) {
          console.error('❌ Form failed to render after 30 attempts');
          setShowFallback(true);
        }
        return;
      }
      
      // Try to trigger sender
      triggerSender();
      
      // Check if it worked
      setTimeout(() => {
        if (checkFormRendered()) {
          clearInterval(interval);
        }
      }, 300);
    }, 500);

    // Also try on various window events
    const handleLoad = () => triggerSender();
    window.addEventListener('load', handleLoad);
    document.addEventListener('DOMContentLoaded', handleLoad);
    
    // Try again after a delay
    setTimeout(triggerSender, 1000);
    setTimeout(triggerSender, 2000);
    setTimeout(triggerSender, 3000);

    return () => {
      clearInterval(interval);
      window.removeEventListener('load', handleLoad);
      document.removeEventListener('DOMContentLoaded', handleLoad);
    };
  }, [formId]);

  if (showFallback) {
    return (
      <div className={`${className} text-center p-6 bg-gray-50 rounded-lg`}>
        <h3 className="text-lg font-semibold mb-2">Subscribe to Our Newsletter</h3>
        <p className="text-gray-600 mb-4">
          Join our newsletter for the latest updates.
        </p>
        <a
          href={`https://stats.sender.net/forms/${formId}/view`}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 px-6 py-3 bg-accent-burgundy text-white rounded-lg hover:bg-accent-burgundy/90 transition-colors"
        >
          Subscribe Now
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                  d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
          </svg>
        </a>
      </div>
    );
  }

  return (
    <div className={className}>
      <div ref={containerRef} style={{ minHeight: '400px' }} />
    </div>
  );
}

// FILE 3: Debug version to see what's happening
export function SenderDebugForm({ formId }: { formId: string }) {
  const [info, setInfo] = useState<any>({});
  
  useEffect(() => {
    const interval = setInterval(() => {
      const formField = document.querySelector('.sender-form-field');
      setInfo({
        senderExists: !!window.sender,
        senderType: typeof window.sender,
        formFieldExists: !!formField,
        formFieldHTML: formField?.innerHTML?.substring(0, 200) || 'N/A',
        hasIframe: !!formField?.querySelector('iframe'),
        childCount: formField?.children.length || 0,
      });
    }, 1000);
    
    return () => clearInterval(interval);
  }, []);
  
  return (
    <div className="p-4 bg-black text-white font-mono text-xs">
      <h3 className="font-bold mb-2">Sender Debug Info:</h3>
      <pre>{JSON.stringify(info, null, 2)}</pre>
      <button 
        onClick={() => {
          if (window.sender) {
            console.log('Manual trigger...');
            window.sender();
            window.sender('scan');
            window.sender('render');
            window.sender('form', formId);
          }
        }}
        className="mt-2 px-4 py-2 bg-blue-500 rounded"
      >
        Manual Trigger
      </button>
    </div>
  );
}