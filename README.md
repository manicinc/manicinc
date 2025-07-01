# Manic Agency

> Digital agency specializing in Web3, AI, AR/VR, and creative technology. Open source Next.js site with advanced SEO and performance optimization.

**Live Site**: [manic.agency](https://manic.agency) | **Repo**: [manicinc/manicinc](https://github.com/manicinc/manicinc)

## Quick Start

```bash
git clone https://github.com/manicinc/manicinc.git
cd manicinc
npm install
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000)

## Development Workflow

```bash
# Development
npm run dev              # Local dev server with hot reload
npm run type-check       # TypeScript validation
npm run lint             # ESLint + auto-fix

# Building & Testing  
npm run build            # Production build + SEO generation
npm run build:static     # Static export for GitHub Pages
npm run start:static     # Test static build locally

# Optimization & Analysis
npm run optimize:images        # Smart compression (skips already optimized)
npm run optimize:images:force  # Force re-optimize all images
npm run sitemap                # Generate sitemap manually
npm run analyze                # Bundle size analysis
npm run clean                  # Clean build artifacts and backups
npm run clean:images           # Re-optimize all images from scratch
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

## Build Optimization

**Smart Image Processing**: Detects already-optimized images, skips unnecessary work  
**Automated Compression**: 50-70% size reduction with WebP generation  
**Bundle Analysis**: `npm run analyze` for detailed size inspection  
**Static Export**: Optimized for GitHub Pages with proper asset paths  
**CDN Ready**: Cloudflare auto-optimization (Brotli, modern formats, caching)  
**Intelligent Pipeline**: Only processes what's needed, preserves originals  

## Deployment Pipeline

1. **Push to `main`** → GitHub Actions triggered
2. **Smart Optimization**: Only processes changed/new images (10x faster)
3. **Build Process**: `npm run build:static` generates optimized static files
4. **Deploy**: Files pushed to `gh-pages` branch
5. **CDN**: Cloudflare serves from custom domain with optimization
6. **SEO**: Sitemaps auto-submitted, robots.txt configured

**Local Testing**: `npm run build:static && npm run start:static`

### Development Features
- **Intelligent Optimization**: Detects already-compressed images
- **Force Override**: `--force` flag for complete re-optimization  
- **Build Statistics**: Shows exactly what was optimized vs skipped
- **Backup Safety**: Original files preserved in `public/_originals/`

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