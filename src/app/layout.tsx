// src/app/layout.tsx (with Google Analytics)
import { ReactNode } from "react";
import { Inter, Lato, EB_Garamond, Playfair_Display, Merriweather, Dancing_Script } from 'next/font/google';

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
import type { Metadata, Viewport } from 'next';

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
const ebGaramond = EB_Garamond({ 
  subsets: ['latin'], 
  weight: ['400', '700'], 
  style: ['normal', 'italic'], 
  variable: '--font-meta-blog', 
  display: 'swap',
  fallback: ['Times New Roman', 'serif']
});
const playfairDisplay = Playfair_Display({ 
  subsets: ['latin'], 
  weight: ['700'], 
  variable: '--font-heading-blog', 
  display: 'swap',
  fallback: ['Times New Roman', 'serif']
});
const merriweather = Merriweather({ 
  subsets: ['latin'], 
  weight: ['400'], 
  style: ['normal', 'italic'], 
  variable: '--font-body-blog', 
  display: 'swap',
  fallback: ['Times New Roman', 'serif']
});
const dancingScript = Dancing_Script({ 
  subsets: ['latin'], 
  weight: ['400'], 
  variable: '--font-script-blog', 
  display: 'swap',
  fallback: ['cursive']
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
            ${ebGaramond.variable}
            ${playfairDisplay.variable}
            ${merriweather.variable}
            ${dancingScript.variable}
        `} suppressHydrationWarning>
      <head>
        {/* Google Analytics */}
        {GA_ID && (
          <>
            <script
              async
              src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}
            />
            <script
              dangerouslySetInnerHTML={{
                __html: `
                  window.dataLayer = window.dataLayer || [];
                  function gtag(){dataLayer.push(arguments);}
                  gtag('js', new Date());
                  gtag('config', '${GA_ID}');
                `,
              }}
            />
          </>
        )}

        <script dangerouslySetInnerHTML={{ __html: `
        (function() {
          try {
            // Don't run this script during server-side rendering
            if (typeof window === 'undefined' || typeof document === 'undefined') return;
            
            console.log('Theme initialization script running');
            
            // 1. Check localStorage - the source of truth for user preference
            let storedTheme = localStorage.getItem('theme');
            console.log('Theme from localStorage:', storedTheme);
            
            // 2. If no stored theme, check system preference
            if (!storedTheme) {
              const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
              storedTheme = systemPrefersDark ? 'dark' : 'light';
              console.log('No theme in localStorage, using system preference:', storedTheme);
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
              
              console.log('Theme initialization complete:', storedTheme);
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
        <ThemeProvider>
          <CookieProvider>
            <TrailingSlashHandler />
            <DynamicFavicon />
            <Nav />
            <main role="main">{children}</main>
            <Footer />
            <ScrollToTopHandler />
            <Analytics />
            <SenderScript formId={process.env.NEXT_PUBLIC_SENDER_FORM_ID} />
            <LayoutClient />
          </CookieProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}