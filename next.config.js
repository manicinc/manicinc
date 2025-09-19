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
    // TEST: Comment out to see if optimization works with static export
    // unoptimized: true, // Required for static export - TESTING WITHOUT THIS
    formats: ['image/avif', 'image/webp'], // Modern formats for better compression
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    minimumCacheTTL: 31536000, // 1 year cache
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
  
  // Trailing slash configuration
  trailingSlash: false, // Ensures consistent behavior - no trailing slashes
  
  // Note: redirects don't work with static export, handled client-side instead
  
  // Generate unique build ID for cache busting
  async generateBuildId() {
    return 'manic-agency-' + Date.now();
  },
};

module.exports = withBundleAnalyzer(nextConfig);