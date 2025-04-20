// src/components/Project/ProjectCard.tsx
// V13 - Definitive Draft Blur Fix (Blur Content Only)

"use client";

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Github, EyeOff, Star, GitFork } from 'lucide-react';
import { Project } from '@/types/project'; // Ensure path is correct
import { AsciiArtPlaceholder } from '@/lib/asciiPlaceholders'; // Ensure path is correct

interface ProjectCardProps { project: Project; }

// --- Helper Functions ---
const parseNumericStat = (value: string | number | undefined): number => { if (typeof value === 'number') return value; if (typeof value !== 'string' || !value) return 0; const c = value.toLowerCase().trim().replace(/,/g, ''); let n = parseFloat(c); if (isNaN(n)) return 0; if (c.endsWith('k')) n *= 1000; else if (c.endsWith('m')) n *= 1000000; return Math.round(n); };
const getStatValue = (project: Project | null | undefined, statName: 'Stars' | 'Forks' | string): number => { if (!project) return 0; const pl = [statName.toLowerCase(), `github ${statName}`.toLowerCase()]; if (project.stats && Array.isArray(project.stats)) { for (const l of pl) { const s = project.stats.find(st => st?.label?.trim().toLowerCase() === l); if (s && typeof s.value !== 'undefined') { return parseNumericStat(s.value); } } } const dpn = statName.toLowerCase(); if (project.hasOwnProperty(dpn) && typeof (project as any)[dpn] !== 'undefined') { return parseNumericStat((project as any)[dpn]); } if (project.hasOwnProperty(`github${statName}`) && typeof (project as any)[`github${statName}`] !== 'undefined') { return parseNumericStat((project as any)[`github${statName}`]); } return 0; };
// --- End Helper Functions ---

const ProjectCard: React.FC<ProjectCardProps> = ({ project }) => {
  if (!project) return null;

  const { slug, category, title, description, image, tags = [], github, featured, draft, status, date } = project;
  const isDraft = draft === true;
  const hasGithub = !!github;
  const isOpenSource = hasGithub;
  const displayStatus = !isDraft && (status === 'ongoing' || status === 'concept') ? status : null;
  const projectYear = date ? new Date(date).getFullYear() : null;
  const githubStars = hasGithub ? getStatValue(project, 'Stars') : 0;
  const githubForks = hasGithub ? getStatValue(project, 'Forks') : 0;
  const showImage = !isDraft && !!image;
  const placeholderHeight = "140px";
  const placeholderWidth = "240px";
  const linkUrl = isDraft ? '#' : `/projects/${category?.toLowerCase()}/${slug}`;

  return (
    // Link wrapper handles navigation and hover states for non-drafts
    <Link
      href={linkUrl}
      className={`project-card-link group ${isDraft ? 'is-draft-link' : ''}`}
      title={isDraft ? `${title} (Coming Soon)` : `View project: ${title}`}
      aria-disabled={isDraft}
      onClick={(e) => { if (isDraft) e.preventDefault(); }}
      tabIndex={isDraft ? -1 : 0}
    >
      {/* Article applies base styles and the .is-draft class marker */}
      <article className={`project-card ${isDraft ? 'is-draft' : ''} ${featured ? 'is-featured' : ''}`}>

        {/* Banners Area - Positioned absolutely, NOT blurred by content filters */}
        <div className="card-banners">
            {!isDraft && (
                <>
                    {displayStatus && ( <span className={`status-banner status-${displayStatus}`} title={`Status: ${displayStatus}`}>{displayStatus}</span> )}
                    {isOpenSource && ( <span className="open-source-banner" title="Open Source Repository"> <Github size={11} className="icon" strokeWidth={2}/> OSS </span> )}
                </>
            )}
        </div>

        {/* COMING SOON Overlay - Rendered only for drafts, positioned absolutely */}
         {isDraft && (
             <div className="draft-coming-soon-overlay">
                 <span className="draft-coming-soon-text">COMING SOON</span>
             </div>
         )}

         {/* Inner content wrapper - This is what gets blurred if draft */}
         <div className="card-inner-content-wrapper">
             {/* Image Wrapper */}
             <div className="card-image-wrapper">
               {showImage ? (
                 <Image src={image} alt={`${title} preview`} fill sizes="(max-width: 640px) 90vw, (max-width: 1024px) 45vw, 300px" className="card-image cover" style={{ objectFit: 'cover' }} loading="lazy" onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }} />
               ) : (
                 <div className="card-image-placeholder">
                   <AsciiArtPlaceholder width={placeholderWidth} height={placeholderHeight} animate={true} className="ascii-art" />
                 </div>
               )}
             </div>

             {/* Content Area */}
             <div className="card-content">
                 <div className="card-meta">
                     {category && <span className="category-tag">{category}</span>}
                     {projectYear && <span className="year-tag">{projectYear}</span>}
                 </div>
                 <h3 className={`project-title ${!isDraft ? 'text-shadow-glow' : ''}`}>{title}</h3>
                 {/* Description */}
                 {description && <p className="card-description">{description}</p>}
                 {/* Stats */}
                 {(githubStars > 0 || githubForks > 0) && (
                     <div className="card-stats">
                         {githubStars > 0 && ( <span className="stat-item" title={`${githubStars.toLocaleString()} Stars`}><Star size={10} className="icon" strokeWidth={1.5}/> {githubStars.toLocaleString()}</span> )}
                         {githubForks > 0 && ( <span className="stat-item" title={`${githubForks.toLocaleString()} Forks`}><GitFork size={10} className="icon" strokeWidth={1.5}/> {githubForks.toLocaleString()}</span> )}
                     </div>
                 )}
                 {/* Tags */}
                 {tags.length > 0 && (
                     <div className="card-tags">
                         {tags.slice(0, 3).map((tag) => ( <span key={tag} className="tag-chip">{tag}</span> ))}
                         {tags.length > 3 && <span className="tag-chip more-tags">...</span>}
                     </div>
                 )}
                 {/* Placeholder text specific for draft state */}
                 {isDraft && (
                     <div className="draft-content-placeholder">
                         <p className="card-description placeholder">// Transmission Pending //</p>
                     </div>
                 )}
             </div>
         </div> {/* End card-inner-content-wrapper */}

      </article>

      {/* --- Styles --- */}
      <style jsx>{`
        /* Link Styling */
        .project-card-link { display: block; color: inherit; text-decoration: none !important; border-radius: var(--radius-base); height: 100%; outline: none; position: relative; z-index: 1; transition: transform var(--transition-fast), box-shadow var(--transition-medium); }
        .project-card-link:focus-visible { box-shadow: 0 0 0 3px rgba(var(--bg-primary-rgb), 0.8), 0 0 0 5px var(--accent-highlight); z-index: 20; }
        .project-card-link.is-draft-link { cursor: default; }
        .project-card-link:not(.is-draft-link):hover { transform: translateY(-4px) scale(1.015); box-shadow: var(--shadow-lifted), 0 0 18px rgba(var(--accent-highlight-rgb), 0.18); z-index: 10; }
        .project-card-link:not(.is-draft-link) .project-title { text-decoration: none !important; transition: color var(--transition-fast); }
        .project-card-link:not(.is-draft-link):hover .project-title { color: var(--accent-highlight) !important; text-decoration: underline !important; text-decoration-color: rgba(var(--accent-highlight-rgb), 0.7) !important; text-decoration-thickness: 1.5px !important; text-underline-offset: 3px !important; }

        /* Base Card Structure */
        .project-card {
            background: linear-gradient(170deg, var(--bg-secondary) 0%, var(--bg-tertiary) 70%, var(--bg-primary) 100%), var(--bg-noise-soft);
            border-radius: var(--radius-base);
            overflow: hidden; /* Important to contain overlay/blur */
            border: 1px solid rgba(var(--accent-primary-rgb), 0.15);
            height: 100%; display: flex; flex-direction: column;
            position: relative; /* Context for absolutely positioned children */
            box-shadow: 2px 2px 0px rgba(var(--bg-primary-rgb), 0.4), var(--shadow-inset-light), 0 0 0 1px rgba(var(--bg-tertiary-rgb), 0.3);
            transition: all var(--transition-fast);
        }
        .project-card-link:not(.is-draft-link):hover .project-card {
            border-color: var(--accent-highlight);
            box-shadow: 3px 3px 0px rgba(var(--accent-highlight-rgb), 0.25), var(--shadow-inset), 0 0 10px rgba(var(--accent-highlight-rgb), 0.1);
            background: linear-gradient(170deg, var(--bg-tertiary) 0%, var(--bg-secondary) 70%, var(--bg-primary) 100%), var(--bg-noise-soft);
        }

        /* Inner Wrapper for Content to be Blurred */
        .card-inner-content-wrapper {
            display: flex; flex-direction: column;
            flex-grow: 1; /* Allow content to fill space */
            transition: filter 0.3s ease, opacity 0.3s ease; /* Smooth blur transition */
            /* Base state (no blur) */
            filter: none;
            opacity: 1;
        }

        /* --- DRAFT STYLING --- */
        /* Base styling for the non-interactive draft card */
        .project-card.is-draft {
            pointer-events: none;
            user-select: none;
            transition: none;
            box-shadow: var(--shadow-inset-light); /* Simple shadow */
            /* NO filter here */
        }
        /* Apply blur ONLY to the inner content wrapper when draft */
        .project-card.is-draft .card-inner-content-wrapper {
            filter: blur(2px) grayscale(50%) opacity(0.7); /* Adjust values */
        }
        /* Prevent hover effects on draft link */
        .project-card-link.is-draft-link:hover .project-card {
            transform: none;
            box-shadow: var(--shadow-inset-light);
        }

        /* COMING SOON Overlay Styling (Sharp) */
        .draft-coming-soon-overlay {
            position: absolute; inset: 0; /* Cover the whole card */
            display: flex; align-items: center; justify-content: center;
            background-color: rgba(10, 10, 15, 0.6); /* Semi-transparent dark overlay */
            backdrop-filter: blur(1px); /* Optional slight blur ON the overlay bg */
            z-index: 10; /* Above inner content */
            padding: 0.5rem; pointer-events: none;
            border-radius: inherit; /* Match card rounding */
             /* Ensure no blur is applied to the overlay itself */
             filter: none !important;
             opacity: 1 !important;
        }
        .draft-coming-soon-text {
            font-family: var(--font-mono); font-size: 1.1rem;
            font-weight: bold; color: #f5f5f5;
            text-transform: uppercase; letter-spacing: 0.1em; text-align: center;
             /* Add outline/shadow for contrast against potentially light blurred areas */
             text-shadow: 0 0 5px rgba(0, 0, 0, 0.8), 1px 1px 1px rgba(0,0,0,0.5);
             /* Apply glitch animation */
             animation: comingSoonGlitch 0.9s infinite steps(5, start); /* Use global keyframes */
             position: relative; z-index: 11; /* Above overlay background */
              /* Ensure no blur is applied to the text */
              filter: none !important;
              opacity: 1 !important;
        }

        /* Banners Styling (Sharp) */
        .card-banners { position: absolute; top: 0.5rem; right: 0.5rem; z-index: 15; /* Above overlay */ display: flex; flex-direction: column; align-items: flex-end; gap: 0.3rem; filter: none !important; opacity: 1 !important; }
        .status-banner { padding: 2px 6px; font-size: 0.55rem; border-radius: 2px; }
        .open-source-banner { padding: 2px 6px; font-size: 0.6rem; border-radius: 2px; background: linear-gradient(45deg, rgba(var(--accent-highlight-rgb), 0.7), rgba(var(--accent-secondary-rgb), 0.8)); color: var(--bg-primary); border-color: rgba(var(--bg-primary-rgb), 0.4); text-shadow: 1px 1px 1px rgba(0,0,0,0.5); box-shadow: 0 0 5px var(--accent-highlight), 1px 1px 0px rgba(0, 0, 0, 0.3); }
        .open-source-banner .icon { margin-right: 0.2rem; vertical-align: -1px; }

        /* Image Wrapper */
        .card-image-wrapper { aspect-ratio: 16 / 10; border-bottom: 1px solid rgba(var(--accent-primary-rgb), 0.15); background-color: var(--bg-secondary); position: relative; overflow: hidden; }
        .card-image.cover { display: block; width: 100%; height: 100%; object-fit: cover; transition: transform 0.3s ease, filter 0.3s ease; filter: saturate(0.9) brightness(1); }
        .project-card-link:not(.is-draft-link):hover .card-image.cover { transform: scale(1.04); filter: saturate(1.05) brightness(1.03); }
        .card-image-placeholder { padding: 0.3rem; display: flex; align-items: center; justify-content: center; height: 100%; }
        .card-image-placeholder .ascii-art { font-size: 0.4rem; line-height: 1; color: var(--accent-primary); opacity: 0.5; max-width: 100%; max-height: 100%; overflow: hidden; }

        /* Card Content */
        .card-content { padding: 0.4rem 0.6rem; flex-grow: 1; display: flex; flex-direction: column; gap: 0.2rem; }
        .project-title { font-size: 1rem; line-height: 1.25; margin-bottom: 0.1rem; font-weight: 600; font-family: var(--font-display); color: var(--text-heading); }
        .card-meta { display: flex; align-items: center; flex-wrap: wrap; gap: 0.3rem; margin-bottom: 0.15rem; }
        .category-tag { font-family: var(--font-mono); font-size: 0.55rem; text-transform: uppercase; letter-spacing: 0.04em; padding: 2px 5px; border-radius: 2px; background-color: var(--accent-primary); color: var(--bg-primary); border: 1px solid rgba(var(--bg-primary-rgb), 0.3); box-shadow: 0.5px 0.5px 0px rgba(0, 0, 0, 0.2); font-weight: 600; line-height: 1.2; }
        .year-tag { font-family: var(--font-mono); font-size: 0.55rem; text-transform: uppercase; padding: 1px 4px; border-radius: 2px; background-color: rgba(var(--bg-tertiary-rgb), 0.6); color: var(--text-secondary); line-height: 1.2; }
        .card-description { font-family: var(--font-body); font-size: 0.75rem; color: var(--text-secondary); line-height: 1.4; margin-bottom: 0.25rem; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; text-overflow: ellipsis; }

        /* Stats */
        .card-stats { display: flex; gap: 0.4rem; margin: 0.15rem 0; font-family: var(--font-mono); font-size: 0.65rem; color: var(--text-muted); flex-wrap: wrap; }
        .stat-item { display: inline-flex; align-items: center; gap: 0.2rem; background-color: rgba(var(--bg-tertiary-rgb), 0.35); padding: 1px 4px; border-radius: 2px; border: 1px solid rgba(var(--accent-highlight-rgb), 0.15); }
        .stat-item .icon { color: var(--accent-highlight); opacity: 0.6; width: 9px; height: 9px; margin-right: 1px; }

        /* Tags */
        .card-tags { margin-top: auto; padding-top: 0.15rem; display: flex; flex-wrap: wrap; gap: 0.25rem; }
        /* Use global .tag-chip style */
        .tag-chip.more-tags { opacity: 0.6; background: transparent; border-color: transparent; box-shadow: none; }

        /* Draft placeholder text (visible through blur) */
        .draft-content-placeholder { margin-top: 0.3rem; text-align: center; }
        .draft-content-placeholder .card-description.placeholder {
             -webkit-line-clamp: 1;
             filter: none; /* Ensure no independent blur */
             opacity: 1; /* Rely on parent wrapper opacity */
             color: var(--text-muted); /* Use a readable muted color */
             font-size: 0.75rem; font-style: italic;
        }

        /* Text Shadow Glow Utility */
         .text-shadow-glow { text-shadow: 0 0 8px rgba(var(--accent-primary-rgb), 0.5), 0 0 15px rgba(var(--accent-highlight-rgb), 0.3); }
         /* Remove glow from blurred draft titles */
         .project-card.is-draft .project-title { text-shadow: none; }

      `}</style>
    </Link>
  );
};

export default ProjectCard;