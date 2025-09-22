'use client';

import { useEffect } from 'react';
import { useAnalytics } from '@/components/Analytics';

interface PerformanceMetrics {
  FCP: number | null; // First Contentful Paint
  LCP: number | null; // Largest Contentful Paint
  FID: number | null; // First Input Delay
  CLS: number | null; // Cumulative Layout Shift
  TTFB: number | null; // Time to First Byte
  INP: number | null; // Interaction to Next Paint
}

export default function PerformanceMonitor() {
  const { trackEvent } = useAnalytics();

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const metrics: PerformanceMetrics = {
      FCP: null,
      LCP: null,
      FID: null,
      CLS: null,
      TTFB: null,
      INP: null,
    };

    // Observe Core Web Vitals
    try {
      // First Contentful Paint
      const fcpObserver = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          if (entry.name === 'first-contentful-paint') {
            metrics.FCP = entry.startTime;
            trackEvent('web_vitals', {
              metric: 'FCP',
              value: Math.round(entry.startTime),
            });
          }
        }
      });
      fcpObserver.observe({ entryTypes: ['paint'] });

      // Largest Contentful Paint
      const lcpObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        const lastEntry = entries[entries.length - 1] as any;
        if (lastEntry) {
          metrics.LCP = lastEntry.renderTime || lastEntry.loadTime || lastEntry.startTime;
          if (metrics.LCP) {
            trackEvent('web_vitals', {
              metric: 'LCP',
              value: Math.round(metrics.LCP),
            });
          }
        }
      });
      lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] });

      // First Input Delay
      const fidObserver = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          const fidEntry = entry as PerformanceEventTiming;
          metrics.FID = fidEntry.processingStart - fidEntry.startTime;
          trackEvent('web_vitals', {
            metric: 'FID',
            value: Math.round(metrics.FID),
          });
        }
      });
      fidObserver.observe({ entryTypes: ['first-input'] });

      // Cumulative Layout Shift
      let clsValue = 0;
      const clsObserver = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          if (!(entry as any).hadRecentInput) {
            clsValue += (entry as any).value;
            metrics.CLS = clsValue;
          }
        }
      });
      clsObserver.observe({ entryTypes: ['layout-shift'] });

      // Time to First Byte
      const navigationEntry = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
      if (navigationEntry) {
        metrics.TTFB = navigationEntry.responseStart - navigationEntry.fetchStart;
        trackEvent('web_vitals', {
          metric: 'TTFB',
          value: Math.round(metrics.TTFB),
        });
      }

      // Send metrics on page unload
      const sendMetrics = () => {
        if (metrics.CLS !== null) {
          trackEvent('web_vitals', {
            metric: 'CLS',
            value: Math.round(metrics.CLS * 1000), // Convert to milliseconds
          });
        }

        // Check performance budget
        checkPerformanceBudget(metrics);
      };

      window.addEventListener('pagehide', sendMetrics);
      window.addEventListener('beforeunload', sendMetrics);

      // Cleanup
      return () => {
        fcpObserver.disconnect();
        lcpObserver.disconnect();
        fidObserver.disconnect();
        clsObserver.disconnect();
        window.removeEventListener('pagehide', sendMetrics);
        window.removeEventListener('beforeunload', sendMetrics);
      };
    } catch (error) {
      console.error('Performance monitoring error:', error);
    }
  }, [trackEvent]);

  // Check if metrics meet performance budgets
  const checkPerformanceBudget = (metrics: PerformanceMetrics) => {
    const budgets = {
      FCP: 1800, // 1.8s
      LCP: 2500, // 2.5s
      FID: 100, // 100ms
      CLS: 0.1, // 0.1
      TTFB: 800, // 800ms
    };

    const violations: string[] = [];

    if (metrics.FCP && metrics.FCP > budgets.FCP) {
      violations.push(`FCP: ${metrics.FCP}ms (budget: ${budgets.FCP}ms)`);
    }
    if (metrics.LCP && metrics.LCP > budgets.LCP) {
      violations.push(`LCP: ${metrics.LCP}ms (budget: ${budgets.LCP}ms)`);
    }
    if (metrics.FID && metrics.FID > budgets.FID) {
      violations.push(`FID: ${metrics.FID}ms (budget: ${budgets.FID}ms)`);
    }
    if (metrics.CLS && metrics.CLS > budgets.CLS) {
      violations.push(`CLS: ${metrics.CLS} (budget: ${budgets.CLS})`);
    }
    if (metrics.TTFB && metrics.TTFB > budgets.TTFB) {
      violations.push(`TTFB: ${metrics.TTFB}ms (budget: ${budgets.TTFB}ms)`);
    }

    if (violations.length > 0) {
      console.warn('Performance budget violations:', violations);
      trackEvent('performance_budget_violation', {
        violations: violations.join(', '),
      });
    }
  };

  // Monitor resource loading
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const checkResourceTiming = () => {
      const resources = performance.getEntriesByType('resource') as PerformanceResourceTiming[];

      // Find slow resources
      const slowResources = resources.filter(r => r.duration > 1000);
      if (slowResources.length > 0) {
        console.warn('Slow resources detected:', slowResources.map(r => ({
          name: r.name,
          duration: Math.round(r.duration),
          type: r.initiatorType,
        })));
      }

      // Check total resource size
      const totalSize = resources.reduce((sum, r) => sum + (r.transferSize || 0), 0);
      const totalSizeMB = totalSize / (1024 * 1024);
      if (totalSizeMB > 2) {
        console.warn(`Total resource size: ${totalSizeMB.toFixed(2)}MB (recommended: < 2MB)`);
      }
    };

    // Check after page load
    if (document.readyState === 'complete') {
      checkResourceTiming();
    } else {
      window.addEventListener('load', checkResourceTiming);
      return () => window.removeEventListener('load', checkResourceTiming);
    }
  }, []);

  return null; // This component doesn't render anything
}