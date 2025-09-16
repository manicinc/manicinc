// src/lib/getAllPosts.ts
import "server-only"; // Ensures this runs only on the server
import fs from "fs";
import path from "path";
import matter from "gray-matter"; // Parses frontmatter
import { execSync } from 'child_process'; // For Git commands
import { BlogPost, AuthorInfo, TableOfContentsItem } from "@/types/blog"; // Use updated types
import { extractMetadataFromMarkdown } from "@/util/extractMetadataFromMarkdown"; // Ensure path is correct

const POSTS_DIR = path.join(process.cwd(), "posts"); // Your posts directory
const USE_GIT_FALLBACK = process.env.USE_GIT_FALLBACK !== 'false'; // Control Git usage via env var
const DEFAULT_AUTHOR_NAME = "Manic Agency"; // Default author name

// --- Helper Functions ---

/**
 * Gets Git commit information for a file.
 * @param filePath Absolute path to the file.
 * @param format Git log format string (e.g., '%cI' for ISO8601 commit date, '%as' for YYYY-MM-DD, '%an' for author name).
 * @returns The commit info string or null.
 */
function getGitLastCommitInfo(filePath: string, format: string): string | null {
    if (!USE_GIT_FALLBACK) return null;
    try {
        const formattedPath = path.normalize(filePath);
        // Escape path for shell command, handle spaces
        const escapedPath = formattedPath.includes(' ') ? `"${formattedPath.replace(/(["$`\\])/g, '\\$1')}"` : formattedPath.replace(/(["$`\\])/g, '\\$1');
        const command = `git log -1 --follow --format=${format} -- ${escapedPath}`;
        const output = execSync(command, { timeout: 5000, stdio: 'pipe', encoding: 'utf8' }).toString().trim();
        return output || null;
    } catch (error: any) {
        // Log errors only if they aren't the expected "path not found" or "no commits" errors
        if (!error.stderr?.toString().includes('fatal: no such path') && !error.stderr?.toString().includes('does not have any commits')) {
            // console.warn(`[Git WARN] Git info (${format}) error for ${filePath}: ${error.message}`);
        }
        return null;
    }
}

/**
 * Calculates estimated reading time.
 * @param content Post content string.
 * @returns Reading time in minutes (minimum 1).
 */
export function calculateReadingTime(content: string | undefined): number {
    if (!content) return 1;
    const wordsPerMinute = 200;
    const wordCount = content.split(/\s+/).filter(Boolean).length;
    const readingTime = Math.ceil(wordCount / wordsPerMinute);
    return readingTime > 0 ? readingTime : 1; // Ensure minimum 1 minute
}

/**
 * Parses author data from frontmatter or falls back to Git/defaults.
 * @param frontmatterData Frontmatter data object.
 * @param gitAuthorName Fallback author name from Git.
 * @returns AuthorInfo object.
 */
function parseAuthorInfo(frontmatterData: any, gitAuthorName: string | null): AuthorInfo {
    const defaultAuthor: AuthorInfo = { name: DEFAULT_AUTHOR_NAME };
    const authorData = frontmatterData?.author;

    if (typeof authorData === 'object' && authorData !== null && authorData.name) {
        // If frontmatter provides an author object with a name, use it
        return {
            name: String(authorData.name),
            avatarUrl: typeof authorData.avatarUrl === 'string' ? authorData.avatarUrl : undefined,
            bio: typeof authorData.bio === 'string' ? authorData.bio : undefined,
            githubUsername: typeof authorData.githubUsername === 'string' ? authorData.githubUsername : undefined,
        };
    } else if (typeof authorData === 'string' && authorData.trim()) {
        // If frontmatter provides just a name string
        return { name: authorData.trim() };
    } else if (gitAuthorName) {
        // Fallback to Git author name
        return { name: gitAuthorName };
    } else {
        // Final fallback
        return defaultAuthor;
    }
}

/**
 * Parses contributors array from frontmatter.
 * @param frontmatterData Frontmatter data object.
 * @returns Array of AuthorInfo objects or undefined.
 */
function parseContributors(frontmatterData: any): AuthorInfo[] | undefined {
    const contributorsData = frontmatterData?.contributors;
    if (Array.isArray(contributorsData)) {
        return contributorsData
            .map(contrib => {
                if (typeof contrib === 'object' && contrib !== null && contrib.name) {
                    // Expect objects matching AuthorInfo structure
                    return {
                        name: String(contrib.name),
                        avatarUrl: typeof contrib.avatarUrl === 'string' ? contrib.avatarUrl : undefined,
                        bio: typeof contrib.bio === 'string' ? contrib.bio : undefined,
                        githubUsername: typeof contrib.githubUsername === 'string' ? contrib.githubUsername : undefined,
                    };
                } else if (typeof contrib === 'string' && contrib.trim()) {
                     // Allow simple strings as names
                    return { name: contrib.trim() };
                }
                return null; // Ignore invalid entries
            })
            .filter((c): c is AuthorInfo => c !== null); // Filter out nulls and type guard
    }
    // Optional: Could add Git contributor fetching here as a fallback
    return undefined; // Return undefined if not found in frontmatter
}


// --- getAllPosts (Updated) ---
export function getAllPosts(): BlogPost[] {
    if (!fs.existsSync(POSTS_DIR)) {
        console.error(`[getAllPosts] ERROR: Posts directory not found at ${POSTS_DIR}.`);
        return [];
    }

    let posts: BlogPost[] = [];
    try {
        const categories = fs.readdirSync(POSTS_DIR, { withFileTypes: true });

        for (const categoryDirent of categories) {
            // Skip non-directories, private/hidden folders
            if (!categoryDirent.isDirectory() || categoryDirent.name.startsWith('_') || categoryDirent.name.startsWith('.')) continue;

            const categoryFromFile = categoryDirent.name;
            const categoryPath = path.join(POSTS_DIR, categoryFromFile);

            try {
                const files = fs.readdirSync(categoryPath, { withFileTypes: true });

                for (const fileDirent of files) {
                    const fileName = fileDirent.name;
                    const filePath = path.join(categoryPath, fileName);

                    // Skip non-markdown files or directories
                    if (!fileDirent.isFile() || !(fileName.endsWith('.md') || fileName.endsWith('.mdx'))) continue;

                    try {
                        const rawContent = fs.readFileSync(filePath, "utf8");
                        const { data, content } = matter(rawContent); // Parse frontmatter

                        const slug = fileName.replace(/\.(md|mdx)$/, "");
                        const title = data.title || slug.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase()); // Default title from slug

                        // --- Date Handling ---
                        let publishDate: string;
                        if (data.date instanceof Date) {
                            publishDate = data.date.toISOString().split('T')[0]; // Format Date object
                        } else if (typeof data.date === 'string' && /^\d{4}-\d{2}-\d{2}/.test(data.date)) {
                            publishDate = data.date.split('T')[0]; // Use valid string date
                        } else {
                            // Fallback to Git commit date if enabled and no valid frontmatter date
                            publishDate = getGitLastCommitInfo(filePath, '%as') ?? new Date().toISOString().split('T')[0];
                        }
                         // Final check for valid YYYY-MM-DD format
                        if (!/^\d{4}-\d{2}-\d{2}$/.test(publishDate)) {
                             publishDate = new Date().toISOString().split('T')[0];
                        }

                        // --- Last Modified Handling ---
                        // Prioritize frontmatter 'lastModified', then Git commit date, else null
                        let lastModifiedDate: string | undefined = undefined;
                        if (data.lastModified instanceof Date) {
                            lastModifiedDate = data.lastModified.toISOString();
                         } else if (typeof data.lastModified === 'string' && /\d{4}-\d{2}-\d{2}/.test(data.lastModified)) {
                            // Allow just date or full ISO string in frontmatter
                            lastModifiedDate = data.lastModified.includes('T') ? data.lastModified : `${data.lastModified}T00:00:00Z`;
                        } else {
                            // Fallback to Git commit date (%cI gives full ISO)
                            const gitCommitDate = getGitLastCommitInfo(filePath, '%cI');
                             if (gitCommitDate && gitCommitDate !== new Date(publishDate + 'T12:00:00Z').toISOString()) { // Avoid setting if same as publish date
                                lastModifiedDate = gitCommitDate;
                            }
                        }


                        // --- Author & Contributor Parsing ---
                        const gitAuthorName = getGitLastCommitInfo(filePath, '%an');
                        const authorInfo = parseAuthorInfo(data, gitAuthorName);
                        const contributorsInfo = parseContributors(data);

                        // --- Other Fields ---
                        const excerpt = data.excerpt || content.slice(0, 160).replace(/\n/g, ' ').trim() + "..."; // Default excerpt
                        const tags = Array.isArray(data.tags) ? data.tags.map(String) : [];
                        const readingTime = calculateReadingTime(content);
                        const draft = data.draft === true;
                        const image = typeof data.image === 'string' ? data.image : undefined;
                        const imageAlt = typeof data.imageAlt === 'string' ? data.imageAlt : undefined;
                        const imageCaption = typeof data.imageCaption === 'string' ? data.imageCaption : undefined;


                        // Construct the BlogPost object conforming to the type
                        posts.push({
                            slug: slug,
                            title: title,
                            date: publishDate,
                            lastModified: lastModifiedDate, // Add lastModified
                            draft: draft,
                            category: categoryFromFile,
                            tags: tags,
                            excerpt: excerpt,
                            image: image,
                            imageAlt: imageAlt,
                            imageCaption: imageCaption,
                            readingTime: readingTime,
                            content: content, // Include raw content
                            author: authorInfo, // Add parsed AuthorInfo
                            contributors: contributorsInfo, // Add parsed contributors (optional)
                            // tableOfContents is added later by getPostBySlug...
                        });

                    } catch (fileError: any) {
                        console.error(`[getAllPosts] Error processing file ${filePath}: ${fileError.message}`);
                    }
                }
            } catch (catError: any) {
                console.error(`[getAllPosts] Error reading category ${categoryPath}: ${catError.message}`);
            }
        }
    } catch (topError: any) {
        console.error(`[getAllPosts] Error reading posts directory ${POSTS_DIR}: ${topError.message}`);
    }

    // Sort posts by date descending (most recent first)
    posts.sort((a, b) => new Date(b.date ?? 0).getTime() - new Date(a.date ?? 0).getTime());

    // console.log(`[getAllPosts] Finished. Found ${posts.length} posts.`);
    return posts;
}


// --- getPostBySlug (No changes needed in core logic, benefits from getAllPosts returning more data) ---
export function getPostBySlug(slug: string): BlogPost | null {
    const posts = getAllPosts(); // Now gets posts with author/contributors/lastModified

    const post = posts.find(p =>
        p.slug?.toLowerCase() === slug.toLowerCase()
    );

    if (!post) {
        console.warn(`[getPostBySlug] No post found with slug: ${slug}`);
        return null;
    }

    // Generate and Add Table of Contents
    let tocItems: TableOfContentsItem[] = [];
    if (post.content) {
        try {
            const metadata = extractMetadataFromMarkdown(post.content);
            tocItems = metadata.toc || [];
        } catch (tocError: any) {
            console.error(`[getPostBySlug] Error generating TOC for post with slug "${slug}": ${tocError.message}`);
        }
    } else {
        console.warn(`[getPostBySlug] Post with slug "${slug}" has no content for TOC generation.`);
    }

    // Return the full post data including TOC
    return {
        ...post,
        tableOfContents: { items: tocItems },
    };
}

// --- getPostBySlugAndCategory (No changes needed in core logic) ---
export function getPostBySlugAndCategory(category: string, slug: string): BlogPost | null {
     const posts = getAllPosts();
     const post = posts.find(p =>
         p.category?.toLowerCase() === category.toLowerCase() &&
         p.slug?.toLowerCase() === slug.toLowerCase()
     );

     if (!post) { return null; }

     // Generate and Add Table of Contents
     let tocItems: TableOfContentsItem[] = [];
     if (post.content) {
         try { tocItems = extractMetadataFromMarkdown(post.content).toc || []; }
         catch (tocError: any) { console.error(`[getPostBySlugAndCategory] Error generating TOC for ${category}/${slug}: ${tocError.message}`); }
     }
     return { ...post, tableOfContents: { items: tocItems } };
 }

// --- getAllPostPaths (No changes needed) ---
export function getAllPostPaths(): { category: string; slug: string }[] {
    const posts = getAllPosts();
    const paths = posts
        .map(post => {
            const category = post.category ? String(post.category).trim() : '';
            const slug = post.slug ? String(post.slug).trim() : '';
            if (category && !category.includes('/') && slug) { return { category, slug }; }
            return null;
        })
        .filter((path): path is { category: string; slug: string } => path !== null);
    return paths;
}