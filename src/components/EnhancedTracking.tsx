'use client';

import { useEffect, useRef } from 'react';
import { useAnalytics } from '@/components/Analytics';

interface EnhancedTrackingProps {
  /** Track scroll depth for long-form content */
  enableScrollTracking?: boolean;
  /** Track time spent on page */
  enableTimeTracking?: boolean;
  /** Track specific elements (buttons, links, etc.) */
  enableElementTracking?: boolean;
  /** Page type for better segmentation */
  pageType?: 'home' | 'blog' | 'project' | 'about' | 'contact' | 'other';
  /** Content category for blog posts */
  contentCategory?: string;
}

export function EnhancedTracking({
  enableScrollTracking = false,
  enableTimeTracking = false,
  enableElementTracking = false,
  pageType = 'other',
  contentCategory
}: EnhancedTrackingProps) {
  const { trackEvent, setUserTag, upgradeSession, canTrack } = useAnalytics();

  // Refs to avoid re-creating stateful trackers on every render
  const scrollDepthTrackedRef = useRef<Set<number>>(new Set());
  const timeTrackedRef = useRef<Set<number>>(new Set());
  const startTimeRef = useRef<number>(Date.now());
  const rafIdRef = useRef<number | null>(null);
  const intervalIdRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (!canTrack) return;

    // Set page type tag for segmentation
    setUserTag('page_type', pageType);
    if (contentCategory) {
      setUserTag('content_category', contentCategory);
    }

    // Scroll depth tracking (throttled to rAF)
    const computeScrollDepth = () => {
      const maxScrollable = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
      const scrollPercent = Math.round((window.scrollY / maxScrollable) * 100);
      const milestones = [25, 50, 75, 90];
      for (const milestone of milestones) {
        if (scrollPercent >= milestone && !scrollDepthTrackedRef.current.has(milestone)) {
          scrollDepthTrackedRef.current.add(milestone);
          trackEvent('scroll_depth', {
            depth_percent: milestone,
            page_type: pageType,
            content_category: contentCategory || 'unknown'
          });
          if (milestone >= 75) {
            upgradeSession(`deep_scroll_${milestone}%`);
          }
        }
      }
    };

    const handleScroll = () => {
      if (!enableScrollTracking) return;
      if (rafIdRef.current != null) return; // already queued
      rafIdRef.current = requestAnimationFrame(() => {
        rafIdRef.current = null;
        computeScrollDepth();
      });
    };

    // Time on page tracking (15s cadence)
    const trackTimeOnPage = () => {
      if (!enableTimeTracking) return;
      const timeSpent = Math.round((Date.now() - startTimeRef.current) / 1000);
      const milestones = [30, 60, 120, 300]; // 30s, 1m, 2m, 5m
      for (const milestone of milestones) {
        if (timeSpent >= milestone && !timeTrackedRef.current.has(milestone)) {
          timeTrackedRef.current.add(milestone);
          trackEvent('time_on_page', {
            duration_seconds: milestone,
            page_type: pageType,
            content_category: contentCategory || 'unknown'
          });
          if (milestone >= 120) {
            upgradeSession(`long_engagement_${milestone}s`);
          }
        }
      }
    };

    // Element click tracking
    const handleElementClick = (event: MouseEvent) => {
      if (!enableElementTracking) return;
      const target = event.target as HTMLElement;
      if (!target) return;
      const elementType = target.tagName.toLowerCase();
      if (['button', 'a', 'input'].includes(elementType)) {
        const elementId = target.id || 'unnamed';
        const elementText = target.textContent?.slice(0, 50) || 'no_text';
        const elementClass = typeof target.className === 'string' ? target.className : 'no_class';
        trackEvent('element_click', {
          element_type: elementType,
          element_id: elementId,
          element_text: elementText,
          element_class: elementClass,
          page_type: pageType
        });
        if (target.classList.contains('cta-button') || elementId.includes('cta')) {
          upgradeSession('cta_interaction');
        }
      }
    };

    // Attach listeners based on flags (no early returns)
    if (enableScrollTracking) {
      window.addEventListener('scroll', handleScroll, { passive: true });
      // compute initial (useful for short pages)
      computeScrollDepth();
    }
    if (enableTimeTracking) {
      intervalIdRef.current = setInterval(trackTimeOnPage, 15000);
    }
    if (enableElementTracking) {
      document.addEventListener('click', handleElementClick);
    }

    // Cleanup
    return () => {
      if (rafIdRef.current != null) {
        cancelAnimationFrame(rafIdRef.current);
        rafIdRef.current = null;
      }
      if (intervalIdRef.current) {
        clearInterval(intervalIdRef.current);
        intervalIdRef.current = null;
      }
      if (enableScrollTracking) {
        window.removeEventListener('scroll', handleScroll);
      }
      if (enableElementTracking) {
        document.removeEventListener('click', handleElementClick);
      }
    };
  }, [canTrack, enableScrollTracking, enableTimeTracking, enableElementTracking, pageType, contentCategory, trackEvent, setUserTag, upgradeSession]);

  return null; // This component doesn't render anything
}

export default EnhancedTracking;
