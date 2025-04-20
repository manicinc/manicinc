// src/components/DynamicFavicon.tsx
'use client';

import { usePathname } from 'next/navigation';
import { useEffect, useCallback } from 'react';

// Define color constants for clarity
const DARK_MODE_COLOR = '#22182B';
const LIGHT_MODE_COLOR_MAIN = '#FBF6EF';
const LIGHT_MODE_COLOR_BLOG = '#FBF6EF'; // Currently same as main, adjust if needed
const TILE_COLOR_MAIN = LIGHT_MODE_COLOR_MAIN; // Or specific color if different
const TILE_COLOR_BLOG = DARK_MODE_COLOR;       // Or specific color if different

export default function DynamicFavicon() {
  const pathname = usePathname();

  // Helper function to update or create a <meta> tag
  const updateMetaTag = useCallback((name: string, content: string) => {
    let meta = document.querySelector(`meta[name="${name}"]`) as HTMLMetaElement | null;
    if (!meta) {
      meta = document.createElement('meta');
      meta.name = name;
      document.head.appendChild(meta);
    }
    meta.content = content;
  }, []);

  // Helper function to update or create a <link> tag (for favicons, manifest, etc.)
  const updateLinkTag = useCallback((rel: string, href: string, attributes?: Record<string, string>) => {
    let selector = `link[rel="${rel}"]`;
    // Add other attributes to selector for specificity if provided
    if (attributes) {
        for (const key in attributes) {
            // Ensure attribute value is not null/undefined before adding to selector
            if (attributes[key] !== null && attributes[key] !== undefined) {
                selector += `[${key}="${attributes[key]}"]`;
            }
        }
    }

    let link = document.querySelector(selector) as HTMLLinkElement | null;
    if (!link) {
      link = document.createElement('link');
      link.rel = rel;
      document.head.appendChild(link);
    }
    link.href = href;
    // Apply/update other attributes
    if (attributes) {
        for (const key in attributes) {
            if (attributes[key] !== null && attributes[key] !== undefined) {
                link.setAttribute(key, attributes[key]);
            } else {
                 // If attribute value is null/undefined, remove the attribute
                 link.removeAttribute(key);
            }
        }
    }
  }, []);


  // Theme color updater using the meta tag helper
  const updateThemeColor = useCallback((color: string) => {
    updateMetaTag('theme-color', color);
  }, [updateMetaTag]);

  useEffect(() => {
    const isBlogSection = pathname.startsWith('/blog');
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const prefersDarkMode = mediaQuery.matches;

    // Determine base path and colors based on section and theme preference
    const basePath = isBlogSection ? '/blog' : '';
    const lightModeColor = isBlogSection ? LIGHT_MODE_COLOR_BLOG : LIGHT_MODE_COLOR_MAIN;
    const currentThemeColor = prefersDarkMode ? DARK_MODE_COLOR : lightModeColor;
    const currentTileColor = isBlogSection ? TILE_COLOR_BLOG : TILE_COLOR_MAIN;

    // --- Update Favicons ---
    updateLinkTag('icon', `${basePath}/favicon.ico`);
    updateLinkTag('icon', `${basePath}/favicon-16x16.png`, { sizes: '16x16', type: 'image/png' });
    updateLinkTag('icon', `${basePath}/favicon-32x32.png`, { sizes: '32x32', type: 'image/png' });
    updateLinkTag('apple-touch-icon', `${basePath}/apple-touch-icon.png`, { sizes: '180x180' });
    updateLinkTag('icon', `${basePath}/android-chrome-192x192.png`, { sizes: '192x192', type: 'image/png' });
    updateLinkTag('icon', `${basePath}/android-chrome-512x512.png`, { sizes: '512x512', type: 'image/png' });
    updateLinkTag('mask-icon', `${basePath}/safari-pinned-tab.svg`, { color: currentThemeColor }); // Often needs a color attribute
    updateLinkTag('shortcut icon', `${basePath}/favicon.ico`); // Kept for legacy compatibility

    // --- Update Manifest ---
    updateLinkTag('manifest', `${basePath}/site.webmanifest`);

    // --- Update Theme Color ---
    updateThemeColor(currentThemeColor);

    // --- Update MS Tile ---
    updateMetaTag('msapplication-TileColor', currentTileColor);
    updateMetaTag('msapplication-config', `${basePath}/browserconfig.xml`);

    // --- Set up Listener for Theme Changes ---
    const handleColorSchemeChange = (e: MediaQueryListEvent) => {
        const isNowDark = e.matches;
        // Recalculate light mode color based on current section *within the handler*
        // This ensures the correct light color is used if the user navigates *then* changes theme
        const currentPath = window.location.pathname; // Use current location, not potentially stale `pathname` from effect closure
        const currentlyInBlog = currentPath.startsWith('/blog');
        const newLightColor = currentlyInBlog ? LIGHT_MODE_COLOR_BLOG : LIGHT_MODE_COLOR_MAIN;
        const newThemeColor = isNowDark ? DARK_MODE_COLOR : newLightColor;
        updateThemeColor(newThemeColor);

        // Optionally update mask-icon color if it should change with theme
        // const maskIconBasePath = currentlyInBlog ? '/blog' : '';
        // updateLinkTag('mask-icon', `${maskIconBasePath}/safari-pinned-tab.svg`, { color: newThemeColor });
    };

    // Use `addEventListener` for modern browsers, consider fallback for older ones if needed
    mediaQuery.addEventListener('change', handleColorSchemeChange);

    // Cleanup listener on component unmount
    return () => {
      mediaQuery.removeEventListener('change', handleColorSchemeChange);
    };
    // Dependencies: pathname changes section, update helpers might change (though unlikely)
  }, [pathname, updateThemeColor, updateMetaTag, updateLinkTag]);

  // This component manages head tags and doesn't render anything itself
  return null;
}