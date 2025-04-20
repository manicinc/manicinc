// src/app/blog/BlogListClient.tsx
'use client';

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import Link from 'next/link';
import { useSearchParams, useRouter, usePathname } from 'next/navigation'; // Now using hook *only* in useEffect
import { BlogPost } from '@/types/blog';
import { AsciiArtPlaceholder } from '@/lib/asciiPlaceholders';

import { EB_Garamond } from 'next/font/google';

// Import Icons
import {
    IconChevronDown, IconOrnateSliders, IconOrnateSearch, IconOrnateX,
    IconCalendar, IconOrnateCalendar, IconOrnateTag, IconOrnateClock,
    IconArrowRight
    // Add specific sort icons if available
} from '@/components/Icons'; // Adjust path

const ebGaramond = EB_Garamond({
  subsets: ['latin'],
  weight: ['400', '700'],
  style: ['normal', 'italic'],
  display: 'swap',
  variable: '--font-meta-blog',
});

const INITIAL_TAG_LIMIT = 12;

// Props only needs initialPosts now
interface BlogListClientProps {
    initialPosts: BlogPost[];
}

// Helper function
const getUniqueItems = (posts: BlogPost[], key: 'tags' | 'category'): string[] => {
    const items = new Set<string>();
    posts.forEach(post => {
        if (key === 'tags' && post.tags) { post.tags.forEach(tag => tag && items.add(tag)); }
        else if (key === 'category' && post.category) { items.add(post.category); }
    });
    return Array.from(items).sort((a, b) => a.localeCompare(b));
};


export default function BlogListClient({ initialPosts }: BlogListClientProps) {
    const router = useRouter();
    const pathname = usePathname();
    // Get searchParams hook, but DON'T use immediately for state
    const searchParams = useSearchParams();

    // State initialized to defaults, NOT from searchParams initially
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
    const [selectedTags, setSelectedTags] = useState<string[]>([]);
    const [sortBy, setSortBy] = useState<'dateDesc' | 'dateAsc' | 'titleAsc' | 'titleDesc'>('dateDesc');
    const [isMounted, setIsMounted] = useState(false); // Track client-side mounting

    // UI State
    const [isFilterPanelOpen, setIsFilterPanelOpen] = useState(true);
    const [showAllTags, setShowAllTags] = useState(false);

    // Effect runs only on the client, AFTER mount
    useEffect(() => {
        setIsMounted(true);
        // Read params from the hook *inside* the effect
        const categoryFromUrl = searchParams.get('category');
        const tagsFromUrl = searchParams.getAll('tags');
        setSelectedCategory(categoryFromUrl);
        setSelectedTags(tagsFromUrl);
    }, [searchParams]); // Dependency ensures it re-runs if URL params change client-side

    // Derive unique items (no change)
    const uniqueCategories = useMemo(() => getUniqueItems(initialPosts, 'category'), [initialPosts]);
    const uniqueTags = useMemo(() => getUniqueItems(initialPosts, 'tags'), [initialPosts]);

    // Filter and sort posts (no change in logic)
    const filteredAndSortedPosts = useMemo(() => {
        // This logic now correctly uses the state, which is updated by useEffect after mount
        let filtered = initialPosts.filter(post => {
             const lowerSearchTerm = searchTerm.toLowerCase();
             const searchMatch = searchTerm ? (post.title?.toLowerCase().includes(lowerSearchTerm) || post.excerpt?.toLowerCase().includes(lowerSearchTerm) || post.tags?.some(tag => tag.toLowerCase().includes(lowerSearchTerm)) || post.category?.toLowerCase().includes(lowerSearchTerm)) : true;
             const categoryMatch = selectedCategory ? post.category === selectedCategory : true;
             const tagsMatch = selectedTags.length > 0 ? selectedTags.every(tag => post.tags?.includes(tag)) : true;
            return searchMatch && categoryMatch && tagsMatch && !post.draft;
        });
        filtered.sort((a, b) => {
            const dateA = new Date(a.date || 0).getTime(); const dateB = new Date(b.date || 0).getTime();
            const titleA = a.title || ''; const titleB = b.title || '';
             switch (sortBy) {
                 case 'dateAsc': return dateA - dateB; case 'titleAsc': return titleA.localeCompare(titleB);
                 case 'titleDesc': return titleB.localeCompare(titleA); case 'dateDesc': default: return dateB - dateA;
             }
        });
        return filtered;
    }, [initialPosts, searchTerm, selectedCategory, selectedTags, sortBy]);

    // --- Handlers ---
    // Function to update URL search params (optional, based on desired UX)
    const updateUrlParams = (newFilters: { category?: string | null, tags?: string[] }) => {
         const currentParams = new URLSearchParams(Array.from(searchParams.entries())); // Get current params

         // Update category
         if (newFilters.category) {
             currentParams.set('category', newFilters.category);
         } else {
             currentParams.delete('category');
         }

         // Update tags (remove all first, then add selected)
         currentParams.delete('tags');
         (newFilters.tags || []).forEach(tag => currentParams.append('tags', tag));

         const queryString = currentParams.toString();
         // Use router.push or router.replace. Replace avoids adding to browser history.
         router.replace(`${pathname}${queryString ? `?${queryString}` : ''}`, { scroll: false });
     };

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => setSearchTerm(e.target.value);
    const clearSearch = () => setSearchTerm('');

    const handleCategoryClick = (category: string | null) => {
        const newCategory = selectedCategory === category ? null : category;
        setSelectedCategory(newCategory);
        // updateUrlParams({ category: newCategory, tags: selectedTags }); // Update URL
    };
    const handleTagClick = (tag: string) => {
        const newTags = selectedTags.includes(tag) ? selectedTags.filter(t => t !== tag) : [...selectedTags, tag];
        setSelectedTags(newTags);
        // updateUrlParams({ category: selectedCategory, tags: newTags }); // Update URL
    };
    const handleSortChange = (newSortBy: typeof sortBy) => setSortBy(newSortBy);
    const resetFilters = () => {
        setSearchTerm('');
        setSelectedCategory(null);
        setSelectedTags([]);
        setSortBy('dateDesc');
        setShowAllTags(false);
       // updateUrlParams({ category: null, tags: [] }); // Update URL
    };
    const toggleFilterPanel = useCallback(() => setIsFilterPanelOpen(prev => !prev), []);
    const toggleShowAllTags = useCallback(() => setShowAllTags(prev => !prev), []);

    const displayedTags = showAllTags ? uniqueTags : uniqueTags.slice(0, INITIAL_TAG_LIMIT);

    // Render loading or null before mount? Optional, but can prevent brief "flash" of unfiltered content
     if (!isMounted) {
         // Or your specific loading fallback for this section
         return <div className="loading-fallback">Initializing Filters...</div>;
     }

    // --- JSX RENDER ---
    return (
        <div className={ebGaramond.className}>
            {/* Collapsible Filter Panel */}
            <div className={`filter-panel-container ${!isFilterPanelOpen ? 'collapsed' : ''}`}>
                <div className="filter-panel-header" onClick={toggleFilterPanel} role="button" tabIndex={0} aria-expanded={isFilterPanelOpen} aria-controls="filter-panel-content">
                    <button className="filter-panel-toggle" aria-label={isFilterPanelOpen ? "Hide Tuning" : "Show Tuning"}>
                        <IconOrnateSliders /> <span>{isFilterPanelOpen ? "Hide Tuning" : "Show Tuning"}</span> <IconChevronDown className="toggle-icon" />
                    </button>
                </div>
                <div id="filter-panel-content" className="blog-filters">
                    {/* Search */}
                    <div className="filter-group search-filter-group">
                        <label htmlFor="blog-search" className="filter-label"><IconOrnateSearch className="filter-icon"/> Inquire Within</label>
                        <div className="relative"><span className="search-icon absolute"><IconOrnateSearch size={18}/></span><input type="text" id="blog-search" placeholder="Search entries..." value={searchTerm} onChange={handleSearchChange} className="blog-search-input"/>{searchTerm && ( <button onClick={clearSearch} className="blog-search-clear" aria-label="Clear search"><IconOrnateX size={14}/></button> )}</div>
                    </div>
                    {/* Sort */}
                    <div className="filter-group sort-filter-group">
                        <label className="filter-label">Arrange By:</label>
                        <div className="sort-buttons">
                             <button onClick={() => handleSortChange('dateDesc')} className={`sort-button ${sortBy === 'dateDesc' ? 'active' : ''}`}><IconOrnateCalendar /> Date (Newest)</button>
                             <button onClick={() => handleSortChange('dateAsc')} className={`sort-button ${sortBy === 'dateAsc' ? 'active' : ''}`}><IconOrnateCalendar style={{transform: 'scaleY(-1)'}}/> Date (Oldest)</button>
                             <button onClick={() => handleSortChange('titleAsc')} className={`sort-button ${sortBy === 'titleAsc' ? 'active' : ''}`}><IconOrnateTag /> Title (A-Z)</button>
                             <button onClick={() => handleSortChange('titleDesc')} className={`sort-button ${sortBy === 'titleDesc' ? 'active' : ''}`}><IconOrnateTag style={{transform: 'scaleY(-1)'}}/> Title (Z-A)</button>
                        </div>
                    </div>
                     {/* Categories */}
                    {uniqueCategories.length > 0 && ( <div className="filter-group category-filter-group"> <label className="filter-label"><IconOrnateTag className="filter-icon" /> Chapters</label> <div className="filter-options">{uniqueCategories.map(category => (<button key={category} onClick={() => handleCategoryClick(category)} className={`blog-category-filter ${selectedCategory === category ? 'active' : ''}`}>{category.replace(/-/g, ' ')}</button>))}</div> </div> )}
                     {/* Tags */}
                     {uniqueTags.length > 0 && ( <div className="filter-group tag-filter-group"> <label className="filter-label"><IconOrnateTag className="filter-icon" /> Terms</label> <div className="filter-options">{displayedTags.map(tag => (<button key={tag} onClick={() => handleTagClick(tag)} className={`blog-tag-filter ${selectedTags.includes(tag) ? 'active' : ''}`}>#{tag}</button>))}</div> {uniqueTags.length > INITIAL_TAG_LIMIT && (<button onClick={toggleShowAllTags} className="show-more-tags-btn">{showAllTags ? 'Show Fewer...' : `Show All (${uniqueTags.length})...`}</button>)}</div> )}
                </div>
            </div>

            {/* Filter Summary */}
            {(selectedCategory || selectedTags.length > 0 || searchTerm) && (
                <div className="filter-summary">
                    <span className="results-count">Filtered Results ({filteredAndSortedPosts.length} found):</span>
                    <div className="active-filters">
                        {searchTerm && (<span className="active-filter"><span>Search: "{searchTerm}"</span><button onClick={clearSearch} aria-label="Clear search term"><IconOrnateX size={12}/></button></span>)}
                        {selectedCategory && (<span className="active-filter"><span>Chapter: {selectedCategory.replace(/-/g, ' ')}</span><button onClick={() => handleCategoryClick(null)} aria-label={`Remove category filter ${selectedCategory}`}><IconOrnateX size={12}/></button></span>)}
                        {selectedTags.map(tag => (<span key={tag} className="active-filter"><span>Term: #{tag}</span><button onClick={() => handleTagClick(tag)} aria-label={`Remove tag filter ${tag}`}><IconOrnateX size={12}/></button></span>))}
                    </div>
                    <button onClick={resetFilters} className="reset-filters-btn ml-auto">Reset Filters</button>
                </div>
            )}

            {/* Blog Post Grid */}
            {filteredAndSortedPosts.length > 0 ? (
                <div className="blog-grid">
                    {filteredAndSortedPosts.map(post => (
                        <div key={post.slug} className="blog-card">
                             <Link href={`/blog/${post.category || 'uncategorized'}/${post.slug}`} className="blog-card-image-link" aria-label={post.title}><div className="blog-card-image">{post.image ? (<img src={post.image} alt="" loading="lazy" />) : (<div className="blog-card-placeholder"><AsciiArtPlaceholder animate={true} width="100%" height="100%"/></div>)}</div></Link>
                             <div className="blog-card-content">
                                {post.category && (<div className="blog-category"><button onClick={() => handleCategoryClick(post.category || null)} className="category-name">{post.category.replace(/-/g, ' ')}</button></div>)}
                                <h2 className="blog-entry-title"><Link href={`/blog/${post.category || 'uncategorized'}/${post.slug}`} className="blog-link">{post.title || 'Untitled Post'}</Link></h2>
                                <div className="blog-date">
                                     {post.date && (<span><IconCalendar dateString={post.date} size={14}/> <time dateTime={post.date ? new Date(post.date).toISOString() : undefined}>{new Date(post.date).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric', timeZone: 'UTC' })}</time></span>)}
                                     {post.readingTime && (<span><IconOrnateClock size={14}/> {post.readingTime} min read</span>)}
                                 </div>
                                <p className="blog-excerpt">{post.excerpt || 'No excerpt available...'}</p>
                                {post.tags && post.tags.length > 0 && (<div className="blog-tags">{post.tags.slice(0, 3).map(tag => (<button key={tag} onClick={() => handleTagClick(tag)} className="blog-tag">#{tag}</button>))} {post.tags.length > 3 && (<span className="blog-tag-ellipsis">...</span>)}</div>)}
                                <div className="readmore-container"><Link href={`/blog/${post.category || 'uncategorized'}/${post.slug}`} className="readmore-link">Read Entry <IconArrowRight size={12} className="arrow"/></Link></div>
                             </div>
                         </div>
                    ))}
                </div>
            ) : ( <div className="blog-empty-state"><h2 className="empty-title">Nothing Found Down This Hole...</h2><p className="empty-description">Perhaps adjust your filters or clear them to see all available chronicles from the Looking Glass.</p><button onClick={resetFilters} className="reset-filters-btn">Reset Filters</button></div> )}
        </div>
    );
}