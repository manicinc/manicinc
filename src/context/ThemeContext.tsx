// src/context/ThemeContext.tsx
'use client';

import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';

interface ThemeContextProps {
    isDarkMode: boolean;
    theme: 'dark' | 'light';
    setTheme: (theme: 'dark' | 'light') => void;
    toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextProps | undefined>(undefined);

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
    // Initialize with null theme state until we have hydrated
    const [isDarkMode, setIsDarkMode] = useState<boolean>(false);
    const [theme, setThemeState] = useState<'dark' | 'light'>('light');
    const [mounted, setMounted] = useState<boolean>(false);

    // Effect to run on client-side only
    useEffect(() => {
        // Mark as mounted
        setMounted(true);
        
        // Get initial theme state from HTML class - this is already set by our script in _document
        const html = document.documentElement;
        const initialIsDark = html.classList.contains('dark');
        
        // Update state to match what's already applied
        setIsDarkMode(initialIsDark);
        setThemeState(initialIsDark ? 'dark' : 'light');
        
        // Create an observer to keep our React state in sync with DOM changes
        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                if (mutation.attributeName === 'class') {
                    const newIsDark = html.classList.contains('dark');
                    setIsDarkMode(newIsDark);
                    setThemeState(newIsDark ? 'dark' : 'light');
                }
            });
        });
        
        // Start observing HTML class changes
        observer.observe(html, { attributes: true, attributeFilter: ['class'] });
        
        // Cleanup on unmount
        return () => observer.disconnect();
    }, []);
    
    // Theme change handler with persistence
    const setTheme = (newTheme: 'dark' | 'light') => {
        if (!mounted) return;
        
        const html = document.documentElement;
        const currentTheme = html.classList.contains('dark') ? 'dark' : 'light';
        
        if (newTheme !== currentTheme) {
            // Add transition class
            html.classList.add('theme-transitioning');
            
            // Update theme
            html.classList.remove(currentTheme);
            html.classList.add(newTheme);
            html.style.setProperty('color-scheme', newTheme);
            
            // Store in localStorage - CRITICAL for persistence
            try {
                localStorage.setItem('theme', newTheme);
            } catch (e) {
                console.warn('Could not save theme preference:', e);
            }
            
            // Update Giscus theme if present
            updateGiscusTheme(newTheme);
            
            // Remove transition class after animation
            setTimeout(() => {
                html.classList.remove('theme-transitioning');
            }, 300);
            
            // Update state
            setIsDarkMode(newTheme === 'dark');
            setThemeState(newTheme);
        }
    };
    
    // Helper function to update Giscus
    const updateGiscusTheme = (newTheme: 'dark' | 'light') => {
        const giscusFrame = document.querySelector<HTMLIFrameElement>('iframe.giscus-frame');
        if (giscusFrame && giscusFrame.contentWindow) {
            const giscusThemeToSet = newTheme === 'dark' ? 'transparent_dark' : 'light';
            try {
                giscusFrame.contentWindow.postMessage({
                    giscus: {
                        setConfig: {
                            theme: giscusThemeToSet,
                        }
                    }
                }, 'https://giscus.app');
            } catch (e) {
                console.warn('Could not update Giscus theme:', e);
            }
        }
    };
    
    // Theme toggle function
    const toggleTheme = () => {
        const newTheme = isDarkMode ? 'light' : 'dark';
        setTheme(newTheme);
    };
    
    // Expose global theme toggle for other components
    useEffect(() => {
        if (!mounted) return;
        
        // Make the toggleTheme function globally available
        window.toggleTheme = toggleTheme;
        
        // Cleanup on unmount
        return () => {
            delete window.toggleTheme;
        };
    }, [toggleTheme, mounted]); // Re-setup when toggleTheme or mounted changes
    
    // Value to provide to consumers
    const value = {
        isDarkMode,
        theme,
        setTheme,
        toggleTheme
    };
    
    return (
        <ThemeContext.Provider value={value}>
            {children}
        </ThemeContext.Provider>
    );
};

// Improved hook with better fallback strategy
export const useTheme = (): ThemeContextProps => {
    const context = useContext(ThemeContext);
    
    if (context === undefined) {
        // Fallback strategy if used outside provider
        console.warn('useTheme used outside ThemeProvider, using document state.');
        
        // Safe checks for client-side
        const isBrowser = typeof window !== 'undefined';
        const defaultIsDark = isBrowser ? 
            document.documentElement.classList.contains('dark') : false;
        
        // Return a stub implementation
        return {
            isDarkMode: defaultIsDark,
            theme: defaultIsDark ? 'dark' : 'light',
            setTheme: () => console.warn('Theme context not available'),
            toggleTheme: () => console.warn('Theme context not available')
        };
    }
    
    return context;
};

// Type definition for window augmentation
declare global {
    interface Window {
        toggleTheme?: () => void;
    }
}