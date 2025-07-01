// src/app/opensource/OpenSourcePageClient.tsx
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
export default function OpenSourcePageClient() {
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
                     {/* Loading/Error States */}
                    {loading && <div className="text-center py-12">Loading repositories...</div>}
                    {error && <div className="text-center py-12 text-red-500">Error: {error}</div>}
                    
                    {/* Repository Display */}
                    {!loading && !error && repositories.length > 0 && (
                        <div>
                            <div className="text-center py-8">
                                <p className="text-lg">
                                    Found {repositories.length} public repositories
                                </p>
                            </div>
                            
                            {/* Simple repository grid for now */}
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {repositories.slice(0, 12).map(repo => (
                                    <div key={repo.id} className="border rounded-lg p-4 hover:shadow-lg transition-shadow">
                                        <h3 className="font-bold text-lg mb-2">
                                            <Github className="inline mr-2" size={20} />
                                            {repo.name}
                                        </h3>
                                        <p className="text-gray-600 dark:text-gray-400 text-sm mb-3">
                                            {repo.description || 'No description available'}
                                        </p>
                                        <div className="flex items-center gap-4 text-sm text-gray-500">
                                            <span className="flex items-center gap-1">
                                                <Star size={14} />
                                                {repo.stargazers_count}
                                            </span>
                                            <span className="flex items-center gap-1">
                                                <GitFork size={14} />
                                                {repo.forks_count}
                                            </span>
                                            {repo.language && (
                                                <span className="flex items-center gap-1">
                                                    <span 
                                                        className="w-3 h-3 rounded-full" 
                                                        style={{ backgroundColor: getLanguageColor(repo.language) }}
                                                    />
                                                    {repo.language}
                                                </span>
                                            )}
                                        </div>
                                        <div className="mt-3">
                                            <a 
                                                href={repo.html_url} 
                                                target="_blank" 
                                                rel="noopener noreferrer"
                                                className="text-blue-600 hover:text-blue-800 text-sm"
                                            >
                                                View on GitHub →
                                            </a>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                    
                    {!loading && !error && repositories.length === 0 && (
                        <div className="text-center py-12">
                            <p>No public repositories found.</p>
                        </div>
                    )}
               </section>
            </main>
        </>
    );
} 