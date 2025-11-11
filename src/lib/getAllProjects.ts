// File: src/lib/getAllProjects.ts
// Contains functions to read, parse, and retrieve project data from Markdown files.
// V3 - Using .reduce() for parsing arrays to fix type errors.

import "server-only"; // Ensures this module runs only on the server

// --- Node.js Modules ---
import fs from "fs";
import path from "path";
import { execSync } from "child_process"; // For Git commands

// --- Third-party Libraries ---
import matter from "gray-matter"; // Parses YAML frontmatter from Markdown

// --- Project Types ---
// Import all necessary types from the updated types file
import { Project, ProjectWithToc, TeamMember, Testimonial, Stat, TableOfContentsItem } from "@/types/project";

// --- Local Utility Imports ---
// Ensure this path is correct relative to getAllProjects.ts
import { extractMetadataFromMarkdown } from "../util/extractMetadataFromMarkdown";

// --- Constants ---
const PROJECTS_DIR = path.join(process.cwd(), "projects");
const IS_EXPORT = process.env.NEXT_EXPORT === 'true' || process.env.CI === 'true' || process.env.GITHUB_ACTIONS === 'true';
const USE_GIT_FALLBACK = !IS_EXPORT && process.env.USE_GIT_FALLBACK !== "false" && process.env.USE_GIT_FALLBACK !== "0";
const GIT_TIMEOUT_MS = Number(process.env.GIT_TIMEOUT_MS ?? '1500');
const DEFAULT_IMAGE_PATH = "/images/project-placeholder.png";

// === Helper Functions ===

/**
 * Retrieves Git commit information (like date or author) for a specific file.
 * Uses --follow to track file renames/moves.
 * @param filePath Absolute path to the file.
 * @param format Git log format string (e.g., '%cI' for ISO8601 commit date, '%as' for YYYY-MM-DD).
 * @returns The commit info string or null if Git fallback is disabled or an error occurs.
 */
function getGitLastCommitInfo(filePath: string, format: string): string | null {
    if (!USE_GIT_FALLBACK) return null;
    try {
        const normalizedPath = path.normalize(filePath);
        const escapedPath = normalizedPath.includes(" ")
            ? `"${normalizedPath.replace(/(["$`\\])/g, "\\$1")}"`
            : normalizedPath.replace(/(["$`\\])/g, "\\$1");
        const command = `git log -1 --follow --format=${format} -- ${escapedPath}`;
        const output = execSync(command, { timeout: GIT_TIMEOUT_MS, stdio: "pipe", encoding: "utf8" }).toString().trim();
        return output || null;
    } catch (error: any) {
        if (process.env.NODE_ENV === 'development') {
            if (!error.stderr?.toString().includes('fatal: no such path') && !error.stderr?.toString().includes('does not have any commits')) {
                console.warn(`[Git Fallback WARN] Could not get Git info (${format}) for ${filePath}: ${error.message}`);
            }
        }
        return null;
    }
}

/**
 * Validates and parses the 'team' array from frontmatter data using reduce.
 * @param teamData - The raw 'team' data from frontmatter.
 * @returns A validated array of TeamMember objects.
 */
function parseTeam(teamData: any): TeamMember[] {
    if (!Array.isArray(teamData)) {
        return [];
    }
    // Use reduce to build the validated array directly
    return teamData.reduce((acc: TeamMember[], member: any) => {
        // Basic validation: ensure it's an object with at least name and role
        if (typeof member === 'object' && member !== null && member.name && member.role) {
            // Construct the TeamMember object
            const validMember: TeamMember = {
                name: String(member.name),
                role: String(member.role),
                link: typeof member.link === 'string' ? member.link : undefined,
                photo: typeof member.photo === 'string' ? member.photo : undefined,
            };
            // Add the valid member to the accumulator array
            acc.push(validMember);
        }
        // Return the accumulator for the next iteration
        return acc;
    }, [] as TeamMember[]); // Initialize accumulator as an empty TeamMember array
}

/**
 * Validates and parses the 'testimonials' array from frontmatter data using reduce.
 * @param testimonialData - The raw 'testimonials' data from frontmatter.
 * @returns A validated array of Testimonial objects.
 */
function parseTestimonials(testimonialData: any): Testimonial[] {
     if (!Array.isArray(testimonialData)) {
        return [];
    }
    // Use reduce to build the validated array
    return testimonialData.reduce((acc: Testimonial[], testimonial: any) => {
        // Basic validation: ensure it's an object with quote and author
        if (typeof testimonial === 'object' && testimonial !== null && testimonial.quote && testimonial.author) {
             // Construct the Testimonial object
            const validTestimonial: Testimonial = {
                quote: String(testimonial.quote),
                author: String(testimonial.author),
                role: typeof testimonial.role === 'string' ? testimonial.role : undefined,
            };
            // Add the valid testimonial to the accumulator
            acc.push(validTestimonial);
        }
        // Return the accumulator
        return acc;
    }, [] as Testimonial[]); // Initialize as empty Testimonial array
}

/**
 * Validates and parses the 'stats' array from frontmatter data using reduce.
 * @param statsData - The raw 'stats' data from frontmatter.
 * @returns A validated array of Stat objects.
 */
function parseStats(statsData: any): Stat[] {
    if (!Array.isArray(statsData)) {
        return [];
    }
     // Use reduce to build the validated array
    return statsData.reduce((acc: Stat[], stat: any) => {
        // Basic validation: ensure it's an object with label and value
        if (typeof stat === 'object' && stat !== null && stat.label && typeof stat.value !== 'undefined') {
             // Construct the Stat object
            const validStat: Stat = {
                label: String(stat.label),
                value: stat.value, // Keep original type (string | number)
            };
            // Add the valid stat to the accumulator
            acc.push(validStat);
        }
        // Return the accumulator
        return acc;
    }, [] as Stat[]); // Initialize as empty Stat array
}


// === Core Data Fetching Functions ===

/**
 * Reads all project markdown files, parses frontmatter/content, returns Project array.
 * Includes fallbacks and sorting.
 * @returns An array of Project objects.
 */
export function getAllProjects(): Project[] {
    if (!fs.existsSync(PROJECTS_DIR)) {
        console.error(`[getAllProjects] ERROR: Projects directory not found at ${PROJECTS_DIR}`);
        return [];
    }

    const projects: Project[] = [];
    try {
        const categories = fs.readdirSync(PROJECTS_DIR, { withFileTypes: true });

        for (const categoryDirent of categories) {
            if (!categoryDirent.isDirectory() || categoryDirent.name.startsWith('.') || categoryDirent.name.startsWith('_')) continue;

            const categoryName = categoryDirent.name;
            const categoryPath = path.join(PROJECTS_DIR, categoryName);

            try {
                const files = fs.readdirSync(categoryPath, { withFileTypes: true });

                for (const fileDirent of files) {
                    const fileName = fileDirent.name;
                    if (!fileDirent.isFile() || !(fileName.endsWith(".md") || fileName.endsWith(".mdx")) || fileName.startsWith('.') || fileName.startsWith('_') ) continue;

                    const filePath = path.join(categoryPath, fileName);

                    try {
                        const rawContent = fs.readFileSync(filePath, "utf8");
                        const { data, content } = matter(rawContent);

                        // --- Extract and Validate Frontmatter Data ---
                        const slug = fileName.replace(/\.(md|mdx)$/, "");
                        const title = data.title || slug.replace(/-/g, " ").replace(/\b\w/g, l => l.toUpperCase());
                        const description = data.description || content.slice(0, 160).replace(/\n/g, " ").trim() + "...";

                        // Date handling
                        let publishDate: string;
                        if (data.date instanceof Date) {
                            publishDate = data.date.toISOString().split("T")[0];
                        } else if (typeof data.date === 'string' && /^\d{4}-\d{2}-\d{2}/.test(data.date)) {
                            publishDate = data.date.split('T')[0];
                        } else {
                            publishDate = getGitLastCommitInfo(filePath, "%as") ?? new Date().toISOString().split("T")[0];
                        }
                         if (!/^\d{4}-\d{2}-\d{2}$/.test(publishDate)) {
                             publishDate = new Date().toISOString().split('T')[0];
                         }

                        // Image handling
                        let image = data.image;
                        if (!image) {
                            const imgBase = `/projects/${categoryName}/${slug}`;
                            const publicDir = path.join(process.cwd(), "public");
                            const possibleExtensions = [".jpg", ".png", ".webp", ".jpeg", ".gif"];
                            for (const ext of possibleExtensions) {
                                if (fs.existsSync(path.join(publicDir, imgBase + ext))) {
                                    image = imgBase + ext;
                                    break;
                                }
                            }
                            if (!image) image = DEFAULT_IMAGE_PATH;
                        }

                        // Parse complex fields using the updated helper functions
                        const team = parseTeam(data.team);
                        const testimonials = parseTestimonials(data.testimonials);
                        const stats = parseStats(data.stats);

                        // Assemble the Project object
                        projects.push({
                            slug: slug,
                            title: title,
                            description: description,
                            date: publishDate,
                            category: categoryName,
                            content: content,
                            longDescription: typeof data.longDescription === 'string' ? data.longDescription : undefined,
                            tags: Array.isArray(data.tags) ? data.tags.map(String) : [],
                            modifiedDate: getGitLastCommitInfo(filePath, "%cI") || undefined,
                            status: ['completed', 'ongoing', 'concept', 'archived'].includes(data.status) ? data.status : 'completed',
                            draft: data.draft === true,
                            featured: data.featured === true,
                            sortOrder: typeof data.sortOrder === 'number' ? data.sortOrder : 999,
                            image: image,
                            images: Array.isArray(data.images) ? data.images.map(String) : [],
                            bgColor: typeof data.bgColor === 'string' ? data.bgColor : undefined,
                            textColor: typeof data.textColor === 'string' ? data.textColor : undefined,
                            link: typeof data.link === 'string' ? data.link : undefined,
                            github: typeof data.github === 'string' ? data.github : undefined,
                            license: typeof data.license === 'string' ? data.license : undefined,
                            technologies: Array.isArray(data.technologies) ? data.technologies.map(String) : [],
                            languages: Array.isArray(data.languages) ? data.languages.map(String) : [],
                            stats: stats,
                            team: team,
                            testimonials: testimonials,
                            // toc is added in getProjectBySlug
                        });
                    } catch (fileError: any) {
                        console.error(`[getAllProjects] Error processing file ${filePath}: ${fileError.message}`);
                    }
                }
            } catch (catError: any) {
                 console.error(`[getAllProjects] Error reading category directory ${categoryPath}: ${catError.message}`);
            }
        }
    } catch (topError: any) {
        console.error(`[getAllProjects] Error reading base projects directory ${PROJECTS_DIR}: ${topError.message}`);
    }

    // Sort projects
    return projects.sort((a, b) => {
        if (a.featured && !b.featured) return -1;
        if (!a.featured && b.featured) return 1;
        if (a.featured && b.featured) {
            return (a.sortOrder ?? 999) - (b.sortOrder ?? 999);
        }
        const dateA = a.date ? new Date(a.date).getTime() : 0;
        const dateB = b.date ? new Date(b.date).getTime() : 0;
        return dateB - dateA;
    });
}

/**
 * Retrieves a single project by category/slug, including generated TOC.
 * @param category - The category directory name.
 * @param slug - The file slug.
 * @returns A ProjectWithToc object or null.
 */
export function getProjectBySlug(category: string, slug: string): ProjectWithToc | null {
    const mdPath = path.join(PROJECTS_DIR, category, `${slug}.md`);
    const mdxPath = path.join(PROJECTS_DIR, category, `${slug}.mdx`);
    const filePath = fs.existsSync(mdPath) ? mdPath : fs.existsSync(mdxPath) ? mdxPath : null;

    if (!filePath) {
        console.warn(`[getProjectBySlug] Project file not found for: ${category}/${slug}`);
        return null;
    }

    try {
        const rawFileContent = fs.readFileSync(filePath, "utf8");
        const { data, content } = matter(rawFileContent);

        // Generate Table of Contents
        let toc: TableOfContentsItem[] = [];
        try {
            toc = extractMetadataFromMarkdown(content).toc || [];
        } catch (tocError: any) {
            console.error(`[getProjectBySlug] Error generating TOC for ${category}/${slug}: ${tocError.message}`);
        }

        // --- Reuse parsing logic where possible ---
        const title = data.title || slug.replace(/-/g, " ").replace(/\b\w/g, l => l.toUpperCase());
        const description = data.description || content.slice(0, 160).replace(/\n/g, " ").trim() + "...";

        // Date handling
        let publishDate: string;
         if (data.date instanceof Date) {
             publishDate = data.date.toISOString().split("T")[0];
         } else if (typeof data.date === 'string' && /^\d{4}-\d{2}-\d{2}/.test(data.date)) {
             publishDate = data.date.split('T')[0];
         } else {
             publishDate = getGitLastCommitInfo(filePath, "%as") ?? new Date().toISOString().split("T")[0];
         }
          if (!/^\d{4}-\d{2}-\d{2}$/.test(publishDate)) {
              publishDate = new Date().toISOString().split('T')[0];
          }

        // Image handling
        let image = data.image;
        if (!image) {
            const imgBase = `/projects/${category}/${slug}`;
            const publicDir = path.join(process.cwd(), "public");
            const possibleExtensions = [".jpg", ".png", ".webp", ".jpeg", ".gif"];
            for (const ext of possibleExtensions) {
                if (fs.existsSync(path.join(publicDir, imgBase + ext))) {
                    image = imgBase + ext;
                    break;
                }
            }
            if (!image) image = DEFAULT_IMAGE_PATH;
        }

        // Parse complex fields using the updated helper functions
        const team = parseTeam(data.team);
        const testimonials = parseTestimonials(data.testimonials);
        const stats = parseStats(data.stats);

        // Assemble the Project object, including the TOC
        const projectData: ProjectWithToc = {
            slug: slug,
            title: title,
            description: description,
            date: publishDate,
            category: category,
            content: content,
            longDescription: typeof data.longDescription === 'string' ? data.longDescription : undefined,
            tags: Array.isArray(data.tags) ? data.tags.map(String) : [],
            modifiedDate: getGitLastCommitInfo(filePath, "%cI") || undefined,
            status: ['completed', 'ongoing', 'concept', 'archived'].includes(data.status) ? data.status : 'completed',
            draft: data.draft === true,
            featured: data.featured === true,
            sortOrder: typeof data.sortOrder === 'number' ? data.sortOrder : 999,
            image: image,
            images: Array.isArray(data.images) ? data.images.map(String) : [],
            bgColor: typeof data.bgColor === 'string' ? data.bgColor : undefined,
            textColor: typeof data.textColor === 'string' ? data.textColor : undefined,
            link: typeof data.link === 'string' ? data.link : undefined,
            github: typeof data.github === 'string' ? data.github : undefined,
            license: typeof data.license === 'string' ? data.license : undefined,
            technologies: Array.isArray(data.technologies) ? data.technologies.map(String) : [],
            languages: Array.isArray(data.languages) ? data.languages.map(String) : [],
            stats: stats,
            team: team,
            testimonials: testimonials,
            toc: toc // Add the generated Table of Contents
        };

        return projectData;

    } catch (error: any) {
        console.error(`[getProjectBySlug] Error reading or processing file ${filePath}: ${error.message}`);
        return null;
    }
}

/**
 * Retrieves a project by category and slug. Does NOT include TOC.
 * @deprecated Consider using getProjectBySlug which includes TOC.
 */
export function getProjectByCategoryAndSlug(category: string, slug: string): Project | null {
    // Calls getAllProjects and finds the match. Less efficient than getProjectBySlug for single item retrieval.
    return getAllProjects().find(p => p.category === category && p.slug === slug) || null;
}

/**
 * Generates path objects for all non-draft projects (for generateStaticParams).
 */
export function getAllProjectPaths(): { category: string; slug: string }[] {
    return getAllProjects()
           .filter(p => !p.draft)
           .map(p => ({ category: p.category, slug: p.slug }));
}

/**
 * Retrieves featured, non-draft projects, sorted by sortOrder.
 */
export function getFeaturedProjects(limit = 3): Project[] {
    return getAllProjects()
           .filter(p => p.featured && !p.draft)
           .slice(0, limit); // Sorting is handled by getAllProjects
}

/**
 * Gets a sorted list of unique project category names (from non-draft projects).
 */
export function getProjectCategories(): string[] {
    const allProjects = getAllProjects().filter(p => !p.draft);
    return Array.from(new Set(allProjects.map(p => p.category))).sort();
}

/**
 * Retrieves all non-draft projects for a specific category.
 */
export function getProjectsByCategory(category: string): Project[] {
    return getAllProjects().filter(p => p.category === category && !p.draft);
}

/**
 * Finds related non-draft projects based on category and tags.
 */
export function getRelatedProjects(currentProject: Project, limit = 3): Project[] {
    const all = getAllProjects().filter(p => !p.draft);
    const currentTags = new Set(currentProject.tags || []);

    const related = all
        .filter(p => p.slug !== currentProject.slug && p.category === currentProject.category)
        .map(p => {
            let score = 1; // Base score for same category
            score += (p.tags || []).filter(tag => currentTags.has(tag)).length * 2; // Weight shared tags higher
            return { ...p, score };
        })
        .sort((a, b) => b.score - a.score || (new Date(b.date).getTime() - new Date(a.date).getTime())) // Sort by score, then date
        .slice(0, limit);

    // Fallback if not enough related projects found
    if (related.length < limit) {
        const relatedSlugs = new Set(related.map(r => r.slug));
        relatedSlugs.add(currentProject.slug);

        const fallback = all
            .filter(p => !relatedSlugs.has(p.slug))
            .slice(0, limit - related.length); // Get remaining needed

        related.push(...fallback.map(p => ({ ...p, score: 0 }))); // Add fallback projects
    }

    return related;
}