// src/app/projects/page.tsx
// V2 - CORRECTED: Server Component for the main project listing page

import React from 'react';
import type { Metadata } from 'next';

// Import your actual data fetching functions
// Only need functions that get *all* data for the listing view
import { getAllProjects, getFeaturedProjects, getProjectCategories } from '@/lib/getAllProjects';
import { Project } from '@/types/project';
import { getUniqueItems } from '@/lib/getUniqueItems';

// Import the Client Component that handles display
import ProjectsView from '@/components/Project/ProjectsView'; // Ensure path is correct

// SEO Metadata for Projects Page
export const metadata: Metadata = {
    title: 'Our Projects - Creative Development Portfolio | Manic Agency',
    description: 'Explore Manic Agency\'s portfolio of innovative projects: AR/VR experiences, blockchain solutions, AI implementations, and experimental web applications. See our creative development work.',
    keywords: [
        'manic agency projects',
        'creative development portfolio',
        'AR VR projects',
        'blockchain development',
        'AI implementation projects',
        'experimental web applications',
        'Los Angeles development work',
        'innovative software projects',
        'custom development portfolio',
        'creative technology showcases'
    ],
    authors: [{ name: 'Manic Agency', url: 'https://manic.agency' }],
    alternates: {
        canonical: '/projects'
    },
    openGraph: {
        type: 'website',
        url: '/projects',
        title: 'Our Projects - Creative Development Portfolio | Manic Agency',
        description: 'Explore Manic Agency\'s portfolio of innovative projects: AR/VR experiences, blockchain solutions, AI implementations, and experimental web applications.',
        images: [
            {
                url: '/og-default.webp',
                width: 1200,
                height: 630,
                alt: 'Manic Agency Projects Portfolio'
            }
        ]
    },
    twitter: {
        card: 'summary_large_image',
        title: 'Our Projects - Creative Development Portfolio | Manic Agency',
        description: 'Explore Manic Agency\'s portfolio of innovative projects: AR/VR experiences, blockchain solutions, AI implementations, and experimental web applications.',
        images: [{
            url: '/og-default.webp',
            alt: 'Manic Agency Projects Portfolio'
        }]
    }
};

// --- Page Component (Server Component) ---
// This fetches ALL data needed for the ProjectsView client component
export default async function ProjectsPage() {

    let allProjects: Project[] = [];
    let featuredProjects: Project[] = [];
    let categories: string[] = [];

    try {
        // Fetch all data needed for the view
        // These promises can run in parallel
        [allProjects, featuredProjects, categories] = await Promise.all([
            getAllProjects(),
            getFeaturedProjects(5), // Get up to 5 featured
            getProjectCategories()
        ]);

    } catch (error) {
        console.error("Error fetching data for /projects page (server-side):", error);
        // Handle error appropriately, maybe pass an error flag to ProjectsView
        // Or return a dedicated error component from here
    }

    // Render the Client Component and pass the fetched data down as props
    return (
      <ProjectsView
        allProjects={allProjects}
        featuredProjects={featuredProjects}
        categories={categories}
      />
    );
}