'use client';

import { useEffect } from 'react';

interface SenderScriptProps {
  accountId?: string;
}

export function SenderScript({ accountId }: SenderScriptProps) {
  useEffect(() => {
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
    
    // Wait for the script to load completely, then initialize
    script.onload = function() {
      console.log('🚀 Sender universal script loaded, initializing with account ID:', accountId);
      
      // Wait a bit more to ensure everything is ready
      setTimeout(() => {
        if (window.sender && typeof window.sender === 'function') {
          window.sender(accountId);
          console.log('✅ Sender initialized with account ID:', accountId);
        }
      }, 500);
    };
    
    document.head.appendChild(script);
    console.log('✅ Sender initialization script added');
  }, [accountId]);

  return null;
}
