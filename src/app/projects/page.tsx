// src/app/projects/page.tsx
// V2 - CORRECTED: Server Component for the main project listing page

import React from 'react';
import { Metadata } from 'next';

// Import your actual data fetching functions
// Only need functions that get *all* data for the listing view
import { getAllProjects, getFeaturedProjects, getProjectCategories } from '@/lib/getAllProjects';
import { Project } from '@/types/project';

// Import the Client Component that handles display
import ProjectsView from '@/components/Project/ProjectsView'; // Ensure path is correct

// --- CORRECTED Metadata for the `/projects` LISTING page ---
// This metadata is static or fetches general info, NOT a specific project
export const metadata: Metadata = {
  title: 'Our Works | Manic Agency Projects', // Title for the listing page
  description: 'Browse a collection of experimental projects from Manic Agency, exploring AI, creative coding, and more.', // Description for the listing page
  openGraph: {
      title: 'Our Works | Manic Agency Projects',
      description: 'Browse a collection of experimental projects.',
      url: '/projects', // Canonical URL for THIS page
      images: [
          {
              // Use a general OG image for the projects page
              url: '/images/og-projects-default.png', // **IMPORTANT**: Create this image or use a relevant one
              width: 1200,
              height: 630,
              alt: 'Manic Agency Projects Showcase',
          },
      ],
      type: 'website', // This page represents a collection
  },
  // Add other relevant static metadata
  // twitter: { ... },
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