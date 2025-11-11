// src/app/blog/page.tsx
import React, { Suspense } from 'react';
import BlogListClient from './BlogListClient'; // Import Client Component
import { getAllPosts } from '@/lib/getAllPosts'; // Adjust path if needed
import BlogAnalytics from '@/components/BlogAnalytics'; // Analytics tracking
import EnhancedTracking from '@/components/EnhancedTracking'; // Element tracking
import BlogNewsletterWrapper from '@/components/BlogNewsletterProvider'; // Newsletter with modal
import BlogNewsletterSection from '@/components/BlogNewsletterSection'; // Newsletter signup
import type { Metadata } from 'next';
import "@/app/styles/blogs.css"; // Import modularized blog styles

// Static Metadata for the main blog index
export const metadata: Metadata = {
    title: 'Looking Glass Chronicles - Insights & Experiments | Manic Agency',
    description: 'Dispatches, discoveries, and coded visions from the Synthetic Publishing Platform. Explore experimental development insights, AI implementations, and creative technology.',
    keywords: [
        'manic agency blog',
        'looking glass chronicles',
        'experimental development insights',
        'AI implementation blog',
        'creative technology articles',
        'development experiments',
        'innovative coding insights',
        'synthetic publishing platform',
        'tech innovations',
        'developer insights'
    ],
    authors: [{ name: 'Manic Agency', url: 'https://manic.agency' }],
    alternates: {
        canonical: '/blog'
    },
    openGraph: {
        type: 'website',
        url: '/blog',
        title: 'Looking Glass Chronicles - Insights & Experiments | Manic Agency',
        description: 'Dispatches, discoveries, and coded visions from the Synthetic Publishing Platform. Explore experimental development insights and creative technology.',
        images: [
            {
                url: '/og-default.webp',
                width: 1200,
                height: 630,
                alt: 'Looking Glass Chronicles - Manic Agency Blog'
            }
        ]
    },
    twitter: {
        card: 'summary_large_image',
        title: 'Looking Glass Chronicles - Insights & Experiments | Manic Agency',
        description: 'Dispatches, discoveries, and coded visions from the Synthetic Publishing Platform. Explore experimental development insights and creative technology.',
        images: [{
            url: '/og-default.webp',
            alt: 'Looking Glass Chronicles - Manic Agency Blog'
        }]
    }
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
        <BlogNewsletterWrapper>
            <div className="blog-scope">
                {/* Analytics tracking for blog listing */}
                <BlogAnalytics postType="list" />
                <EnhancedTracking enableElementTracking pageType="blog" />
                
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
                    
                    {/* Newsletter signup for blog */}
                    <BlogNewsletterSection 
                        variant="blog" 
                        background="accent"
                        className="mt-16"
                    />
                </main>
            </div>
        </BlogNewsletterWrapper>
    );
}