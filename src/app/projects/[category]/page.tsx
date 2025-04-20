// src/app/projects/[category]/page.tsx

import React from 'react';
import { notFound } from 'next/navigation';
import { Metadata } from 'next'; // If using metadata
import { getAllProjects, getProjectsByCategory } from '@/lib/getAllProjects'; // Adjust import paths
import { Project } from '@/types/project'; // Import your Project type
// import ProjectListClient from './ProjectListClient'; // Example client component if needed

// Interface for the props THIS page component receives
interface ProjectCategoryPageProps {
    params: {
        category: string; // The dynamic segment from the URL
    };
    // searchParams?: { [key: string]: string | string[] | undefined }; // Optional search params
}

// --- Optional: generateStaticParams to pre-build pages ---
export async function generateStaticParams() {
    const projects = getAllProjects(); // Or get unique categories another way
    const categories = new Set(projects.map(p => p.category).filter(Boolean));
    return Array.from(categories).map(category => ({
        category: category,
    }));
}

// --- Optional: generateMetadata ---
export async function generateMetadata({ params }: ProjectCategoryPageProps): Promise<Metadata> {
     const categoryName = params.category.replace(/-/g, ' '); // Format for title
     // Fetch category-specific data if needed for metadata
     return {
         title: `Projects: ${categoryName}`,
         description: `View projects in the ${categoryName} category.`,
         // ... other metadata
     };
}

// --- Default Export: The Page Component ---
// Accepts ONLY params (and optionally searchParams)
export default async function ProjectCategoryPage({ params }: ProjectCategoryPageProps) {
    const { category } = params;

    // Fetch data INSIDE the page component using the category from params
    const projectsInCategory: Project[] = await getProjectsByCategory(category); // Adjust fetch function

    if (!projectsInCategory || projectsInCategory.length === 0) {
        // Handle case where category is valid but has no projects,
        // or return notFound() if the category itself is invalid.
        // notFound(); // Use this if an invalid category slug should 404
        console.warn(`No projects found for category: ${category}`);
    }

    return (
        <div className="projects-category-page"> {/* Add appropriate styling */}
            <header>
                {/* Use a more descriptive title if needed */}
                <h1>Projects: {category.replace(/-/g, ' ')}</h1>
            </header>
            <main>
                {/* Render the projects directly or pass to a Client Component */}
                {projectsInCategory.length > 0 ? (
                     // Option 1: Render directly if simple enough
                    <ul>
                        {projectsInCategory.map(project => (
                            <li key={project.slug}>
                                {/* Link to the specific project page */}
                                <a href={`/projects/${category}/${project.slug}`}>{project.title}</a>
                                <p>{project.description}</p>
                            </li>
                        ))}
                    </ul>

                    // Option 2: Pass fetched data to a Client Component for complex UI/filtering
                    // <ProjectListClient initialProjects={projectsInCategory} />

                ) : (
                    <p>No projects found in this category yet.</p>
                )}
            </main>
        </div>
    );
}