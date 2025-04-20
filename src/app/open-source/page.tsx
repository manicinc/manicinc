// src/app/opensource/page.tsx
// V5 - CSS Module Refactor

'use client';

import React, { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import {
    Github, Star, GitFork, Code, ExternalLink, Clock, ChevronDown, BookOpen, Users, Check,
    AlertCircle, Archive, X, Terminal, Activity, Search, Filter, RefreshCw, UsersRound,
    Link as LinkIcon, Rss, Coffee, FileCode, Tag, LayoutGrid, List, BarChart3, Heart, MapPin,
    Eye, AlertTriangle, ShieldCheck, Layers, CalendarDays
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import { formatDate } from '@/util/formatDate';

// Import the CSS module
import styles from './OpenSource.module.css';

// --- Type Definitions ---
interface Repository {
    id: number;
    name: string;
    full_name: string;
    html_url: string;
    description: string | null;
    homepage: string | null;
    stargazers_count: number;
    watchers_count: number;
    forks_count: number;
    open_issues_count: number;
    language: string | null;
    topics: string[];
    updated_at: string;
    created_at: string;
    pushed_at: string;
    license: {
        key: string;
        name: string;
        url: string | null;
    } | null;
    archived: boolean;
    size: number; // Size in kilobytes
    owner: {
        login: string;
        avatar_url: string;
        html_url: string;
    };
}

interface GitHubUserOrg {
    login: string;
    avatar_url: string;
    html_url: string;
    name: string | null;
    bio: string | null;
    blog: string | null;
    followers: number;
    following: number;
    public_repos: number;
    location: string | null;
    twitter_username?: string | null;
    company?: string | null;
}

interface RepositoryStats {
    totalStars: number;
    totalForks: number;
    totalIssues: number;
    totalRepos: number;
    languages: Record<string, { count: number, color: string }>;
    topLanguages: { name: string; count: number; percentage: number, color: string }[];
    lastUpdatedRepo?: Repository;
}
// --- End Type Definitions ---

// --- Theme Elements ---
// Language colors can remain here or be moved to a separate config file/theme context
const languageColors: Record<string, string> = { JavaScript: '#f1e05a', TypeScript: '#3178c6', Python: '#3572A5', HTML: '#e34c26', CSS: '#563d7c', SCSS: '#c6538c', Shell: '#89e051', Ruby: '#701516', Go: '#00ADD8', Rust: '#dea584', C: '#555555', 'C++': '#f34b7d', 'C#': '#178600', Java: '#b07219', PHP: '#4F5D95', Swift: '#F05138', Kotlin: '#A97BFF', Dart: '#00B4AB', Elixir: '#6e4a7e', Vue: '#4FC08D', Svelte: '#FF3E00', 'Jupyter Notebook': '#DA5B0B', MDX: '#f9ac00', Makefile: '#427819', Dockerfile: '#384d54', Json: '#eaeaea', Yaml: '#cb171e', Default: '#6e7681' };

// --- Sponsor / External Links ---
const GITHUB_USERNAME = 'manicinc';
const GITHUB_SPONSOR_URL = `https://github.com/sponsors/${GITHUB_USERNAME}`;
const BUYMEACOFFEE_USERNAME = null; // e.g., 'yourusername'
const BUYMEACOFFEE_URL = BUYMEACOFFEE_USERNAME ? `https://www.buymeacoffee.com/${BUYMEACOFFEE_USERNAME}` : null;
const TWITTER_HANDLE = "manicagency"; // Optional

// --- Main Component ---
export default function OpenSourcePage() {
    // --- State ---
    const [repositories, setRepositories] = useState<Repository[]>([]);
    const [githubOrg, setGithubOrg] = useState<GitHubUserOrg | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [selectedRepo, setSelectedRepo] = useState<Repository | null>(null);
    const [showModal, setShowModal] = useState(false);
    const [filterLanguage, setFilterLanguage] = useState<string | null>(null);
    const [filterTopic, setFilterTopic] = useState<string | null>(null);
    const [sortBy, setSortBy] = useState<'pushed' | 'stars' | 'name'>('pushed');
    const [searchQuery, setSearchQuery] = useState('');
    const [viewMode, setViewMode] = useState<'grid' | 'list' | 'stats'>('grid');
    const repositoryRefs = useRef<{ [key: number]: HTMLDivElement | null }>({});
    const statsRef = useRef<HTMLDivElement>(null);
    const heroRef = useRef<HTMLDivElement>(null);
    const filterBarRef = useRef<HTMLDivElement>(null);
    const observerRefs = useRef<IntersectionObserver | null>(null); // Store observer instance

    // --- Helper Functions ---
    const getLanguageColor = useCallback((language: string | null): string => { if (!language) return languageColors.Default; const key = language as keyof typeof languageColors; return languageColors[key] || languageColors.Default; }, []);
    const timeAgo = (dateString: string | undefined): string => { if (!dateString) return "N/A"; try { const date = new Date(dateString); const now = new Date(); if (isNaN(date.getTime())) return "Invalid date"; const seconds = Math.floor((now.getTime() - date.getTime()) / 1000); if (seconds < 0) return 'in the future'; if (seconds < 60) return 'just now'; let interval = Math.floor(seconds / 31536000); if (interval >= 1) return interval === 1 ? '1 yr ago' : `${interval} yrs ago`; interval = Math.floor(seconds / 2592000); if (interval >= 1) return interval === 1 ? '1 mo ago' : `${interval} mos ago`; interval = Math.floor(seconds / 86400); if (interval >= 1) return interval === 1 ? '1 day ago' : `${interval} days ago`; interval = Math.floor(seconds / 3600); if (interval >= 1) return interval === 1 ? '1 hr ago' : `${interval} hrs ago`; interval = Math.floor(seconds / 60); return interval === 1 ? '1 min ago' : `${interval} mins ago`; } catch (e) { return "Error"; } };
    const formatLargeNumber = (num: number | undefined): string => { if (num === undefined || num === null) return '0'; if (num < 1000) return num.toString(); if (num < 1000000) return (num / 1000).toFixed(1) + 'k'; return (num / 1000000).toFixed(1) + 'm'; };
    const formatBytes = (bytes: number | undefined, decimals = 1): string => { if (bytes === undefined || bytes === null || bytes === 0) return '0 Bytes'; const k = 1024; const dm = decimals < 0 ? 0 : decimals; const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB']; const i = Math.floor(Math.log(bytes) / Math.log(k)); const sizeIndex = Math.max(0, Math.min(i, sizes.length - 1)); const calculatedValue = parseFloat((bytes / Math.pow(k, sizeIndex)).toFixed(dm)); return calculatedValue + ' ' + sizes[sizeIndex]; };
    const openRepoModal = useCallback((repo: Repository) => { setSelectedRepo(repo); setShowModal(true); document.body.style.overflow = 'hidden'; }, []);
    // const closeRepoModal = useCallback(() => { setShowModal(false); document.body.style.overflow = ''; setTimeout(() => { setSelectedRepo(null); }, 300); }, []);
    const closeRepoModal = useCallback(() => {
      setShowModal(false);
      document.body.style.overflow = ''; // Restore body scroll
      // Delay clearing repo for exit animation to complete
      setTimeout(() => {
          setSelectedRepo(null);
      }, 300); // Match animation duration
    }, []); // Empty dependency array as it doesn't depend on other state/props
    
    // **NEW:** Effect to handle Escape key press for modal
    useEffect(() => {
      // Function to handle the keydown event
      const handleKeyDown = (event: KeyboardEvent) => {
          // Check if the pressed key is 'Escape'
          if (event.key === 'Escape') {
              closeRepoModal(); // Call the close function
          }
      };

      // Add the event listener only when the modal is shown
      if (showModal) {
          document.addEventListener('keydown', handleKeyDown);
      }

      // Cleanup function: Remove the event listener when the modal is hidden
      // or the component unmounts
      return () => {
          document.removeEventListener('keydown', handleKeyDown);
      };
    }, [showModal, closeRepoModal]); // Dependencies: Re-run if showModal or closeRepoModal changes

        // --- Effects ---
    useEffect(() => {
        let isMounted = true;
        async function fetchData() {
            if (!isMounted) return; setLoading(true); setError(null);
            try {
                const [orgResponse, repoResponse] = await Promise.all([
                    fetch(`https://api.github.com/users/${GITHUB_USERNAME}`),
                    fetch(`https://api.github.com/users/${GITHUB_USERNAME}/repos?per_page=100&sort=pushed`)
                ]);
                if (orgResponse.ok) { const d = await orgResponse.json(); if (isMounted) setGithubOrg(d); } else { console.warn(`Org API Error: ${orgResponse.status}`); }
                if (repoResponse.ok) { const d = await repoResponse.json(); if (isMounted) setRepositories(d); } else { let eT = `Repos API Error: ${repoResponse.status}`; try { const eD = await repoResponse.json(); if (eD.message) eT += ` - ${eD.message}`; } catch {} throw new Error(eT); }
            } catch (err: any) { if (isMounted) setError(err.message || 'Unknown fetch error'); console.error(err); }
            finally { if (isMounted) setLoading(false); }
        }
        fetchData();
        return () => { isMounted = false };
    }, []);

    // --- Memoized Calculations ---
    const languages = useMemo(() => { const allLangs = repositories.map(repo => repo.language).filter(Boolean) as string[]; return Array.from(new Set(allLangs)).sort((a, b) => a.localeCompare(b)); }, [repositories]);
    const topics = useMemo(() => { const allTopics = repositories.flatMap(repo => repo.topics || []).filter(Boolean); const forbidden = new Set(['manic', 'agency', 'manicinc', GITHUB_USERNAME.toLowerCase()]); return Array.from(new Set(allTopics)).filter(t => !forbidden.has(t.toLowerCase())).sort(); }, [repositories, GITHUB_USERNAME]);

    const repoStats = useMemo((): RepositoryStats => {
        // ... (calculation logic remains the same)
        if (repositories.length === 0) return { totalStars: 0, totalForks: 0, totalIssues: 0, totalRepos: 0, languages: {}, topLanguages: [], lastUpdatedRepo: undefined };
        const stats = { totalStars: 0, totalForks: 0, totalIssues: 0, totalRepos: repositories.length, languages: {} as Record<string, { count: number, color: string }>, lastUpdatedRepo: repositories[0] };
        repositories.forEach(repo => {
            stats.totalStars += repo.stargazers_count || 0;
            stats.totalForks += repo.forks_count || 0;
            stats.totalIssues += repo.open_issues_count || 0;
            if (repo.language) {
                if (!stats.languages[repo.language]) stats.languages[repo.language] = { count: 0, color: getLanguageColor(repo.language) };
                stats.languages[repo.language].count++;
            }
            if (new Date(repo.pushed_at || 0) > new Date(stats.lastUpdatedRepo?.pushed_at || 0)) {
                stats.lastUpdatedRepo = repo;
            }
        });
        const langEntries = Object.entries(stats.languages).sort(([, a], [, b]) => b.count - a.count);
        const topLanguages = langEntries.map(([name, data]) => ({ name, count: data.count, percentage: stats.totalRepos > 0 ? Math.round((data.count / stats.totalRepos) * 100) : 0, color: data.color })).slice(0, 8);
        return { ...stats, topLanguages };
    }, [repositories, getLanguageColor]);

    const filteredRepositories = useMemo(() => {
        // ... (filtering/sorting logic remains the same)
        if (loading && !error) return [];
        let filtered = [...repositories];
        if (filterLanguage) filtered = filtered.filter(repo => repo.language === filterLanguage);
        if (filterTopic) filtered = filtered.filter(repo => repo.topics?.includes(filterTopic));
        if (searchQuery.trim()) { const query = searchQuery.toLowerCase().trim(); filtered = filtered.filter(repo => repo.name.toLowerCase().includes(query) || (repo.description && repo.description.toLowerCase().includes(query)) || (repo.topics && repo.topics.some(topic => topic.toLowerCase().includes(query)))); }
        let sortedFiltered = [...filtered];
        switch (sortBy) {
            case 'stars': sortedFiltered.sort((a, b) => (b.stargazers_count || 0) - (a.stargazers_count || 0)); break;
            case 'pushed': sortedFiltered.sort((a, b) => new Date(b.pushed_at || 0).getTime() - new Date(a.pushed_at || 0).getTime()); break;
            case 'name': sortedFiltered.sort((a, b) => a.name.localeCompare(b.name)); break;
        }
        return sortedFiltered;
    }, [repositories, filterLanguage, filterTopic, sortBy, searchQuery, loading, error]);

    // --- Intersection Observer for Animations ---
    useEffect(() => {
        // Disconnect previous observer if it exists
        if (observerRefs.current) {
            observerRefs.current.disconnect();
        }

        const observerOptions = { threshold: 0.1, rootMargin: '0px 0px -50px 0px' };
        const observerCallback: IntersectionObserverCallback = (entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add(styles.isVisible); // Use module class
                }
                // else entry.target.classList.remove(styles.isVisible); // Optional: remove class
            });
        };

        const observer = new IntersectionObserver(observerCallback, observerOptions);
        observerRefs.current = observer; // Store the observer instance

        const elementsToObserve = [
            heroRef.current,
            statsRef.current, // Observe the stats container
            ...Object.values(repositoryRefs.current).filter(el => el !== null) // Observe repository cards/items
        ];

        elementsToObserve.forEach(el => {
            if (el) {
                 // Reset visibility state before observing
                el.classList.remove(styles.isVisible);
                observer.observe(el);
            }
        });

        // Cleanup function
        return () => {
            if (observerRefs.current) {
                observerRefs.current.disconnect();
                observerRefs.current = null; // Clear the ref
            }
        };
    // Re-run when filteredRepositories, viewMode, or loading state changes
    // Ensures new elements or view modes are observed correctly
    }, [filteredRepositories, viewMode, loading, styles.isVisible]);


    // --- Animation Variants (remain the same, control motion) ---
    const modalVariants = { hidden: { opacity: 0, scale: 0.92, y: 20 }, visible: { opacity: 1, scale: 1, y: 0, transition: { type: 'spring', damping: 20, stiffness: 220, mass: 0.8 } }, exit: { opacity: 0, scale: 0.95, y: 15, transition: { duration: 0.2, ease: 'easeIn' } } };
    const cardVariants = { hidden: { opacity: 0, y: 20, scale: 0.98 }, visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.4, ease: [0.25, 1, 0.5, 1] } }, exit: { opacity: 0, y: -15, scale: 0.98, transition: { duration: 0.25 } } };
    const containerVariants = { hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.06, delayChildren: 0.1 } } };
    const backdropVariants = { hidden: { opacity: 0 }, visible: { opacity: 1, transition: { duration: 0.3 } }, exit: { opacity: 0, transition: { duration: 0.25 } } };

    // --- Render ---
    return (
        <>
            <main className={styles.opensourcePageWrapper}>
                {/* Backgrounds - Use module classes */}
                <div className={styles.fixedBgElements}>
                    <div className={styles.bgGridPattern}></div>
                    <div className={styles.bgGradientRadial}></div>
                    <div className={`${styles.bgGlow} ${styles.glow1}`}></div>
                    <div className={`${styles.bgGlow} ${styles.glow2}`}></div>
                    <div className={styles.noiseOverlayPage}></div>
                </div>

                {/* Hero Section */}
                {/* Combine module classes with Tailwind utility classes */}
                          {/* Hero section */}
                          <section className="projects-hero-section">
                            <div className="container mx-auto max-w-4xl px-4 sm:px-6 relative z-10">
                                <div className="text-center">
                                    <h1 className="projects-title project-header-glitch text-shadow-glow">
                                        Open Source<span className="accent-dot">.</span>
                                    </h1>
                                    {/* <p className="projects-subtitle projects-subtitle-glitch" data-text="Experimental projects combining AI, creative coding, and emerging technologies"> */}
                                        {/* Experimental projects combining AI, creative coding, and emerging technologies */}
                                    {/* </p> */}
                                </div>
                            </div>

                            <div className="max-w-4xl mx-auto text-center">
                            {/* Org Info */}
                            {githubOrg && (
                                <motion.div
                                    initial={{ opacity: 0, y: -10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.1, duration: 0.4 }}
                                    className={`${styles.heroOrgInfo} flex flex-col items-center gap-3`}
                                >
                                    <Image
                                        src={githubOrg.avatar_url}
                                        alt={`${githubOrg.login} avatar`}
                                        width={96} height={96}
                                        className={styles.heroAvatar}
                                    />
                                    <h2 className={styles.heroOrgName}>{githubOrg.name || githubOrg.login}</h2>
                                    {githubOrg.bio && <p className={styles.heroOrgBio}>{githubOrg.bio}</p>}
                                    <div className={styles.heroOrgLinks}>
                                        {githubOrg.location && <span><MapPin size={14} className="inline -mt-1 mr-1.5 opacity-70"/>{githubOrg.location}</span>}
                                        {githubOrg.blog && <a href={githubOrg.blog} target="_blank" rel="noopener noreferrer"><LinkIcon size={14} /> Website</a>}
                                        {TWITTER_HANDLE && <a href={`https://twitter.com/${TWITTER_HANDLE}`} target="_blank" rel="noopener noreferrer">X/Twitter</a>}
                                        {githubOrg.html_url && <a href={githubOrg.html_url} target="_blank" rel="noopener noreferrer"><Github size={14} /> GitHub</a>}
                                    </div>
                                    <div className={styles.heroOrgStats}>
                                        <span title={`${githubOrg.followers?.toLocaleString()} Followers`}><UsersRound size={14}/> {formatLargeNumber(githubOrg.followers)}</span>
                                        <span className={styles.divider}>|</span>
                                        <span title={`${githubOrg.public_repos?.toLocaleString()} Repos`}><Code size={14}/> {formatLargeNumber(githubOrg.public_repos)}</span>
                                    </div>
                                </motion.div>
                            )}
                             {/* Subtitle */}
                            {/* <motion.p
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.3, duration: 0.5 }}
                                className={styles.heroSubtitle}
                            >
                                Code from the collective consciousness. Explore public experiments, tools, and libraries forged in the Manic Agency digital workshop.
                            </motion.p> */}
                            {/* Buttons & View Toggle */}
                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.4, duration: 0.5 }}
                                className={styles.heroButtonContainer}
                            >
                                {GITHUB_SPONSOR_URL && (
                                    <a href={GITHUB_SPONSOR_URL} target="_blank" rel="noopener noreferrer" className={styles.sponsorButton}>
                                        <Heart size={16} /> Sponsor
                                    </a>
                                )}
                                {BUYMEACOFFEE_URL && (
                                    <a href={BUYMEACOFFEE_URL} target="_blank" rel="noopener noreferrer" className={styles.supportButton}>
                                        <Coffee size={16} /> Support
                                    </a>
                                )}
                                {/* View Mode Toggle */}
                                <div className={styles.viewToggleContainer}>
                                    <button onClick={() => setViewMode('grid')} className={`${styles.viewToggleButton} ${viewMode === 'grid' ? styles.active : ''}`} aria-label="Grid View"> <LayoutGrid size={16} /> </button>
                                    <button onClick={() => setViewMode('list')} className={`${styles.viewToggleButton} ${viewMode === 'list' ? styles.active : ''}`} aria-label="List View"> <List size={16} /> </button>
                                    <button onClick={() => setViewMode('stats')} className={`${styles.viewToggleButton} ${viewMode === 'stats' ? styles.active : ''}`} aria-label="Stats View"> <BarChart3 size={16} /> </button>
                                </div>
                            </motion.div>
                        </div>
                </section>

                {/* Repositories Section */}
                <section className="container mx-auto px-4 sm:px-6 relative z-10 pb-16 md:pb-24">
                     {/* Filters and Sorting */}
                    {(repositories.length > 0 || loading || error) && (
                        <div ref={filterBarRef} className={styles.filterSortBar}>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 items-end"> {/* Tailwind grid */}
                                <div className={`lg:col-span-2 ${styles.filterInputContainer}`}>
                                    <label htmlFor="search-filter" className={styles.filterLabel}>Filter Transmissions</label>
                                    <input
                                        id="search-filter" type="text" placeholder="Search by name, topic, description..."
                                        value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
                                        className={styles.filterInput}
                                    />
                                    <Search className={styles.filterInputIcon} />
                                </div>
                                <div>
                                    <label htmlFor="lang-filter" className={styles.filterLabel}>Language Protocol</label>
                                    <select
                                        id="lang-filter" value={filterLanguage || ''} onChange={(e) => setFilterLanguage(e.target.value || null)}
                                        disabled={loading || !!error || languages.length === 0}
                                        className={styles.filterSelect}
                                    >
                                        <option value="">All Languages</option>
                                        {languages.map((lang) => ( <option key={lang} value={lang}>{lang}</option> ))}
                                    </select>
                                </div>
                                <div>
                                    <label htmlFor="sort-by" className={styles.filterLabel}>Sort Signal</label>
                                    <select
                                        id="sort-by" value={sortBy} onChange={(e) => setSortBy(e.target.value as 'stars' | 'pushed' | 'name')}
                                        disabled={!!(loading || error || filteredRepositories.length < 2)}
                                        className={styles.filterSelect}
                                    >
                                        <option value="pushed">Recent Activity</option>
                                        <option value="stars">Stars</option>
                                        <option value="name">Name (A-Z)</option>
                                    </select>
                                </div>
                                {(filterLanguage || filterTopic || searchQuery) && (
                                    <div className="lg:col-start-4 flex justify-end">
                                        <button onClick={() => { setFilterLanguage(null); setFilterTopic(null); setSearchQuery(''); }} className={styles.btnResetFilter} aria-label="Reset filters" >
                                            <RefreshCw size={14} /> Reset
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    {/* Loading Skeleton */}
                    {loading && (
                        <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 ${viewMode !== 'grid' ? 'hidden' : ''}`}>
                            {Array.from({ length: 9 }).map((_, index) => (
                                <div key={`skel-${index}`} className={styles.skeletonCard}>
                                    {/* Skeleton structure */}
                                    <div className="h-4 w-3/4 mb-3"></div>
                                    <div className="h-3 w-full mb-1.5"></div>
                                    <div className="h-3 w-5/6 mb-4"></div>
                                    <div className="flex gap-4 mt-auto pt-3 border-t border-[var(--border-color-light)]">
                                        <div className="h-3 w-1/4"></div>
                                        <div className="h-3 w-1/4"></div>
                                        <div className="h-3 w-1/4"></div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    {/* Error State */}
                    {error && !loading && (
                        <div className={styles.errorState}>
                            <AlertCircle size={40} className={`${styles.stateIcon} mb-4`} />
                            <h3 className={styles.stateTitle}>Signal Lost</h3>
                            <p className={styles.stateDesc}>Could not fetch repository data. The network might be unstable or the source unresponsive.</p>
                            <p className={styles.errorDetails}>Error: {error}</p>
                        </div>
                    )}

                    {/* Content Display Area */}
                    {!loading && !error && repositories.length > 0 && (
                        <div className="mt-8"> {/* Added margin top */}
                            {/* Results Info Bar */}
                            {(filteredRepositories.length !== repositories.length || filterLanguage || filterTopic || searchQuery) && filteredRepositories.length > 0 && (
                                <div className={styles.resultsInfo}>
                                    <h2 className={styles.resultsCount}>
                                        {filteredRepositories.length} Signal{filteredRepositories.length !== 1 ? 's' : ''} matching query
                                    </h2>
                                    {(filterLanguage || filterTopic || searchQuery) && (
                                        <div className={styles.filterPills}>
                                            {filterLanguage && ( <span className={`${styles.filterPill} ${styles.lang}`}> Lang: {filterLanguage} <button onClick={() => setFilterLanguage(null)}>&times;</button> </span> )}
                                            {filterTopic && ( <span className={`${styles.filterPill} ${styles.topic}`}> Topic: {filterTopic} <button onClick={() => setFilterTopic(null)}>&times;</button> </span> )}
                                            {searchQuery && ( <span className={`${styles.filterPill} ${styles.search}`}> Search: "{searchQuery}" <button onClick={() => setSearchQuery('')}>&times;</button> </span> )}
                                        </div>
                                    )}
                                </div>
                            )}

                            {/* AnimatePresence for view switching */}
                            <AnimatePresence mode="wait">
                                {/* GRID VIEW */}
                                {viewMode === 'grid' && (
                                    <motion.div key="grid-view" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" variants={containerVariants} initial="hidden" animate="visible" exit="exit">
                                        {filteredRepositories.map((repo) => (
                                            <motion.div
                                                key={repo.id}
                                                ref={el => { if (el) repositoryRefs.current[repo.id] = el; }}
                                                variants={cardVariants}
                                                layout
                                                className={styles.repositoryCard} // Apply base card style + observer class
                                                onClick={() => openRepoModal(repo)}
                                                tabIndex={0}
                                                onKeyDown={(e: React.KeyboardEvent<HTMLDivElement>) => { if (e.key === 'Enter' || e.key === ' ') openRepoModal(repo); }}
                                            >
                                                {repo.archived && <div className={styles.archivedBadge}><Archive size={12} />Archived</div>}
                                                <h3 className={styles.repoName}> <Github className={styles.icon}/> <span>{repo.name}</span></h3>
                                                <p className={styles.repoDescription}>{repo.description || <span className={styles.noDesc}>No description available.</span>}</p>
                                                <div className={styles.repoStats}>
                                                    <span title="Stars"><Star className={styles.starIcon}/> {formatLargeNumber(repo.stargazers_count)}</span>
                                                    <span title="Forks"><GitFork className={styles.forkIcon}/> {formatLargeNumber(repo.forks_count)}</span>
                                                    {repo.open_issues_count > 0 && <span title="Open Issues"><AlertCircle className={styles.issueIcon}/> {repo.open_issues_count}</span>}
                                                    <span title="Last Update"><Clock className={styles.icon}/> {timeAgo(repo.pushed_at)}</span>
                                                </div>
                                                <div className={styles.repoFooter}>
                                                    {repo.language && (
                                                        <div className={styles.langDisplay}>
                                                            <span className={styles.langDot} style={{ backgroundColor: getLanguageColor(repo.language) }}></span>
                                                            <span className={styles.langName}>{repo.language}</span>
                                                        </div>
                                                    )}
                                                    {repo.topics?.length > 0 && (
                                                        <div className={styles.repoTopics}>
                                                            {repo.topics.slice(0, 2).map(t => <span key={t} className={styles.topicTag}>{t}</span>)}
                                                            {repo.topics.length > 2 && <span className={styles.topicTagMore}>+{repo.topics.length - 2}</span>}
                                                        </div>
                                                    )}
                                                </div>
                                                <div className={styles.viewDetailsPrompt}><ChevronDown size={18} /></div>
                                            </motion.div>
                                        ))}
                                    </motion.div>
                                )}

                                {/* LIST VIEW */}
                                {viewMode === 'list' && (
                                     <motion.div key="list-view" className={styles.listViewContainer} variants={containerVariants} initial="hidden" animate="visible" exit="exit">
                                        <div className={styles.listHeader}>
                                            <div className={styles.colName}>Repository</div>
                                            <div className={styles.colLang}>Language</div>
                                            <div className={styles.colStars}>Stars</div>
                                            <div className={styles.colForks}>Forks</div>
                                            <div className={styles.colUpdated}>Last Update</div>
                                        </div>
                                         <AnimatePresence initial={false}>
                                            {filteredRepositories.map(repo => (
                                                <motion.div
                                                    key={repo.id}
                                                    layout
                                                    variants={cardVariants}
                                                    initial="hidden" animate="visible" exit="exit"
                                                    className={styles.listItem} // Use list item style + observer class
                                                    ref={el => { if (el) repositoryRefs.current[repo.id] = el; }}
                                                    onClick={() => openRepoModal(repo)}
                                                    tabIndex={0}
                                                    onKeyDown={(e: React.KeyboardEvent<HTMLDivElement>) => { if (e.key === 'Enter' || e.key === ' ') openRepoModal(repo); }}
                                                >
                                                    <div className={styles.colName}>
                                                        <Github size={15} className={styles.icon}/>
                                                        <span>{repo.full_name}</span>
                                                        {repo.archived && <Archive size={12} className={styles.archivedIconList}/>}
                                                    </div>
                                                    <div className={styles.colLang}>
                                                        {repo.language ? (
                                                            <>
                                                                <span className={styles.langDot} style={{ backgroundColor: getLanguageColor(repo.language)}}></span>
                                                                <span className={styles.langName}>{repo.language}</span>
                                                            </>
                                                        ) : <span className={styles.noLang}>-</span>}
                                                    </div>
                                                    <div className={styles.colStars}>
                                                        <Star size={13} className={styles.icon}/> {formatLargeNumber(repo.stargazers_count)}
                                                    </div>
                                                    <div className={styles.colForks}>
                                                        <GitFork size={13} className={styles.icon}/> {formatLargeNumber(repo.forks_count)}
                                                    </div>
                                                    <div className={styles.colUpdated} title={formatDate(repo.pushed_at)}>
                                                        {timeAgo(repo.pushed_at)}
                                                    </div>
                                                </motion.div>
                                            ))}
                                        </AnimatePresence>
                                    </motion.div>
                                )}

                                {/* STATS VIEW */}
                                {viewMode === 'stats' && (
                                    <motion.div
                                        key="stats-view"
                                        ref={statsRef} // Add ref to the container
                                        className={styles.statsViewContainer} // Apply base style + observer class
                                        variants={cardVariants} // Use card variant for fade-in
                                        initial="hidden" animate="visible" exit="exit"
                                    >
                                        {/* Grid for large stat boxes */}
                                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
                                            <div className={`${styles.statBoxLg} ${styles.borderPrimary}`}>
                                                <div className={styles.statHeader}><Code size={18}/>Total Repos</div>
                                                <div className={styles.statValue}>{repoStats.totalRepos.toLocaleString()}</div>
                                                <p className={styles.statSubtext}>Last Push: {repoStats.lastUpdatedRepo ? timeAgo(repoStats.lastUpdatedRepo.pushed_at) : 'N/A'}</p>
                                            </div>
                                             <div className={`${styles.statBoxLg} ${styles.borderYellow}`}>
                                                <div className={styles.statHeader}><Star size={18}/>Total Stars</div>
                                                <div className={styles.statValue}>{formatLargeNumber(repoStats.totalStars)}</div>
                                                <p className={styles.statSubtext}>Avg per Repo: {(repoStats.totalRepos > 0 ? repoStats.totalStars / repoStats.totalRepos : 0).toFixed(1)}</p>
                                            </div>
                                            <div className={`${styles.statBoxLg} ${styles.borderSecondary}`}>
                                                <div className={styles.statHeader}><GitFork size={18}/>Total Forks</div>
                                                <div className={styles.statValue}>{formatLargeNumber(repoStats.totalForks)}</div>
                                                <p className={styles.statSubtext}>Avg per Repo: {(repoStats.totalRepos > 0 ? repoStats.totalForks / repoStats.totalRepos : 0).toFixed(1)}</p>
                                            </div>
                                            <div className={`${styles.statBoxLg} ${styles.borderOrange}`}>
                                                <div className={styles.statHeader}><AlertCircle size={18}/>Open Issues</div>
                                                <div className={styles.statValue}>{repoStats.totalIssues.toLocaleString()}</div>
                                                <p className={styles.statSubtext}>Avg per Repo: {(repoStats.totalRepos > 0 ? repoStats.totalIssues / repoStats.totalRepos : 0).toFixed(1)}</p>
                                            </div>
                                        </div>
                                        {/* Grid for themed boxes (languages, topics) */}
                                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                                            <div className={`${styles.themedBox} lg:col-span-2`}>
                                                 <div className={styles.boxHeaderSimple}>
                                                    <FileCode size={16} className={styles.headerIconLang}/>
                                                    <h3 className={styles.boxTitle}>Language Distribution</h3>
                                                </div>
                                                 <div className={styles.boxContent}>
                                                    {repoStats.topLanguages.length > 0 ? (
                                                        <div className={styles.languageBars}>
                                                            {repoStats.topLanguages.map((lang) => (
                                                                <div key={lang.name} className={styles.languageBarItem} title={`${lang.name}: ${lang.percentage}% (${lang.count} repos)`}>
                                                                    <div className={styles.langLabel}>
                                                                        <span>
                                                                            <span className={styles.langDotInline} style={{ backgroundColor: lang.color }}></span>
                                                                            {lang.name}
                                                                        </span>
                                                                        <span className={styles.langPercent}>{lang.percentage}%</span>
                                                                    </div>
                                                                    <div className={styles.langBarBg}>
                                                                        <motion.div
                                                                            className={styles.langBarFg}
                                                                            style={{ backgroundColor: lang.color, boxShadow: `0 0 8px 0px ${lang.color}` }}
                                                                            initial={{ width: '0%' }}
                                                                            animate={{ width: `${lang.percentage}%` }}
                                                                            transition={{ duration: 0.8, ease: 'easeOut' }}
                                                                        ></motion.div>
                                                                    </div>
                                                                </div>
                                                            ))}
                                                        </div>
                                                    ) : <p className="text-sm text-[color:var(--text-muted)] italic p-4 text-center">No language data available.</p>}
                                                </div>
                                            </div>
                                            <div className={styles.themedBox}>
                                                <div className={styles.boxHeaderSimple}>
                                                    <Tag size={16} className={styles.headerIconTopic}/>
                                                    <h3 className={styles.boxTitle}>Popular Topics</h3>
                                                </div>
                                                <div className={styles.boxContent}>
                                                    <div className="flex flex-wrap gap-2">
                                                        {topics.length > 0 ? topics.slice(0, 18).map(topic => {
                                                            const count = repositories.filter(r => r.topics?.includes(topic)).length;
                                                            return <button key={topic} onClick={() => { setFilterTopic(topic); setViewMode('grid');}} className={`${styles.topicPill} ${filterTopic === topic ? styles.active : ''}`} title={`Filter by ${topic} (${count})`}>{topic}</button>
                                                        }) : <p className="text-sm text-[color:var(--text-muted)] italic text-center w-full">No common topics found.</p>}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>

                            {/* No Results State */}
                            {filteredRepositories.length === 0 && !loading && !error && repositories.length > 0 && (
                                <motion.div
                                    className={styles.noResultsState}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.3 }}
                                >
                                    <Filter size={44} className={styles.stateIcon}/>
                                    <h3 className={styles.stateTitle}>No Signals Match Query</h3>
                                    <p className={styles.stateDesc}>Try adjusting filters or search terms to broaden the scan.</p>
                                    <button onClick={() => { setFilterLanguage(null); setFilterTopic(null); setSearchQuery(''); }} className={styles.stateResetButton}>
                                        <RefreshCw size={14} /> Reset Filters
                                    </button>
                                </motion.div>
                            )}
                             {/* Initial Empty State */}
                            {repositories.length === 0 && !loading && !error && (
                                <motion.div
                                    className={styles.noResultsState}
                                     initial={{ opacity: 0, y: 10 }}
                                     animate={{ opacity: 1, y: 0 }}
                                     transition={{ duration: 0.3 }}
                                >
                                    <Archive size={44} className={styles.stateIcon}/>
                                    <h3 className={styles.stateTitle}>Archives Currently Empty</h3>
                                    <p className={styles.stateDesc}>No public repositories detected for {GITHUB_USERNAME}.</p>
                                </motion.div>
                            )}
                        </div>
                    )}
               </section>
            </main>

            {/* Repository Detail Modal */}
            <AnimatePresence>
                {showModal && selectedRepo && (
                    <motion.div
                        className={styles.modalBackdrop}
                        initial="hidden" animate="visible" exit="exit"
                        variants={backdropVariants}
                        onClick={closeRepoModal}
                    >
                         <div className={styles.modalGridOverlay}></div> {/* Optional overlay */}

                        <motion.div
                            className={styles.modalContent}
                            variants={modalVariants}
                            onClick={(e: React.MouseEvent) => e.stopPropagation()}
                            role="dialog" aria-modal="true" aria-labelledby="repo-modal-title"
                        >
                            <div className={styles.modalHeader}>
                                <h2 id="repo-modal-title" className={styles.modalTitle}>
                                    <Github size={20} className={styles.icon}/>
                                    <span className="font-mono">{selectedRepo?.full_name}</span>
                                    {selectedRepo?.archived && <span className={styles.modalArchivedBadge}><Archive size={12} />Archived</span>}
                                </h2>
                                <button onClick={closeRepoModal} className={styles.modalCloseBtn} aria-label="Close modal">
                                    <X size={22} />
                                </button>
                            </div>

                            <div className={styles.modalBody}>
                                <p className={styles.modalDescription}>
                                    {selectedRepo?.description || <span className={styles.noDesc}>No description provided.</span>}
                                </p>

                                <div className={styles.modalStatsGrid}>
                                    {/* Use specific icon classes for color */}
                                    <div className={styles.statItem}><span className='flex items-center gap-2'><Star size={15} className={`${styles.icon} ${styles.starIcon}`}/>Stars</span> <strong>{selectedRepo?.stargazers_count.toLocaleString()}</strong></div>
                                    <div className={styles.statItem}><span className='flex items-center gap-2'><GitFork size={15} className={`${styles.icon} ${styles.forkIcon}`}/>Forks</span> <strong>{selectedRepo?.forks_count.toLocaleString()}</strong></div>
                                    <div className={styles.statItem}><span className='flex items-center gap-2'><Eye size={15} className={`${styles.icon} ${styles.watchIcon}`}/>Watchers</span> <strong>{selectedRepo?.watchers_count.toLocaleString()}</strong></div>
                                    <div className={styles.statItem}><span className='flex items-center gap-2'><AlertTriangle size={15} className={`${styles.icon} ${styles.issueIcon}`}/>Issues</span> <strong>{selectedRepo?.open_issues_count.toLocaleString()}</strong></div>
                                    <div className={styles.statItem}><span className='flex items-center gap-2'><ShieldCheck size={15} className={`${styles.icon} ${styles.licenseIcon}`}/>License</span> <strong>{selectedRepo?.license?.name || 'N/A'}</strong></div>
                                    <div className={styles.statItem}><span className='flex items-center gap-2'><Layers size={15} className={`${styles.icon} ${styles.sizeIcon}`}/>Size</span> <strong>{formatBytes(selectedRepo?.size * 1024)}</strong></div>
                                    <div className={styles.statItem}><span className='flex items-center gap-2'><CalendarDays size={15} className={`${styles.icon} ${styles.createdIcon}`}/>Created</span> <strong title={selectedRepo?.created_at ? new Date(selectedRepo.created_at).toLocaleString() : ''}>{formatDate(selectedRepo?.created_at)}</strong></div>
                                    <div className={styles.statItem}><span className='flex items-center gap-2'><Activity size={15} className={`${styles.icon} ${styles.updatedIcon}`}/>Updated</span> <strong title={selectedRepo?.updated_at ? new Date(selectedRepo.updated_at).toLocaleString() : ''}>{timeAgo(selectedRepo?.updated_at)}</strong></div>
                                </div>

                                {selectedRepo?.topics?.length > 0 && (
                                    <div className={styles.modalTopics}>
                                        <h4 className={styles.subHeading}>Topics</h4>
                                        <div className={styles.tagsList}>
                                            {selectedRepo.topics.map((t: string) => (
                                                <span key={t} className={styles.tagChip}>{t}</span>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                <div className={styles.modalCtaSeparator}></div>
                                <div className={styles.modalCtaButtons}>
                                    {/* Use module specific button styles */}
                                    <a href={selectedRepo?.html_url} target="_blank" rel="noopener noreferrer" className={styles.modalButtonPrimary}>
                                        <Github size={16} /> View on GitHub
                                    </a>
                                    {selectedRepo?.homepage && (
                                        <a href={selectedRepo.homepage} target="_blank" rel="noopener noreferrer" className={styles.modalButtonOutline}>
                                            <ExternalLink size={16} /> Visit Homepage
                                        </a>
                                    )}
                                    <button onClick={closeRepoModal} className={styles.modalButtonClose}>Close</button>
                                </div>
                            </div>
                       </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Remove the <style jsx> block entirely */}
        </>
    );
}