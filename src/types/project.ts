// src/types/project.ts

// Structure for Table of Contents items
export interface TableOfContentsItem {
  level: number;
  text: string;
  slug: string;
}

// Main Project data structure (Corrected)
export interface Project {
  // Core Fields
  slug: string;
  title: string;
  description: string;
  longDescription?: string;
  date: string; // YYYY-MM-DD format
  modifiedDate?: string; // ISO 8601 format ideally
  category: string;
  tags?: string[]; // Optional array of strings
  content?: string; // Markdown content

  // Status & Display
  draft?: boolean; // If "Coming Soon"
  featured?: boolean; // If featured on homepage/elsewhere
  status?: 'completed' | 'ongoing' | 'concept' | 'archived';
  sortOrder?: number;

  // Visuals
  image?: string;
  images?: string[];
  bgColor?: string;
  textColor?: string;

  // Links & External Data
  link?: string; // Live site URL (use project.link primarily)
  github?: string;
  license?: string;

  // Metadata & Stats
  technologies?: string[];
  languages?: string[];
  stats?: {
    label: string;
    value: string | number; // Allow number directly too
  }[];

  // People
  team?: {
    name: string;
    role: string;
    link?: string;
    photo?: string;
  }[];

  // Testimonials
  testimonials?: {
    quote: string;
    author: string;
    role?: string;
  }[];

  // **FIX:** Added optional toc property here
  toc?: TableOfContentsItem[];
}

// ---> Project type including the extracted Table of Contents
// This might become redundant now but can stay for clarity
export type ProjectWithToc = Project;


// --- Other related types ---
export interface ProjectCategory {
  name: string;
  slug: string;
}

export interface Projects {
  projects: Project[];
  categories?: ProjectCategory[];
}

export interface ProjectFilter {
  category: string;
  tags: string[];
}