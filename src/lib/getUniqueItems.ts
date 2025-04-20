import { BlogPost } from "@/types/blog";

// Helper function
export const getUniqueItems = (posts: BlogPost[], key: 'tags' | 'category'): string[] => {
    const items = new Set<string>();
    posts.forEach(post => {
        if (key === 'tags' && post.tags) { post.tags.forEach(tag => tag && items.add(tag)); }
        else if (key === 'category' && post.category) { items.add(post.category); }
    });
    return Array.from(items).sort((a, b) => a.localeCompare(b));
};