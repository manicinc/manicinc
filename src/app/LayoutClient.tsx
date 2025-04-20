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

  // --- Theme Management ---
  const applyThemeTransition = useCallback((newTheme: string, currentTheme: string) => {
    const htmlEl = document.documentElement;
    htmlEl.classList.add('theme-transitioning');
    htmlEl.classList.remove(currentTheme);
    htmlEl.classList.add(newTheme);
    htmlEl.style.setProperty('color-scheme', newTheme); // Update color-scheme
    localStorage.setItem('theme', newTheme);

    // ***** ADD THIS GISCUS POSTMESSAGE LOGIC *****
    const giscusFrame = document.querySelector<HTMLIFrameElement>('iframe.giscus-frame');
    if (giscusFrame && giscusFrame.contentWindow) {
      const newIsDarkMode = newTheme === 'dark'; // Check if the new theme is dark
      // Determine the theme string Giscus expects
      const giscusThemeToSet = newIsDarkMode ? 'transparent_dark' : 'light'; // Or use 'dark'/'light'
      const giscusThemeMessage = {
        giscus: {
          setConfig: {
            theme: giscusThemeToSet,
          }
        }
      };
      // Send the message to the Giscus iframe
      giscusFrame.contentWindow.postMessage(giscusThemeMessage, 'https://giscus.app');
      console.log(`LayoutClient: Sent theme '${giscusThemeToSet}' to Giscus`); // Debugging line
    } else {
       console.log("LayoutClient: Giscus iframe not found for theme update."); // Debugging line
    }
    // ***** END GISCUS POSTMESSAGE LOGIC *****

    // Remove transition class after animation
    setTimeout(() => {
      htmlEl.classList.remove('theme-transitioning');
    }, 300); // Match transition duration (adjust if your theme transition is different)
  }, []); // Empty dependency array is fine here

  
  // Listener for SYSTEM preference changes (Keep as is)
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = (e: MediaQueryListEvent) => {
      if (!localStorage.getItem('theme')) { // Only respect system if no manual choice
        const currentTheme = document.documentElement.classList.contains('dark') ? 'dark' : 'light';
        const newTheme = e.matches ? 'dark' : 'light';
        if (newTheme !== currentTheme) {
            applyThemeTransition(newTheme, currentTheme);
            // If using ThemeContext, you might need to update its state here too
        }
      }
    };
    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, [applyThemeTransition]); // Need applyThemeTransition as dependency

  // Expose theme toggle function globally
  useEffect(() => {
    // This FUNCTION is called by the theme toggle buttons
    window.toggleTheme = () => {
      const currentTheme = document.documentElement.classList.contains('dark') ? 'dark' : 'light';
      const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
      // applyThemeTransition now handles class changes, localStorage, AND Giscus update
      applyThemeTransition(newTheme, currentTheme);
      // If using ThemeContext, you might need to update its state here too
    };
    // Cleanup global function
    return () => { delete window.toggleTheme; };
  }, [applyThemeTransition]); // Need applyThemeTransition as dependency

  // This component manages side effects, doesn't render UI itself
  return null;
}