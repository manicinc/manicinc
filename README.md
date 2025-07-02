# Manic Agency

> Digital agency specializing in Web3, AI, AR/VR, and creative technology. Open source Next.js site with advanced SEO and performance optimization.

**Live Site**: [manic.agency](https://manic.agency) | **Repo**: [manicinc/manicinc](https://github.com/manicinc/manicinc)

## Table of Contents

- [Quick Start](#quick-start)
- [Git LFS Setup](#git-lfs-setup)
- [Package Scripts Reference](#package-scripts-reference)
- [Development Workflow](#development-workflow)
- [Architecture](#architecture)
- [Content Management](#content-management)
- [SEO & Performance Features](#seo--performance-features)
- [Build Optimization](#build-optimization)
- [Deployment Pipeline](#deployment-pipeline)
- [Contributing](#contributing)
- [Configuration Files](#configuration-files)

## Quick Start

```bash
git clone https://github.com/manicinc/manicinc.git
cd manicinc
npm install
npm run dev          # Includes LFS check + dev server
```

Visit [http://localhost:3000](http://localhost:3000)

## Git LFS Setup

This project uses **Git LFS (Large File Storage)** for managing images and large assets. All image files (PNG, JPG, WebP, etc.) are automatically tracked by LFS.

### Initial Setup

```bash
# Install Git LFS (if not already installed)
git lfs install

# Clone with LFS files
git clone https://github.com/manicinc/manicinc.git
cd manicinc
git lfs pull         # Download all LFS files
```

### LFS Commands

```bash
# Check LFS status and missing images
npm run lfs:check              # Comprehensive LFS + image status
npm run lfs:status             # Git LFS status only  
npm run lfs:pull               # Pull all LFS files
npm run images:find-missing    # Find missing images in markdown files
```

### How LFS Works Here

**Tracked File Types** (see `.gitattributes`):
- `*.png`, `*.jpg`, `*.jpeg`, `*.gif`, `*.webp`
- `*.mp4`, `*.mov` (videos)

**Workflow**:
1. Add image files normally: `git add public/assets/blog/my-image.png`
2. LFS automatically tracks them (due to `.gitattributes`)
3. Commit and push as usual: `git commit -m "Add image"`
4. Others pull with: `git lfs pull`

### Missing Images Issue

Some images referenced in blog posts were **never committed to the repository** and need to be added fresh:

- `this-is-aider.png` - Aider CLI screenshot  
- `her-movie-screenshot-warner-bros.png` - Movie screenshot
- Various tutorial placeholder images

**To fix**: Source the actual image files and add them to the repository. They'll automatically be tracked by LFS.

### Troubleshooting

**Images appear as small text files?**
```bash
npm run lfs:pull    # Download actual LFS files
```

**Build failing with missing images?**
```bash
npm run images:find-missing    # See what's missing
```

**LFS not working?**
```bash
git lfs version     # Check if LFS is installed
git lfs install     # Install LFS hooks
```

## Package Scripts Reference

### Development Scripts
```bash
npm run dev              # Standard dev server with hot reload
npm run dev:lfs          # Dev server with LFS check (use when needed)
npm run type-check       # TypeScript validation
npm run lint             # ESLint + auto-fix
```

### Build Scripts
```bash
npm run build            # Standard production build + sitemap
npm run build:lfs        # Production build with LFS pull + sitemap
npm run build:static     # Standard static export for GitHub Pages
npm run build:static:lfs # Static export with LFS pull for deployment
npm run start            # Start production server
npm run start:static     # Test static build locally
```

### LFS & Image Management
```bash
npm run lfs:pull         # Pull all Git LFS files
npm run lfs:status       # Check Git LFS status
npm run lfs:check        # Comprehensive LFS + missing image check
npm run images:find-missing  # Find all missing images in markdown
```

### Optimization Scripts
```bash
npm run optimize:images        # Smart compression (skips optimized)
npm run optimize:images:force  # Force re-optimize all images
npm run clean                  # Clean build artifacts and backups
npm run clean:images           # Re-optimize all images from scratch
```

### Analysis & SEO
```bash
npm run sitemap          # Generate sitemap manually
npm run analyze          # Bundle size analysis (requires ANALYZE=true)
npm run postbuild        # Post-build sitemap generation (auto-runs)
```

### Build Process Flow

1. **Development**: `npm run dev` → Next.js dev server (fast startup)
2. **Development with LFS**: `npm run dev:lfs` → LFS check → Next.js dev server  
3. **Production**: `npm run build:lfs` → LFS pull → image optimization → Next.js build → sitemap
4. **Static Deploy**: `npm run build:static:lfs` → LFS pull → static export → GitHub Pages ready
5. **CI/CD**: GitHub Actions runs LFS install → LFS pull → `build:static:lfs` → deploy

## Development Workflow

### Typical Development Session

```bash
# Standard development (fast startup)
npm run dev

# With LFS check (only when working with images)  
npm run dev:lfs

# Check for issues
npm run type-check
npm run lint
npm run images:find-missing    # Check for missing images

# Before committing
npm run build                  # Test production build
npm run build:lfs              # Test with LFS if working with images
```

### Adding New Images

```bash
# Add image file (automatically tracked by LFS)
cp my-screenshot.png public/assets/blog/my-post/
git add public/assets/blog/my-post/my-screenshot.png
git commit -m "Add screenshot for blog post"
git push

# Others can then pull the image
git lfs pull
```

## Architecture

**Stack**: Next.js 14 + TypeScript + Tailwind + Framer Motion  
**Content**: Markdown with gray-matter frontmatter  
**SEO**: Dynamic metadata + structured data + auto-sitemaps  
**Analytics**: Vercel Analytics + Google Analytics (GDPR compliant)  
**Deployment**: GitHub Actions → GitHub Pages → Cloudflare CDN  

## Content Management

```
src/posts/
├── projects/              # Portfolio showcase
│   ├── ai/synthgpt.md    # AI/ML projects
│   ├── social/velvet.md  # Social platforms  
│   └── tools/            # Developer tools
└── thinkpieces/          # Blog content
    ├── tutorials/        # Technical guides
    └── essays/          # Long-form analysis
```

**Frontmatter Example**:
```yaml
---
title: "Project Title"
date: "2024-01-15"
category: "tools"
tags: ["nextjs", "typescript"]
featured: true
draft: false
---
```

## SEO & Performance Features

✅ **Automated SEO**: Dynamic meta tags, OpenGraph, Twitter cards  
✅ **Structured Data**: JSON-LD for rich snippets  
✅ **Sitemaps**: Auto-generated with `next-sitemap` (46 pages)  
✅ **Smart Image Optimization**: Intelligent compression (50-70% reduction)  
✅ **WebP Generation**: Modern format with automatic fallbacks  
✅ **Performance**: Core Web Vitals optimized, lazy loading  
✅ **Accessibility**: WCAG compliance, semantic HTML  
✅ **Analytics**: Privacy-first tracking with consent management  

### Configuration

```typescript
// src/app/open-source/OpenSourcePageClient.tsx
const GITHUB_USERNAME = 'manicinc';           // Change to your GitHub username
const GITHUB_SPONSOR_URL = `https://github.com/sponsors/${GITHUB_USERNAME}`;
const TWITTER_HANDLE = "manicagency";         // Optional: X/Twitter handle
const BUYMEACOFFEE_USERNAME = null;           // Optional: Buy Me a Coffee username
```

## Build Optimization

**Smart Image Processing**: Detects already-optimized images, skips unnecessary work  
**Automated Compression**: 50-70% size reduction with WebP generation  
**Bundle Analysis**: `npm run analyze` for detailed size inspection  
**Static Export**: Optimized for GitHub Pages with proper asset paths  
**CDN Ready**: Cloudflare auto-optimization (Brotli, modern formats, caching)  
**Intelligent Pipeline**: Only processes what's needed, preserves originals  

## Deployment Pipeline

### GitHub Actions Workflow

1. **Push to `main`** → GitHub Actions triggered
2. **LFS Setup**: Install Git LFS and pull all files
3. **Dependencies**: Install npm packages with caching
4. **LFS Verification**: Check LFS status and file availability
5. **Build Process**: `npm run build` (includes LFS pull + optimization)
6. **Deploy**: Files pushed to `gh-pages` branch
7. **CDN**: Cloudflare serves from custom domain with optimization

### Local Testing

```bash
# Test full production build
npm run build:static && npm run start:static

# Check LFS status before deploying
npm run lfs:check
```

### CI/CD Features

- **Automatic LFS Handling**: All image files pulled during build
- **Smart Optimization**: Only processes changed/new images (10x faster)
- **LFS Verification**: Ensures all required files are available
- **Build Statistics**: Shows exactly what was optimized vs skipped
- **Backup Safety**: Original files preserved in `public/_originals/`
- **Cache Optimization**: npm dependencies cached between builds

## Contributing

**Content**: Add `.md` files to `src/posts/` with proper frontmatter  
**Features**: TypeScript required, follow existing patterns  
**SEO**: Metadata automatically generated, test with build  

See [contribution guide](https://manic.agency/blog/tutorials/contribute) for detailed guidelines.

## Configuration Files

- `next.config.js` - Build and export settings
- `next-sitemap.config.js` - SEO sitemap generation  
- `tailwind.config.js` - Design system configuration
- `tsconfig.json` - TypeScript strict mode settings