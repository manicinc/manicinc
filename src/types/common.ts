  
// Existing FeaturedItem (can potentially be removed or kept if used elsewhere)
export interface FeaturedItem {
    itemType: 'blog' | 'project'; // Type indicator
    slug: string;
    title: string;
    excerpt: string;
    image?: string | null;
    category?: string;
    urlPath: string; // Direct link path
    date?: string | undefined; // Optional date string (e.g., '2025-04-12') for display if needed
}

// ---> NEW: Type for the combined Hero Feed <---
export interface HeroFeedItem {
    id: string; // Unique ID (e.g., `${type}-${slug}`)
    type: 'blog' | 'project';
    draft?: boolean;
    slug: string;
    title: string;
    excerpt?: string;
    image?: string; // Optional image for the note
    category?: string;
    urlPath: string; // e.g., /blog/tech/my-post or /projects/web/my-project
    date: string; // ISO Date string (YYYY-MM-DD or full ISO)
}