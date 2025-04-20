// src/app/blog/page.tsx
import React, { Suspense } from 'react';
import BlogListClient from './BlogListClient'; // Import Client Component
import { getAllPosts } from '@/lib/getAllPosts'; // Adjust path if needed
import type { Metadata } from 'next';
import "@/app/styles/blogs.css"; // Import blog styles

// Static Metadata for the main blog index
export const metadata: Metadata = {
  title: 'Looking Glass Chronicles', // Specific title for /blog
  description: 'Dispatches, discoveries, and coded Visions from the Synthetic Publishing Platform powered by Manic Agency.',
  // Add other specific OG/Twitter data if desired
};

// Loading Fallback Component
function LoadingFallback() {
    return <div className="loading-fallback">Loading Chronicles...</div>;
}

// Page component NO LONGER needs searchParams prop
export default function BlogIndexPage() {
    // Fetch all posts on the server
    const posts = getAllPosts();

    // No need to process searchParams here

    return (
        <div className="blog-scope">
            <main className="blog-main-content-area">
                <div className="blog-list-main-container">
                    <header className="blog-list-page-header">
                        {/* Use metadata title, but keep h1 for semantics */}
                        <h1 className="blog-list-title">Chronicles from the Looking Glass</h1>
                        {/* <p className="blog-list-subtitle">Discpatches, Discoveries, and Coded Visions</p> */}
                    </header>

                    {/* Suspense boundary is still good practice for client components */}
                    <Suspense fallback={<LoadingFallback />}>
                        {/* Pass ONLY initialPosts */}
                        <BlogListClient initialPosts={posts} />
                    </Suspense>
                </div>
            </main>
        </div>
    );
}