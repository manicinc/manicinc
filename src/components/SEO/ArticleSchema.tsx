// src/components/SEO/ArticleSchema.tsx
"use client";

import { BlogPostExtended } from '@/types/blog';

interface ArticleSchemaProps {
  post: BlogPostExtended;
  url: string;
}

export default function ArticleSchema({ post, url }: ArticleSchemaProps) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": post.title,
    "description": post.excerpt || post.description,
    "image": post.image ? `https://manic.agency${post.image}` : undefined,
    "datePublished": post.date ? new Date(post.date).toISOString() : undefined,
    "dateModified": post.lastModified ? new Date(post.lastModified).toISOString() : post.date ? new Date(post.date).toISOString() : undefined,
    "author": {
      "@type": "Person",
      "name": post.author?.name || "Manic Agency",
      "url": post.author?.githubUsername ? `https://github.com/${post.author.githubUsername}` : "https://manic.agency/team"
    },
    "publisher": {
      "@type": "Organization",
      "name": "Manic Agency",
      "logo": {
        "@type": "ImageObject",
        "url": "https://manic.agency/manic-logo.png"
      }
    },
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": `https://manic.agency${url}`
    },
    "articleSection": post.category?.replace(/-/g, ' '),
    "keywords": post.tags?.join(', '),
    "wordCount": post.content ? post.content.split(/\s+/).length : undefined,
    "timeRequired": post.readingTime ? `PT${post.readingTime}M` : undefined,
    "inLanguage": "en-US",
    "isAccessibleForFree": true,
    "license": "https://creativecommons.org/licenses/by/4.0/"
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

