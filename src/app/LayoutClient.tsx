// src/app/LayoutClient.tsx
'use client';

import { usePathname } from "next/navigation";
import { useState, useEffect, useCallback } from "react";
import { useTheme } from '@/context/ThemeContext';

// Type definition for window augmentation
declare global {
  interface Window {
    toggleTheme?: () => void;
  }
}

export default function LayoutClient() {
  const pathname = usePathname();
  const { setTheme } = useTheme(); // Use the theme context
  
  // State to track if we are on a single blog post page (e.g., /blog/category/slug)
  const [isBlogArticlePage, setIsBlogArticlePage] = useState(false);
  // State to track if we are anywhere within the blog section (e.g., /blog/*)
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

    // No cleanup needed - future effects will handle removing classes
  }, [pathname, isBlogSection, isBlogArticlePage]);

  // --- Theme Management ---
  // SIMPLIFIED theme transition function
  const applyThemeTransition = useCallback((newTheme: string, currentTheme: string) => {
    if (newTheme === currentTheme) return; // No change needed
    
    const htmlEl = document.documentElement;
    
    // Add transition class
    htmlEl.classList.add('theme-transitioning');
    
    // Apply theme changes
    htmlEl.classList.remove(currentTheme);
    htmlEl.classList.add(newTheme);
    htmlEl.style.setProperty('color-scheme', newTheme);
    
    // Store preference - CRITICAL for persistence
    try {
      localStorage.setItem('theme', newTheme);
    } catch (e) {
      console.warn('Could not save theme preference');
    }

    // Update Giscus theme if present
    const giscusFrame = document.querySelector<HTMLIFrameElement>('iframe.giscus-frame');
    if (giscusFrame && giscusFrame.contentWindow) {
      try {
        const giscusThemeToSet = newTheme === 'dark' ? 'transparent_dark' : 'light';
        giscusFrame.contentWindow.postMessage(
          { giscus: { setConfig: { theme: giscusThemeToSet } } },
          'https://giscus.app'
        );
      } catch (e) {
        console.warn('Error updating Giscus theme');
      }
    }

    // Remove transition class after animation completes
    setTimeout(() => {
      htmlEl.classList.remove('theme-transitioning');
    }, 300); // Match transition duration in CSS
    
    // Update React context (important!)
    setTheme(newTheme as 'light' | 'dark');
  }, [setTheme]);

  // System preference change listener
  useEffect(() => {
    if (typeof window === 'undefined') return; // SSR check
    
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    
    const handleChange = (e: MediaQueryListEvent) => {
      try {
        // Only apply if user hasn't set a preference
        if (!localStorage.getItem('theme')) {
          const currentTheme = document.documentElement.classList.contains('dark') ? 'dark' : 'light';
          const newTheme = e.matches ? 'dark' : 'light';
          applyThemeTransition(newTheme, currentTheme);
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
  }, [applyThemeTransition]);

  // Expose global theme toggle
  useEffect(() => {
    if (typeof window === 'undefined') return; // SSR check
    
    // Global toggle function
    window.toggleTheme = () => {
      const currentTheme = document.documentElement.classList.contains('dark') ? 'dark' : 'light';
      const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
      applyThemeTransition(newTheme, currentTheme);
    };
    
    // Cleanup
    return () => { delete window.toggleTheme; };
  }, [applyThemeTransition]);

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