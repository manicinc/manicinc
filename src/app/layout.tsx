// src/app/layout.tsx
import type { Metadata } from 'next';
import { ReactNode } from "react";
import Script from 'next/script';
// Ensure fonts are correctly imported/configured
import { Inter, Lato, EB_Garamond, Playfair_Display, Merriweather, Dancing_Script } from 'next/font/google';

// Import Components & Providers
import { Nav } from "@/components/Nav";
import Footer from "@/components/Footer/Footer";
import LayoutClient from "./LayoutClient";
import { ThemeProvider } from '@/context/ThemeContext';
import DynamicFavicon from '@/components/Base/DynamicFavicon';
import ScrollToTopHandler from '@/components/ScrollBtns/ScrollToTopHandler';

// Import Styles
import "./styles/globals.css"; // Includes theme.css via @import or direct rules

// Import SEO helper
import { generateSEOMetadata } from '@/lib/getSEOMetadata';

// --- Font Definitions ---
const inter = Inter({ subsets: ['latin'], variable: '--font-body', display: 'swap' });
const lato = Lato({ subsets: ['latin'], weight: ['400', '700'], variable: '--font-display-orig', display: 'swap' });
const ebGaramond = EB_Garamond({ subsets: ['latin'], weight: ['400', '700'], style: ['normal', 'italic'], variable: '--font-meta-blog', display: 'swap' });
const playfairDisplay = Playfair_Display({ subsets: ['latin'], weight: ['700'], variable: '--font-heading-blog', display: 'swap' });
const merriweather = Merriweather({ subsets: ['latin'], weight: ['400'], style: ['normal', 'italic'], variable: '--font-body-blog', display: 'swap' });
const dancingScript = Dancing_Script({ subsets: ['latin'], weight: ['400'], variable: '--font-script-blog', display: 'swap' });

// Generate default metadata for the root layout
export const metadata: Metadata = generateSEOMetadata('/');

// Inline script to prevent theme FOUC and set initial class on <html>
const InitializeThemeScript = `(function(){ function getInitialTheme() { try { const storedTheme = window.localStorage.getItem('theme'); if (storedTheme) return storedTheme; } catch(e){} const prefersDark = window.matchMedia('(prefers-color-scheme: dark)'); if (prefersDark.matches) return 'dark'; return 'light'; } const theme = getInitialTheme(); document.documentElement.classList.add(theme); document.documentElement.style.setProperty('color-scheme', theme); })();`;

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
            `} suppressHydrationWarning>
            <head>
                {/* Theme script MUST be in <head> to run before body render */}
                <script dangerouslySetInnerHTML={{ __html: InitializeThemeScript }} />
            </head>
            <body>
                {/* Wrap the main application structure with ThemeProvider */}
                <ThemeProvider>
                    {/* Add the DynamicFavicon component to update favicons based on route */}
                    <DynamicFavicon />
                    
                    <Nav />
                    {/* Add role="main" for accessibility */}
                    <main role="main" className="">{children}</main>
                    <Footer />
                    
                    <ScrollToTopHandler />
                    <LayoutClient />
                </ThemeProvider>
            </body>
        </html>
    );
}