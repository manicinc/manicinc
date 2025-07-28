// src/lib/getSEOMetadata.ts
import { Metadata } from 'next';

// Constants for your site
const SITE_NAME = 'Manic Agency';
const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://manic.agency';
const TWITTER_HANDLE = '@manicagency';

// SEO configuration for different sections
const seoConfig = {
  default: {
    title: 'Manic Agency - Metaverses Intersection',
    description: 'Manic Agency - Where Metaverses Intersect. Manic.agency specializes in Web3, AI, AR/VR, creative technology, and game publishing through Manic Games platform. Based internationally in LA and Lagos.',
    keywords: ['Manic', 'Agency', 'Manic Agency', 'Manic.agency', 'Web Development', 'Design', 'AR', 'VR', 'AI', 'Web3', 'Digital Agency', 'Los Angeles', 'Lagos', 'Creative Technology', 'SynthStack', 'Manic Inc', 'Game Publishing', 'Manic Games', 'Text Games', 'Game Development', 'Publishing Platform'],
    ogImage: '/og-default.webp',
    themeColor: {
      light: '#fbf6ef', // Light Parchment - Primary light background
      dark: '#22182b' // Dark Background - Primary dark background
    }
  },
  blog: {
    title: 'Chronicles from the Looking-Glass',
    description: 'Dispatches, discoveries, and coded Visions from the Synthetic Publishing Platform powered by Manic Agency.',
    keywords: ['Blog', 'AI', 'Tech', 'Web Development', 'Thinkpieces', 'Looking Glass', 'Innovation'],
    ogImage: '/og-blog.png',
    themeColor: {
      light: '#f5ede1', // Light Paper - Secondary light background for blog
      dark: '#402e46' // Mid Background - Secondary dark background for blog
    }
  },
  projects: {
    title: 'Our Works',
    description: 'Browse a collection of experimental projects from Manic Agency, exploring AI, creative coding, and more.',
    keywords: ['Projects', 'Portfolio', 'Experiments', 'Creative Coding', 'Innovative Tech', 'Case Studies'],
    ogImage: '/og-projects.png',
    themeColor: {
      light: '#ede4d6', // Light Cream - Tertiary light background for projects
      dark: '#5f4867' // Light Background - Tertiary dark background for projects
    }
  }
};

/**
 * Determine the section from a pathname
 */
function getSectionFromPath(pathname: string): 'blog' | 'projects' | 'default' {
  if (pathname.startsWith('/blog')) return 'blog';
  if (pathname.startsWith('/projects')) return 'projects';
  return 'default';
}

/**
 * Get basic section-specific SEO config
 */
export function getSectionConfig(pathname: string) {
  const section = getSectionFromPath(pathname);
  return seoConfig[section];
}

/**
 * Generate dynamic metadata based on the page and any custom overrides
 */
export function generateSEOMetadata(
  pathname: string,
  pageTitle?: string,
  customMetadata: Partial<Metadata> = {}
): Metadata {
  const section = getSectionFromPath(pathname);
  const config = seoConfig[section];
  
  // Format title with section name if provided
  const title = pageTitle 
    ? `${pageTitle} | ${config.title}` 
    : config.title;
    
  // Base metadata
  const metadata: Metadata = {
    metadataBase: new URL(BASE_URL),
    title: {
      template: `%s | ${config.title}`,
      default: title,
    },
    description: config.description,
    keywords: config.keywords,
    authors: [{ name: 'Manic Inc', url: BASE_URL }],
    creator: 'Manic Inc',
    publisher: 'Manic Inc',
    formatDetection: { email: false, address: false, telephone: false },
    openGraph: {
      title: {
        template: `%s | ${config.title}`,
        default: title,
      },
      description: config.description,
      url: pathname,
      siteName: SITE_NAME,
      images: [{ 
        url: config.ogImage, 
        width: 1200, 
        height: 630, 
        alt: `${title} - ${SITE_NAME}` 
      }],
      locale: 'en_US',
      type: section === 'blog' ? 'article' : 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: {
        template: `%s | ${config.title}`,
        default: title,
      },
      description: config.description,
      site: TWITTER_HANDLE,
      creator: TWITTER_HANDLE,
      images: [config.ogImage],
    },
    // Note: viewport and themeColor should be exported separately from pages, not in metadata
    // Default icons (will be dynamically updated by the DynamicFavicon component)
    icons: {
      icon: '/favicon.ico',
      shortcut: '/favicon-16x16.png',
      apple: '/apple-touch-icon.png',
    },
  };
  
  // Merge with custom metadata - with proper type checking
  const result: Metadata = {
    ...metadata
  };
  
  // Apply customMetadata one by one to avoid spread type errors
  if (customMetadata.title) result.title = customMetadata.title;
  if (customMetadata.description) result.description = customMetadata.description;
  if (customMetadata.keywords) result.keywords = customMetadata.keywords;
  
  // For objects, merge correctly
  if (customMetadata.openGraph && metadata.openGraph) {
    result.openGraph = {
      ...metadata.openGraph
    };
    // Apply custom OpenGraph properties
    Object.keys(customMetadata.openGraph).forEach(key => {
      if (result.openGraph && customMetadata.openGraph) {
        // @ts-ignore - This is safe as we're iterating over keys that exist
        result.openGraph[key] = customMetadata.openGraph[key];
      }
    });
  }
  
  // Same for Twitter
  if (customMetadata.twitter && metadata.twitter) {
    result.twitter = {
      ...metadata.twitter
    };
    Object.keys(customMetadata.twitter).forEach(key => {
      if (result.twitter && customMetadata.twitter) {
        // @ts-ignore - This is safe as we're iterating over keys that exist
        result.twitter[key] = customMetadata.twitter[key];
      }
    });
  }
  
  // And other objects
  if (customMetadata.icons) result.icons = customMetadata.icons;
  
  return result;
}