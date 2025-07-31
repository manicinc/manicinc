'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAnalytics } from './Analytics';

interface BlogNewsletterModalProps {
  onClose: () => void;
  onNeverShow: () => void;
}

export default function BlogNewsletterModal({ onClose, onNeverShow }: BlogNewsletterModalProps) {
  const { trackEvent, canTrack } = useAnalytics();
  const [isVisible, setIsVisible] = useState(true);
  const [isSubscriber, setIsSubscriber] = useState(false);
  const modalRef = useRef<HTMLDivElement>(null);

  // Check if user is already a subscriber
  useEffect(() => {
    const checkSubscriberStatus = () => {
      try {
        // Check newsletter modal state
        const modalState = localStorage.getItem('blog-newsletter-modal-state');
        if (modalState) {
          const state = JSON.parse(modalState);
          if (state.hasSignedUp) {
            setIsSubscriber(true);
            return;
          }
        }

        // Check newsletter form success state (from previous sessions)
        const newsletterSuccess = localStorage.getItem('newsletter-success');
        if (newsletterSuccess === 'true') {
          setIsSubscriber(true);
          return;
        }

        // Check if user recently subscribed (last 24 hours)
        const recentSignup = localStorage.getItem('recent-newsletter-signup');
        if (recentSignup) {
          const signupTime = new Date(recentSignup);
          const hoursSince = (Date.now() - signupTime.getTime()) / (1000 * 60 * 60);
          if (hoursSince < 24) {
            setIsSubscriber(true);
            return;
          }
        }
      } catch (error) {
        console.warn('Failed to check subscriber status:', error);
      }
    };

    checkSubscriberStatus();
  }, []);

  useEffect(() => {
    if (canTrack) {
      trackEvent('blog_newsletter_modal_shown', {
        page: window.location.pathname,
        is_subscriber: isSubscriber
      });
    }
  }, [canTrack, trackEvent, isSubscriber]);

  const handleClose = useCallback(() => {
    if (canTrack) {
      trackEvent('blog_newsletter_modal_closed', {
        page: window.location.pathname,
        action: 'close',
        is_subscriber: isSubscriber
      });
    }
    setIsVisible(false);
    setTimeout(onClose, 300);
  }, [canTrack, trackEvent, isSubscriber, onClose]);

  const handleNeverShow = useCallback(() => {
    if (canTrack) {
      trackEvent('blog_newsletter_modal_dismissed', {
        page: window.location.pathname,
        action: 'never_show',
        is_subscriber: isSubscriber
      });
    }
    setIsVisible(false);
    setTimeout(onNeverShow, 300);
  }, [canTrack, trackEvent, isSubscriber, onNeverShow]);

  const handleSignUpClick = useCallback(() => {
    if (canTrack) {
      trackEvent('blog_newsletter_modal_signup_clicked', {
        page: window.location.pathname
      });
    }
    
    // Scroll to newsletter section
    const newsletterSection = document.getElementById('newsletter-section');
    if (newsletterSection) {
      newsletterSection.scrollIntoView({ behavior: 'smooth' });
      handleClose();
    }
  }, [canTrack, trackEvent, handleClose]);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        handleClose();
      }
    };

    const handleClickOutside = (e: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
        handleClose();
      }
    };

    document.addEventListener('keydown', handleEscape);
    document.addEventListener('mousedown', handleClickOutside);
    // Don't prevent scrolling - modal is in corner
    
    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [handleClose]);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 pointer-events-none"
        >
          {/* Subtle overlay - only blocks clicks, not visual */}
          <div 
            className="absolute inset-0 pointer-events-auto" 
            onClick={handleClose}
          />
          
          {/* Modal positioned bottom-right */}
          <motion.div
            ref={modalRef}
            initial={{ scale: 0.8, opacity: 0, x: 100, y: 100 }}
            animate={{ scale: 1, opacity: 1, x: 0, y: 0 }}
            exit={{ scale: 0.8, opacity: 0, x: 100, y: 100 }}
            transition={{ type: 'spring', damping: 25, stiffness: 400 }}
            className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 bg-white dark:bg-gray-900 border border-border rounded-xl p-4 sm:p-6 max-w-xs sm:max-w-sm w-full mx-2 sm:mx-4 shadow-2xl pointer-events-auto z-10"
          >
            {/* Close Button */}
            <button
              onClick={handleClose}
              className="absolute top-3 right-3 text-text-secondary hover:text-text-primary transition-colors p-1.5 rounded-lg hover:bg-bg-secondary"
              aria-label="Close modal"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            {/* Modal Content */}
            <div className="text-left">
              {isSubscriber ? (
                // Thank You Content for Existing Subscribers
                <>
                  {/* Subscriber Icon */}
                  <div 
                    className="w-12 h-12 mb-4 rounded-xl flex items-center justify-center"
                    style={{
                      background: 'linear-gradient(135deg, rgba(var(--accent-primary-rgb), 0.2), rgba(var(--accent-highlight-rgb), 0.2))'
                    }}
                  >
                    <svg 
                      className="w-6 h-6" 
                      fill="none" 
                      stroke="currentColor" 
                      viewBox="0 0 24 24"
                      style={{ color: 'var(--accent-primary)' }}
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>

                  {/* Thank You Title */}
                  <h3 className="font-display text-lg font-semibold text-text-primary mb-2">
                    Welcome Back, Subscriber
                  </h3>

                  {/* Thank You Message */}
                  <p className="text-text-secondary mb-4 text-sm leading-relaxed">
                    You&apos;re already part of our digital collective. Thank you for staying connected to the frontier.
                  </p>

                  {/* Subscriber Benefits */}
                  <div className="space-y-2 mb-4">
                    <div className="flex items-center gap-2 text-xs text-text-secondary">
                      <div className="w-1.5 h-1.5 rounded-full bg-accent-primary"></div>
                      <span>Early access to research insights</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-text-secondary">
                      <div className="w-1.5 h-1.5 rounded-full bg-accent-secondary"></div>
                      <span>Exclusive technical deep-dives</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-text-secondary">
                      <div className="w-1.5 h-1.5 rounded-full bg-accent-highlight"></div>
                      <span>Direct channel to our collective</span>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="space-y-2">
                    <button
                      onClick={() => {
                        const newsletterSection = document.getElementById('newsletter-section');
                        if (newsletterSection) {
                          newsletterSection.scrollIntoView({ behavior: 'smooth' });
                          handleClose();
                        }
                      }}
                      className="w-full px-4 py-2.5 font-medium rounded-lg transition-all duration-300 flex items-center justify-center gap-2 text-sm"
                      style={{
                        background: 'linear-gradient(to right, var(--accent-primary), var(--accent-secondary))',
                        color: 'var(--text-on-accent)'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.background = 'linear-gradient(to right, var(--accent-secondary), var(--accent-primary))';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.background = 'linear-gradient(to right, var(--accent-primary), var(--accent-secondary))';
                      }}
                    >
                      <span>Continue Reading</span>
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5-5 5M6 12h12" />
                      </svg>
                    </button>

                    <button
                      onClick={handleClose}
                      className="w-full px-3 py-1.5 border rounded-md transition-all duration-300 text-xs"
                      style={{
                        color: 'var(--text-secondary)',
                        borderColor: 'var(--border)'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.color = 'var(--text-primary)';
                        e.currentTarget.style.borderColor = 'var(--accent-secondary)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.color = 'var(--text-secondary)';
                        e.currentTarget.style.borderColor = 'var(--border)';
                      }}
                    >
                      Dismiss
                    </button>
                  </div>

                  {/* Footer */}
                  <p className="text-xs text-text-secondary mt-3">
                    Stay curious, digital pioneer.
                  </p>
                </>
              ) : (
                // Original Signup Content for Non-Subscribers
                <>
                  {/* Icon */}
                  <div 
                    className="w-12 h-12 mb-4 rounded-xl flex items-center justify-center"
                    style={{
                      background: 'linear-gradient(135deg, rgba(var(--accent-secondary-rgb), 0.2), rgba(var(--accent-primary-rgb), 0.2))'
                    }}
                  >
                    <svg 
                      className="w-6 h-6" 
                      fill="none" 
                      stroke="currentColor" 
                      viewBox="0 0 24 24"
                      style={{ color: 'var(--accent-secondary)' }}
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </div>

                  {/* Title */}
                  <h3 className="font-display text-lg font-semibold text-text-primary mb-2">
                    Stay Connected
                  </h3>

                  {/* Description */}
                  <p className="text-text-secondary mb-4 text-sm leading-relaxed">
                    Get notified when we publish new research and analysis from the digital frontier.
                  </p>

                  {/* CTA Buttons */}
                  <div className="space-y-2">
                    <button
                      onClick={handleSignUpClick}
                      className="w-full px-4 py-2.5 font-medium rounded-lg transition-all duration-300 flex items-center justify-center gap-2 text-sm"
                      style={{
                        background: 'linear-gradient(to right, var(--accent-primary), var(--accent-secondary))',
                        color: 'var(--text-on-accent)'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.background = 'linear-gradient(to right, var(--accent-secondary), var(--accent-primary))';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.background = 'linear-gradient(to right, var(--accent-primary), var(--accent-secondary))';
                      }}
                    >
                      <span>Sign Up</span>
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>

                    <div className="flex gap-1.5">
                      <button
                        onClick={handleClose}
                        className="flex-1 px-3 py-1.5 border rounded-md transition-all duration-300 text-xs"
                        style={{
                          color: 'var(--text-secondary)',
                          borderColor: 'var(--border)'
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.color = 'var(--text-primary)';
                          e.currentTarget.style.borderColor = 'var(--accent-secondary)';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.color = 'var(--text-secondary)';
                          e.currentTarget.style.borderColor = 'var(--border)';
                        }}
                      >
                        Later
                      </button>
                      <button
                        onClick={handleNeverShow}
                        className="flex-1 px-3 py-1.5 border rounded-md transition-all duration-300 text-xs"
                        style={{
                          color: 'var(--text-secondary)',
                          borderColor: 'var(--border)'
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.color = 'var(--accent-alert)';
                          e.currentTarget.style.borderColor = 'var(--accent-alert)';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.color = 'var(--text-secondary)';
                          e.currentTarget.style.borderColor = 'var(--border)';
                        }}
                      >
                        Never
                      </button>
                    </div>
                  </div>

                  {/* Footer */}
                  <p className="text-xs text-text-secondary mt-3">
                    No spam, unsubscribe anytime.
                  </p>
                </>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
