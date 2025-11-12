// File: src/components/Project/TableOfContents.tsx
// V2 - Full Code: Themed Styling

'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { TableOfContentsItem } from '@/types/project'; // Ensure path is correct

interface TableOfContentsProps {
  toc: TableOfContentsItem[];
}

const TableOfContents: React.FC<TableOfContentsProps> = ({ toc }) => {
  const [activeSlug, setActiveSlug] = useState<string | null>(null);
  const observer = useRef<IntersectionObserver | null>(null);
  const tocContainerRef = useRef<HTMLElement>(null);
  const manualScrollTimeoutRef = useRef<number | null>(null);
  const isManualScrollRef = useRef(false);

  const clearManualScroll = useCallback(() => {
    isManualScrollRef.current = false;
    if (manualScrollTimeoutRef.current !== null) {
      window.clearTimeout(manualScrollTimeoutRef.current);
      manualScrollTimeoutRef.current = null;
    }
  }, []);

  const computeScrollMarginTop = useCallback((element: HTMLElement) => {
    const computed = window.getComputedStyle(element).scrollMarginTop;
    if (!computed) return 0;
    const parsed = parseFloat(computed);
    return Number.isFinite(parsed) ? parsed : 0;
  }, []);

  // Intersection Observer Logic
  useEffect(() => {
    if (observer.current) observer.current.disconnect();
    const observerCallback = (entries: IntersectionObserverEntry[]) => {
        let bestVisibleEntry: IntersectionObserverEntry | undefined;
        for (const entry of entries) {
            if (entry.isIntersecting) { bestVisibleEntry = entry; break; }
            if (!bestVisibleEntry || entry.boundingClientRect.top < bestVisibleEntry.boundingClientRect.top) { bestVisibleEntry = entry; }
        }
        if (bestVisibleEntry && !isManualScrollRef.current) setActiveSlug(bestVisibleEntry.target.id);
    };
    observer.current = new IntersectionObserver(observerCallback, { rootMargin: '-120px 0px -55% 0px', threshold: 0 });
    const { current: currentObserver } = observer;
    const observedElements: Element[] = [];
    toc.forEach((item) => {
      const element = document.getElementById(item.slug);
      if (element) { currentObserver?.observe(element); observedElements.push(element); }
    });
    return () => { observedElements.forEach(el => currentObserver?.unobserve(el)); currentObserver?.disconnect(); };
  }, [toc]);

  // Auto-scroll Active Link into View
   useEffect(() => {
     if (activeSlug && tocContainerRef.current) {
       const activeLink = tocContainerRef.current.querySelector<HTMLAnchorElement>(`a[href="#${activeSlug}"]`);
       if (activeLink) {
           const containerRect = tocContainerRef.current.getBoundingClientRect();
           const linkRect = activeLink.getBoundingClientRect();
           const isVisible = linkRect.top >= containerRect.top && linkRect.bottom <= containerRect.bottom;
           if (!isVisible) { activeLink.scrollIntoView({ behavior: 'smooth', block: 'nearest' }); }
       }
     }
   }, [activeSlug]);

  // Handle Manual Click & Scroll
  const handleScroll = (e: React.MouseEvent<HTMLAnchorElement>, slug: string) => {
    e.preventDefault();
    const element = document.getElementById(slug);
    if (!element) return;

    clearManualScroll();
    isManualScrollRef.current = true;

    // Compute offset with scroll-margin-top or header height fallback
    const marginTop = computeScrollMarginTop(element);
    const headerHeightVar = parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--header-height')) || 60;
    const offset = Math.max(marginTop, headerHeightVar + 8);

    // Scroll to exact position accounting for sticky header
    const y = element.getBoundingClientRect().top + window.pageYOffset - offset;

    setActiveSlug(slug);
    window.history.replaceState(null, '', `#${slug}`);
    window.scrollTo({ top: y, behavior: 'smooth' });

    // Clear manual guard after animation
    manualScrollTimeoutRef.current = window.setTimeout(clearManualScroll, 700);
  };

  useEffect(() => {
    return () => {
      clearManualScroll();
    };
  }, [clearManualScroll]);

  if (!toc || toc.length === 0) return null;

  return (
    <aside ref={tocContainerRef} className="toc-container sticky top-24">
      <h3 className="toc-heading"> Index:// Navigation </h3>
      <ul className="toc-list">
        {toc.map((item) => (
          <li key={item.slug} className="toc-list-item" style={{ paddingLeft: `${(item.level - 1) * 1}rem` }} >
            <a href={`#${item.slug}`} onClick={(e) => handleScroll(e, item.slug)} className={`toc-link group ${activeSlug === item.slug ? 'active' : 'inactive'}`} >
              {item.level > 1 && ( <span className={`nesting-indicator ${activeSlug === item.slug ? 'active' : ''}`}>↳</span> )}
              <span className="link-text">{item.text}</span>
            </a>
          </li>
        ))}
      </ul>
      <div className="toc-footer"> <span className="eof-marker">// EOF_INDEX //</span> </div>
       <style jsx>{`
         .toc-container { height: calc(100vh - 8rem); max-height: 700px; overflow-y: auto; padding: 1.2rem 1rem 1.2rem 1.2rem; margin-right: -1rem; border: 1px solid rgba(var(--accent-primary-rgb), 0.4); border-radius: var(--radius-base); background: rgba(var(--bg-secondary-rgb), 0.6); backdrop-filter: blur(8px); box-shadow: 3px 3px 0px rgba(var(--accent-highlight-rgb), 0.2), inset 0 0 10px rgba(var(--bg-primary-rgb), 0.4); scrollbar-width: thin; scrollbar-color: var(--accent-primary) var(--bg-secondary); }
         .toc-container::-webkit-scrollbar { width: 6px; } .toc-container::-webkit-scrollbar-track { background: var(--bg-secondary); border-radius: 3px; } .toc-container::-webkit-scrollbar-thumb { background-color: var(--accent-primary); border-radius: 3px; border: 1px solid var(--bg-secondary); } .toc-container::-webkit-scrollbar-thumb:hover { background-color: var(--accent-highlight); }
         .toc-heading { font-size: 0.9rem; font-weight: 700; font-family: var(--font-mono); margin-bottom: 1rem; color: var(--accent-primary); letter-spacing: 0.08em; text-transform: uppercase; padding-bottom: 0.5rem; border-bottom: 1px dashed rgba(var(--accent-primary-rgb), 0.3); text-shadow: 0 0 4px rgba(var(--accent-primary-rgb), 0.5); }
         .toc-list { list-style: none; padding: 0; margin: 0; }
         .toc-list-item { margin-bottom: 0.1rem; }
         .toc-link { display: block; padding: 0.3rem 0.5rem; border-radius: 2px; font-size: 0.8rem; line-height: 1.4; font-family: var(--font-mono); transition: all 0.2s ease-out; cursor: pointer; position: relative; overflow: hidden; }
         .toc-link.inactive { color: var(--text-secondary); }
         .toc-link.inactive:hover { color: var(--accent-highlight); background-color: rgba(var(--accent-highlight-rgb), 0.1); transform: translateX(3px); }
         .toc-link.active { color: var(--accent-highlight); font-weight: 600; background-color: rgba(var(--accent-highlight-rgb), 0.15); transform: scale(1.03); box-shadow: 0 0 8px rgba(var(--accent-highlight-rgb), 0.3); }
         .toc-link.active::before { content: ''; position: absolute; left: -1.2rem; top: 0; bottom: 0; width: 3px; background-color: var(--accent-highlight); border-radius: 2px; animation: pulse-marker 1.5s infinite ease-in-out; }
         @keyframes pulse-marker { 0%, 100% { opacity: 0.7; box-shadow: 0 0 3px var(--accent-highlight); } 50% { opacity: 1; box-shadow: 0 0 6px var(--accent-highlight); } }
         .nesting-indicator { margin-right: 0.4rem; display: inline-block; opacity: 0.5; transition: color 0.2s ease; color: var(--text-muted); }
         .nesting-indicator.active { color: var(--accent-highlight); opacity: 0.8; }
         .toc-link:hover .nesting-indicator { color: var(--accent-highlight); }
         .link-text { }
         .toc-footer { margin-top: 1.5rem; padding-top: 0.8rem; border-top: 1px dashed rgba(var(--accent-primary-rgb), 0.2); text-align: center; }
         .eof-marker { font-family: var(--font-mono); font-size: 0.7rem; color: var(--text-muted); opacity: 0.6; letter-spacing: 0.1em; user-select: none; }
       `}</style>
    </aside>
  );
};

export default TableOfContents;