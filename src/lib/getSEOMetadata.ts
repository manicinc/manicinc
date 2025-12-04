// src/lib/getSEOMetadata.ts
import { Metadata } from 'next';

// Constants for your site
const SITE_NAME = 'Manic Agency';
const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://manic.agency';
const TWITTER_HANDLE = '@manicagency';

// SEO configuration for different sections
const seoConfig = {
  default: {
    title: 'Manic Agency - AI Agency Los Angeles',
    description: 'Manic Agency is a Los Angeles-based AI agency specializing in AI automation, Web3 development, AR/VR experiences, and metaverse solutions. We build intelligent systems that transform businesses.',
    keywords: ['AI agency Los Angeles', 'AI automation agency', 'Web3 development', 'AR VR development', 'metaverse development', 'AI consulting', 'machine learning agency', 'generative AI', 'Los Angeles tech agency', 'blockchain development', 'creative technology', 'digital transformation', 'AI implementation', 'business automation', 'immersive experiences'],
    ogImage: '/og-default.webp',
    themeColor: {
      light: '#fbf6ef', // Light Parchment - Primary light background
      dark: '#22182b' // Dark Background - Primary dark background
    }
  },
  blog: {
    title: 'Chronicles from the Looking-Glass | AI & Tech Insights',
    description: 'Expert insights on AI development, automation, Web3, and emerging technology from Manic Agency. Practical guides and thought leadership for tech innovators.',
    keywords: ['AI blog', 'AI development insights', 'Web3 tutorials', 'machine learning guides', 'automation articles', 'tech innovation blog', 'AI agency insights', 'developer tutorials', 'emerging technology'],
    ogImage: '/og-blog.png',
    themeColor: {
      light: '#f5ede1', // Light Paper - Secondary light background for blog
      dark: '#402e46' // Mid Background - Secondary dark background for blog
    }
  },
  projects: {
    title: 'Our Works | AI & Web3 Projects',
    description: 'Explore our portfolio of AI implementations, Web3 applications, AR/VR experiences, and automation solutions. Case studies from a leading Los Angeles AI agency.',
    keywords: ['AI projects', 'Web3 portfolio', 'AR VR case studies', 'AI implementation examples', 'automation projects', 'machine learning applications', 'metaverse projects', 'AI agency portfolio'],
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