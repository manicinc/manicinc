// src/components/Theme/OrnamentalThemeToggle.tsx
"use client";
import React, { useState, useEffect } from 'react';
import { useTheme } from '@/context/ThemeContext';
// --- PLACEHOLDER ICONS ---
// Replace these with your actual Victorian-style SVG components
// e.g., import { VictorianSunIcon, VictorianMoonIcon } from '../Icons';
const VictorianSunIcon = ({ className }: { className?: string }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" xmlns="http://www.w3.org/2000/svg">
        <circle cx="12" cy="12" r="5"/>
        <line x1="12" y1="1" x2="12" y2="3"/>
        <line x1="12" y1="21" x2="12" y2="23"/>
        <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/>
        <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/>
        <line x1="1" y1="12" x2="3" y2="12"/>
        <line x1="21" y1="12" x2="23" y2="12"/>
        <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/>
        <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>
    </svg>
);
const VictorianMoonIcon = ({ className }: { className?: string }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" xmlns="http://www.w3.org/2000/svg">
        <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
        {/* Add some ornate details if desired */}
        <path d="M18 6 C 19 7, 19 8, 18 9" fill="none"/>
        <path d="M19 11 C 20 12, 20 13, 19 14" fill="none"/>
    </svg>
);
// --- END PLACEHOLDER ICONS ---

import styles from './ThemeToggle.module.css'; // We'll add styles to a shared or new CSS module

interface OrnamentalThemeToggleProps {
    className?: string;
    size?: 'sm' | 'md' | 'lg'; // Keep size consistency if needed
}

export default function OrnamentalThemeToggle({ className = '', size = 'md' }: OrnamentalThemeToggleProps) {
    const { isDarkMode } = useTheme();
    const [isTransitioning, setIsTransitioning] = useState<boolean>(false);
    const [mounted, setMounted] = useState<boolean>(false);

    const iconSizes = {
        sm: { button: 'w-10 h-10', icon: 'w-5 h-5' }, // Adjusted for potentially larger ornate design
        md: { button: 'w-12 h-12', icon: 'w-6 h-6' },
        lg: { button: 'w-14 h-14', icon: 'w-7 h-7' }
    };
    const { button: buttonSize, icon: iconSize } = iconSizes[size];

    useEffect(() => {
        setMounted(true);
    }, []);

    const toggleTheme = () => {
        if (isTransitioning || !mounted) return;
        setIsTransitioning(true);

        // Use the same global toggle function
        if (typeof window.toggleTheme === 'function') {
            window.toggleTheme();
            setTimeout(() => setIsTransitioning(false), 700); // Match CSS transition duration
        } else {
            console.error("window.toggleTheme function not found.");
            // Add fallback logic if needed, similar to standard ThemeToggle
            setIsTransitioning(false);
        }
    };

    // Render a placeholder if not mounted
    if (!mounted) {
        return <div className={`${buttonSize} ${styles.ornateTogglePlaceholder} ${className}`} aria-hidden="true" />;
    }

    return (
        <button
            onClick={toggleTheme}
            className={`${styles.ornateToggleButton} ${buttonSize} ${className} ${isTransitioning ? styles.ornateToggleTransitioning : ''}`}
            aria-label={isDarkMode ? "Switch to light mode (ornate)" : "Switch to dark mode (ornate)"}
            disabled={isTransitioning}
            type="button" // Explicitly set type
        >
            <div className={styles.ornateIconContainer}>
                {/* Light Mode Icon (Sun) */}
                <VictorianSunIcon
                    className={`${styles.ornateIcon} ${styles.ornateSun} ${iconSize} ${!isDarkMode ? styles.ornateIconVisible : ''}`}
                />
                {/* Dark Mode Icon (Moon) */}
                <VictorianMoonIcon
                    className={`${styles.ornateIcon} ${styles.ornateMoon} ${iconSize} ${isDarkMode ? styles.ornateIconVisible : ''}`}
                />
            </div>
            {/* Optional: Add ::before/::after for decorative borders/elements via CSS */}
        </button>
    );
}