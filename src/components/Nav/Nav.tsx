// src/components/Nav/Nav.tsx
'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { usePathname } from 'next/navigation';
import styles from './Nav.module.css';
import NavLinksDesktop from './NavLinksDesktop';
import NavLinksMobile from './NavLinksMobile';
import NavLogo from './NavLogo';
import BlogVines from '../Blog/BlogVines'; // Ensure path is correct
import {
    IconOpenFlourish,
    IconCloseFlourish,
    // HamburgerIcon is implicitly rendered via CSS background/bars
} from '../Icons'; // Adjust path

export const Nav = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isScrolled, setIsScrolled] = useState(false);
    const pathname = usePathname();

    // Check if the current path is a blog page (including base /blog)
    const isBlog = typeof pathname === 'string' && (pathname === '/blog' || pathname.startsWith('/blog/'));
    // Check if it's a specific blog POST page (e.g., /blog/category/slug)
    // Check for more than 2 segments after splitting by '/' and filtering empty strings
    // Example: '/blog/tech/post-1' -> ['', 'blog', 'tech', 'post-1'] -> filter -> ['blog', 'tech', 'post-1'] (length 3)
    const isBlogPost = isBlog && pathname.split('/').filter(Boolean).length > 2;

    // --- Vine Animation Scroll Logic ---
    // --- Vine Animation Scroll Logic ---
    useEffect(() => {
        const vineSvg = document.getElementById('blog-vine-svg');
        if (!vineSvg) {
            console.warn("BlogVine SVG not found."); // Optional: warning if SVG is missing
            return; // Exit if SVG not found
        }

        // Define the scroll handler function *first*
        const handleVineScroll = () => {
            if (!vineSvg) return; // Double check SVG exists inside handler
            const scrollableHeight = document.documentElement.scrollHeight - window.innerHeight;
            const currentScroll = window.scrollY;
            const progress = scrollableHeight > 0 ? Math.max(0, Math.min(currentScroll / scrollableHeight, 1)) : 0;
            // Use requestAnimationFrame for smoother updates
            requestAnimationFrame(() => {
                vineSvg.style.setProperty('--scroll-progress', progress.toString());
            });
        };

        // Logic based on whether it's a blog post page
        if (!isBlogPost) {
            // On non-post blog pages (like /blog list), set vines to fully drawn but static
            requestAnimationFrame(() => { // Ensure style update happens smoothly
               if (vineSvg) vineSvg.style.setProperty('--scroll-progress', '1');
            });
            // **Crucially, return a cleanup function that does nothing IF it's not a blog post,
            // because no listener was added in this case.**
            return () => {}; // No listener to remove here
        } else {
            // Only add scroll listener on specific blog POST pages
            window.addEventListener('scroll', handleVineScroll, { passive: true });
            handleVineScroll(); // Initial check to set position

            // Return the cleanup function to remove the listener when the component unmounts
            // or when isBlogPost becomes false.
            return () => {
                // console.log("Removing vine scroll listener"); // Debugging
                window.removeEventListener('scroll', handleVineScroll);
            };
        }
    });

    // --- Menu Toggle ---
    const toggleMenu = useCallback(() => setIsMenuOpen(prev => !prev), []);
    const closeMenu = useCallback(() => setIsMenuOpen(false), []);

    // --- Active Path Check (More Robust) ---
    const isActivePath = useCallback((path: string): boolean => {
        if (typeof pathname !== 'string') return false;

        // Handle hash links
        if (path.startsWith('/#') && typeof window !== 'undefined') {
            // Check if current path is '/' and hash matches
            return pathname === '/' && window.location.hash === path.substring(1);
        }

        // Handle regular links
        // Exact match
        if (pathname === path) return true;
        // Starts with (for parent routes like /blog active on /blog/post)
        // Ensure it doesn't accidentally match /blog-extra if checking for /blog
        if (path !== '/' && pathname.startsWith(path + '/')) return true;

        return false;
    }, [pathname]);


    // --- Contact Click ---
    // If contact button just navigates, this might not be needed
    // Keep if it triggers a modal or other non-navigation action
    const handleContactClick = useCallback(() => {
        console.log("Contact Button Clicked (Nav)");
        // Add logic here if it does more than navigate (e.g., open modal)
        closeMenu(); // Close mobile menu if open
    }, [closeMenu]);


    return (
        // Use CSS module for base nav styles (sticky, background, etc.)
        <nav className={`${styles.navContainer} ${isScrolled ? styles.navScrolled : ''}`}>
            {/* Render Vines component conditionally */}
            {isBlog && <BlogVines />}

            {/* Noise Overlay? Optional */}
            {/* <div className={styles.noiseOverlay}></div> */}

            {/* Main container: Uses Tailwind for responsive flex layout */}
            <div className={`
                container mx-auto flex items-center justify-between
                lg:flex-nowrap
                px-3 md:px-4 py-1
                gap-y-2
                relative z-10
            `}>
                {/* Logo Area: Takes priority, shrinks minimally */}
                <div className="order-1 flex-shrink-0">
                    <NavLogo
                        isBlog={isBlog}
                        toggleMenu={toggleMenu}
                        />
                    </div>

                {/* Desktop Links & Actions Area: Hidden below md, pushes right on lg+ */}
                {/* Takes remaining space on medium screens before wrapping */}
                <div className="order-3 lg:order-2 hidden md:flex flex-grow justify-end lg:flex-grow-0 lg:ml-auto">
                     <NavLinksDesktop
                         isBlog={isBlog}
                         isActivePath={isActivePath}
                         closeMenu={closeMenu}
                         handleContactClick={handleContactClick} // Pass handler
                     />
                </div>

                {/* Mobile Menu Button Area: Shows only below md, pushes right */}
                <div className="order-2 lg:order-3 flex items-center md:hidden ml-auto pl-2"> {/* ml-auto pushes to right, pl adds buffer */}
                    <button
                        aria-label="Toggle Menu"
                        aria-expanded={isMenuOpen}
                        aria-controls="mobile-menu-content"
                        className={`
                            ${styles.mobileMenuBtn}
                            ${isMenuOpen ? styles.menuOpen : ''}
                            ${isBlog ? styles.blogModeActive : ''}
                        `}
                        onClick={toggleMenu}
                    >
                         {/* Hamburger Icon Container (Always rendered, visibility controlled by CSS) */}
                        <div className={styles.hamburgerIconWrapper}>
                             <span className={`${styles.bar} ${styles.bar1}`}></span>
                             <span className={`${styles.bar} ${styles.bar2}`}></span>
                             <span className={`${styles.bar} ${styles.bar3}`}></span>
                        </div>
                        {/* Flourish Icon Container (Always rendered, visibility controlled by CSS) */}
                        {/* <div className={styles.flourishIconWrapper}>
                             <IconOpenFlourish className={`${styles.flourishIcon} ${styles.iconOpen}`} />
                             <IconCloseFlourish className={`${styles.flourishIcon} ${styles.iconClose}`} />
                        </div> */}
                    </button>
                </div>
            </div>

            {/* Mobile Menu Flyout (Rendered outside the main flex container) */}
            <NavLinksMobile
                isMenuOpen={isMenuOpen}
                isActivePath={isActivePath}
                toggleMenu={closeMenu}
                // closeMenu={closeMenu} // Use closeMenu instead of toggleMenu
                handleContactClick={handleContactClick} // Pass handler
                isBlog={isBlog}
            />

             {/* Optional Nav Bottom Glow */}
            {/* <div className={`${styles.navBottomGlow} ${isScrolled ? styles.navBottomGlowScrolled : ''}`}></div> */}
        </nav>
    );
};

// Default export if this is the main export of the file
// export default Nav;