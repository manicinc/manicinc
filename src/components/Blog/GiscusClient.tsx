// src/components/GiscusComments.tsx
'use client';

import React, { useState, useEffect } from 'react'; // Import useState, useEffect
import Giscus from '@giscus/react';
import { GISCUS_CONFIG } from '@/lib/constants';
import { useTheme } from '@/context/ThemeContext'; // <--- Make sure this path is correct

export default function GiscusComments() {
    // --- CORRECTED: Destructure isDarkMode ---
    const { isDarkMode } = useTheme(); // Get boolean theme state

    // State to hold the theme string for Giscus ('light', 'dark', 'transparent_dark', etc.)
    // Initialize with a sensible default based on your site's non-JS/initial state
    const [giscusTheme, setGiscusTheme] = useState('transparent_dark'); // Defaulting to dark

    // This effect runs on the client after mount and when isDarkMode changes
    useEffect(() => {
        // --- CORRECTED: Use isDarkMode to determine the theme string ---
        const currentGiscusTheme = isDarkMode ? 'transparent_dark' : 'light'; // Or use 'dark'
        setGiscusTheme(currentGiscusTheme);

        // console.log(`GiscusComments: isDarkMode=${isDarkMode}, setting Giscus theme to '${currentGiscusTheme}'`); // For debugging

    }, [isDarkMode]); // --- CORRECTED: Dependency array uses isDarkMode ---


    // Configuration check (keep your existing logic)
    if (!GISCUS_CONFIG.REPO || !GISCUS_CONFIG.REPO_ID || !GISCUS_CONFIG.CATEGORY || !GISCUS_CONFIG.CATEGORY_ID) {
         console.error("Giscus constants configuration values are missing.");
         return <p>Error loading comments: Configuration missing.</p>;
     }

    // Reminder: The postMessage logic MUST ALSO be updated in your theme toggling function
    // to use the isDarkMode boolean correctly when sending the message.

    return (
        <div className="giscus-container mt-12 pt-8 border-t border-dashed border-bg-tertiary">
            {/* Optional: Add a title styled by your theme */}
            {/* <h3 className="text-2xl font-heading-blog mb-6">Comments</h3> */}
            <Giscus
                id="comments"
                repo={GISCUS_CONFIG.REPO}
                repoId={GISCUS_CONFIG.REPO_ID}
                category={GISCUS_CONFIG.CATEGORY}
                categoryId={GISCUS_CONFIG.CATEGORY_ID}
                mapping={GISCUS_CONFIG.MAPPING}
                strict={GISCUS_CONFIG.STRICT}
                reactionsEnabled={GISCUS_CONFIG.REACTIONS}
                emitMetadata={GISCUS_CONFIG.EMIT_METADATA}
                inputPosition={GISCUS_CONFIG.INPUT_POSITION}
                // --- Use the dynamic state variable (no change here) ---
                theme={giscusTheme}
                // --- ------------------------------------------------ ---
                lang={GISCUS_CONFIG.LANG}
                loading={GISCUS_CONFIG.LOADING}
            />
        </div>
    );
}