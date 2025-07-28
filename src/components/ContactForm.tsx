// src/components/ContactForm.tsx
'use client';

import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAnalytics } from './Analytics';
import { useCookieConsent } from '@/hooks/useCookieConsent';
import { sendContactMessage } from '@/lib/emailjs';

interface ContactFormState {
  name: string;
  email: string;
  company: string;
  phone: string;
  subject: string;
  message: string;
  budget: string;
  timeline: string;
  status: 'idle' | 'loading' | 'success' | 'error';
  statusMessage: string;
}

export default function ContactForm() {
  const { trackEvent, canTrack } = useAnalytics();
  const { hasConsent, canUseFunctional, canUseMarketing } = useCookieConsent();
  const formRef = useRef<HTMLFormElement>(null);
  
  const [state, setState] = useState<ContactFormState>({
    name: '',
    email: '',
    company: '',
    phone: '',
    subject: '',
    message: '',
    budget: '',
    timeline: '',
    status: 'idle',
    statusMessage: ''
  });

  const [focusedField, setFocusedField] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Check for functional cookie consent (required for form submission)
    if (!canUseFunctional) {
      setState(prev => ({ 
        ...prev, 
        status: 'error', 
        statusMessage: 'Functional cookies required for form submission. Please update your cookie preferences.' 
      }));
      return;
    }
    
    // Validation
    if (!state.name || !state.email || !state.message) {
      setState(prev => ({ 
        ...prev, 
        status: 'error', 
        statusMessage: 'Required fields: Name, Email, and Message' 
      }));
      return;
    }

    if (state.message.length < 20) {
      setState(prev => ({ 
        ...prev, 
        status: 'error', 
        statusMessage: 'Message must be at least 20 characters' 
      }));
      return;
    }

    setState(prev => ({ ...prev, status: 'loading' }));

    try {
      const result = await sendContactMessage({
        name: state.name,
        email: state.email,
        company: state.company,
        message: `${state.message}

--- Additional Details ---
Phone: ${state.phone || 'Not provided'}
Budget: ${state.budget || 'Not specified'}
Timeline: ${state.timeline || 'Not specified'}
Submitted: ${new Date().toISOString()}`,
        subject: state.subject || 'New Contact Form Submission'
      });

      if (result.success) {
        setState(prev => ({ 
          ...prev, 
          status: 'success', 
          statusMessage: result.message || 'Transmission received. We\'ll respond within 24 hours.',
          name: '',
          email: '',
          company: '',
          phone: '',
          subject: '',
          message: '',
          budget: '',
          timeline: ''
        }));
        
        if (canTrack) {
          trackEvent('contact_form_submit', { 
            has_company: !!state.company,
            has_budget: !!state.budget,
            message_length: state.message.length 
          });
        }
      } else {
        setState(prev => ({ 
          ...prev, 
          status: 'error', 
          statusMessage: result.error || 'Transmission failed. Please try again or contact team@manic.agency directly.' 
        }));
      }
    } catch (error) {
      setState(prev => ({ 
        ...prev, 
        status: 'error', 
        statusMessage: 'Network error. Please check your connection.' 
      }));
    }
  };

  const budgetOptions = [
    { value: '', label: 'Select budget range' },
    { value: 'under-10k', label: 'Under $10,000' },
    { value: '10k-25k', label: '$10,000 - $25,000' },
    { value: '25k-50k', label: '$25,000 - $50,000' },
    { value: '50k-100k', label: '$50,000 - $100,000' },
    { value: 'over-100k', label: 'Over $100,000' },
    { value: 'ongoing', label: 'Ongoing retainer' }
  ];

  const timelineOptions = [
    { value: '', label: 'Select timeline' },
    { value: 'asap', label: 'ASAP' },
    { value: '1-month', label: 'Within 1 month' },
    { value: '2-3-months', label: '2-3 months' },
    { value: '3-6-months', label: '3-6 months' },
    { value: 'over-6-months', label: 'Over 6 months' },
    { value: 'flexible', label: 'Flexible' }
  ];

  return (
    <form ref={formRef} onSubmit={handleSubmit} className="contact-form space-y-6">
      {/* Name & Email Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <label className="block mb-2">
            <span className="text-sm font-mono text-text-secondary uppercase tracking-wider">
              Full Name *
            </span>
          </label>
          <div className="relative">
            <input
              type="text"
              value={state.name}
              onChange={(e) => setState(prev => ({ ...prev, name: e.target.value }))}
              onFocus={() => setFocusedField('name')}
              onBlur={() => setFocusedField(null)}
              required
              className={`
                w-full px-4 py-3 rounded-xl border transition-all duration-300
                bg-bg-secondary text-text-primary placeholder-text-muted
                ${focusedField === 'name' 
                  ? 'border-accent-burgundy ring-2 ring-accent-burgundy/20' 
                  : 'border-border hover:border-accent-secondary'
                }
              `}
              placeholder="Your identifier"
            />
            <AnimatePresence>
              {focusedField === 'name' && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  className="absolute right-3 top-1/2 -translate-y-1/2"
                >
                  <IdentityIcon />
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <label className="block mb-2">
            <span className="text-sm font-mono text-text-secondary uppercase tracking-wider">
              Email Address *
            </span>
          </label>
          <div className="relative">
            <input
              type="email"
              value={state.email}
              onChange={(e) => setState(prev => ({ ...prev, email: e.target.value }))}
              onFocus={() => setFocusedField('email')}
              onBlur={() => setFocusedField(null)}
              required
              className={`
                w-full px-4 py-3 rounded-xl border transition-all duration-300
                bg-bg-secondary text-text-primary placeholder-text-muted
                ${focusedField === 'email' 
                  ? 'border-accent-burgundy ring-2 ring-accent-burgundy/20' 
                  : 'border-border hover:border-accent-secondary'
                }
              `}
              placeholder="your@coordinates.xyz"
            />
            <AnimatePresence>
              {focusedField === 'email' && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  className="absolute right-3 top-1/2 -translate-y-1/2"
                >
                  <ChannelIcon />
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      </div>

      {/* Company & Phone Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <label className="block mb-2">
            <span className="text-sm font-mono text-text-secondary uppercase tracking-wider">
              Organization
            </span>
          </label>
          <input
            type="text"
            value={state.company}
            onChange={(e) => setState(prev => ({ ...prev, company: e.target.value }))}
            onFocus={() => setFocusedField('company')}
            onBlur={() => setFocusedField(null)}
            className={`
              w-full px-4 py-3 rounded-xl border transition-all duration-300
              bg-bg-secondary text-text-primary placeholder-text-muted
              ${focusedField === 'company' 
                ? 'border-accent-sage ring-2 ring-accent-sage/20' 
                : 'border-border hover:border-accent-secondary'
              }
            `}
            placeholder="Your collective (optional)"
          />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <label className="block mb-2">
            <span className="text-sm font-mono text-text-secondary uppercase tracking-wider">
              Direct Line
            </span>
          </label>
          <input
            type="tel"
            value={state.phone}
            onChange={(e) => setState(prev => ({ ...prev, phone: e.target.value }))}
            onFocus={() => setFocusedField('phone')}
            onBlur={() => setFocusedField(null)}
            className={`
              w-full px-4 py-3 rounded-xl border transition-all duration-300
              bg-bg-secondary text-text-primary placeholder-text-muted
              ${focusedField === 'phone' 
                ? 'border-accent-sage ring-2 ring-accent-sage/20' 
                : 'border-border hover:border-accent-secondary'
              }
            `}
            placeholder="+1 (555) 000-0000 (optional)"
          />
        </motion.div>
      </div>

      {/* Subject */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        <label className="block mb-2">
          <span className="text-sm font-mono text-text-secondary uppercase tracking-wider">
            Transmission Subject
          </span>
        </label>
        <input
          type="text"
          value={state.subject}
          onChange={(e) => setState(prev => ({ ...prev, subject: e.target.value }))}
          onFocus={() => setFocusedField('subject')}
          onBlur={() => setFocusedField(null)}
          className={`
            w-full px-4 py-3 rounded-xl border transition-all duration-300
            bg-bg-secondary text-text-primary placeholder-text-muted
            ${focusedField === 'subject' 
              ? 'border-accent-highlight ring-2 ring-accent-highlight/20' 
              : 'border-border hover:border-accent-secondary'
            }
          `}
          placeholder="Brief topic identifier (optional)"
        />
      </motion.div>

      {/* Budget & Timeline Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <label className="block mb-2">
            <span className="text-sm font-mono text-text-secondary uppercase tracking-wider">
              Resource Allocation
            </span>
          </label>
          <div className="relative">
            <select
              value={state.budget}
              onChange={(e) => setState(prev => ({ ...prev, budget: e.target.value }))}
              onFocus={() => setFocusedField('budget')}
              onBlur={() => setFocusedField(null)}
              className={`
                w-full px-4 py-3 rounded-xl border transition-all duration-300
                bg-bg-secondary text-text-primary appearance-none cursor-pointer
                ${focusedField === 'budget' 
                  ? 'border-accent-highlight ring-2 ring-accent-highlight/20' 
                  : 'border-border hover:border-accent-secondary'
                }
              `}
            >
              {budgetOptions.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
              <ChevronIcon />
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
        >
          <label className="block mb-2">
            <span className="text-sm font-mono text-text-secondary uppercase tracking-wider">
              Temporal Parameters
            </span>
          </label>
          <div className="relative">
            <select
              value={state.timeline}
              onChange={(e) => setState(prev => ({ ...prev, timeline: e.target.value }))}
              onFocus={() => setFocusedField('timeline')}
              onBlur={() => setFocusedField(null)}
              className={`
                w-full px-4 py-3 rounded-xl border transition-all duration-300
                bg-bg-secondary text-text-primary appearance-none cursor-pointer
                ${focusedField === 'timeline' 
                  ? 'border-accent-highlight ring-2 ring-accent-highlight/20' 
                  : 'border-border hover:border-accent-secondary'
                }
              `}
            >
              {timelineOptions.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
              <ChevronIcon />
            </div>
          </div>
        </motion.div>
      </div>

      {/* Message */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
      >
        <label className="block mb-2">
          <span className="text-sm font-mono text-text-secondary uppercase tracking-wider">
            Primary Transmission *
          </span>
        </label>
        <div className="relative">
          <textarea
            value={state.message}
            onChange={(e) => setState(prev => ({ ...prev, message: e.target.value }))}
            onFocus={() => setFocusedField('message')}
            onBlur={() => setFocusedField(null)}
            required
            rows={6}
            className={`
              w-full px-4 py-3 rounded-xl border transition-all duration-300
              bg-bg-secondary text-text-primary placeholder-text-muted resize-none
              ${focusedField === 'message' 
                ? 'border-accent-burgundy ring-2 ring-accent-burgundy/20' 
                : 'border-border hover:border-accent-secondary'
              }
            `}
            placeholder="Describe your vision, challenge, or collaboration idea..."
          />
          <div className="absolute bottom-3 right-3 text-xs text-text-muted">
            {state.message.length} / 1000
          </div>
        </div>
      </motion.div>

      {/* Submit Button */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.9 }}
        className="flex flex-col sm:flex-row gap-4 items-center justify-between"
      >
        <p className="text-xs text-text-muted">
          {canUseFunctional ? (
            <span className="flex items-center gap-1">
              <SecureIcon />
              Secure channel established. GDPR compliant.
            </span>
          ) : (
            <span className="text-accent-alert">
              Functional cookies required for form submission
            </span>
          )}
        </p>
        
        <motion.button
          type="submit"
          disabled={state.status === 'loading' || !canUseFunctional}
          className={`
            relative px-8 py-3 rounded-xl font-medium transition-all duration-300
            ${state.status === 'loading' || !canUseFunctional
              ? 'bg-bg-tertiary text-text-muted cursor-not-allowed'
              : 'bg-gradient-to-r from-accent-burgundy to-accent-highlight text-white hover:shadow-lg hover:scale-105'
            }
          `}
          whileTap={{ scale: state.status === 'loading' ? 1 : 0.95 }}
        >
          <span className="relative z-10 flex items-center gap-2">
            {state.status === 'loading' ? (
              <>
                <LoadingSpinner />
                <span>Transmitting...</span>
              </>
            ) : (
              <>
                <span>Transmit Message</span>
                <TransmitArrow />
              </>
            )}
          </span>
        </motion.button>
      </motion.div>

      {/* Status Messages */}
      <AnimatePresence>
        {state.status === 'success' && (
          <motion.div
            initial={{ opacity: 0, y: -10, height: 0 }}
            animate={{ opacity: 1, y: 0, height: 'auto' }}
            exit={{ opacity: 0, y: -10, height: 0 }}
            className="bg-accent-sage/10 border border-accent-sage/20 rounded-xl p-4"
          >
            <div className="flex items-start gap-3">
              <SuccessIcon />
              <div>
                <p className="font-medium text-accent-sage">Transmission Successful</p>
                <p className="text-sm text-text-secondary mt-1">{state.statusMessage}</p>
              </div>
            </div>
          </motion.div>
        )}

        {state.status === 'error' && (
          <motion.div
            initial={{ opacity: 0, y: -10, height: 0 }}
            animate={{ opacity: 1, y: 0, height: 'auto' }}
            exit={{ opacity: 0, y: -10, height: 0 }}
            className="bg-accent-alert/10 border border-accent-alert/20 rounded-xl p-4"
          >
            <div className="flex items-start gap-3">
              <ErrorIcon />
              <div>
                <p className="font-medium text-accent-alert">Transmission Error</p>
                <p className="text-sm text-text-secondary mt-1">{state.statusMessage}</p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </form>
  );
}

// Icon Components
const IdentityIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" className="text-accent-burgundy">
    <circle cx="12" cy="8" r="3" stroke="currentColor" strokeWidth="1.5"/>
    <path d="M16 16C16 14 14 13 12 13C10 13 8 14 8 16V19H16V16Z" stroke="currentColor" strokeWidth="1.5"/>
  </svg>
);

const ChannelIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" className="text-accent-burgundy">
    <rect x="3" y="6" width="18" height="12" rx="2" stroke="currentColor" strokeWidth="1.5"/>
    <path d="M3 8L12 13L21 8" stroke="currentColor" strokeWidth="1.5"/>
  </svg>
);

const ChevronIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" className="text-text-secondary">
    <path d="M6 9L12 15L18 9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const SecureIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" className="text-accent-sage">
    <path d="M12 2L4 7V11C4 16 7 20 12 21C17 20 20 16 20 11V7L12 2Z" stroke="currentColor" strokeWidth="1.5"/>
    <path d="M9 12L11 14L15 10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
  </svg>
);

const TransmitArrow = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
    <path d="M22 2L11 13M22 2L15 22L11 13L2 9L22 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const LoadingSpinner = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" className="animate-spin">
    <circle cx="12" cy="12" r="10" fill="none" stroke="currentColor" strokeWidth="2" strokeDasharray="32" strokeDashoffset="32">
      <animate attributeName="stroke-dashoffset" dur="1s" repeatCount="indefinite" from="32" to="0"/>
    </circle>
  </svg>
);

const SuccessIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" className="text-accent-sage flex-shrink-0">
    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="1.5"/>
    <path d="M8 12L11 15L16 9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const ErrorIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" className="text-accent-alert flex-shrink-0">
    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="1.5"/>
    <path d="M12 8V12M12 16H12.01" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
  </svg>
);