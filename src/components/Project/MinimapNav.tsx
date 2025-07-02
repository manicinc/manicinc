// File: src/components/Project/MinimapNav.tsx
// V2 - Full Code: Themed Styling & Enhanced Visuals

'use client';

import React, { useEffect, useRef, useState } from 'react';
import { TableOfContentsItem } from '@/types/project'; // Ensure path is correct

interface MinimapNavProps {
  toc: TableOfContentsItem[];
}

const MinimapNav: React.FC<MinimapNavProps> = ({ toc }) => {
  const [activeSlug, setActiveSlug] = useState<string | null>(null);
  const observer = useRef<IntersectionObserver | null>(null);
  const minimapContainerRef = useRef<HTMLDivElement>(null);

   // --- Intersection Observer Logic ---
    useEffect(() => {
        if (observer.current) observer.current.disconnect();
        const observerCallback = (entries: IntersectionObserverEntry[]) => {
             let bestVisibleEntry: IntersectionObserverEntry | undefined;
             for (const entry of entries) {
                 if (entry.isIntersecting) { bestVisibleEntry = entry; break; }
                 if (!bestVisibleEntry || entry.boundingClientRect.top < bestVisibleEntry.boundingClientRect.top) { bestVisibleEntry = entry; }
             }
             if (bestVisibleEntry) setActiveSlug(bestVisibleEntry.target.id);
        };
        observer.current = new IntersectionObserver(observerCallback, { rootMargin: '-100px 0px -50% 0px', threshold: 0 });
        const { current: currentObserver } = observer;
        const observedElements: Element[] = [];
        toc.forEach((item) => {
             const element = document.getElementById(item.slug);
             if (element) { currentObserver?.observe(element); observedElements.push(element); }
        });
        return () => { observedElements.forEach(el => currentObserver?.unobserve(el)); currentObserver?.disconnect(); };
    }, [toc]);

  // --- Scroll To Section ---
  const handleScrollTo = (slug: string) => {
    const el = document.getElementById(slug);
    if (!el) return;
    const offset = 100;
    const top = el.getBoundingClientRect().top + window.scrollY - offset;
    window.scrollTo({ top, behavior: 'smooth' });
    window.history.replaceState(null, '', `#${slug}`);
    setActiveSlug(slug);
  };

  // --- Auto-scroll Minimap Indicator ---
  useEffect(() => {
    if (activeSlug && minimapContainerRef.current) {
        const activeIndicator = minimapContainerRef.current.querySelector<HTMLButtonElement>(`[data-slug="${activeSlug}"]`);
        if (activeIndicator) { activeIndicator.scrollIntoView({ behavior: 'smooth', block: 'nearest' }); }
    }
  }, [activeSlug]);


  if (!toc || toc.length < 3) return null; // Only show if enough sections

  return (
    <div ref={minimapContainerRef} className="minimap-container">
      {toc.map((item) => {
        // Different shapes and sizes based on heading level
        const getIndicatorClass = () => {
          const baseClass = 'minimap-indicator';
          const levelClass = `level-${item.level}`;
          const shapeClass = item.level === 1 ? 'shape-circle' : 
                           item.level === 2 ? 'shape-rectangle' : 
                           'shape-diamond';
          const activeClass = activeSlug === item.slug ? 'active' : 'inactive';
          return `${baseClass} ${levelClass} ${shapeClass} ${activeClass}`;
        };

        return (
          <button
            key={item.slug}
            data-slug={item.slug}
            onClick={() => handleScrollTo(item.slug)}
            title={item.text}
            className={getIndicatorClass()}
            aria-label={`Scroll to ${item.text}`}
            aria-pressed={activeSlug === item.slug}
          >
             <span className="indicator-core"></span>
             <span className="tooltip-text">{item.text}</span>
          </button>
        );
     })}

     {/* Enhanced JSX Styles for MinimapNav */}
     <style jsx>{`
        /* ===== CONTAINER ===== */
        .minimap-container {
            position: fixed;
            top: 50%;
            transform: translateY(-50%);
            right: 1.5rem;
            z-index: 40;
            display: flex;
            flex-direction: column;
            gap: 8px;
            max-height: calc(100vh - 10rem);
            overflow-y: auto;
            padding: 1rem 0.8rem;
            background: rgba(var(--bg-secondary-rgb), 0.85);
            border: 2px solid rgba(var(--accent-highlight-rgb), 0.3);
            border-radius: var(--radius-lg);
            backdrop-filter: blur(12px);
            box-shadow: 
                var(--shadow-large),
                0 0 20px rgba(var(--accent-highlight-rgb), 0.15),
                inset 0 1px 0 rgba(255, 255, 255, 0.1);
            scrollbar-width: none;
            transition: all 0.3s ease;
        }
        
        .minimap-container::-webkit-scrollbar { display: none; }
        
                 /* Show on all screen sizes */
         .minimap-container {
             display: flex;
         }

        /* ===== BASE INDICATOR STYLES ===== */
        .minimap-indicator {
            position: relative;
            cursor: pointer;
            transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
            border: none;
            background: transparent;
            flex-shrink: 0;
            display: flex;
            align-items: center;
            justify-content: center;
        }

        /* ===== SHAPES FOR DIFFERENT LEVELS ===== */
        /* Level 1: Large Circle */
        .minimap-indicator.level-1 {
            width: 14px;
            height: 14px;
        }
        
        .minimap-indicator.level-1.shape-circle {
            border-radius: 50%;
            background: var(--accent-primary);
        }

        /* Level 2: Rectangle */
        .minimap-indicator.level-2 {
            width: 12px;
            height: 8px;
        }
        
        .minimap-indicator.level-2.shape-rectangle {
            border-radius: 2px;
            background: var(--accent-secondary);
        }

        /* Level 3+: Diamond */
        .minimap-indicator.level-3,
        .minimap-indicator.level-4,
        .minimap-indicator.level-5,
        .minimap-indicator.level-6 {
            width: 8px;
            height: 8px;
        }
        
        .minimap-indicator.shape-diamond {
            transform: rotate(45deg);
            background: var(--accent-cool);
            border-radius: 1px;
        }

        /* ===== INACTIVE STATES ===== */
        .minimap-indicator.inactive {
            opacity: 0.5;
            box-shadow: 
                0 2px 4px rgba(var(--shadow-color-rgb), 0.2),
                inset 0 1px 0 rgba(255, 255, 255, 0.1);
        }

                 /* ===== HOVER STATES ===== */
         .minimap-indicator.inactive:hover {
             opacity: 0.8;
             transform: scale(1.2);
             background: var(--accent-highlight) !important;
             box-shadow: 
                 0 2px 8px rgba(var(--accent-highlight-rgb), 0.3),
                 0 0 12px rgba(var(--accent-highlight-rgb), 0.2);
         }

         /* Special hover for diamonds */
         .minimap-indicator.inactive.shape-diamond:hover {
             transform: rotate(45deg) scale(1.2);
         }

                 /* ===== ACTIVE STATES (Subtle) ===== */
         .minimap-indicator.active {
             opacity: 1;
             background: var(--accent-highlight) !important;
             box-shadow: 
                 0 3px 12px rgba(var(--accent-highlight-rgb), 0.4),
                 0 0 16px rgba(var(--accent-highlight-rgb), 0.3),
                 inset 0 1px 0 rgba(255, 255, 255, 0.15);
             animation: subtlePulse 3s ease-in-out infinite;
         }

                 /* Active scaling - more subtle */
         .minimap-indicator.active.level-1 {
             transform: scale(1.4);
             width: 14px;
             height: 14px;
         }

         .minimap-indicator.active.level-2 {
             transform: scale(1.3);
             width: 12px;
             height: 8px;
         }

         .minimap-indicator.active.shape-diamond {
             transform: rotate(45deg) scale(1.5);
             width: 8px;
             height: 8px;
         }

        /* ===== DIMMING INACTIVE WHEN ACTIVE EXISTS ===== */
        .minimap-container:has(.active) .minimap-indicator.inactive {
            opacity: 0.25;
            filter: grayscale(0.3);
        }

        .minimap-container:has(.active) .minimap-indicator.inactive:hover {
            opacity: 0.7;
            filter: grayscale(0);
        }

                 /* ===== SUBTLE PULSE ANIMATION ===== */
         @keyframes subtlePulse {
             0%, 100% { 
                 box-shadow: 
                     0 3px 12px rgba(var(--accent-highlight-rgb), 0.4),
                     0 0 16px rgba(var(--accent-highlight-rgb), 0.3),
                     inset 0 1px 0 rgba(255, 255, 255, 0.15);
                 opacity: 1;
             }
             50% { 
                 box-shadow: 
                     0 4px 16px rgba(var(--accent-highlight-rgb), 0.5),
                     0 0 20px rgba(var(--accent-highlight-rgb), 0.4),
                     inset 0 1px 0 rgba(255, 255, 255, 0.2);
                 opacity: 0.9;
             }
         }

        /* ===== TOOLTIP ===== */
        .tooltip-text {
            position: absolute;
            right: calc(100% + 16px);
            top: 50%;
            transform: translateY(-50%);
            background: var(--bg-tooltip, var(--bg-tertiary));
            color: var(--text-tooltip, var(--text-primary));
            padding: 0.4rem 0.8rem;
            border-radius: var(--radius-base);
            border: 1px solid rgba(var(--accent-highlight-rgb), 0.4);
            font-size: 0.75rem;
            font-family: var(--font-mono);
            font-weight: 600;
            white-space: nowrap;
            opacity: 0;
            visibility: hidden;
            transition: all 0.2s ease 0.3s;
            pointer-events: none;
            z-index: 50;
            box-shadow: var(--shadow-medium);
            backdrop-filter: blur(8px);
        }

        .minimap-indicator:hover .tooltip-text {
            opacity: 1;
            visibility: visible;
            transform: translateY(-50%) translateX(-4px);
        }

                 /* ===== MOBILE RESPONSIVE ===== */
         @media (max-width: 768px) {
             .minimap-container {
                 right: 0.75rem;
                 padding: 0.3rem 0.25rem;
                 gap: 3px;
                 max-height: calc(100vh - 12rem);
                 transform: translateY(-50%) scale(0.7);
                 transform-origin: right center;
             }
             
             /* Much smaller mobile indicators */
             .minimap-indicator.level-1 { width: 6px; height: 6px; }
             .minimap-indicator.level-2 { width: 5px; height: 4px; }
             .minimap-indicator.level-3,
             .minimap-indicator.level-4,
             .minimap-indicator.level-5,
             .minimap-indicator.level-6 { width: 4px; height: 4px; }
             
             /* Very subtle active states on mobile */
             .minimap-indicator.active.level-1 {
                 transform: scale(1.2);
             }
             .minimap-indicator.active.level-2 {
                 transform: scale(1.15);
             }
             .minimap-indicator.active.shape-diamond {
                 transform: rotate(45deg) scale(1.2);
             }
             
             /* Minimal hover effects on mobile */
             .minimap-indicator.inactive:hover {
                 transform: scale(1.05);
             }
             .minimap-indicator.inactive.shape-diamond:hover {
                 transform: rotate(45deg) scale(1.05);
             }
         }

         /* Tablet-specific adjustments */
         @media (min-width: 769px) and (max-width: 1280px) {
             .minimap-container {
                 right: 1rem;
                 padding: 0.8rem 0.6rem;
                 gap: 6px;
             }
             
             .minimap-indicator.level-1 { width: 12px; height: 12px; }
             .minimap-indicator.level-2 { width: 10px; height: 6px; }
             .minimap-indicator.level-3,
             .minimap-indicator.level-4,
             .minimap-indicator.level-5,
             .minimap-indicator.level-6 { width: 6px; height: 6px; }
         }

     `}</style>
    </div>
  );
};

export default MinimapNav;