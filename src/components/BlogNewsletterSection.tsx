'use client';

import { useBlogNewsletterContext } from '@/context/BlogNewsletterContext';
import NewsletterSection from './NewsletterSection';

interface BlogNewsletterSectionProps {
  variant?: 'main' | 'blog';
  className?: string;
  background?: 'default' | 'dark' | 'accent';
}

export default function BlogNewsletterSection({ 
  variant = 'blog',
  className = '',
  background = 'default'
}: BlogNewsletterSectionProps) {
  const { markAsSignedUp } = useBlogNewsletterContext();

  return (
    <NewsletterSection
      variant={variant}
      className={className}
      background={background}
      onSignupSuccess={markAsSignedUp}
    />
  );
}
