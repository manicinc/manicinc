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
  
  // Webpack optimizations for code splitting
  webpack: (config, { isServer }) => {
    if (!isServer) {
      // Split chunks for better caching
      config.optimization = {
        ...config.optimization,
        splitChunks: {
          chunks: 'all',
          cacheGroups: {
            default: false,
            vendors: false,
            // Framer Motion in separate chunk
            framerMotion: {
              name: 'framer-motion',
              test: /[\\/]node_modules[\\/]framer-motion[\\/]/,
              priority: 40,
              reuseExistingChunk: true,
            },
            // Lucide icons in separate chunk
            lucide: {
              name: 'lucide-react',
              test: /[\\/]node_modules[\\/]lucide-react[\\/]/,
              priority: 35,
              reuseExistingChunk: true,
            },
            // React icons
            reactIcons: {
              name: 'react-icons',
              test: /[\\/]node_modules[\\/]react-icons[\\/]/,
              priority: 30,
              reuseExistingChunk: true,
            },
            // Common vendor chunk
            vendor: {
              name: 'vendor',
              test: /[\\/]node_modules[\\/]/,
              priority: 10,
              reuseExistingChunk: true,
            },
            // Common code chunk
            common: {
              name: 'common',
              minChunks: 2,
              priority: 5,
              reuseExistingChunk: true,
            },
          },
        },
      };
    }
    return config;
  },
  
  // Trailing slash configuration
  trailingSlash: false, // Ensures consistent behavior - no trailing slashes
  
  // Note: redirects don't work with static export, handled client-side instead
  
  // Generate unique build ID for cache busting
  async generateBuildId() {
    return 'manic-agency-' + Date.now();
  },
};

module.exports = withBundleAnalyzer(nextConfig);