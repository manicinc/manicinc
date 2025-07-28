'use client';

import { useEffect } from 'react';
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

  useEffect(() => {
    if (!canTrack) return;

    // Set page type tag for segmentation
    setUserTag('page_type', pageType);
    if (contentCategory) {
      setUserTag('content_category', contentCategory);
    }

    let scrollDepthTracked: Set<number> = new Set();
    let timeTracked: Set<number> = new Set();
    let startTime = Date.now();

    // Scroll depth tracking
    const handleScroll = () => {
      if (!enableScrollTracking) return;
      
      const scrollPercent = Math.round(
        (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100
      );

      // Track at 25%, 50%, 75%, 90% scroll depths
      const milestones = [25, 50, 75, 90];
      for (const milestone of milestones) {
        if (scrollPercent >= milestone && !scrollDepthTracked.has(milestone)) {
          scrollDepthTracked.add(milestone);
          trackEvent('scroll_depth', {
            depth_percent: milestone,
            page_type: pageType,
            content_category: contentCategory || 'unknown'
          });
          
          // Upgrade session for deep engagement
          if (milestone >= 75) {
            upgradeSession(`deep_scroll_${milestone}%`);
          }
        }
      }
    };

    // Time on page tracking
    const trackTimeOnPage = () => {
      if (!enableTimeTracking) return;
      
      const timeSpent = Math.round((Date.now() - startTime) / 1000);
      const milestones = [30, 60, 120, 300]; // 30s, 1m, 2m, 5m

      for (const milestone of milestones) {
        if (timeSpent >= milestone && !timeTracked.has(milestone)) {
          timeTracked.add(milestone);
          trackEvent('time_on_page', {
            duration_seconds: milestone,
            page_type: pageType,
            content_category: contentCategory || 'unknown'
          });

          // Upgrade session for long engagement
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
      const elementType = target.tagName.toLowerCase();
      
      // Track specific element types
      if (['button', 'a', 'input'].includes(elementType)) {
        const elementId = target.id || 'unnamed';
        const elementText = target.textContent?.slice(0, 50) || 'no_text';
        const elementClass = target.className || 'no_class';

        trackEvent('element_click', {
          element_type: elementType,
          element_id: elementId,
          element_text: elementText,
          element_class: elementClass,
          page_type: pageType
        });

        // Special tracking for important actions
        if (target.classList.contains('cta-button') || target.id.includes('cta')) {
          upgradeSession('cta_interaction');
        }
      }
    };

    // Add event listeners
    if (enableScrollTracking) {
      window.addEventListener('scroll', handleScroll, { passive: true });
    }

    if (enableTimeTracking) {
      const timeInterval = setInterval(trackTimeOnPage, 15000); // Check every 15s
      
      // Cleanup interval
      return () => {
        clearInterval(timeInterval);
        if (enableScrollTracking) {
          window.removeEventListener('scroll', handleScroll);
        }
        if (enableElementTracking) {
          document.removeEventListener('click', handleElementClick);
        }
      };
    }

    if (enableElementTracking) {
      document.addEventListener('click', handleElementClick);
    }

    // Cleanup function
    return () => {
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
