// src/app/projects/page.tsx (or appropriate path)
// NO "use client" - This page fetches data and should be a Server Component

import React from 'react';
import { Nav } from '@/components/Nav'; // Nav must be "use client" in its own file
import ProjectCarousel from '@/components/Project/ProjectCarousel'; // Must be "use client" if interactive
import ProjectGrid from '@/components/Project/ProjectGrid'; // Must be "use client" if interactive
import { getFeaturedProjects, getAllProjects, getProjectCategories } from '@/lib/getAllProjects'; // Import project fetching functions
import { Project } from '@/types/project'; // Import project type

// This is a Server Component by default
export default function ProjectsPage() {

    // Fetch data DIRECTLY within the Server Component
    let allProjects: Project[] = [];
    let featuredProjects: Project[] = [];
    let categories: string[] = [];

    try {
        allProjects = getAllProjects();
        featuredProjects = getFeaturedProjects(3); // Assuming this function exists and works
        categories = getProjectCategories();     // Assuming this function exists and works
    } catch (error) {
        console.error("Error fetching projects for page:", error);
        // Handle error state appropriately, maybe render an error message
        // Or return minimal data:
        // allProjects = [];
        // featuredProjects = [];
        // categories = [];
        // Consider throwing error to trigger error boundary if needed
    }

    // Check if data fetching failed or returned empty
    const hasFeatured = featuredProjects && featuredProjects.length > 0;
    const hasProjects = allProjects && allProjects.length > 0;

    return (
        <>
            {/* Header section - Components inside MUST be client components if they use hooks */}
            <div className="bg-bg-primary relative"> {/* Added relative */}
                <Nav />
            </div>

            <main className="bg-bg-primary text-text-primary min-h-screen">
                {/* Hero section */}
                <section className="py-16 md:py-24">
                    <div className="container mx-auto max-w-7xl px-4 sm:px-6">
                        <div className="text-center max-w-3xl mx-auto">
                            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 relative inline-block">
                                <span className="relative z-10">Our Work</span>
                                <span className="absolute -bottom-2 left-0 w-full h-3 bg-accent-primary opacity-20 rounded"></span>
                            </h1>
                            <p className="text-lg md:text-xl text-text-secondary mb-12">
                                Experimental projects combining AI, creative coding, and emerging technologies, all housed under the Manic Agency umbrella
                            </p>
                        </div>

                        {/* Featured Projects Carousel */}
                        {hasFeatured ? (
                            <div className="mb-24">
                                <h2 className="text-2xl md:text-3xl font-bold mb-8 text-center">
                                    Featured Projects
                                </h2>
                                {/* ProjectCarousel MUST be "use client" in its own file */}
                                <ProjectCarousel projects={featuredProjects} />
                            </div>
                        ) : (
                           <p className="text-center text-gray-500 mb-16">No featured projects to display.</p>
                        )}

                        {/* All Projects Grid */}
                        {hasProjects ? (
                            <div>
                                <h2 className="text-2xl md:text-3xl font-bold mb-8 text-center">
                                    Explore All Projects
                                </h2>
                                {/* ProjectGrid MUST be "use client" in its own file */}
                                <ProjectGrid projects={allProjects} categories={categories} />
                            </div>
                        ) : (
                            <p className="text-center text-gray-500">No projects found.</p>
                        )}
                    </div>
                </section>
            </main>
        </>
    );
}