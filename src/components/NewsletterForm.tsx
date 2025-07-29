// src/components/NewsletterForm.tsx
'use client';

import { useState, useEffect, useRef } from 'react';
import { useAnalytics } from './Analytics';
import { useCookieConsent } from '@/hooks/useCookieConsent';
import { motion, AnimatePresence } from 'framer-motion';
import { subscribeToNewsletter } from '@/lib/emailjs';

interface NewsletterFormProps {
  variant?: 'main' | 'blog';
  className?: string;
  compact?: boolean;
  inline?: boolean;
  onSignupSuccess?: () => void;
}

interface NewsletterState {
  email: string;
  name: string;
  company: string;
  status: 'idle' | 'loading' | 'success' | 'error' | 'already_subscribed' | 'unsubscribed';
  message: string;
  collapsed: boolean;
  expanded: boolean;
  showUnsubscribe: boolean;
}

export default function NewsletterForm({ 
  variant = 'main', 
  className = '',
  compact = false,
  inline = false,
  onSignupSuccess
}: NewsletterFormProps) {
  const { trackEvent, canTrack } = useAnalytics();
  const { hasConsent, canUseMarketing } = useCookieConsent();
  const emailInputRef = useRef<HTMLInputElement>(null);
  const [state, setState] = useState<NewsletterState>({
    email: '',
    name: '',
    company: '',
    status: 'idle',
    message: '',
    collapsed: false,
    expanded: false,
    showUnsubscribe: false
  });

  // Check if user was already subscribed or unsubscribed
  useEffect(() => {
    const collapsed = localStorage.getItem('newsletter-collapsed');
    const subscribedEmails = JSON.parse(localStorage.getItem('newsletter-subscribed-emails') || '[]');
    const unsubscribedEmails = JSON.parse(localStorage.getItem('newsletter-unsubscribed-emails') || '[]');
    const hideUntil = localStorage.getItem('newsletter-hide-until');
    
    if (collapsed === 'true') {
      setState(prev => ({ ...prev, collapsed: true }));
    }

    // Hide newsletter if user requested not to see it again
    if (hideUntil && new Date(hideUntil) > new Date()) {
      setState(prev => ({ ...prev, collapsed: true }));
    }
  }, []);

  const handleEmailFocus = () => {
    setState(prev => ({ ...prev, expanded: true }));
    if (canTrack) {
      trackEvent('newsletter_form_engaged', { variant });
    }
  };

  const checkIfAlreadySubscribed = (email: string): boolean => {
    const subscribedEmails = JSON.parse(localStorage.getItem('newsletter-subscribed-emails') || '[]');
    return subscribedEmails.includes(email.toLowerCase());
  };

  const handleAlreadySubscribed = () => {
    setState(prev => ({ 
      ...prev, 
      status: 'already_subscribed',
      message: 'You&apos;re already part of our network! Thanks for being a subscriber.',
      showUnsubscribe: true
    }));
  };

  const handleUnsubscribe = () => {
    const unsubscribedEmails = JSON.parse(localStorage.getItem('newsletter-unsubscribed-emails') || '[]');
    const subscribedEmails = JSON.parse(localStorage.getItem('newsletter-subscribed-emails') || '[]');
    
    // Add to unsubscribed list
    if (!unsubscribedEmails.includes(state.email.toLowerCase())) {
      unsubscribedEmails.push(state.email.toLowerCase());
      localStorage.setItem('newsletter-unsubscribed-emails', JSON.stringify(unsubscribedEmails));
    }
    
    // Remove from subscribed list
    const updatedSubscribed = subscribedEmails.filter((email: string) => email !== state.email.toLowerCase());
    localStorage.setItem('newsletter-subscribed-emails', JSON.stringify(updatedSubscribed));
    
    setState(prev => ({ 
      ...prev, 
      status: 'unsubscribed',
      message: 'You&apos;ve been unsubscribed. We won&apos;t show this form again.',
      showUnsubscribe: false
    }));

    // Hide newsletter form for 30 days
    const hideUntil = new Date();
    hideUntil.setDate(hideUntil.getDate() + 30);
    localStorage.setItem('newsletter-hide-until', hideUntil.toISOString());

    if (canTrack) {
      trackEvent('newsletter_unsubscribe', { variant, email_domain: state.email.split('@')[1] });
    }

    // Auto-hide after 3 seconds
    setTimeout(() => {
      setState(prev => ({ ...prev, collapsed: true }));
    }, 3000);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!state.email || !state.email.includes('@')) {
      setState(prev => ({ 
        ...prev, 
        status: 'error', 
        message: 'Valid email address required for transmission.' 
      }));
      return;
    }

    // Check if already subscribed
    if (checkIfAlreadySubscribed(state.email)) {
      handleAlreadySubscribed();
      return;
    }

    if (!canUseMarketing) {
      setState(prev => ({ 
        ...prev, 
        status: 'error', 
        message: 'Marketing consent required. Please accept marketing cookies to subscribe to our newsletter.' 
      }));
      return;
    }

    setState(prev => ({ ...prev, status: 'loading', message: '' }));

    try {
      const result = await subscribeToNewsletter({
        email: state.email,
        name: state.name,
        company: state.company,
        source: variant 
      });

      if (result.success) {
        // Add email to subscribed list
        const subscribedEmails = JSON.parse(localStorage.getItem('newsletter-subscribed-emails') || '[]');
        if (!subscribedEmails.includes(state.email.toLowerCase())) {
          subscribedEmails.push(state.email.toLowerCase());
          localStorage.setItem('newsletter-subscribed-emails', JSON.stringify(subscribedEmails));
        }

        setState(prev => ({ 
          ...prev, 
          status: 'success', 
          message: result.message || 'Transmission channel established successfully.',
          email: '',
          name: '',
          company: ''
        }));
        
        // Mark success in localStorage for modal detection
        localStorage.setItem('newsletter-success', 'true');
        localStorage.setItem('recent-newsletter-signup', new Date().toISOString());
        
        // Call success callback if provided
        onSignupSuccess?.();
        
        // Mark as signed up in blog newsletter modal context (if available)
        // Use localStorage to communicate with the modal system
        const modalState = localStorage.getItem('blog-newsletter-modal-state');
        if (modalState) {
          try {
            const state = JSON.parse(modalState);
            localStorage.setItem('blog-newsletter-modal-state', JSON.stringify({
              ...state,
              hasSignedUp: true
            }));
          } catch (error) {
            // Create new state if parsing fails
            localStorage.setItem('blog-newsletter-modal-state', JSON.stringify({
              hasSignedUp: true,
              hasClickedNeverShow: false,
              hasSeenModal: false,
              lastShownDate: null
            }));
          }
        } else {
          // Create new state
          localStorage.setItem('blog-newsletter-modal-state', JSON.stringify({
            hasSignedUp: true,
            hasClickedNeverShow: false,
            hasSeenModal: false,
            lastShownDate: null
          }));
        }
        
        if (canTrack) {
          trackEvent('newsletter_subscribe', { 
            variant,
            has_name: !!state.name,
            has_company: !!state.company,
            email_domain: state.email.split('@')[1] 
          });
        }
      } else {
        setState(prev => ({ 
          ...prev, 
          status: 'error', 
          message: result.error || 'Transmission failed. Please verify connection and retry.' 
        }));
      }
    } catch (error) {
      setState(prev => ({ 
        ...prev, 
        status: 'error', 
        message: 'Network protocol error. Please check your connection.' 
      }));
    }
  };

  const handleToggleCollapse = () => {
    const newCollapsed = !state.collapsed;
    localStorage.setItem('newsletter-collapsed', newCollapsed.toString());
    setState(prev => ({ ...prev, collapsed: newCollapsed }));
    
    if (canTrack) {
      trackEvent('newsletter_toggled', { variant, collapsed: newCollapsed });
    }
  };

  const copy = variant === 'blog' ? {
    title: 'Subscribe to The Looking Glass Chronicles // Manic Agency',
    subtitle: 'Strategic and unexplored intelligence on digital transformation and synthetic futures.',
    placeholder: 'signal@address.xyz',
    namePlaceholder: 'Name (optional)',
    companyPlaceholder: 'Organization (optional)',
    button: 'Establish Channel',
    successTitle: 'Channel Synchronized',
    successMessage: 'Welcome transmission imminent. Check your signal receiver.'
  } : {
    title: 'Subscribe to Manic Agency // The Looking Glass Chronicles',
    subtitle: 'Strategic and unexplored intelligence on digital transformation and synthetic futures.',
    placeholder: 'your@coordinates.xyz',
    namePlaceholder: 'Name (optional)',
    companyPlaceholder: 'Collective (optional)',
    button: 'Open Channel',
    successTitle: 'Link Established',
    successMessage: 'Initialization complete. First transmission incoming.'
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
          aria-label={state.collapsed ? "Expand newsletter form" : "Collapse newsletter form"}
        >
          {state.collapsed ? (
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

      {!compact && !state.collapsed && (
        <p className="text-text-secondary mb-6 leading-relaxed">
          {copy.subtitle}
        </p>
      )}

      <AnimatePresence>
        {!state.collapsed && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className="overflow-hidden"
          >
            <AnimatePresence mode="wait">
        {state.status === 'success' ? (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="success-state"
          >
            <div className="bg-accent-sage/10 border border-accent-sage/20 rounded-xl p-6 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-24 h-24 opacity-10">
                <TransmissionSuccessIcon />
              </div>
              <h4 className="font-display font-semibold text-accent-sage mb-2">
                {copy.successTitle}
              </h4>
              <p className="text-text-secondary">
                {copy.successMessage}
              </p>
            </div>
          </motion.div>
        ) : state.status === 'already_subscribed' ? (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="already-subscribed-state"
          >
            <div className="bg-accent-burgundy/10 border border-accent-burgundy/20 rounded-xl p-6 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-24 h-24 opacity-10">
                <SubscriberIcon />
              </div>
              <h4 className="font-display font-semibold text-accent-burgundy mb-2">
                Welcome Back, Subscriber!
              </h4>
              <p className="text-text-secondary mb-4">
                {state.message}
              </p>
              {state.showUnsubscribe && (
                <div className="flex flex-col gap-3">
                  <button
                    onClick={handleUnsubscribe}
                    className="text-text-secondary hover:text-accent-alert transition-colors text-sm flex items-center gap-2 group"
                  >
                    <UnsubscribeIcon />
                    <span className="group-hover:underline">Unsubscribe & don&apos;t show this again</span>
                  </button>
                  <p className="text-xs text-text-muted">
                    Need help? Contact{' '}
                    <a href="mailto:team@manic.agency" className="text-accent-burgundy hover:text-accent-highlight transition-colors">
                      team@manic.agency
                    </a>
                  </p>
                </div>
              )}
            </div>
          </motion.div>
        ) : state.status === 'unsubscribed' ? (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="unsubscribed-state"
          >
            <div className="bg-accent-alert/10 border border-accent-alert/20 rounded-xl p-6 relative overflow-hidden">
              <h4 className="font-display font-semibold text-accent-alert mb-2">
                Unsubscribed Successfully
              </h4>
              <p className="text-text-secondary">
                {state.message} If you change your mind, you can always resubscribe later.
              </p>
            </div>
          </motion.div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email Input - Always Visible */}
            <div className="relative group">
              <input
                ref={emailInputRef}
                type="email"
                value={state.email}
                onChange={(e) => setState(prev => ({ ...prev, email: e.target.value }))}
                onFocus={handleEmailFocus}
                placeholder={copy.placeholder}
                required
                disabled={state.status === 'loading'}
                className={`
                  w-full px-4 py-3 rounded-xl border border-border 
                  bg-bg-secondary focus:bg-bg-primary
                  focus:border-accent-burgundy focus:ring-2 focus:ring-accent-burgundy/20
                  transition-all duration-300
                  disabled:opacity-50 disabled:cursor-not-allowed
                  text-text-primary placeholder-text-secondary
                  group-hover:border-accent-secondary
                  ${compact ? 'py-2 text-sm' : ''}
                `}
              />
              <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                <motion.div
                  animate={{ opacity: state.email ? 0 : 1 }}
                  transition={{ duration: 0.2 }}
                >
                  <EmailInputIcon />
                </motion.div>
              </div>
            </div>

            {/* Expanded Fields */}
            <AnimatePresence>
              {state.expanded && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3, ease: 'easeInOut' }}
                  className="space-y-4 overflow-hidden"
                >
                  {/* Name Input */}
                  <div className="relative group">
                    <input
                      type="text"
                      value={state.name}
                      onChange={(e) => setState(prev => ({ ...prev, name: e.target.value }))}
                      placeholder={copy.namePlaceholder}
                      disabled={state.status === 'loading'}
                      className={`
                        w-full px-4 py-3 rounded-xl border border-border 
                        bg-bg-secondary focus:bg-bg-primary
                        focus:border-accent-secondary focus:ring-2 focus:ring-accent-secondary/20
                        transition-all duration-300
                        disabled:opacity-50 disabled:cursor-not-allowed
                        text-text-primary placeholder-text-secondary
                        group-hover:border-accent-sage
                        ${compact ? 'py-2 text-sm' : ''}
                      `}
                    />
                    <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none opacity-30">
                      <IdentifierIcon />
                    </div>
                  </div>

                  {/* Company Input */}
                  <div className="relative group">
                    <input
                      type="text"
                      value={state.company}
                      onChange={(e) => setState(prev => ({ ...prev, company: e.target.value }))}
                      placeholder={copy.companyPlaceholder}
                      disabled={state.status === 'loading'}
                      className={`
                        w-full px-4 py-3 rounded-xl border border-border 
                        bg-bg-secondary focus:bg-bg-primary
                        focus:border-accent-sage focus:ring-2 focus:ring-accent-sage/20
                        transition-all duration-300
                        disabled:opacity-50 disabled:cursor-not-allowed
                        text-text-primary placeholder-text-secondary
                        group-hover:border-accent-highlight
                        ${compact ? 'py-2 text-sm' : ''}
                      `}
                    />
                    <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none opacity-30">
                      <CollectiveIcon />
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Submit Button */}
            <motion.button
              type="submit"
              disabled={state.status === 'loading' || !state.email.trim() || !hasConsent}
              className={`
                relative w-full px-6 py-3 
                bg-gradient-to-r from-accent-burgundy to-accent-highlight
                hover:from-accent-highlight hover:to-accent-burgundy
                text-white font-medium rounded-xl
                transition-all duration-300
                disabled:opacity-50 disabled:cursor-not-allowed
                disabled:from-gray-400 disabled:to-gray-500
                focus:ring-2 focus:ring-accent-burgundy/20
                group overflow-hidden
                ${compact ? 'py-2 px-4 text-sm' : ''}
                [&]:not(.disabled):not([disabled]) {
                  color: white !important;
                  background: linear-gradient(to right, var(--accent-burgundy), var(--accent-highlight)) !important;
                }
              `}
              style={{
                color: 'white',
                background: 'linear-gradient(to right, var(--accent-burgundy), var(--accent-highlight))'
              }}
              whileHover={{ scale: state.status === 'loading' ? 1 : 1.02 }}
              whileTap={{ scale: state.status === 'loading' ? 1 : 0.98 }}
              title={!hasConsent ? 'Marketing consent required to establish channel' : ''}
            >
              <span className="relative z-10 flex items-center justify-center gap-2">
                {state.status === 'loading' ? (
                  <>
                    <LoadingPulse />
                    <span>Establishing Channel...</span>
                  </>
                ) : (
                  <>
                    <span>{copy.button}</span>
                    <TransmitIcon />
                  </>
                )}
              </span>
              <div className="absolute inset-0 bg-gradient-to-r from-accent-highlight/20 to-accent-burgundy/20 transform translate-x-full group-hover:translate-x-0 transition-transform duration-500" />
            </motion.button>
          </form>
        )}
      </AnimatePresence>

      {/* Error Message */}
      <AnimatePresence>
        {state.status === 'error' && !state.collapsed && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="mt-4 bg-accent-alert/10 border border-accent-alert/20 rounded-xl p-3"
          >
            <p className="text-accent-alert text-sm font-medium flex items-center gap-2">
              <AlertIcon />
              {state.message}
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Privacy Notice */}
      {!compact && state.status !== 'success' && !state.collapsed && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-6 space-y-2"
        >
          <p className="text-xs text-text-secondary leading-relaxed">
            Your data sovereignty is absolute. Zero third-party sharing. 
            One-click unsubscribe. Full GDPR compliance.{' '}
            <a 
              href="/privacy" 
              className="text-accent-burgundy hover:text-accent-highlight transition-colors"
            >
              Privacy protocol
            </a>
          </p>
          {!hasConsent && (
            <p className="text-xs text-accent-alert flex items-start gap-1">
              <span className="mt-0.5">⚡</span>
              <span>Marketing consent required. Accept cookies to establish secure transmission channel.</span>
            </p>
          )}
        </motion.div>
      )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// Icon Components
const EmailInputIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" className="text-text-secondary">
    <path d="M3 8L12 13L21 8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    <rect x="3" y="6" width="18" height="12" rx="2" stroke="currentColor" strokeWidth="1.5"/>
  </svg>
);

const IdentifierIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" className="text-text-secondary">
    <circle cx="12" cy="8" r="3" stroke="currentColor" strokeWidth="1.5"/>
    <path d="M16 16C16 14.8954 14.2091 14 12 14C9.79086 14 8 14.8954 8 16V19H16V16Z" stroke="currentColor" strokeWidth="1.5"/>
  </svg>
);

const CollectiveIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" className="text-text-secondary">
    <path d="M3 12L12 3L21 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M5 10V19H19V10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    <rect x="9" y="13" width="6" height="6" stroke="currentColor" strokeWidth="1.5"/>
  </svg>
);

const TransmitIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" className="text-white">
    <path d="M22 2L11 13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M22 2L15 22L11 13L2 9L22 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const TransmissionSuccessIcon = () => (
  <svg viewBox="0 0 64 64" className="w-full h-full">
    <circle cx="32" cy="32" r="20" fill="none" stroke="var(--accent-sage)" strokeWidth="1.5" opacity="0.3"/>
    <circle cx="32" cy="32" r="14" fill="none" stroke="var(--accent-sage)" strokeWidth="1" opacity="0.5"/>
    <circle cx="32" cy="32" r="8" fill="none" stroke="var(--accent-sage)" strokeWidth="0.5"/>
    <circle cx="32" cy="32" r="3" fill="var(--accent-sage)"/>
  </svg>
);

const AlertIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" className="text-accent-alert">
    <path d="M12 9V13M12 17H12.01M12 3L2 20H22L12 3Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const LoadingPulse = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" className="animate-spin">
    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" fill="none" strokeDasharray="32" strokeDashoffset="32">
      <animate attributeName="stroke-dashoffset" dur="1s" repeatCount="indefinite" from="32" to="0"/>
    </circle>
  </svg>
);

const SubscriberIcon = () => (
  <svg viewBox="0 0 64 64" className="w-full h-full">
    <circle cx="32" cy="24" r="8" fill="none" stroke="var(--accent-burgundy)" strokeWidth="2" opacity="0.3"/>
    <path d="M20 44c0-6.627 5.373-12 12-12s12 5.373 12 12v8H20v-8z" fill="none" stroke="var(--accent-burgundy)" strokeWidth="2" opacity="0.3"/>
    <circle cx="32" cy="32" r="3" fill="var(--accent-burgundy)"/>
    <path d="M28 32l3 3 7-7" stroke="var(--accent-sage)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const UnsubscribeIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" className="text-text-secondary">
    <path d="M8 12L16 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
  </svg>
);