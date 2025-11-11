// next.config.js
const path = require('path');

// Bundle analyzer for performance optimization
const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
});

const isProd = process.env.NODE_ENV === 'production';

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  
  // Image optimization for static export
  images: {
    unoptimized: true, // Required for static export - MUST KEEP THIS
    formats: ['image/webp'], // Cloudflare will auto-convert
  },
  
  // Sass configuration
  sassOptions: {
    includePaths: [path.join(__dirname, 'src/app/styles')],
  },
  
  // Static export for GitHub Pages
  output: 'export',
  
  // TypeScript and ESLint configuration
  typescript: {
    // Only disable if absolutely necessary
    // ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  
  // GitHub Pages configuration
  // No basePath needed since using custom domain (manic.agency)
  basePath: '',
  assetPrefix: '',
  
  // Performance optimizations
  compress: true,
  poweredByHeader: false,
  productionBrowserSourceMaps: true,
  
  // Webpack optimizations for code splitting
  webpack: (config, { isServer, webpack }) => {
    if (!isServer) {
      // Aggressive code splitting for better caching and smaller bundles
      config.optimization = {
        ...config.optimization,
        moduleIds: 'deterministic',
        runtimeChunk: 'single',
        splitChunks: {
          chunks: 'all',
          maxAsyncRequests: 30,
          maxInitialRequests: 30,
          minSize: 20000,
          cacheGroups: {
            default: false,
            vendors: false,
            // Framework chunk - React, React DOM
            framework: {
              name: 'framework',
              test: /[\\/]node_modules[\\/](react|react-dom|scheduler)[\\/]/,
              priority: 50,
              reuseExistingChunk: true,
              enforce: true,
            },
            // Framer Motion - lazy load where possible
            framerMotion: {
              name: 'framer-motion',
              test: /[\\/]node_modules[\\/]framer-motion[\\/]/,
              priority: 40,
              reuseExistingChunk: true,
            },
            // Icons - separate chunks for each icon library
            lucideIcons: {
              name: 'lucide-icons',
              test: /[\\/]node_modules[\\/]lucide-react[\\/]/,
              priority: 35,
              reuseExistingChunk: true,
            },
            reactIcons: {
              name: 'react-icons',
              test: /[\\/]node_modules[\\/]react-icons[\\/]/,
              priority: 30,
              reuseExistingChunk: true,
            },
            // Markdown and syntax highlighting
            markdown: {
              name: 'markdown',
              test: /[\\/]node_modules[\\/](react-markdown|remark-.*|rehype-.*|unified|unist-.*|mdast-.*)[\\/]/,
              priority: 28,
              reuseExistingChunk: true,
            },
            syntaxHighlighting: {
              name: 'syntax-highlighting',
              test: /[\\/]node_modules[\\/](react-syntax-highlighter|refractor|prismjs)[\\/]/,
              priority: 26,
              reuseExistingChunk: true,
            },
            // Math rendering
            katex: {
              name: 'katex',
              test: /[\\/]node_modules[\\/]katex[\\/]/,
              priority: 25,
              reuseExistingChunk: true,
            },
            // UI libraries
            ui: {
              name: 'ui',
              test: /[\\/]node_modules[\\/](@radix-ui|embla-carousel|swiper)[\\/]/,
              priority: 24,
              reuseExistingChunk: true,
            },
            // Form and communication
            forms: {
              name: 'forms',
              test: /[\\/]node_modules[\\/](@emailjs|@giscus)[\\/]/,
              priority: 22,
              reuseExistingChunk: true,
            },
            // Animation libraries
            animations: {
              name: 'animations',
              test: /[\\/]node_modules[\\/](lottie-react|aos)[\\/]/,
              priority: 20,
              reuseExistingChunk: true,
            },
            // Utilities
            utils: {
              name: 'utils',
              test: /[\\/]node_modules[\\/](date-fns|clsx|tailwind-merge)[\\/]/,
              priority: 15,
              reuseExistingChunk: true,
            },
            // Common vendor chunk for remaining
            vendor: {
              name: 'vendor',
              test: /[\\/]node_modules[\\/]/,
              priority: 10,
              reuseExistingChunk: true,
              maxSize: 200000, // Split vendor chunk if larger than 200KB
            },
            // Common code chunk
            common: {
              name: 'common',
              minChunks: 2,
              priority: 5,
              reuseExistingChunk: true,
              maxSize: 100000, // Split common chunk if larger than 100KB
            },
          },
        },
      };
      
      // Replace heavy imports with lighter alternatives
      config.resolve.alias = {
        ...config.resolve.alias,
        // Use preact in production for smaller bundle
        // 'react': 'preact/compat',
        // 'react-dom': 'preact/compat',
      };
      
      // Minimize bundle size
      config.plugins.push(
        new webpack.ContextReplacementPlugin(
          /moment[/\\]locale$/,
          /en/ // Only include English locale
        )
      );
    }
    return config;
  },
  
  // Trailing slash configuration
  trailingSlash: false, // Ensures consistent behavior - no trailing slashes
  
  // Security headers
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'X-DNS-Prefetch-Control',
            value: 'on'
          },
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=63072000; includeSubDomains; preload'
          },
          {
            key: 'X-Frame-Options',
            value: 'SAMEORIGIN'
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff'
          },
          {
            key: 'Referrer-Policy',
            value: 'origin-when-cross-origin'
          },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=()'
          }
        ],
      },
    ];
  },
  
  // Note: redirects don't work with static export, handled client-side instead
  
  // Generate unique build ID for cache busting
  async generateBuildId() {
    return 'manic-agency-' + Date.now();
  },
};

module.exports = withBundleAnalyzer(nextConfig);