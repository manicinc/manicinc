// src/app/opensource/OpenSourcePageClient.tsx
// V7 - Professional version with inline SVG icons

'use client';

import React, { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import { formatDate } from '@/util/formatDate';

// Import the CSS module
import styles from './OpenSource.module.css';

// Inline SVG Icons
const Icons = {
  GitHub: ({ className = '' }) => (
    <svg className={className} width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
    </svg>
  ),
  Star: ({ className = '' }) => (
    <svg className={className} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
    </svg>
  ),
  Fork: ({ className = '' }) => (
    <svg className={className} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="12" cy="18" r="3"/><circle cx="6" cy="6" r="3"/><circle cx="18" cy="6" r="3"/><path d="M18 9v2c0 .6-.4 1-1 1H7c-.6 0-1-.4-1-1V9"/><path d="M12 12v3"/>
    </svg>
  ),
  Code: ({ className = '' }) => (
    <svg className={className} width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <polyline points="16,18 22,12 16,6"/><polyline points="8,6 2,12 8,18"/>
    </svg>
  ),
  ExternalLink: ({ className = '' }) => (
    <svg className={className} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15,3 21,3 21,9"/><line x1="10" y1="14" x2="21" y2="3"/>
    </svg>
  ),
  Clock: ({ className = '' }) => (
    <svg className={className} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
    </svg>
  ),
  Users: ({ className = '' }) => (
    <svg className={className} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>
    </svg>
  ),
  Issues: ({ className = '' }) => (
    <svg className={className} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
    </svg>
  ),
  Archive: ({ className = '' }) => (
    <svg className={className} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <polyline points="21,8 21,21 3,21 3,8"/><rect x="1" y="3" width="22" height="5"/><line x1="10" y1="12" x2="14" y2="12"/>
    </svg>
  ),
  X: ({ className = '' }) => (
    <svg className={className} width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
    </svg>
  ),
  Search: ({ className = '' }) => (
    <svg className={className} width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/>
    </svg>
  ),
  Filter: ({ className = '' }) => (
    <svg className={className} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"/>
    </svg>
  ),
  Link: ({ className = '' }) => (
    <svg className={className} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/>
    </svg>
  ),
  Tag: ({ className = '' }) => (
    <svg className={className} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"/><line x1="7" y1="7" x2="7.01" y2="7"/>
    </svg>
  ),
  Grid: ({ className = '' }) => (
    <svg className={className} width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/>
    </svg>
  ),
  List: ({ className = '' }) => (
    <svg className={className} width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/><line x1="3" y1="6" x2="3.01" y2="6"/><line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/>
    </svg>
  ),
  BarChart: ({ className = '' }) => (
    <svg className={className} width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <line x1="12" y1="20" x2="12" y2="10"/><line x1="18" y1="20" x2="18" y2="4"/><line x1="6" y1="20" x2="6" y2="16"/>
    </svg>
  ),
  Heart: ({ className = '' }) => (
    <svg className={className} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
    </svg>
  ),
  MapPin: ({ className = '' }) => (
    <svg className={className} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/>
    </svg>
  ),
  AlertTriangle: ({ className = '' }) => (
    <svg className={className} width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/>
    </svg>
  ),
  Refresh: ({ className = '' }) => (
    <svg className={className} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <polyline points="23,4 23,10 17,10"/><polyline points="1,20 1,14 7,14"/><path d="M20.49 9A9 9 0 0 0 5.64 5.64L1 10m22 4l-4.64 4.36A9 9 0 0 1 3.51 15"/>
    </svg>
  ),
  Eye: ({ className = '' }) => (
    <svg className={className} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/>
    </svg>
  ),
  Calendar: ({ className = '' }) => (
    <svg className={className} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>
    </svg>
  ),
  Database: ({ className = '' }) => (
    <svg className={className} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <ellipse cx="12" cy="5" rx="9" ry="3"/><path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3"/><path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5"/>
    </svg>
  ),
  Shield: ({ className = '' }) => (
    <svg className={className} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
    </svg>
  ),
  GitCommit: ({ className = '' }) => (
    <svg className={className} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="12" cy="12" r="4"/><line x1="1.05" y1="12" x2="7" y2="12"/><line x1="17.01" y1="12" x2="22.96" y2="12"/>
    </svg>
  ),
  GitPullRequest: ({ className = '' }) => (
    <svg className={className} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="18" cy="18" r="3"/><circle cx="6" cy="6" r="3"/><path d="M13 6h3a2 2 0 0 1 2 2v7"/><line x1="6" y1="9" x2="6" y2="21"/>
    </svg>
  ),
};

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
    size: number;
    owner: {
        login: string;
        avatar_url: string;
        html_url: string;
    };
    // Additional metadata that we'll fetch on-demand
    contributors_count?: number;
    commits_count?: number;
    pull_requests_count?: number;
    default_branch?: string;
    has_issues?: boolean;
    has_projects?: boolean;
    has_wiki?: boolean;
    has_pages?: boolean;
    has_downloads?: boolean;
    subscribers_count?: number;
}

// Additional interface for detailed repository stats
interface DetailedRepoStats {
    contributors_count: number;
    commits_count: number;
    pull_requests_count: number;
    closed_pull_requests_count: number;
    releases_count: number;
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

// Language colors
const languageColors: Record<string, string> = { 
    JavaScript: '#f1e05a', 
    TypeScript: '#3178c6', 
    Python: '#3572A5', 
    HTML: '#e34c26', 
    CSS: '#563d7c', 
    SCSS: '#c6538c', 
    Shell: '#89e051', 
    Ruby: '#701516', 
    Go: '#00ADD8', 
    Rust: '#dea584', 
    Default: '#6e7681' 
};

// Constants
const GITHUB_USERNAME = 'manicinc';
const GITHUB_SPONSOR_URL = `https://github.com/sponsors/${GITHUB_USERNAME}`;
const TWITTER_HANDLE = "manicagency";

export default function OpenSourcePageClient() {
    // State
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
    const [loadingDetails, setLoadingDetails] = useState(false);
    const [detailedStats, setDetailedStats] = useState<DetailedRepoStats | null>(null);
    const repositoryRefs = useRef<{ [key: number]: HTMLDivElement | null }>({});

    // Helper Functions
    const getLanguageColor = useCallback((language: string | null): string => {
        if (!language) return languageColors.Default;
        return languageColors[language as keyof typeof languageColors] || languageColors.Default;
    }, []);

    // Helper function to format dates
    const formatDate = (dateString: string | undefined): string => {
        if (!dateString) return "N/A";
        try {
            const date = new Date(dateString);
            return date.toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'short',
                day: 'numeric'
            });
        } catch (e) {
            return "Invalid date";
        }
    };

    // Helper function to format bytes
    const formatBytes = (bytes: number): string => {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    };

    const timeAgo = (dateString: string | undefined): string => {
        if (!dateString) return "N/A";
        try {
            const date = new Date(dateString);
            const now = new Date();
            if (isNaN(date.getTime())) return "Invalid date";
            const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);
            if (seconds < 0) return 'in the future';
            if (seconds < 60) return 'just now';
            let interval = Math.floor(seconds / 31536000);
            if (interval >= 1) return interval === 1 ? '1 yr ago' : `${interval} yrs ago`;
            interval = Math.floor(seconds / 2592000);
            if (interval >= 1) return interval === 1 ? '1 mo ago' : `${interval} mos ago`;
            interval = Math.floor(seconds / 86400);
            if (interval >= 1) return interval === 1 ? '1 day ago' : `${interval} days ago`;
            interval = Math.floor(seconds / 3600);
            if (interval >= 1) return interval === 1 ? '1 hr ago' : `${interval} hrs ago`;
            interval = Math.floor(seconds / 60);
            return interval === 1 ? '1 min ago' : `${interval} mins ago`;
        } catch (e) {
            return "Error";
        }
    };

    const formatLargeNumber = (num: number | undefined): string => {
        if (num === undefined || num === null) return '0';
        if (num < 1000) return num.toString();
        if (num < 1000000) return (num / 1000).toFixed(1) + 'k';
        return (num / 1000000).toFixed(1) + 'm';
    };

    // Fetch detailed repository statistics
    const fetchDetailedStats = useCallback(async (repo: Repository): Promise<DetailedRepoStats> => {
        try {
            const [contributorsRes, commitsRes, pullRequestsRes, releasesRes] = await Promise.all([
                fetch(`https://api.github.com/repos/${repo.full_name}/contributors?per_page=1`),
                fetch(`https://api.github.com/repos/${repo.full_name}/commits?per_page=1`),
                fetch(`https://api.github.com/repos/${repo.full_name}/pulls?state=all&per_page=1`),
                fetch(`https://api.github.com/repos/${repo.full_name}/releases`)
            ]);

            // Extract counts from Link headers for pagination info
            const getCountFromLink = (response: Response): number => {
                const linkHeader = response.headers.get('Link');
                if (!linkHeader) return response.status === 200 ? 1 : 0;
                
                const match = linkHeader.match(/page=(\d+)>; rel="last"/);
                return match ? parseInt(match[1]) : 1;
            };

            const contributors_count = contributorsRes.status === 200 ? getCountFromLink(contributorsRes) : 0;
            const commits_count = commitsRes.status === 200 ? getCountFromLink(commitsRes) : 0;
            const pull_requests_count = pullRequestsRes.status === 200 ? getCountFromLink(pullRequestsRes) : 0;
            
            // Get releases count
            const releases = releasesRes.status === 200 ? await releasesRes.json() : [];
            const releases_count = Array.isArray(releases) ? releases.length : 0;

            // Get closed PRs count
            const closedPRsRes = await fetch(`https://api.github.com/repos/${repo.full_name}/pulls?state=closed&per_page=1`);
            const closed_pull_requests_count = closedPRsRes.status === 200 ? getCountFromLink(closedPRsRes) : 0;

            return {
                contributors_count,
                commits_count,
                pull_requests_count,
                closed_pull_requests_count,
                releases_count
            };
        } catch (error) {
            console.error('Error fetching detailed stats:', error);
            return {
                contributors_count: 0,
                commits_count: 0,
                pull_requests_count: 0,
                closed_pull_requests_count: 0,
                releases_count: 0
            };
        }
    }, []);

    const openRepoModal = useCallback(async (repo: Repository) => {
        setSelectedRepo(repo);
        setShowModal(true);
        setLoadingDetails(true);
        setDetailedStats(null);
        document.body.style.overflow = 'hidden';

        // Fetch detailed stats in the background
        try {
            const stats = await fetchDetailedStats(repo);
            setDetailedStats(stats);
        } catch (error) {
            console.error('Failed to fetch detailed stats:', error);
        } finally {
            setLoadingDetails(false);
        }
    }, [fetchDetailedStats]);

    const closeRepoModal = useCallback(() => {
        setShowModal(false);
        document.body.style.overflow = '';
        setTimeout(() => {
            setSelectedRepo(null);
            setDetailedStats(null);
            setLoadingDetails(false);
        }, 300);
    }, []);

    // Effect to handle Escape key press for modal
    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === 'Escape') {
                closeRepoModal();
            }
        };

        if (showModal) {
            document.addEventListener('keydown', handleKeyDown);
        }

        return () => {
            document.removeEventListener('keydown', handleKeyDown);
        };
    }, [showModal, closeRepoModal]);

    // Fetch data
    useEffect(() => {
        let isMounted = true;
        async function fetchData() {
            if (!isMounted) return;
            setLoading(true);
            setError(null);
            try {
                const [orgResponse, repoResponse] = await Promise.all([
                    fetch(`https://api.github.com/users/${GITHUB_USERNAME}`),
                    fetch(`https://api.github.com/users/${GITHUB_USERNAME}/repos?per_page=100&sort=pushed`)
                ]);
                if (orgResponse.ok) {
                    const d = await orgResponse.json();
                    if (isMounted) setGithubOrg(d);
                }
                if (repoResponse.ok) {
                    const d = await repoResponse.json();
                    if (isMounted) setRepositories(d);
                } else {
                    throw new Error(`API Error: ${repoResponse.status}`);
                }
            } catch (err: any) {
                if (isMounted) setError(err.message || 'Unknown fetch error');
            } finally {
                if (isMounted) setLoading(false);
            }
        }
        fetchData();
        return () => { isMounted = false };
    }, []);

    // Memoized Calculations
    const languages = useMemo(() => {
        const allLangs = repositories.map(repo => repo.language).filter(Boolean) as string[];
        return Array.from(new Set(allLangs)).sort((a, b) => a.localeCompare(b));
    }, [repositories]);

    const topics = useMemo(() => {
        const allTopics = repositories.flatMap(repo => repo.topics || []).filter(Boolean);
        const forbidden = new Set(['manic', 'agency', 'manicinc', GITHUB_USERNAME.toLowerCase()]);
        return Array.from(new Set(allTopics)).filter(t => !forbidden.has(t.toLowerCase())).sort();
    }, [repositories]);

    const filteredRepositories = useMemo(() => {
        if (loading && !error) return [];
        let filtered = [...repositories];
        if (filterLanguage) filtered = filtered.filter(repo => repo.language === filterLanguage);
        if (filterTopic) filtered = filtered.filter(repo => repo.topics?.includes(filterTopic));
        if (searchQuery.trim()) {
            const query = searchQuery.toLowerCase().trim();
            filtered = filtered.filter(repo =>
                repo.name.toLowerCase().includes(query) ||
                (repo.description && repo.description.toLowerCase().includes(query)) ||
                (repo.topics && repo.topics.some(topic => topic.toLowerCase().includes(query)))
            );
        }
        let sortedFiltered = [...filtered];
        switch (sortBy) {
            case 'stars':
                sortedFiltered.sort((a, b) => (b.stargazers_count || 0) - (a.stargazers_count || 0));
                break;
            case 'pushed':
                sortedFiltered.sort((a, b) => new Date(b.pushed_at || 0).getTime() - new Date(a.pushed_at || 0).getTime());
                break;
            case 'name':
                sortedFiltered.sort((a, b) => a.name.localeCompare(b.name));
                break;
        }
        return sortedFiltered;
    }, [repositories, filterLanguage, filterTopic, sortBy, searchQuery, loading, error]);

    return (
        <>
            <main className={styles.opensourcePageWrapper}>
                {/* Backgrounds */}
                <div className={styles.fixedBgElements}>
                    <div className={styles.bgGridPattern}></div>
                    <div className={styles.bgGradientRadial}></div>
                    <div className={`${styles.bgGlow} ${styles.glow1}`}></div>
                    <div className={`${styles.bgGlow} ${styles.glow2}`}></div>
                    <div className={styles.noiseOverlayPage}></div>
                </div>

                {/* Hero Section */}
                <section className="projects-hero-section">
                    <div className="container mx-auto max-w-4xl px-4 sm:px-6 relative z-10">
                        <div className="text-center">
                            <h1 className="projects-title project-header-glitch text-shadow-glow">
                                Open Source<span className="accent-dot">.</span>
                            </h1>
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
                                    {githubOrg.location && (
                                        <span>
                                            <Icons.MapPin />
                                            {githubOrg.location}
                                        </span>
                                    )}
                                    {githubOrg.blog && (
                                        <a href={githubOrg.blog} target="_blank" rel="noopener noreferrer">
                                            <Icons.Link /> Website
                                        </a>
                                    )}
                                    {TWITTER_HANDLE && (
                                        <a href={`https://twitter.com/${TWITTER_HANDLE}`} target="_blank" rel="noopener noreferrer">
                                            X/Twitter
                                        </a>
                                    )}
                                    {githubOrg.html_url && (
                                        <a href={githubOrg.html_url} target="_blank" rel="noopener noreferrer">
                                            <Icons.GitHub /> GitHub
                                        </a>
                                    )}
                                </div>
                                <div className={styles.heroOrgStats}>
                                    <span title={`${githubOrg.followers?.toLocaleString()} Followers`}>
                                        <Icons.Users /> {formatLargeNumber(githubOrg.followers)}
                                    </span>
                                    <span className={styles.divider}>|</span>
                                    <span title={`${githubOrg.public_repos?.toLocaleString()} Repos`}>
                                        <Icons.Code /> {formatLargeNumber(githubOrg.public_repos)}
                                    </span>
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
                                    <Icons.Heart /> Sponsor Manic Agency
                                </a>
                            )}
                            {/* View Mode Toggle */}
                            <div className={styles.viewToggleContainer}>
                                <button 
                                    onClick={() => setViewMode('grid')} 
                                    className={`${styles.viewToggleButton} ${viewMode === 'grid' ? styles.active : ''}`} 
                                    aria-label="Grid View"
                                >
                                    <Icons.Grid />
                                </button>
                                <button 
                                    onClick={() => setViewMode('list')} 
                                    className={`${styles.viewToggleButton} ${viewMode === 'list' ? styles.active : ''}`} 
                                    aria-label="List View"
                                >
                                    <Icons.List />
                                </button>
                                <button 
                                    onClick={() => setViewMode('stats')} 
                                    className={`${styles.viewToggleButton} ${viewMode === 'stats' ? styles.active : ''}`} 
                                    aria-label="Stats View"
                                >
                                    <Icons.BarChart />
                                </button>
                            </div>
                        </motion.div>
                    </div>
                </section>

                {/* Repositories Section */}
                <section className="container mx-auto px-4 sm:px-6 relative z-10 pb-16 md:pb-24">
                    {/* Filter & Sort Bar */}
                    {!loading && !error && repositories.length > 0 && (
                        <div className={styles.filterSortBar}>
                            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                                {/* Search */}
                                <div className={styles.filterInputContainer}>
                                    <Icons.Search />
                                    <input
                                        type="text"
                                        placeholder="Search manicinc repositories..."
                                        value={searchQuery}
                                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchQuery(e.target.value)}
                                        className={styles.filterInput}
                                    />
                                </div>
                                
                                {/* Language Filter */}
                                <div>
                                    <label className={styles.filterLabel}>Language</label>
                                    <select
                                        value={filterLanguage || ''}
                                        onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setFilterLanguage(e.target.value || null)}
                                        className={styles.filterSelect}
                                    >
                                        <option value="">All Languages</option>
                                        {languages.map(lang => (
                                            <option key={lang} value={lang}>{lang}</option>
                                        ))}
                                    </select>
                                </div>
                                
                                {/* Topic Filter */}
                                <div>
                                    <label className={styles.filterLabel}>Topic</label>
                                    <select
                                        value={filterTopic || ''}
                                        onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setFilterTopic(e.target.value || null)}
                                        className={styles.filterSelect}
                                    >
                                        <option value="">All Topics</option>
                                        {topics.map(topic => (
                                            <option key={topic} value={topic}>{topic}</option>
                                        ))}
                                    </select>
                                </div>
                                
                                {/* Sort */}
                                <div>
                                    <label className={styles.filterLabel}>Sort by</label>
                                    <select
                                        value={sortBy}
                                        onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setSortBy(e.target.value as 'pushed' | 'stars' | 'name')}
                                        className={styles.filterSelect}
                                    >
                                        <option value="pushed">Recently Updated</option>
                                        <option value="stars">Most Stars</option>
                                        <option value="name">Name</option>
                                    </select>
                                </div>
                            </div>
                            
                            {/* Active Filters */}
                            {(filterLanguage || filterTopic || searchQuery) && (
                                <div className={styles.resultsInfo}>
                                    <div className={styles.filterPills}>
                                        {searchQuery && (
                                            <span className={`${styles.filterPill} ${styles.search}`}>
                                                <Icons.Search />
                                                Search: &quot;{searchQuery}&quot;
                                                <button onClick={() => setSearchQuery('')}>×</button>
                                            </span>
                                        )}
                                        {filterLanguage && (
                                            <span className={`${styles.filterPill} ${styles.lang}`}>
                                                <Icons.Code />
                                                {filterLanguage}
                                                <button onClick={() => setFilterLanguage(null)}>×</button>
                                            </span>
                                        )}
                                        {filterTopic && (
                                            <span className={`${styles.filterPill} ${styles.topic}`}>
                                                <Icons.Tag />
                                                {filterTopic}
                                                <button onClick={() => setFilterTopic(null)}>×</button>
                                            </span>
                                        )}
                                        <button
                                            onClick={() => {
                                                setSearchQuery('');
                                                setFilterLanguage(null);
                                                setFilterTopic(null);
                                            }}
                                            className={styles.btnResetFilter}
                                        >
                                            <Icons.Refresh />
                                            Clear All
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}

                    {/* Loading/Error States */}
                    {loading && (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {Array.from({ length: 6 }).map((_, i) => (
                                <div key={i} className={styles.skeletonCard}>
                                    <div style={{ height: '20px', marginBottom: '10px' }}></div>
                                    <div style={{ height: '40px', marginBottom: '15px' }}></div>
                                    <div style={{ height: '15px', width: '60%' }}></div>
                                </div>
                            ))}
                        </div>
                    )}
                    
                    {error && (
                        <div className={styles.errorState}>
                            <Icons.AlertTriangle />
                            <h3 className={styles.stateTitle}>Failed to Load Repositories for </h3> <strong>manicinc</strong>
                            <p className={styles.stateDesc}>Error: {error}</p>
                        </div>
                    )}
                    
                    {/* Repository Display - Grid View */}
                    {!loading && !error && repositories.length > 0 && viewMode === 'grid' && (
                        <>
                            <div className={styles.resultsInfo}>
                                <div className={styles.resultsCount}>
                                    {filteredRepositories.length} of {repositories.length} repositories
                                </div>
                            </div>

                            <motion.div
                                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                                initial="hidden"
                                animate="visible"
                            >
                                {filteredRepositories.map(repo => (
                                    <motion.div
                                        key={repo.id}
                                        ref={(el) => { if (el) repositoryRefs.current[repo.id] = el; }}
                                        className={styles.repositoryCard}
                                        onClick={() => openRepoModal(repo)}
                                        tabIndex={0}
                                        role="button"
                                        onKeyDown={(e: React.KeyboardEvent<HTMLDivElement>) => {
                                            if (['Enter', ' '].includes(e.key)) {
                                                e.preventDefault();
                                                openRepoModal(repo);
                                            }
                                        }}
                                    >
                                        {repo.archived && (
                                            <div className={styles.archivedBadge}>
                                                <Icons.Archive /> Archived
                                            </div>
                                        )}
                                        <div className={styles.repoName}>
                                            <Icons.Code />
                                            <span>{repo.name}</span>
                                        </div>
                                        <div className={styles.repoDescription}>
                                            {repo.description || <span className={styles.noDesc}>No description available</span>}
                                        </div>
                                        <div className={styles.repoStats}>
                                            <span><Icons.Star /> {repo.stargazers_count}</span>
                                            <span><Icons.Fork /> {repo.forks_count}</span>
                                            <span><Icons.Issues /> {repo.open_issues_count}</span>
                                        </div>
                                        <div className={styles.repoFooter}>
                                            {repo.language && (
                                                <div className={styles.langDisplay}>
                                                    <span 
                                                        className={styles.langDot}
                                                        style={{ backgroundColor: getLanguageColor(repo.language) }}
                                                    ></span>
                                                    <span className={styles.langName}>{repo.language}</span>
                                                </div>
                                            )}
                                            <div className={styles.repoTopics}>
                                                {repo.topics?.slice(0, 3).map(topic => (
                                                    <span key={topic} className={styles.topicTag}>{topic}</span>
                                                ))}
                                                {(repo.topics?.length || 0) > 3 && (
                                                    <span className={styles.topicTagMore}>+{(repo.topics?.length || 0) - 3}</span>
                                                )}
                                            </div>
                                        </div>
                                        <div className={styles.viewDetailsPrompt}>
                                            Click to view details
                                        </div>
                                    </motion.div>
                                ))}
                            </motion.div>
                        </>
                    )}

                    {/* List view */}
                    {!loading && !error && repositories.length > 0 && viewMode === 'list' && (
                        <div className={styles.listViewContainer}>
                            <div className={styles.resultsInfo}>
                                <div className={styles.resultsCount}>
                                    {filteredRepositories.length} of {repositories.length} repositories
                                </div>
                            </div>
                            
                            <div className={styles.listHeader}>
                                <div className={styles.colName}>Repository</div>
                                <div className={styles.colLang}>Language</div>
                                <div className={styles.colStars}>Stars</div>
                                <div className={styles.colForks}>Forks</div>
                                <div className={styles.colUpdated}>Last Update</div>
                            </div>
                            
                            {filteredRepositories.map(repo => (
                                <div key={repo.id} className={styles.listItem} onClick={() => openRepoModal(repo)}>
                                    <div className={styles.colName}>
                                        <Icons.Code className={styles.icon} />
                                        <span>{repo.full_name}</span>
                                        {repo.archived && <Icons.Archive className={styles.archivedIconList} />}
                                    </div>
                                    <div className={styles.colLang}>
                                        {repo.language ? (
                                            <>
                                                <span 
                                                    className={styles.langDot}
                                                    style={{ backgroundColor: getLanguageColor(repo.language) }}
                                                ></span>
                                                <span className={styles.langName}>{repo.language}</span>
                                            </>
                                        ) : (
                                            <span className={styles.noLang}>-</span>
                                        )}
                                    </div>
                                    <div className={styles.colStars}>
                                        <Icons.Star className={styles.icon} />
                                        {formatLargeNumber(repo.stargazers_count)}
                                    </div>
                                    <div className={styles.colForks}>
                                        <Icons.Fork className={styles.icon} />
                                        {formatLargeNumber(repo.forks_count)}
                                    </div>
                                    <div className={styles.colUpdated}>
                                        {timeAgo(repo.pushed_at)}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    {/* Stats view */}
                    {!loading && !error && repositories.length > 0 && viewMode === 'stats' && (
                        <div className={styles.statsViewContainer}>
                            {/* Grid for large stat boxes */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
                                <div className={`${styles.statBoxLg} ${styles.borderPrimary}`}>
                                    <div className={styles.statHeader}>
                                        <Icons.Code />
                                        Total Repos
                                    </div>
                                    <div className={styles.statValue}>{repositories.length.toLocaleString()}</div>
                                    <p className={styles.statSubtext}>Last Push: {repositories.length > 0 ? timeAgo(repositories[0].pushed_at) : 'N/A'}</p>
                                </div>
                                <div className={`${styles.statBoxLg} ${styles.borderYellow}`}>
                                    <div className={styles.statHeader}>
                                        <Icons.Star />
                                        Total Stars
                                    </div>
                                    <div className={styles.statValue}>
                                        {formatLargeNumber(repositories.reduce((sum, repo) => sum + repo.stargazers_count, 0))}
                                    </div>
                                    <p className={styles.statSubtext}>
                                        Avg per Repo: {repositories.length > 0 ? (repositories.reduce((sum, repo) => sum + repo.stargazers_count, 0) / repositories.length).toFixed(1) : '0'}
                                    </p>
                                </div>
                                <div className={`${styles.statBoxLg} ${styles.borderSecondary}`}>
                                    <div className={styles.statHeader}>
                                        <Icons.Fork />
                                        Total Forks
                                    </div>
                                    <div className={styles.statValue}>
                                        {formatLargeNumber(repositories.reduce((sum, repo) => sum + repo.forks_count, 0))}
                                    </div>
                                    <p className={styles.statSubtext}>
                                        Avg per Repo: {repositories.length > 0 ? (repositories.reduce((sum, repo) => sum + repo.forks_count, 0) / repositories.length).toFixed(1) : '0'}
                                    </p>
                                </div>
                                <div className={`${styles.statBoxLg} ${styles.borderOrange}`}>
                                    <div className={styles.statHeader}>
                                        <Icons.Issues />
                                        Open Issues
                                    </div>
                                    <div className={styles.statValue}>
                                        {repositories.reduce((sum, repo) => sum + repo.open_issues_count, 0).toLocaleString()}
                                    </div>
                                    <p className={styles.statSubtext}>
                                        Avg per Repo: {repositories.length > 0 ? (repositories.reduce((sum, repo) => sum + repo.open_issues_count, 0) / repositories.length).toFixed(1) : '0'}
                                    </p>
                                </div>
                            </div>
                            
                            {/* Grid for themed boxes (languages, topics) */}
                            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                                <div className={`${styles.themedBox} lg:col-span-2`}>
                                    <div className={styles.boxHeaderSimple}>
                                        <Icons.Code className={styles.headerIconLang} />
                                        <h3 className={styles.boxTitle}>Language Distribution</h3>
                                    </div>
                                    <div className={styles.boxContent}>
                                        {languages.length > 0 ? (
                                            <div className={styles.languageBars}>
                                                {languages.slice(0, 8).map((lang) => {
                                                    const count = repositories.filter(r => r.language === lang).length;
                                                    const percentage = Math.round((count / repositories.length) * 100);
                                                    return (
                                                        <div key={lang} className={styles.languageBarItem}>
                                                            <div className={styles.langLabel}>
                                                                <span>
                                                                    <span 
                                                                        className={styles.langDotInline}
                                                                        style={{ backgroundColor: getLanguageColor(lang) }}
                                                                    ></span>
                                                                    {lang}
                                                                </span>
                                                                <span className={styles.langPercent}>{percentage}%</span>
                                                            </div>
                                                            <div className={styles.langBarBg}>
                                                                <motion.div
                                                                    className={styles.langBarFg}
                                                                    style={{ 
                                                                        backgroundColor: getLanguageColor(lang),
                                                                        boxShadow: `0 0 8px 0px ${getLanguageColor(lang)}`
                                                                    }}
                                                                    initial={{ width: '0%' }}
                                                                    animate={{ width: `${percentage}%` }}
                                                                    transition={{ duration: 0.8, ease: 'easeOut' }}
                                                                ></motion.div>
                                                            </div>
                                                        </div>
                                                    );
                                                })}
                                            </div>
                                        ) : (
                                            <p className="text-sm text-muted italic p-4 text-center">No language data available.</p>
                                        )}
                                    </div>
                                </div>
                                <div className={styles.themedBox}>
                                    <div className={styles.boxHeaderSimple}>
                                        <Icons.Tag className={styles.headerIconTopic} />
                                        <h3 className={styles.boxTitle}>Popular Topics</h3>
                                    </div>
                                    <div className={styles.boxContent}>
                                        <div className="flex flex-wrap gap-2">
                                            {topics.length > 0 ? topics.slice(0, 18).map(topic => {
                                                const count = repositories.filter(r => r.topics?.includes(topic)).length;
                                                return (
                                                    <button 
                                                        key={topic} 
                                                        onClick={() => { 
                                                            setFilterTopic(topic); 
                                                            setViewMode('grid');
                                                        }} 
                                                        className={`${styles.topicPill} ${filterTopic === topic ? styles.active : ''}`}
                                                        title={`Filter by ${topic} (${count})`}
                                                    >
                                                        {topic}
                                                    </button>
                                                );
                                            }) : (
                                                <p className="text-sm text-muted italic text-center w-full">No common topics found.</p>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </section>

                {/* Modal */}
                <AnimatePresence>
                    {showModal && selectedRepo && (
                        <motion.div
                            className={styles.modalBackdrop}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={closeRepoModal}
                        >
                            <motion.div
                                className={styles.modalContent}
                                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                                animate={{ opacity: 1, scale: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.95, y: 15 }}
                                onClick={(e: React.MouseEvent<HTMLDivElement>) => e.stopPropagation()}
                            >
                                <div className={styles.modalHeader}>
                                    <div className={styles.modalTitle}>
                                        <Icons.Code />
                                        <span>{selectedRepo.name}</span>
                                        {selectedRepo.archived && (
                                            <span className={styles.modalArchivedBadge}>
                                                <Icons.Archive /> Archived
                                            </span>
                                        )}
                                    </div>
                                    <button
                                        onClick={closeRepoModal}
                                        className={styles.modalCloseBtn}
                                        aria-label="Close modal"
                                    >
                                        <Icons.X />
                                    </button>
                                </div>
                                <div className={styles.modalBody}>
                                    <div className={styles.modalDescription}>
                                        {selectedRepo.description || <span className={styles.noDesc}>No description available</span>}
                                    </div>
                                    
                                    {/* Main Stats Grid */}
                                    <div className={styles.modalStatsGrid}>
                                        <div className={styles.statItem}>
                                            <span><Icons.Star className={styles.starIcon} /> Stars</span>
                                            <strong>{selectedRepo.stargazers_count?.toLocaleString()}</strong>
                                        </div>
                                        <div className={styles.statItem}>
                                            <span><Icons.Eye className={styles.watchIcon} /> Watchers</span>
                                            <strong>{selectedRepo.watchers_count?.toLocaleString()}</strong>
                                        </div>
                                        <div className={styles.statItem}>
                                            <span><Icons.Fork className={styles.forkIcon} /> Forks</span>
                                            <strong>{selectedRepo.forks_count?.toLocaleString()}</strong>
                                        </div>
                                        <div className={styles.statItem}>
                                            <span><Icons.Issues className={styles.issueIcon} /> Open Issues</span>
                                            <strong>{selectedRepo.open_issues_count?.toLocaleString()}</strong>
                                        </div>
                                        
                                        {/* Additional Stats - Show with loading state */}
                                        <div className={styles.statItem}>
                                            <span><Icons.Users className={styles.usersIcon} /> Contributors</span>
                                            <strong>
                                                {loadingDetails ? (
                                                    <span className={styles.loadingDots}>Loading...</span>
                                                ) : (
                                                    detailedStats?.contributors_count?.toLocaleString() || '0'
                                                )}
                                            </strong>
                                        </div>
                                        <div className={styles.statItem}>
                                            <span><Icons.GitCommit className={styles.commitIcon} /> Commits</span>
                                            <strong>
                                                {loadingDetails ? (
                                                    <span className={styles.loadingDots}>Loading...</span>
                                                ) : (
                                                    detailedStats?.commits_count?.toLocaleString() || '0'
                                                )}
                                            </strong>
                                        </div>
                                        <div className={styles.statItem}>
                                            <span><Icons.GitPullRequest className={styles.prIcon} /> Pull Requests</span>
                                            <strong>
                                                {loadingDetails ? (
                                                    <span className={styles.loadingDots}>Loading...</span>
                                                ) : (
                                                    detailedStats?.pull_requests_count?.toLocaleString() || '0'
                                                )}
                                            </strong>
                                        </div>
                                        <div className={styles.statItem}>
                                            <span><Icons.Tag className={styles.releaseIcon} /> Releases</span>
                                            <strong>
                                                {loadingDetails ? (
                                                    <span className={styles.loadingDots}>Loading...</span>
                                                ) : (
                                                    detailedStats?.releases_count?.toLocaleString() || '0'
                                                )}
                                            </strong>
                                        </div>
                                    </div>

                                    {/* Detailed Information Sections */}
                                    <div className={styles.modalDetailSections}>
                                        {/* Repository Details */}
                                        <div className={styles.detailSection}>
                                            <h4 className={styles.subHeading}>Repository Details</h4>
                                            <div className={styles.detailGrid}>
                                                <div className={styles.detailItem}>
                                                    <span className={styles.detailLabel}><Icons.Calendar /> Created</span>
                                                    <span className={styles.detailValue}>{formatDate(selectedRepo.created_at)}</span>
                                                </div>
                                                <div className={styles.detailItem}>
                                                    <span className={styles.detailLabel}><Icons.Clock /> Last Updated</span>
                                                    <span className={styles.detailValue}>{timeAgo(selectedRepo.updated_at)}</span>
                                                </div>
                                                <div className={styles.detailItem}>
                                                    <span className={styles.detailLabel}><Icons.GitCommit /> Last Push</span>
                                                    <span className={styles.detailValue}>{timeAgo(selectedRepo.pushed_at)}</span>
                                                </div>
                                                <div className={styles.detailItem}>
                                                    <span className={styles.detailLabel}><Icons.Database /> Size</span>
                                                    <span className={styles.detailValue}>{formatBytes(selectedRepo.size * 1024)}</span>
                                                </div>
                                                {selectedRepo.language && (
                                                    <div className={styles.detailItem}>
                                                        <span className={styles.detailLabel}><Icons.Code /> Language</span>
                                                        <span className={styles.detailValue}>
                                                            <span 
                                                                className={styles.langDotInline}
                                                                style={{ backgroundColor: getLanguageColor(selectedRepo.language) }}
                                                            ></span>
                                                            {selectedRepo.language}
                                                        </span>
                                                    </div>
                                                )}
                                                {selectedRepo.license && (
                                                    <div className={styles.detailItem}>
                                                        <span className={styles.detailLabel}><Icons.Shield /> License</span>
                                                        <span className={styles.detailValue}>{selectedRepo.license.name}</span>
                                                    </div>
                                                )}
                                            </div>
                                        </div>

                                        {/* Activity Summary */}
                                        {detailedStats && !loadingDetails && (
                                            <div className={styles.detailSection}>
                                                <h4 className={styles.subHeading}>Activity Summary</h4>
                                                <div className={styles.activityGrid}>
                                                    <div className={styles.activityItem}>
                                                        <div className={styles.activityValue}>{detailedStats.pull_requests_count}</div>
                                                        <div className={styles.activityLabel}>Total PRs</div>
                                                    </div>
                                                    <div className={styles.activityItem}>
                                                        <div className={styles.activityValue}>{detailedStats.closed_pull_requests_count}</div>
                                                        <div className={styles.activityLabel}>Closed PRs</div>
                                                    </div>
                                                    <div className={styles.activityItem}>
                                                        <div className={styles.activityValue}>{Math.max(0, detailedStats.pull_requests_count - detailedStats.closed_pull_requests_count)}</div>
                                                        <div className={styles.activityLabel}>Open PRs</div>
                                                    </div>
                                                    <div className={styles.activityItem}>
                                                        <div className={styles.activityValue}>{detailedStats.contributors_count}</div>
                                                        <div className={styles.activityLabel}>Contributors</div>
                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                    {selectedRepo.topics && selectedRepo.topics.length > 0 && (
                                        <div className={styles.modalTopics}>
                                            <h4 className={styles.subHeading}>Topics</h4>
                                            <div className={styles.tagsList}>
                                                {selectedRepo.topics.map(topic => (
                                                    <span key={topic} className={styles.tagChip}>{topic}</span>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                    <div className={styles.modalCtaSeparator}></div>
                                    <div className={styles.modalCtaButtons}>
                                        <a 
                                            href={selectedRepo.html_url} 
                                            target="_blank" 
                                            rel="noopener noreferrer"
                                            className={styles.modalButtonPrimary}
                                        >
                                            <Icons.GitHub /> View on GitHub
                                        </a>
                                        {selectedRepo.homepage && (
                                            <a 
                                                href={selectedRepo.homepage} 
                                                target="_blank" 
                                                rel="noopener noreferrer"
                                                className={styles.modalButtonOutline}
                                            >
                                                <Icons.ExternalLink /> Live Demo
                                            </a>
                                        )}
                                    </div>
                                </div>
                            </motion.div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </main>
        </>
    );
} 