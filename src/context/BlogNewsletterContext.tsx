'use client';

import React, { createContext, useContext } from 'react';
import { useBlogNewsletterModal } from '@/hooks/useBlogNewsletterModal';

interface BlogNewsletterContextType {
  markAsSignedUp: () => void;
  showModal: boolean;
  closeModal: () => void;
  neverShowAgain: () => void;
}

const BlogNewsletterContext = createContext<BlogNewsletterContextType | null>(null);

export function useBlogNewsletterContext() {
  const context = useContext(BlogNewsletterContext);
  if (!context) {
    throw new Error('useBlogNewsletterContext must be used within a BlogNewsletterProvider');
  }
  return context;
}

interface BlogNewsletterProviderProps {
  children: React.ReactNode;
}

export function BlogNewsletterProvider({ children }: BlogNewsletterProviderProps) {
  const { showModal, closeModal, neverShowAgain, markAsSignedUp } = useBlogNewsletterModal();

  return (
    <BlogNewsletterContext.Provider value={{
      markAsSignedUp,
      showModal,
      closeModal,
      neverShowAgain
    }}>
      {children}
    </BlogNewsletterContext.Provider>
  );
}
