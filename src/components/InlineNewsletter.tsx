'use client';

import NewsletterForm from './NewsletterFormEmailJS';

interface InlineNewsletterProps {
  /** Newsletter context */
  variant?: 'main' | 'blog';
  /** Additional CSS classes */
  className?: string;
}

export default function InlineNewsletter({ 
  variant = 'blog',
  className = '' 
}: InlineNewsletterProps) {
  const copy = variant === 'blog' ? {
    emoji: '🔬',
    title: 'Join The Looking Glass',
    subtitle: 'Get our latest research delivered to your inbox',
    cta: 'No spam, just deep insights on Web3, AI, and emerging tech.'
  } : {
    emoji: '🚀',
    title: 'Stay Connected',
    subtitle: 'Get updates from Manic Agency',
    cta: 'Project updates, insights, and collaboration opportunities.'
  };

  return (
    <div className={`
      my-12 p-6 rounded-2xl border-2 border-dashed border-accent-burgundy/30 
      bg-gradient-to-r from-accent-rose/5 to-accent-blue/5
      ${className}
    `}>
      <div className="text-center mb-6">
        <div className="text-2xl mb-2">{copy.emoji}</div>
        <h3 className="font-display text-xl font-semibold text-text-primary mb-2">
          {copy.title}
        </h3>
        <p className="text-text-secondary mb-1">
          {copy.subtitle}
        </p>
        <p className="text-sm text-text-secondary">
          {copy.cta}
        </p>
      </div>
      
      <NewsletterForm 
        variant={variant}
        compact
        inline
        className="max-w-md mx-auto"
      />
    </div>
  );
}
