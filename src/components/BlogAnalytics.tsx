'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { useAnalytics } from '@/components/Analytics';

interface BlogAnalyticsProps {
  postTitle?: string;
  postCategory?: string;
  postAuthor?: string;
  postTags?: string[];
  postType?: 'list' | 'post' | 'category';
}

export function BlogAnalytics({ 
  postTitle, 
  postCategory, 
  postAuthor, 
  postTags, 
  postType = 'post' 
}: BlogAnalyticsProps) {
  const pathname = usePathname();
  const { trackPageView, setUserTag, canTrack } = useAnalytics();

  useEffect(() => {
    if (!canTrack) return;

    // Track page view with custom page ID for better Clarity tracking
    const pageId = postTitle ? `blog-${postType}-${postTitle.toLowerCase().replace(/\s+/g, '-')}` : pathname;
    trackPageView(pathname, pageId);

    // Set user tags for better segmentation in Clarity
    if (postCategory) {
      setUserTag('blog_category', postCategory);
    }
    
    if (postAuthor) {
      setUserTag('blog_author', postAuthor);
    }
    
    if (postTags && postTags.length > 0) {
      setUserTag('blog_tags', postTags);
    }

    setUserTag('content_type', 'blog');
    setUserTag('page_type', postType);

  }, [pathname, postTitle, postCategory, postAuthor, postTags, postType, trackPageView, setUserTag, canTrack]);

  return null; // This component doesn't render anything
}

export default BlogAnalytics;
