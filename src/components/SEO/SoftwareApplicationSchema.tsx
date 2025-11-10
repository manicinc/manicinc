// src/components/SEO/SoftwareApplicationSchema.tsx
"use client";

import React from 'react';
import { Project } from '@/types/project';

interface SoftwareApplicationSchemaProps {
  project: Project;
}

export default function SoftwareApplicationSchema({ project }: SoftwareApplicationSchemaProps) {
  // Only generate schema for software/tool projects
  const isSoftware = project.category === 'tools' || project.category === 'ai' || 
                     project.tags?.some(tag => ['open-source', 'oss', 'software', 'tool', 'library', 'framework'].includes(tag.toLowerCase()));
  
  if (!isSoftware) return null;

  const schema = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "name": project.title,
    "description": project.description,
    "url": project.link || `https://manic.agency/projects/${project.category}/${project.slug}`,
    "applicationCategory": project.category === 'ai' ? 'DeveloperApplication' : 'DesignApplication',
    "operatingSystem": "Cross-platform",
    "softwareVersion": "1.0",
    "datePublished": project.date,
    "dateModified": project.modifiedDate || project.date,
    "author": {
      "@type": "Organization",
      "name": project.team?.[0]?.name || "Manic Agency",
      "url": project.team?.[0]?.link || "https://manic.agency"
    },
    "publisher": {
      "@type": "Organization",
      "name": "Manic Agency",
      "url": "https://manic.agency"
    },
    "offers": project.link ? {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "USD"
    } : undefined,
    "screenshot": project.images?.[0] ? `https://manic.agency${project.images[0]}` : undefined,
    "codeRepository": project.github,
    "license": project.license || (project.tags?.includes('oss') || project.tags?.includes('open-source') ? 'https://opensource.org/licenses/MIT' : undefined),
    "programmingLanguage": project.languages || project.technologies,
    "keywords": project.tags?.join(', ')
  };

  // Remove undefined values
  Object.keys(schema).forEach(key => 
    schema[key as keyof typeof schema] === undefined && delete schema[key as keyof typeof schema]
  );

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

