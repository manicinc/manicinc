// src/types/project.ts
// Defines the data structures for projects, including team, testimonials, and stats.

// --- Individual Data Structures ---

/**
 * Represents a single item in the Table of Contents.
 */
export interface TableOfContentsItem {
  level: number;  // Heading level (e.g., 2 for h2, 3 for h3)
  text: string;   // The text content of the heading
  slug: string;   // URL-friendly slug generated for the heading ID
}

/**
* Represents a single team member associated with a project.
*/
export interface TeamMember {
  name: string;      // Member's full name
  role: string;      // Member's role in the project
  link?: string;     // Optional URL to member's profile (e.g., LinkedIn, GitHub, personal site)
  photo?: string;    // Optional URL/path to the member's photo
}

/**
* Represents a single testimonial or quote related to a project.
*/
export interface Testimonial {
  quote: string;     // The content of the testimonial
  author: string;    // The name of the person giving the testimonial
  role?: string;     // Optional role/title of the author (e.g., "CEO of X", "Lead Developer")
}

/**
* Represents a single statistic displayed for a project.
*/
export interface Stat {
  label: string;              // The label for the statistic (e.g., "Stars", "Downloads")
  value: string | number;     // The value of the statistic (can be number or pre-formatted string like "1.2k")
}


// --- Main Project Data Structure ---

/**
* Defines the complete structure for a project, including frontmatter data,
* content, and potentially generated metadata like TOC.
*/
export interface Project {
  // === Core Identification & Content ===
  slug: string;             // URL-friendly identifier (derived from filename)
  title: string;            // Project title
  description: string;      // Short description or excerpt
  longDescription?: string; // Optional longer description
  content?: string;         // Full Markdown content of the project page
  category: string;         // Project category (derived from folder name)
  tags?: string[];          // Optional array of keywords/tags

  // === Dates ===
  date: string;             // Publish date in YYYY-MM-DD format (required)
  modifiedDate?: string;    // Optional last modified date (ISO 8601 format preferred)

  // === Visuals & Styling ===
  image?: string;           // Optional primary featured image path/URL
  images?: string[];        // Optional array of additional image paths/URLs for a gallery
  bgColor?: string;         // Optional custom background color (CSS value)
  textColor?: string;       // Optional custom text color (CSS value)

  // === Links & External References ===
  link?: string;            // Optional URL to the live project/demo
  github?: string;          // Optional URL to the GitHub repository
  license?: string;         // Optional license name (e.g., "MIT", "GPL-3.0") specified in frontmatter

  // === Metadata & Status ===
  technologies?: string[];  // Optional list of technologies used
  languages?: string[];     // Optional list of primary programming languages used (often derived from GitHub)
  stats?: Stat[];           // Optional array of key-value statistics
  status?: 'completed' | 'ongoing' | 'concept' | 'archived'; // Development status
  draft?: boolean;          // If true, should not be listed publicly (treated as "Coming Soon" or hidden)
  featured?: boolean;       // If true, eligible for featuring on homepages/lists
  sortOrder?: number;       // Optional number for custom sorting, especially among featured projects (lower numbers first)

  // === People & Feedback ===
  team?: TeamMember[];      // Optional array of team members involved
  testimonials?: Testimonial[]; // Optional array of testimonials

  // === Generated Data ===
  toc?: TableOfContentsItem[]; // Optional Table of Contents, generated from Markdown headings
}

/**
* Alias for Project type, explicitly indicating it might include a Table of Contents.
* The `toc` field is now directly optional on the `Project` interface itself,
* so this alias is mainly for semantic clarity if preferred.
*/
export type ProjectWithToc = Project;


// === Supporting Types (for filtering, categorization, etc.) ===

/**
* Represents a project category with its display name and slug.
*/
export interface ProjectCategory {
  name: string;
  slug: string;
}

/**
* Represents a collection of projects, potentially grouped by category.
*/
export interface Projects {
  projects: Project[];
  categories?: ProjectCategory[]; // Optional list of unique categories present
}

/**
* Represents the state for filtering projects (e.g., by category or tags).
*/
export interface ProjectFilter {
  category: string; // Currently selected category filter
  tags: string[];   // Array of currently selected tag filters
}