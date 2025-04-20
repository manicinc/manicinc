// src/app/blog/[category]/[slug]/BlogPageClient.tsx
"use client"; // <<< This directive MUST be the very first line

import React, { useState, useEffect } from 'react';
// Make sure the import path for your Icons component is correct
import { IconReadingMode } from '@/components/Icons';

// Props interface clarifies that it expects children
interface BlogPageClientProps {
    children: React.ReactNode;
}

// Export the component as default
export default function BlogPageClient({ children }: BlogPageClientProps) {
    // State for toggling reading mode
    const [isReadingMode, setIsReadingMode] = useState(false);

    // Function to toggle reading mode and save preference
    const toggleReadingMode = () => {
        setIsReadingMode(prev => {
            const newState = !prev;
            // Save preference to localStorage client-side
            try {
                // Use localStorage safely, only works in the browser
                localStorage.setItem('readingModePref', JSON.stringify(newState));
            } catch (error) {
                // Handle potential errors (e.g., localStorage disabled)
                console.warn("Could not save reading mode preference:", error);
            }
            return newState;
        });
    };

    // Effect to load preference from localStorage when component mounts (client-side)
    useEffect(() => {
        try {
            const savedPref = localStorage.getItem('readingModePref');
            if (savedPref !== null) {
                // Parse the saved value back to a boolean
                setIsReadingMode(JSON.parse(savedPref));
            }
        } catch (error) {
            console.warn("Could not load reading mode preference:", error);
            // Optionally set a default if loading fails
            // setIsReadingMode(false);
        }
        // Empty dependency array ensures this runs only once after initial mount
    }, []);


    return (
        // This div wraps the main content and applies the reading-mode class dynamically
        <div className={`blog-page-wrapper ${isReadingMode ? 'reading-mode' : ''}`}>
            {/* The button to toggle reading mode */}
            <button
                onClick={toggleReadingMode}
                className="reading-mode-toggle"
                title={isReadingMode ? "Exit Reading Mode" : "Enter Reading Mode"}
                aria-pressed={isReadingMode} // Indicates the toggle state for accessibility
            >
                {/* Reading mode icon */}
                <IconReadingMode aria-hidden="true"/>
                {/* Screen reader text for accessibility */}
                <span className="sr-only">{isReadingMode ? "Exit Reading Mode" : "Enter Reading Mode"}</span>
            </button>
            {/* Render the actual page content passed down from the Server Component */}
            {children}
        </div>
    );
}