// src/components/Nav/Nav.tsx
'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { usePathname } from 'next/navigation';
import styles from './Nav.module.css';
import NavLinksDesktop from './NavLinksDesktop';
import NavLinksMobile from './NavLinksMobile';
import NavLogo from './NavLogo';
import BlogVines from '../Blog/BlogVines'; // Ensure path is correct

// --- NEW: Import Placeholder Ornamental Icons ---
// (Make sure these are created or adjust path)
import { IconOrnamentalMenuOpen } from './Icons';
import { IconOrnamentalMenuClose } from './Icons';

// (Keep other imports like Icons for flourish if you re-enable them)

export const Nav = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isScrolled, setIsScrolled] = useState(false); // Keep scroll state if used elsewhere
    const pathname = usePathname();

    const isBlog = typeof pathname === 'string' && (pathname === '/blog' || pathname.startsWith('/blog/'));
    const isBlogPost = isBlog && pathname.split('/').filter(Boolean).length > 2; // Keep if needed

    // --- (Keep useEffect for Vine Animation if needed) ---
    // useEffect(() => { ... });

    // --- Menu Toggle ---
    const toggleMenu = useCallback(() => setIsMenuOpen(prev => !prev), []);
    const closeMenu = useCallback(() => setIsMenuOpen(false), []);

    // --- Active Path Check ---
    const isActivePath = useCallback((path: string): boolean => {
        if (typeof pathname !== 'string') return false;
        if (path.startsWith('/#') && typeof window !== 'undefined') {
            return pathname === '/' && window.location.hash === path.substring(1);
        }
        if (pathname === path) return true;
        if (path !== '/' && pathname.startsWith(path + '/')) return true;
        return false;
    }, [pathname]);

    // --- Contact Click ---
    const handleContactClick = useCallback(() => {
        console.log("Contact Button Clicked (Nav)");
        closeMenu();
    }, [closeMenu]);

    return (
        <nav className={`${styles.navContainer} ${isScrolled ? styles.navScrolled : ''} ${isBlog ? styles.blogMode : ''}`}> {/* Optional: blogMode class on container */}
            {isBlog && <BlogVines />}

            <div className={`container mx-auto flex items-center justify-between lg:flex-nowrap px-3 md:px-4 py-1 gap-y-2 relative z-10`}>
                {/* Logo Area */}
                <div className="order-1 flex-shrink-0">
                    <NavLogo
                        isBlog={isBlog} // Pass isBlog to isBlogLogo prop
                        toggleMenu={closeMenu}
                    />
                </div>

                {/* Desktop Links */}
                <div className="order-3 lg:order-2 hidden md:flex flex-grow justify-end lg:flex-grow-0 lg:ml-auto">
                    <NavLinksDesktop
                        isBlog={isBlog}
                        isActivePath={isActivePath}
                        closeMenu={closeMenu}
                        handleContactClick={handleContactClick}
                    />
                </div>

                {/* --- Mobile Menu Button Area (MODIFIED) --- */}
                <div className="order-2 lg:order-3 flex items-center md:hidden ml-auto pl-2">
                    <button
                        aria-label="Toggle Menu"
                        aria-expanded={isMenuOpen}
                        aria-controls="mobile-menu-content"
                        className={`
                            ${styles.mobileMenuBtn}
                            ${isMenuOpen ? styles.menuOpen : ''}
                            ${isBlog ? styles.blogModeActive : ''} {/* Trigger for blog styles */}
                        `}
                        onClick={toggleMenu}
                    >
                        {/* --- Standard Hamburger (Hidden in blog mode via CSS) --- */}
                        <div className={styles.hamburgerIconWrapper}>
                            <span className={`${styles.bar} ${styles.bar1}`}></span>
                            <span className={`${styles.bar} ${styles.bar2}`}></span>
                            <span className={`${styles.bar} ${styles.bar3}`}></span>
                        </div>

                        {/* --- NEW: Ornamental Icons (Shown in blog mode via CSS) --- */}
                        <div className={styles.ornamentalIconWrapper}>
                            {/* These components need to contain your actual SVG designs */}
                            <IconOrnamentalMenuOpen className={`${styles.ornamentalIcon} ${styles.iconOrnamentalOpen}`} />
                            <IconOrnamentalMenuClose className={`${styles.ornamentalIcon} ${styles.iconOrnamentalClose}`} />
                        </div>
                    </button>
                </div>
            </div>

            {/* Mobile Menu Flyout */}
            <NavLinksMobile
                isMenuOpen={isMenuOpen}
                isActivePath={isActivePath}
                toggleMenu={toggleMenu} // Pass toggleMenu
                handleContactClick={handleContactClick}
                isBlog={isBlog}
            />

        </nav>
    );
};

// export default Nav; // Uncomment if it's the default export