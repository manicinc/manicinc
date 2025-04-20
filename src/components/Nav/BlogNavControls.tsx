// src/components/Nav/BlogNavControls.tsx
'use client';

import React, { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import Link from 'next/link';
// Use local Icons component if defined in same folder, otherwise adjust path
import { CustomLookingGlassIcon } from './Icons';
// Assume ThemeToggle and ShareButtonsClient are outside this Nav directory
import ThemeToggle from '../Theme/ThemeToggle';
import ShareButtons from '../ShareButtonsClient';
// Other imports
import { AsciiArtPlaceholder } from '../../lib/asciiPlaceholders'; // Adjust path
import {
    ChevronDown, ChevronUp, ZoomIn, ZoomOut, Share2, Bookmark, BookmarkCheck, Contrast,
    Clock, Calendar, User, Tag as TagIcon, List, Edit3, FolderOpen, Info, X as CloseIcon, Glasses
} from 'lucide-react';
import { TableOfContentsItem } from '@/types/blog'; // Adjust path
import { formatDate } from '@/util/formatDate';

// ========================================================================== //
// --- Interfaces (Defined within this file) ---                            //
// ========================================================================== //
interface BlogNavControlsProps {
    isPostPage: boolean; // True for single post, false for list/category/tag pages
    title?: string; // Post title OR List title (e.g., "Category: Tutorials")
    author?: string; // Post author
    date?: string; // Post date
    readingTime?: number; // Post reading time
    wordCount?: number; // Post word count
    tags?: string[]; // Post tags
    category?: string; // Post category
    tableOfContents?: TableOfContentsItem[]; // Post TOC
    postUrl?: string; // Full URL for sharing (post only)
    excerpt?: string; // Post excerpt for preview
    listTitle?: string; // Title for list pages (e.g., "Blog Index")
    listSubtitle?: string; // Subtitle for list pages
}

interface BlogNavTocProps {
    items: TableOfContentsItem[];
    onTocClick: (e: React.MouseEvent<HTMLAnchorElement>, slug: string) => void;
}

interface ShareDropdownProps {
    title: string;
    url: string;
    onClose: () => void;
}

// ========================================================================== //
// --- Helper Functions (Defined within this file) ---                      //
// ========================================================================== //


const generateSlug = (text: string): string => {
    if (!text) return '';
    return text.toLowerCase().trim().replace(/[^\w\s-]/g, '').replace(/\s+/g, '-').replace(/-+/g, '-');
};


// ========================================================================== //
// --- Sub Components (Defined within this file) ---                        //
// ========================================================================== //

// --- Table of Contents Sub-Component ---
const BlogNavToc: React.FC<BlogNavTocProps> = React.memo(({ items, onTocClick }) => {
    if (!Array.isArray(items) || items.length === 0) { return null; }
    return (
        <nav aria-label="Table of Contents" className="blog-nav-toc">
            <ul className="toc-nav-list">
                {items.map((item, index) => {
                    const slug = item.slug || generateSlug(item.text) || `toc-item-${index}`;
                    if (!item.text) return null;
                    return (
                        <li key={slug} className={`toc-nav-item level-${item.level || 1}`}>
                            <a href={`#${slug}`} onClick={(e) => onTocClick(e, slug)} title={`Jump to section: ${item.text}`}> {item.text} </a>
                        </li> ); })}
            </ul>
        </nav> ); });
BlogNavToc.displayName = 'BlogNavToc';

// --- Share Dropdown Sub-Component ---
const ShareDropdown: React.FC<ShareDropdownProps> = React.memo(({ title, url, onClose }) => {
    const dropdownRef = useRef<HTMLDivElement>(null);
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => { if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) { onClose(); } };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [onClose]);
    return ( <div ref={dropdownRef} className="share-dropdown"> <ShareButtons title={title} url={url} /> </div> ); });
ShareDropdown.displayName = 'ShareDropdown';

// --- Animated Background SVG Component ---
const BackgroundArtSVG = React.memo(() => {
    const config = useMemo(() => ({
        lines: 18, circles: 7, turbulenceSeed: Math.random() * 100,
        turbulenceFreq: (0.001 + Math.random() * 0.004).toFixed(4),
        warpScale: (1.5 + Math.random() * 3).toFixed(1),
    }), []);

    const elements = useMemo(() => {
        const items: JSX.Element[] = [];
        for (let i = 0; i < config.lines; i++) {
            const dashArray = `${(Math.random() * 15 + 5).toFixed(0)} ${(Math.random() * 10 + 5).toFixed(0)}`;
            items.push( <line key={`l-${i}`} x1={`${Math.random() * 110 - 5}%`} y1={`${Math.random() * 110 - 5}%`} x2={`${Math.random() * 110 - 5}%`} y2={`${Math.random() * 110 - 5}%`} strokeWidth={(Math.random() * 0.5 + 0.1).toFixed(2)} strokeDasharray={dashArray} className="bg-svg-line" style={{ ['--anim-duration' as any]: `${(Math.random() * 15 + 12).toFixed(1)}s`, ['--anim-delay' as any]: `-${(Math.random() * 10).toFixed(1)}s`, ['--stroke-dasharray' as any]: dashArray, } as React.CSSProperties}/> );
        }
        for (let i = 0; i < config.circles; i++) {
             items.push( <circle key={`c-${i}`} cx={`${Math.random() * 100}%`} cy={`${Math.random() * 100}%`} r={`${(Math.random() * 1.5 + 0.5).toFixed(1)}%`} strokeWidth={(Math.random() * 0.4 + 0.1).toFixed(2)} className="bg-svg-circle" style={{ ['--anim-duration' as any]: `${(Math.random() * 12 + 8).toFixed(1)}s`, ['--anim-delay' as any]: `-${(Math.random() * 8).toFixed(1)}s`, } as React.CSSProperties}/> );
        }
        return items;
    }, [config]);

    return (
        <svg width="100%" height="100%" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg" className="blog-nav-bg-svg">
             <defs>
                 <filter id="bgGlowSubtle" x="-50%" y="-50%" width="200%" height="200%"> <feGaussianBlur stdDeviation="0.8" result="blur" /> </filter>
                 <filter id="bgTurbulence" x="-20%" y="-20%" width="140%" height="140%"> <feTurbulence type="fractalNoise" baseFrequency={config.turbulenceFreq} numOctaves="2" seed={config.turbulenceSeed} result="warp"/> <feDisplacementMap in="SourceGraphic" in2="warp" scale={config.warpScale} xChannelSelector="R" yChannelSelector="G"/> </filter>
                 <linearGradient id="bgLineGradient" gradientTransform="rotate(45)"> <stop offset="0%" stopColor="var(--accent-primary)" stopOpacity="0.4" /> <stop offset="30%" stopColor="var(--accent-highlight)" stopOpacity="0.2" /> <stop offset="70%" stopColor="var(--accent-secondary)" stopOpacity="0.2" /> <stop offset="100%" stopColor="var(--brand-cyan)" stopOpacity="0.4" /> </linearGradient>
                 <radialGradient id="bgCircleGradient"> <stop offset="0%" stopColor="var(--accent-highlight)" stopOpacity="0.5"/> <stop offset="100%" stopColor="var(--accent-highlight)" stopOpacity="0"/> </radialGradient>
             </defs>
             <g stroke="url(#bgLineGradient)" filter="url(#bgTurbulence) url(#bgGlowSubtle)">
                 {elements}
             </g>
        </svg> ); });
BackgroundArtSVG.displayName = 'BackgroundArtSVG';

// --- High Contrast Vars ---
const originalCssValues: { [key: string]: string | null } = {}; // Store original values
const highContrastValues: { [key: string]: string } = {
    '--bg-primary': '#000000', '--bg-secondary': '#0a0a0a', '--bg-tertiary': '#1a1a1a',
    '--text-primary': '#ffffff', '--text-secondary': '#f0f0f0', '--text-muted': '#cccccc',
    '--accent-primary': '#ffff00', '--accent-secondary': '#00ffff', '--accent-highlight': '#ff00ff',
    '--accent-alert': '#ff8c00',
    '--blog-header-bg': '#000000', '--blog-header-border': '#ffff00', '--shadow-color': 'rgba(255, 255, 0, 0.2)',
    '--toc-bg': '#0a0a0a', '--toc-border': '#ffff00', '--toc-link-hover-bg': 'rgba(255, 255, 0, 0.1)',
    // Add specific overrides for other elements as needed
};


// ========================================================================== //
// --- Main BlogNavControls Component ---                                   //
// ========================================================================== //
const BlogNavControls: React.FC<BlogNavControlsProps> = ({
   isPostPage, title, author, date, readingTime = 0, wordCount,
   tags, category, tableOfContents = [], postUrl = '', excerpt = '',
   listTitle, listSubtitle
}) => {
  // --- State & Refs ---
  const [mounted, setMounted] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMetadataVisible, setIsMetadataVisible] = useState(false);
  const [isTocVisible, setIsTocVisible] = useState(false);
  const [zoomLevel, setZoomLevel] = useState(100);
  const [isHighContrast, setIsHighContrast] = useState(false);
  const [isShareVisible, setIsShareVisible] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [isReadingMode, setIsReadingMode] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(readingTime);
  const controlsRef = useRef<HTMLDivElement>(null);
  const shareButtonRef = useRef<HTMLButtonElement>(null);

   // --- Effects ---
   useEffect(() => { setMounted(true); setIsMetadataVisible(window.innerWidth >= 1024); }, []); // Initial mount and metadata visibility

   useEffect(() => { // Scroll Listener
     if (!isPostPage) return; // Only run on post pages
     const handleScroll = () => {
         const threshold = 15;
         const currentScrollY = window.scrollY;
         setIsScrolled(currentScrollY > threshold);

         const contentElement = document.querySelector('.post-content') as HTMLElement;
         const docElement = document.documentElement;
         if (!contentElement || !docElement) return;

         const windowHeight = window.innerHeight;
         // Calculate scroll height based on the taller of content or full document
         const contentHeight = contentElement.scrollHeight + contentElement.offsetTop;
         const docScrollHeight = docElement.scrollHeight;
         const scrollableHeight = Math.max(contentHeight, docScrollHeight) - windowHeight;

         if (scrollableHeight <= 0) { // Avoid division by zero/negative
             setTimeRemaining(readingTime);
             return;
         }
         const progress = Math.min(100, Math.max(0, (currentScrollY / scrollableHeight) * 100));
         const remaining = readingTime > 0 ? Math.max(0, Math.round(readingTime * (1 - progress / 100))) : 0;
         setTimeRemaining(Math.min(remaining, readingTime));
     };
     window.addEventListener('scroll', handleScroll, { passive: true });
     handleScroll(); // Initial check
     return () => window.removeEventListener('scroll', handleScroll);
   }, [isPostPage, readingTime]);

   useEffect(() => { // Zoom CSS Variable
      if (!isPostPage) return;
      const targetElement = document.querySelector('.post-content') || document.documentElement;
      (targetElement as HTMLElement).style.setProperty('--post-font-zoom', `${zoomLevel / 100}`);
   }, [zoomLevel, isPostPage]);

   useEffect(() => { // High Contrast Toggle
     const root = document.documentElement;
     const applyHighContrast = () => {
        Object.keys(highContrastValues).forEach(key => {
           if (!originalCssValues.hasOwnProperty(key) || originalCssValues[key] === null) {
              originalCssValues[key] = getComputedStyle(root).getPropertyValue(key).trim();
           }
           root.style.setProperty(key, highContrastValues[key]); });
        root.classList.add('high-contrast-active'); };
     const removeHighContrast = () => {
        Object.keys(highContrastValues).forEach(key => {
           if (originalCssValues[key] !== null) {
              root.style.setProperty(key, originalCssValues[key]!);
              originalCssValues[key] = null; } else { root.style.removeProperty(key); } });
        root.classList.remove('high-contrast-active'); };
     if (isHighContrast) { applyHighContrast(); } else { removeHighContrast(); }
   }, [isHighContrast]);

   useEffect(() => { // Reading Mode Class
       const bodyClass = 'reading-mode-active';
       if (isReadingMode) { document.body.classList.add(bodyClass); }
       else { document.body.classList.remove(bodyClass); }
       return () => document.body.classList.remove(bodyClass);
   }, [isReadingMode]);

  // --- Event Handlers ---
   const toggleMetadata = useCallback(() => setIsMetadataVisible(prev => !prev), []);
   const toggleToc = useCallback(() => setIsTocVisible(prev => !prev), []);
   const toggleShare = useCallback(() => setIsShareVisible(prev => !prev), []);
   const toggleBookmark = useCallback(() => setIsBookmarked(prev => !prev), []);
   const toggleHighContrast = useCallback(() => setIsHighContrast(prev => !prev), []);
   const toggleReadingMode = useCallback(() => setIsReadingMode(prev => !prev), []);
   const handleZoomIn = useCallback(() => setZoomLevel(prev => Math.min(prev + 10, 180)), []);
   const handleZoomOut = useCallback(() => setZoomLevel(prev => Math.max(prev - 10, 70)), []);
   const handleTocClick = useCallback((e: React.MouseEvent<HTMLAnchorElement>, slug: string) => {
       e.preventDefault();
        const element = document.getElementById(slug);
        if (element) {
            const headerHeight = controlsRef.current?.offsetHeight ?? 60;
            const elementPosition = element.getBoundingClientRect().top + window.scrollY;
            const offsetPosition = elementPosition - headerHeight - 30; // More offset
            window.scrollTo({ top: offsetPosition, behavior: 'smooth' });
            if (window.innerWidth < 1024) { setIsTocVisible(false); }
            setIsShareVisible(false);
        }
   }, []);

  // --- Memoized Values ---
   const formattedDate = useMemo(() => formatDate(date), [date]);
   const truncatedExcerpt = useMemo(() => {
       if (!excerpt) return null;
       const maxLength = 115;
       return excerpt.length > maxLength ? excerpt.substring(0, maxLength).replace(/\s+\S*$/, '…') : excerpt;
   }, [excerpt]);

  // --- Dynamic Classes ---
   const viewClass = isPostPage ? 'post-view' : 'list-view';
   const scrollClass = isScrolled ? 'scrolled-state' : 'top-state';
   const mountedClass = mounted ? 'mounted' : '';

  // Determine titles/subtitles
  const displayTitle = isPostPage ? title : listTitle;
  const displaySubtitle = isPostPage ? truncatedExcerpt : listSubtitle;

  return (
    <div ref={controlsRef} className={`blog-nav-controls ${viewClass} ${scrollClass} ${mountedClass}`}>
        {/* SVG Filters */}
        <svg width="0" height="0" style={{position: 'absolute'}}>
          <defs>
             <filter id="lookingGlassWarpV2" x="-40%" y="-40%" width="180%" height="180%" colorInterpolationFilters="sRGB"> <feTurbulence type="turbulence" baseFrequency="0.005 0.02" numOctaves="4" seed="30" stitchTiles="stitch" result="turbulence"/> <feGaussianBlur in="turbulence" stdDeviation="0.5" result="turbulenceBlur"/> <feDisplacementMap in="SourceGraphic" in2="turbulenceBlur" scale="12" xChannelSelector="R" yChannelSelector="G" result="distort"/> <feComponentTransfer in="distort" result="contrast"> <feFuncR type="gamma" exponent="1.2"/> <feFuncG type="gamma" exponent="1.2"/> <feFuncB type="gamma" exponent="1.2"/> </feComponentTransfer> <feColorMatrix in="contrast" type="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 1.5 -0.1" result="aberration"/> <feMerge> <feMergeNode in="aberration"/> </feMerge> </filter>
             <filter id="bgTurbulence" x="-20%" y="-20%" width="140%" height="140%"> <feTurbulence type="fractalNoise" baseFrequency="0.003" numOctaves="2" seed="50" result="warp"/> <feDisplacementMap in="SourceGraphic" in2="warp" scale="2" xChannelSelector="R" yChannelSelector="G"/> </filter>
             <filter id="bgGlowSubtle" x="-50%" y="-50%" width="200%" height="200%"> <feGaussianBlur stdDeviation="0.8" result="blur" /> </filter>
          </defs>
        </svg>

      {/* Exit Reading Mode Button - Always visible when isReadingMode is true */}
      {isReadingMode && ( <button className="exit-reading-mode-btn" onClick={toggleReadingMode} title="Exit Reading Mode" aria-label="Exit Reading Mode"> <CloseIcon size={20} /> </button> )}

      {/* Animated Background */}
      <div className="header-background-graphic" aria-hidden="true"> <BackgroundArtSVG /> </div>

      {/* === TOP BAR AREA === */}
      <div className="blog-nav-top-bar">
         {/* Logo (The Looking Glass) */}
         <Link href="/blog" legacyBehavior>
             <a className="blog-nav-logo-link" aria-label="Blog Home">
                 {/* LOGO IS HERE */}
                 <CustomLookingGlassIcon size={36} className="blog-nav-logo-icon looking-glass-logo" />
             </a>
         </Link>

         {/* Scrolled State Info */}
         {isPostPage && (
             <div className="scrolled-info">
                 <h2 className="scrolled-title" title={title ?? undefined}>{title}</h2>
                 {readingTime > 0 && ( <span className="time-remaining meta-item" title={`${timeRemaining} min remaining`}> <Clock size={13} className="icon" /> {timeRemaining}min </span> )}
             </div>
         )}

         {/* Actions Container */}
         <div className="blog-nav-actions">
            {/* --- Action Buttons --- */}
            {/* Reading Mode */}
            {isPostPage && ( <button className={`blog-nav-action-btn reading-mode-toggle ${isReadingMode ? 'active' : ''}`} title={isReadingMode ? "Exit Reading Mode" : "Enter Reading Mode"} onClick={toggleReadingMode}> <Glasses size={16} /> </button> )}
            {/* Zoom */}
            {isPostPage && ( <> <button className="blog-nav-action-btn" title="Zoom Out" onClick={handleZoomOut} disabled={zoomLevel <= 70}><ZoomOut size={16} /></button> <span className="zoom-level-indicator">{zoomLevel}%</span> <button className="blog-nav-action-btn" title="Zoom In" onClick={handleZoomIn} disabled={zoomLevel >= 180}><ZoomIn size={16} /></button> </>)}
             {/* Bookmark */}
            {isPostPage && (<button className={`blog-nav-action-btn ${isBookmarked ? 'bookmarked' : ''}`} title={isBookmarked ? "Remove Bookmark" : "Bookmark"} onClick={toggleBookmark}> {isBookmarked ? <BookmarkCheck size={16} /> : <Bookmark size={16} />} </button> )}
            {/* Share */}
            {isPostPage && (<div className="share-action-wrapper"> <button ref={shareButtonRef} className="blog-nav-action-btn" title="Share" onClick={toggleShare} aria-haspopup="true" aria-expanded={isShareVisible}> <Share2 size={16} /> </button> {isShareVisible && title && postUrl && ( <ShareDropdown title={title} url={postUrl} onClose={() => setIsShareVisible(false)} /> )} </div> )}
            {/* Contrast */}
            <button className={`blog-nav-action-btn ${isHighContrast ? 'active' : ''}`} title={isHighContrast ? "Disable High Contrast" : "Enable High Contrast"} onClick={toggleHighContrast}> <Contrast size={16} /> </button>
            {/* Theme */}
            <div className="theme-toggle-wrapper"> <ThemeToggle size="sm" /> </div>
            {/* --- Mobile Only Toggles --- */}
            {isPostPage && tableOfContents.length > 0 && ( <button className="blog-nav-action-btn toc-toggle-btn lg:hidden" onClick={toggleToc} aria-expanded={isTocVisible} aria-controls="blog-nav-toc-content" title="Toggle Table of Contents"><List size={18} /></button> )}
            {isPostPage && ( <button className="blog-nav-action-btn metadata-toggle-btn lg:hidden" onClick={toggleMetadata} aria-expanded={isMetadataVisible} aria-controls="blog-metadata-content" title="Toggle Post Details">{isMetadataVisible ? <ChevronUp size={18} /> : <Info size={16} />}</button> )}
         </div>
      </div>

      {/* === CONDITIONAL CONTENT AREA === */}
      <div className="blog-nav-content-area">
         {isPostPage ? (
             // --- POST PAGE ---
            <>
              {/* Top State (Preview) */}
              <div className="post-header-top-state">
                  <div className="metadata-graphic-area" data-category={category?.toLowerCase() || 'default'}>
                      <FolderOpen size={24} opacity={0.7}/> {/* Larger Icon */}
                  </div>
                  <div className="top-state-meta">
                    <h2 className="top-state-title-preview" title={displayTitle ?? undefined}>{displayTitle}</h2>
                    {displaySubtitle && <p className="top-state-excerpt">{displaySubtitle}</p>}
                  </div>
              </div>

              {/* Full Metadata */}
              <div id="blog-metadata-content" className={`blog-nav-metadata ${isMetadataVisible ? 'metadata-visible' : ''}`}>
                  <div className="metadata-content-wrapper">
                      <h1 className="metadata-title">{displayTitle}</h1>
                      <div className="metadata-details-flex">
                         <div className="metadata-main-details">
                            {author && <span className="meta-item author"><User size={14} className="icon" /> {author}</span>}
                            {date && <span className="meta-item date"><Calendar size={14} className="icon" /> {formattedDate}</span>}
                         </div>
                         <div className="metadata-read-stats">
                            {readingTime > 0 && <span className="meta-item reading-time"><Clock size={14} className="icon" /> {readingTime} min read</span>}
                            {wordCount && <span className="meta-item word-count"><Edit3 size={14} className="icon" /> {wordCount.toLocaleString()} words</span>}
                         </div>
                      </div>
                      {(tags && tags.length > 0 || category) && (
                        <div className="metadata-tags-categories">
                           {category && <Link href={`/blog/category/${category.toLowerCase()}`} legacyBehavior><a className="meta-category"><FolderOpen size={13} className="icon" /> {category}</a></Link>}
                           {tags && tags.map(tag => <Link key={tag} href={`/blog?tags=${tag.toLowerCase()}`} legacyBehavior><a className="meta-tag"><TagIcon size={13} className="icon" /> {tag}</a></Link>)}
                        </div>
                      )}
                  </div>
              </div>

              {/* Mobile TOC Area */}
              <div id="blog-nav-toc-content" className={`blog-nav-toc-wrapper ${isTocVisible ? 'toc-visible' : ''} ${tableOfContents.length > 0 ? 'has-toc' : ''}`}>
                   <div className="toc-header"> <h3 className="toc-nav-title"><List size={16} className="icon" /> Outline</h3> <button className="toc-close-btn" onClick={toggleToc} aria-label="Close Table of Contents"><CloseIcon size={18}/></button> </div>
                   <BlogNavToc items={tableOfContents} onTocClick={handleTocClick} />
              </div>
            </>
         ) : (
             // --- LIST PAGE (Index, Category, Tag) ---
            <div className="blog-intro-header">
                <div className="intro-graphic-area"><List size={56} className="intro-list-icon"/></div>
                <div className="intro-content-wrapper">
                    <h1 className="intro-title">{displayTitle || "Chronicles from the Looking Glass"}</h1> {/* Better Default */}
                    {displaySubtitle && <p className="intro-subtitle">{displaySubtitle}</p>}
                </div>
            </div>
         )}
      </div>

      {/* --- STYLES --- */}
      <style jsx>{`
        /* ========================================================================== */
        /* Blog Nav Controls - Base & Variables                                     */
        /* ========================================================================== */
        /* ... Keep V5 Base Styles ... */

        /* ========================================================================== */
        /* Scroll States & Background                                               */
        /* ========================================================================== */
        /* ... Keep V5 Scroll & Background Styles ... */

        /* ========================================================================== */
        /* Top Bar & Logo Styling (VISIBILITY FIX)                                  */
        /* ========================================================================== */
        .blog-nav-top-bar {
             display: flex; justify-content: space-between; align-items: center;
             padding: 0.3rem 1.5rem; min-height: 54px; /* Slightly Taller */
             width: 100%; max-width: var(--max-content-width, 1400px); /* Wider */
             margin: 0 auto; position: relative; z-index: 2;
             border-bottom: 1px solid rgba(var(--text-muted), 0.15); /* Darker internal border */
        }
        .blog-nav-logo-link {
             display: block; padding: 0.1rem; border-radius: 50%;
             transition: transform 0.4s ease, filter 0.3s ease; will-change: transform, filter;
             z-index: 10; position: relative; width: 38px; height: 38px; /* Slightly Larger */
             flex-shrink: 0; /* Prevent shrinking */
        }
        .blog-nav-logo-link:hover { /* Keep hover */ }
        /* Ensure the icon itself is visible and fills the link */
        .blog-nav-logo-icon.looking-glass-logo {
             display: block !important; width: 100% !important; height: 100% !important;
             visibility: visible !important; opacity: 1 !important;
             /* Keep other styles from V5 */
             color: var(--accent-secondary); filter: drop-shadow(0 2px 12px rgba(var(--accent-secondary-rgb), 0.7)) url(#lookingGlassWarpV2) brightness(1.1);
             animation: lookingGlassWobble 6s infinite ease-in-out;
             will-change: filter, color, transform; transform-origin: center; cursor: pointer;
        }
        @keyframes lookingGlassWobble { /* Keep V4 */ }

        /* --- Scrolled Info --- */
        .scrolled-info {
            /* Keep V5 */
            display: flex; align-items: center; gap: 0.8rem;
            position: absolute; left: 50%; transform: translateX(-50%); top: 50%; transform: translateY(-50%);
            opacity: 0; transition: opacity 0.4s ease 0.1s;
            pointer-events: none; text-align: center; white-space: nowrap;
            max-width: 50%; padding: 0 1rem; z-index: 1;
        }
        .blog-nav-controls.scrolled-state .scrolled-info { opacity: 1; pointer-events: auto; }
        .scrolled-title { /* Keep V5 */ }
        .time-remaining { /* Keep V5 */ }

        /* --- Actions --- */
        .blog-nav-actions { /* Keep V5 */ }
        .blog-nav-action-btn { /* Keep V5 */ }
        /* Keep all V5 action button states */
        /* Keep V5 share dropdown styles */
        /* Keep V5 theme toggle wrapper */
        /* Keep V5 mobile toggle visibility */

        /* ========================================================================== */
        /* Content Area & Layout (Keep V5 Revamp)                                   */
        /* ========================================================================== */
        .blog-nav-content-area { /* Keep V5 */ }
        /* --- Post: Top State (Preview) --- */
        .post-header-top-state { /* Keep V5 */ }
        .metadata-graphic-area { /* Keep V5 */ }
        .top-state-meta { /* Keep V5 */ }
        .top-state-title-preview { /* Keep V5 */ }
        .top-state-excerpt { /* Keep V5 */ }
        /* --- Post: Full Metadata --- */
        .blog-nav-metadata { /* Keep V5 */ }
        .metadata-content-wrapper { /* Keep V5 */ }
        .metadata-title { /* Keep V5 */ }
        .metadata-details-flex { /* Keep V5 */ }
        .metadata-main-details, .metadata-read-stats { /* Keep V5 */ }
        .meta-item { /* Keep V5 */ }
        .meta-item .icon { /* Keep V5 */ }
        .metadata-tags-categories { /* Keep V5 */ }
        .meta-category, .meta-tag { /* Keep V5 */ }
        .meta-category:hover, .meta-tag:hover { /* Keep V5 */ }
        .meta-category .icon, .meta-tag .icon { /* Keep V5 */ }

        /* ========================================================================== */
        /* Mobile TOC Styling (Keep V5 Refinements)                                 */
        /* ========================================================================== */
        .blog-nav-toc-wrapper { /* Keep V5 */ }
        .blog-nav-toc-wrapper.toc-visible { /* Keep V5 */ }
        .toc-header { /* Keep V5 */ }
        .toc-close-btn { /* Keep V5 */ }
        .blog-nav-toc { /* Keep V5 */ }
        .toc-nav-title { /* Keep V5 */ }
        .toc-nav-list { /* Keep V5 */ }
        .toc-nav-item a { /* Keep V5 */ }
        .toc-nav-item a:hover { /* Keep V5 */ }
        /* Keep V5 indentation */

        /* ========================================================================== */
        /* List View Header Styling (Keep V5)                                       */
        /* ========================================================================== */
        .blog-intro-header { /* Keep V5 */ }
        .intro-graphic-area { /* Keep V5 */ }
        .intro-list-icon { /* Keep V5 */ }
        .intro-content-wrapper { /* Keep V5 */ }
        .intro-title { /* Keep V5 */ }
        .intro-subtitle { /* Keep V5 */ }
        .intro-divider { /* Keep V5 */ }

        /* ========================================================================== */
        /* Exit Reading Mode Button - STATIC (Keep V5)                              */
        /* ========================================================================== */
        .exit-reading-mode-btn {
             position: fixed; /* ALWAYS FIXED */
             top: 1.5rem; right: 1.5rem; z-index: 1000; /* High z-index */
             padding: 0.6rem; background-color: rgba(var(--bg-secondary-rgb), 0.9);
             backdrop-filter: blur(6px); color: var(--text-primary);
             border: 1px solid rgba(var(--text-muted), 0.5); border-radius: 50%;
             cursor: pointer; transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
             box-shadow: 0 4px 12px rgba(var(--shadow-color), 0.4);
             display: flex; align-items: center; justify-content: center;
             width: 44px; height: 44px; opacity: 0.9;
             will-change: transform, background-color, box-shadow, opacity; /* Added opacity */
        }
        .exit-reading-mode-btn:hover {
            opacity: 1; background-color: rgba(var(--accent-error), 0.95);
            border-color: rgba(var(--accent-error), 1); color: #fff;
            transform: scale(1.18) rotate(270deg);
            box-shadow: 0 8px 18px rgba(var(--accent-error), 0.5);
        }

        /* High Contrast Overrides (Keep V5) */
        :global(.high-contrast-active) .blog-nav-controls { /* ... */ }

      `}</style>
    </div>
  );
};

export default BlogNavControls;