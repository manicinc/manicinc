'use client';

import { useState, useEffect, useCallback } from 'react';

interface NewsletterModalState {
  hasSignedUp: boolean;
  hasClickedNeverShow: boolean;
  hasSeenModal: boolean;
  lastShownDate: string | null;
}

const STORAGE_KEY = 'blog-newsletter-modal-state';
const SCROLL_THRESHOLD = 0.25; // Show after scrolling 25% of page
const DELAY_MS = 3000; // Wait 3 seconds after scroll threshold
const COOLDOWN_DAYS = 7; // Don't show again for 7 days if dismissed

export function useBlogNewsletterModal() {
  const [showModal, setShowModal] = useState(false);
  const [hasScrolledEnough, setHasScrolledEnough] = useState(false);
  const [timeoutId, setTimeoutId] = useState<NodeJS.Timeout | null>(null);

  // Load state from localStorage
  const loadState = useCallback((): NewsletterModalState => {
    if (typeof window === 'undefined') {
      return {
        hasSignedUp: false,
        hasClickedNeverShow: false,
        hasSeenModal: false,
        lastShownDate: null
      };
    }

    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (error) {
      console.warn('Failed to load newsletter modal state:', error);
    }

    return {
      hasSignedUp: false,
      hasClickedNeverShow: false,
      hasSeenModal: false,
      lastShownDate: null
    };
  }, []);

  // Save state to localStorage
  const saveState = useCallback((state: NewsletterModalState) => {
    if (typeof window === 'undefined') return;

    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch (error) {
      console.warn('Failed to save newsletter modal state:', error);
    }
  }, []);

  // Check if we should show the modal
  const shouldShowModal = useCallback(() => {
    const state = loadState();
    
    // Don't show if user has signed up or clicked never show
    if (state.hasSignedUp || state.hasClickedNeverShow) {
      return false;
    }

    // Check cooldown period
    if (state.lastShownDate) {
      const lastShown = new Date(state.lastShownDate);
      const now = new Date();
      const daysSince = (now.getTime() - lastShown.getTime()) / (1000 * 60 * 60 * 24);
      
      if (daysSince < COOLDOWN_DAYS) {
        return false;
      }
    }

    return true;
  }, [loadState]);

  // Handle scroll detection
  const handleScroll = useCallback(() => {
    const scrollTop = window.scrollY;
    const windowHeight = window.innerHeight;
    const documentHeight = document.documentElement.scrollHeight;
    const scrollPercentage = scrollTop / (documentHeight - windowHeight);

    if (scrollPercentage >= SCROLL_THRESHOLD && !hasScrolledEnough) {
      setHasScrolledEnough(true);
      
      // Clear any existing timeout
      if (timeoutId) {
        clearTimeout(timeoutId);
      }

      // Set timeout to show modal after delay
      const newTimeoutId = setTimeout(() => {
        if (shouldShowModal()) {
          setShowModal(true);
          
          // Update last shown date
          const state = loadState();
          saveState({
            ...state,
            hasSeenModal: true,
            lastShownDate: new Date().toISOString()
          });
        }
      }, DELAY_MS);

      setTimeoutId(newTimeoutId);
    }
  }, [hasScrolledEnough, timeoutId, shouldShowModal, loadState, saveState]);

  // Set up scroll listener
  useEffect(() => {
    if (!shouldShowModal()) {
      return;
    }

    window.addEventListener('scroll', handleScroll, { passive: true });
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
  }, [handleScroll, shouldShowModal, timeoutId]);

  // Close modal handler
  const closeModal = useCallback(() => {
    setShowModal(false);
  }, []);

  // Never show again handler
  const neverShowAgain = useCallback(() => {
    const state = loadState();
    saveState({
      ...state,
      hasClickedNeverShow: true
    });
    setShowModal(false);
  }, [loadState, saveState]);

  // Mark as signed up (call this when user successfully subscribes)
  const markAsSignedUp = useCallback(() => {
    const state = loadState();
    saveState({
      ...state,
      hasSignedUp: true
    });
    setShowModal(false);
  }, [loadState, saveState]);

  // Reset state (for testing/debugging)
  const resetState = useCallback(() => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem(STORAGE_KEY);
    }
  }, []);

  return {
    showModal,
    closeModal,
    neverShowAgain,
    markAsSignedUp,
    resetState
  };
}
