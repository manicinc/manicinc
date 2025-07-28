// src/app/blog/[category]/[slug]/page.tsx

import { notFound } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image'; // Use Next.js Image for optimization
import type { Metadata, ResolvingMetadata } from 'next';

// Data fetching and types
import { getAllPosts, getPostBySlug } from '@/lib/getAllPosts'; // Adjust path
import { BlogPostExtended, TableOfContentsItem, AuthorInfo } from '@/types/blog'; // Adjust path

// Components
import Footer from '@/components/Footer/Footer'; // If rendered here, otherwise remove
import BlogSidebarClient from '@/app/blog/BlogSidebarClient'; // Sidebar TOC
import ShareButtons from '@/components/ShareButtonsClient'; // Share buttons
import GiscusClient from '@/components/Blog/GiscusClient'; // Giscus comments
import DisqusComments from '@/components/Blog/DisqusComments'; // Add import for Disqus
import { AsciiArtPlaceholder } from '@/lib/asciiPlaceholders'; // Fallback image
import { CustomMarkdownRenderer } from '@/components/MarkdownRenderer'; // Markdown rendering
import BlogPageClient from './BlogPageClient'; // Client wrapper for reading mode etc.
import BlogAnalytics from '@/components/BlogAnalytics'; // Analytics tracking
import ScrollTracking from '@/components/ScrollTracking'; // Scroll engagement tracking
import EnhancedTracking from '@/components/EnhancedTracking'; // Enhanced analytics
import BlogNewsletterWrapper from '@/components/BlogNewsletterProvider'; // Newsletter with modal
import BlogNewsletterSection from '@/components/BlogNewsletterSection'; // Newsletter signup

import { formatDate } from '@/util/formatDate';
// Icons (Ensure these are correctly imported/defined in Icons.tsx)
import {
    IconOrnateCalendar, IconOrnateClock, IconOrnateTag, IconOrnateAuthor, IconArrowLeft
} from '@/components/Icons'; // Adjust path

// Styles
import "@/app/styles/blogs.css"; // Blog specific styles

// Props for the page component and metadata function
type PageProps = {
    params: { category: string; slug: string };
    // searchParams?: { [key: string]: string | string[] | undefined };
};


// --- generateStaticParams remains the same ---
export async function generateStaticParams(): Promise<{ category: string; slug: string }[]> {
    const posts: BlogPostExtended[] = getAllPosts();
    return posts.map(post => ({
        category: post.category || 'uncategorized',
        slug: post.slug || '',
    })).filter(p => p.slug && p.category !== 'uncategorized');
}

// --- Updated generateMetadata ---
// --- generateMetadata with Fix ---
export async function generateMetadata(
    { params }: PageProps,
    parent: ResolvingMetadata // Access to parent metadata resolved promise
): Promise<Metadata> {
    const post = getPostBySlug(params.slug) as BlogPostExtended | undefined;

    if (!post) {
        return { title: 'Post Not Found' };
    }

    // --- Safely determine Image URL ---
    const parentMetadata = await parent;
    const siteUrl = parentMetadata.metadataBase?.toString() || process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'; // Get base URL

    // 1. Get parent image info safely
    const parentImages = parentMetadata.openGraph?.images;
    let fallbackOgImageUrl: string | undefined = undefined;
    if (Array.isArray(parentImages) && parentImages.length > 0) {
        const firstImage = parentImages[0];
        if (typeof firstImage === 'string') {
            fallbackOgImageUrl = firstImage; // It's just a URL string
        } else if (firstImage instanceof URL) {
             fallbackOgImageUrl = firstImage.toString(); // Convert URL object to string
        } else if (typeof firstImage === 'object' && firstImage !== null && 'url' in firstImage) {
            // It's an OgImage object, access its url property safely
             if (firstImage.url instanceof URL) {
                 fallbackOgImageUrl = firstImage.url.toString();
             } else if (typeof firstImage.url === 'string') {
                 fallbackOgImageUrl = firstImage.url;
             }
        }
    }

     // 2. Determine the final image URL: Use post image if available (making relative paths absolute), otherwise use the extracted fallback.
     let finalOgImageUrl: string | undefined = undefined;
     if (post.image) {
         finalOgImageUrl = post.image.startsWith('http') ? post.image : `${siteUrl}${post.image.startsWith('/') ? '' : '/'}${post.image}`;
     } else {
         finalOgImageUrl = fallbackOgImageUrl;
     }
    // --- End Image URL Logic ---


    // --- Other Metadata ---
    const pageTitle = post.title || 'Untitled Post';
    const pageDescription = post.excerpt || parentMetadata.description || 'A post from Manic Agency Blog.';
    const pageKeywords = post.tags || [];
    const canonicalUrl = `/blog/${post.category || 'uncategorized'}/${post.slug}`;
    const authorMeta = post.author ? [{ name: post.author.name, url: post.author.githubUsername ? `https://github.com/${post.author.githubUsername}` : undefined }] : parentMetadata.authors;

    return {
        title: pageTitle,
        description: pageDescription,
        keywords: pageKeywords,
        authors: authorMeta,
        alternates: { canonical: canonicalUrl },
        openGraph: {
            type: 'article',
            publishedTime: post.date ? new Date(post.date).toISOString() : undefined,
            modifiedTime: post.lastModified ? new Date(post.lastModified).toISOString() : undefined,
            authors: post.author ? [post.author.name] : undefined,
            tags: post.tags,
            // Use the final determined image URL
            images: finalOgImageUrl ? [{ url: finalOgImageUrl, alt: pageTitle }] : parentMetadata.openGraph?.images,
             // Let other OG properties inherit (title, description use root defaults/template)
             // url: canonicalUrl, // Usually inherited correctly via metadataBase + path
        },
        twitter: {
            // Let most twitter properties inherit
             images: finalOgImageUrl ? [finalOgImageUrl] : parentMetadata.twitter?.images, // Use specific image
        },
    };
}

// --- Page Component ---
export default async function BlogPostPage({ params }: PageProps) {
    const { category, slug } = params;
    // Ensure getPostBySlug fetches all needed fields (author, contributors, lastModified etc.)
    const post = getPostBySlug(slug) as BlogPostExtended | undefined;

    if (!post || post.draft) {
        notFound();
    }

    const tocItems: TableOfContentsItem[] = post.tableOfContents?.items || [];
    const displaySidebar = tocItems.length > 0; // Simplified sidebar display logic
    
    // Generate post URL and identifier for comments
    const postUrl = `/blog/${category}/${slug}`;
    const postIdentifier = `blog-${category}-${slug}`;

    return (
        <BlogNewsletterWrapper>
            {/* Analytics tracking for blog posts */}
            <BlogAnalytics 
                postTitle={post.title}
                postCategory={post.category}
                postAuthor={post.author?.name}
                postTags={post.tags}
                postType="post"
            />
            
            {/* Scroll engagement tracking */}
            <ScrollTracking 
                postTitle={post.title}
                contentSelector="#post-content-top"
            />
            
            <BlogPageClient> {/* Client wrapper for Reading Mode, etc. */}
                {/* Main layout container - sidebar displayed based on `has-sidebar` */}
                <div className={`blog-layout-container ${displaySidebar ? 'has-sidebar' : 'no-sidebar'}`}>

                    {/* Sidebar (conditionally rendered) */}
                    {displaySidebar && (
                        <BlogSidebarClient tableOfContents={tocItems} postTitle={post.title || ''} />
                    )}

                    {/* Main Content Area */}
                    <main className="blog-main-content-area">
                        <article className="blog-post-container" id="post-content-top" >
                            {/* === Enhanced Post Header === */}
                            <header className="post-header">
                                <div className="back-to-blog-link-container">
                                    <Link href="/blog" className="back-to-blog-link">
                                        <IconArrowLeft size={14} className="mr-1.5"/> {/* Use Icon */}
                                        Back to All Entries
                                    </Link>
                                </div>

                                <h1 className="post-title">{post.title || 'Untitled Post'}</h1>

                                {/* === Updated Post Meta Section === */}
                                <div className="post-meta">
                                    {/* Author Info with Art Deco Icon */}
                                    {post.author && (
                                        <div className="meta-item author">
                                            <IconOrnateAuthor className="meta-icon" aria-hidden="true" />
                                            <div className="author-info">
                                                {post.author.avatarUrl && (
                                                    <Image
                                                        src={post.author.avatarUrl}
                                                        alt={post.author.name}
                                                        width={24} height={24}
                                                        className="author-avatar"
                                                    />
                                                )}
                                                {/* Link author name if GitHub username exists */}
                                                {post.author.githubUsername ? (
                                                    <a href={`https://github.com/${post.author.githubUsername}`} target="_blank" rel="noopener noreferrer" className="author-name hover:text-accent-highlight transition-colors">
                                                        {post.author.name}
                                                    </a>
                                                ) : (
                                                    <span className="author-name">{post.author.name}</span>
                                                )}
                                            </div>
                                        </div>
                                    )}
                                    {/* Published Date */}
                                    {post.date && (
                                        <div className="meta-item date">
                                            <IconOrnateCalendar className="meta-icon" aria-hidden="true" />
                                            <time dateTime={new Date(post.date).toISOString()}>
                                                Published {formatDate(post.date, 'long')}
                                            </time>
                                        </div>
                                    )}
                                    {/* Reading Time */}
                                    {post.readingTime && (
                                        <div className="meta-item reading-time">
                                            <IconOrnateClock className="meta-icon" aria-hidden="true" />
                                            <span>{post.readingTime} min read</span>
                                        </div>
                                    )}
                                    {/* Category */}
                                    {post.category && (
                                        <div className="meta-item category">
                                            <IconOrnateTag className="meta-icon" aria-hidden="true" />
                                            <Link href={`/blog?category=${post.category}`} className="post-category-link">
                                                {post.category.replace(/-/g, ' ')}
                                            </Link>
                                        </div>
                                    )}
                                </div>

                                {/* Tags (remain below meta block) */}
                                {post.tags && post.tags.length > 0 && (
                                    <div className="post-tags">
                                        <div className="tags-list">
                                            {post.tags.map(tag => (
                                                <Link href={`/blog?tags=${tag}`} key={tag} className="post-tag">
                                                    #{tag}
                                                </Link>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </header>

                            {/* Featured Image */}
                            <div className="post-featured-image-container">
                               {post.image ? (
                                  <figure className="post-featured-image">
                                     <Image
                                        src={post.image}
                                        alt={post.imageAlt || post.title || 'Featured image'}
                                        width={1600} // Provide appropriate dimensions
                                        height={900}
                                        className="featured-image"
                                        priority={true} // Load featured image eagerly
                                     />
                                     {post.imageCaption && <figcaption>{post.imageCaption}</figcaption>}
                                  </figure>
                               ) : (
                                  <AsciiArtPlaceholder className="post-ascii-placeholder" height="250px" padding="1rem" width="100%"/>
                               )}
                           </div>

                            {/* Main Content */}
                            <div className="post-content">
                                {/* Using Custom Renderer */}
                                <CustomMarkdownRenderer>{post.content || ''}</CustomMarkdownRenderer>
                            </div>

                            {/* Contributors Section (After Content) */}
                            {post.contributors && post.contributors.length > 0 && (
                                <section className="post-contributors">
                                    <h4>Contributors</h4>
                                    <ul>
                                        {post.contributors.map(contributor => (
                                            <li key={contributor.name}>
                                                {contributor.avatarUrl && (
                                                    <Image src={contributor.avatarUrl} alt={contributor.name} width={24} height={24} className="contributor-avatar"/>
                                                )}
                                                {contributor.githubUsername ? (
                                                    <a href={`https://github.com/${contributor.githubUsername}`} target="_blank" rel="noopener noreferrer" className="hover:text-accent-highlight transition-colors">{contributor.name}</a>
                                                ) : (
                                                    <span>{contributor.name}</span>
                                                )}
                                            </li>
                                        ))}
                                    </ul>
                                </section>
                            )}

                            {/* Post Footer */}
                            <footer className="post-footer">
                                <ShareButtons title={post.title || ''} url={`/blog/${post.category || 'uncategorized'}/${post.slug}`} />
                            </footer>

                            {/* Comments Sections */}
                            <section className="post-comments" aria-labelledby="comments-heading">
                                <h2 id="comments-heading" className="comments-title">Join the Discussion</h2>
                                
                                {/* Disqus Comments (added before Giscus) */}
                                <DisqusComments 
                                    postTitle={post.title || 'Untitled Post'} 
                                    postUrl={postUrl}
                                    postIdentifier={postIdentifier}
                                    className="mb-8"
                                />
                                
                                {/* Giscus Comments */}
                                <div className="mt-8">
                                    <div className="giscus-header">
                                        <h3 className="giscus-title">Comments with GitHub</h3>
                                        <div className="giscus-divider"></div>
                                    </div>
                                    <GiscusClient />
                                </div>
                            </section>

                            {/* Newsletter signup for blog posts - moved after comments */}
                            <section className="post-newsletter-signup mt-16">
                                <BlogNewsletterSection 
                                    variant="blog" 
                                    background="accent"
                                />
                            </section>
                        </article>
                    </main> {/* End blog-main-content-area */}
                </div> {/* End blog-layout-container */}
            </BlogPageClient>
        </BlogNewsletterWrapper>
    );
}