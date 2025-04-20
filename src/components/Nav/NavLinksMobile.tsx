// src/components/Nav/NavLinksMobile.tsx
import React from 'react';
import Link from 'next/link';
import ThemeToggle from '../Theme/ThemeToggle';
// Import ALL necessary icons from the updated Icons.tsx
import {
    HourglassIcon,
    ServicesIcon,
    ProjectsIcon,
    OpenSourceIcon,
    BlogIcon
} from './Icons'; // Adjust path if needed
import styles from './Nav.module.css';

interface NavLinksMobileProps {
    isMenuOpen: boolean;
    isActivePath: (path: string) => boolean;
    toggleMenu: () => void;
    handleContactClick: () => void;
    isBlog: boolean;
    children?: React.ReactNode;
}

const NavLinksMobile: React.FC<NavLinksMobileProps> = ({
    isMenuOpen,
    isActivePath,
    toggleMenu,
    handleContactClick,
    isBlog,
    children,
}) => {
    const closeAndNavigate = () => {
        toggleMenu();
    };

    const currentYear = new Date().getFullYear();

    return (
        <div
            id="mobile-menu-content"
            className={`${styles.mobileMenuWrapper} md:hidden ${
                isMenuOpen ? styles.mobileMenuOpen : ''
            }`}
            // Apply inert attribute when closed for accessibility
            {...(isMenuOpen ? {} : { inert: "true", "aria-hidden": "true" })}
        >
            <div className={styles.mobileMenuContent}>
                <div className="flex flex-col px-4 pt-4 pb-2"> {/* Link/Button Container */}
                    {/* Render links with SVG icons */}
                    {!isBlog && (
                        <>
                            <a href="/#services" className={`${styles.mobileNavLink} group ${isActivePath('/#services') ? styles.navActive : ''}`} data-nav-id="services" onClick={closeAndNavigate}>
                                {/* Use Icon Component - Add class for styling */}
                                {/* <ServicesIcon className={styles.mobileNavIcon} /> */}
                                <span>Services</span>
                            </a>
                            <Link href="/projects" legacyBehavior>
                                <a className={`${styles.mobileNavLink} group ${isActivePath('/projects') ? styles.navActive : ''}`} data-nav-id="projects" onClick={closeAndNavigate}>
                                    {/* <ProjectsIcon className={styles.mobileNavIcon} /> */}
                                    <span>Projects</span>
                                </a>
                            </Link>
                            <Link href="/open-source" legacyBehavior>
                                <a className={`${styles.mobileNavLink} group ${isActivePath('/open-source') ? styles.navActive : ''}`} data-nav-id="open-source" onClick={closeAndNavigate}>
                                    {/* <OpenSourceIcon className={styles.mobileNavIcon} /> */}
                                    <span>Open Source</span>
                                </a>
                            </Link>
                        </>
                    )}

                    {/* AboutLink */}
                    <Link href="/blog/tutorials/contribute" legacyBehavior>
                        <a className={`${styles.navLink} ${styles.navLinkBlog} ${isActivePath('/blog') ? styles.navActive : ''}`} data-nav-id="blog" onClick={closeAndNavigate}>
                            <span className={styles.linkText} data-text="about">about</span>
                        </a>
                    </Link>

                    <Link href="/blog" legacyBehavior>
                        <a className={`${styles.mobileNavLink} group ${isActivePath('/blog') ? styles.navActive : ''}`} data-nav-id="blog" onClick={closeAndNavigate}>
                             {/* <BlogIcon className={styles.mobileNavIcon} /> */}
                             <span>Blog</span>
                        </a>
                    </Link>

                    {/* Render Children (e.g., PocketWatch) Here */}
                    {children && <div className="mt-4">{children}</div>}

                    {/* Theme Toggle */}
                    <div className="mt-6 px-2">
                        <ThemeToggle size="md" />
                    </div>

                    {/* Contact Button - Changed to Link */}
                    <Link href="/contact" legacyBehavior>
                        <a
                            onClick={(e) => {
                                // Allow link navigation but also close menu
                                toggleMenu();
                            }}
                            // Apply mobile contact styles + base button styles
                            className={`${styles.contactBtnFinal} ${styles.mobileContact} self-start mt-6 mb-4 group`}
                            data-nav-id="contact"
                        >
                            <span className={`${styles.contactText} inline-flex items-center gap-1.5`}>
                                Reach Us
                                <HourglassIcon className={`${styles.hourglassSvg} inline-block w-[1em] h-[1em] opacity-0 transition-opacity duration-300 group-hover:opacity-100 group-focus-visible:opacity-100`} />
                            </span>
                        </a>
                    </Link>

                </div> {/* End Link/Button Container */}

                <div className={styles.mobileMenuFooter}>
                    [Manic Agency] // metaverses intersect here // &copy; {currentYear}
                </div>
            </div>
        </div>
    );
};

export default NavLinksMobile;
