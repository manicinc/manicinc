// Hook to optimize performance during scroll by adding/removing 'is-scrolling' class
'use client';

import { useEffect, useRef } from 'react';

export function useScrollOptimization() {
  const scrollTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const isScrollingRef = useRef(false);

  useEffect(() => {
    const handleScroll = () => {
      // Only add class if not already scrolling
      if (!isScrollingRef.current) {
        document.documentElement.classList.add('is-scrolling');
        isScrollingRef.current = true;
      }

      // Clear existing timeout
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }

      // Remove class after scroll ends (150ms debounce)
      scrollTimeoutRef.current = setTimeout(() => {
        document.documentElement.classList.remove('is-scrolling');
        isScrollingRef.current = false;
      }, 150);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }
      document.documentElement.classList.remove('is-scrolling');
    };
  }, []);
}

export default useScrollOptimization;

