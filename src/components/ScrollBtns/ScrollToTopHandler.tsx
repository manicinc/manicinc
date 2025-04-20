// src/components/ScrollToTopHandler.tsx
"use client";

import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import ScrollToTop from './ScrollToTop';

export default function ScrollToTopHandler() {
  const [showBackToTop, setShowBackToTop] = useState(false);
  const pathname = usePathname();
  
  // Check if the current page is a blog page
  const isBlogPage = pathname?.startsWith('/blog') && !pathname?.endsWith("/blog");
  
  // Only show ScrollToTop on non-blog pages
  const shouldShowButton = !isBlogPage;
  
  useEffect(() => {
    // Function to handle scroll event
    const handleScroll = () => {
      // Show button when user scrolls down 300px from the top
      const scrollPosition = window.scrollY;
      setShowBackToTop(scrollPosition > 300);
    };
    
    // Add scroll event listener
    window.addEventListener('scroll', handleScroll);
    
    // Initial check
    handleScroll();
    
    // Clean up event listener
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);
  
  // Function to scroll back to top
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };
  
  // Only render the component if we're not on a blog page
  if (!shouldShowButton) return null;
  
  return (
    <ScrollToTop
      type="other"
      showBackToTop={showBackToTop}
      scrollToTop={scrollToTop}
    />
  );
}