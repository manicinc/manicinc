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
  
  // Trailing slash configuration
  trailingSlash: false, // Ensures consistent behavior - no trailing slashes
  
  // Note: redirects don't work with static export, handled client-side instead
  
  // Generate unique build ID for cache busting
  async generateBuildId() {
    return 'manic-agency-' + Date.now();
  },
};

module.exports = withBundleAnalyzer(nextConfig);