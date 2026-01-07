// src/components/Project/ProjectDetailClient.tsx
// V9 - Complete implementation with ProjectMarkdownRenderer, Helpers, Scroll-to-Top

'use client';

// --- React and Next.js Imports ---
import React, { useEffect, useState, useRef, useMemo } from 'react';
import Image from 'next/image';
import Link from 'next/link';

// --- Icon Imports (Using lucide-react as an example) ---
import {
    Github, ExternalLink, Clock, ArrowLeft, Star, GitFork, AlertTriangle, Users, FileCode,
    Activity, Info, ChevronDown, ChevronUp, Layers, CalendarDays, Eye, ShieldCheck, MessageSquare, Tag, Image as ImageIcon, ArrowUpCircle
} from 'lucide-react';

// --- Project Specific Imports ---
import { Project, TableOfContentsItem, TeamMember, Testimonial } from '@/types/project'; // Ensure types cover all used fields
import ProjectCard from './ProjectCard'; // Component to display related projects
import { ProjectMarkdownRenderer } from '@/components/ProjectMarkdownRenderer'; // The NEW project-specific renderer
import { parseGitHubUrl, fetchRepoMetadata, fetchRepoLanguages, fetchRepoContributors } from '@/lib/github'; // GitHub utility functions
import TableOfContents from './TableOfContents'; // Component for displaying TOC
import MinimapNav from './MinimapNav'; // Component for the minimap navigation
import AsciiArtPlaceholder from '@/lib/asciiPlaceholders'; // Fallback placeholder component

// --- GitHub API Data Types (Allowing for potentially null fields from API) ---
interface GitHubRepoOwner {
    login?: string;
    avatar_url?: string;
    html_url?: string;
}
interface GitHubRepoLicense {
    name?: string | null;
    spdx_id?: string | null;
    url?: string | null;
}
interface GitHubRepoMetadata {
    name?: string;
    description?: string | null;
    html_url?: string;
    owner?: GitHubRepoOwner;
    stargazers_count?: number;
    forks_count?: number;
    subscribers_count?: number; // For watchers
    open_issues_count?: number;
    size?: number; // Size in KB
    language?: string | null;
    license?: GitHubRepoLicense | null;
    created_at?: string; // ISO Date string
    updated_at?: string; // ISO Date string
    pushed_at?: string; // ISO Date string
    homepage?: string | null;
    topics?: string[];
}
interface GitHubContributor {
    id?: number;
    login?: string;
    avatar_url?: string;
    html_url?: string;
    contributions?: number;
}

// --- Component Props Interface ---
interface ProjectDetailClientProps {
    project: Project; // The project data fetched by the server component
    relatedProjects: Project[]; // Array of related projects
    toc?: TableOfContentsItem[]; // Optional Table of Contents override (primarily uses project.toc)
}

// === Helper Functions ===

/**
 * Parses a potentially formatted string (like "1.2k") into a number.
 * @param value - The string or number value to parse.
 * @returns The parsed number, or 0 if invalid.
 */
const parseNumericStat = (value: string | number | undefined): number => {
    if (typeof value === 'number') return value;
    if (typeof value !== 'string' || !value) return 0;
    // Clean the string: lowercase, remove commas
    const cleanedValue = value.toLowerCase().trim().replace(/,/g, '');
    let numericValue = parseFloat(cleanedValue);
    if (isNaN(numericValue)) return 0;
    // Handle 'k' (thousands) and 'm' (millions) suffixes
    if (cleanedValue.endsWith('k')) {
        numericValue *= 1000;
    } else if (cleanedValue.endsWith('m')) {
        numericValue *= 1000000;
    }
    return Math.round(numericValue);
};

/**
 * Safely gets a numeric statistic value from project data, checking multiple possible keys.
 * @param project - The project object.
 * @param statName - The name of the stat (e.g., "Stars", "Forks").
 * @returns The numeric value of the stat, or 0 if not found.
 */
const getStatValue = (project: Project | null | undefined, statName: 'Stars' | 'Forks' | string): number => {
    if (!project) return 0;
    // Define possible keys for the stat (e.g., "stars", "github stars")
    const possibleKeys = [statName.toLowerCase(), `github ${statName}`.toLowerCase()];

    // Check the 'stats' array first
    if (project.stats && Array.isArray(project.stats)) {
        for (const labelKey of possibleKeys) {
            const stat = project.stats.find(st => st?.label?.trim().toLowerCase() === labelKey);
            if (stat && typeof stat.value !== 'undefined') {
                return parseNumericStat(stat.value);
            }
        }
    }

    // Check direct properties on the project object
    const directPropName = statName.toLowerCase();
    if (project.hasOwnProperty(directPropName) && typeof (project as any)[directPropName] !== 'undefined') {
        return parseNumericStat((project as any)[directPropName]);
    }
    // Check prefixed properties (e.g., githubStars)
    const prefixedPropName = `github${statName}`;
    if (project.hasOwnProperty(prefixedPropName) && typeof (project as any)[prefixedPropName] !== 'undefined') {
         return parseNumericStat((project as any)[prefixedPropName]);
    }

    return 0; // Stat not found
};

/**
 * Formats a number of bytes into a human-readable string (KB, MB, GB, etc.).
 * @param bytes - The number of bytes.
 * @param decimals - The number of decimal places to include.
 * @returns A formatted string like "1.2 MB".
 */
const formatBytes = (bytes: number, decimals = 1): string => {
    if (!bytes || bytes === 0) return '0 Bytes';
    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB'];
    // Determine the appropriate size index
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    const sizeIndex = i < sizes.length ? i : sizes.length - 1; // Prevent index out of bounds
    // Calculate the value in the chosen unit and format it
    const calculatedValue = parseFloat((bytes / Math.pow(k, sizeIndex)).toFixed(dm));
    return `${calculatedValue} ${sizes[sizeIndex]}`;
};

/**
 * Converts a date/timestamp into a relative time string (e.g., "2 hrs ago", "3 mos ago").
 * @param date - The date string, number timestamp, or Date object.
 * @returns A relative time string, or "N/A" if the date is invalid.
 */
const timeAgo = (date: string | number | Date | undefined): string => {
    if (!date) return 'N/A';
    try {
        const dateObj = new Date(date);
        const seconds = Math.floor((new Date().getTime() - dateObj.getTime()) / 1000);

        if (seconds < 0) return 'in the future'; // Handle future dates if necessary
        if (seconds < 60) return `${seconds} sec ago`;

        let interval = seconds / 31536000; // Years
        if (interval >= 1) return `${Math.floor(interval)} yr${Math.floor(interval) > 1 ? 's' : ''} ago`;

        interval = seconds / 2592000; // Months
        if (interval >= 1) return `${Math.floor(interval)} mo${Math.floor(interval) > 1 ? 's' : ''} ago`;

        interval = seconds / 86400; // Days
        if (interval >= 1) return `${Math.floor(interval)} day${Math.floor(interval) > 1 ? 's' : ''} ago`;

        interval = seconds / 3600; // Hours
        if (interval >= 1) return `${Math.floor(interval)} hr${Math.floor(interval) > 1 ? 's' : ''} ago`;

        interval = seconds / 60; // Minutes
        if (interval >= 1) return `${Math.floor(interval)} min${Math.floor(interval) > 1 ? 's' : ''} ago`;

        return `${Math.floor(seconds)} sec ago`;
    } catch (error) {
        console.error("Error parsing date for timeAgo:", error);
        return "N/A";
    }
};

// === Main Client Component ===

export default function ProjectDetailClient({ project, relatedProjects = [], toc: tocProp = [] }: ProjectDetailClientProps) {

    // --- State Variables ---
    const [githubMeta, setGithubMeta] = useState<GitHubRepoMetadata | null>(null); // Stores fetched GitHub repo metadata
    const [languages, setLanguages] = useState<Record<string, number> | null>(null); // Stores fetched language byte counts
    const [contributors, setContributors] = useState<GitHubContributor[]>([]); // Stores fetched contributors
    const [githubError, setGithubError] = useState<string | null>(null); // Stores any error during GitHub fetch
    const [isLoadingGithub, setIsLoadingGithub] = useState<boolean>(false); // Tracks if GitHub data is currently loading
    const [isGithubInsightsOpen, setIsGithubInsightsOpen] = useState<boolean>(true); // Controls visibility of the GitHub insights section
    const [showScrollTop, setShowScrollTop] = useState(false); // Controls visibility of the scroll-to-top button
    const [activeImageIndex, setActiveImageIndex] = useState(0); // Selected image for gallery display

    // --- Determine Table of Contents ---
    // Prioritize TOC data passed within the main `project` object
    const currentToc = project?.toc && project.toc.length > 0 ? project.toc : tocProp;

    // --- Effect: Fetch GitHub Data ---
    useEffect(() => {
        let isMounted = true; // Flag to prevent state updates if the component unmounts during async operations

        const fetchGithubData = async () => {
            // Only fetch if a GitHub URL is provided in the project data
            if (!project?.github) return;

            // Attempt to parse the GitHub URL
            const repoInfo = parseGitHubUrl(project.github);
            if (!repoInfo) {
                if (isMounted) setGithubError("Invalid GitHub URL format provided.");
                return;
            }

            // Reset state and set loading flag before fetching
            if (isMounted) {
                setIsLoadingGithub(true);
                setGithubError(null);
                setGithubMeta(null);
                setLanguages(null);
                setContributors([]);
            }

            try {
                // Fetch metadata, languages, and contributors concurrently
                const [metaResult, langsResult, contribsResult] = await Promise.allSettled([
                    fetchRepoMetadata(repoInfo.user, repoInfo.repo),
                    fetchRepoLanguages(repoInfo.user, repoInfo.repo),
                    fetchRepoContributors(repoInfo.user, repoInfo.repo)
                ]);

                // Only update state if the component is still mounted
                if (!isMounted) return;

                // Process metadata result
                if (metaResult.status === 'fulfilled' && metaResult.value) {
                    setGithubMeta(metaResult.value as GitHubRepoMetadata);
                } else if (metaResult.status === 'rejected') {
                    console.error("GitHub Metadata Fetch Error:", metaResult.reason);
                    // Set a user-friendly error, potentially masking specific API errors
                    throw new Error("Failed to fetch repository metadata.");
                }

                // Process languages result (don't throw error if this fails, it's less critical)
                if (langsResult.status === 'fulfilled') {
                    setLanguages(langsResult.value);
                } else {
                    console.error("GitHub Languages Fetch Error:", langsResult.reason);
                }

                // Process contributors result (don't throw error if this fails)
                if (contribsResult.status === 'fulfilled' && Array.isArray(contribsResult.value)) {
                    setContributors(contribsResult.value as GitHubContributor[]);
                } else if (contribsResult.status === 'rejected') {
                    console.error("GitHub Contributors Fetch Error:", contribsResult.reason);
                }

            } catch (error: any) {
                // Catch any error thrown (e.g., from metadata fetch) or network issues
                if (isMounted) {
                    setGithubError(error.message || "An unexpected error occurred while fetching GitHub data.");
                    console.error("GitHub Fetch Catch Block:", error);
                }
            } finally {
                // Always turn off loading indicator if component is still mounted
                if (isMounted) setIsLoadingGithub(false);
            }
        };

        fetchGithubData(); // Execute the fetch function

        // Cleanup function: Set isMounted to false when the component unmounts
        return () => {
            isMounted = false;
        };
    }, [project?.github]); // Re-run effect only if the project's github URL changes

    // --- Effect: Show/Hide Scroll-to-Top Button ---
    useEffect(() => {
        const handleScroll = () => {
            // Show button when scrolled down 300 pixels
            setShowScrollTop(window.scrollY > 300);
        };
        // Add scroll event listener
        window.addEventListener('scroll', handleScroll, { passive: true }); // Use passive listener for performance
        // Cleanup: Remove listener when component unmounts
        return () => window.removeEventListener('scroll', handleScroll);
    }, []); // Empty dependency array means this effect runs only once on mount

    // --- Function: Scroll to Top ---
    const scrollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth' // Smooth scrolling animation
        });
    };

    // --- Early Return: Handle Missing Project Data ---
    // Although the server page should handle `notFound`, this adds client-side robustness
    if (!project) {
        return (
            <div className="project-load-error container mx-auto p-8 text-center text-text-muted">
                Error: Project data is unavailable or could not be loaded.
            </div>
        );
    }

    // --- Destructure Project Properties (with default fallbacks) ---
    const {
        title = 'Untitled Project',
        category = 'Uncategorized',
        description = '',
        longDescription,
        content, // The markdown content
        date, // Publish date
        image, // Optional single featured image
        images, // Optional array of images (gallery)
        tags = [],
        github, // GitHub URL
        link, // Live project URL
        team = [], // Array of team members
        status, // e.g., 'ongoing', 'concept', 'completed'
        testimonials = [],
        license: projectLicense, // License specified in project frontmatter
        modifiedDate // Last modified date
    } = project;

    // --- Prepare Derived Variables for Display ---
    const displayStatus = status === 'ongoing' || status === 'concept' ? status : null; // Only show 'ongoing' or 'concept'
    const projectYear = date ? new Date(date).getFullYear() : null;
    const displayDescription = longDescription || description || "No detailed description available."; // Prefer long description
    const imageSources = useMemo(() => {
        const orderedSources: string[] = [];
        const seen = new Set<string>();

        const pushUnique = (src?: string | null) => {
            if (!src) return;
            if (seen.has(src)) return;
            seen.add(src);
            orderedSources.push(src);
        };

        pushUnique(image);
        if (Array.isArray(images)) {
            images.forEach(pushUnique);
        } else if (typeof images === 'string') {
            pushUnique(images);
        }

        return orderedSources;
    }, [image, images]);

    useEffect(() => {
        setActiveImageIndex(0);
    }, [project?.slug, imageSources.length]);

    const activeImageSrc = imageSources[activeImageIndex] || null;
    const hasVisuals = imageSources.length > 0; // Check if there are any images to display

    // --- Prepare GitHub Stats (Combine fetched data with project frontmatter fallbacks) ---
    const stars = githubMeta?.stargazers_count ?? getStatValue(project, 'Stars');
    const forks = githubMeta?.forks_count ?? getStatValue(project, 'Forks');
    const watchers = githubMeta?.subscribers_count ?? 0; // GitHub API uses subscribers_count for watchers
    const license = githubMeta?.license?.name ?? projectLicense ?? 'N/A'; // Prefer GitHub license name if available
    const openIssues = githubMeta?.open_issues_count ?? 0;
    const repoSize = githubMeta?.size ?? 0; // GitHub size is in KB
    const createdAt = githubMeta?.created_at ?? null; // Date repo was created
    const pushedAt = githubMeta?.pushed_at ?? modifiedDate ?? date ?? null; // Prioritize pushed_at, then modifiedDate, then date
    const sortedLanguages = languages ? Object.entries(languages).sort(([, a], [, b]) => b - a) : []; // Sort languages by byte count
    const totalBytes = sortedLanguages.reduce((sum, [, bytes]) => sum + bytes, 0); // Calculate total language bytes
    const liveUrl = link || githubMeta?.homepage || undefined; // Prefer project's explicit link, fallback to GitHub homepage

    // --- Determine Layout Class Based on TOC Presence ---
    const layoutClass = currentToc && currentToc.length > 0 ? 'layout-grid-with-toc' : 'layout-grid-no-toc';

    // --- Render Component JSX ---
    return (
        <main className="project-detail-page bg-bg-primary text-text-primary pt-8 pb-24 font-body">

            {/* Render Minimap Navigation if TOC exists */}
            {currentToc && currentToc.length > 0 && <MinimapNav toc={currentToc} />}

            {/* Main Container with Layout Grid */}
            <div className={`container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative ${layoutClass}`}>

                {/* Table of Contents Sidebar (Conditional) */}
                {currentToc && currentToc.length > 0 && (
                    <aside className="toc-sidebar sticky top-20 self-start">
                        <TableOfContents toc={currentToc} />
                    </aside>
                )}

                {/* Main Content Column */}
                <div className="main-content-area">

                    {/* Project Header Section */}
                    <header className="project-header mb-10 md:mb-12">
                        {/* Back Link */}
                        <Link href="/projects" className="back-link group mb-5">
                            <ArrowLeft size={15} className="icon"/>
                            <span>Return to Matrix</span>
                        </Link>
                        <div className="header-main">
                            <div className="header-content">
                                {/* Meta Info Badges */}
                                <div className="meta-info mb-3">
                                    {category && <span className="category-badge">{category}</span>}
                                    {projectYear && <span className="year-badge"><Clock size={11} className="icon"/>{projectYear}</span>}
                                    {displayStatus && <span className={`status-badge status-${displayStatus}`}>{displayStatus}</span>}
                                    {github && stars > 0 && <span className="meta-chip github-stat" title={`${stars.toLocaleString()} Stars`}> <Star size={12} className="icon"/> {stars.toLocaleString()} </span> }
                                    {github && forks > 0 && <span className="meta-chip github-stat" title={`${forks.toLocaleString()} Forks`}> <GitFork size={12} className="icon"/> {forks.toLocaleString()} </span> }
                                </div>
                                {/* Project Title (with optional popout effect) */}
                                <h1 className="project-title project-title-popout" data-text={title}>{title}</h1>
                                {/* Project Description */}
                                <p className="project-description">{displayDescription}</p>
                            </div>
                            {/* Action Buttons (Live Link, GitHub Link) */}
                            <div className="action-buttons mt-5 flex flex-wrap items-start gap-3">
                                {liveUrl && ( <Link href={liveUrl} target="_blank" rel="noopener noreferrer" className="btn-glow"> <ExternalLink size={14} className="mr-1.5" /> View Live </Link> )}
                                {github && ( <Link href={github} target="_blank" rel="noopener noreferrer" className="btn-outline"> <Github size={14} className="mr-1.5" /> View Code </Link> )}
                            </div>
                        </div>
                    </header>

                    {/* Project Visuals Section (Image/Gallery or Placeholder) */}
                    {hasVisuals ? (
                         <section className="project-visuals mb-10 md:mb-12 themed-box !p-0 bg-gradient-to-br from-bg-secondary via-bg-tertiary to-bg-secondary">
                            {/* Primary Image */}
                             {activeImageSrc && (
                                 <div className="main-image-wrapper">
                                     <Image
                                        src={activeImageSrc}
                                        alt={`${title} visual`}
                                        width={1280}
                                        height={720}
                                        className="visual-image"
                                        priority={activeImageIndex === 0}
                                     />
                                 </div>
                             )}
                             {/* Sub-Gallery */}
                             {imageSources.length > 1 && (
                                 <div className="sub-gallery" role="list">
                                     {imageSources.map((imgSrc, idx) => (
                                         <button
                                            key={`${imgSrc}-${idx}`}
                                            type="button"
                                            role="listitem"
                                            className={`sub-gallery-item ${idx === activeImageIndex ? 'active' : ''}`}
                                            onClick={() => setActiveImageIndex(idx)}
                                            aria-current={idx === activeImageIndex}
                                         >
                                              <Image
                                                 src={imgSrc}
                                                 alt={`${title} thumbnail ${idx + 1}`}
                                                 width={400}
                                                 height={250}
                                                 className="sub-gallery-image"
                                                 loading={idx === activeImageIndex ? 'eager' : 'lazy'}
                                              />
                                         </button>
                                     ))}
                                 </div>
                             )}
                         </section>
                      ) : (
                          // Placeholder if no visuals are provided
                          <section className="project-visuals placeholder-visuals mb-10 md:mb-12">
                              <div className="placeholder-icon"><ImageIcon size={48} strokeWidth={1}/></div>
                              <AsciiArtPlaceholder width="125px" height="250px" animate={true} className="ascii-placeholder-detail"/>
                          </section>
                      )}

                    {/* Markdown Content Section */}
                    {content ? (
                        // Render markdown content using the project-specific renderer
                        <section id="project-content-start" className="project-content-wrapper mb-10 md:mb-12" aria-label="Project Details">
                            <ProjectMarkdownRenderer className="project-prose max-w-none">
                                {content}
                            </ProjectMarkdownRenderer>
                        </section>
                    ) : (
                        // Fallback message if no content exists
                        <section className="project-prose max-w-none mb-10 md:mb-12">
                            <p className="italic text-text-muted font-mono">// Detailed documentation stream offline or redacted. //</p>
                        </section>
                    )}

                    {/* Tags Section */}
                    {tags && tags.length > 0 && (
                         <section className="tags-section themed-box mb-8 md:mb-12">
                             <div className="box-header simple">
                                 <Tag size={16} className="header-icon text-purple-400"/>
                                 <h3 className="box-title !text-base">Keywords & Concepts</h3>
                             </div>
                             <div className="box-content">
                                 <div className="tags-list">
                                     {tags.map(tag => ( <span key={tag} className="tag-chip">{tag}</span> ))}
                                 </div>
                             </div>
                         </section>
                     )}

                    {/* GitHub Insights Section (Collapsible) */}
                    {github && (isLoadingGithub || githubMeta || githubError) && (
                        <section className="github-insights themed-box mb-8 md:mb-12">
                            {/* Header Button to Toggle Collapse */}
                             <button className="box-header collapsible-header" onClick={() => setIsGithubInsightsOpen(!isGithubInsightsOpen)} aria-expanded={isGithubInsightsOpen} aria-controls="github-insights-content">
                                 <div className="header-left">
                                     <Github size={18} className="header-icon text-cyan-400"/>
                                     <h2 className="box-title">GitHub Repository Insights</h2>
                                 </div>
                                 <div className="header-right">
                                     {/* Loading/Error Indicators */}
                                     {isLoadingGithub && <span className="loading-indicator">Syncing...</span>}
                                     {githubError && <span title={githubError}><AlertTriangle size={16} className="error-icon"/></span>}
                                     {/* Chevron Icon */}
                                     <span className={`chevron-icon ${isGithubInsightsOpen ? 'open' : ''}`}>
                                         <ChevronDown size={20}/>
                                     </span>
                                 </div>
                             </button>
                             {/* Collapsible Content */}
                             {isGithubInsightsOpen && (
                                 <div id="github-insights-content" className="box-content">
                                     {/* Error Message */}
                                     {githubError && !isLoadingGithub && (<div className="error-message">{githubError}</div>)}
                                     {/* Loading Placeholder */}
                                     {!githubError && isLoadingGithub && (<div className="loading-placeholder">// Establishing uplink to GitHub... //</div>)}
                                     {/* Fallback if no meta loaded */}
                                     {!githubError && !isLoadingGithub && !githubMeta && (<div className="error-message">No GitHub metadata available.</div>)}
                                     {/* Main GitHub Data Grid */}
                                     {!githubError && githubMeta && (
                                         <div className="grid gap-y-5 gap-x-6 sm:grid-cols-2 lg:grid-cols-3">
                                             {/* Stats Items */}
                                             <div className="stat-item"><Star size={15} className="icon text-yellow-400"/><span>Stars:</span> <strong>{stars > 0 ? stars.toLocaleString() : '0'}</strong></div>
                                             <div className="stat-item"><GitFork size={15} className="icon text-blue-400"/><span>Forks:</span> <strong>{forks > 0 ? forks.toLocaleString() : '0'}</strong></div>
                                             <div className="stat-item"><Eye size={15} className="icon text-green-400"/><span>Watchers:</span> <strong>{watchers > 0 ? watchers.toLocaleString() : '0'}</strong></div>
                                             <div className="stat-item"><AlertTriangle size={15} className="icon text-orange-400"/><span>Open Issues:</span> <strong>{openIssues > 0 ? openIssues.toLocaleString() : '0'}</strong></div>
                                             <div className="stat-item"><ShieldCheck size={15} className="icon text-teal-400"/><span>License:</span> <strong>{license || 'N/A'}</strong></div>
                                             <div className="stat-item"><Layers size={15} className="icon text-indigo-400"/><span>Repo Size:</span> <strong>{repoSize > 0 ? formatBytes(repoSize * 1024) : '-'}</strong></div>
                                             {createdAt && <div className="stat-item"><CalendarDays size={15} className="icon text-gray-400"/><span>Created:</span> <strong title={new Date(createdAt).toLocaleString()}>{timeAgo(createdAt)}</strong></div>}
                                             {pushedAt && <div className="stat-item"><Activity size={15} className="icon text-gray-400"/><span>Last Push:</span> <strong title={new Date(pushedAt).toLocaleString()}>{timeAgo(pushedAt)}</strong></div>}
                                             {githubMeta.homepage && <div className="stat-item sm:col-span-2 lg:col-span-1"><ExternalLink size={15} className="icon text-cyan-400"/><span>Homepage:</span> <strong><a href={githubMeta.homepage} target="_blank" rel="noopener noreferrer" className="link-hover">{githubMeta.homepage}</a></strong></div>}

                                             {/* Languages Section */}
                                             {languages && totalBytes > 0 && (
                                                 <div className="language-section sm:col-span-2 lg:col-span-3">
                                                     <h4 className="sub-heading">// Language Distribution</h4>
                                                     <div className="language-bars">
                                                         {sortedLanguages.map(([lang, bytes]) => {
                                                             const percentage = totalBytes > 0 ? Math.max(0.5, parseFloat(((bytes / totalBytes) * 100).toFixed(1))) : 0;
                                                             const langClass = lang.toLowerCase().replace(/[^a-z0-9]/g, ''); // Class-safe name
                                                             return (
                                                                 <div key={lang} className="language-bar-item" title={`${lang}: ${formatBytes(bytes)} (${percentage}%)`}>
                                                                     <div className="lang-label">{lang} <span className="lang-percent">({percentage}%)</span></div>
                                                                     <div className="lang-bar-bg">
                                                                         {/* Apply language-specific class for color */}
                                                                         <div className={`lang-bar-fg lang-color-${langClass}`} style={{ width: `${percentage}%` }}></div>
                                                                     </div>
                                                                 </div>
                                                             );
                                                         })}
                                                     </div>
                                                 </div>
                                             )}

                                             {/* Contributors Section */}
                                             {contributors && contributors.length > 0 && (
                                                 <div className="contributors-section sm:col-span-full">
                                                     <h4 className="sub-heading">// Top Contributors</h4>
                                                     <div className="contributor-list">
                                                         {/* Show top 18 contributors */}
                                                         {contributors.slice(0, 18).map(c => (
                                                             <Link key={c.id} href={c.html_url || '#'} target="_blank" rel="noopener noreferrer" className="contributor-item group" title={`${c.login} (${c.contributions} contributions)`}>
                                                                 <Image src={c.avatar_url || '/images/default-avatar.png'} // Provide a default avatar path
                                                                        alt={`${c.login} avatar`} width={36} height={36} className="contributor-avatar"/>
                                                                 <span className="contributor-login">{c.login}</span>
                                                             </Link>
                                                         ))}
                                                         {/* Indicate if there are more contributors */}
                                                         {contributors.length > 18 && <span className="contributor-more">...</span>}
                                                     </div>
                                                 </div>
                                             )}
                                         </div>
                                     )}
                                 </div>
                             )}
                        </section>
                     )}

                    {/* Team / Author Section */}
                     {(team && team.length > 0) || githubMeta?.owner ? (
                           <section className="team-section themed-box mb-8 md:mb-12">
                               <div className="box-header simple">
                                   <Users size={18} className="header-icon text-green-400"/>
                                   <h2 className="box-title !text-lg">{team && team.length > 0 ? 'Core Team' : 'Repository Owner'}</h2>
                               </div>
                              <div className="box-content grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                                   {/* Display project team if available */}
                                   {team && team.length > 0 ? (
                                       team.map((member, index) => (
                                           <div key={index} className="team-member group">
                                               {member.photo ? <Image src={member.photo} alt={member.name || 'Team member'} width={40} height={40} className="team-photo" /> : <div className="team-photo-placeholder"><Users size={18}/></div> }
                                               <div className="member-info">
                                                   <span className="member-name">{member.name || 'Contributor'}</span>
                                                   {member.role && <span className="member-role">{member.role}</span>}
                                               </div>
                                               {member.link && <Link href={member.link} target="_blank" rel="noopener noreferrer" className="member-link" title={`Visit ${member.name}'s profile`}><ExternalLink size={15}/></Link>}
                                           </div>
                                       ))
                                   )
                                   // Fallback to GitHub owner if no team defined
                                   : githubMeta?.owner ? (
                                       <div className="team-member group">
                                           {githubMeta.owner.avatar_url && <Image src={githubMeta.owner.avatar_url} alt={githubMeta.owner.login || 'Owner'} width={40} height={40} className="team-photo" />}
                                           <div className="member-info">
                                               <span className="member-name">{githubMeta.owner.login || 'Owner'}</span>
                                               <span className="member-role">Repository Maintainer</span>
                                           </div>
                                           {githubMeta.owner.html_url && <Link href={githubMeta.owner.html_url} target="_blank" rel="noopener noreferrer" className="member-link" title={`Visit ${githubMeta.owner.login}'s GitHub`}><Github size={15}/></Link>}
                                       </div>
                                   )
                                   : null}
                               </div>
                           </section>
                       ) : null}

                    {/* Testimonials Section */}
                     {testimonials && testimonials.length > 0 && (
                           <section className="testimonials-section mb-8 md:mb-12">
                               <h2 className="section-heading mb-6"><MessageSquare size={18} className="icon"/> Feedback Stream</h2>
                               <div className="testimonial-grid">
                                   {testimonials.map((t, i) => (
                                       <blockquote key={i} className="testimonial-item">
                                           <p className="testimonial-quote">"{t.quote}"</p>
                                           <footer className="testimonial-author">
                                               – {t.author}{t.role && <span className="testimonial-role">, {t.role}</span>}
                                           </footer>
                                       </blockquote>
                                   ))}
                               </div>
                           </section>
                       )}

                    {/* Related Projects Section */}
                     {relatedProjects.length > 0 && (
                           <section className="related-projects mt-12 md:mt-16">
                               <h2 className="related-heading">// Related Signals //</h2>
                               <div className="related-grid">
                                   {/* Ensure ProjectCard component exists and accepts 'project' prop */}
                                   {relatedProjects.map(p => p ? <ProjectCard key={p.slug} project={p} /> : null)}
                               </div>
                           </section>
                       )}

                </div> {/* End Main Content Area */}
            </div> {/* End Container / Layout Grid */}

            {/* Scroll To Top Button (Conditional Rendering) */}
             {showScrollTop && (
                <button
                    onClick={scrollToTop}
                    className="scroll-to-top-button"
                    aria-label="Scroll to top"
                    title="Scroll to top"
                >
                    {/* Centered Icon */}
                    <ArrowUpCircle size={28} strokeWidth={1.5} />
                </button>
            )}

            {/* --- Inline JSX Styles --- */}
            {/* Note: It's often better to move complex styles to dedicated CSS files */}
            <style jsx>{`
                /* --- Base & Layout --- */
                .project-detail-page { background: var(--bg-gradient-darker, var(--bg-primary)); padding-bottom: 6rem; }
                .layout-grid-with-toc { display: grid; grid-template-columns: 220px 1fr; gap: 2.5rem; align-items: start; }
                .layout-grid-no-toc { display: block; max-width: 900px; /* Center content if no TOC */ margin-left: auto; margin-right: auto; }
                .toc-sidebar { width: 220px; max-height: calc(100vh - 7rem); /* Ensure vertical space */ position: sticky; top: calc(var(--header-height, 65px) + 1.5rem); /* Adjust offset based on actual header height */ }
                .main-content-area { min-width: 0; /* Prevent flex/grid blowout */ }
                @media (max-width: 1100px) { .layout-grid-with-toc { grid-template-columns: 180px 1fr; gap: 1.5rem; } .toc-sidebar { width: 180px; } }
                @media (max-width: 800px) { .layout-grid-with-toc { display: block; } .toc-sidebar { position: relative; top: 0; width: 100%; margin-bottom: 2rem; max-height: 40vh; border-right: none; border-bottom: 1px solid var(--bg-tertiary); padding-right: 0; padding-bottom: 1rem; overflow-y: auto; /* Allow scrolling if content overflows */ } }
                .project-load-error { padding: 4rem 1rem; text-align: center; }

                /* --- Header Elements --- */
                .project-header { border-bottom: 1px solid var(--bg-tertiary); padding-bottom: 2rem; margin-bottom: 2.5rem; }
                .back-link { display: inline-flex; align-items: center; gap: 0.4rem; color: var(--text-muted); font-size: 0.8rem; margin-bottom: 1.2rem; transition: color var(--transition-fast), transform var(--transition-fast); font-family: var(--font-mono); text-transform: uppercase; letter-spacing: 0.05em; }
                .back-link:hover { color: var(--accent-highlight); } .back-link .icon { transition: transform 0.2s ease-out; } .back-link:hover .icon { transform: translateX(-4px); }
                .meta-info { display: flex; flex-wrap: wrap; gap: 0.7rem; align-items: center; margin-bottom: 1rem; }
                .category-badge { font-family: var(--font-mono); font-size: 0.75rem; font-weight: 600; letter-spacing: 0.05em; text-transform: uppercase; background-color: var(--accent-secondary); color: var(--bg-primary); padding: 5px 10px; border-radius: 4px; box-shadow: 1px 1px 2px rgba(0,0,0,0.3); white-space: nowrap; border: 1px solid rgba(var(--bg-primary-rgb, 255, 255, 255), 0.3); /* Added fallback RGB */ }
                .year-badge, .status-badge, .meta-chip { display: inline-flex; align-items: center; gap: 0.4rem; font-family: var(--font-mono); font-size: 0.75rem; color: var(--text-secondary); background: rgba(var(--bg-secondary-rgb, 245, 237, 225), 0.85); /* Added fallback RGB */ padding: 5px 10px; border-radius: 4px; border: 1px solid var(--bg-tertiary); white-space: nowrap; box-shadow: inset 0 1px 1px rgba(0,0,0,0.1); backdrop-filter: blur(2px); }
                .meta-chip .icon { opacity: 0.7; font-size: 0.9em; margin-right: 0.1em; }
                .status-badge { font-size: 0.7rem; font-weight: 700; text-transform: uppercase; padding: 3px 7px; border-radius: 3px; letter-spacing: 0.06em; }
                .status-badge.status-ongoing { background-color: var(--accent-alert); color: var(--bg-primary); border-color: transparent; }
                .status-badge.status-concept { background-color: var(--accent-muted1); color: var(--bg-primary); border-color: transparent; }
                .meta-chip.github-stat { background-color: rgba(var(--bg-tertiary-rgb, 237, 228, 214), 0.8); /* Added fallback RGB */ color: var(--text-secondary); border-color: rgba(var(--accent-secondary-rgb, 126, 161, 150), 0.3); /* Added fallback RGB */ }
                .meta-chip.github-stat .icon { color: var(--accent-secondary); }
                .project-title { font-size: clamp(2.2rem, 6vw, 4rem); margin-bottom: 0.6rem; color: var(--text-heading); font-family: var(--font-display); font-weight: 800; line-height: 1.1; letter-spacing: -0.02em; }
                /* Optional: Popout effect - remove if too ornate for projects */
                .project-title-popout { display: inline-block; transform-style: preserve-3d; transform: translateZ(20px) rotateX(-7deg); text-shadow: 1px 1px 0px rgba(0,0,0, 0.18), 2px 2px 0px rgba(0,0,0, 0.15), 3px 3px 0px rgba(0,0,0, 0.12), 4px 4px 0px rgba(0,0,0, 0.09), 0 0 20px rgba(var(--accent-highlight-rgb, 184, 142, 98), 0.4); /* Added fallback RGB */ transition: text-shadow 0.3s ease-out, transform 0.3s ease-out; }
                .project-title-popout:hover { transform: translateZ(24px) rotateX(-8deg); text-shadow: 1px 1px 0px rgba(0,0,0, 0.22), 2px 2px 0px rgba(0,0,0, 0.20), 3px 3px 0px rgba(0,0,0, 0.18), 4px 4px 0px rgba(0,0,0, 0.16), 5px 5px 0px rgba(0,0,0, 0.14), 0 0 25px rgba(var(--accent-highlight-rgb, 184, 142, 98), 0.5); /* Added fallback RGB */ }
                .project-description { font-size: clamp(1rem, 2.1vw, 1.2rem); color: var(--text-secondary); margin-top: 0.8rem; margin-bottom: 1.8rem; max-width: 70ch; line-height: 1.7; opacity: 0.95; }

                /* --- Visuals --- */
                .project-visuals { margin-bottom: 2rem; }
                .themed-box.project-visuals { border-color: var(--bg-tertiary); border-radius: var(--radius-lg); overflow:hidden; } /* Ensure radius clips content */
                .main-image-wrapper { position: relative; aspect-ratio: 16 / 9; overflow: hidden; border-radius: var(--radius-lg) var(--radius-lg) 0 0; /* Apply radius only to top if sub-gallery exists */ }
                .themed-box.project-visuals:not(:has(.sub-gallery)) .main-image-wrapper { border-radius: inherit; /* Apply to all corners if no sub-gallery */ }
                .visual-image { display: block; width: 100%; height: 100%; object-fit: cover; }
                .sub-gallery { display: grid; grid-template-columns: repeat(auto-fill, minmax(150px, 1fr)); gap: 0.8rem; padding: 0.8rem; border-top: 1px solid rgba(var(--accent-highlight-rgb, 184, 142, 98), 0.1); /* Added fallback RGB */ }
                .sub-gallery-item { border-radius: var(--radius-base); overflow: hidden; border: 1px solid var(--bg-tertiary); transition: transform 0.2s ease, box-shadow 0.2s ease, border-color 0.2s ease; box-shadow: var(--shadow-low); cursor: pointer; padding: 0; background: transparent; display: block; position: relative; }
                .sub-gallery-item:hover { transform: scale(1.04); z-index: 2; box-shadow: var(--shadow-medium); }
                .sub-gallery-item:focus-visible { outline: 2px solid var(--accent-highlight); outline-offset: 2px; }
                .sub-gallery-item.active { border-color: var(--accent-highlight); box-shadow: var(--shadow-medium); transform: scale(1.02); }
                .sub-gallery-item.active:hover { transform: scale(1.02); }
                .sub-gallery-image { display: block; width: 100%; height: 100%; object-fit: cover; }
                .placeholder-visuals { border: 2px dashed rgba(var(--accent-secondary-rgb, 126, 161, 150), 0.4); /* Added fallback RGB */ border-radius: var(--radius-xl); padding: 2rem; background: rgba(var(--bg-secondary-rgb, 245, 237, 225), 0.6); /* Added fallback RGB */ display: flex; flex-direction: column; align-items: center; justify-content: center; min-height: 300px; gap: 1rem; }
                .placeholder-icon { color: var(--accent-secondary); opacity: 0.3; }
                .ascii-placeholder-detail { color: var(--accent-secondary); opacity: 0.4; font-size: 0.7rem; line-height: 1.1; }

                /* --- Content Wrapper --- */
                .project-content-wrapper { /* Styles for this wrapper if needed */ }

                /* --- Themed Box (used for sections) --- */
                .themed-box { border: 1px solid rgba(var(--accent-highlight-rgb, 184, 142, 98), 0.15); /* Added fallback RGB */ border-radius: var(--radius-lg); background: linear-gradient(rgba(var(--bg-secondary-rgb, 245, 237, 225), 0.6), rgba(var(--bg-tertiary-rgb, 237, 228, 214), 0.7)); /* Added fallback RGBs */ backdrop-filter: blur(7px); box-shadow: var(--shadow-low); overflow: hidden; transition: border-color 0.3s, box-shadow 0.3s; }
                .themed-box:hover { border-color: rgba(var(--accent-highlight-rgb, 184, 142, 98), 0.3); /* Added fallback RGB */ box-shadow: var(--shadow-medium); }
                .box-header { display: flex; align-items: center; justify-content: space-between; padding: 0.9rem 1.3rem; background: rgba(var(--bg-tertiary-rgb, 237, 228, 214), 0.5); /* Added fallback RGB */ border-bottom: 1px solid rgba(var(--accent-highlight-rgb, 184, 142, 98), 0.15); /* Added fallback RGB */ transition: background-color 0.2s; }
                .box-header.simple { background: none; border-bottom: 1px dashed rgba(var(--accent-highlight-rgb, 184, 142, 98), 0.15); /* Added fallback RGB */ padding: 0.6rem 0; margin: 0 1.3rem; }
                .collapsible-header { width: 100%; background: none; border: none; text-align: left; cursor: pointer; padding: 0.9rem 1.3rem; /* Match box-header padding */ display: flex; align-items: center; justify-content: space-between; border-bottom: 1px solid rgba(var(--accent-highlight-rgb, 184, 142, 98), 0.15); /* Added fallback RGB */ }
                .collapsible-header:hover { background: rgba(var(--accent-highlight-rgb, 184, 142, 98), 0.05); } /* Added fallback RGB */
                .header-left { display: flex; align-items: center; gap: 0.8rem; }
                .header-right { display: flex; align-items: center; gap: 0.8rem; }
                .header-icon { color: var(--accent-highlight); opacity: 0.9; flex-shrink: 0; }
                .box-title { font-family: var(--font-display); font-size: 1.15rem; font-weight: 600; color: var(--text-heading); margin: 0; line-height: 1.2; }
                .loading-indicator { font-family: var(--font-mono); font-size: 0.7rem; color: var(--text-muted); font-style: italic; opacity: 0.8; animation: pulse-bg 1.5s infinite alternate; }
                .error-icon { color: var(--accent-alert); }
                .chevron-icon { color: var(--text-muted); transition: transform 0.25s ease-out; }
                .chevron-icon.open { transform: rotate(180deg); }
                .box-content { padding: 1.3rem 1.5rem; }
                @keyframes pulse-bg { from { opacity: 0.6; } to { opacity: 0.9; } }

                /* --- GitHub Insights --- */
                .github-insights .stat-item { display: flex; align-items: center; gap: 0.6rem; font-size: 0.8rem; font-family: var(--font-mono); color: var(--text-secondary); line-height: 1.5; border-bottom: 1px solid rgba(var(--bg-tertiary-rgb, 237, 228, 214), 0.7); /* Added fallback RGB */ padding-bottom: 0.6rem; }
                .stat-item .icon { flex-shrink: 0; opacity: 0.8; width: 16px; height: 16px; }
                .stat-item span { opacity: 0.9; min-width: 80px; color: var(--text-muted); }
                .stat-item strong { color: var(--text-primary); font-weight: 600; word-break: break-word; }
                .stat-item strong a { color: var(--accent-highlight); text-decoration: none; border-bottom: 1px dotted currentColor; transition: color 0.2s, border-color 0.2s; }
                .stat-item strong a:hover { color: var(--text-bright, var(--text-heading)); border-bottom-color: var(--accent-highlight); border-bottom-style: solid; }
                .language-section, .contributors-section { margin-top: 1.2rem; padding-top: 1.2rem; border-top: 1px dashed rgba(var(--accent-highlight-rgb, 184, 142, 98), 0.2); /* Added fallback RGB */ }
                .sub-heading { font-family: var(--font-mono); font-size: 0.85rem; text-transform: uppercase; letter-spacing: 0.1em; color: var(--text-secondary); margin-bottom: 0.8rem; opacity: 0.9; border-left: 3px solid var(--accent-highlight); padding-left: 0.6em; }
                .language-bars { display: flex; flex-direction: column; gap: 0.5rem; }
                .language-bar-item { font-size: 0.8rem; font-family: var(--font-mono); }
                .lang-label { display: flex; justify-content: space-between; margin-bottom: 0.25rem; color: var(--text-secondary); font-size: 0.9em; }
                .lang-percent { opacity: 0.7; font-size: 0.9em; }
                .lang-bar-bg { width: 100%; height: 8px; background-color: rgba(var(--bg-tertiary-rgb, 237, 228, 214), 0.8); /* Added fallback RGB */ border-radius: 4px; overflow: hidden; box-shadow: inset 0 1px 2px rgba(0,0,0,0.25); }
                .lang-bar-fg { height: 100%; background: linear-gradient(90deg, var(--accent-primary), var(--accent-highlight)); border-radius: 4px; transition: width 0.6s ease-out; box-shadow: 0 0 5px rgba(var(--accent-highlight-rgb, 184, 142, 98), 0.3); /* Added fallback RGB */ }
                /* Add specific language colors using classes like .lang-color-javascript */
                .lang-color-javascript { background: linear-gradient(90deg, #f7df1e, #f0db4f) !important; box-shadow: 0 0 5px #f7df1e80 !important; }
                .lang-color-typescript { background: linear-gradient(90deg, #3178c6, #569cd6) !important; box-shadow: 0 0 5px #3178c680 !important; }
                .lang-color-python { background: linear-gradient(90deg, #3776ab, #4b8bbe) !important; box-shadow: 0 0 5px #3776ab80 !important; }
                .lang-color-css { background: linear-gradient(90deg, #1572b6, #3c99dc) !important; box-shadow: 0 0 5px #1572b680 !important; }
                .lang-color-html { background: linear-gradient(90deg, #e34f26, #f16529) !important; box-shadow: 0 0 5px #e34f2680 !important; }
                /* Add more colors... */
                .contributor-list { display: flex; flex-wrap: wrap; gap: 0.6rem; align-items: center; }
                .contributor-item { display: inline-flex; align-items: center; gap: 0.5rem; background: rgba(var(--bg-secondary-rgb, 245, 237, 225), 0.7); /* Added fallback RGB */ padding: 0.3rem 0.7rem 0.3rem 0.3rem; border-radius: 99px; border: 1px solid var(--bg-tertiary); transition: all 0.2s ease; text-decoration: none; }
                .contributor-item:hover { background: var(--bg-tertiary); border-color: var(--accent-primary); transform: translateY(-1px); box-shadow: var(--shadow-low); }
                .contributor-avatar { width: 36px; height: 36px; border-radius: 50%; object-fit: cover; border: 2px solid var(--bg-primary); }
                .contributor-login { font-family: var(--font-mono); font-size: 0.8rem; color: var(--text-secondary); transition: color 0.2s ease; }
                .contributor-item:hover .contributor-login { color: var(--accent-primary); }
                .contributor-more { font-family: var(--font-mono); font-size: 0.8rem; color: var(--text-muted); padding-left: 0.6rem; font-style: italic; }
                .error-message { font-family: var(--font-mono); color: var(--accent-alert); background: rgba(var(--accent-alert-rgb, 208, 118, 118), 0.1); /* Added fallback RGB */ border: 1px solid rgba(var(--accent-alert-rgb, 208, 118, 118), 0.3); /* Added fallback RGB */ padding: 0.8rem 1rem; border-radius: var(--radius-base); text-align: center; font-size: 0.85rem; }
                .loading-placeholder { font-family: var(--font-mono); color: var(--text-muted); padding: 1.5rem; border: 1px dashed var(--bg-tertiary); text-align: center; border-radius: var(--radius-base); background: rgba(var(--bg-secondary-rgb, 245, 237, 225), 0.6); /* Added fallback RGB */ animation: pulse-bg 1.5s infinite alternate; font-size: 0.9rem; }

                /* --- Team Section --- */
                .team-section .box-header .icon { color: var(--accent-secondary); }
                .team-member { display: flex; align-items: center; gap: 0.8rem; background-color: rgba(var(--bg-secondary-rgb, 245, 237, 225), 0.7); /* Added fallback RGB */ padding: 0.6rem 0.8rem; border-radius: var(--radius-base); border: 1px solid var(--bg-tertiary); transition: background-color 0.2s ease, border-color 0.2s ease, transform 0.2s ease; }
                .team-member:hover { background-color: rgba(var(--bg-tertiary-rgb, 237, 228, 214), 0.9); /* Added fallback RGB */ border-color: rgba(var(--accent-secondary-rgb, 126, 161, 150), 0.4); /* Added fallback RGB */ transform: translateY(-1px); }
                .team-photo { width: 40px; height: 40px; border-radius: 50%; object-fit: cover; border: 2px solid var(--bg-primary); flex-shrink: 0; }
                .team-photo-placeholder { width: 40px; height: 40px; border-radius: 50%; background: var(--bg-secondary); border: 1px solid var(--bg-tertiary); display: flex; align-items: center; justify-content: center; color: var(--text-muted); flex-shrink: 0; }
                .member-info { display: flex; flex-direction: column; line-height: 1.3; flex-grow: 1; }
                .member-name { font-weight: 600; color: var(--text-heading); font-size: 0.9rem; }
                .member-role { font-size: 0.8rem; color: var(--text-secondary); opacity: 0.9; }
                .member-link { color: var(--text-muted); margin-left: auto; padding: 0.3rem; border-radius: 50%; transition: color var(--transition-fast), background-color var(--transition-fast); display: inline-flex; align-items: center; justify-content: center; }
                .member-link:hover { color: var(--accent-highlight); background-color: rgba(var(--accent-highlight-rgb, 184, 142, 98), 0.1); /* Added fallback RGB */ }

                /* --- Tags Section --- */
                .tags-section .box-header .icon { color: var(--accent-muted1); } /* Example color */
                .tags-list { display: flex; flex-wrap: wrap; gap: 0.6rem; }
                .tag-chip { background-color: rgba(var(--accent-muted1-rgb, 212, 187, 201), 0.25); /* Added fallback RGB */ color: var(--accent-muted1); border: 1px solid rgba(var(--accent-muted1-rgb, 212, 187, 201), 0.4); /* Added fallback RGB */ font-size: 0.75rem; padding: 4px 10px; border-radius: var(--radius-pill); /* Pill shape */ box-shadow: none; cursor: default; font-family: var(--font-mono); transition: all var(--transition-fast); line-height: 1.4; text-transform: lowercase; }
                .tag-chip:hover { background-color: rgba(var(--accent-muted1-rgb, 212, 187, 201), 0.4); /* Added fallback RGB */ color: var(--text-heading); border-color: var(--accent-muted1); }

                /* --- Testimonials Section --- */
                .testimonials-section { margin-top: 2rem; }
                .testimonials-section .section-heading { font-size: 1.4rem; color: var(--accent-secondary); border-bottom: 1px solid var(--bg-tertiary); padding-bottom: 0.5rem; display: flex; align-items: center; gap: 0.5rem; }
                .testimonials-section .section-heading .icon { color: currentColor; }
                .testimonial-grid { display: grid; gap: 1.5rem; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); }
                .testimonial-item { background: rgba(var(--bg-secondary-rgb, 245, 237, 225), 0.7); /* Added fallback RGB */ border-left: 4px solid var(--accent-secondary); padding: 1.5rem; border-radius: var(--radius-base); /* Simpler radius */ box-shadow: none; border: 1px solid var(--bg-tertiary); border-left-width: 4px; /* Keep left border emphasis */ }
                .testimonial-quote { font-style: italic; color: var(--text-secondary); line-height: 1.7; margin-bottom: 1rem; position: relative; padding-left: 0; font-size: 1rem; }
                .testimonial-quote::before { content: none; /* Removed large quote mark */ }
                .testimonial-author { font-weight: 600; color: var(--text-primary); font-size: 0.9rem; display: block; text-align: right; margin-top: 1rem; }
                .testimonial-role { font-size: 0.8rem; color: var(--text-secondary); opacity: 0.8; display: inline; }

                /* --- Related Projects --- */
                .related-projects { border-top: 1px solid var(--bg-tertiary); padding-top: 2.5rem; margin-top: 3rem; }
                .related-heading { font-family: var(--font-body); font-size: 1.4rem; font-weight: 600; color: var(--text-secondary); margin-bottom: 1.5rem; text-align: center; letter-spacing: 0; opacity: 1; text-shadow: none; } /* Simplified heading */
                .related-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(min(100%, 250px), 1fr)); gap: 1.2rem; }

                /* --- Common Buttons & Links (Modernized slightly) --- */
                .btn-glow, .btn-outline { display: inline-flex; align-items: center; justify-content: center; gap: 0.5rem; padding: 0.7rem 1.4rem; border-radius: var(--radius-base); font-size: 0.85rem; font-weight: 600; font-family: var(--font-mono); letter-spacing: 0.04em; text-transform: uppercase; cursor: pointer; transition: all 0.25s ease; border: 1px solid transparent; text-decoration: none; line-height: 1; }
                .btn-glow { background: var(--accent-primary); color: var(--text-on-accent); border-color: transparent; box-shadow: 0 2px 5px rgba(var(--accent-primary-rgb, 182, 104, 128), 0.3); /* Added fallback RGB */ }
                .btn-glow:hover { filter: brightness(1.1); box-shadow: 0 4px 8px rgba(var(--accent-primary-rgb, 182, 104, 128), 0.4); /* Added fallback RGB */ transform: translateY(-1px); }
                .btn-outline { border: 1px solid var(--accent-secondary); color: var(--accent-secondary); background: transparent; backdrop-filter: none; }
                .btn-outline:hover { background: rgba(var(--accent-secondary-rgb, 126, 161, 150), 0.1); /* Added fallback RGB */ color: var(--accent-highlight); border-color: var(--accent-highlight); transform: translateY(-1px); }
                .link-hover { color: var(--accent-highlight); border-bottom: 1px dotted currentColor; transition: color 0.2s, border-color 0.2s; display: inline; }
                .link-hover:hover { color: var(--text-bright, var(--text-heading)); border-bottom-color: var(--accent-highlight); border-bottom-style: solid; }

                /* --- Scroll-to-Top Button (Fixes & Centering) --- */
                .scroll-to-top-button {
                    position: fixed;
                    bottom: 2rem;
                    right: 2rem; /* Position bottom-right */
                    z-index: 50; /* Ensure it's above other content */
                    /* Button Appearance */
                    background-color: rgba(var(--bg-tertiary-rgb, 237, 228, 214), 0.8); /* Use a theme variable */
                    color: var(--accent-primary);
                    border: 1px solid rgba(var(--accent-primary-rgb, 182, 104, 128), 0.3); /* Optional subtle border */
                    border-radius: 50%; /* Make it circular */
                    width: 48px; /* Fixed size */
                    height: 48px;
                    /* Centering Icon Inside */
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    /* Interaction */
                    cursor: pointer;
                    backdrop-filter: blur(5px); /* Optional blur effect */
                    box-shadow: var(--shadow-medium); /* Use theme shadow */
                    opacity: 0; /* Start hidden */
                    transform: translateY(20px); /* Start slightly lower */
                    transition: transform 0.3s ease-out, background-color 0.3s ease-out, color 0.3s ease-out, opacity 0.3s ease-out, box-shadow 0.3s ease-out;
                }
                /* Style when visible (add this class via state/effect) */
                .scroll-to-top-button.visible {
                    opacity: 0.9; /* Make it slightly transparent */
                    transform: translateY(0); /* Slide into view */
                }
                .scroll-to-top-button:hover {
                    transform: scale(1.1); /* Slightly larger on hover */
                    background-color: rgba(var(--accent-primary-rgb, 182, 104, 128), 0.9); /* Use accent color */
                    color: var(--text-on-accent); /* Ensure contrast on accent */
                    opacity: 1;
                    box-shadow: var(--shadow-high, 0 10px 30px rgba(0,0,0,0.3)); /* Optional higher shadow */
                }
                .scroll-to-top-button:active {
                    transform: scale(1.05); /* Slight press effect */
                }

            `}</style>
        </main>
    );
}