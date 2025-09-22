// Performance optimization configuration

export const performanceConfig = {
  // Critical CSS inline limit (in KB)
  criticalCSSLimit: 14,

  // Image optimization settings
  images: {
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    formats: ['image/avif', 'image/webp'],
    minimumCacheTTL: 31536000, // 1 year
    dangerouslyAllowSVG: false,
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
    quality: 75,
  },

  // Font optimization
  fonts: {
    preload: [
      '/fonts/Mona-Sans.var.woff2',
    ],
    display: 'swap',
    adjustFontFallback: true,
  },

  // Bundle optimization
  bundle: {
    // Packages to optimize imports
    optimizePackageImports: [
      '@radix-ui/react-slot',
      'react-icons',
      'lucide-react',
      'framer-motion',
      'react-markdown',
      '@emailjs/browser',
      '@giscus/react',
      'swiper',
      'embla-carousel-react',
      'react-intersection-observer',
      'prismjs',
      'react-syntax-highlighter',
    ],
    // External packages (not bundled)
    externals: [],
    // Modules to transpile
    transpilePackages: [],
  },

  // Preconnect domains
  preconnect: [
    'https://fonts.googleapis.com',
    'https://fonts.gstatic.com',
  ],

  // DNS prefetch domains
  dnsPrefetch: [
    'https://www.googletagmanager.com',
    'https://www.google-analytics.com',
    'https://www.clarity.ms',
    'https://eocampaign1.com',
    'https://cdn.sender.net',
    'https://api.github.com',
  ],

  // Cache control headers (in seconds)
  caching: {
    static: 31536000, // 1 year for static assets
    images: 31536000, // 1 year for images
    fonts: 31536000, // 1 year for fonts
    html: 3600, // 1 hour for HTML
    api: 0, // No cache for API routes
  },

  // Compression settings
  compression: {
    brotli: true,
    gzip: true,
    threshold: 1024, // Minimum size in bytes to compress
  },

  // Security headers
  security: {
    contentSecurityPolicy: {
      'default-src': ["'self'"],
      'script-src': [
        "'self'",
        "'unsafe-inline'",
        "'unsafe-eval'",
        'https://www.googletagmanager.com',
        'https://www.google.com',
        'https://www.gstatic.com',
        'https://www.clarity.ms',
        'https://*.clarity.ms',
        'https://cdn.sender.net',
        'https://eocampaign1.com',
      ],
      'style-src': [
        "'self'",
        "'unsafe-inline'",
        'https://fonts.googleapis.com',
        'https://cdn.sender.net',
      ],
      'img-src': [
        "'self'",
        'data:',
        'https:',
        'blob:',
      ],
      'font-src': [
        "'self'",
        'https://fonts.gstatic.com',
        'https://cdn.sender.net',
      ],
      'connect-src': [
        "'self'",
        'https://www.google-analytics.com',
        'https://api.github.com',
        'https://cdn.sender.net',
        'https://eocampaign1.com',
      ],
      'frame-src': [
        "'self'",
        'https://www.google.com',
        'https://cdn.sender.net',
      ],
    },
    xFrameOptions: 'SAMEORIGIN',
    xContentTypeOptions: 'nosniff',
    xXSSProtection: '1; mode=block',
    referrerPolicy: 'strict-origin-when-cross-origin',
  },

  // Lazy loading thresholds
  lazyLoading: {
    images: {
      rootMargin: '200px',
      threshold: 0.01,
    },
    components: {
      rootMargin: '100px',
      threshold: 0.1,
    },
  },

  // Performance budgets (in KB)
  budgets: {
    javascript: 200,
    css: 60,
    html: 30,
    images: 500,
    fonts: 100,
    total: 1000,
  },

  // Monitoring
  monitoring: {
    webVitals: true,
    customMetrics: true,
    errorTracking: true,
  },
};

export default performanceConfig;