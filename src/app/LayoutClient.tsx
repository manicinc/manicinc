// src/app/LayoutClient.tsx
'use client';

import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { useTheme } from '@/context/ThemeContext';

// Type definition for window augmentation
declare global {
  interface Window {
    toggleTheme?: () => void;
    __NEXT_THEME_INITIAL?: 'dark' | 'light';
  }
}

export default function LayoutClient() {
  const pathname = usePathname();
  const { setTheme } = useTheme();
  const [isBlogArticlePage, setIsBlogArticlePage] = useState(false);
  const [isBlogSection, setIsBlogSection] = useState(false);

  // Determine page type based on pathname
  useEffect(() => {
    const isBlog = pathname?.startsWith('/blog') || false;
    // Matches /blog/some-category/some-slug format
    const isArticle = /^\/blog\/.+\/.+$/.test(pathname || '');

    setIsBlogSection(isBlog);
    setIsBlogArticlePage(isArticle);
  }, [pathname]);

  // Add/Remove body classes based on path and type
  useEffect(() => {
    if (typeof document === 'undefined') return; // SSR check
    
    const body = document.body;

    // --- Path Class ---
    // Remove any existing path-* classes first
    const pathClasses = Array.from(body.classList).filter(cls => cls.startsWith('path-'));
    pathClasses.forEach(cls => body.classList.remove(cls));
    
    // Add new path class (handles '/' -> 'home')
    const pathSlug = pathname === '/' ? 'home' : pathname?.substring(1).replace(/\//g, '-') || 'unknown';
    body.classList.add(`path-${pathSlug}`);

    // --- Blog Section Class ---
    if (isBlogSection) {
      body.classList.add('is-blog');
    } else {
      body.classList.remove('is-blog');
    }

    // --- Blog Article Specific Class ---
    if (isBlogArticlePage) {
      body.classList.add('is-blog-article');
    } else {
      body.classList.remove('is-blog-article');
    }
  }, [pathname, isBlogSection, isBlogArticlePage]);

  // System preference change listener
  useEffect(() => {
    if (typeof window === 'undefined') return; // SSR check
    
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    
    const handleChange = (e: MediaQueryListEvent) => {
      try {
        // Only apply if user hasn't set a preference
        if (!localStorage.getItem('theme')) {
          const newTheme = e.matches ? 'dark' : 'light';
          
          // Use the setTheme function from context
          setTheme(newTheme);
        }
      } catch (err) {
        console.warn('Error handling color scheme change:', err);
      }
    };
    
    // Use the correct event listener based on browser support
    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener('change', handleChange);
      return () => mediaQuery.removeEventListener('change', handleChange);
    } else {
      // Fallback for older browsers
      mediaQuery.addListener(handleChange);
      return () => mediaQuery.removeListener(handleChange);
    }
  }, [setTheme]);

  // Mark theme as loaded after initial render
  useEffect(() => {
    if (typeof document === 'undefined') return; // SSR check
    
    // Set the loaded attribute to show content
    if (!document.documentElement.hasAttribute('data-theme-loaded')) {
      requestAnimationFrame(() => {
        document.documentElement.setAttribute('data-theme-loaded', 'true');
      });
    }
  }, []);

  // This component doesn't render UI
  return null;
}