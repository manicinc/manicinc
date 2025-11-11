// Lazy-loaded blog components for better performance
'use client';

import dynamic from 'next/dynamic';

// Lazy load the markdown renderer (includes syntax highlighting, math rendering, etc.)
export const LazyMarkdownRenderer = dynamic(
  () => import('@/components/MarkdownRenderer').then(mod => ({ default: mod.CustomMarkdownRenderer })),
  {
    loading: () => (
      <div className="prose dark:prose-invert max-w-none">
        <div className="animate-pulse space-y-4">
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full"></div>
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-5/6"></div>
        </div>
      </div>
    ),
    ssr: false,
  }
);

// Lazy load Giscus comments
export const LazyGiscusComments = dynamic(
  () => import('@/components/Blog/GiscusClient'),
  {
    loading: () => (
      <div className="mt-8 p-4 bg-gray-50 dark:bg-gray-900 rounded">
        <p className="text-gray-500">Loading comments...</p>
      </div>
    ),
    ssr: false,
  }
);

// Lazy load Disqus comments
export const LazyDisqusComments = dynamic(
  () => import('@/components/Blog/DisqusComments'),
  {
    loading: () => (
      <div className="mt-8 p-4 bg-gray-50 dark:bg-gray-900 rounded">
        <p className="text-gray-500">Loading comments...</p>
      </div>
    ),
    ssr: false,
  }
);

// Lazy load share buttons
export const LazyShareButtons = dynamic(
  () => import('@/components/ShareButtonsClient'),
  {
    loading: () => <div className="h-12 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />,
    ssr: false,
  }
);

// Lazy load related content
export const LazyRelatedContent = dynamic(
  () => import('@/components/RelatedContent'),
  {
    loading: () => (
      <div className="mt-12 space-y-4">
        <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/4"></div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-48 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
          ))}
        </div>
      </div>
    ),
    ssr: false,
  }
);

// Lazy load newsletter section
export const LazyBlogNewsletterSection = dynamic(
  () => import('@/components/BlogNewsletterSection'),
  {
    loading: () => <div className="h-64 bg-gray-200 dark:bg-gray-700 rounded animate-pulse mt-12" />,
    ssr: false,
  }
);
