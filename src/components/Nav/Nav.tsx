// src/components/Nav/Nav.tsx
'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link'; // Import Link for the logo
import styles from './Nav.module.css';
import NavLinksDesktop from './NavLinksDesktop';
import NavLinksMobile from './NavLinksMobile';
import NavLogo from './NavLogo'; // Keep using NavLogo component
// import BlogVinesOptimized from '../Blog/BlogVinesOptimized'; // Too minimal
import BlogVines from '../Blog/BlogVines';
// import BlogVines from '../Blog/BlogVines'; // Original heavy version
// Icons handled by CSS

export const Nav = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isScrolled, setIsScrolled] = useState(false);
    const pathname = usePathname();
    const navRef = useRef<HTMLElement>(null); // Ref for the nav element

    const isBlog = typeof pathname === 'string' && (pathname === '/blog' || pathname.startsWith('/blog/'));
    const isBlogPost = isBlog && pathname.split('/').filter(Boolean).length > 2;

    // --- Scroll Detection for Nav Styling ---
    useEffect(() => {
        const handleScroll = () => {
            const scrollY = window.scrollY;
            const threshold = navRef.current ? navRef.current.offsetHeight / 2 : 30;
            setIsScrolled(scrollY > threshold);
        };

        window.addEventListener('scroll', handleScroll, { passive: true });
        handleScroll(); // Initial check

        return () => window.removeEventListener('scroll', handleScroll);
    }, []); // Run only once on mount


    // --- Vine Animation Scroll Logic ---
     useEffect(() => {
        const vineSvg = document.getElementById('blog-vine-svg');
        if (!vineSvg) {
            // console.warn("BlogVine SVG not found.");
            return;
        }
        const handleVineScroll = () => {
            if (!vineSvg) return;
            const scrollableHeight = document.documentElement.scrollHeight - window.innerHeight;
            const currentScroll = window.scrollY;
            const progress = scrollableHeight > 0 ? Math.max(0, Math.min(currentScroll / scrollableHeight, 1)) : 0;
            requestAnimationFrame(() => {
                vineSvg.style.setProperty('--scroll-progress', progress.toString());
            });
        };

        if (!isBlogPost) {
            requestAnimationFrame(() => {
               if (vineSvg) vineSvg.style.setProperty('--scroll-progress', '1');
            });
            return () => {};
        } else {
            window.addEventListener('scroll', handleVineScroll, { passive: true });
            handleVineScroll();
            return () => {
                window.removeEventListener('scroll', handleVineScroll);
            };
        }
    }, [isBlogPost]); // Re-run if isBlogPost changes

    // --- Menu Toggle ---
    const toggleMenu = useCallback(() => setIsMenuOpen(prev => !prev), []);
    const closeMenu = useCallback(() => setIsMenuOpen(false), []);

    // Close mobile menu on path change
    useEffect(() => {
        closeMenu();
    }, [pathname, closeMenu]);

    // --- Active Path Check ---
    const isActivePath = useCallback((path: string): boolean => {
        if (typeof pathname !== 'string') return false;
        if (path.startsWith('/#') && typeof window !== 'undefined') {
            return pathname === '/' && window.location.hash === path.substring(1);
        }
        // Exact match or parent route match (e.g., /blog active on /blog/post)
        return pathname === path || (path !== '/' && pathname.startsWith(path + '/'));
    }, [pathname]);


    // --- Contact Click ---
    const handleContactClick = useCallback(() => {
        // console.log("Contact Button Clicked (Nav)");
        // Logic for contact button if it does more than navigate
        closeMenu(); // Close mobile menu if open
    }, [closeMenu]);


    return (
        <nav ref={navRef} className={`${styles.navContainer} ${isScrolled ? styles.navScrolled : ''}`}>
            {isBlog && <BlogVines />}

            {/* Main container: Uses Tailwind. Adjusted breakpoints (lg) and wrapping */}
            <div className={`
                container mx-auto flex items-center justify-between flex-wrap lg:flex-nowrap
                px-3 sm:px-4 py-1.5 sm:py-2 /* Adjusted padding */
                relative z-10 /* Ensure content is above potential background elements */
            `}>

                {/* Logo Area: Wrapped in Link, independent of mobile button */}
                 <div className="order-1 flex-shrink-1 flex items-center"> {/* Container for logo+tagline */}
                    {/* Render the NavLogo component directly - it handles its own links */}
                    <NavLogo isBlog={isBlog} toggleMenu={closeMenu}/>
                    {/* Tagline can be included here if NavLogo doesn't render it */}
                    {/* <span className={`${styles.tagline} ${isBlog ? styles.taglineBlog : ''} hidden sm:inline-flex items-center`}>
                         (metaverses intersect here)
                     </span> */}
                </div>


                {/* Desktop Links & Actions Area: Hidden below LG */}
                <div className="order-3 lg:order-2 hidden lg:flex flex-grow-0 lg:ml-auto items-stretch">
                     <NavLinksDesktop
                         isBlog={isBlog}
                         isActivePath={isActivePath}
                         closeMenu={closeMenu}
                         handleContactClick={handleContactClick}
                     />
                </div>

                {/* Mobile Menu Button Area: Shows only below LG */}
                <div className="order-2 lg:hidden flex items-center ml-auto pl-2">
                    <button
                        aria-label="Toggle Menu"
                        aria-expanded={isMenuOpen}
                        aria-controls="mobile-menu-content" // Ensure this ID matches NavLinksMobile
                        className={`
                            ${styles.mobileMenuBtn}
                            ${isMenuOpen ? styles.menuOpen : ''}
                            ${isBlog ? styles.blogModeActive : ''} /* Keep if needed */
                        `}
                        onClick={toggleMenu}
                    >
                         {/* Hamburger Icon Structure (CSS handles appearance) */}
                        <div className={styles.hamburgerIconWrapper}>
                             <span className={`${styles.bar} ${styles.bar1}`}></span>
                             <span className={`${styles.bar} ${styles.bar2}`}></span>
                             <span className={`${styles.bar} ${styles.bar3}`}></span>
                        </div>
                    </button>
                </div>

                 {/* Mobile Menu Flyout (Rendered outside the main flex container) */}
                 <NavLinksMobile
                    id="mobile-menu-content" // Added ID here
                    isMenuOpen={isMenuOpen}
                    isActivePath={isActivePath}
                    toggleMenu={toggleMenu} // Pass toggle to allow closing from link click
                    handleContactClick={handleContactClick}
                    isBlog={isBlog}
                />

            </div>
        </nav>
    );
};