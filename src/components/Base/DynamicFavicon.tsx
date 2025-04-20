// src/components/DynamicFavicon.tsx
'use client';

import { usePathname } from 'next/navigation';
import { useEffect, useCallback } from 'react';
import { getSectionConfig } from '@/lib/getSEOMetadata';

export default function DynamicFavicon() {
  const pathname = usePathname();
  
  // Helper to update favicon links
  const updateFavicon = useCallback((rel: string, href: string) => {
    let link = document.querySelector(`link[rel="${rel}"]`) as HTMLLinkElement;
    if (!link) {
      link = document.createElement('link');
      link.rel = rel;
      document.head.appendChild(link);
    }
    link.href = href;
  }, []);
  
  // Helper to update theme color
  const updateThemeColor = useCallback((color: string) => {
    let meta = document.querySelector('meta[name="theme-color"]') as HTMLMetaElement;
    if (!meta) {
      meta = document.createElement('meta');
      meta.name = 'theme-color';
      document.head.appendChild(meta);
    }
    meta.content = color;
  }, []);
  
  useEffect(() => {
    const section = pathname.startsWith('/blog') ? 'blog' : 
                    pathname.startsWith('/projects') ? 'projects' : 'default';
    
    // Get the config for the current section
    const config = getSectionConfig(pathname);
    
    // Set the favicon prefix based on the section
    const prefix = section === 'blog' ? '/blog/' : '/';
    
    // Update favicons
    updateFavicon('icon', `${prefix}favicon.ico`);
    updateFavicon('shortcut icon', `${prefix}favicon-16x16.png`);
    updateFavicon('apple-touch-icon', `${prefix}apple-touch-icon.png`);
    
    // Detect user's color scheme
    const prefersDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    // Update theme color based on section and color scheme
    const themeColor = prefersDarkMode ? config.themeColor.dark : config.themeColor.light;
    updateThemeColor(themeColor);
    
    // Listen for changes in color scheme
    const colorSchemeMedia = window.matchMedia('(prefers-color-scheme: dark)');
    const handleColorSchemeChange = (e: MediaQueryListEvent) => {
      const newThemeColor = e.matches ? config.themeColor.dark : config.themeColor.light;
      updateThemeColor(newThemeColor);
    };
    
    colorSchemeMedia.addEventListener('change', handleColorSchemeChange);
    
    return () => {
      colorSchemeMedia.removeEventListener('change', handleColorSchemeChange);
    };
  }, [pathname, updateFavicon, updateThemeColor]);

  // This component doesn't render anything visible
  return null;
}