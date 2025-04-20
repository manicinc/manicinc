// src/app/LayoutClient.tsx
'use client';

import { usePathname } from "next/navigation";
import { useState, useEffect, useCallback } from "react"; // Added useCallback

// Type definition for window augmentation
declare global {
  interface Window {
    toggleTheme?: () => void;
  }
}

export default function LayoutClient() {
  const pathname = usePathname();
  // State to track if we are on a single blog post page (e.g., /blog/category/slug)
  const [isBlogArticlePage, setIsBlogArticlePage] = useState(false);
  // State to track if we are anywhere within the blog section (e.g., /blog/*)
  const [isBlogSection, setIsBlogSection] = useState(false);

  // Determine page type based on pathname
  useEffect(() => {
    const isBlog = pathname.startsWith('/blog');
    // Matches /blog/some-category/some-slug format
    const isArticle = /^\/blog\/.+\/.+$/.test(pathname);

    setIsBlogSection(isBlog);
    setIsBlogArticlePage(isArticle);

  }, [pathname]);

  // Add/Remove body classes based on path and type
  useEffect(() => {
    const body = document.body;

    // --- Path Class ---
    // Remove any existing path-* classes first
    const pathClasses = body.className.split(' ').filter(cls => cls.startsWith('path-'));
    body.classList.remove(...pathClasses);
    // Add new path class (handles '/' -> 'home')
    const pathSlug = pathname === '/' ? 'home' : pathname.substring(1).replace(/\//g, '-');
    body.classList.add(`path-${pathSlug || 'unknown'}`); // Add fallback

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

    // Cleanup function on component unmount or path change
    return () => {
      // Use the slug captured when effect ran for removal
      body.classList.remove(`path-${pathSlug || 'unknown'}`);
      // Clean up other classes just in case of race conditions
      body.classList.remove('is-blog');
      body.classList.remove('is-blog-article');
    };
  }, [pathname, isBlogSection, isBlogArticlePage]); // Dependencies


  // --- Page Transition Class (Basic version) ---
  useEffect(() => {
    const handleStart = () => document.documentElement.classList.add('page-transitioning');
    const handleEnd = () => document.documentElement.classList.remove('page-transitioning');

    // Handle browser navigation/refresh start
    window.addEventListener('beforeunload', handleStart);
    // Handle initial load complete (optional, removes class after first load)
    // Note: This doesn't handle SPA transitions well
    window.addEventListener('load', handleEnd);

    // Basic attempt to hook into Next.js navigation events (may need adjustment based on Next version/setup)
    // This part is less reliable without importing router events directly
    const handleRouteChangeStart = () => handleStart();
    const handleRouteChangeComplete = () => handleEnd();

    // Try attaching to history changes as a proxy for SPA nav (imperfect)
    // window.addEventListener('popstate', handleRouteChangeComplete);
    // Emitting custom events from Link components might be more robust

    // Cleanup listeners
    return () => {
      window.removeEventListener('beforeunload', handleStart);
      window.removeEventListener('load', handleEnd);
      // window.removeEventListener('popstate', handleRouteChangeComplete);
      handleEnd(); // Ensure class is removed on unmount
    };
  }, []);


  // --- Theme Management (Handles CHANGES after initial load) ---
  const applyThemeTransition = useCallback((newTheme: string, currentTheme: string) => {
    const htmlEl = document.documentElement;
    htmlEl.classList.add('theme-transitioning');
    htmlEl.classList.remove(currentTheme);
    htmlEl.classList.add(newTheme);
    // Also update the color-scheme property if the inline script did
    htmlEl.style.setProperty('color-scheme', newTheme);
    localStorage.setItem('theme', newTheme);
    // Remove transition class after animation
    setTimeout(() => {
      htmlEl.classList.remove('theme-transitioning');
    }, 300); // Match transition duration in theme.css
  }, []);

  // Listener for SYSTEM preference changes
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = (e: MediaQueryListEvent) => {
      // Only switch if user HASN'T set a preference in localStorage
      if (!localStorage.getItem('theme')) {
        const currentTheme = document.documentElement.classList.contains('dark') ? 'dark' : 'light';
        const newTheme = e.matches ? 'dark' : 'light';
        if (newTheme !== currentTheme) {
            applyThemeTransition(newTheme, currentTheme);
        }
      }
    };
    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, [applyThemeTransition]);

  // Expose theme toggle function globally for buttons etc.
  useEffect(() => {
    window.toggleTheme = () => {
      const currentTheme = document.documentElement.classList.contains('dark') ? 'dark' : 'light';
      const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
      applyThemeTransition(newTheme, currentTheme);
    };
    // Cleanup global function
    return () => { delete window.toggleTheme; };
  }, [applyThemeTransition]);

  // This component manages side effects, doesn't render UI itself
  return null;
}