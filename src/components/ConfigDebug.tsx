'use client';

import React, { useEffect, useState } from 'react';
import { debugEmailJSConfig } from '@/lib/emailjs';
import { debugAnalyticsConfig } from '@/components/Analytics';

interface ConfigStatus {
  emailjs: {
    serviceId: boolean;
    newsletterTemplate: boolean;
    contactTemplate: boolean;
    publicKey: boolean;
  };
  analytics: {
    googleAnalytics: boolean;
    clarityProject: boolean;
    vercelAnalytics: boolean;
  };
}

export function ConfigDebug() {
  const [config, setConfig] = useState<ConfigStatus | null>(null);
  const [showDebug, setShowDebug] = useState(false);

  useEffect(() => {
    // Show in development to help developers understand what's missing
    if (process.env.NODE_ENV !== 'development') {
      return;
    }

    const configStatus: ConfigStatus = {
      emailjs: {
        serviceId: !!process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID,
        newsletterTemplate: !!process.env.NEXT_PUBLIC_EMAILJS_NEWSLETTER_TEMPLATE_ID,
        contactTemplate: !!process.env.NEXT_PUBLIC_EMAILJS_CONTACT_TEMPLATE_ID,
        publicKey: !!process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY,
      },
      analytics: {
        googleAnalytics: !!process.env.NEXT_PUBLIC_GA_ID,
        clarityProject: !!process.env.NEXT_PUBLIC_CLARITY_PROJECT_ID,
        vercelAnalytics: true, // Always available
      }
    };

    setConfig(configStatus);

    // Show debug info in console (useful for development)
    debugEmailJSConfig();
    debugAnalyticsConfig();
    
    // In development, inform about GitHub Secrets
    console.group('💡 Development Info');
    console.info('Environment variables are configured in GitHub Secrets for production');
    console.info('Local development will show missing configs (this is expected)');
    console.info('Forms and analytics will gracefully degrade without environment variables');
    console.groupEnd();
  }, []);

  // Only render in development
  if (process.env.NODE_ENV !== 'development' || !config) {
    return null;
  }

  // Always show issues in development since env vars won't be available locally
  const hasIssues = true; // In development, this will always be true since env vars are in GitHub Secrets

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <button
        onClick={() => setShowDebug(!showDebug)}
        className="px-3 py-2 rounded-lg text-sm font-mono shadow-lg transition-colors bg-blue-500 text-white hover:bg-blue-600"
      >
        Config 🔧
      </button>

      {showDebug && (
        <div className="absolute bottom-12 right-0 bg-black text-white p-4 rounded-lg shadow-xl w-80 text-xs font-mono">
          <div className="flex justify-between items-center mb-3">
            <h3 className="font-bold">Configuration Status</h3>
            <button 
              onClick={() => setShowDebug(false)}
              className="text-gray-400 hover:text-white"
            >
              ✕
            </button>
          </div>

          <div className="space-y-3">
            <div className="text-blue-400 text-sm">
              <strong>Development Mode</strong>
            </div>
            
            <div>
              <h4 className="text-yellow-400 font-semibold">EmailJS (GitHub Secrets)</h4>
              <div className="ml-2 space-y-1">
                <div>Service ID: {config.emailjs.serviceId ? '✅' : '❌ (Expected in dev)'}</div>
                <div>Newsletter Template: {config.emailjs.newsletterTemplate ? '✅' : '❌ (Expected in dev)'}</div>
                <div>Contact Template: {config.emailjs.contactTemplate ? '✅' : '❌ (Expected in dev)'}</div>
                <div>Public Key: {config.emailjs.publicKey ? '✅' : '❌ (Expected in dev)'}</div>
              </div>
            </div>

            <div>
              <h4 className="text-blue-400 font-semibold">Analytics (GitHub Secrets)</h4>
              <div className="ml-2 space-y-1">
                <div>Google Analytics: {config.analytics.googleAnalytics ? '✅' : '❌ (Expected in dev)'}</div>
                <div>Clarity Project: {config.analytics.clarityProject ? '✅' : '❌ (Expected in dev)'}</div>
                <div>Vercel Analytics: ✅ (Always available)</div>
              </div>
            </div>

            <div className="text-gray-400 text-xs pt-2 border-t border-gray-700">
              <div>🔧 In development: Configs show as missing</div>
              <div>🚀 In production: GitHub Secrets are loaded</div>
              <div>📖 See README.md for setup instructions</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
