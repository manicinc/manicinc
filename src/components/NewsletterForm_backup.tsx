// src/components/NewsletterForm.tsx
'use client';

import SenderNewsletterForm from './SenderNewsletterForm';

interface NewsletterFormProps {
  variant?: 'main' | 'blog';
  className?: string;
  compact?: boolean;
  inline?: boolean;
  onSignupSuccess?: () => void;
}

export default function NewsletterForm({ 
  variant = 'main', 
  className = '',
  compact = false,
  inline = false,
  onSignupSuccess
}: NewsletterFormProps) {
  // Simply render the new Sender.net newsletter form
  return (
    <SenderNewsletterForm
      variant={variant}
      className={className}
      compact={compact}
      inline={inline}
      onSignupSuccess={onSignupSuccess}
    />
  );
}
