// src/lib/getRelatedContent.ts
// Helper functions for cross-linking blog posts and projects

import "server-only";
import { getAllPosts } from './getAllPosts';
import { getAllProjects } from './getAllProjects';
import { BlogPost } from '@/types/blog';
import { Project } from '@/types/project';

/**
 * Get related blog posts for a project based on shared tags/category
 */
export function getRelatedPostsForProject(project: Project, limit = 3): BlogPost[] {
  const allPosts = getAllPosts().filter(p => !p.draft);
  const projectTags = new Set(project.tags?.map(t => t.toLowerCase()) || []);
  
  const scored = allPosts.map(post => {
    let score = 0;
    
    // Match tags
    const postTags = post.tags?.map(t => t.toLowerCase()) || [];
    score += postTags.filter(tag => projectTags.has(tag)).length * 3;
    
    // Match category keywords (e.g., "ai" project with "ai" in post tags)
    if (project.category && postTags.includes(project.category.toLowerCase())) {
      score += 2;
    }
    
    // Boost if post mentions project technologies
    const postContent = (post.content || '').toLowerCase();
    project.technologies?.forEach(tech => {
      if (postContent.includes(tech.toLowerCase())) score += 1;
    });
    
    return { post, score };
  });
  
  return scored
    .filter(s => s.score > 0)
    .sort((a, b) => b.score - a.score || new Date(b.post.date || 0).getTime() - new Date(a.post.date || 0).getTime())
    .slice(0, limit)
    .map(s => s.post);
}

/**
 * Get related projects for a blog post based on shared tags/keywords
 */
export function getRelatedProjectsForPost(post: BlogPost, limit = 3): Project[] {
  const allProjects = getAllProjects().filter(p => !p.draft);
  const postTags = new Set(post.tags?.map(t => t.toLowerCase()) || []);
  
  const scored = allProjects.map(project => {
    let score = 0;
    
    // Match tags
    const projectTags = project.tags?.map(t => t.toLowerCase()) || [];
    score += projectTags.filter(tag => postTags.has(tag)).length * 3;
    
    // Match category
    if (post.category && project.category === post.category) {
      score += 2;
    }
    
    // Boost if post content mentions project name
    const postContent = (post.content || '').toLowerCase();
    if (postContent.includes(project.title.toLowerCase())) {
      score += 5;
    }
    
    return { project, score };
  });
  
  return scored
    .filter(s => s.score > 0)
    .sort((a, b) => b.score - a.score || new Date(b.project.date || 0).getTime() - new Date(a.project.date || 0).getTime())
    .slice(0, limit)
    .map(s => s.project);
}

