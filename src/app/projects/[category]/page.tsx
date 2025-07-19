// src/app/projects/[category]/page.tsx

import React from 'react';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import { getAllProjects, getProjectsByCategory } from '@/lib/getAllProjects';
import { Project } from '@/types/project';
import ProjectCategoryClient from './ProjectCategoryClient';

// Interface for the props this page component receives
interface ProjectCategoryPageProps {
    params: {
        category: string;
    };
}

// Optional: generateStaticParams to pre-build pages
export async function generateStaticParams() {
    const projects = getAllProjects();
    const categories = new Set(projects.map(p => p.category).filter(Boolean));
    return Array.from(categories).map(category => ({
        category: category,
    }));
}

// Optional: generateMetadata
export async function generateMetadata({ params }: ProjectCategoryPageProps): Promise<Metadata> {
    const categoryName = params.category.replace(/-/g, ' ');
    return {
        title: `Projects: ${categoryName}`,
        description: `View projects in the ${categoryName} category.`,
    };
}

// Main Page Component (Server Component)
export default async function ProjectCategoryPage({ params }: ProjectCategoryPageProps) {
    const { category } = params;
    
    // Fetch data inside the page component using the category from params
    const projectsInCategory: Project[] = await getProjectsByCategory(category);

    if (!projectsInCategory || projectsInCategory.length === 0) {
        console.warn(`No projects found for category: ${category}`);
    }

    // Pass data to client component
    return (
        <ProjectCategoryClient 
            category={category}
            projects={projectsInCategory}
        />
    );
}