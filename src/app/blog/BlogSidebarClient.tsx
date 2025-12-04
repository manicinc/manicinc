// src/app/blog/BlogSidebarClient.tsx
'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import type { TableOfContentsItem } from "@/types/blog";
import { BookOpen, List, X, Hash, Home, Settings2, ChevronsLeft, ChevronsRight, ArrowUp } from 'lucide-react';
import Link from 'next/link';
import {
    IconCloseFlourish, IconOpenFlourish, IconPageTurnNext,
    IconPageTurnPrev, IconOrnateUpArrow, IconOrnateList
} from '@/components/Icons'; // Ensure path is correct
import ScrollToTop from '@/components/ScrollBtns/ScrollToTop';

// --- Helper Functions ---

// Simple slug generation (keep as is or use a library)
const generateSlug = (text: string): string => {
    if (!text) return '';
    return text.toLowerCase().trim().replace(/[^\w\s-]/g, '').replace(/\s+/g, '-').replace(/-+/g, '-');
};

// Convert number to Roman numeral (basic implementation for lower numbers)
const toRoman = (num: number): string => {
    if (num < 1) return '';
    const romanMap: { [key: number]: string } = {
        10: 'X', 9: 'IX', 5: 'V', 4: 'IV', 1: 'I'
    };
    let result = '';
    const sortedKeys = Object.keys(romanMap).map(Number).sort((a, b) => b - a); // Sort keys descending

    for (const key of sortedKeys) {
        while (num >= key) {
            result += romanMap[key];
            num -= key;
        }
    }
    return result;
};


interface Props {
    tableOfContents: TableOfContentsItem[];
    postTitle: string;
}

const TOP_LINK_ID = "post-content-top";

const BlogSidebarClient = React.memo(({ tableOfContents = [], postTitle }: Props) => {
    // Lazy initial state for desktop sidebar
    const [isDesktopSidebarOpen, setIsDesktopSidebarOpen] = useState(() => {
        if (typeof window !== 'undefined') {
            const saved = localStorage.getItem('blogSidebarOpen');
            return saved !== null ? saved === 'true' : true;
        }
        return true;
    });
    const [isMobileTocOpen, setIsMobileTocOpen] = useState(false);
    const [activeHeading, setActiveHeading] = useState<string>(TOP_LINK_ID);
    const [showBackToTop, setShowBackToTop] = useState(false);
    const [showNumbering, setShowNumbering] = useState(() => {
        if (typeof window !== 'undefined') {
            const saved = localStorage.getItem('blogTocNumbering');
            return saved !== null ? saved === 'true' : true;
        }
        return true;
    });
    const sidebarRef = useRef<HTMLElement>(null);
    const tocListRef = useRef<HTMLUListElement>(null);
    const mobileOverlayRef = useRef<HTMLDivElement>(null);

    // --- Effects and Callbacks ---
    const getHeaderOffset = useCallback((): number => { /* ... keep as is ... */
        let offset = 80;
        if (typeof window !== 'undefined') {
            const headerHeightVal = getComputedStyle(document.documentElement).getPropertyValue('--header-height');
            if (headerHeightVal) { offset = parseInt(headerHeightVal, 10) + 20; }
        }
        return offset;
    }, []);
    const headingIdsRef = useRef<string[]>([]);
    useEffect(() => {
        if (typeof window === 'undefined') return;
        let ticking = false;
        const onScroll = () => {
            if (!ticking) {
                window.requestAnimationFrame(() => {
                    setShowBackToTop(window.scrollY > 600);
                    const pageBottom = document.documentElement.scrollHeight - window.innerHeight;
                    if (
                        window.scrollY >= pageBottom - 8 &&
                        headingIdsRef.current.length > 0
                    ) {
                        const lastId = headingIdsRef.current[headingIdsRef.current.length - 1];
                        setActiveHeading(prev => (prev === lastId ? prev : lastId));
                    } else if (window.scrollY < 120) {
                        setActiveHeading(prev => (prev === TOP_LINK_ID ? prev : TOP_LINK_ID));
                    }
                    ticking = false;
                });
                ticking = true;
            }
        };
        onScroll();
        window.addEventListener('scroll', onScroll, { passive: true });
        return () => window.removeEventListener('scroll', onScroll);
    }, []);

    useEffect(() => {
        const contentArea = document.querySelector('.blog-post-container');
        if (!contentArea) return;
        const headingElements = Array.from(
            contentArea.querySelectorAll<HTMLElement>('h2[id], h3[id], h4[id]')
        );
        const topSentinel = document.getElementById(TOP_LINK_ID);

        if (headingElements.length === 0) {
            setActiveHeading(TOP_LINK_ID);
            return;
        }

        headingIdsRef.current = headingElements.map(el => el.id);
        const visibleMap = new Map<string, number>();

        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach(entry => {
                    const target = entry.target as HTMLElement;
                    const id = target.id;
                    if (!id) return;

                    if (entry.isIntersecting) {
                        visibleMap.set(id, target.offsetTop);
                    } else {
                        visibleMap.delete(id);
                    }
                });

                if (visibleMap.size > 0) {
                    const nextId = Array.from(visibleMap.entries())
                        .sort((a, b) => a[1] - b[1])[0][0];
                    setActiveHeading(prev => (prev === nextId ? prev : nextId));
                }
            },
            {
                root: null,
                rootMargin: '-45% 0px -45% 0px',
                threshold: [0, 0.1, 0.5]
            }
        );

        headingElements.forEach(element => observer.observe(element));
        if (topSentinel) {
            observer.observe(topSentinel);
        }

        return () => {
            headingElements.forEach(element => observer.unobserve(element));
            if (topSentinel) {
                observer.unobserve(topSentinel);
            }
            observer.disconnect();
        };
    }, [tableOfContents]);

    const toggleDesktopSidebar = useCallback(() => {
        setIsDesktopSidebarOpen(prev => {
            const newState = !prev;
            if (typeof window !== 'undefined') {
                localStorage.setItem('blogSidebarOpen', String(newState));
            }
            return newState;
        });
    }, []);
    const toggleMobileToc = useCallback(() => { /* ... keep as is ... */
        setIsMobileTocOpen(prev => {
            const nextState = !prev;
            if (typeof document !== 'undefined') { document.body.style.overflow = nextState ? 'hidden' : ''; }
            return nextState;
        });
      }, []);
    useEffect(() => { /* ... desktop sidebar class toggle effect ... */
        const layoutContainer = document.querySelector('.blog-layout-container');
        const sidebarElement = sidebarRef.current;
        if (layoutContainer) { layoutContainer.classList.toggle('desktop-sidebar-closed', !isDesktopSidebarOpen); }
        if (sidebarElement) { sidebarElement.classList.toggle('closed', !isDesktopSidebarOpen); }
      }, [isDesktopSidebarOpen]);
    useEffect(() => { /* ... mobile body scroll cleanup effect ... */
        return () => { if (typeof document !== 'undefined') { document.body.style.overflow = ''; } };
      }, []);
    const scrollToTop = useCallback(() => { /* ... keep as is ... */
        window.scrollTo({ top: 0, behavior: 'smooth' });
        setActiveHeading(TOP_LINK_ID);
        setIsMobileTocOpen(false);
      }, []);
    const scrollToElement = useCallback((slug: string) => { /* ... keep as is ... */
        if (slug === TOP_LINK_ID) { scrollToTop(); return; }
        const element = document.getElementById(slug);
        if (element) {
            const offset = getHeaderOffset();
            const elementTop = element.getBoundingClientRect().top + window.scrollY;
            const scrollToPosition = elementTop - offset;
            window.scrollTo({ top: scrollToPosition, behavior: 'smooth' });
            setActiveHeading(slug);
            setIsMobileTocOpen(false);
        } else { console.warn(`Element with ID "${slug}" not found.`); }
      }, [getHeaderOffset, scrollToTop]);
    const handleTocClick = useCallback((e: React.MouseEvent<HTMLAnchorElement>, slug: string) => { /* ... keep as is ... */ e.preventDefault(); scrollToElement(slug); }, [scrollToElement]);
    const findActiveIndex = useCallback(() => { /* ... keep as is ... */
        if (activeHeading === TOP_LINK_ID) return -1;
        // Find index in the list *excluding* level 1 headings
        return tableOfContents.filter(h => h.level !== 1).findIndex(h => (h.slug || generateSlug(h.text)) === activeHeading);
      }, [activeHeading, tableOfContents]);
    const navigateSection = useCallback((direction: 'next' | 'prev') => { /* ... Adjusted logic uses filtered list ... */
        const filteredToc = tableOfContents.filter(h => h.level !== 1); // Filter out level 1
        const currentIndex = findActiveIndex(); // Index within filtered list
        let nextIndex = -1;

        if (direction === 'next') {
            nextIndex = (currentIndex === -1) ? 0 : currentIndex + 1;
            if (nextIndex >= filteredToc.length) { nextIndex = filteredToc.length - 1; } // Stay on last item
        } else { // 'prev'
            if (currentIndex === 0) { scrollToTop(); return; } // Go to Top if at the first item
            else if (currentIndex > 0) { nextIndex = currentIndex - 1; } // Go to previous item
            else { return; } // Already at Top or invalid index
        }

        if (nextIndex >= 0 && nextIndex < filteredToc.length) {
            const nextHeading = filteredToc[nextIndex];
            if (nextHeading) { const slug = nextHeading.slug || generateSlug(nextHeading.text); if (slug) scrollToElement(slug); }
        }
      }, [findActiveIndex, tableOfContents, scrollToElement, scrollToTop]);
    useEffect(() => { /* ... scroll active TOC item into view effect ... */
        if (activeHeading && tocListRef.current) {
            const activeElement = tocListRef.current.querySelector(`a[href="#${activeHeading}"]`) as HTMLElement;
            if (activeElement) {
                const tocRect = tocListRef.current.getBoundingClientRect();
                const elemRect = activeElement.getBoundingClientRect();
                if (elemRect.top < tocRect.top || elemRect.bottom > tocRect.bottom) {
                    activeElement.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
                }
            }
        }
      }, [activeHeading]);
    const toggleNumbering = useCallback(() => {
        setShowNumbering(prev => {
            const newState = !prev;
            if (typeof window !== 'undefined') {
                localStorage.setItem('blogTocNumbering', String(newState));
            }
            return newState;
        });
    }, []);


    // Memoize filtered TOC to avoid recalculation
    const filteredToc = React.useMemo(
        () => tableOfContents.filter(heading => heading.level !== 1),
        [tableOfContents]
    );

    const minLevel = React.useMemo(
        () => filteredToc.length > 0 ? Math.min(...filteredToc.map(h => h.level)) : 2,
        [filteredToc]
    );

    // Stable reference for TOC structure - only changes when content changes
    const tocStructure = React.useMemo(() => 
        filteredToc.map((heading) => ({
            slug: heading.slug || generateSlug(heading.text),
            text: heading.text,
            level: heading.level,
            relativeLevel: heading.level - minLevel + 1
        })).filter(item => item.slug),
    [filteredToc, minLevel]);

    // Use effect to update active classes via DOM instead of re-rendering
    useEffect(() => {
        if (!tocListRef.current) return;
        
        // Remove all active classes
        const activeItems = tocListRef.current.querySelectorAll('.active');
        activeItems.forEach(item => item.classList.remove('active'));
        
        // Add active class to current heading
        const activeLink = tocListRef.current.querySelector(`a[href="#${activeHeading}"]`);
        if (activeLink) {
            activeLink.classList.add('active');
            activeLink.closest('.toc-item')?.classList.add('active');
        }
    }, [activeHeading]);

    // Render TOC list only when structure changes (not on active heading change)
    const renderTocList = React.useCallback(() => {
        return (
            <ul className={`toc-list ${showNumbering ? 'numbered' : ''}`} ref={tocListRef}>
                {/* Static "Top" Link */}
                <li key="top" className="toc-item level-1 top-link">
                    <a 
                        href={`#${TOP_LINK_ID}`} 
                        className="toc-link top-link"
                        onClick={(e) => handleTocClick(e, TOP_LINK_ID)}
                    >
                        <Home size={16} className="toc-link-icon" aria-hidden="true"/>
                        <span>{postTitle || 'Introduction'}</span>
                    </a>
                </li>

                {/* Dynamic Heading Links */}
                {tocStructure.map((item) => (
                    <li
                        key={item.slug}
                        className={`toc-item level-${item.relativeLevel}`}
                        style={{ '--level-indent': `${(item.level - minLevel) * 18}px` } as React.CSSProperties}
                    >
                        <a 
                            href={`#${item.slug}`} 
                            className="toc-link"
                            onClick={(e) => handleTocClick(e, item.slug)}
                        >
                            <span>{item.text}</span>
                        </a>
                    </li>
                ))}
            </ul>
        );
    }, [tocStructure, handleTocClick, postTitle, showNumbering, minLevel]);

    // --- JSX Structure (Mostly Unchanged) ---
    return (
        <>
            {/* --- Desktop Sidebar --- */}
            <aside ref={sidebarRef} id="blog-sidebar" className={`blog-sidebar mobile-hidden ${isDesktopSidebarOpen ? '' : 'closed'}`} aria-label="Article Index">
                <div className="sidebar-header"> {/* ... toggle button ... */}
                    <button type="button" className="sidebar-toggle-button" onClick={toggleDesktopSidebar} aria-label={isDesktopSidebarOpen ? 'Collapse Index' : 'Expand Index'} aria-expanded={isDesktopSidebarOpen} aria-controls="blog-sidebar" title={isDesktopSidebarOpen ? 'Collapse' : 'Expand'} >
                        <ChevronsLeft className="close-icon"/> <ChevronsRight className="open-icon"/>
                    </button>
                </div>
                <div className="sidebar-content">
                    <div className="toc-navigation"> {/* ... prev/next buttons ... */}
                        <button onClick={() => navigateSection('prev')} aria-label="Previous Section" title="Previous Section"><IconPageTurnPrev /></button>
                        <span className="toc-nav-label">Section</span>
                        <button onClick={() => navigateSection('next')} aria-label="Next Section" title="Next Section"><IconPageTurnNext /></button>
                    </div>
                    {/* Render the updated TOC list */}
                    {tableOfContents.length > 0 ? (
                        <nav aria-label="Article Sections">{renderTocList()}</nav>
                    ) : (
                        <nav aria-label="Article Sections">
                            {renderTocList()} {/* Will render only the Top link */}
                            <p className="toc-empty">No sections found.</p>
                        </nav>
                     )}
                </div>
                <div className="sidebar-footer"> {/* ... footer buttons ... */}
                    <button onClick={scrollToTop} className="sidebar-footer-link" title="Scroll to Top"><IconOrnateUpArrow width={16} height={16} aria-hidden="true"/><span>Scroll to Top</span></button>
                    <button onClick={toggleNumbering} className="sidebar-footer-link numbering-toggle-btn" aria-pressed={showNumbering} title={showNumbering ? "Hide Section Numbers" : "Show Section Numbers"}><Hash size={16} aria-hidden="true"/><span>{showNumbering ? "Hide Numbers" : "Show Numbers"}</span></button>
                    <Link href="/blog" className="sidebar-footer-link" title="Return to Blog Index"><IconOrnateList width={16} height={16} aria-hidden="true"/><span>All Entries</span></Link>
                </div>
            </aside>

            {/* --- Mobile TOC Toggle --- */}
            {tableOfContents.length > 0 && ( // Show if there are any sections at all
                <button type="button" className="mobile-toc-toggle-button" onClick={toggleMobileToc} aria-label="Open Table of Contents" aria-expanded={isMobileTocOpen} aria-controls="mobile-toc-overlay">
                    <BookOpen size={22} />
                </button>
            )}

            {/* --- Mobile TOC Overlay --- */}
            <div ref={mobileOverlayRef} id="mobile-toc-overlay" className={`mobile-toc-overlay ${isMobileTocOpen ? 'visible' : ''}`} role="dialog" aria-modal="true" aria-labelledby="mobile-toc-title" {...(!isMobileTocOpen ? { inert: "true" } : {})}>
                <div className="mobile-toc-header"> {/* ... title and close button ... */}
                    <h2 id="mobile-toc-title" className="mobile-toc-title">Sections</h2>
                    <button onClick={toggleMobileToc} className="mobile-toc-close" aria-label="Close Table of Contents"><X size={24} /></button>
                </div>
                <div className="mobile-toc-content">
                    <div className="toc-navigation mobile-toc-navigation"> {/* ... mobile prev/next ... */}
                        <button onClick={() => navigateSection('prev')} aria-label="Previous Section" title="Previous Section"><IconPageTurnPrev /></button>
                        <span className="toc-nav-label">Section</span>
                        <button onClick={() => navigateSection('next')} aria-label="Next Section" title="Next Section"><IconPageTurnNext /></button>
                        {/* Add collapse button to mobile TOC navigation */}
                        <button onClick={toggleMobileToc} className="mobile-toc-nav-collapse" aria-label="Close Table of Contents" title="Close TOC">
                            <X size={16} />
                        </button>
                    </div>
                    {/* Render the updated TOC list */}
                    <nav aria-label="Article Sections Mobile">{renderTocList()}</nav>
                    <div className="mobile-toc-footer"> {/* ... mobile numbering toggle ... */}
                        <button onClick={toggleNumbering} className="sidebar-footer-link numbering-toggle-btn" aria-pressed={showNumbering} title={showNumbering ? "Hide Section Numbers" : "Show Section Numbers"}><Hash size={16} aria-hidden="true"/><span>{showNumbering ? "Hide Numbers" : "Show Numbers"}</span></button>
                    </div>
                </div>
            </div>

            <ScrollToTop type='blog' scrollToTop={scrollToTop} showBackToTop={showBackToTop}/>
            {/* --- Back to Top Button --- */}

        </>
    );
});

BlogSidebarClient.displayName = 'BlogSidebarClient';
export default BlogSidebarClient;
