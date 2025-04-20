import { getAllPosts } from "@/lib/getAllPosts";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { BlogPost } from "@/types/blog";

export async function generateStaticParams() {
    const posts = getAllPosts();
  
    const tagSet = new Set<string>();
    posts.forEach((post) => {
      post.tags?.forEach((tag) => {
        if (typeof tag === 'string' && tag.trim() !== '') {
          tagSet.add(tag.toLowerCase().trim());
        }
      });
    });
  
    const tags = Array.from(tagSet);
    
    if (tags.length === 0) {
      console.warn("[generateStaticParams] No tags found! Returning fallback for build.");
      return [{ tag: "placeholder" }];
    }
  
    return tags.map((tag) => ({ tag }));
}
  


// Rest of your TagPage component...
export default function TagPage({ params }: { params: { tag: string } }) {
    const posts: BlogPost[] = getAllPosts().filter((post: BlogPost) =>
      post.tags?.map((t: string) => String(t).toLowerCase().trim()).includes(params.tag.toLowerCase())
    );
 
   if (posts.length === 0 && params.tag !== 'undefined') { // Check if tag actually exists
      console.warn(`No posts found for tag: ${params.tag}, rendering 404.`);
      return notFound();
   }
    // Make sure params.tag is decoded if it contains special characters from the URL
    const displayTag = decodeURIComponent(params.tag);
 
  return (
    <main className="blog-container">
        <div className="blog-header">
            {/* Use decoded tag for display */}
            <h1 className="blog-title">#{displayTag}</h1>
            <p className="blog-meta">Posts tagged with “{displayTag}”</p>
        </div>

        <div className="blog-grid">
            {posts.map((post) => (
            <article key={post.slug} className="blog-card">
                {post.image && (
                <img
                    src={post.image}
                    alt={post.title}
                    className="blog-card-image"
                />
                )}
                <div className="blog-date">
                {post.date && (
                    <time dateTime={post.date}>{new Date(post.date).toLocaleDateString()}</time>
                )}
                </div>
                {post.category && (
                <div className="blog-category">
                    <Link href={`/category/${post.category}`}>{post.category.toUpperCase()}</Link>
                </div>
                )}
                <h2 className="blog-entry-title">
                <Link
                    href={`/blog/${post.category}/${post.slug}`}
                    className="blog-link"
                >
                    {post.title}
                </Link>
                </h2>
                <p className="blog-excerpt">{post.excerpt}</p>
                {post.tags && (
                <div className="blog-tags">
                    {post.tags.map((tag) => (
                    <span key={tag} className="blog-tag">
                        #{tag}
                    </span>
                    ))}
                </div>
                )}
                <div className="readmore-container">
                <Link
                    href={`/blog/${post.category}/${post.slug}`}
                    className="readmore-link"
                >
                    Read More →
                </Link>
                </div>
            </article>
            ))}
        </div>
    </main>
    );
}
