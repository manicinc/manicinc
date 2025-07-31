'use client';

import { useState, useEffect, useRef } from 'react';
import { useAnalytics } from './Analytics';
import { useCookieConsent } from '@/hooks/useCookieConsent';
import { motion, AnimatePresence } from 'framer-motion';

interface SenderNewsletterFormProps {
  variant?: 'main' | 'blog';
  className?: string;
  compact?: boolean;
  inline?: boolean;
  onSignupSuccess?: () => void;
}

export default function SenderNewsletterForm({ 
  variant = 'main', 
  className = '',
  compact = false,
  inline = false,
  onSignupSuccess
}: SenderNewsletterFormProps) {
  const { trackEvent, canTrack } = useAnalytics();
  const { hasConsent, canUseMarketing } = useCookieConsent();
  const [collapsed, setCollapsed] = useState(false);
  const [showEmbed, setShowEmbed] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const scriptLoadedRef = useRef(false);
  const formId = process.env.NEXT_PUBLIC_SENDER_FORM_ID || '';

  // Check if user collapsed form
  useEffect(() => {
    const collapsedState = localStorage.getItem('newsletter-collapsed');
    if (collapsedState === 'true') {
      setCollapsed(true);
    }
  }, []);

  // Show embed only if user has marketing consent
  useEffect(() => {
    setShowEmbed(canUseMarketing);
  }, [canUseMarketing]);

  // Load Sender.net form embed
  useEffect(() => {
    if (!showEmbed || !formId || scriptLoadedRef.current || collapsed) return;

    const loadSenderForm = () => {
      // Create the form container
      if (containerRef.current) {
        containerRef.current.innerHTML = `<div data-sender-form-id="${formId}"></div>`;
      }

      // Load Sender.net script if not already loaded
      if (!window.Sender && !document.querySelector('script[src*="sender.net"]')) {
        const script = document.createElement('script');
        script.async = true;
        script.innerHTML = `
          (function (s, e, n, d, er) {
            s['Sender'] = er;
            s[er] = s[er] || function () {
              (s[er].q = s[er].q || []).push(arguments)
            }, s[er].l = 1 * new Date();
            var a = e.createElement(n),
                m = e.getElementsByTagName(n)[0];
            a.async = 1;
            a.src = d;
            m.parentNode.insertBefore(a, m)
          })(window, document, 'script', 'https://cdn.sender.net/accounts_resources/universal.js', 'sender');
          sender('${formId}');
        `;
        
        document.head.appendChild(script);
        scriptLoadedRef.current = true;

        // Track analytics
        if (canTrack) {
          trackEvent('sender_form_loaded', { variant, formId });
        }
      } else if (window.Sender) {
        // If script already loaded, just initialize the form
        window.Sender('form', formId);
      }
    };

    // Small delay to ensure DOM is ready
    const timer = setTimeout(loadSenderForm, 100);
    return () => clearTimeout(timer);
  }, [showEmbed, formId, collapsed, canTrack, trackEvent, variant]);

  const handleToggleCollapse = () => {
    const newCollapsed = !collapsed;
    localStorage.setItem('newsletter-collapsed', newCollapsed.toString());
    setCollapsed(newCollapsed);
    
    if (canTrack) {
      trackEvent('newsletter_toggled', { variant, collapsed: newCollapsed });
    }
  };

  const copy = variant === 'blog' ? {
    title: 'Subscribe to The Looking Glass Chronicles // Manic Agency',
    subtitle: 'Strategic and unexplored intelligence on digital transformation and synthetic futures.',
  } : {
    title: 'Subscribe to Manic Agency // The Looking Glass Chronicles',
    subtitle: 'Strategic and unexplored intelligence on digital transformation and synthetic futures.',
  };

  return (
    <div className={`newsletter-form-container ${className}`}>
      <div className="flex items-center justify-between mb-4">
        <h3 className={`font-display font-semibold ${
          compact ? 'text-lg' : 'text-xl'
        } text-text-primary`}>
          {copy.title}
        </h3>
        <button
          onClick={handleToggleCollapse}
          className="text-text-secondary hover:text-text-primary transition-all duration-200 p-1 rounded-lg hover:bg-bg-tertiary"
          aria-label={collapsed ? "Expand newsletter form" : "Collapse newsletter form"}
        >
          {collapsed ? (
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          ) : (
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
            </svg>
          )}
        </button>
      </div>

      {!compact && !collapsed && (
        <p className="text-text-secondary mb-6 leading-relaxed">
          {copy.subtitle}
        </p>
      )}

      <AnimatePresence>
        {!collapsed && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className="overflow-hidden"
          >
            {showEmbed && hasConsent ? (
              // Ornate Neumorphic Container for Sender.net Form
              <div className="relative">
                {/* Neumorphic Container */}
                <div className="relative bg-gradient-to-br from-bg-primary via-bg-secondary to-bg-primary rounded-2xl p-8 shadow-neumorphic-inset border border-border/50">
                  {/* Decorative Corner Elements */}
                  <div className="absolute top-0 left-0 w-20 h-20 opacity-10">
                    <div className="w-full h-full rounded-br-full bg-gradient-to-br from-accent-burgundy to-accent-sage"></div>
                  </div>
                  <div className="absolute bottom-0 right-0 w-16 h-16 opacity-10">
                    <div className="w-full h-full rounded-tl-full bg-gradient-to-tl from-accent-gold to-accent-highlight"></div>
                  </div>

                  {/* Inner Glow Effect */}
                  <div className="absolute inset-2 rounded-xl bg-gradient-to-r from-accent-burgundy/5 via-transparent to-accent-sage/5 pointer-events-none"></div>

                  {/* Ornate Border Pattern */}
                  <div className="absolute inset-0 rounded-2xl overflow-hidden">
                    <div className="absolute top-0 left-1/4 w-1/2 h-0.5 bg-gradient-to-r from-transparent via-accent-burgundy/30 to-transparent"></div>
                    <div className="absolute bottom-0 left-1/4 w-1/2 h-0.5 bg-gradient-to-r from-transparent via-accent-sage/30 to-transparent"></div>
                    <div className="absolute left-0 top-1/4 h-1/2 w-0.5 bg-gradient-to-b from-transparent via-accent-secondary/30 to-transparent"></div>
                    <div className="absolute right-0 top-1/4 h-1/2 w-0.5 bg-gradient-to-b from-transparent via-accent-highlight/30 to-transparent"></div>
                  </div>

                  {/* Central Emblem */}
                  <div className="absolute top-4 right-4 w-8 h-8 opacity-20">
                    <TransmissionEmblem />
                  </div>

                  {/* Sender.net Form Container */}
                  <div 
                    ref={containerRef}
                    className="sender-form-wrapper relative z-10"
                    style={{
                      // Custom CSS variables for Sender.net form styling
                      '--sender-primary-color': '#b66880',
                      '--sender-secondary-color': '#7ea196',
                      '--sender-text-color': 'var(--text-primary)',
                      '--sender-background-color': 'transparent',
                      '--sender-border-color': 'var(--border)',
                      '--sender-border-radius': '12px',
                      '--sender-font-family': 'var(--font-display)',
                    } as React.CSSProperties}
                  >
                    {/* Loading State */}
                    <div className="space-y-4 animate-pulse">
                      <div className="h-3 bg-bg-tertiary rounded w-3/4"></div>
                      <div className="h-12 bg-bg-tertiary rounded"></div>
                      <div className="h-10 bg-gradient-to-r from-accent-burgundy/20 to-accent-sage/20 rounded"></div>
                    </div>
                  </div>

                  {/* Neumorphic Accent Lines */}
                  <div className="absolute bottom-6 left-6 right-6 h-px bg-gradient-to-r from-transparent via-accent-burgundy/20 to-transparent shadow-neumorphic-pressed"></div>
                </div>

                {/* Privacy Notice */}
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5 }}
                  className="mt-6 space-y-2"
                >
                  <p className="text-xs text-text-secondary leading-relaxed text-center">
                    Your data sovereignty is absolute. Zero third-party sharing. 
                    One-click unsubscribe. Full GDPR compliance.{' '}
                    <a 
                      href="/privacy" 
                      className="text-accent-burgundy hover:text-accent-highlight transition-colors"
                    >
                      Privacy protocol
                    </a>
                  </p>
                </motion.div>
              </div>
            ) : (
              // Consent Required State
              <div className="bg-bg-secondary border-2 border-dashed border-border rounded-xl p-8 text-center">
                <div className="w-12 h-12 mx-auto mb-4 opacity-30">
                  <ConsentIcon />
                </div>
                <h4 className="font-display font-semibold text-text-primary mb-2">
                  Marketing Consent Required
                </h4>
                <p className="text-text-secondary text-sm mb-4">
                  Accept marketing cookies to establish secure transmission channel and subscribe to our intelligence briefings.
                </p>
                <p className="text-xs text-accent-alert flex items-center justify-center gap-1">
                  <span>⚡</span>
                  <span>Enable cookies to access subscription portal</span>
                </p>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// Icon Components
const TransmissionEmblem = () => (
  <svg viewBox="0 0 32 32" className="w-full h-full">
    <circle cx="16" cy="16" r="12" fill="none" stroke="var(--accent-burgundy)" strokeWidth="0.5" opacity="0.6"/>
    <circle cx="16" cy="16" r="8" fill="none" stroke="var(--accent-sage)" strokeWidth="0.5" opacity="0.8"/>
    <circle cx="16" cy="16" r="4" fill="none" stroke="var(--accent-highlight)" strokeWidth="0.5"/>
    <circle cx="16" cy="16" r="2" fill="var(--accent-gold)"/>
    <path d="M12 12l8 8M20 12l-8 8" stroke="var(--accent-secondary)" strokeWidth="0.3" opacity="0.4"/>
  </svg>
);

const ConsentIcon = () => (
  <svg viewBox="0 0 48 48" className="w-full h-full">
    <path d="M24 4L6 12v12c0 11.11 7.67 21.47 18 24 10.33-2.53 18-12.89 18-24V12L24 4z" 
          fill="none" stroke="var(--text-secondary)" strokeWidth="1.5"/>
    <path d="M18 24l6 6 12-12" stroke="var(--accent-sage)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

// Global type augmentation for Sender
declare global {
  interface Window {
    Sender: any;
  }
}