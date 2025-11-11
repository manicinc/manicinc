// ProjectCarousel.tsx — FINAL REFINED: Enhanced image fitting, metadata, shadows, blur, terminal controls, styling

"use client";

import React, { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowLeft, ArrowRight, Clock, EyeOff, Github, ExternalLink, Star, GitFork } from 'lucide-react';
import { Project } from '@/types/project'; // Assuming this type definition exists
// Use lazy-loaded motion for better performance
import { motion, AnimatePresence } from '@/components/LazyMotion';
import { AsciiArtPlaceholder } from '@/lib/asciiPlaceholders'; // Assuming this component exists
interface Props {
  projects: Project[];
}

// Helper to safely parse numeric stats (handles 'k', 'm', commas)
const parseNumericStat = (value: string | number | undefined): number => {
  if (typeof value === 'number') return value;
  if (!value || typeof value !== 'string') return 0;
  const cleanedValue = value.toLowerCase().trim().replace(/,/g, '');
  let num = parseFloat(cleanedValue);
  if (isNaN(num)) return 0;
  if (cleanedValue.endsWith('k')) num *= 1000;
  else if (cleanedValue.endsWith('m')) num *= 1000000;
  return Math.round(num); // Return whole numbers for display
};

// Helper to find specific stats in the project data
const getStatValue = (project: Project | null | undefined, statName: string): number => {
  if (!project?.stats) return 0;
  const possibleLabels = [statName.toLowerCase(), `github ${statName}`.toLowerCase()];
  for (const label of possibleLabels) {
    const stat = project.stats.find(st => st?.label?.trim().toLowerCase() === label);
    if (stat && typeof stat.value !== 'undefined') {
      return parseNumericStat(stat.value);
    }
  }
  return 0;
};

// Animation variants for Framer Motion
const slideVariants = {
  enter: (direction: number) => ({
    x: direction > 0 ? '100%' : '-100%',
    opacity: 0,
    scale: 0.95, // Add subtle scale effect
  }),
  center: {
    zIndex: 1,
    x: 0,
    opacity: 1,
    scale: 1,
  },
  exit: (direction: number) => ({
    zIndex: 0,
    x: direction < 0 ? '100%' : '-100%',
    opacity: 0,
    scale: 0.95, // Add subtle scale effect
  })
};

const transitionConfig = {
  x: { type: "spring", stiffness: 300, damping: 35 }, // Tweaked spring physics
  opacity: { duration: 0.3 },
  scale: { duration: 0.3 }
};

const ProjectCarousel: React.FC<Props> = ({ projects = [] }) => {
  const [[activeIndex, direction], setActiveIndexState] = useState<[number, number]>([0, 0]);
  const [hasMoreThanOne, setHasMoreThanOne] = useState(false);
  const [isImageLoading, setIsImageLoading] = useState(true); // Track image load state

  // Initialize or update when projects change
  useEffect(() => {
    if (projects.length > 0) {
      // Start at a random project for variety on load
      setActiveIndexState([Math.floor(Math.random() * projects.length), 0]);
    }
    setHasMoreThanOne(projects.length > 1);
  }, [projects]);

  // Reset image loading state when index changes
  useEffect(() => {
    setIsImageLoading(true);
  }, [activeIndex]);

  // Pagination logic
  const paginate = useCallback((newDirection: number) => {
    if (!hasMoreThanOne) return;
    setActiveIndexState(prev => {
      let nextIndex = prev[0] + newDirection;
      if (nextIndex < 0) {
        nextIndex = projects.length - 1;
      } else if (nextIndex >= projects.length) {
        nextIndex = 0;
      }
      return [nextIndex, newDirection];
    });
  }, [hasMoreThanOne, projects.length]);

  const next = useCallback(() => paginate(1), [paginate]);
  const prev = useCallback(() => paginate(-1), [paginate]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "ArrowLeft" || event.key === "ArrowRight") {
        // Prevent scrolling or other default actions
        const target = event.target as HTMLElement;
        // Ignore if user is typing in an input field
        if (["INPUT", "TEXTAREA", "SELECT"].includes(target.tagName)) return;

        event.preventDefault();
        event.key === "ArrowLeft" ? prev() : next();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [next, prev]); // Dependencies for keyboard nav

  if (!projects || projects.length === 0) {
    // Optional: Render a loading state or message if needed
    return <div className="project-carousel-container empty">No projects to display.</div>;
  }


  const activeProject = projects[activeIndex];
  if (!activeProject) return null;

  const isDraft = activeProject.draft === true;
  const year = activeProject.date ? new Date(activeProject.date).getFullYear() : null;
  const stars = getStatValue(activeProject, 'Stars');
  const forks = getStatValue(activeProject, 'Forks');
  const imageSrc = activeProject.image || null;
  const linkUrl = `/projects/${activeProject.category?.toLowerCase()}/${activeProject.slug}`;

  const handleImageLoad = () => setIsImageLoading(false);
  const handleImageError = () => { setIsImageLoading(false); console.error(`Failed to load carousel image: ${imageSrc}`); };

  return (
    <div className="project-carousel-wrapper">
      <div className="project-carousel-container">
        <div className="carousel-content-wrapper">
          <AnimatePresence initial={false} custom={direction} mode="wait">
            <motion.div
              key={activeIndex + (isDraft ? '-draft' : '')} // Key changes for draft status
              custom={direction}
              variants={slideVariants}
              initial="enter" animate="center" exit="exit"
              transition={transitionConfig}
              className={`project-carousel-slide ${isDraft ? 'is-draft' : ''}`} // is-draft class triggers CSS
            >
              {/* Card container */}
              <div className="slide-content-card">

                {/* SHARP "COMING SOON" Overlay - Renders on top of blurred content for drafts */}
                {isDraft && (
                    <div className="draft-coming-soon-overlay">
                         <span className="draft-coming-soon-text">COMING SOON</span>
                    </div>
                )}

                {/* Media Preview Area - Content inside gets blurred via CSS if draft */}
                <div className="media-preview">
                  {/* Render image or placeholder regardless of draft status */}
                  {imageSrc ? (
                    <div className={`media-box ${isImageLoading ? 'loading' : ''}`}>
                      <Image src={imageSrc} alt={`${activeProject.title} preview`} fill sizes="(max-width: 768px) 90vw, (max-width: 1200px) 40vw, 380px" style={{ objectFit: 'cover' }} className="media-img" onLoad={handleImageLoad} onError={handleImageError} priority={activeIndex === 0}/>
                      {isImageLoading && <div className="media-loader"></div>}
                    </div>
                  ) : (
                    <div className="ascii-box">
                      <AsciiArtPlaceholder height="100%" width="100%" animate={true} className="ascii-placeholder" />
                    </div>
                  )}
                   {/* Banners - Only show OSS if NOT draft */}
                   {/* Note: Banners might be slightly blurred by parent blur filter */}
                  {activeProject.github && !isDraft && ( <div className="status-banner oss-banner"> <Github size={11} strokeWidth={2} /> Open Source </div> )}
                   {/* Removed draft banner as overlay handles it */}
                </div>

                {/* Text & Metadata Area - Content inside gets blurred via CSS if draft */}
                <div className="slide-body">
                  <div className="slide-headline">
                    {/* Always render category and year */}
                    {activeProject.category && <span className="slide-category">{activeProject.category}</span>}
                    {year && <span className="slide-year"><Clock size={10} strokeWidth={1.5} /> {year}</span>}
                  </div>

                  {/* Always render title */}
                  <h3 className="slide-title text-shadow-glow">{activeProject.title}</h3>

                  {/* **FIXED:** Always render description if it exists */}
                  {activeProject.description && (
                    <p className="slide-description">{activeProject.description}</p>
                  )}
                  {/* Add placeholder if no description and draft */}
                  {isDraft && !activeProject.description && (
                    <p className="slide-description placeholder-text">// Description Pending //</p>
                  )}

                  {/* **FIXED:** Always render Metrics wrapper */}
                  <div className="slide-metrics">
                    {/* Always render stats if they exist */}
                    {(stars > 0 || forks > 0) && (
                      <div className="slide-stats">
                        {stars > 0 && <span><Star size={11} strokeWidth={1.5} /> {stars.toLocaleString()}</span>}
                        {forks > 0 && <span><GitFork size={11} strokeWidth={1.5} /> {forks.toLocaleString()}</span>}
                      </div>
                    )}
                    {/* Always render tags if they exist */}
                    {activeProject.tags && activeProject.tags.length > 0 && (
                      <div className="slide-tags">
                        {activeProject.tags.slice(0, 3).map(tag => ( <span key={tag} className="tag-chip">{tag}</span> ))}
                        {activeProject.tags.length > 3 && <span className="tag-chip more-tags">...</span>}
                      </div>
                    )}
                  </div>
                  {/* Action Buttons - Disabled via CSS/TSX for drafts */}
                  {/* Action Buttons - Always shown, disabled via CSS/TSX for drafts or missing links */}
                  <div className="slide-actions">
                    {/* Live Site Link - Always rendered, disabled if no link or draft */}
                    <a
                      // Set href to '#' if no link or draft, otherwise use the actual link
                      href={activeProject.link && !isDraft ? activeProject.link : '#'}
                      target="_blank"
                      rel="noopener noreferrer"
                      // Add 'disabled' class if link is missing OR if it's a draft
                      className={`btn-outline mini-btn ${!activeProject.link || isDraft ? 'disabled' : ''}`}
                      aria-label="View live site"
                      // Make non-interactive if disabled
                      tabIndex={!activeProject.link || isDraft ? -1 : 0}
                      // Prevent default click action (navigation) if disabled
                      onClick={e => { if (!activeProject.link || isDraft) e.preventDefault(); }}
                      // Add aria-disabled for accessibility
                      aria-disabled={!activeProject.link || isDraft}
                    >
                      {/* Icon remains visible */}
                      <ExternalLink size={12} strokeWidth={2} />
                    </a>

                    {/* GitHub Link - Always rendered, disabled if no link or draft */}
                    <a
                      // Set href to '#' if no link or draft, otherwise use the actual link
                      href={activeProject.github && !isDraft ? activeProject.github : '#'}
                      target="_blank"
                      rel="noopener noreferrer"
                      // Add 'disabled' class if link is missing OR if it's a draft
                      className={`btn-outline mini-btn ${!activeProject.github || isDraft ? 'disabled' : ''}`}
                      aria-label="View source code"
                      // Make non-interactive if disabled
                      tabIndex={!activeProject.github || isDraft ? -1 : 0}
                      // Prevent default click action (navigation) if disabled
                      onClick={e => { if (!activeProject.github || isDraft) e.preventDefault(); }}
                      // Add aria-disabled for accessibility
                      aria-disabled={!activeProject.github || isDraft}
                    >
                      {/* Icon remains visible */}
                      <Github size={12} strokeWidth={2} />
                    </a>

                    {/* Details Link - Original logic, disabled only if draft */}
                    <Link
                      href={isDraft ? '#' : linkUrl}
                      className={`btn-glow slide-button ${isDraft ? 'disabled' : ''}`}
                      aria-disabled={isDraft}
                      onClick={e => { if (isDraft) e.preventDefault(); }}
                      tabIndex={isDraft ? -1 : 0}
                    >
                      Details <ArrowRight size={12} strokeWidth={2} className="ml-1" />
                    </Link>
                  </div>

                </div> {/* End slide-body */}
              </div> {/* End slide-content-card */}
            </motion.div>
          </AnimatePresence>
        </div> {/* End carousel-content-wrapper */}
      </div> {/* End project-carousel-container */}

      {/* Terminal Controls */}
      {hasMoreThanOne && (
        <div className="project-carousel-controls neon-terminal">
          <button onClick={prev} aria-label="Previous Project" className="terminal-btn prev-btn"> <span className="scanline"></span> <ArrowLeft size={16} /> PREV<span className="cursor">_</span> </button>
          <div className="terminal-divider">::</div>
          <button onClick={next} aria-label="Next Project" className="terminal-btn next-btn"> <span className="scanline"></span> NEXT <ArrowRight size={16} /><span className="cursor">_</span> </button>
        </div>
      )}
    </div> // End project-carousel-wrapper
  );
};

export default ProjectCarousel;
