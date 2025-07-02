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
    <div ref={minimapContainerRef} className="minimap-container hidden lg:flex">
      {toc.map((item) => {
        // Adjust height/opacity based on level for visual hierarchy
        const heightClass = item.level === 1 ? 'h-4' : item.level === 2 ? 'h-3' : 'h-2.5'; // Tailwind height classes
        const opacityClass = item.level === 1 ? 'opacity-95' : item.level === 2 ? 'opacity-75' : 'opacity-60';

        return (
          <button
            key={item.slug}
            data-slug={item.slug}
            onClick={() => handleScrollTo(item.slug)}
            title={item.text}
            className={`minimap-indicator group ${heightClass} ${opacityClass} ${activeSlug === item.slug ? 'active' : 'inactive'}`}
            aria-label={`Scroll to ${item.text}`}
            aria-pressed={activeSlug === item.slug}
          >
             <span className="indicator-core"></span>
             <span className="tooltip-text">{item.text}</span>
          </button>
        );
     })}

     {/* JSX Styles for MinimapNav */}
     <style jsx>{`
        .minimap-container {
            position: fixed; top: 50%; transform: translateY(-50%); right: 1rem; /* Closer */
            z-index: 40; display: flex; flex-direction: column; gap: 5px; /* Increased gap */
            max-height: calc(100vh - 8rem); /* Adjusted height */ overflow-y: auto;
            padding: 0.6rem 0.5rem; /* Adjusted padding */
            background: rgba(var(--bg-secondary-rgb), 0.6); /* More opaque */
            border: 1px solid rgba(var(--accent-highlight-rgb), 0.4); /* Stronger border */
            border-radius: var(--radius-base); backdrop-filter: blur(7px);
            box-shadow: var(--shadow-medium), 0 0 12px rgba(var(--accent-highlight-rgb), 0.15);
            scrollbar-width: none;
        }
        
        /* Mobile responsive - 50% smaller */
        @media (max-width: 1023px) {
            .minimap-container {
                transform: translateY(-50%) scale(0.5); /* Make 50% smaller */
                transform-origin: right center; /* Scale from right edge */
                right: 0.5rem; /* Adjust position since it's smaller */
                padding: 0.3rem 0.25rem; /* Reduce padding proportionally */
                gap: 2.5px; /* Reduce gap proportionally */
                max-height: calc(50vh - 4rem); /* Reduce max height */
            }
            
            /* Mobile-specific indicator styling - very thin lines for inactive */
            .minimap-indicator {
                width: 1px !important; /* Very thin default */
                background-color: var(--accent-primary);
                opacity: 0.4 !important; /* Low opacity for inactive */
                transition: all 0.2s ease-out;
            }
            
            /* Inactive State - keep very thin */
            .minimap-indicator.inactive {
                width: 1px !important; /* Very thin line */
                background-color: var(--accent-primary);
                box-shadow: none;
                opacity: 0.4 !important; /* Low opacity for inactive on mobile */
            }
            
            .minimap-indicator.inactive:hover {
                width: 2px !important; /* Slightly thicker on hover */
                background-color: var(--accent-secondary);
                opacity: 0.7 !important; 
                transform: scaleX(1.2); /* Less dramatic scaling on mobile */
                box-shadow: 0 0 3px var(--accent-secondary);
            }
            
            /* Active State - thick line */
            .minimap-indicator.active {
                width: 3px !important; /* Thick line for active */
                background-color: var(--accent-highlight);
                transform: scaleX(1.3); /* Slight additional scaling */
                opacity: 1 !important;
                box-shadow: 0 0 6px var(--accent-highlight), 0 0 10px rgba(var(--accent-highlight-rgb), 0.4);
            }
            
            /* Fade inactive when one is active - more pronounced on mobile */
            .minimap-container:has(.active) .minimap-indicator.inactive {
                opacity: 0.2 !important; /* Very dimmed on mobile */
                width: 0.5px !important; /* Ultra-thin when active exists */
                transform: scaleX(0.8);
            }
            
            .minimap-container:has(.active) .minimap-indicator.inactive:hover {
                opacity: 0.6 !important;
                width: 1.5px !important;
                transform: scaleX(1.1);
            }
        }
        
         .minimap-container::-webkit-scrollbar { display: none; }

        .minimap-indicator {
            width: 5px; /* Slightly thicker */ border-radius: 2px; cursor: pointer;
            transition: all 0.25s ease-out; /* Slightly faster */
            position: relative; flex-shrink: 0;
        }
         /* Inactive State */
        .minimap-indicator.inactive {
            background-color: var(--accent-primary);
            box-shadow: inset 0 0 1px rgba(0,0,0,0.2);
        }
        .minimap-indicator.inactive:hover {
             background-color: var(--accent-highlight);
             opacity: 1 !important; transform: scaleX(1.6); /* Widen more */
             box-shadow: 0 0 6px var(--accent-highlight);
        }
        /* Active State */
        .minimap-indicator.active {
            background-color: var(--accent-highlight);
            transform: scaleX(2.8); /* Widen significantly */
            opacity: 1 !important;
            box-shadow: 0 0 12px var(--accent-highlight), 0 0 18px rgba(var(--accent-highlight-rgb), 0.4); /* Stronger glow */
        }
         /* Fade inactive when one is active */
         .minimap-container:has(.active) .minimap-indicator.inactive {
              opacity: 0.4 !important; /* Dim more */
              transform: scaleX(0.7);
         }
         .minimap-container:has(.active) .minimap-indicator.inactive:hover {
             opacity: 1 !important; transform: scaleX(1.6); /* Restore hover */
         }
         /* Tooltip */
         .tooltip-text {
             position: absolute; right: calc(100% + 12px); top: 50%; transform: translateY(-50%);
             background-color: var(--bg-tooltip, var(--bg-tertiary)); color: var(--text-tooltip, var(--text-primary));
             padding: 0.25rem 0.6rem; border-radius: var(--radius-base);
             border: 1px solid rgba(var(--accent-highlight-rgb), 0.5);
             font-size: 0.7rem; font-family: var(--font-mono); white-space: nowrap;
             opacity: 0; visibility: hidden; transition: opacity 0.2s ease 0.1s, visibility 0.2s ease 0.1s; /* Delay showing */
             pointer-events: none; z-index: 10; box-shadow: var(--shadow-soft);
         }
         .minimap-indicator:hover .tooltip-text { opacity: 1; visibility: visible; }

        /* Tailwind height classes need to be defined if not using Tailwind */
        .h-5 { height: 1.25rem; } /* 20px */
        .h-4 { height: 1rem; } /* 16px */
        .h-3 { height: 0.75rem; } /* 12px */
        .h-2\\.5 { height: 0.625rem; } /* 10px */
        /* Opacity classes */
        .opacity-95 { opacity: 0.95; }
        .opacity-75 { opacity: 0.75; }
        .opacity-60 { opacity: 0.60; }

     `}</style>
    </div>
  );
};

export default MinimapNav;