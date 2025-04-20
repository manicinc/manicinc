"use client";

import React from 'react';
import Link from 'next/link';
import { AnimatedAscii, IconOrnateSearch } from '../Icons'; // Import necessary icons
import ManicAgencyLogo from '../ManicAgencyLogo'; // Ensure path is correct
import LookingGlassLogo from '../LookingGlassLogo/LookingGlassLogo'; // Ensure path is correct
import styles from './Nav.module.css';

interface NavLogoProps {
    closeMenu: () => void;
    isBlogLogo?: boolean;
}

const NavLogo: React.FC<NavLogoProps> = ({ closeMenu, isBlogLogo }) => {

    // Define taglines - use functions to ensure AnimatedAscii runs client-side
    const MainTagline = () => (
        <>
            <AnimatedAscii chars={['>', '_', '|', '█', '▒']} interval={200}/> Metaverses intersect here
        </>
    );

    const BlogTagline = () => (
         <>
             <IconOrnateSearch className={styles.taglineScopeIcon} aria-hidden="true" />
             <AnimatedAscii chars={['+', '*', '~', '✧', '◈']} interval={180}/> Read impossible things
         </>
    );

    return (
        // Main container for logo and tagline area
        // Use flex, items-center. Allow wrapping and control spacing.
        // Ensure it doesn't grow excessively but also doesn't shrink logo too much
        <div className="flex items-center space-x-2 md:space-x-3 flex-shrink min-w-0"> {/* Added flex-shrink min-w-0 */}

            {/* Logo Component - Wrapped in Link */}
            {/* Apply appropriate logoLink style */}
            <Link
                href="/"
                aria-label={isBlogLogo ? "Return to Manic Agency Home" : "Manic Agency Home"}
                title={isBlogLogo ? "Return to Manic Agency Home" : "Manic Agency Home"}
                className={`${styles.logoLink} ${isBlogLogo ? styles.logoLinkBlog : styles.logoLinkDefault} flex-shrink-0`} // Added flex-shrink-0 to prevent logo squashing
                onClick={closeMenu}
            >
                {/* Conditionally render the correct logo component */}
                {/* Added height constraint specifically for LookingGlassLogo */}
                {isBlogLogo ? <LookingGlassLogo /> : <ManicAgencyLogo />} {/* ADJUST h-8 as needed */}
            </Link>

            {/* Vertical Divider (Only show if NOT blog logo AND on medium+ screens) */}
            {!isBlogLogo && (
                 <span className={`hidden md:inline-block self-center ${styles.dividerGradient}`}></span>
            )}

            {/* Tagline - Adjusted Visibility, Size & Margin */}
            {/* Hidden below 'lg', flex display on 'lg'+. Smaller text size. Added ml-2 */}
            <div className={`
                hidden lg:flex items-center min-w-0 /* Prevent overflow */
                ${styles.tagline} ${isBlogLogo ? styles.taglineBlog : ''}
                text-xs /* Smaller text */
                xl:text-sm /* Slightly larger on xl screens */
                ${isBlogLogo ? 'ml-2' : ''} /* Add left margin only for blog tagline */
            `}>
                 {/* Render correct tagline */}
                 {isBlogLogo ? <BlogTagline /> : <MainTagline />}
            </div>
        </div>
    );
};

export default NavLogo;