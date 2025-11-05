// src/components/Nav/NavLinksDesktop.tsx
import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import ThemeToggle from '../Theme/ThemeToggle'; // Standard Toggle
import OrnamentalThemeToggle from '../Theme/OrnamentalThemeToggle'; // Ornate Toggle
import {
    HourglassIcon,
    ServiceHoverAnimation,
    ProjectsHoverAnimation,
    OpenSourceHoverAnimation,
    BlogHoverAnimation
    // Add AboutHoverAnimation etc. if you create specific icons
} from '../Icons'; // Adjust path if needed
import styles from './Nav.module.css';

interface NavLinksDesktopProps {
    isBlog: boolean;
    isActivePath: (path: string) => boolean;
    closeMenu: () => void;
    handleContactClick: () => void;
}

const NavLinksDesktop: React.FC<NavLinksDesktopProps> = ({ isBlog, isActivePath, closeMenu, handleContactClick }) => {
    const pathname = usePathname();
    
    // Hide games button on velvet/looking glass pages
    const shouldShowGames = !pathname?.includes('/velvet');
    
    return (
        <nav className={`
            flex items-stretch
            gap-x-1 xl:gap-x-2
            ${styles.navDesktop}
        `}>
            {/* --- Regular Links (Shown when NOT on a blog page) --- */}
            {!isBlog && (
                <>
                    {/* Services Link */}
                    <a href="/#services"
                       className={`${styles.navLink} ${isActivePath('/#services') ? styles.navActive : ''}`}
                       data-nav-id="services"
                       onClick={closeMenu}>
                        <span className={styles.linkText} data-text="Services">Services</span>
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
                            <span className={styles.linkText} data-text="Open Source">Open Source</span>
                            <OpenSourceHoverAnimation className={styles.hoverAnimationSvg} />
                        </a>
                    </Link>

                    {/* Consider adding /process, /team, /mission links here */}
                </>
            )}

             {/* --- "About" Link (Shown ONLY on blog pages) --- */}
             {/* Note: href and text are based on your provided code */}
             {isBlog && ( // <<< --- ADDED THIS CONDITION
                 <Link href="/blog/tutorials/contribute" legacyBehavior>
                     <a className={`${styles.navLink} ${styles.navLinkBlog} ${isActivePath('/blog/tutorials/contribute') ? styles.navActive : ''}`} data-nav-id="about" onClick={closeMenu}>
                         <span className={styles.linkText} data-text="about">About</span>
                         {/* Add hover animation if desired */}
                     </a>
                 </Link>
             )} {/* // <<< --- ENDED THIS CONDITION */}


            {/* Blog Link (Currently always shown after non-blog links or About link) */}
            {/* If this should *also* only show on blog pages, wrap it like the "About" link */}
            <Link href="/blog" legacyBehavior>
                <a className={`${styles.navLink} ${styles.navLinkBlog} ${isActivePath('/blog') ? styles.navActive : ''}`} data-nav-id="blog" onClick={closeMenu}>
                    <span className={styles.linkText} data-text="Blog">Blog</span>
                    <BlogHoverAnimation className={styles.hoverAnimationSvg} />
                </a>
            </Link>

            {/* Games Button (Conditionally shown) */}
            {shouldShowGames && (
                <Link href="https://games.manic.agency" legacyBehavior>
                    <a className={styles.gamesBtn} data-nav-id="games" onClick={closeMenu} target="_blank" rel="noopener noreferrer">
                        <span>Games</span>
                        <img src="/controller-button.svg" alt="Game Controller" className={styles.gamesSvg} />
                    </a>
                </Link>
            )}

            {/* Contact Button (Always shown) */}
            <Link href="/contact" legacyBehavior>
                 <a
                     className={`${styles.contactBtnFinal} ${isBlog ? styles.blogContact : ''} ml-1 xl:ml-2`}
                     data-nav-id="contact"
                     onClick={closeMenu}
                 >
                     <span className={styles.contactText}>
                         Reach Us
                         <HourglassIcon className={styles.hourglassSvg} />
                     </span>
                 </a>
            </Link>

            {/* Theme Toggle (Always shown) */}
            <div className={`ml-1 xl:ml-2 flex items-center self-center ${styles.themeToggleNavWrapper}`}>
                 {isBlog ? (
                     <OrnamentalThemeToggle size="md" />
                 ) : (
                     <ThemeToggle size="md" />
                 )}
            </div>
        </nav>
    );
};

export default NavLinksDesktop;