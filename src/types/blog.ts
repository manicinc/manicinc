// src/types/blog.ts

export interface TableOfContentsItem {
  level: number;
  text: string;
  slug: string;
}
export interface TableOfContents {
  items: TableOfContentsItem[];
}
export interface AuthorInfo {
  name: string;
  avatarUrl?: string;
  bio?: string;
  githubUsername?: string;
}

// Base BlogPost type (ensure all fields used in list/page are here)
export interface BlogPost {
  slug: string;
  title?: string;
  date?: string;          // Publish date
  draft?: boolean;
  category?: string;
  contributors?: AuthorInfo[];
  tags?: string[];
  excerpt?: string;       // Used for description metadata & potentially list view
  description?: string;   // Longer meta description (optional)
  image?: string;         // Featured image URL
  imageAlt?: string;
  imageCaption?: string;
  readingTime?: number;
  content?: string;       // Raw markdown/MDX content
  contentHtml?: string;   // Pre-rendered HTML if applicable
  tableOfContents?: TableOfContents;
  author?: AuthorInfo;    // Primary author
  lastModified?: string;  // Last modified date (optional)
  // Add any other base fields your getAllPosts returns
}

// Remove extended interface, alias
export type BlogPostExtended = BlogPost;