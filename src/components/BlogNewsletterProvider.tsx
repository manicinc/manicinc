'use client';

import { BlogNewsletterProvider } from '@/context/BlogNewsletterContext';
import BlogNewsletterModal from './BlogNewsletterModal';
import { useBlogNewsletterModal } from '@/hooks/useBlogNewsletterModal';

function BlogNewsletterModalWrapper() {
  const { showModal, closeModal, neverShowAgain } = useBlogNewsletterModal();

  if (!showModal) return null;

  return (
    <BlogNewsletterModal
      onClose={closeModal}
      onNeverShow={neverShowAgain}
    />
  );
}

interface BlogNewsletterWrapperProps {
  children: React.ReactNode;
}

export default function BlogNewsletterWrapper({ children }: BlogNewsletterWrapperProps) {
  return (
    <BlogNewsletterProvider>
      {children}
      <BlogNewsletterModalWrapper />
    </BlogNewsletterProvider>
  );
}
