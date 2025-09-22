'use client';

import { useEffect, useState, ReactNode } from 'react';

interface BlogPerformanceWrapperProps {
  children: ReactNode;
}

/**
 * Performance optimization wrapper for blog pages
 * - Disables animations during scroll
 * - Lazy loads heavy components
 * - Optimizes render cycles
 */
export default function BlogPerformanceWrapper({ children }: BlogPerformanceWrapperProps) {
  const [isScrolling, setIsScrolling] = useState(false);
  const [scrollTimeout, setScrollTimeout] = useState<NodeJS.Timeout | null>(null);

  useEffect(() => {
    let ticking = false;

    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          // Add scrolling class to body
          document.body.classList.add('is-scrolling');
          setIsScrolling(true);

          // Clear existing timeout
          if (scrollTimeout) {
            clearTimeout(scrollTimeout);
          }

          // Remove scrolling class after scroll stops
          const timeout = setTimeout(() => {
            document.body.classList.remove('is-scrolling');
            setIsScrolling(false);
          }, 150);

          setScrollTimeout(timeout);
          ticking = false;
        });
        ticking = true;
      }
    };

    // Optimize images for lazy loading
    const optimizeImages = () => {
      const images = document.querySelectorAll('img[loading="lazy"]');
      if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries) => {
          entries.forEach(entry => {
            if (entry.isIntersecting) {
              const img = entry.target as HTMLImageElement;
              if (img.dataset.src) {
                img.src = img.dataset.src;
                imageObserver.unobserve(img);
              }
            }
          });
        }, {
          rootMargin: '200px'
        });

        images.forEach(img => imageObserver.observe(img));
      }
    };

    // Optimize animations
    const optimizeAnimations = () => {
      // Pause CSS animations when not visible
      const animatedElements = document.querySelectorAll('[class*="animate"], [class*="pulse"], [class*="vine"]');

      if ('IntersectionObserver' in window) {
        const animationObserver = new IntersectionObserver((entries) => {
          entries.forEach(entry => {
            const element = entry.target as HTMLElement;
            if (entry.isIntersecting) {
              element.style.animationPlayState = 'running';
            } else {
              element.style.animationPlayState = 'paused';
            }
          });
        }, {
          threshold: 0.1
        });

        animatedElements.forEach(el => animationObserver.observe(el));
      }
    };

    // Defer non-critical CSS
    const deferNonCriticalCSS = () => {
      const links = document.querySelectorAll('link[rel="stylesheet"]');
      links.forEach(link => {
        const href = link.getAttribute('href');
        if (href && (href.includes('blog') || href.includes('vine'))) {
          link.setAttribute('media', 'print');
          link.setAttribute('onload', "this.media='all'");
        }
      });
    };

    // Apply optimizations
    window.addEventListener('scroll', handleScroll, { passive: true });

    // Delay heavy optimizations
    const optimizationTimer = setTimeout(() => {
      optimizeImages();
      optimizeAnimations();
      deferNonCriticalCSS();
    }, 100);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (scrollTimeout) clearTimeout(scrollTimeout);
      clearTimeout(optimizationTimer);
    };
  }, [scrollTimeout]);

  // Add performance monitoring
  useEffect(() => {
    if (typeof window !== 'undefined' && 'performance' in window) {
      // Log performance metrics
      const observer = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          if (entry.entryType === 'largest-contentful-paint') {
            console.log('LCP:', entry.startTime);
          }
          if (entry.entryType === 'first-input' && 'processingStart' in entry) {
            const delay = (entry as any).processingStart - entry.startTime;
            console.log('FID:', delay);
          }
        }
      });

      try {
        observer.observe({ entryTypes: ['largest-contentful-paint', 'first-input'] });
      } catch (e) {
        // Fallback for browsers that don't support these entry types
      }

      return () => observer.disconnect();
    }
  }, []);

  return (
    <div className={`blog-performance-wrapper ${isScrolling ? 'scrolling' : ''}`}>
      {children}
    </div>
  );
}