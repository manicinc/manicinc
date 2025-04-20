// src/app/blog/[category]/page.tsx

import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getAllPosts } from "@/lib/getAllPosts"; // Adjust path if needed
import type { BlogPost } from "@/types/blog"; // Adjust path if needed
import Footer from '@/components/Footer/Footer'; // Adjust path if needed
import { Calendar, Clock, Tag as TagIcon } from 'lucide-react'; // Icons for cards
import { formatDate } from '@/util/formatDate';

// Import main blog styles - includes list/card styles
import "@/app/styles/blogs.css"; // Adjust path if needed

type Params = {
  category: string;
};

// generateStaticParams should generate paths like { category: 'thinkpieces' }, etc.
export async function generateStaticParams(): Promise<Params[]> {
  console.log("[generateStaticParams] Generating params for /blog/[category]");
  try {
    const posts = getAllPosts();
    // Use Set to get unique, valid categories
    const categories = new Set<string>(
      posts
        .map(post => post.category ? String(post.category).trim() : '')
        .filter(cat => cat && !cat.includes('/')) // Ensure category exists and is simple
    );

    if (categories.size === 0) {
      console.warn("[generateStaticParams Category] No valid categories found!");
      return [];
    }

    const params = Array.from(categories).map(cat => ({ category: cat }));
    console.log(`[generateStaticParams Category] Generated params: ${params.map(p => p.category).join(', ')}`);
    return params;

  } catch (error) {
    console.error("[generateStaticParams Category] ERROR during generation:", error);
    return [];
  }
}


// Page component
export default function BlogCategoryPage({ params }: { params: Params }) {
  const { category } = params;

  // Filter posts for the current category (case-insensitive)
  const postsInCategory = getAllPosts().filter(
    (post) => post.category?.toLowerCase() === category.toLowerCase()
  );

  // Handle cases where category exists but has no posts (or invalid direct access)
  if (postsInCategory.length === 0) {
    console.log(`No posts found for category "${category}" during page render.`);
    notFound(); // Show 404
  }

  // Format category name for display (e.g., 'thinkpieces' -> 'Thinkpieces')
  const displayCategory = category.charAt(0).toUpperCase() + category.slice(1).replace(/-/g, ' ');

  return (
    <>
      {/* Assume Nav is handled by layout.tsx - REMOVE duplicate Nav */}
      {/* Use the same container class as the main blog list page */}
      <main className="blog-list-main-container">

        {/* Use the same header structure and classes as the main blog list page */}
        <header className="blog-list-page-header">
          <p className="text-sm font-meta-blog uppercase tracking-widest text-[color:var(--text-muted)] mb-2">
            Archive Category
          </p>
          <h1 className="blog-list-title">{displayCategory}</h1> {/* Display formatted category */}
          <p className="blog-list-subtitle">
             Entries filed under the "{displayCategory}" classification.
          </p>
          {/* Consistent divider */}
          <hr className="w-1/3 mx-auto mt-6 border-t border-[color:var(--bg-tertiary)] opacity-50" />
        </header>

        {/* Use the same themed grid and card styles */}
        <div className="blog-grid">
          {postsInCategory.map((post) => (
            // Use the exact same card structure and classes as in BlogListClient
            <article key={post.slug} className="blog-card group">
              <div className="blog-card-image">
                <Link href={`/blog/${post.category}/${post.slug}`} aria-label={`Read more about ${post.title}`}>
                  {post.image ? (
                    <img src={post.image} alt="" loading="lazy" width={400} height={160} />
                  ) : (
                    <div className="blog-card-ascii-placeholder">
                       {/* Placeholder graphic */}
                       <svg viewBox="0 0 50 30" className="w-12 h-12 text-[color:var(--text-muted)] opacity-50"><path d="M M 5,5 L 45,5 L 45,25 L 5,25 Z M 5,15 L 45,15 M 15,5 L 15,25 M 35,5 L 35,25" stroke="currentColor" strokeWidth="1" fill="none" /></svg>
                    </div>
                  )}
                </Link>
              </div>

              <div className="blog-card-content">
                {/* Category name can be omitted here since we are on the category page */}
                {/* Or keep it for consistency if desired */}
                 {/* <div className="blog-category mb-2"><span className="category-name">{post.category}</span></div> */}

                <h2 className="blog-entry-title">
                  <Link href={`/blog/${post.category}/${post.slug}`} className="blog-link">
                    {post.title || 'Untitled Entry'}
                  </Link>
                </h2>
                 <div className="blog-date">
                   <span><Calendar size={14} className="mr-1"/><time dateTime={post.date ? new Date(post.date).toISOString() : undefined}>{formatDate(post.date)}</time></span>
                   {post.readingTime && (<span className="reading-time-small"><Clock size={14} className="mr-1"/>{post.readingTime} min read</span>)}
                 </div>
                <p className="blog-excerpt">{post.excerpt || 'No summary available.'}</p>
                {post.tags && post.tags.length > 0 && (
                  <div className="blog-tags">
                    {/* Display tags as non-interactive spans here */}
                    {post.tags.slice(0, 3).map((tag) => (
                      <span key={tag} className="blog-tag">#{tag}</span>
                    ))}
                    {post.tags.length > 3 && <span className="blog-tag">...</span>}
                  </div>
                )}
                <div className="readmore-container">
                  <Link href={`/blog/${post.category}/${post.slug}`} className="readmore-link">
                    Read Article <span className="group-hover:translate-x-1 transition-transform duration-200 inline-block">&rarr;</span>
                  </Link>
                </div>
              </div>
            </article>
          ))}
        </div>

        {/* Link back to the main blog index */}
        <div className="mt-16 text-center">
            <Link href="/blog" className="back-to-blog-link"> {/* Style using CSS */}
                &larr; Back to All Chronicles
            </Link>
        </div>

      </main>
      <Footer />
    </>
  );
}