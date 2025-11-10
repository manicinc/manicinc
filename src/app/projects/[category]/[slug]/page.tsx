// src/app/projects/[category]/[slug]/page.tsx
// V4 - CORRECTED: Server Component fetches data, passes to Client Component

import React from 'react';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import { Project, TableOfContentsItem } from '@/types/project'; // Use updated type
import ProjectDetailClient from '@/components/Project/ProjectDetailClient'; // Import the Client Component
import BreadcrumbSchema from '@/components/SEO/BreadcrumbSchema'; // Breadcrumb structured data

// Import your actual data fetching functions from lib
import { getProjectBySlug, getAllProjectPaths, getRelatedProjects } from '@/lib/getAllProjects';
// NOTE: Assumes getProjectBySlug now correctly returns ProjectWithToc (includes TOC)
// based on the getAllProjects.ts code you provided.

interface PageProps {
  params: {
    category: string;
    slug: string;
  };
}

// --- SEO Metadata Generation ---
// (Using the function you provided, assuming getProjectBySlug works)
export async function generateMetadata(
  { params }: PageProps
): Promise<Metadata> {
  const project = await getProjectBySlug(params.category, params.slug); // Fetch data needed for metadata

  if (!project) {
      // Optionally set metadata for not found page or redirect
      return { title: 'Project Not Found' };
  }

  const title = `${project.title} | Project Details`;
  const description = project.description || `Details for the project "${project.title}".`;
  // Ensure absolute URL for images - IMPORTANT for OG tags
  const imageUrl = project.image || (project.images && project.images[0]) || '/default-og-image.png'; // Add a default OG image path
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://your-domain.com'; // Replace with your actual site URL
  const absoluteImageUrl = imageUrl.startsWith('http') ? imageUrl : `${siteUrl}${imageUrl.startsWith('/') ? '' : '/'}${imageUrl}`;
  const pageUrl = `${siteUrl}/projects/${params.category}/${params.slug}`;

  return {
    title,
    description,
    keywords: project.tags ?? [],
    authors: project.team?.map((person) => ({ name: person.name, url: person.link })) ?? [{name: 'Your Agency Name'}], // Set a default author
    alternates: {
      canonical: pageUrl,
    },
    openGraph: {
      title,
      description,
      url: pageUrl,
      siteName: 'Your Agency Name', // Set your site name
      images: [{ url: absoluteImageUrl, width: 1200, height: 630, alt: title }],
      type: 'article',
      publishedTime: project.date ? new Date(project.date).toISOString() : undefined,
      modifiedTime: project.modifiedDate ? new Date(project.modifiedDate).toISOString() : undefined,
      section: project.category,
      tags: project.tags,
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [absoluteImageUrl],
      // creator: '@YourTwitterHandle', // Add your Twitter handle
    },
  };
}

// --- Static Param Generation ---
// (Using the function you provided)
export async function generateStaticParams() {
  // Make sure getAllProjectPaths is async if it needs to be
  const paths = await getAllProjectPaths();
  return paths;
}


// --- Page Component (Server Component) ---
export default async function ProjectDetailPage({ params }: PageProps) {
  // Fetch the specific project data (including TOC via your helper)
  const project = await getProjectBySlug(params.category, params.slug);

  // Handle project not found
  if (!project) {
    notFound();
  }

  // Fetch related projects
  // Ensure getRelatedProjects correctly uses the fetched 'project' object
  const related = project ? await getRelatedProjects(project) : [];

  // **CRITICAL FIX:**
  // REMOVE all direct rendering JSX from here.
  // INSTEAD, render the Client Component and pass data as props.
  return (
    <>
      {/* Breadcrumb structured data for SEO */}
      <BreadcrumbSchema items={[
        { name: 'Home', url: '/' },
        { name: 'Projects', url: '/projects' },
        { name: project.category?.replace(/-/g, ' ') || 'Category', url: `/projects/${project.category}` },
        { name: project.title || 'Project', url: `/projects/${params.category}/${params.slug}` }
      ]} />
      
      <ProjectDetailClient
        project={project} // Pass the full project object (which includes TOC)
        relatedProjects={related}
        // No need to pass toc separately if it's embedded in project by getProjectBySlug
      />
    </>
  );
}