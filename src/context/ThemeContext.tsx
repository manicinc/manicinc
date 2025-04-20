// src/context/ThemeContext.tsx
'use client';

import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';

interface ThemeContextProps {
    isDarkMode: boolean;
}

const ThemeContext = createContext<ThemeContextProps | undefined>(undefined);

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
    // Default to true (dark) initially, useEffect will sync with actual class
    const [isDarkMode, setIsDarkMode] = useState<boolean>(true);
    const [mounted, setMounted] = useState<boolean>(false);

    useEffect(() => {
        setMounted(true); // Component has mounted on the client
        const html = document.documentElement;

        const checkTheme = () => {
            const isDark = html.classList.contains('dark');
            setIsDarkMode(isDark);
        };

        checkTheme(); // Sync state on mount

        // Observe the <html> element's class attribute for changes
        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                if (mutation.attributeName === 'class') {
                    checkTheme(); // Re-sync state if class changes
                }
            });
        });

        observer.observe(html, { attributes: true, attributeFilter: ['class'] });

        // Cleanup observer on unmount
        return () => observer.disconnect();
    }, []); // Empty dependency array ensures this runs only once on mount

    // Provide the current theme state.
    // IMPORTANT: Before mount (during SSR), use the initial state value.
    // Avoid accessing `document` here directly.
    const value = {
        isDarkMode: mounted ? isDarkMode : true // Default to true (dark) before mount
    };

    return (
        <ThemeContext.Provider value={value}>
            {children}
        </ThemeContext.Provider>
    );
};

// Custom hook for easy consumption
export const useTheme = (): ThemeContextProps => {
    const context = useContext(ThemeContext);
    if (context === undefined) {
        // Fallback strategy if used outside provider
        console.warn('useTheme used outside ThemeProvider, defaulting to dark mode.');
        // Check document ONLY if we're sure we're client-side, otherwise default safely
        const safeIsDark = typeof window !== 'undefined' ? document.documentElement.classList.contains('dark') : true;
        return { isDarkMode: safeIsDark };
    }
    return context;
};