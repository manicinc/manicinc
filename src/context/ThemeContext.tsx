'use client';

import React, { createContext, useState, useContext, useEffect, ReactNode, useCallback } from 'react';

interface ThemeContextProps {
    isDarkMode: boolean;
    theme: 'dark' | 'light';
    setTheme: (theme: 'dark' | 'light') => void;
    toggleTheme: () => void;
    mounted: boolean; // Expose mounted state if needed elsewhere
}

const ThemeContext = createContext<ThemeContextProps | undefined>(undefined);

// Extend Window interface safely
declare global {
    interface Window {
        __theme?: 'dark' | 'light'; // Optional: if your inline script sets this
        toggleTheme?: () => void;
    }
}

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
    const [theme, setThemeState] = useState<'dark' | 'light'>('light'); // Default to light for SSR safety
    const [mounted, setMounted] = useState<boolean>(false);
    const [isTransitioning, setIsTransitioning] = useState<boolean>(false);

    // ---- Initialization Effect ----
    useEffect(() => {
        setMounted(true);

        // Function to read and apply the theme from storage/DOM
        const initializeTheme = () => {
            let initialTheme: 'dark' | 'light';
            try {
                initialTheme = (localStorage.getItem('theme') as 'dark' | 'light') ??
                               (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
                 // More robust: check class on HTML AFTER checking localStorage
                 if (document.documentElement.classList.contains('dark')) {
                    initialTheme = 'dark';
                 } else if (document.documentElement.classList.contains('light')) {
                     initialTheme = 'light';
                 }

            } catch (e) {
                console.warn('Could not access localStorage for theme, using system preference.');
                initialTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
            }

            console.log('ThemeContext Initializing - Detected theme:', initialTheme);
            setThemeState(initialTheme);

            // Sync DOM class *if necessary* (inline script should handle initial)
            // Only update if different from current state to avoid unnecessary triggers
            if (!document.documentElement.classList.contains(initialTheme)) {
                 console.log(`Syncing DOM class on init. Removing 'light', 'dark', adding '${initialTheme}'`);
                 document.documentElement.classList.remove('light', 'dark');
                 document.documentElement.classList.add(initialTheme);
                 document.documentElement.style.setProperty('color-scheme', initialTheme);
            }

            // Mark theme as loaded for CSS transitions/opacity
            requestAnimationFrame(() => {
                 document.documentElement.setAttribute('data-theme-loaded', 'true');
                 console.log('data-theme-loaded set to true');
            });
        };

        initializeTheme();

        // ---- Observer for external changes (e.g., browser dev tools, extensions) ----
        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                if (mutation.attributeName === 'class' && !isTransitioning) {
                    const newIsDark = document.documentElement.classList.contains('dark');
                    const currentTheme = newIsDark ? 'dark' : 'light';
                    if (currentTheme !== theme) {
                         console.log('DOM class changed externally, updating context state to:', currentTheme);
                         setThemeState(currentTheme);
                    }
                }
            });
        });

        observer.observe(document.documentElement, { attributes: true });

        // ---- Listener for system preference changes ----
        const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
        const handleSystemChange = (e: MediaQueryListEvent) => {
             // Only change if no theme is explicitly set in localStorage
             try {
                 if (localStorage.getItem('theme') === null) {
                     const newSystemTheme = e.matches ? 'dark' : 'light';
                     console.log('System theme changed, updating to:', newSystemTheme);
                     // Use the main setTheme function to handle the update
                     setTheme(newSystemTheme);
                 }
             } catch (error) {
                console.warn("Could not access localStorage to check for existing theme preference during system change.");
             }
        };

        mediaQuery.addEventListener('change', handleSystemChange);


        return () => {
            observer.disconnect();
            mediaQuery.removeEventListener('change', handleSystemChange);
         };
        // Rerun ONLY on mount. Theme state changes are handled internally or by observer.
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);


    // ---- Core Theme Update Function ----
    const applyThemeChange = useCallback((newTheme: 'dark' | 'light') => {
        if (isTransitioning || !mounted) return;

        const html = document.documentElement;
        const currentTheme = html.classList.contains('dark') ? 'dark' : 'light';

        if (newTheme === currentTheme) {
            console.log('Theme already set to', newTheme);
            // Ensure state is correct even if no change needed
            if (theme !== newTheme) setThemeState(newTheme);
            return;
        }

        console.log(`Applying theme change: ${currentTheme} -> ${newTheme}`);
        setIsTransitioning(true);

        // 1. Add transition class
        html.classList.add('theme-transitioning');

        // 2. Remove old theme class, add new theme class
        html.classList.remove(currentTheme);
        html.classList.add(newTheme);

        // 3. Update color-scheme meta
        html.style.setProperty('color-scheme', newTheme);

        // 4. Update React State
        setThemeState(newTheme);

        // 5. Persist to localStorage
        try {
            localStorage.setItem('theme', newTheme);
            console.log('Theme saved to localStorage:', newTheme);
        } catch (e) {
            console.error('Failed to save theme to localStorage:', e);
        }

        // 6. Remove transition class after CSS transition duration
        // Ensure this duration matches your CSS transition time in theme.css
        const transitionDuration = 300; // ms, match your CSS
        setTimeout(() => {
             html.classList.remove('theme-transitioning');
             setIsTransitioning(false);
             console.log(`Theme transition complete. Current theme: ${newTheme}`);
        }, transitionDuration);

    }, [isTransitioning, mounted, theme]); // Include 'theme' dependency for the check inside

    // ---- Public Toggle Function ----
    const toggleTheme = useCallback(() => {
        const currentTheme = document.documentElement.classList.contains('dark') ? 'dark' : 'light';
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        console.log('Toggle theme called.');
        applyThemeChange(newTheme);
    }, [applyThemeChange]); // Depends on applyThemeChange

    // ---- Public Set Function ----
    const setTheme = useCallback((newTheme: 'dark' | 'light') => {
         console.log('Set theme called with:', newTheme);
        applyThemeChange(newTheme);
    }, [applyThemeChange]); // Depends on applyThemeChange


     // Expose toggle function globally if needed (optional)
     useEffect(() => {
         if (mounted) {
             window.toggleTheme = toggleTheme;
             return () => {
                 delete window.toggleTheme;
             };
         }
     }, [mounted, toggleTheme]);


    // Provide a default non-functional context before mounting
    const contextValue: ThemeContextProps = mounted
        ? { isDarkMode: theme === 'dark', theme, setTheme, toggleTheme, mounted }
        : {
              isDarkMode: false, // Best guess before hydration
              theme: 'light',
              setTheme: () => console.warn("ThemeProvider not mounted yet."),
              toggleTheme: () => console.warn("ThemeProvider not mounted yet."),
              mounted: false
          };

    return (
        <ThemeContext.Provider value={contextValue}>
            {children}
        </ThemeContext.Provider>
    );
};

// ---- Hook ----
export const useTheme = (): ThemeContextProps => {
    const context = useContext(ThemeContext);

    if (context === undefined) {
        // Provide a more informative fallback, but still log a warning
        console.warn('useTheme must be used within a ThemeProvider. Providing default values.');

        // Attempt a basic guess outside context (less reliable)
        const isBrowser = typeof window !== 'undefined';
        let ssrGuessIsDark = false;
         if (isBrowser) {
             try {
                ssrGuessIsDark = localStorage.getItem('theme') === 'dark' ||
                                 (!localStorage.getItem('theme') && window.matchMedia('(prefers-color-scheme: dark)').matches);
             } catch {} // Ignore localStorage errors here
         }

        return {
            isDarkMode: ssrGuessIsDark,
            theme: ssrGuessIsDark ? 'dark' : 'light',
            setTheme: () => console.error('Cannot set theme: ThemeProvider context is missing.'),
            toggleTheme: () => console.error('Cannot toggle theme: ThemeProvider context is missing.'),
            mounted: false // Clearly indicate context isn't ready
        };
    }

    return context;
};