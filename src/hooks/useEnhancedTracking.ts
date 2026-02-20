'use client';

import { useAnalytics } from '@/components/Analytics';
import { useCallback } from 'react';

interface EnhancedTrackingOptions {
  category?: string;
  action?: string;
  label?: string;
  value?: number;
  userId?: string;
  sessionUpgrade?: string;
  customTags?: Record<string, string | string[]>;
}

/**
 * Enhanced analytics hook with Microsoft Clarity and Google Analytics integration
 * Provides convenient methods for tracking user interactions across the site
 */
export function useEnhancedTracking() {
  const { trackEvent, trackPageView, upgradeSession, setUserTag, trackConversion, canTrack } = useAnalytics();

  // Track blog post interactions
  const trackBlogInteraction = useCallback((
    action: 'view' | 'read_start' | 'read_complete' | 'share' | 'comment',
    postTitle?: string,
    options?: EnhancedTrackingOptions
  ) => {
    if (!canTrack) return;

    trackEvent(`blog_${action}`, {
      category: 'blog',
      post_title: postTitle,
      ...options,
    });

    // Set relevant tags for Clarity
    if (postTitle) {
      setUserTag('last_blog_post', postTitle);
    }
    setUserTag('last_blog_action', action);

    // Upgrade session for important interactions
    if (action === 'read_complete' || action === 'share') {
      upgradeSession(`Blog ${action}: ${postTitle || 'unknown'}`);
    }
  }, [trackEvent, setUserTag, upgradeSession, canTrack]);

  // Track navigation events
  const trackNavigation = useCallback((
    destination: string,
    source?: string,
    options?: EnhancedTrackingOptions
  ) => {
    if (!canTrack) return;

    trackEvent('navigation', {
      category: 'navigation',
      destination,
      source,
      ...options,
    });

    setUserTag('last_navigation', destination);
  }, [trackEvent, setUserTag, canTrack]);

  // Track form interactions
  const trackFormInteraction = useCallback((
    formName: string,
    action: 'start' | 'submit' | 'error' | 'success',
    options?: EnhancedTrackingOptions
  ) => {
    if (!canTrack) return;

    trackEvent(`form_${action}`, {
      category: 'forms',
      form_name: formName,
      ...options,
    });

    setUserTag('last_form_interaction', `${formName}_${action}`);

    // Upgrade session for form completions
    if (action === 'submit' || action === 'success') {
      upgradeSession(`Form ${action}: ${formName}`);
    }
  }, [trackEvent, setUserTag, upgradeSession, canTrack]);

  // Track CTA interactions
  const trackCTA = useCallback((
    ctaName: string,
    location: string,
    options?: EnhancedTrackingOptions
  ) => {
    if (!canTrack) return;

    trackEvent('cta_click', {
      category: 'engagement',
      cta_name: ctaName,
      location,
      ...options,
    });

    setUserTag('last_cta_click', ctaName);
    upgradeSession(`CTA clicked: ${ctaName} at ${location}`);
  }, [trackEvent, setUserTag, upgradeSession, canTrack]);

  // Track search interactions
  const trackSearch = useCallback((
    query: string,
    results_count?: number,
    options?: EnhancedTrackingOptions
  ) => {
    if (!canTrack) return;

    trackEvent('search', {
      category: 'search',
      search_term: query,
      results_count,
      ...options,
    });

    setUserTag('last_search', query);
  }, [trackEvent, setUserTag, canTrack]);

  // Track user engagement milestones
  const trackEngagement = useCallback((
    milestone: 'scroll_50' | 'scroll_75' | 'scroll_100' | 'time_30s' | 'time_60s' | 'time_300s',
    page?: string,
    options?: EnhancedTrackingOptions
  ) => {
    if (!canTrack) return;

    trackEvent('engagement_milestone', {
      category: 'engagement',
      milestone,
      page,
      ...options,
    });

    setUserTag('engagement_level', milestone);

    // Upgrade session for high engagement
    if (milestone === 'scroll_100' || milestone === 'time_300s') {
      upgradeSession(`High engagement: ${milestone} on ${page || 'unknown page'}`);
    }
  }, [trackEvent, setUserTag, upgradeSession, canTrack]);

  // Track downloads
  const trackDownload = useCallback((
    fileName: string,
    fileType: string,
    source?: string,
    options?: EnhancedTrackingOptions
  ) => {
    if (!canTrack) return;

    trackEvent('download', {
      category: 'downloads',
      file_name: fileName,
      file_type: fileType,
      source,
      ...options,
    });

    setUserTag('last_download', fileName);
    upgradeSession(`Download: ${fileName}`);
  }, [trackEvent, setUserTag, upgradeSession, canTrack]);

  // Track external link clicks
  const trackExternalLink = useCallback((
    url: string,
    linkText?: string,
    location?: string,
    options?: EnhancedTrackingOptions
  ) => {
    if (!canTrack) return;

    trackEvent('external_link', {
      category: 'outbound',
      url,
      link_text: linkText,
      location,
      ...options,
    });

    setUserTag('last_external_link', url);
  }, [trackEvent, setUserTag, canTrack]);

  // Track product-specific CTAs with optional Google Ads conversion
  const trackProductCTA = useCallback((
    product: 'hackbase' | 'wunderland' | 'rabbithole' | string,
    action: 'visit_site' | 'signup' | 'pricing_click' | 'github_click',
    conversionLabel?: string,
    options?: EnhancedTrackingOptions
  ) => {
    if (!canTrack) return;

    trackEvent('product_cta', {
      category: 'conversions',
      product,
      action,
      ...options,
    });

    if (conversionLabel) {
      trackConversion(conversionLabel);
    }

    setUserTag('last_product_cta', `${product}_${action}`);
    upgradeSession(`Product CTA: ${product} ${action}`);
  }, [trackEvent, trackConversion, setUserTag, upgradeSession, canTrack]);

  return {
    trackBlogInteraction,
    trackNavigation,
    trackFormInteraction,
    trackCTA,
    trackSearch,
    trackEngagement,
    trackDownload,
    trackExternalLink,
    trackProductCTA,
    trackConversion,
    trackPageView,
    canTrack,
  };
}

export default useEnhancedTracking;
