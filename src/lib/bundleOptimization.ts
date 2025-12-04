// Bundle optimization utilities for reducing JavaScript payload

/**
 * Dynamic import wrapper for heavy components
 * Only loads component when actually needed
 */
export async function lazyLoadComponent<T>(
  componentPath: string
): Promise<T> {
  const module = await import(componentPath);
  return module.default || module;
}

/**
 * Code splitting boundaries for major features
 */
export const codeSplitPoints = {
  // Heavy third-party libraries
  emailjs: () => import('@emailjs/browser'),
  giscus: () => import('@giscus/react'),
  syntaxHighlighter: () => import('react-syntax-highlighter'),
  framerMotion: () => import('framer-motion'),
  swiper: () => import('swiper'),
  embla: () => import('embla-carousel-react'),

  // Heavy components
  markdownRenderer: () => import('@/components/MarkdownRenderer'),
  emblaCarousel: () => import('@/components/EmblaCarousel'),
  projectCarousel: () => import('@/components/Project/ProjectCarousel'),
  analytics: () => import('@/components/Analytics'),
  giscusClient: () => import('@/components/Blog/GiscusClient'),
};

/**
 * Remove unused polyfills for modern browsers
 */
export const modernBrowserConfig = {
  targets: {
    chrome: '90',
    firefox: '88',
    safari: '14',
    edge: '90',
  },
  exclude: [
    // Exclude polyfills for features supported in target browsers
    'es.array.at',
    'es.array.flat',
    'es.array.flat-map',
    'es.object.entries',
    'es.object.from-entries',
    'es.object.has-own',
    'es.string.trim-end',
    'es.string.trim-start',
  ],
};

/**
 * Tree shaking configuration for removing unused exports
 */
export const treeShakingConfig = {
  // Mark these packages as side-effect free
  sideEffectFreePackages: [
    'clsx',
    'tailwind-merge',
    'date-fns',
    'lucide-react',
  ],

  // Unused exports to remove
  unusedExports: {
    'framer-motion': ['AnimateSharedLayout', 'MotionConfig'],
    'react-markdown': ['uriTransformer', 'transformLinkUri'],
  },
};

/**
 * Optimize imports by replacing with lighter alternatives
 */
export const importOptimizations = {
  // Replace heavy date library imports
  'moment': 'date-fns',
  'moment-timezone': 'date-fns-tz',

  // Replace lodash with native alternatives
  'lodash/debounce': 'utils/debounce',
  'lodash/throttle': 'utils/throttle',
  'lodash/merge': 'utils/merge',
};

/**
 * Chunk splitting strategy for optimal caching
 */
export const chunkStrategy = {
  // Vendor chunks (rarely change)
  vendor: {
    test: /[\\/]node_modules[\\/]/,
    name: 'vendor',
    priority: 10,
    reuseExistingChunk: true,
  },

  // React and related (stable)
  react: {
    test: /[\\/]node_modules[\\/](react|react-dom|scheduler)[\\/]/,
    name: 'react',
    priority: 20,
    reuseExistingChunk: true,
  },

  // UI libraries (semi-stable)
  ui: {
    test: /[\\/]node_modules[\\/](@radix-ui|framer-motion|tailwind)[\\/]/,
    name: 'ui',
    priority: 15,
    reuseExistingChunk: true,
  },

  // Common components (change occasionally)
  common: {
    minChunks: 2,
    priority: 5,
    reuseExistingChunk: true,
  },
};

/**
 * Preload critical chunks
 */
export const criticalChunks = [
  'react',
  'vendor',
  'ui',
  'main',
];

/**
 * Prefetch non-critical but likely needed chunks
 */
export const prefetchChunks = [
  'analytics',
  'newsletter',
  'comments',
];

export default {
  lazyLoadComponent,
  codeSplitPoints,
  modernBrowserConfig,
  treeShakingConfig,
  importOptimizations,
  chunkStrategy,
  criticalChunks,
  prefetchChunks,
};