// src/app/tags/page.tsx
import type { Metadata } from 'next';
import Link from "next/link";
import { getAllPosts } from '@/lib/getAllPosts';

// SEO Metadata for Tags Index Page
export const metadata: Metadata = {
    title: 'Content Tags - Browse by Topics | Manic Agency',
    description: 'Explore Manic Agency content organized by tags and topics. Browse articles by AI, blockchain, creative development, experimental coding, and more.',
    keywords: [
        'content tags',
        'blog topics',
        'content categories',
        'AI articles',
        'blockchain content',
        'creative development',
        'experimental coding',
        'technology topics',
        'development insights',
        'innovation content'
    ],
    authors: [{ name: 'Manic Agency', url: 'https://manic.agency' }],
    alternates: {
        canonical: '/tags'
    },
    openGraph: {
        type: 'website',
        url: '/tags',
        title: 'Content Tags - Browse by Topics | Manic Agency',
        description: 'Explore Manic Agency content organized by tags and topics. Browse articles by AI, blockchain, creative development, and more.',
        images: [
            {
                url: '/og-default.webp',
                width: 1200,
                height: 630,
                alt: 'Manic Agency Content Tags'
            }
        ]
    },
    twitter: {
        card: 'summary_large_image',
        title: 'Content Tags - Browse by Topics | Manic Agency',
        description: 'Explore Manic Agency content organized by tags and topics. Browse articles by AI, blockchain, creative development, and more.',
        images: [{
            url: '/og-default.webp',
            alt: 'Manic Agency Content Tags'
        }]
    }
};

export default function TagsIndexPage() {
  // Get all posts to extract unique tags
  const allPosts = getAllPosts();
  
  // Extract all unique tags
  const allTags = Array.from(
    new Set(
      allPosts
        .flatMap(post => post.tags || [])
        .filter(tag => tag && tag.trim() !== '')
    )
  ).sort();

  // Count posts per tag
  const tagCounts = allTags.reduce((acc, tag) => {
    acc[tag] = allPosts.filter(post => post.tags?.includes(tag)).length;
    return acc;
  }, {} as Record<string, number>);

  return (
    <main className="container mx-auto px-4 py-12">
      <div className="max-w-4xl mx-auto">
        <header className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">Content Tags</h1>
          <p className="text-lg text-gray-600 dark:text-gray-400">
            Browse our content by topics and themes
          </p>
        </header>

        {allTags.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {allTags.map(tag => (
              <Link
                key={tag}
                href={`/tags/${encodeURIComponent(tag)}`}
                className="block p-4 bg-gray-100 dark:bg-gray-800 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
              >
                <div className="flex justify-between items-center">
                  <span className="font-medium text-lg">{tag}</span>
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    {tagCounts[tag]} post{tagCounts[tag] !== 1 ? 's' : ''}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-600 dark:text-gray-400">No tags found.</p>
          </div>
        )}

        <div className="mt-12 text-center">
          <Link 
            href="/blog" 
            className="inline-flex items-center text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-200 font-medium"
          >
            ← Back to Chronicles
          </Link>
        </div>
      </div>
    </main>
  );
}