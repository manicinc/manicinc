'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { TableOfContentsItem } from '@/types/blog';
import { BookOpen, ArrowUp } from 'lucide-react';

interface Props {
  tableOfContents: TableOfContentsItem[];
  postUrl: string; // Note: postUrl and postTitle are passed but not used currently
  postTitle: string;
}

export default function BlogInteractiveClient({ tableOfContents }: Props) { // Removed unused postUrl, postTitle for now
  const [showBackToTop, setShowBackToTop] = useState(false);
  const [activeHeading, setActiveHeading] = useState("");
  const [readingProgress, setReadingProgress] = useState(0);
  const [showMobileToc, setShowMobileToc] = useState(false);

  // Scroll listener
  const handleScroll = useCallback(() => {
    // Back to Top visibility
    setShowBackToTop(window.scrollY > 300);

    // Reading Progress
    const scrollTop = window.scrollY;
    // Ensure documentElement is available
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const progress = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
    setReadingProgress(progress);

    // Active Heading for TOC - Select headings within a specific content area if possible
    // Using '.blog-content' assumes your main article content is wrapped in a div with this class. Adjust if needed.
    const headings = Array.from(document.querySelectorAll('.blog-content h1[id], .blog-content h2[id], .blog-content h3[id]')) as HTMLElement[];

    if (headings.length === 0) return;

    // Find the current active heading
    let currentActive = '';
    // Adjust offset based on your sticky header height + some margin
    const offset = getHeaderOffset ? getHeaderOffset() : 150;

    // Iterate through headings to find the one currently in view near the top
    for (let i = 0; i < headings.length; i++) {
      const heading = headings[i];
      const rect = heading.getBoundingClientRect();

      // If the heading's top is at or above the offset, it's potentially active
      if (rect.top <= offset) {
        currentActive = heading.id;
      } else {
        // Once we find a heading below the offset, the previous one was the last active one
        break;
      }
    }

    // If no heading was found above the offset (e.g., scrolled past the last one),
    // keep the last one active if we're not at the very top.
    if (currentActive === '' && scrollTop > 0 && headings.length > 0) {
       // Check if bottom of scroll container is reached, otherwise maybe stick to last heading?
       // This part might need refinement based on desired behavior at the very end of the page.
       // For now, let's default to the first heading if nothing else is active near the top.
       // Or potentially the last one if scrolled far down.
       // Let's try keeping the last one active if way down.
       const lastHeading = headings[headings.length-1];
       if(lastHeading.getBoundingClientRect().top < offset) {
         currentActive = lastHeading.id;
       } else if(activeHeading === "") { // if nothing found yet, maybe default to first?
          currentActive = headings[0].id;
       }

    } else if (currentActive === '' && headings.length > 0) {
        // If at the very top, maybe activate the first heading?
        currentActive = headings[0].id;
    }


    setActiveHeading(currentActive);
  }, []); // Removed getHeaderOffset from dependencies as it's defined below and stable unless header resizes significantly (which might warrant recalculation anyway)

  // Get proper header offset, accounting for fixed elements
  const getHeaderOffset = useCallback(() => {
    // Prioritize specific sticky header class, fall back to generic header
    const header = document.querySelector<HTMLElement>('.sticky-header') || document.querySelector<HTMLElement>('header');
    // Return header height + margin, or a default value
    return header ? header.offsetHeight + 80 : 120; // Added more margin
  }, []);

  useEffect(() => {
    // Run initial calculations
    handleScroll();
    getHeaderOffset(); // Calculate initial offset

    window.addEventListener('scroll', handleScroll, { passive: true });
    // Optional: Add resize listener if header height can change dynamically
    // window.addEventListener('resize', getHeaderOffset);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      // window.removeEventListener('resize', getHeaderOffset);
    };
  }, [handleScroll, getHeaderOffset]); // Include getHeaderOffset here


  // Scroll to top
  const scrollToTop = useCallback(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  // TOC link click handler
  const handleTocClick = useCallback((e: React.MouseEvent<HTMLAnchorElement>, slug: string) => {
    e.preventDefault();
    const element = document.getElementById(slug);
    if (element) {
      const offsetTop = element.offsetTop - getHeaderOffset();
      window.scrollTo({
        top: offsetTop,
        behavior: 'smooth'
      });
      // Update active heading immediately for better UX
      setActiveHeading(slug);
      // Close mobile TOC after clicking
      setShowMobileToc(false);
    }
  }, [getHeaderOffset]); // Dependency needed

  // Toggle mobile TOC visibility
  const toggleMobileToc = useCallback(() => {
    setShowMobileToc(prev => !prev);
  }, []);

  // Function to generate slug (if not provided by tableOfContents)
  const generateSlug = (text: string) => {
    return text
        .toLowerCase()
        .trim()
        .replace(/[^\w\s-]/g, '') // Remove non-word chars except space/hyphen
        .replace(/\s+/g, '-')    // Replace spaces with hyphens
        .replace(/-+/g, '-');   // Replace multiple hyphens with single
  };

  return (
    <>
      {/* Reading Progress Bar */}
      <div
          className="reading-progress-bar fixed top-0 left-0 h-1 bg-accent-primary z-50" // Example styling
          style={{ width: `${readingProgress}%` }}
          role="progressbar"
          aria-valuenow={Math.round(readingProgress)}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-label="Reading progress"
      />

      {/* Mobile TOC Toggle Button */}
      {tableOfContents.length > 0 && (
        <button
          type="button"
          className="mobile-toc-toggle" // Styles defined below or in global CSS
          onClick={toggleMobileToc}
          aria-expanded={showMobileToc}
          aria-controls="toc-aside" // Link button to the TOC container
          aria-label="Toggle table of contents"
        >
          <BookOpen size={20} />
          <span>Contents</span>
        </button>
      )}

      {/* Table of Contents */}
      {tableOfContents.length > 0 && (
        <aside id="toc-aside" className={`toc-container ${showMobileToc ? 'mobile-visible' : ''}`}>
          <div className="toc-header">
            <h2 className="toc-title">
              <BookOpen size={18} className="mr-2 inline-block" />
              In This Article
            </h2>
            {/* Only show close button when mobile TOC is visible */}
             <button
                type="button"
                className="toc-close-mobile"
                onClick={() => setShowMobileToc(false)}
                aria-label="Close table of contents"
              >
                &times;
              </button>
          </div>

          <nav aria-label="Table of Contents">
            <ul className="toc-list">
              {tableOfContents.map((heading) => {
                 // Use provided slug or generate one
                 const slug = heading.slug || generateSlug(heading.text);
                 if (!slug) return null; // Skip headings that result in empty slugs

                 const isActive = activeHeading === slug;

                 return (
                   <li
                     key={slug}
                     className={`toc-item level-${heading.level} ${isActive ? 'active' : ''}`}
                     style={{ // Use CSS classes preferably, but inline style works
                       paddingLeft: `${(heading.level - 1) * 12}px`,
                       // Simplified active state styling
                     }}
                   >
                     <a
                       href={`#${slug}`}
                       className={isActive ? 'active' : ''}
                       onClick={(e) => handleTocClick(e, slug)}
                       // Indicate current section for screen readers
                       aria-current={isActive ? 'location' : undefined}
                     >
                       {heading.text}
                     </a>
                   </li>
                 );
               })}
            </ul>
          </nav>
        </aside>
      )}

      {/* Back to Top Button */}
      <button
            type="button"
            className={`
              fixed bottom-8 right-8
              w-12 h-12 rounded-md
              flex items-center justify-center
              bg-gradient-to-br from-violet-600 to-pink-500
              text-white
              shadow-lg
              transition-all duration-300 ease-in-out
              transform hover:scale-110 hover:rotate-3
              border border-violet-300
              ${showBackToTop ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}
              hover:shadow-[0_0_15px_rgba(167,139,250,0.5)]
              focus:outline-none focus:ring-2 focus:ring-violet-400
            `}
            onClick={scrollToTop}
            aria-label="Back to top"
            title="Back to top"
          >
            <div className="relative flex items-center justify-center w-full h-full overflow-hidden">
              <div className="absolute inset-0 opacity-20 bg-grid-white/10"></div>
              <ArrowUp size={20} className="text-white relative z-10" strokeWidth={2.5} />
            </div>
          </button>

      {/* Keep styles within the component or move to a global CSS file */}
      <style jsx global>{`
   
       `}</style>
    </>
  );
}