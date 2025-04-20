// src/components/Nav/NavLinksDesktop.tsx
import React from 'react';
import Link from 'next/link';
import ThemeToggle from '../Theme/ThemeToggle'; // Ensure path is correct
// Import the HOVER animation components AND HourglassIcon
import {
    HourglassIcon,
    ServiceHoverAnimation,
    ProjectsHoverAnimation,
    OpenSourceHoverAnimation,
    BlogHoverAnimation
} from '../Icons'; // Adjust path if needed
import styles from './Nav.module.css';

interface NavLinksDesktopProps {
    isBlog: boolean;
    isActivePath: (path: string) => boolean;
    closeMenu: () => void;
    handleContactClick: () => void;
}

const NavLinksDesktop: React.FC<NavLinksDesktopProps> = ({ isBlog, isActivePath, closeMenu, handleContactClick }) => {
    return (
        <nav className={`
            flex items-stretch
            gap-x-1 lg:gap-x-2
            ${styles.navDesktop}
        `}>
            {/* Regular Links */}
            {!isBlog && (
                <>
                    {/* Services Link */}
                    <a href="/#services"
                       className={`${styles.navLink} ${isActivePath('/#services') ? styles.navActive : ''}`}
                       data-nav-id="services"
                       onClick={closeMenu}>
                        {/* Text is always visible */}
                        <span className={styles.linkText} data-text="Services">Services</span>
                        {/* Hover animation SVG - hidden by default via CSS */}
                        <ServiceHoverAnimation className={styles.hoverAnimationSvg} />
                    </a>

                    {/* Projects Link */}
                    <Link href="/projects" legacyBehavior>
                        <a className={`${styles.navLink} ${isActivePath('/projects') ? styles.navActive : ''}`} data-nav-id="projects" onClick={closeMenu}>
                            <span className={styles.linkText} data-text="Projects">Projects</span>
                            <ProjectsHoverAnimation className={styles.hoverAnimationSvg} />
                        </a>
                    </Link>

                    {/* Open Source Link */}
                    <Link href="/open-source" legacyBehavior>
                        <a className={`${styles.navLink} ${isActivePath('/open-source') ? styles.navActive : ''}`} data-nav-id="open-source" onClick={closeMenu}>
                            {/* data-text used for glitch effect */}
                            <span className={styles.linkText} data-text="Open Source">Open Source</span>
                            <OpenSourceHoverAnimation className={styles.hoverAnimationSvg} />
                        </a>
                    </Link>
                </>
            )}

            {/* Blog Link */}
            <Link href="/blog" legacyBehavior>
                <a className={`${styles.navLink} ${styles.navLinkBlog} ${isActivePath('/blog') ? styles.navActive : ''}`} data-nav-id="blog" onClick={closeMenu}>
                    <span className={styles.linkText} data-text="Blog">Blog</span>
                    <BlogHoverAnimation className={styles.hoverAnimationSvg} />
                </a>
            </Link>

            {/* Contact Button */}
            <Link href="/contact" legacyBehavior>
                 <a
                     className={`${styles.contactBtnFinal} ml-1 lg:ml-2`}
                     data-nav-id="contact"
                     onClick={closeMenu}
                 >
                     <span className={styles.contactText}>
                         Reach Us
                         <HourglassIcon className={styles.hourglassSvg} />
                     </span>
                 </a>
            </Link>

            {/* Theme Toggle */}
            <div className={`ml-1 lg:ml-2 flex items-center self-center ${styles.themeToggleNavWrapper}`}>
                <ThemeToggle size="md" />
            </div>
        </nav>
    );
};

export default NavLinksDesktop;