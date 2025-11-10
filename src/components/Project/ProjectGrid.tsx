// src/components/Project/ProjectGrid.tsx
// V16 - Fixed Language Logic (Using V4 CSS Module)

'use client';

import React, { useState, useMemo, useCallback, useEffect } from 'react';
import { Project } from '@/types/project';
import ProjectCard from './ProjectCard';
import { Filter, X, ArrowDownNarrowWide, ArrowUpWideNarrow, RotateCcw, Search, Star, GitFork, Github } from 'lucide-react';
import styles from './ProjectGrid.module.css'; // Using CSS Modules

interface Props {
  projects: Project[];
  categories: string[];
}

// --- Helper Functions ---
const getAllTags = (projects: Project[]): string[] => {
    const tags = new Set<string>();
    projects?.forEach(p => p?.tags?.forEach(t => { if (t) tags.add(t.trim()) }));
    return Array.from(tags).sort((a, b) => a.toLowerCase().localeCompare(b.toLowerCase()));
};

// CORRECTED Language Logic
const getAllLanguages = (projects: Project[]): string[] => {
    const languages = new Set<string>();
    projects?.forEach(p => {
        if (p?.languages && Array.isArray(p.languages)) { p.languages.forEach(lang => { if (lang) languages.add(lang.trim()); }); }
        if (p?.stats && Array.isArray(p.stats)) { const langStat = p.stats.find(s => s?.label?.toLowerCase() === 'language'); if (langStat?.value && typeof langStat.value === 'string') { langStat.value.split(/[,/ ]+/).forEach(lang => { if (lang) languages.add(lang.trim()); }); } }
    });
    return Array.from(languages).sort((a, b) => a.toLowerCase().localeCompare(b.toLowerCase()));
};

const parseNumericStat = (value: string | number | undefined): number => { if (typeof value === 'number') return value; if (typeof value !== 'string' || !value) return 0; const c = value.toLowerCase().trim().replace(/,/g, ''); let n = parseFloat(c); if (isNaN(n)) return 0; if (c.endsWith('k')) n *= 1000; else if (c.endsWith('m')) n *= 1000000; return Math.round(n); };
const getStatValue = (project: Project | null | undefined, statName: 'Stars' | 'Forks' | string): number => { if (!project) return 0; const pl = [statName.toLowerCase(), `github ${statName}`.toLowerCase()]; if (project.stats && Array.isArray(project.stats)) { for (const l of pl) { const s = project.stats.find(st => st?.label?.trim().toLowerCase() === l); if (s && typeof s.value !== 'undefined') { return parseNumericStat(s.value); } } } const dpn = statName.toLowerCase(); if (project.hasOwnProperty(dpn) && typeof (project as any)[dpn] !== 'undefined') { return parseNumericStat((project as any)[dpn]); } if (project.hasOwnProperty(`github${statName}`) && typeof (project as any)[`github${statName}`] !== 'undefined') { return parseNumericStat((project as any)[`github${statName}`]); } return 0; };
// --- End Helper Functions ---


// --- Component ---
const ProjectGrid: React.FC<Props> = ({ projects = [], categories = [] }) => {
    // --- State Variables ---
    const [selectedCategory, setSelectedCategory] = useState<string>('all');
    const [selectedTags, setSelectedTags] = useState<Set<string>>(new Set());
    const [selectedLanguages, setSelectedLanguages] = useState<Set<string>>(new Set());
    const [minStarsInput, setMinStarsInput] = useState<string>('');
    const [minForksInput, setMinForksInput] = useState<string>('');
    const [searchTerm, setSearchTerm] = useState<string>('');
    const [showFilters, setShowFilters] = useState<boolean>(false);
    type SortKey = 'date' | 'stars' | 'forks' | 'title';
    const [sortBy, setSortBy] = useState<SortKey>('date');
    const [sortDirection, setSortDirection] = useState<'desc' | 'asc'>('desc');
    const [isFiltering, setIsFiltering] = useState(false);

    const minStars = useMemo(() => parseInt(minStarsInput, 10) || 0, [minStarsInput]);
    const minForks = useMemo(() => parseInt(minForksInput, 10) || 0, [minForksInput]);

    const validProjects = useMemo(() => Array.isArray(projects) ? projects : [], [projects]);
    const allTags = useMemo(() => getAllTags(validProjects), [validProjects]);
    const allLanguages = useMemo(() => getAllLanguages(validProjects), [validProjects]);
    const popularTags = useMemo(() => allTags.slice(0, 12), [allTags]);

    useEffect(() => { setIsFiltering(true); const timer = setTimeout(() => setIsFiltering(false), 250); return () => clearTimeout(timer); }, [selectedCategory, selectedTags, selectedLanguages, minStars, minForks, searchTerm, sortBy, sortDirection]);

    const toggleTag = useCallback((tag: string) => { setSelectedTags(prev => { const ns = new Set(prev); ns.has(tag)?ns.delete(tag):ns.add(tag); return ns; }); }, []);
    const toggleLanguage = useCallback((lang: string) => { setSelectedLanguages(prev => { const ns = new Set(prev); ns.has(lang)?ns.delete(lang):ns.add(lang); return ns; }); }, []);
    const handleSort = useCallback((key: SortKey) => { setSortBy(prevSortBy => { if (prevSortBy === key) { setSortDirection(prev => prev === 'asc' ? 'desc' : 'asc'); } else { setSortDirection(key === 'title' ? 'asc' : 'desc'); } return key; }); }, []);
    const resetFilters = useCallback(() => { setSelectedCategory('all'); setSelectedTags(new Set()); setSelectedLanguages(new Set()); setMinStarsInput(''); setMinForksInput(''); setSearchTerm(''); setSortBy('date'); setSortDirection('desc'); }, []);
    const handleToggleFilters = useCallback(() => { setShowFilters(prev => !prev); }, []);
    const handleMinStarsChange = (e: React.ChangeEvent<HTMLInputElement>) => { const v = e.target.value; if (v === '' || /^[0-9]+$/.test(v)) { setMinStarsInput(v); } };
    const handleMinForksChange = (e: React.ChangeEvent<HTMLInputElement>) => { const v = e.target.value; if (v === '' || /^[0-9]+$/.test(v)) { setMinForksInput(v); } };

    const processedProjects = useMemo(() => {
        const filtered = validProjects.filter(p => {
            if (!p || !p.title) return false;
            const matchCategory = selectedCategory === 'all' || p.category === selectedCategory;
            const projectTagsLower = p.tags?.map(t => t?.toLowerCase().trim()).filter(Boolean) ?? [];
            const matchTags = selectedTags.size === 0 || Array.from(selectedTags).every(selTag => projectTagsLower.includes(selTag.toLowerCase()));
            // CORRECTED Language matching
            const projectLanguagesLower = new Set<string>();
             if (p?.languages && Array.isArray(p.languages)) { p.languages.forEach(l => {if(l) projectLanguagesLower.add(l.trim().toLowerCase())}) }
             if (p?.stats && Array.isArray(p.stats)) { const langStat = p.stats.find(s => s?.label?.toLowerCase() === 'language'); if (langStat?.value && typeof langStat.value === 'string') { langStat.value.split(/[,/ ]+/).forEach(lang => { if (lang) projectLanguagesLower.add(lang.trim().toLowerCase()); }); } }
            const matchLanguages = selectedLanguages.size === 0 || Array.from(selectedLanguages).every(selLang => projectLanguagesLower.has(selLang.toLowerCase()));
            const stars = getStatValue(p, 'Stars'); const forks = getStatValue(p, 'Forks');
            const matchStars = minStars === 0 || stars >= minStars;
            const matchForks = minForks === 0 || forks >= minForks;
            const term = searchTerm.toLowerCase().trim();
            const matchSearch = term === '' || p.title.toLowerCase().includes(term) || (p.description && p.description.toLowerCase().includes(term)) || projectTagsLower.some(tag => tag.includes(term));
            return matchCategory && matchTags && matchLanguages && matchStars && matchForks && matchSearch;
        });
        // Sorting
        const sorted = [...filtered].sort((a, b) => {
             if (!a || !b) return 0; const dir = sortDirection === 'asc' ? 1 : -1;
             if (a.draft !== b.draft) { if (sortBy === 'date') { return (a.draft ? 1 : -1) * dir; } else { return a.draft ? 1 : -1; } }
             switch (sortBy) {
                case 'stars': return (getStatValue(a, 'Stars') - getStatValue(b, 'Stars')) * dir;
                case 'forks': return (getStatValue(a, 'Forks') - getStatValue(b, 'Forks')) * dir;
                case 'title': return (a.title || '').toLowerCase().localeCompare((b.title || '').toLowerCase()) * dir;
                case 'date': default: const dateA = a.date ? new Date(a.date).getTime() : 0; const dateB = b.date ? new Date(b.date).getTime() : 0; return (dateA - dateB) * dir;
            }
        });
        return sorted;
    }, [validProjects, selectedCategory, selectedTags, selectedLanguages, minStars, minForks, searchTerm, sortBy, sortDirection]);

    const filtersAreActive = useMemo(() => { return selectedCategory !== 'all' || selectedTags.size > 0 || selectedLanguages.size > 0 || minStars > 0 || minForks > 0 || searchTerm !== ''; }, [selectedCategory, selectedTags, selectedLanguages, minStars, minForks, searchTerm]);

    return (
        <div className={`${styles.projectGridWrapper} ${isFiltering ? styles.isFiltering : ''}`}>
            {/* Tag Cloud Section */}
            <section className={styles.tagCloudSection}>
                {categories.length > 0 && (
                    <div className={styles.cloudGroup}>
                        <h4 className={styles.cloudLabel}>// Categories //</h4>
                        <div className={styles.cloudItems}>
                            <button onClick={() => setSelectedCategory('all')} className={`${styles.cloudTag} ${styles.category} ${selectedCategory === 'all' ? styles.active : ''}`}> All </button>
                            {categories.map(cat => ( <button key={cat} onClick={() => setSelectedCategory(cat)} className={`${styles.cloudTag} ${styles.category} ${selectedCategory === cat ? styles.active : ''}`}>{cat}</button> ))}
                        </div>
                    </div>
                )}
                {popularTags.length > 0 && (
                     <div className={styles.cloudGroup}>
                        <h4 className={styles.cloudLabel}>// Popular Tags //</h4>
                        <div className={styles.cloudItems}>
                            {popularTags.map(tag => ( <button key={tag} onClick={() => toggleTag(tag)} className={`${styles.cloudTag} ${styles.tag} ${selectedTags.has(tag) ? styles.active : ''}`}>{tag}</button> ))}
                            {allTags.length > popularTags.length && <span className={`${styles.cloudTag} ${styles.more}`}>...</span>}
                        </div>
                    </div>
                )}
            </section>

            {/* Filter Panel */}
            <div className={styles.filterPanel}>
                <div className={styles.filterTopRow}>
                    <button onClick={handleToggleFilters} className={styles.filterToggleButton} aria-expanded={showFilters} aria-controls="filter-content-area" title={showFilters ? "Hide Filters & Sort" : "Show Filters & Sort"}> <Filter size={16} /> <span>{showFilters ? 'Collapse' : 'Filters'}</span> {filtersAreActive && <span className={styles.activeFilterIndicator} title="Filters Active">!</span>} </button>
                    <div className={styles.searchInputWrapper}> 
                      {/* <Search size={16} className={styles.searchIcon} /> */}
                      <input type="search" id="searchTerm" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} placeholder="Search Matrix..." className={`${styles.filterInput} ${styles.searchInput}`} aria-label="Search projects by keyword" style={{ paddingLeft: '2.4rem' }}/> </div>
                    <button onClick={resetFilters} className={styles.resetButton} title="Reset Filters & Sort" disabled={!filtersAreActive && sortBy === 'date' && sortDirection === 'desc'}> <RotateCcw size={18} strokeWidth={filtersAreActive ? 2.5 : 2}/> <span className={styles.resetButtonText}>Reset</span> </button>
                </div>
                {showFilters && (
                    <div className={styles.filterContent} id="filter-content-area">
                        <div className={styles.filterGroupsWrapper}>
                            <div className={`${styles.filterGroup} ${styles.filterGroupGithub}`}>
                                <strong className={styles.filterLabel}> <Github size={14} style={{marginRight: '0.4rem', verticalAlign: 'middle'}}/> GitHub Metrics </strong>
                                <div className={styles.githubInputsGrid}>
                                    <div> <label htmlFor="minStars" className={`${styles.filterLabel} ${styles.sublabel}`}> <Star size={11} className="inline mr-1 opacity-70"/> Min Stars </label> <input type="number" id="minStars" min="0" step="10" value={minStarsInput} onChange={handleMinStarsChange} className={styles.filterInput} placeholder="0" aria-label="Minimum GitHub stars"/> </div>
                                    <div> <label htmlFor="minForks" className={`${styles.filterLabel} ${styles.sublabel}`}> <GitFork size={11} className="inline mr-1 opacity-70"/> Min Forks </label> <input type="number" id="minForks" min="0" step="5" value={minForksInput} onChange={handleMinForksChange} className={styles.filterInput} placeholder="0" aria-label="Minimum GitHub forks"/> </div>
                                </div>
                                {allLanguages.length > 0 && (
                                    <div className="mt-2">
                                        <label className={`${styles.filterLabel} ${styles.sublabel}`}>Languages</label>
                                        <div className={`${styles.filterOptions} ${styles.scrollableOptions}`}>
                                            {allLanguages.map(lang => ( <button key={lang} onClick={() => toggleLanguage(lang)} className={`${styles.filterButton} ${styles.language} ${selectedLanguages.has(lang) ? styles.active : ''}`}>{lang}</button> ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                            {allTags.length > 0 && (
                                <div className={styles.filterGroup}>
                                    <strong className={styles.filterLabel}>Technology Tags</strong>
                                    <div className={`${styles.filterOptions} ${styles.scrollableOptions}`}>
                                        {allTags.map(tag => ( <button key={tag} onClick={() => toggleTag(tag)} className={`${styles.filterButton} ${styles.tag} ${selectedTags.has(tag) ? styles.active : ''}`}>{tag}</button> ))}
                                    </div>
                                </div>
                            )}
                        </div>
                        <div className={styles.sortControls}>
                            <strong className={styles.filterLabel}>Sort By</strong>
                            <div className={styles.filterOptions}>
                                {(['date', 'title', 'stars', 'forks'] as SortKey[]).map(key => (
                                    <button key={key} onClick={() => handleSort(key)} className={`${styles.filterButton} ${styles.sort} ${sortBy === key ? styles.active : ''}`} title={`Sort by ${key} ${sortBy === key ? (sortDirection === 'asc' ? '(Ascending)' : '(Descending)') : ''}`} aria-pressed={sortBy === key}>
                                        <span>{key}</span> {sortBy === key && ( sortDirection === 'asc' ? <ArrowUpWideNarrow size={14} className={styles.icon} aria-label="Ascending"/> : <ArrowDownNarrowWide size={14} className={styles.icon} aria-label="Descending"/> )}
                                    </button>
                                ))}
                            </div>
                        </div>
                        {filtersAreActive && ( <div className={styles.filterResetInline}> <button onClick={resetFilters} className={styles.resetButtonInline}> <RotateCcw size={14} /> Clear Active Filters </button> </div> )}
                    </div>
                )}
            </div>

            {/* Project Grid Display */}
            <div className={styles.projectsGrid}>
                {processedProjects.length > 0 ? (
                    processedProjects.map(p => p ? <ProjectCard key={`${p.category}-${p.slug}`} project={p} /> : null)
                ) : (
                    <div className={styles.noResultsMessage}>
                        <div className={styles.noResultsIcon}></div>
                        <span className={styles.noResultsText}> /// NO MATCHING DATA STREAMS FOUND ///{'\n'} /// Try adjusting filter parameters or search query. /// </span>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ProjectGrid;