'use client';

import React, { useState, useEffect } from 'react';
import { X, Cookie, Shield, Eye, MessageCircle, BarChart3, Settings, ChevronDown, ChevronUp } from 'lucide-react';
// Use lazy-loaded motion for better performance
import { motion, AnimatePresence } from '@/components/LazyMotion';

interface CookiePreferences {
  essential: boolean;
  analytics: boolean;
  functional: boolean;
  marketing: boolean;
}

interface CookieConsentBannerProps {
  onConsentChange?: (preferences: CookiePreferences) => void;
}

const CONSENT_STORAGE_KEY = 'manic_cookie_consent';
const CONSENT_VERSION = '1.0';

export function CookieConsentBanner({ onConsentChange }: CookieConsentBannerProps) {
  const [showBanner, setShowBanner] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [preferences, setPreferences] = useState<CookiePreferences>({
    essential: true, // Always true, can't be disabled
    analytics: false,
    functional: false,
    marketing: false,
  });

  // Check if consent has already been given
  useEffect(() => {
    const savedConsent = localStorage.getItem(CONSENT_STORAGE_KEY);
    if (savedConsent) {
      try {
        const { preferences: savedPrefs, version } = JSON.parse(savedConsent);
        if (version === CONSENT_VERSION) {
          // Consent already given with current version
          onConsentChange?.(savedPrefs);
          return;
        }
      } catch (e) {
        // Invalid stored consent, show banner
      }
    }
    
    // Show banner after a short delay for better UX
    const timer = setTimeout(() => setShowBanner(true), 1000);
    return () => clearTimeout(timer);
  }, [onConsentChange]);

  const saveConsent = (prefs: CookiePreferences) => {
    const consentData = {
      preferences: prefs,
      timestamp: Date.now(),
      version: CONSENT_VERSION,
    };
    
    localStorage.setItem(CONSENT_STORAGE_KEY, JSON.stringify(consentData));
    onConsentChange?.(prefs);
    setShowBanner(false);
  };

  const handleAcceptAll = () => {
    const allAccepted = {
      essential: true,
      analytics: true,
      functional: true,
      marketing: true,
    };
    saveConsent(allAccepted);
  };

  const handleAcceptEssential = () => {
    const essentialOnly = {
      essential: true,
      analytics: false,
      functional: false,
      marketing: false,
    };
    saveConsent(essentialOnly);
  };

  const handleSavePreferences = () => {
    saveConsent(preferences);
  };

  const handlePreferenceChange = (key: keyof CookiePreferences, value: boolean) => {
    if (key === 'essential') return; // Essential cookies can't be disabled
    setPreferences(prev => ({ ...prev, [key]: value }));
  };

  const cookieCategories = [
    {
      key: 'essential' as const,
      title: 'Essential',
      description: 'Required for basic site functionality and theme preferences',
      icon: <Shield size={16} />,
      required: true,
      examples: ['Theme preferences', 'Session management', 'Security tokens']
    },
    {
      key: 'functional' as const,
      title: 'Functional',
      description: 'Enhance your experience with personalized features',
      icon: <Settings size={16} />,
      required: false,
      examples: ['Reading preferences', 'Language settings', 'UI customizations']
    },
    {
      key: 'analytics' as const,
      title: 'Analytics',
      description: 'Help us understand how our site is used',
      icon: <BarChart3 size={16} />,
      required: false,
      examples: ['Google Analytics', 'Page views', 'User behavior tracking']
    },
    {
      key: 'marketing' as const,
      title: 'Marketing',
      description: 'Enable social features and comment systems',
      icon: <MessageCircle size={16} />,
      required: false,
      examples: ['Disqus comments', 'Giscus integration', 'Social sharing']
    }
  ];

  if (!showBanner) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 100 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 100 }}
        className="fixed bottom-0 left-0 right-0 z-50 p-4 sm:p-6"
      >
        <div className="cookie-consent-banner">
          {/* Main Banner */}
          <div className="cookie-banner-content">
            {/* Header */}
            <div className="cookie-banner-header">
              <div className="cookie-banner-icon">
                <Cookie size={24} />
              </div>
              <h3 className="cookie-banner-title">
                Cookie Preferences
              </h3>
              <button
                onClick={handleAcceptEssential}
                className="cookie-banner-close"
                aria-label="Accept Essential Only"
              >
                <X size={18} />
              </button>
            </div>

            {/* Description */}
            <div className="cookie-banner-description">
              <p>
                We use cookies to enhance your experience, analyze site usage, and assist with marketing. 
                Your privacy matters - choose what you're comfortable with.
              </p>
            </div>

            {/* Detailed Preferences */}
            <AnimatePresence>
              {showDetails && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="cookie-preferences-details"
                >
                  {cookieCategories.map((category) => (
                    <div key={category.key} className="cookie-category">
                      <div className="cookie-category-header">
                        <div className="cookie-category-info">
                          <div className="cookie-category-icon">
                            {category.icon}
                          </div>
                          <div>
                            <h4 className="cookie-category-title">
                              {category.title}
                              {category.required && <span className="required-badge">Required</span>}
                            </h4>
                            <p className="cookie-category-description">
                              {category.description}
                            </p>
                            <div className="cookie-examples">
                              {category.examples.map((example, idx) => (
                                <span key={idx} className="cookie-example-tag">
                                  {example}
                                </span>
                              ))}
                            </div>
                          </div>
                        </div>
                        <div className="cookie-category-toggle">
                          <label className="toggle-switch">
                            <input
                              type="checkbox"
                              checked={preferences[category.key]}
                              onChange={(e) => handlePreferenceChange(category.key, e.target.checked)}
                              disabled={category.required}
                              aria-label={`${category.required ? 'Required: ' : ''}Enable ${category.title} cookies`}
                            />
                            <span className="toggle-slider"></span>
                          </label>
                        </div>
                      </div>
                    </div>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>

            {/* Actions */}
            <div className="cookie-banner-actions">
              <button
                onClick={() => setShowDetails(!showDetails)}
                className="cookie-btn cookie-btn-details"
              >
                <span>Customize</span>
                {showDetails ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
              </button>
              
              <div className="cookie-action-buttons">
                <button
                  onClick={handleAcceptEssential}
                  className="cookie-btn cookie-btn-essential"
                >
                  Essential Only
                </button>
                
                {showDetails ? (
                  <button
                    onClick={handleSavePreferences}
                    className="cookie-btn cookie-btn-save"
                  >
                    Save Preferences
                  </button>
                ) : (
                  <button
                    onClick={handleAcceptAll}
                    className="cookie-btn cookie-btn-accept"
                  >
                    Accept All
                  </button>
                )}
              </div>
            </div>

            {/* Privacy Link */}
            <div className="cookie-privacy-link">
              <a href="/privacy" className="privacy-policy-link">
                <Eye size={14} />
                Privacy Policy
              </a>
            </div>
          </div>
        </div>

        {/* Styles */}
        <style jsx>{`
          .cookie-consent-banner {
            max-width: 600px;
            margin: 0 auto;
            background: rgba(var(--bg-primary-rgb), 0.98);
            border: 1px solid rgba(var(--accent-primary-rgb), 0.2);
            border-radius: 12px;
            box-shadow: 
              0 20px 25px -5px rgba(0, 0, 0, 0.1),
              0 10px 10px -5px rgba(0, 0, 0, 0.04),
              0 0 30px rgba(var(--accent-highlight-rgb), 0.1);
            backdrop-filter: blur(16px);
            -webkit-backdrop-filter: blur(16px);
            overflow: hidden;
          }

          .cookie-banner-content {
            padding: 1.5rem;
          }

          .cookie-banner-header {
            display: flex;
            align-items: center;
            gap: 0.75rem;
            margin-bottom: 1rem;
          }

          .cookie-banner-icon {
            color: var(--accent-highlight);
            flex-shrink: 0;
          }

          .cookie-banner-title {
            font-size: 1.125rem;
            font-weight: 600;
            color: var(--text-heading);
            margin: 0;
            flex: 1;
          }

          .cookie-banner-close {
            background: none;
            border: none;
            color: var(--text-muted);
            cursor: pointer;
            padding: 0.25rem;
            border-radius: 4px;
            transition: all 0.2s ease;
            flex-shrink: 0;
          }

          .cookie-banner-close:hover {
            color: var(--text-primary);
            background: rgba(var(--text-primary-rgb), 0.1);
          }

          .cookie-banner-description {
            margin-bottom: 1.25rem;
          }

          .cookie-banner-description p {
            margin: 0;
            color: var(--text-secondary);
            line-height: 1.5;
            font-size: 0.9rem;
          }

          .cookie-preferences-details {
            border-top: 1px solid rgba(var(--text-primary-rgb), 0.1);
            padding-top: 1rem;
            margin-bottom: 1.25rem;
          }

          .cookie-category {
            margin-bottom: 1rem;
          }

          .cookie-category:last-child {
            margin-bottom: 0;
          }

          .cookie-category-header {
            display: flex;
            align-items: flex-start;
            gap: 1rem;
            padding: 0.75rem;
            background: rgba(var(--bg-secondary-rgb), 0.5);
            border-radius: 8px;
            border: 1px solid rgba(var(--text-primary-rgb), 0.05);
          }

          .cookie-category-info {
            display: flex;
            align-items: flex-start;
            gap: 0.75rem;
            flex: 1;
          }

          .cookie-category-icon {
            color: var(--accent-primary);
            margin-top: 0.125rem;
            flex-shrink: 0;
          }

          .cookie-category-title {
            font-size: 0.9rem;
            font-weight: 600;
            color: var(--text-heading);
            margin: 0 0 0.25rem 0;
            display: flex;
            align-items: center;
            gap: 0.5rem;
          }

          .required-badge {
            font-size: 0.65rem;
            padding: 0.125rem 0.375rem;
            background: var(--accent-secondary);
            color: var(--bg-primary);
            border-radius: 10px;
            font-weight: 500;
            text-transform: uppercase;
            letter-spacing: 0.025em;
          }

          .cookie-category-description {
            font-size: 0.8rem;
            color: var(--text-secondary);
            margin: 0 0 0.5rem 0;
            line-height: 1.4;
          }

          .cookie-examples {
            display: flex;
            flex-wrap: wrap;
            gap: 0.25rem;
          }

          .cookie-example-tag {
            font-size: 0.7rem;
            padding: 0.125rem 0.375rem;
            background: rgba(var(--accent-primary-rgb), 0.1);
            color: var(--accent-primary);
            border-radius: 4px;
            border: 1px solid rgba(var(--accent-primary-rgb), 0.2);
          }

          .cookie-category-toggle {
            flex-shrink: 0;
          }

          .toggle-switch {
            position: relative;
            display: inline-block;
            width: 48px;
            height: 24px;
          }

          .toggle-switch input {
            opacity: 0;
            width: 0;
            height: 0;
          }

          .toggle-slider {
            position: absolute;
            cursor: pointer;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: rgba(var(--text-muted-rgb), 0.3);
            transition: 0.3s;
            border-radius: 24px;
            border: 1px solid rgba(var(--text-muted-rgb), 0.2);
          }

          .toggle-slider:before {
            position: absolute;
            content: "";
            height: 18px;
            width: 18px;
            left: 2px;
            bottom: 2px;
            background: var(--bg-primary);
            transition: 0.3s;
            border-radius: 50%;
            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
          }

          input:checked + .toggle-slider {
            background: var(--accent-highlight);
            border-color: var(--accent-highlight);
          }

          input:checked + .toggle-slider:before {
            transform: translateX(24px);
          }

          input:disabled + .toggle-slider {
            background: var(--accent-secondary);
            border-color: var(--accent-secondary);
            cursor: not-allowed;
          }

          input:disabled + .toggle-slider:before {
            background: var(--bg-primary);
          }

          .cookie-banner-actions {
            display: flex;
            flex-direction: column;
            gap: 0.75rem;
            margin-bottom: 1rem;
          }

          @media (min-width: 640px) {
            .cookie-banner-actions {
              flex-direction: row;
              align-items: center;
              justify-content: space-between;
            }
          }

          .cookie-action-buttons {
            display: flex;
            gap: 0.5rem;
            flex-wrap: wrap;
          }

          .cookie-btn {
            font-family: var(--font-mono);
            font-size: 0.8rem;
            padding: 0.5rem 1rem;
            border-radius: 6px;
            border: 1px solid;
            cursor: pointer;
            transition: all 0.2s ease;
            font-weight: 500;
            text-transform: uppercase;
            letter-spacing: 0.025em;
            display: inline-flex;
            align-items: center;
            gap: 0.375rem;
            white-space: nowrap;
          }

          .cookie-btn-details {
            color: var(--text-secondary);
            background: transparent;
            border-color: rgba(var(--text-secondary-rgb), 0.3);
          }

          .cookie-btn-details:hover {
            color: var(--text-primary);
            border-color: var(--text-primary);
            background: rgba(var(--text-primary-rgb), 0.05);
          }

          .cookie-btn-essential {
            color: var(--accent-secondary);
            background: rgba(var(--accent-secondary-rgb), 0.1);
            border-color: var(--accent-secondary);
          }

          .cookie-btn-essential:hover {
            background: rgba(var(--accent-secondary-rgb), 0.2);
            transform: translateY(-1px);
          }

          .cookie-btn-accept,
          .cookie-btn-save {
            color: var(--bg-primary);
            background: var(--accent-highlight);
            border-color: var(--accent-highlight);
          }

          .cookie-btn-accept:hover,
          .cookie-btn-save:hover {
            background: var(--accent-primary);
            border-color: var(--accent-primary);
            transform: translateY(-1px);
            box-shadow: 0 4px 12px rgba(var(--accent-highlight-rgb), 0.3);
          }

          .cookie-privacy-link {
            text-align: center;
          }

          .privacy-policy-link {
            display: inline-flex;
            align-items: center;
            gap: 0.375rem;
            font-size: 0.75rem;
            color: var(--text-muted);
            text-decoration: none;
            transition: color 0.2s ease;
          }

          .privacy-policy-link:hover {
            color: var(--accent-highlight);
          }

          /* Mobile Responsive */
          @media (max-width: 640px) {
            .cookie-consent-banner {
              margin: 0;
              border-radius: 12px 12px 0 0;
              max-height: calc(100vh - 60px); /* Prevent overlapping with nav */
              overflow-y: auto; /* Allow scrolling if content is too tall */
            }

            .cookie-banner-content {
              padding: 1.25rem;
              max-height: calc(100vh - 120px); /* Account for banner padding */
              overflow-y: auto;
            }
            
            .cookie-preferences-details {
              max-height: 50vh; /* Limit expanded details height */
              overflow-y: auto;
              padding-top: 0.75rem;
              margin-bottom: 1rem;
            }

            .cookie-category-header {
              flex-direction: column;
              gap: 0.75rem;
              padding: 0.5rem;
            }

            .cookie-category-toggle {
              align-self: flex-end;
            }

            .cookie-action-buttons {
              width: 100%;
              justify-content: space-between;
            }

            .cookie-btn {
              flex: 1;
              justify-content: center;
              min-width: 0;
              font-size: 0.75rem; /* Smaller text on mobile */
              padding: 0.4rem 0.8rem; /* Smaller padding */
            }
            
            /* Ensure modal doesn't go above viewport */
            .cookie-banner-header {
              position: sticky;
              top: 0;
              background: rgba(var(--bg-primary-rgb), 0.98);
              z-index: 10;
              margin-bottom: 0.75rem;
              padding-bottom: 0.5rem;
              border-bottom: 1px solid rgba(var(--text-primary-rgb), 0.1);
            }
            
            .cookie-banner-actions {
              position: sticky;
              bottom: 0;
              background: rgba(var(--bg-primary-rgb), 0.98);
              padding-top: 0.75rem;
              border-top: 1px solid rgba(var(--text-primary-rgb), 0.1);
              margin-top: 0.75rem;
              margin-bottom: 0;
            }
          }

          /* Ultra-small screens */
          @media (max-width: 480px) {
            .cookie-consent-banner {
              max-height: calc(100vh - 40px); /* Even more conservative on tiny screens */
            }
            
            .cookie-banner-content {
              padding: 1rem;
              max-height: calc(100vh - 80px);
            }
            
            .cookie-preferences-details {
              max-height: 40vh; /* Even smaller on tiny screens */
            }
            
            .cookie-btn {
              font-size: 0.7rem;
              padding: 0.35rem 0.6rem;
            }
          }

          /* Dark mode adjustments handled by CSS variables */
        `}</style>
      </motion.div>
    </AnimatePresence>
  );
}

export default CookieConsentBanner; 