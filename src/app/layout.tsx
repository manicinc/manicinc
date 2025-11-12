// src/app/layout.tsx (with Google Analytics)
import { ReactNode } from "react";
import { Inter, Lato, Playfair_Display, IBM_Plex_Mono } from 'next/font/google';

// Import Components & Providers
import { Nav } from "@/components/Nav";
import Footer from "@/components/Footer/Footer";
import LayoutClient from "./LayoutClient"; 
import { ThemeProvider } from '@/context/ThemeContext';
import { CookieProvider } from '@/context/CookieProvider';
import DynamicFavicon from '@/components/Base/DynamicFavicon';
import Analytics from '@/components/Analytics';
import ScrollToTopHandler from '@/components/ScrollBtns/ScrollToTopHandler';
import TrailingSlashHandler from '@/components/TrailingSlashHandler';
import { SenderScript } from '@/components/SenderScript';
import DOMErrorBoundary from '@/components/DOMErrorBoundary';
import GlobalDOMErrorHandler from '@/components/GlobalDOMErrorHandler';
import ErrorFallback from '@/components/ErrorFallback';
import type { Metadata, Viewport } from 'next';
import OrganizationSchema from '@/components/SEO/OrganizationSchema';
import WebSiteSchema from '@/components/SEO/WebSiteSchema';
import LocalBusinessSchema from '@/components/SEO/LocalBusinessSchema';
import PrefetchLinks from '@/components/PrefetchLinks';
import ServiceWorkerRegistration from '@/components/ServiceWorkerRegistration';
import SkipToContent from '@/components/SkipToContent';
import GlobalEventTracking from '@/components/GlobalEventTracking';
import DeferredStyles from '@/components/DeferredStyles';

// Import Styles
import "./styles/globals.css";
// blog-newsletter.css deferred via DeferredStyles component

// Preload critical above-fold images
// Removed critical images preload - og-default.webp is not above-fold
// Only preload actual above-fold hero images

// Import SEO helper
import { generateSEOMetadata } from '@/lib/getSEOMetadata';

const GA_ID = process.env.NEXT_PUBLIC_GA_ID; // Read GA ID from env

// --- Font Definitions ---
const inter = Inter({ 
  subsets: ['latin'], 
  variable: '--font-body', 
  display: 'swap',
  fallback: ['system-ui', 'arial'] 
});
const lato = Lato({ 
  subsets: ['latin'], 
  weight: ['400', '700'], 
  variable: '--font-display-orig', 
  display: 'swap',
  fallback: ['system-ui', 'arial']
});
const playfairDisplay = Playfair_Display({ 
  subsets: ['latin'], 
  weight: ['700'], 
  variable: '--font-heading-blog', 
  display: 'swap',
  fallback: ['Georgia', 'Times New Roman', 'serif'],
  preload: true
});
const ibmPlexMono = IBM_Plex_Mono({ 
  subsets: ['latin'], 
  weight: ['400', '600'], 
  variable: '--font-mono', 
  display: 'swap',
  fallback: ['Consolas', 'Monaco', 'monospace'],
  preload: true
});

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#FBF6EF' },
    { media: '(prefers-color-scheme: dark)', color: '#22182B' },
  ],
  initialScale: 1,
  maximumScale: 5, // Allow zooming up to 5x for accessibility
  userScalable: true, // Allow user to zoom for accessibility
  width: 'device-width',
};

// Generate default metadata for the root layout
export const metadata: Metadata = generateSEOMetadata('/');

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className={`
            ${inter.variable}
            ${lato.variable}
            ${playfairDisplay.variable}
            ${ibmPlexMono.variable}
        `} suppressHydrationWarning>
      <head>
        {/* Preconnect to critical domains for faster loading */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        {process.env.NEXT_PUBLIC_GA_ID && (
          <link rel="preconnect" href="https://www.googletagmanager.com" />
        )}
        <link rel="preconnect" href="https://eocampaign1.com" />
        <link rel="preconnect" href="https://images.weserv.nl" />
        <link rel="preconnect" href="https://static.cloudflareinsights.com" />
        
        {/* Image preloading moved to individual pages for better performance */}
        
        {/* DNS prefetch for external domains */}
        <link rel="dns-prefetch" href="https://cdn.sender.net" />
        <link rel="dns-prefetch" href="https://api.github.com" />
        <link rel="dns-prefetch" href="https://www.clarity.ms" />
        <link rel="dns-prefetch" href="https://cdn.jsdelivr.net" />
        <link rel="dns-prefetch" href="https://res.cloudinary.com" />
        
        {/* Critical CSS for fast initial paint */}
        <style dangerouslySetInnerHTML={{ __html: `
          /* Critical CSS - Inline in <head> for fast initial paint */
          *,*::before,*::after{box-sizing:border-box;margin:0;padding:0}:root{--bg-primary:#fbf6ef;--bg-primary-rgb:251,246,239;--text-primary:#4a3f35;--text-primary-rgb:74,63,53;--accent-primary:#d6a574;--accent-highlight:#7de8c9;--header-height:72px;--container-max:1200px;--content-max:900px;--font-body:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;--font-heading:var(--font-body);--transition-fast:150ms ease;--transition-base:250ms ease}html.dark{--bg-primary:#22182b;--bg-primary-rgb:34,24,43;--text-primary:#f5f0e6;--text-primary-rgb:245,240,230;--accent-primary:#e4b584;--accent-highlight:#7de8c9}html:not([data-theme-loaded="true"]) body{opacity:0}html{background-color:var(--bg-primary);color:var(--text-primary);font-family:var(--font-body);line-height:1.6;-webkit-font-smoothing:antialiased;-moz-osx-font-smoothing:grayscale}body{margin:0;min-height:100vh;transition:opacity 300ms ease}nav{position:sticky;top:0;z-index:100;background:rgba(var(--bg-primary-rgb),0.95);backdrop-filter:blur(10px);-webkit-backdrop-filter:blur(10px);height:var(--header-height);border-bottom:1px solid rgba(var(--text-primary-rgb),0.1)}.container{max-width:var(--container-max);margin:0 auto;padding:0 1rem}.hero-section{padding:4rem 1rem;min-height:calc(100vh - var(--header-height));display:flex;align-items:center}h1{font-size:clamp(2rem,5vw,4rem);font-weight:700;line-height:1.1;margin-bottom:1rem}h2{font-size:clamp(1.5rem,4vw,2.5rem);font-weight:600;line-height:1.2;margin-bottom:0.75rem}p{margin-bottom:1rem;line-height:1.6}a{color:var(--accent-primary);text-decoration:none;transition:color var(--transition-fast)}a:hover{color:var(--accent-highlight)}.btn{display:inline-flex;align-items:center;gap:0.5rem;padding:0.75rem 1.5rem;background:var(--accent-primary);color:var(--bg-primary);border:none;border-radius:0.5rem;font-weight:500;cursor:pointer;transition:all var(--transition-base)}.btn:hover{background:var(--accent-highlight);transform:translateY(-2px)}.skeleton{background:linear-gradient(90deg,rgba(var(--text-primary-rgb),0.1) 25%,rgba(var(--text-primary-rgb),0.2) 50%,rgba(var(--text-primary-rgb),0.1) 75%);background-size:200% 100%;animation:loading 1.5s ease-in-out infinite;border-radius:0.25rem}@keyframes loading{0%{background-position:200% 0}100%{background-position:-200% 0}}img{max-width:100%;height:auto;display:block}img[loading="lazy"]{background:rgba(var(--text-primary-rgb),0.1)}@media (max-width:768px){.hero-section{padding:2rem 1rem}h1{font-size:2rem}.hide-mobile{display:none}}@media (min-width:769px){.hide-desktop{display:none}}.will-change-transform{will-change:transform}@media (prefers-reduced-motion:reduce){*,*::before,*::after{animation-duration:0.01ms!important;animation-iteration-count:1!important;transition-duration:0.01ms!important}}
        ` }} />
        
        {/* Content Security Policy - Conditional for dev vs production */}
        {process.env.NODE_ENV === 'development' ? (
          // Development - Very permissive CSP (allows everything for debugging)
          <meta 
            httpEquiv="Content-Security-Policy" 
            content="default-src * 'unsafe-eval' 'unsafe-inline'; script-src * 'unsafe-inline' 'unsafe-eval'; style-src * 'unsafe-inline'; img-src * data: blob:; font-src * data:; connect-src *; frame-src *;" 
          />
        ) : (
          // Production - Secure CSP for GitHub Pages + Cloudflare + EmailOctopus + Clarity + reCAPTCHA + GitHub API
          <meta 
            httpEquiv="Content-Security-Policy" 
            content="default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval' https://www.googletagmanager.com https://www.google.com https://www.gstatic.com https://www.clarity.ms https://*.clarity.ms https://cdn.sender.net https://app.sender.net https://api.sender.net *.sender.net https://vercel.live https://*.vercel.app https://cdnjs.cloudflare.com https://ajax.cloudflare.com https://va.vercel-scripts.com https://*.vercel-scripts.com https://eocampaign1.com https://*.eocampaign1.com https://emailoctopus.com https://*.emailoctopus.com https://static.cloudflareinsights.com; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com https://www.gstatic.com https://cdn.sender.net https://cdnjs.cloudflare.com https://eocampaign1.com https://*.eocampaign1.com; img-src 'self' data: https: blob: https://www.google.com https://www.gstatic.com https://cdn.sender.net https://app.sender.net https://eocampaign1.com https://*.eocampaign1.com; font-src 'self' https://fonts.gstatic.com https://www.gstatic.com https://cdn.sender.net https://cdnjs.cloudflare.com https://eocampaign1.com; connect-src 'self' https://www.google-analytics.com https://www.google.com https://www.gstatic.com https://api.github.com https://*.github.com https://cdn.sender.net https://app.sender.net https://api.sender.net *.sender.net https://vercel.live https://cloudflare.com https://*.cloudflare.com https://va.vercel-scripts.com https://*.vercel-scripts.com https://eocampaign1.com https://*.eocampaign1.com https://emailoctopus.com https://*.emailoctopus.com https://static.cloudflareinsights.com; frame-src 'self' https://www.google.com https://www.gstatic.com https://cdn.sender.net https://app.sender.net https://eocampaign1.com https://*.eocampaign1.com https://emailoctopus.com https://*.emailoctopus.com;" 
          />
        )}
        
        {/* Cloudflare optimizations - only in production */}
        {process.env.NODE_ENV !== 'development' && (
          <>
            <meta name="cf-visitor" content='{"scheme":"https"}' />
            <meta httpEquiv="X-Forwarded-Proto" content="https" />
          </>
        )}
        
        {/* Google Analytics - Removed from here, handled by Analytics component with consent */}

        <script dangerouslySetInnerHTML={{ __html: `
        (function() {
          try {
            // Don't run this script during server-side rendering
            if (typeof window === 'undefined' || typeof document === 'undefined') return;
            
            // 1. Check localStorage - the source of truth for user preference
            let storedTheme = localStorage.getItem('theme');
            
            // 2. If no stored theme, check system preference
            if (!storedTheme) {
              const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
              storedTheme = systemPrefersDark ? 'dark' : 'light';
              // Save this to localStorage for next time
              localStorage.setItem('theme', storedTheme);
            }
            
            // Wait for DOM to be ready
            const applyTheme = () => {
              // Safety check that DOM is ready
              if (!document || !document.documentElement) return;
              
              // 3. Ensure clean state
              document.documentElement.classList.remove('dark', 'light');
              
              // 4. Apply theme class and colorScheme
              document.documentElement.classList.add(storedTheme);
              document.documentElement.style.colorScheme = storedTheme;
              
              // 5. Apply immediate colors to prevent flash - only to html element
              if (storedTheme === 'dark') {
                document.documentElement.style.setProperty('background-color', '#22182b', 'important');
                document.documentElement.style.setProperty('color', '#f5f0e6', 'important');
              } else {
                document.documentElement.style.setProperty('background-color', '#fbf6ef', 'important');
                document.documentElement.style.setProperty('color', '#4a3f35', 'important');
              }
              
              // 6. Store for React
              window.__NEXT_THEME_INITIAL = storedTheme;
            };
            
            // Apply theme immediately
            applyTheme();
            
            // Also apply after DOM is fully loaded (for safety)
            if (document.readyState === 'loading') {
              document.addEventListener('DOMContentLoaded', applyTheme);
            }
            
          } catch (e) {
            console.error('Theme initialization error:', e);
            // Fallback to light - only set on html element
            if (document && document.documentElement) {
              document.documentElement.classList.add('light');
              document.documentElement.style.setProperty('background-color', '#fbf6ef', 'important');
              document.documentElement.style.setProperty('color', '#4a3f35', 'important');
            }
          }
        })();
      `}} />
      </head>
      <body>
        {/* Structured Data for SEO */}
        <OrganizationSchema />
        <WebSiteSchema />
        <LocalBusinessSchema />
        
        <DOMErrorBoundary fallback={<ErrorFallback />}>
          <ThemeProvider>
            <CookieProvider>
              <GlobalDOMErrorHandler />
              <TrailingSlashHandler />
              <DynamicFavicon />
              <PrefetchLinks />
              <ServiceWorkerRegistration />
              <SkipToContent />
              <Nav />
              <main role="main" id="main-content">{children}</main>
              <Footer />
              <ScrollToTopHandler />
              <Analytics />
              <GlobalEventTracking />
              <DeferredStyles />
              <LayoutClient />
            </CookieProvider>
          </ThemeProvider>
        </DOMErrorBoundary>
      </body>
    </html>
  );
}