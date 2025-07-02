// src/components/Nav/NavLinksMobile.tsx
import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import ThemeToggle from '../Theme/ThemeToggle';
import { HourglassIcon } from './Icons'; // Assuming Icons.tsx is in the same dir or adjust path
import styles from './Nav.module.css';

interface NavLinksMobileProps {
    id: string; // Add id prop to match aria-controls
    isMenuOpen: boolean;
    isActivePath: (path: string) => boolean;
    toggleMenu: () => void; // Use toggleMenu to close on link click
    handleContactClick: () => void; // Keep if needed
    isBlog: boolean;
    children?: React.ReactNode; // Keep children if you pass anything else
}

const NavLinksMobile: React.FC<NavLinksMobileProps> = ({
    id, // Receive id
    isMenuOpen,
    isActivePath,
    toggleMenu, // Receive toggleMenu
    handleContactClick, // Receive handleContactClick
    isBlog,
    children,
}) => {
    // Function to close menu when a link is clicked
    const closeAndNavigate = () => {
        toggleMenu(); // Call the toggle function to close the menu
        // Navigation is handled by the Link/a component itself
    };

    const currentYear = new Date().getFullYear();
    const pathname = usePathname();
    
    // Hide games button on velvet/looking glass pages
    const shouldShowGames = !pathname?.includes('/velvet');

    return (
        <div
            id={id} // Use the id prop here
            className={`${styles.mobileMenuWrapper} lg:hidden ${ // Changed breakpoint to lg
                isMenuOpen ? styles.mobileMenuOpen : ''
            }`}
            // Apply inert attribute when closed for accessibility
            {...(isMenuOpen ? {} : { inert: "", "aria-hidden": "true" })}
        >
            {/* Inner container for padding and scrolling */}
            <div className={styles.mobileMenuContent}>
                {/* Link/Button Container */}
                 <div className="flex flex-col py-2">
                    {/* --- Standard Links (Not on Blog Pages) --- */}
                    {!isBlog && (
                        <>
                            <a href="/#services"
                               className={`${styles.mobileNavLink} ${isActivePath('/#services') ? styles.navActive : ''}`}
                               data-nav-id="services"
                               onClick={closeAndNavigate}>
                                <span>Services</span>
                            </a>
                            <Link href="/projects" legacyBehavior>
                                <a className={`${styles.mobileNavLink} ${isActivePath('/projects') ? styles.navActive : ''}`}
                                   data-nav-id="projects"
                                   onClick={closeAndNavigate}>
                                    <span>Projects</span>
                                </a>
                            </Link>
                            <Link href="/open-source" legacyBehavior>
                                <a className={`${styles.mobileNavLink} ${isActivePath('/open-source') ? styles.navActive : ''}`}
                                   data-nav-id="open-source"
                                   onClick={closeAndNavigate}>
                                    <span>Open Source</span>
                                </a>
                            </Link>
                        </>
                    )}

                    {/* --- ABOUT LINK REMOVED as requested --- */}

                    {/* --- Blog Link (Always Shown) --- */}
                    <Link href="/blog" legacyBehavior>
                        <a className={`${styles.mobileNavLink} ${isActivePath('/blog') ? styles.navActive : ''}`}
                           data-nav-id="blog"
                           onClick={closeAndNavigate}>
                             <span>Blog</span>
                        </a>
                    </Link>

                    {/* --- Games Link (Conditionally Shown) --- */}
                    {shouldShowGames && (
                        <Link href="https://games.manic.agency" legacyBehavior>
                            <a className={`${styles.gamesBtn} ${styles.mobileGames}`}
                               data-nav-id="games"
                               onClick={closeAndNavigate}
                               target="_blank" 
                               rel="noopener noreferrer">
                                 <span>Games</span>
                                 <img src="/controller-button.svg" alt="Game Controller" className={styles.gamesSvg} />
                            </a>
                        </Link>
                    )}

                    {/* Contact Button - Using Link */}
                    <Link href="/contact" legacyBehavior>
                        <a
                            onClick={closeAndNavigate} // Close menu on click
                            className={`${styles.contactBtnFinal} ${styles.mobileContact}`}
                            data-nav-id="contact"
                        >
                            <span className={styles.contactText}>
                                Reach Us
                                <HourglassIcon className={`${styles.hourglassSvg} inline-block w-[1em] h-[1em]`} />
                            </span>
                        </a>
                    </Link>

                    {/* Render Children Here if needed */}
                    {children && <div className="mt-4 px-4">{children}</div>}

                    {/* Theme Toggle */}
                    <div className="mobile-nav-theme-toggle">
                        <ThemeToggle size="lg" />
                    </div>
                </div>

                {/* Footer */}
                <div className={styles.mobileMenuFooter}>
                    <p className={styles.footerText}>
                        © {currentYear} Manic Agency. 
                        <br />
                        <span className={styles.footerTagline}>
                            metaverses intersect here
                        </span>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default NavLinksMobile;