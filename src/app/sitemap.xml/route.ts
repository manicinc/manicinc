// src/app/sitemap.xml/route.ts
import { getAllPosts } from '@/lib/getAllPosts';
import { getAllProjects } from '@/lib/getAllProjects';
import { BlogPost } from '@/types/blog';
import { Project } from '@/types/project';

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://manic.agency';

function formatDate(date: string) {
  return date ? new Date(date).toISOString() : new Date().toISOString();
}

export async function GET() {
  // Get all content
  const allPosts: BlogPost[] = getAllPosts();
  const allProjects: Project[] = getAllProjects();

  // Static routes
  const staticRoutes = [
    {
      url: `${BASE_URL}/`,
      lastModified: new Date().toISOString(),
      changeFrequency: 'monthly',
      priority: 1.0,
    },
    {
      url: `${BASE_URL}/blog`,
      lastModified: new Date().toISOString(),
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: `${BASE_URL}/projects`,
      lastModified: new Date().toISOString(),
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: `${BASE_URL}/open-source`,
      lastModified: new Date().toISOString(),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${BASE_URL}/team`,
      lastModified: new Date().toISOString(),
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${BASE_URL}/mission`,
      lastModified: new Date().toISOString(),
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${BASE_URL}/process`,
      lastModified: new Date().toISOString(),
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${BASE_URL}/contact`,
      lastModified: new Date().toISOString(),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${BASE_URL}/privacy`,
      lastModified: new Date().toISOString(),
      changeFrequency: 'yearly',
      priority: 0.3,
    },
    {
      url: `${BASE_URL}/sitemap`,
      lastModified: new Date().toISOString(),
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${BASE_URL}/terms`,
      lastModified: new Date().toISOString(),
      changeFrequency: 'yearly',
      priority: 0.3,
    },

    // External link to games platform (for reference, not included in sitemap)
    // games.manic.agency will have its own sitemap
  ];

  // Extract categories for blog and projects
  const blogCategoriesSet = new Set<string>();
  allPosts.forEach(post => {
    if (post.category) blogCategoriesSet.add(post.category);
  });

  // Fix: Create a proper projectCategoriesSet
  const projectCategoriesSet = new Set<string>();
  allProjects.forEach(project => {
    if (project.category) projectCategoriesSet.add(project.category);
  });

  // Generate route for each category
  const categoryRoutes = Array.from(blogCategoriesSet).map(category => ({
    url: `${BASE_URL}/blog/${category}`,
    lastModified: new Date().toISOString(),
    changeFrequency: 'weekly',
    priority: 0.8,
  }));

  // Fix: Add project category routes
  const projectCategoryRoutes = Array.from(projectCategoriesSet).map((category: string) => ({
    url: `${BASE_URL}/projects/${category}`,
    lastModified: new Date().toISOString(),
    changeFrequency: 'weekly',
    priority: 0.8,
  }));

  // Generate routes for each blog post
  const blogRoutes = allPosts
    .filter(post => !post.draft)
    .map(post => ({
      url: `${BASE_URL}/blog/${post.category || 'uncategorized'}/${post.slug}`,
      lastModified: post.lastModified || post.date || new Date().toISOString(),
      changeFrequency: 'monthly',
      priority: 0.7,
    }));

  // Generate routes for each project
  const projectRoutes = allProjects
    .filter(project => !project.draft)
    .map(project => ({
      url: `${BASE_URL}/projects/${project.category}/${project.slug}`,
      lastModified: project.modifiedDate || project.date || new Date().toISOString(),
      changeFrequency: 'monthly',
      priority: 0.7,
    }));

  // Combine all routes
  const routes = [
    ...staticRoutes,
    ...categoryRoutes,
    ...projectCategoryRoutes,
    ...blogRoutes,
    ...projectRoutes,
  ];

  // Generate XML
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  ${routes.map(route => `
  <url>
    <loc>${route.url}</loc>
    <lastmod>${route.lastModified}</lastmod>
    <changefreq>${route.changeFrequency}</changefreq>
    <priority>${route.priority}</priority>
  </url>
  `).join('')}
</urlset>`;

  return new Response(xml, {
    headers: {
      'Content-Type': 'application/xml',
      'Cache-Control': 'public, max-age=3600',
    },
  });
}