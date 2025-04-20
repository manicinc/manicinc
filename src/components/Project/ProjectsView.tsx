// src/components/ProjectsView.tsx
// V3 - Incorporating Compression

"use client";

import React from 'react';
import ProjectGrid from '@/components/Project/ProjectGrid'; // Ensure path is correct
import ProjectCarousel from '@/components/Project/ProjectCarousel'; // Ensure path is correct
import { Project } from '@/types/project'; // Ensure path is correct
import { OrnateDividerSVG, AbstractNetworkSVG } from '@/components/Icons'; // Ensure path is correct
// import { Nav } from '@/components/Nav'; // Uncomment if needed

interface ProjectsViewProps {
    allProjects: Project[];
    featuredProjects: Project[];
    categories: string[];
}

export default function ProjectsView({
    allProjects = [],
    featuredProjects = [],
    categories = []
}: ProjectsViewProps) {

    const hasFeatured = featuredProjects && featuredProjects.length > 0;
    const hasProjects = allProjects && allProjects.length > 0;

    return (
        <>
            {/* Optional Navigation */}
            {/* <div className="nav-wrapper"><Nav /></div> */}

            <main className="projects-page-wrapper">

                {/* Background elements */}
                <div className="fixed-bg-elements">
                    {/* <AbstractNetworkSVG className="bg-svg-1"/> */}
                    <div className="bg-glow glow-1"></div>
                    <div className="bg-glow glow-2"></div>
                    <div className="noise-overlay-page"></div>
                </div>

                {/* Hero section */}
                <section className="projects-hero-section">
                    <div className="container mx-auto max-w-4xl px-4 sm:px-6 relative z-10">
                        <div className="text-center">
                            <h1 className="projects-title project-header-glitch text-shadow-glow">
                                Our Works<span className="accent-dot">.</span>
                            </h1>
                            {/* <p className="projects-subtitle projects-subtitle-glitch" data-text="Experimental projects combining AI, creative coding, and emerging technologies"> */}
                                {/* Experimental projects combining AI, creative coding, and emerging technologies */}
                            {/* </p> */}
                        </div>
                    </div>
                </section>

                <OrnateDividerSVG className="divider-color"/>

                {/* Featured Projects Carousel Section */}
                {hasFeatured ? (
                    <section className="featured-projects-section">
                        <div className="container mx-auto max-w-[800px] px-4 sm:px-6"> {/* Reduced max-width */}
                            <h2 className="section-title featured-title text-shadow-glow">
                                <span>// Featured Transmissions //</span>
                            </h2>
                            <ProjectCarousel projects={featuredProjects} />
                        </div>
                    </section>
                ) : (
                    <p className="no-items-notice">/// No featured transmissions detected ///</p>
                )}

                <OrnateDividerSVG className="divider-color"/>

                {/* All Projects Grid Section */}
                {hasProjects ? (
                    <section className="all-projects-section">
                        <div className="container mx-auto max-w-7xl px-4 sm:px-6">
                            <h2 className="section-title all-projects-title text-shadow-glow">
                                // Declassified Records //
                            </h2>
                            <ProjectGrid projects={allProjects} categories={categories} />
                        </div>
                    </section>
                ) : (
                     <p className="no-items-notice">/// Project Archives Empty ///</p>
                )}

                {/* Reduced bottom padding */}
                <div className="pb-8 md:pb-12"></div>

            </main>

            {/* Global Styles specific to this page view */}
            <style jsx global>{`
             
            `}</style>
        </>
    );
}