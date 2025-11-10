// src/components/RelatedContent.tsx
"use client";

import React from 'react';
import Link from 'next/link';
import { BlogPost } from '@/types/blog';
import { Project } from '@/types/project';
import { ArrowRight } from 'lucide-react';

interface RelatedContentProps {
  posts?: BlogPost[];
  projects?: Project[];
  title?: string;
}

export default function RelatedContent({ posts, projects, title }: RelatedContentProps) {
  const hasPosts = posts && posts.length > 0;
  const hasProjects = projects && projects.length > 0;
  
  if (!hasPosts && !hasProjects) return null;

  return (
    <section className="related-content-section" style={{
      marginTop: '4rem',
      padding: '2rem',
      background: 'linear-gradient(135deg, rgba(var(--bg-secondary-rgb), 0.5), rgba(var(--bg-tertiary-rgb), 0.3))',
      borderRadius: 'var(--radius-md)',
      border: '1px solid rgba(var(--accent-primary-rgb), 0.2)'
    }}>
      <h3 style={{
        fontFamily: 'var(--font-display)',
        fontSize: '1.5rem',
        fontWeight: '700',
        color: 'var(--text-primary)',
        marginBottom: '1.5rem',
        textAlign: 'center'
      }}>
        {title || '// Related Content //'}
      </h3>
      
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
        gap: '1.5rem'
      }}>
        {hasPosts && posts.map(post => (
          <Link 
            key={post.slug}
            href={`/blog/${post.category}/${post.slug}`}
            style={{
              display: 'block',
              padding: '1.25rem',
              background: 'rgba(var(--bg-primary-rgb), 0.8)',
              border: '1px solid rgba(var(--accent-secondary-rgb), 0.3)',
              borderRadius: 'var(--radius-base)',
              textDecoration: 'none',
              transition: 'all 0.2s ease',
              position: 'relative'
            }}
            className="related-content-card"
          >
            <span style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '0.7rem',
              color: 'var(--accent-secondary)',
              textTransform: 'uppercase',
              letterSpacing: '0.05em'
            }}>
              Blog Post
            </span>
            <h4 style={{
              fontFamily: 'var(--font-display)',
              fontSize: '1rem',
              fontWeight: '600',
              color: 'var(--text-primary)',
              marginTop: '0.5rem',
              marginBottom: '0.5rem',
              lineHeight: '1.3'
            }}>
              {post.title}
            </h4>
            <p style={{
              fontSize: '0.85rem',
              color: 'var(--text-secondary)',
              lineHeight: '1.5',
              marginBottom: '0.75rem'
            }}>
              {post.excerpt?.slice(0, 100)}...
            </p>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              fontSize: '0.8rem',
              color: 'var(--accent-highlight)',
              fontWeight: '600'
            }}>
              Read more <ArrowRight size={14} />
            </div>
          </Link>
        ))}
        
        {hasProjects && projects.map(project => (
          <Link 
            key={project.slug}
            href={`/projects/${project.category}/${project.slug}`}
            style={{
              display: 'block',
              padding: '1.25rem',
              background: 'rgba(var(--bg-primary-rgb), 0.8)',
              border: '1px solid rgba(var(--accent-primary-rgb), 0.3)',
              borderRadius: 'var(--radius-base)',
              textDecoration: 'none',
              transition: 'all 0.2s ease',
              position: 'relative'
            }}
            className="related-content-card"
          >
            <span style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '0.7rem',
              color: 'var(--accent-primary)',
              textTransform: 'uppercase',
              letterSpacing: '0.05em'
            }}>
              Project
            </span>
            <h4 style={{
              fontFamily: 'var(--font-display)',
              fontSize: '1rem',
              fontWeight: '600',
              color: 'var(--text-primary)',
              marginTop: '0.5rem',
              marginBottom: '0.5rem',
              lineHeight: '1.3'
            }}>
              {project.title}
            </h4>
            <p style={{
              fontSize: '0.85rem',
              color: 'var(--text-secondary)',
              lineHeight: '1.5',
              marginBottom: '0.75rem'
            }}>
              {project.description?.slice(0, 100)}...
            </p>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              fontSize: '0.8rem',
              color: 'var(--accent-highlight)',
              fontWeight: '600'
            }}>
              View project <ArrowRight size={14} />
            </div>
          </Link>
        ))}
      </div>
      
      <style jsx>{`
        .related-content-card:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(var(--shadow-color), 0.15);
          border-color: var(--accent-highlight);
        }
      `}</style>
    </section>
  );
}

