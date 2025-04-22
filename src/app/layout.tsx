// src/app/layout.tsx
import { ReactNode } from "react";
import Script from 'next/script';
import { Inter, Lato, EB_Garamond, Playfair_Display, Merriweather, Dancing_Script } from 'next/font/google';

// Import Components & Providers
import { Nav } from "@/components/Nav";
import Footer from "@/components/Footer/Footer";
import LayoutClient from "./LayoutClient"; // Renders client-side logic (path classes)
import { ThemeProvider } from '@/context/ThemeContext'; // Provides theme state
import DynamicFavicon from '@/components/Base/DynamicFavicon';
import ScrollToTopHandler from '@/components/ScrollBtns/ScrollToTopHandler';
import type { Metadata, Viewport } from 'next';

// Import Styles
import "./styles/globals.css"; // Includes theme.css via @import or direct rules

// Import SEO helper
import { generateSEOMetadata } from '@/lib/getSEOMetadata';

// --- Font Definitions ---
// (Keep your existing font definitions)
const inter = Inter({ subsets: ['latin'], variable: '--font-body', display: 'swap' });
const lato = Lato({ subsets: ['latin'], weight: ['400', '700'], variable: '--font-display-orig', display: 'swap' });
const ebGaramond = EB_Garamond({ subsets: ['latin'], weight: ['400', '700'], style: ['normal', 'italic'], variable: '--font-meta-blog', display: 'swap' });
const playfairDisplay = Playfair_Display({ subsets: ['latin'], weight: ['700'], variable: '--font-heading-blog', display: 'swap' });
const merriweather = Merriweather({ subsets: ['latin'], weight: ['400'], style: ['normal', 'italic'], variable: '--font-body-blog', display: 'swap' });
const dancingScript = Dancing_Script({ subsets: ['latin'], weight: ['400'], variable: '--font-script-blog', display: 'swap' });

export const viewport: Viewport = {
    themeColor: [
      { media: '(prefers-color-scheme: light)', color: '#FBF6EF' }, // Use your light theme background
      { media: '(prefers-color-scheme: dark)', color: '#22182B' },  // Use your dark theme background
    ],
    initialScale: 1,
    maximumScale: 1,
    userScalable: false,
  };

// Generate default metadata for the root layout
export const metadata: Metadata = generateSEOMetadata('/');

// --- Theme Initialization Script (Inline in <head>) ---
// This script runs BEFORE React hydrates. It's crucial for:
// 1. Reading the persisted theme from localStorage or system preference.
// 2. Applying the theme class (dark/light) to the <html> element immediately.
// 3. Preventing the "flash of wrong theme" (FOUC).
// Includes console logs for debugging persistence issues.
const InitializeThemeScript = `(function(){ 
    function getInitialTheme() { 
      try { 
        // First priority: Check localStorage
        const storedTheme = localStorage.getItem('theme'); 
        if (storedTheme === 'light' || storedTheme === 'dark') {
          return storedTheme;
        }
      } catch(e){
        console.warn('Failed to access localStorage:', e);
      } 
      
      // Second priority: Check system preference
      if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
        return 'dark';
      }
      
      // Default fallback
      return 'light'; 
    } 
    
    // Get and apply the theme
    const theme = getInitialTheme(); 
    document.documentElement.classList.remove('dark', 'light');
    document.documentElement.classList.add(theme); 
    document.documentElement.style.setProperty('color-scheme', theme);
    
    // Ensure the theme is stored in localStorage
    try {
      localStorage.setItem('theme', theme);
    } catch(e) {
      console.warn('Failed to store theme in localStorage:', e);
    }
    
    // Wait for styles to load, then mark as loaded to reveal content
    window.addEventListener('load', function() {
      requestAnimationFrame(function() {
        document.documentElement.setAttribute('data-theme-loaded', 'true');
      });
    });
  })();`;

// --- Critical CSS (Inline in <head>) ---
// Works with InitializeThemeScript to prevent flash of unstyled content (FOUC)
// and flash of the wrong theme background.
const CriticalCSS = `
  /* Pre-set background colors matching theme.css */
  html.dark { background-color: #22182b; }
  html.light { background-color: #fbf6ef; }
  /* Hide body content until theme is marked as loaded */
  html:not([data-theme-loaded="true"]) body { opacity: 0; }
  /* Prevent transitions during initial load */
  html:not([data-theme-loaded="true"]) * { transition: none !important; }
  /* Ensure hero content is centered (keep if necessary) */
  .hero-content { text-align: center !important; }
`;

export default function RootLayout({ children }: { children: ReactNode }) {
    return (
        // Apply font variables to HTML tag
        <html lang="en" className={`
                ${inter.variable}
                ${lato.variable}
                ${ebGaramond.variable}
                ${playfairDisplay.variable}
                ${merriweather.variable}
                ${dancingScript.variable}
            `} suppressHydrationWarning /* Suppress warning about class/style mismatch due to inline script */ >
            <head>
                {/* Inline Theme Script: MUST be high in <head> to run ASAP */}
                <script dangerouslySetInnerHTML={{ __html: InitializeThemeScript }} />

                {/* Inline Critical CSS: Prevents FOUC and theme flash */}
                <style dangerouslySetInnerHTML={{ __html: CriticalCSS }} />

                {/* Other head elements: favicons, meta tags generated by Next.js */}
            </head>
            <body>
                {/* Wrap the application with ThemeProvider */}
                <ThemeProvider>
                    {/* Add DynamicFavicon if needed */}
                    <DynamicFavicon />

                    {/* Main application structure */}
                    <Nav />
                    <main role="main">{children}</main>
                    <Footer />

                    {/* Utility components */}
                    <ScrollToTopHandler />
                    {/* LayoutClient handles client-side body class management */}
                    <LayoutClient />
                </ThemeProvider>
            </body>
        </html>
    );
}