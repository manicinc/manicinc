'use client';

import { useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';
import { useAnalytics } from '@/components/Analytics';

interface ScrollTrackingProps {
  enabled?: boolean;
  postTitle?: string;
  contentSelector?: string;
}

export function ScrollTracking({ 
  enabled = true, 
  postTitle,
  contentSelector = '#post-content-top'
}: ScrollTrackingProps) {
  const pathname = usePathname();
  const { trackEvent, upgradeSession, canTrack } = useAnalytics();
  const trackedMilestones = useRef(new Set<string>());
  const startTime = useRef<number>(Date.now());

  useEffect(() => {
    if (!enabled || !canTrack) return;

    // Reset tracking for new page
    trackedMilestones.current.clear();
    startTime.current = Date.now();

    let timeTracking30s: NodeJS.Timeout;
    let timeTracking60s: NodeJS.Timeout;
    let timeTracking300s: NodeJS.Timeout;

    // Time-based tracking
    timeTracking30s = setTimeout(() => {
      if (!trackedMilestones.current.has('time_30s')) {
        trackEvent('blog_engagement_time', {
          duration_seconds: 30,
          post_title: postTitle,
          page_path: pathname
        });
        trackedMilestones.current.add('time_30s');
      }
    }, 30000);

    timeTracking60s = setTimeout(() => {
      if (!trackedMilestones.current.has('time_60s')) {
        trackEvent('blog_engagement_time', {
          duration_seconds: 60,
          post_title: postTitle,
          page_path: pathname
        });
        trackedMilestones.current.add('time_60s');
      }
    }, 60000);

    timeTracking300s = setTimeout(() => {
      if (!trackedMilestones.current.has('time_300s')) {
        trackEvent('blog_engagement_time', {
          duration_seconds: 300,
          post_title: postTitle,
          page_path: pathname
        });
        trackedMilestones.current.add('time_300s');
        // Upgrade session for 5+ minute engagement
        upgradeSession('long_read_engagement');
      }
    }, 300000); // 5 minutes

    // Scroll-based tracking
    const handleScroll = () => {
      const contentElement = document.querySelector(contentSelector) as HTMLElement;
      if (!contentElement) return;

      const contentRect = contentElement.getBoundingClientRect();
      const contentHeight = contentElement.offsetHeight;
      const viewportHeight = window.innerHeight;
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      
      // Calculate scroll percentage based on content area
      const contentTop = contentElement.offsetTop;
      const scrollPercentage = Math.min(100, Math.max(0, 
        ((scrollTop + viewportHeight - contentTop) / contentHeight) * 100
      ));

      // Track milestones
      if (scrollPercentage >= 50 && !trackedMilestones.current.has('scroll_50')) {
        trackEvent('blog_scroll_depth', {
          depth_percent: 50,
          post_title: postTitle,
          page_path: pathname,
          scroll_percentage: Math.round(scrollPercentage)
        });
        trackedMilestones.current.add('scroll_50');
      }
      
      if (scrollPercentage >= 75 && !trackedMilestones.current.has('scroll_75')) {
        trackEvent('blog_scroll_depth', {
          depth_percent: 75,
          post_title: postTitle,
          page_path: pathname,
          scroll_percentage: Math.round(scrollPercentage)
        });
        trackedMilestones.current.add('scroll_75');
        // Upgrade session for deep engagement
        upgradeSession('deep_scroll_engagement');
      }
      
      if (scrollPercentage >= 90 && !trackedMilestones.current.has('scroll_100')) {
        trackEvent('blog_scroll_depth', {
          depth_percent: 90,
          post_title: postTitle,
          page_path: pathname,
          scroll_percentage: Math.round(scrollPercentage)
        });
        trackedMilestones.current.add('scroll_100');
        // Upgrade session for complete reading
        upgradeSession('complete_read');
      }
    };

    // Throttled scroll handler
    let scrollTimeout: NodeJS.Timeout;
    const throttledScrollHandler = () => {
      if (scrollTimeout) clearTimeout(scrollTimeout);
      scrollTimeout = setTimeout(handleScroll, 100);
    };

    window.addEventListener('scroll', throttledScrollHandler, { passive: true });

    return () => {
      window.removeEventListener('scroll', throttledScrollHandler);
      clearTimeout(timeTracking30s);
      clearTimeout(timeTracking60s);
      clearTimeout(timeTracking300s);
      if (scrollTimeout) clearTimeout(scrollTimeout);
    };
  }, [enabled, canTrack, pathname, postTitle, trackEvent, upgradeSession, contentSelector]);

  return null; // This component doesn't render anything
}

export default ScrollTracking;
