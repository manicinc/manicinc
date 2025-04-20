// next.config.js
const path = require('path');
// Set this to your repository name
const repoName = 'manicinc'; // <---- Make sure this matches your repo name!
const isProd = process.env.NODE_ENV === 'production';

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    unoptimized: true,
  },
  sassOptions: {
    includePaths: [path.join(__dirname, 'src/app/styles')],
  },
  
  // Output as static HTML/CSS/JS
  output: 'export',
  
  // Skip TypeScript checking during build
  typescript: {
    // ignoreBuildErrors: true,
  },
  
  // Skip ESLint checking during build
  eslint: {
    ignoreDuringBuilds: true,
  },
  
  // Configure base path and asset prefix for GitHub Pages
  // basePath: isProd ? `/${repoName}` : '',
  // assetPrefix: isProd ? `/${repoName}/` : '', // <---- Note trailing slash here!  // For local development, don't use any base path
  basePath: process.env.NODE_ENV === 'production' && process.env.GITHUB_ACTIONS 
  ? '' 
  : '',

  assetPrefix: process.env.NODE_ENV === 'production' && process.env.GITHUB_ACTIONS 
    ? '' 
    : '',
};

module.exports = nextConfig;