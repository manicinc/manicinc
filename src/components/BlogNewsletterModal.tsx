'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAnalytics } from './Analytics';

interface BlogNewsletterModalProps {
  onClose: () => void;
  onNeverShow: () => void;
}

export default function BlogNewsletterModal({ onClose, onNeverShow }: BlogNewsletterModalProps) {
  const { trackEvent, canTrack } = useAnalytics();
  const [isVisible, setIsVisible] = useState(true);
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (canTrack) {
      trackEvent('blog_newsletter_modal_shown', {
        page: window.location.pathname
      });
    }
  }, [canTrack, trackEvent]);

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
  }, []);

  const handleClose = () => {
    if (canTrack) {
      trackEvent('blog_newsletter_modal_closed', {
        page: window.location.pathname,
        action: 'close'
      });
    }
    setIsVisible(false);
    setTimeout(onClose, 300);
  };

  const handleNeverShow = () => {
    if (canTrack) {
      trackEvent('blog_newsletter_modal_dismissed', {
        page: window.location.pathname,
        action: 'never_show'
      });
    }
    setIsVisible(false);
    setTimeout(onNeverShow, 300);
  };

  const handleSignUpClick = () => {
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
  };

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
            className="fixed bottom-6 right-6 bg-bg-primary border border-border rounded-xl p-6 max-w-sm w-full mx-4 shadow-2xl pointer-events-auto z-10"
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
              {/* Icon */}
              <div className="w-12 h-12 mb-4 rounded-xl bg-gradient-to-br from-accent-sage/20 to-accent-secondary/20 flex items-center justify-center">
                <svg className="w-6 h-6 text-accent-sage" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
                  className="w-full px-4 py-2.5 bg-gradient-to-r from-accent-sage to-accent-secondary hover:from-accent-secondary hover:to-accent-sage text-white font-medium rounded-lg transition-all duration-300 flex items-center justify-center gap-2 text-sm"
                >
                  <span>Sign Up</span>
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                <div className="flex gap-1.5">
                  <button
                    onClick={handleClose}
                    className="flex-1 px-3 py-1.5 text-text-secondary hover:text-text-primary border border-border hover:border-accent-sage rounded-md transition-all duration-300 text-xs"
                  >
                    Later
                  </button>
                  <button
                    onClick={handleNeverShow}
                    className="flex-1 px-3 py-1.5 text-text-secondary hover:text-accent-alert border border-border hover:border-accent-alert rounded-md transition-all duration-300 text-xs"
                  >
                    Never
                  </button>
                </div>
              </div>

              {/* Footer */}
              <p className="text-xs text-text-secondary mt-3">
                No spam, unsubscribe anytime.
              </p>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
