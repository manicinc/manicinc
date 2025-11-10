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
import PrefetchLinks from '@/components/PrefetchLinks';
import ServiceWorkerRegistration from '@/components/ServiceWorkerRegistration';

// Import Styles
import "./styles/globals.css";
import "./styles/blog-newsletter.css";

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
        
        {/* DNS prefetch for external domains */}
        <link rel="dns-prefetch" href="https://cdn.sender.net" />
        <link rel="dns-prefetch" href="https://api.github.com" />
        <link rel="dns-prefetch" href="https://www.clarity.ms" />
        <link rel="dns-prefetch" href="https://eocampaign1.com" />
        
        {/* Critical CSS for fast initial paint */}
        <style dangerouslySetInnerHTML={{ __html: `
          /* Critical CSS - Inline in <head> for fast initial paint */
          :root{--bg-primary:#fbf6ef;--bg-primary-rgb:251,246,239;--text-primary:#4a3f35;--text-primary-rgb:74,63,53;--accent-primary:#d6a574;--accent-highlight:#7de8c9}html{background-color:#fbf6ef;color:#4a3f35}html.dark{background-color:#22182b!important;color:#f5f0e6!important}html:not([data-theme-loaded="true"]) body{opacity:0}body{margin:0;font-family:Inter,system-ui,sans-serif;line-height:1.6}main{min-height:100vh}nav{position:sticky;top:0;z-index:100;background:rgba(251,246,239,.95);backdrop-filter:blur(10px);height:60px}.dark nav{background:rgba(34,24,43,.95)}.hero-section{padding:4rem 1rem;max-width:1200px;margin:0 auto}h1{font-size:clamp(2rem,5vw,4rem);font-weight:700;line-height:1.1;margin:0 0 1rem}img{max-width:100%;height:auto;display:block}.skeleton{background:linear-gradient(90deg,#f0f0f0 25%,#e0e0e0 50%,#f0f0f0 75%);background-size:200% 100%;animation:loading 1.5s ease-in-out infinite}@keyframes loading{0%{background-position:200% 0}100%{background-position:-200% 0}}.dark .skeleton{background:linear-gradient(90deg,#2a2a2a 25%,#3a3a3a 50%,#2a2a2a 75%)}
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
            content="default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval' https://www.googletagmanager.com https://www.google.com https://www.gstatic.com https://www.clarity.ms https://*.clarity.ms https://cdn.sender.net https://app.sender.net https://api.sender.net *.sender.net https://vercel.live https://*.vercel.app https://cdnjs.cloudflare.com https://ajax.cloudflare.com https://va.vercel-scripts.com https://*.vercel-scripts.com https://eocampaign1.com https://*.eocampaign1.com https://emailoctopus.com https://*.emailoctopus.com; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com https://www.gstatic.com https://cdn.sender.net https://cdnjs.cloudflare.com https://eocampaign1.com https://*.eocampaign1.com; img-src 'self' data: https: blob: https://www.google.com https://www.gstatic.com https://cdn.sender.net https://app.sender.net https://eocampaign1.com https://*.eocampaign1.com; font-src 'self' https://fonts.gstatic.com https://www.gstatic.com https://cdn.sender.net https://cdnjs.cloudflare.com https://eocampaign1.com; connect-src 'self' https://www.google-analytics.com https://www.google.com https://www.gstatic.com https://api.github.com https://*.github.com https://cdn.sender.net https://app.sender.net https://api.sender.net *.sender.net https://vercel.live https://cloudflare.com https://*.cloudflare.com https://va.vercel-scripts.com https://*.vercel-scripts.com https://eocampaign1.com https://*.eocampaign1.com https://emailoctopus.com https://*.emailoctopus.com; frame-src 'self' https://www.google.com https://www.gstatic.com https://cdn.sender.net https://app.sender.net https://eocampaign1.com https://*.eocampaign1.com https://emailoctopus.com https://*.emailoctopus.com;" 
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
        
        <DOMErrorBoundary fallback={<ErrorFallback />}>
          <ThemeProvider>
            <CookieProvider>
              <GlobalDOMErrorHandler />
              <TrailingSlashHandler />
              <DynamicFavicon />
              <PrefetchLinks />
              <ServiceWorkerRegistration />
              <Nav />
              <main role="main">{children}</main>
              <Footer />
              <ScrollToTopHandler />
              <Analytics />
              {process.env.NEXT_PUBLIC_SENDER_ACCOUNT_ID && (
                <SenderScript accountId={process.env.NEXT_PUBLIC_SENDER_ACCOUNT_ID} />
              )}
              <LayoutClient />
            </CookieProvider>
          </ThemeProvider>
        </DOMErrorBoundary>
      </body>
    </html>
  );
}