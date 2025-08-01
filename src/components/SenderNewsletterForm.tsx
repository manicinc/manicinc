// src/components/SenderNewsletterForm.tsx
'use client';

import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface SenderNewsletterFormProps {
  formId: string;
  className?: string;
  fallbackUrl?: string;
}

// Custom hook to create a React-isolated DOM container
function useIsolatedDOM() {
  const containerRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    
    // Store original DOM methods
    const originalRemoveChild = container.removeChild.bind(container);
    const originalAppendChild = container.appendChild.bind(container);
    const originalInsertBefore = container.insertBefore.bind(container);
    
    // Override removeChild to safely handle unmanaged nodes
    container.removeChild = function<T extends Node>(child: T): T {
      try {
        // Check if this node or any parent is marked as unmanaged
        if (child.nodeType === Node.ELEMENT_NODE) {
          let node: Element | null = child as unknown as Element;
          while (node) {
            if (node.getAttribute && node.getAttribute('data-react-unmanaged') === 'true') {
              console.log('🛡️ Prevented React from removing unmanaged DOM node');
              return child; // Return the child without removing it
            }
            node = node.parentElement;
          }
        }
        
        // If not unmanaged, proceed with normal removal
        return originalRemoveChild(child) as T;
      } catch (error) {
        // If removal fails, log and return the child
        console.log('🛡️ Caught removeChild error, likely due to Sender.net DOM manipulation:', error);
        return child;
      }
    };
    
    // Override appendChild to mark new nodes as unmanaged if they're in an unmanaged container
    container.appendChild = function<T extends Node>(newChild: T): T {
      const result = originalAppendChild.call(this, newChild) as T;
      if (newChild.nodeType === Node.ELEMENT_NODE) {
        const element = newChild as unknown as Element;
        if (element.setAttribute) {
          element.setAttribute('data-react-unmanaged', 'true');
        }
      }
      return result;
    };
    
    // Cleanup patches on unmount
    return () => {
      if (container) {
        container.removeChild = originalRemoveChild;
        container.appendChild = originalAppendChild;
        container.insertBefore = originalInsertBefore;
      }
    };
  }, []);
  
  return containerRef;
}

export default function SenderNewsletterForm({ 
  formId,
  className = '',
  fallbackUrl
}: SenderNewsletterFormProps) {
  const containerRef = useIsolatedDOM();
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const formInitialized = useRef(false);
  const renderAttempts = useRef(0);
  const maxAttempts = 20;

  useEffect(() => {
    // Early return if no formId is provided
    if (!formId || formId.trim() === '') {
      console.error('🔴 No formId provided to SenderNewsletterForm');
      setStatus('error');
      return;
    }

    if (formInitialized.current || !containerRef.current) return;
    formInitialized.current = true;

    let mounted = true;
    let pollInterval: NodeJS.Timeout;
    const formContainer = containerRef.current;

    // CRITICAL: Prevent React from ever managing this DOM subtree
    // Mark all child nodes as unmanaged by React
    const markDOMAsUnmanaged = (element: Element) => {
      // Add a special data attribute to prevent React reconciliation
      element.setAttribute('data-react-unmanaged', 'true');
      element.setAttribute('data-sender-managed', 'true');
      // Recursively mark all children
      Array.from(element.children).forEach(markDOMAsUnmanaged);
    };

    // Set up mutation observer to catch any dynamically added nodes
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        mutation.addedNodes.forEach((node) => {
          if (node.nodeType === Node.ELEMENT_NODE) {
            const element = node as Element;
            markDOMAsUnmanaged(element);
            console.log('🔧 Marked dynamically added node as unmanaged');
          }
        });
      });
    });

    // Create a wrapper div that React will never touch
    const senderWrapper = document.createElement('div');
    senderWrapper.setAttribute('data-react-unmanaged', 'true');
    senderWrapper.setAttribute('data-sender-wrapper', 'true');
    senderWrapper.style.cssText = 'position: relative; width: 100%; min-height: 200px; padding: 0; margin: 0; box-sizing: border-box;';
    
    // Create the actual form container inside the wrapper
    const isolatedDiv = document.createElement('div');
    isolatedDiv.setAttribute('data-react-unmanaged', 'true');
    isolatedDiv.setAttribute('data-sender-container', 'true');
    isolatedDiv.innerHTML = `
      <div style="text-align: left; width: 100%; padding: 0; margin: 0; box-sizing: border-box;" 
           class="sender-form-field" 
           data-sender-form-id="${formId}"
           data-react-unmanaged="true">
      </div>
      <style>
        .sender-form-field iframe,
        .sender-form-field form,
        .sender-form-field div,
        .sender-form-field input,
        .sender-form-field button {
          width: 100% !important;
          max-width: 100% !important;
          margin: 0 !important;
          padding: 12px !important;
          box-sizing: border-box !important;
        }
        .sender-form-field {
          width: 100% !important;
          max-width: 100% !important;
          margin: 0 !important;
          padding: 0 !important;
          box-sizing: border-box !important;
        }
        /* Override Sender.net's fixed width */
        .sender-form-box {
          width: 100% !important;
          max-width: 100% !important;
          margin: 0 !important;
          box-sizing: border-box !important;
        }
        .sender-subs-embed-form-dBBEwn .sender-form-box {
          width: 100% !important;
          max-width: 100% !important;
          margin: 0 !important;
          box-sizing: border-box !important;
        }
        /* Mobile-specific overrides */
        @media (max-width: 768px) {
          .sender-form-box {
            width: 100% !important;
            max-width: 100% !important;
            margin: 0 !important;
            border-radius: 0 !important;
          }
          .sender-form-field,
          .sender-form-field iframe,
          .sender-form-field form,
          .sender-form-field div {
            width: 100% !important;
            max-width: 100% !important;
            margin: 0 !important;
            border-radius: 0 !important;
          }
          .sender-form-field input,
          .sender-form-field button {
            width: 100% !important;
            max-width: 100% !important;
            margin: 0 !important;
            padding: 12px !important;
            border-radius: 5px !important;
            box-sizing: border-box !important;
          }
        }
      </style>
    `;
    
    // Nest the form container inside the wrapper
    senderWrapper.appendChild(isolatedDiv);
    
    // Clear container and add our wrapper (React only manages the top-level div)
    formContainer.innerHTML = '';
    formContainer.appendChild(senderWrapper);
    
    // Mark the entire tree as unmanaged
    markDOMAsUnmanaged(senderWrapper);
    markDOMAsUnmanaged(isolatedDiv);
    
    // Start observing for dynamic changes on the wrapper
    observer.observe(senderWrapper, { 
      childList: true, 
      subtree: true,
      attributes: false 
    });

    const tryRenderForm = () => {
      if (!mounted) return false;
      
      renderAttempts.current++;
      console.log(`🔄 Render attempt ${renderAttempts.current}/${maxAttempts}`);

      // Check if sender is available
      if (!window.sender || typeof window.sender !== 'function') {
        console.log('⏳ Waiting for sender...');
        return false;
      }

      try {
        // Call all sender methods like in your HTML file
        window.sender();
        window.sender('init');
        window.sender('render');
        window.sender('scan');
        window.sender('refresh');
        window.sender('form', formId);
        window.sender(formId);
        
        console.log('✅ Called all sender methods');
        
        // Check if it worked after a delay
        setTimeout(() => {
          if (!mounted) return;
          
          const formField = isolatedDiv.querySelector('.sender-form-field');
          const hasContent = !!(
            formField?.querySelector('iframe') ||
            formField?.querySelector('form') ||
            formField?.querySelector('input') ||
            (formField && formField.children.length > 0)
          );
          
          if (hasContent) {
            console.log('✅ Form rendered successfully!');
            // Mark any new DOM nodes as unmanaged
            markDOMAsUnmanaged(formField as Element);
            setStatus('success');
          } else if (renderAttempts.current >= maxAttempts) {
            console.error('🔴 Max attempts reached, form failed to render');
            setStatus('error');
          }
        }, 1000);
        
        return true;
      } catch (error) {
        console.error('🔴 Error rendering form:', error);
        return false;
      }
    };

    // Start trying immediately
    tryRenderForm();

    // Set up polling
    pollInterval = setInterval(() => {
      if (!mounted || renderAttempts.current >= maxAttempts) {
        clearInterval(pollInterval);
        return;
      }
      tryRenderForm();
    }, 500);

    // Also listen for window events
    const handleLoad = () => tryRenderForm();
    window.addEventListener('load', handleLoad);
    window.addEventListener('onSenderFormsLoaded', handleLoad);

    // Cleanup - but preserve the isolated DOM
    return () => {
      mounted = false;
      if (pollInterval) clearInterval(pollInterval);
      window.removeEventListener('load', handleLoad);
      window.removeEventListener('onSenderFormsLoaded', handleLoad);
      observer.disconnect();
      
      // Clear any loading overlays to prevent React reconciliation conflicts
      const loadingOverlay = formContainer.querySelector('[data-loading-overlay="true"]');
      if (loadingOverlay) {
        loadingOverlay.remove();
      }
      
      // DON'T clear the container - let the isolated DOM persist
    };
  }, [formId]); // eslint-disable-line react-hooks/exhaustive-deps
  // Note: containerRef is a stable ref and should not be included in dependencies

  return (
    <div className={`${className} w-full`} style={{ width: '100%', padding: 0, margin: 0 }}>
      {/* Form Container - CRITICAL: Never re-render this div */}
      <div 
        ref={containerRef}
        className="sender-form-container w-full"
        style={{ 
          minHeight: status === 'loading' ? '300px' : 'auto',
          width: '100%',
          padding: '0',
          margin: '0'
        }}
        suppressHydrationWarning
        data-react-unmanaged="true"
      >
        {/* Only show loading state initially, before we add the form HTML */}
        {status === 'loading' && !formInitialized.current && (
          <div className="flex items-center justify-center h-64" data-loading-overlay="true">
            <div className="text-center">
              <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-gray-600">Loading newsletter form...</p>
            </div>
          </div>
        )}
      </div>

      {/* Error State with Fallback */}
      <AnimatePresence>
        {status === 'error' && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className={`mt-4 p-6 border rounded-lg ${
              !formId || formId.trim() === '' 
                ? 'bg-yellow-50 border-yellow-200' 
                : 'bg-red-50 border-red-200'
            }`}
          >
            <h3 className={`font-semibold mb-2 ${
              !formId || formId.trim() === '' 
                ? 'text-yellow-800' 
                : 'text-red-800'
            }`}>
              {!formId || formId.trim() === '' 
                ? 'Newsletter form configuration missing'
                : 'Newsletter form couldn\'t load'
              }
            </h3>
            <p className={`text-sm mb-4 ${
              !formId || formId.trim() === '' 
                ? 'text-yellow-600' 
                : 'text-red-600'
            }`}>
              {!formId || formId.trim() === '' 
                ? 'The NEXT_PUBLIC_SENDER_FORM_ID environment variable is not configured.'
                : 'This might be due to ad blockers or network issues.'
              }
            </p>
            {fallbackUrl ? (
              <a
                href={fallbackUrl}
                target="_blank"
                rel="noopener noreferrer"
                className={`inline-flex items-center gap-2 px-4 py-2 text-white rounded hover:opacity-90 transition-colors ${
                  !formId || formId.trim() === '' 
                    ? 'bg-yellow-600 hover:bg-yellow-700' 
                    : 'bg-red-600 hover:bg-red-700'
                }`}
              >
                Subscribe via web form
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                        d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
              </a>
            ) : (
              !formId || formId.trim() === '' ? (
                <p className="text-sm text-yellow-700">
                  Please contact the site administrator to set up the newsletter form.
                </p>
              ) : (
                <button
                  onClick={() => window.location.reload()}
                  className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 transition-colors"
                >
                  Try Again
                </button>
              )
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}