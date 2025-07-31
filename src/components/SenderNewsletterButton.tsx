// src/components/SenderNewsletterButton.tsx
'use client';

import { motion } from 'framer-motion';
import { useAnalytics } from './Analytics';

interface SenderNewsletterButtonProps {
  className?: string;
  formId?: string;
  variant?: 'main' | 'blog';
}

export default function SenderNewsletterButton({ 
  className = "",
  formId = "",
  variant = 'main'
}: SenderNewsletterButtonProps) {
  const { trackEvent, canTrack } = useAnalytics();
  
  const handleClick = () => {
    if (canTrack) {
      trackEvent('newsletter_button_click', { variant, formId });
    }
  };

  return (
    <div className={`text-center ${className}`}>
      <h3 className="text-lg font-semibold text-text-primary mb-3">
        Subscribe to Our Newsletter
      </h3>
      <p className="text-sm text-text-secondary mb-6 max-w-md mx-auto">
        Join our digital collective for exclusive insights on AI, metaverse architecture, 
        and cutting-edge technology trends.
      </p>
      
      <motion.a 
        href={`https://stats.sender.net/forms/${formId}/view`}
        target="_blank"
        rel="noopener noreferrer"
        onClick={handleClick}
        className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-accent-burgundy to-accent-sage text-white rounded-xl hover:opacity-90 transition-all font-medium shadow-lg hover:shadow-xl transform hover:scale-105"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <span>Subscribe Now</span>
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M7 17L17 7M17 7H7M17 7V17" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </motion.a>
      
      <div className="mt-6 flex items-center justify-center gap-6 text-xs text-text-secondary">
        <div className="flex items-center gap-1">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M12 11V17M8 14L12 18L16 14M20 6H4L12 13L20 6Z" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          <span>Weekly insights</span>
        </div>
        <div className="flex items-center gap-1">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M9 11L12 14L22 4M21 12V19C21 20 20 21 19 21H5C4 21 3 20 3 19V5C3 4 4 3 5 3H16" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          <span>No spam</span>
        </div>
        <div className="flex items-center gap-1">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M12 2L4 7V11C4 16 7 20 12 21C17 20 20 16 20 11V7L12 2Z" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          <span>Privacy first</span>
        </div>
      </div>
    </div>
  );
}