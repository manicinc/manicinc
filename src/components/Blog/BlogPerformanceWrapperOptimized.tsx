'use client';

import { useEffect, useState, ReactNode, useRef } from 'react';

interface BlogPerformanceWrapperProps {
  children: ReactNode;
}

/**
 * Optimized performance wrapper for blog pages
 * - Uses single shared IntersectionObserver
 * - Reduces re-renders
 * - Optimizes scroll handling
 */
export default function BlogPerformanceWrapper({ children }: BlogPerformanceWrapperProps) {
  const [isScrolling, setIsScrolling] = useState(false);
  const scrollTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    // Optimized scroll handler with RAF
    const handleScroll = () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      
      rafRef.current = requestAnimationFrame(() => {
        document.body.classList.add('is-scrolling');
        setIsScrolling(true);

        // Clear existing timeout
        if (scrollTimeoutRef.current) {
          clearTimeout(scrollTimeoutRef.current);
        }

        // Remove scrolling class after scroll stops
        scrollTimeoutRef.current = setTimeout(() => {
          document.body.classList.remove('is-scrolling');
          setIsScrolling(false);
        }, 150);
      });
    };

    // Single observer for all performance optimizations
    const setupObserver = () => {
      if (!('IntersectionObserver' in window)) return;

      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          const element = entry.target as HTMLElement;
          
          // Handle lazy images
          if (element.tagName === 'IMG' && element.dataset.src) {
            if (entry.isIntersecting) {
              (element as HTMLImageElement).src = element.dataset.src;
              delete element.dataset.src;
              observer.unobserve(element);
            }
          }
          
          // Handle animations
          if (element.matches('[class*="animate"], [class*="pulse"], [class*="vine"]')) {
            element.style.animationPlayState = entry.isIntersecting ? 'running' : 'paused';
          }
        });
      }, {
        rootMargin: '200px',
        threshold: 0.1
      });

      // Observe all relevant elements at once
      requestAnimationFrame(() => {
        const elements = document.querySelectorAll(
          'img[loading="lazy"][data-src], [class*="animate"], [class*="pulse"], [class*="vine"]'
        );
        elements.forEach(el => observer.observe(el));
      });

      return observer;
    };

    // Defer non-critical CSS (run once)
    const deferNonCriticalCSS = () => {
      const links = document.querySelectorAll<HTMLLinkElement>('link[rel="stylesheet"]');
      links.forEach(link => {
        const href = link.getAttribute('href');
        if (href && (href.includes('blog') || href.includes('vine'))) {
          link.media = 'print';
          link.onload = function() { link.media = 'all'; };
        }
      });
    };

    // Setup
    window.addEventListener('scroll', handleScroll, { passive: true });
    
    // Delay heavy optimizations to after initial render
    const setupTimer = setTimeout(() => {
      const observer = setupObserver();
      deferNonCriticalCSS();
      
      // Cleanup function
      return () => {
        observer?.disconnect();
      };
    }, 100);

    // Cleanup
    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (scrollTimeoutRef.current) clearTimeout(scrollTimeoutRef.current);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      clearTimeout(setupTimer);
    };
  }, []);

  return (
    <div className={`blog-performance-wrapper ${isScrolling ? 'scrolling' : ''}`}>
      {children}
    </div>
  );
}
