// src/components/Nav/NavLogo.tsx
"use client";

import React from 'react';
import Link from 'next/link';
import { AnimatedAscii, IconOrnateSearch } from '../Icons'; // Import necessary icons
import ManicAgencyLogo from './ManicAgencyLogo'; // Ensure path is correct
import LookingGlassLogo from './LookingGlassLogo/LookingGlassLogo'; // Ensure path is correct
import styles from './Nav.module.css';

// **** CORRECT PROPS INTERFACE FOR NAVLOGO ****
interface NavLogoProps {
    toggleMenu: () => void;
    isBlog?: boolean; // Use isBlog here
}

// **** CORRECT COMPONENT DEFINITION FOR NAVLOGO ****
const NavLogo: React.FC<NavLogoProps> = ({ toggleMenu, isBlog }) => { // Use isBlog here

    const MainTagline = () => (
        <>
            <AnimatedAscii chars={['>', '_', '|', '█', '▒']} interval={400} /> Metaverses intersect here
        </>
    );

    const BlogTagline = () => (
        <>
            <IconOrnateSearch className={styles.taglineScopeIcon} aria-hidden="true" />
            <AnimatedAscii chars={['+', '*', '~', '✧', '◈']} interval={180} /> Read impossible things
        </>
    );

    return (
        // Main container for logo and tagline area
        <div className={`${!isBlog ? 'flex items-center space-x-2 md:space-x-3' : ''} flex-shrink min-w-0 relative`}>

            {/* Conditional wrapper for Blog Logo + Tagline */}
            {isBlog ? (
                <div className={styles.blogLogoTaglineWrapper}>
                    {/* Logo Component - Wrapped in Link */}
                    <Link
                        href="/"
                        aria-label="Return to Manic Agency Home"
                        title="Return to Manic Agency Home"
                        className={`${styles.logoLink} ${styles.logoLinkBlog} flex-shrink-0`}
                        onClick={toggleMenu} // Uses toggleMenu prop
                    >
                        {/* Renders LookingGlassLogo when isBlog is true */}
                        <LookingGlassLogo />
                    </Link>

                    {/* Blog tagline */}
                    <div className={`hidden sm:block ${styles.tagline} ${styles.taglineBlog}`}>
                        <BlogTagline />
                    </div>
                </div>
            ) : (
                 // Original structure for non-blog logo/tagline
                <>
                    <Link
                        href="/"
                        aria-label="Manic Agency Home"
                        title="Manic Agency Home"
                        className={`${styles.logoLink} ${styles.logoLinkDefault} flex-shrink-0`}
                        onClick={toggleMenu} // Uses toggleMenu prop
                    >
                        {/* Renders ManicAgencyLogo when isBlog is false/undefined */}
                        <ManicAgencyLogo />
                    </Link>

                    {/* Vertical Divider */}
                    <span className={`hidden md:inline-block self-center ${styles.dividerGradient}`}></span>

                    {/* Main site tagline - Position absolutely to overlap under services */}
                    <div className={`hidden lg:flex items-center ${styles.taglineOverlap}`}>
                        <MainTagline />
                    </div>
                </>
            )}
        </div>
    );
};

export default NavLogo;