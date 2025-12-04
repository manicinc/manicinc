// src/app/projects/[category]/[slug]/page.tsx
import React from 'react';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import type { Metadata, ResolvingMetadata } from 'next'; // Use Next's Metadata type

// --- Library Imports ---
import { getProjectBySlug, getAllProjectPaths, getRelatedProjects } from '@/lib/getAllProjects'; // Adjust path
import type { ProjectWithToc } from '@/types/project'; // Adjust path

// --- Component Imports ---
// Assume Nav and Footer are in layout.tsx
// import { Nav } from '@/components/Nav';
// import Footer from '@/components/Footer';
import TableOfContents from '@/components/Project/TableOfContents'; // Adjust path (Ensure this component is styled)
import ProjectCard from '@/components/Project/ProjectCard'; // Adjust path (Ensure this component is styled)

// --- Utility Imports ---
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
// Import icons from lucide-react (consolidated icon library)
import { Github, ExternalLink, Calendar, Tag, Tags, Users, CheckCircle, Loader2, Lightbulb, ArrowLeft, Clock } from 'lucide-react';

// --- Page Props Interface ---
interface ProjectDetailPageProps {
    params: {
        category: string;
        slug: string;
    };
}

// --- Data Fetching Helper ---
async function getProjectData(category: string, slug: string): Promise<ProjectWithToc | null> {
    // Ensure your getProjectBySlug function fetches necessary data including TOC if applicable
    const project = getProjectBySlug(category, slug);
    return project;
}

// --- Dynamic Metadata Generation ---
type MetadataProps = { params: { category: string; slug: string } };

export async function generateMetadata({ params }: MetadataProps, parent: ResolvingMetadata): Promise<Metadata> {
  const project = await getProjectData(params.category, params.slug);

  if (!project) {
    return { title: 'Project Not Found' };
  }

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
  const projectUrl = `/projects/${params.category}/${params.slug}`; // Relative path for metadataBase
  const pageTitle = `${project.title} | Project`; // Specific title, layout template adds site name
  const pageDescription = project.description || 'Explore this project by Manic Agency.'; // Fallback description

  // Resolve image URL relative to metadataBase if possible
  let ogImage = undefined;
  if (project.image) {
      ogImage = project.image.startsWith('http') ? project.image : project.image; // Use relative path if not absolute
  }

  // Authors structure for Metadata API
  const authors = project.team?.map(member => ({ name: member.name, url: member.link }));

  return {
    title: pageTitle,
    description: pageDescription,
    keywords: project.tags || [],
    authors: authors,
    alternates: { canonical: projectUrl },
    openGraph: {
      title: pageTitle, // Use specific title
      description: pageDescription,
      url: projectUrl, // Use relative URL resolved by metadataBase
      // siteName inherited from layout metadata
      ...(ogImage && { images: [{ url: ogImage, alt: project.title }] }), // Use specific image
      locale: 'en_US',
      type: 'article', // Treat project page like an article
      publishedTime: project.date ? new Date(project.date).toISOString() : undefined,
      modifiedTime: project.modifiedDate ? new Date(project.modifiedDate).toISOString() : undefined,
      // authors: project.team?.map(member => member.name), // Optional string array
      tags: project.tags,
    },
    twitter: {
      // card inherited from layout
      title: pageTitle,
      description: pageDescription,
      ...(ogImage && { images: [ogImage] }), // Use specific image
      // site, handle inherited
    },
  };
}

// --- Static Site Generation Paths ---
export async function generateStaticParams() {
    // Keep your existing implementation
    try {
        const paths = getAllProjectPaths();
        console.log(`[GSParams Projects] Preparing ${paths.length} project paths.`);
        return paths;
    } catch (error) {
        console.error("[GSParams Projects] Failed:", error);
        return [];
    }
}


// --- Page Component ---
export default async function ProjectDetailPage({ params }: ProjectDetailPageProps) {
    const { category, slug } = params;
    const project = await getProjectData(category, slug);
    const related = project ? await getRelatedProjects(project) : [];

    if (!project) { notFound(); }

    // Destructure with defaults
    const {
        title, description, longDescription, content, date, modifiedDate,
        tags = [], image, images = [], link, github, technologies = [],
        stats = [], status, team = [], testimonials = [], toc = []
    } = project;

    // Format date for display
    const displayDate = date ? new Intl.DateTimeFormat('en-US', { dateStyle: 'long', timeZone: 'UTC' }).format(new Date(date)) : 'N/A';
    const displayModifiedDate = modifiedDate ? new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric', timeZone: 'UTC' }).format(new Date(modifiedDate)) : null;

    const hasContent = content && content.trim().length > 0;
    const hasLongDescription = longDescription && longDescription.trim().length > 0;
    // TOC structure might differ based on your type, adjust check if needed
    const hasTOC = Array.isArray(toc) && toc.length > 0;
    const hasSidebarData = technologies.length > 0 || stats.length > 0 || team.length > 0 || !!status || !!github || !!link || tags.length > 0;
    const displaySidebar = hasTOC || hasSidebarData;

    // --- Status Renderer ---
    const renderStatus = () => {
        const baseClass = "flex items-center text-xs font-semibold font-meta-blog py-1 px-2.5 rounded-pill border"; // Use meta font
        switch (status) {
            case 'completed': return <span className={`${baseClass} bg-[rgba(var(--accent-secondary-rgb),0.1)] text-[color:var(--accent-secondary)] border-[color:var(--accent-secondary)]`}><CheckCircle className="mr-1.5" size={14} /> Completed</span>;
            case 'ongoing': return <span className={`${baseClass} bg-[rgba(var(--accent-alert-rgb),0.1)] text-[color:var(--accent-alert)] border-[color:var(--accent-alert)]`}><Loader2 className="mr-1.5 animate-spin" size={14} /> Ongoing</span>;
            case 'concept': return <span className={`${baseClass} bg-[rgba(var(--accent-primary-rgb),0.1)] text-[color:var(--accent-primary)] border-[color:var(--accent-primary)]`}><Lightbulb className="mr-1.5" size={14} /> Concept</span>;
            default: return null;
        }
    };

    // --- Markdown Renderer ---
    // Note: Styling via prose classes should be defined in theme.css or blogs.css if reusing blog styles
    const renderMarkdownContent = (markdownContent: string) => (
        <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            // Apply themed prose classes. Adjust if you have a separate theme for projects vs blog.
            className="prose prose-lg dark:prose-invert max-w-none
                       prose-headings:font-heading-blog prose-headings:text-[color:var(--text-heading)] prose-headings:mt-10 prose-headings:mb-4 prose-headings:border-b prose-headings:border-[color:var(--bg-tertiary)] prose-headings:pb-2
                       prose-p:font-body-blog prose-p:text-justify prose-p:leading-relaxed
                       prose-a:text-[color:var(--accent-secondary)] hover:prose-a:text-[color:var(--accent-highlight)] prose-a:border-b prose-a:border-dotted prose-a:border-[color:var(--accent-secondary)] hover:prose-a:border-[color:var(--accent-highlight)] prose-a:transition-colors
                       prose-strong:font-semibold prose-strong:text-[color:var(--text-primary)]
                       prose-blockquote:border-l-4 prose-blockquote:border-accent-muted1 prose-blockquote:pl-4 prose-blockquote:italic prose-blockquote:text-[color:var(--text-secondary)]
                       prose-code:font-mono prose-code:bg-[color:var(--bg-secondary)] prose-code:text-[color:var(--text-secondary)] prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded-[--radius-base] prose-code:text-sm
                       prose-pre:bg-[color:var(--bg-code)] prose-pre:text-[color:var(--text-code)] prose-pre:border prose-pre:border-[color:var(--bg-tertiary)] prose-pre:rounded-[--radius-lg] prose-pre:p-4 prose-pre:text-sm
                       prose-li:my-1 prose-ul:list-['⚜_'] prose-ul:ml-1 prose-ol:list-roman prose-ol:ml-1" // Example list styling
        >
            {markdownContent}
        </ReactMarkdown>
    );


    // --- Render Page ---
    return (
        <>
            {/* Nav is handled by layout.tsx */}
            <main className="project-detail-page bg-bg-primary text-text-primary min-h-screen">
                {/* Use max-width/padding container */}
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
                    <article>
                        {/* --- Project Header --- */}
                        <header className="mb-12 md:mb-16 pb-8 border-b border-dashed border-[color:var(--bg-tertiary)]">
                            {/* Breadcrumbs */}
                            <div className="mb-4 text-sm font-meta-blog">
                                <Link href="/projects" className="text-[color:var(--text-secondary)] hover:text-[color:var(--accent-primary)] transition-colors inline-flex items-center group">
                                    <ArrowLeft className="mr-1.5 transition-transform duration-200 ease-in-out group-hover:-translate-x-1" size={14} /> Projects Archive
                                </Link>
                                <span className="mx-2 text-[color:var(--text-muted)]">/</span>
                                <span className="capitalize text-[color:var(--text-muted)]">{category.replace(/-/g, ' ')}</span>
                            </div>
                            {/* Title */}
                            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold font-display mb-3 text-[color:var(--text-heading)]">
                                {title}
                            </h1>
                            {/* Description */}
                            <p className="text-lg md:text-xl text-[color:var(--text-secondary)] max-w-3xl font-body mb-5">
                                {description}
                            </p>
                            {/* Date/Modified */}
                            <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-[color:var(--text-muted)] font-meta-blog">
                                <span className='flex items-center whitespace-nowrap'><Calendar className="mr-1.5 text-[color:var(--accent-primary)] opacity-70" size={14} /> Published: {displayDate}</span>
                                {displayModifiedDate && (<span className='flex items-center whitespace-nowrap'><Clock className="mr-1.5" size={14} /> Updated: {displayModifiedDate}</span>)}
                            </div>
                        </header>

                        {/* --- Main Content Grid (Includes Sidebar) --- */}
                        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">

                            {/* --- Primary Content Column --- */}
                            <div className={`prose-base ${displaySidebar ? 'lg:col-span-8 xl:col-span-9' : 'lg:col-span-12'}`}>
                                {/* Featured Image - Themed */}
                                <div className="mb-8 md:mb-10 project-featured-image">
                                    <Image
                                        src={image || '/images/placeholder.png'} // Provide a fallback
                                        alt={`${title} - Featured Image`}
                                        width={1600} // Provide appropriate dimensions
                                        height={900}
                                        className="w-full h-auto object-cover featured-image" // Style in CSS
                                        priority // Load main image quickly
                                    />
                                </div>

                                {/* Main Text Content */}
                                <div className="project-content-area">
                                    {hasContent ? renderMarkdownContent(content) :
                                     hasLongDescription ? <div className="font-body-blog text-lg leading-relaxed">{longDescription}</div> :
                                     <p className="text-[color:var(--text-muted)] italic">No detailed description provided.</p>}
                                </div>

                                {/* Image Gallery - Themed */}
                                {images.length > 0 && (
                                    <section className="mt-12 md:mt-16 pt-8 border-t border-dashed border-[color:var(--bg-tertiary)]">
                                        <h2 className="project-section-heading">Gallery</h2>
                                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 md:gap-4">
                                            {images.map((imgUrl, index) => (
                                                <div key={index} className="gallery-image-wrapper">
                                                    <Image src={imgUrl} alt={`${title} - Gallery Image ${index + 1}`} fill sizes="(max-width: 640px) 50vw, 33vw" className="gallery-image"/>
                                                </div>
                                            ))}
                                        </div>
                                    </section>
                                )}

                                {/* Testimonials - Themed */}
                                {testimonials.length > 0 && (
                                    <section className="mt-12 md:mt-16 pt-8 border-t border-dashed border-[color:var(--bg-tertiary)]">
                                        <h2 className="project-section-heading">Testimonials</h2>
                                        <div className="space-y-6">
                                            {testimonials.map((testimonial, index) => (
                                                <blockquote key={index} className="project-testimonial">
                                                    <p className="testimonial-quote">"{testimonial.quote}"</p>
                                                    <footer className="testimonial-author">
                                                        <span className="font-semibold text-[color:var(--accent-primary)]">{testimonial.author}</span>
                                                        {testimonial.role && <span className="block text-sm text-[color:var(--text-muted)]">{testimonial.role}</span>}
                                                    </footer>
                                                </blockquote>
                                            ))}
                                        </div>
                                    </section>
                                )}
                            </div> {/* End Primary Content Column */}


                            {/* --- Sidebar Column (Conditional) --- */}
                            {displaySidebar && (
                                <aside className="lg:col-span-4 xl:col-span-3 lg:sticky lg:top-[calc(var(--header-height)_+_2rem)] self-start"> {/* Sticky Sidebar */}
                                    {/* TOC */}
                                    {hasTOC && (
                                        <div className="project-sidebar-widget">
                                            <h3 className="project-sidebar-heading">Contents</h3>
                                            {/* Ensure TableOfContents component uses themed styles */}
                                            <TableOfContents toc={toc} />
                                        </div>
                                    )}

                                    {/* Metadata Box */}
                                    {hasSidebarData && (
                                        <div className={`project-sidebar-widget ${hasTOC ? 'mt-8' : ''}`}>
                                            <h3 className="project-sidebar-heading">Project Details</h3>

                                            {status && <div className="sidebar-detail-item">{renderStatus()}</div>}

                                            {technologies.length > 0 && (
                                                <div className="sidebar-detail-item">
                                                    <h4 className="sidebar-detail-label"><Tag className="mr-2" size={12} />Stack</h4>
                                                    <div className="flex flex-wrap gap-1.5">
                                                        {technologies.map(tech => (<span key={tech} className="sidebar-tag tech-tag">{tech}</span>))}
                                                    </div>
                                                </div>
                                            )}

                                            {tags.length > 0 && (
                                                <div className="sidebar-detail-item">
                                                    <h4 className="sidebar-detail-label"><Tags className="mr-2" size={12} />Tags</h4>
                                                    <div className="flex flex-wrap gap-1.5">
                                                        {tags.map(tag => (<span key={tag} className="sidebar-tag">{tag}</span>))}
                                                    </div>
                                                </div>
                                            )}

                                            {stats.length > 0 && (
                                                <div className="sidebar-detail-item">
                                                    <h4 className="sidebar-detail-label">Stats</h4>
                                                    <ul className="space-y-1 text-sm">{stats.map(stat => (<li key={stat.label} className="flex justify-between"><span>{stat.label}:</span><strong className='font-mono'>{stat.value}</strong></li>))}</ul>
                                                </div>
                                            )}

                                            {team.length > 0 && (
                                                <div className="sidebar-detail-item">
                                                    <h4 className="sidebar-detail-label"><Users className="mr-2" size={12} />Team</h4>
                                                    <ul className="space-y-1.5 text-sm">{team.map(member => (<li key={member.name}><span className='font-semibold'>{member.name}</span> <span className='text-[color:var(--text-muted)]'>({member.role})</span>{member.link && (<a href={member.link} target="_blank" rel="noopener noreferrer" className="sidebar-external-link">[↗]</a>)}</li>))}</ul>
                                                </div>
                                            )}

                                            {/* Links Section */}
                                            {(link || github) && (
                                                <div className="mt-5 pt-4 border-t border-dashed border-[color:var(--bg-tertiary)] space-y-3">
                                                    <h4 className="sidebar-detail-label">Links</h4>
                                                    {link && (<a href={link} target="_blank" rel="noopener noreferrer" className="sidebar-link-button live-link"><ExternalLink className="mr-2" size={14} /> View Live Project</a>)}
                                                    {github && (<a href={github} target="_blank" rel="noopener noreferrer" className="sidebar-link-button github-link"><Github className="mr-2" size={14} /> View Source Code</a>)}
                                                </div>
                                             )}
                                        </div>
                                    )}
                                </aside>
                            )}
                        </div> {/* End Grid Layout */}

                        {/* --- Related Projects Section --- */}
                        {related.length > 0 && (
                            <section className="related-projects-section">
                                <h2 className="project-section-heading">Related Works</h2>
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
                                    {related.map(relatedProject => (
                                        // Ensure ProjectCard component uses themed styles
                                        <ProjectCard key={relatedProject.slug} project={relatedProject} />
                                    ))}
                                </div>
                            </section>
                        )}

                    </article>
                </div> {/* End Max Width Container */}
            </main>
            {/* Footer is handled by layout.tsx */}

             {/* Add Specific Styles for Project Page (Or move to blogs.css/theme.css) */}
             <style jsx global>{`
                .project-detail-page { /* Add specific page bg if needed */ }

                /* Sidebar Widget Styling */
                .project-sidebar-widget {
                    border: 1px solid var(--bg-tertiary);
                    background-color: var(--bg-secondary);
                    border-radius: var(--radius-lg);
                    padding: 1.25rem;
                    box-shadow: var(--shadow-soft);
                }
                .project-sidebar-heading {
                    font-family: var(--font-heading-blog); /* Playfair */
                    font-size: 1.1rem;
                    font-weight: 700;
                    color: var(--accent-primary); /* Burgundy */
                    margin-bottom: 1rem;
                    padding-bottom: 0.5rem;
                    border-bottom: 1px solid var(--bg-tertiary);
                }
                .sidebar-detail-item { margin-bottom: 1.25rem; }
                .sidebar-detail-label {
                    font-family: var(--font-meta-blog); /* Lato */
                    font-size: 0.75rem; font-weight: 700;
                    color: var(--text-muted); text-transform: uppercase;
                    letter-spacing: 0.5px; margin-bottom: 0.5rem;
                    display: flex; align-items: center;
                }
                .sidebar-tag {
                    font-family: var(--font-meta-blog); font-size: 0.75rem;
                    background: var(--bg-tertiary); color: var(--text-secondary);
                    padding: 0.15rem 0.6rem; border-radius: var(--radius-pill);
                    border: 1px solid transparent;
                }
                .sidebar-tag.tech-tag { color: var(--accent-secondary); background: rgba(var(--accent-secondary-rgb),0.1); }
                .sidebar-external-link {
                    color: var(--accent-primary); margin-left: 0.25rem; font-size: 0.8em;
                    opacity: 0.7; transition: opacity var(--transition-fast);
                }
                .sidebar-external-link:hover { opacity: 1; }
                .sidebar-link-button {
                    display: flex; align-items: center; justify-content: center; width: 100%;
                    padding: 0.6rem 1rem; text-align: center; border-radius: var(--radius-base);
                    font-size: 0.85rem; font-weight: 600; font-family: var(--font-meta-blog);
                    transition: all var(--transition-fast);
                }
                .sidebar-link-button.live-link { background: var(--accent-secondary); color: var(--text-on-accent); border: 1px solid var(--accent-secondary); }
                .sidebar-link-button.live-link:hover { background: transparent; color: var(--accent-secondary); }
                .sidebar-link-button.github-link { background: var(--bg-tertiary); color: var(--text-secondary); border: 1px solid var(--bg-tertiary); }
                .sidebar-link-button.github-link:hover { border-color: var(--accent-muted1); color: var(--accent-muted1); }

                /* Project Content Styling */
                .project-featured-image { /* Style the wrapper */
                    border: 1px solid rgba(var(--accent-highlight-rgb), 0.3);
                    padding: 6px; background: var(--bg-secondary);
                    box-shadow: var(--shadow-soft), 0 0 0 2px var(--bg-tertiary);
                    border-radius: var(--radius-base);
                 }
                .featured-image { border-radius: 1px; /* Slight inner rounding */ }
                .project-section-heading {
                    font-family: var(--font-heading-blog); font-size: clamp(1.5rem, 4vw, 2rem);
                    font-weight: 700; text-align: center; margin-bottom: 1.5rem;
                    color: var(--text-heading);
                }
                .gallery-image-wrapper {
                    border: 1px solid var(--bg-tertiary); border-radius: var(--radius-base);
                    overflow: hidden; box-shadow: var(--shadow-soft);
                    transition: transform 0.2s ease, box-shadow 0.2s ease;
                    position: relative;
                    aspect-ratio: 16 / 9; /* Provide proper aspect ratio for fill images */
                    height: 200px; /* Provide explicit height for fill images */
                }
                 .gallery-image-wrapper:hover {
                     transform: scale(1.03); box-shadow: var(--shadow-raised); /* Example */
                 }
                .gallery-image { object-fit: cover; transition: transform 0.3s ease; }
                .gallery-image-wrapper:hover .gallery-image { transform: scale(1.1); }

                .project-testimonial { /* Override base blockquote */
                   border-left: 4px solid var(--accent-secondary);
                   background: var(--bg-secondary); padding: 1.25rem;
                   border-radius: var(--radius-lg); box-shadow: var(--shadow-soft);
                   font-style: italic; margin-bottom: 1.5rem;
                }
                .testimonial-quote { font-family: var(--font-body-blog); color: var(--text-primary); margin-bottom: 1rem; }
                .testimonial-author { text-align: right; font-style: normal; }

                .related-projects-section { margin-top: 4rem; padding-top: 2rem; border-top: 1px solid var(--bg-tertiary); }
             `}</style>
        </>
    );
}