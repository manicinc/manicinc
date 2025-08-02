'use client';

import { useEffect } from 'react';

interface SenderScriptProps {
  accountId?: string;
}

export function SenderScript({ accountId }: SenderScriptProps) {
  useEffect(() => {
    // Enhanced global error handler for multiple service errors
    const handleGlobalError = (event: ErrorEvent) => {
      const message = event.message?.toLowerCase() || '';
      const filename = event.filename?.toLowerCase() || '';
      
      if (
        // Sender.net errors
        message.includes('unexpected token') ||
        message.includes('syntaxerror') ||
        message.includes('doctype') ||
        message.includes('cannot read properties') ||
        message.includes('typeerror') ||
        filename.includes('sender.net') ||
        filename.includes('universal.js') ||
        (message.includes('json') && message.includes('token')) ||
        // EmailOctopus errors
        filename.includes('emailoctopus') ||
        filename.includes('eocampaign1.com') ||
        message.includes('parentnode') ||
        message.includes('removechild') ||
        // React DOM errors
        message.includes('notfounderror') ||
        message.includes('failed to execute') ||
        message.includes('node to be removed is not a child') ||
        // MetaMask development errors
        (message.includes('metamask') && process.env.NODE_ENV === 'development')
      ) {
        console.warn('🚨 Service/DOM error detected and suppressed:', {
          message: event.message,
          filename: event.filename,
          type: filename.includes('sender') ? 'Sender.net service error' : 
                filename.includes('emailoctopus') || filename.includes('eocampaign1') ? 'EmailOctopus script error' :
                message.includes('removechild') || message.includes('notfounderror') ? 'React DOM cleanup error' :
                message.includes('metamask') ? 'MetaMask dev error' : 'Service error'
        });
        return true; // Prevent the error from bubbling up
      }
      return false;
    };

    const handleUnhandledRejection = (event: PromiseRejectionEvent) => {
      const reason = event.reason?.toString?.() || '';
      const message = event.reason?.message?.toLowerCase?.() || '';
      
      if (
        // Sender.net errors
        message.includes('unexpected token') ||
        message.includes('syntaxerror') ||
        message.includes('doctype') ||
        message.includes('cannot read properties') ||
        message.includes('typeerror') ||
        reason.includes('404') ||
        reason.includes('sender.net') ||
        reason.includes('universal.js') ||
        (message.includes('json') && message.includes('token')) ||
        // EmailOctopus errors
        reason.includes('emailoctopus') ||
        reason.includes('eocampaign1.com') ||
        message.includes('parentnode') ||
        message.includes('removechild') ||
        // DOM manipulation errors
        message.includes('notfounderror') ||
        message.includes('failed to execute') ||
        message.includes('node to be removed is not a child')
      ) {
        const errorType = reason.includes('sender') ? 'Sender.net service error' :
                         reason.includes('emailoctopus') || reason.includes('eocampaign1') ? 'EmailOctopus service error' :
                         message.includes('removechild') || message.includes('notfounderror') ? 'DOM cleanup error' :
                         'Service error';
        
        console.warn('🚨 Service/DOM error detected - likely service instability or DOM conflict:', {
          reason: event.reason,
          type: `Promise rejection - ${errorType}`
        });
        event.preventDefault(); // Prevent unhandled rejection warning
      }
    };

    window.addEventListener('error', handleGlobalError);
    window.addEventListener('unhandledrejection', handleUnhandledRejection);

    // Intercept fetch requests to Sender.net to handle 404s gracefully
    const originalFetch = window.fetch;
    window.fetch = async (...args) => {
      try {
        const response = await originalFetch(...args);
        const url = args[0]?.toString() || '';
        
        if (url.includes('sender.net') && !response.ok) {
          console.warn('🚨 Sender.net service request failed:', {
            url,
            status: response.status,
            statusText: response.statusText,
            type: 'Network response error'
          });
          
          // Return a minimal success response to prevent JSON parsing errors
          if (url.includes('config.json')) {
            return new Response('{}', {
              status: 200,
              statusText: 'OK',
              headers: { 'Content-Type': 'application/json' }
            });
          }
        }
        
        return response;
      } catch (error) {
        const url = args[0]?.toString() || '';
        if (url.includes('sender.net')) {
          console.warn('🚨 Sender.net service fetch error:', error);
          // Return a minimal success response for Sender.net URLs
          return new Response('{}', {
            status: 200,
            statusText: 'OK',
            headers: { 'Content-Type': 'application/json' }
          });
        }
        throw error;
      }
    };

    // Debug logging
    console.log('🔍 SenderScript Debug:', {
      accountId,
      accountIdFromEnv: process.env.NEXT_PUBLIC_SENDER_ACCOUNT_ID,
      windowSender: !!window.sender,
      windowSenderCapital: !!window.Sender
    });

    // Validate accountId before proceeding
    if (!accountId || accountId.trim() === '') {
      console.warn('⚠️ Sender accountId is empty or undefined, skipping initialization');
      return;
    }

    // Check if Sender is already initialized
    if (window.Sender || window.sender) {
      console.log('✅ Sender already initialized');
      // Still try to initialize with account ID if not done yet
      try {
        if (window.sender && typeof window.sender === 'function') {
          window.sender(accountId);
          console.log('✅ Re-initialized with account ID:', accountId);
        }
      } catch (e) {
        console.log('Could not re-initialize:', e);
      }
      return;
    }

    // IMPORTANT: Set up the queue function BEFORE loading the script
    // This is what the Sender script expects to find
    const script = document.createElement('script');
    script.src = 'https://cdn.sender.net/accounts_resources/universal.js';
    script.async = true;
    
    // Set up the sender function queue BEFORE the script loads
    window.sender = window.sender || function() {
      (window.sender.q = window.sender.q || []).push(arguments);
    };
    window.sender.l = Date.now();
    
    // Add specific error handler for the Sender.net script
    const originalWindowError = window.onerror;
    window.onerror = function(message, source, lineno, colno, error) {
      const messageStr = message?.toString().toLowerCase() || '';
      const sourceStr = source?.toString().toLowerCase() || '';
      
      if (
        (sourceStr.includes('universal.js') && sourceStr.includes('sender.net')) ||
        (messageStr.includes('cannot read properties') && messageStr.includes('undefined')) ||
        (messageStr.includes('typeerror') && sourceStr.includes('sender'))
      ) {
        console.warn('🚨 Sender.net universal.js script error suppressed:', {
          message: messageStr,
          source: sourceStr,
          line: lineno,
          column: colno,
          error: error?.toString(),
          type: 'Sender.net service instability'
        });
        return true; // Prevent the error from appearing in console
      }
      // Call original handler for other errors
      return originalWindowError ? originalWindowError(message, source, lineno, colno, error) : false;
    };
    
    // Wait for the script to load completely, then initialize
    script.onload = function() {
      console.log('🚀 Sender universal script loaded, initializing with account ID:', accountId);
      
      // Wait a bit more to ensure everything is ready
      setTimeout(() => {
        if (window.sender && typeof window.sender === 'function') {
          try {
            // Initialize Sender with the account ID using the exact pattern from Sender.net docs
            window.sender('config', accountId);
            window.sender(accountId);
            console.log('✅ Sender initialized with account ID:', accountId);
          } catch (error) {
            console.error('❌ Error initializing Sender:', error);
            console.log('🔍 Account ID that failed:', accountId);
          }
        } else {
          console.error('❌ window.sender is not available after script load');
        }
      }, 750); // Increased delay to ensure full initialization
    };
    
    script.onerror = function(error) {
      console.error('❌ Failed to load Sender script:', error);
      console.log('🔍 Script src:', script.src);
    };
    
    document.head.appendChild(script);
    console.log('✅ Sender initialization script added');

    // Cleanup function
    return () => {
      window.removeEventListener('error', handleGlobalError);
      window.removeEventListener('unhandledrejection', handleUnhandledRejection);
      // Restore original fetch
      window.fetch = originalFetch;
      // Restore original window.onerror
      window.onerror = originalWindowError;
    };
  }, [accountId]);

  return null;
}
