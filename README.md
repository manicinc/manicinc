# Manic Agency // The Looking Glass

> Digital agency specializing in Web3, AI, AR/VR, and creative technology at manic.agency. Blog for thinkpieces, research, and mad writings with open submissions at manic.agency/blog.

> Open source Next.js site with advanced SEO and image optimization pipelines and static exports.

**Live Site**: [manic.agency](https://manic.agency) | **Repo**: [manicinc/manicinc](https://github.com/manicinc/manicinc)

## Table of Contents

- [Quick Start](#quick-start)
- [Git LFS Setup](#git-lfs-setup)
- [Package Scripts Reference](#package-scripts-reference)
- [Image Optimization](#image-optimization)
- [Development Workflow](#development-workflow)
- [Architecture](#architecture)
- [Content Management](#content-management)
- [Branding & Design System](#branding--design-system)
- [SEO & Performance Features](#seo--performance-features)
  - [Analytics Configuration](#analytics-configuration)
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
npm run build            # Production build with auto image optimization + sitemap
npm run build:lfs        # Production build with LFS pull + optimization + sitemap
npm run build:static     # Static export for GitHub Pages
npm run build:static:lfs # Static export with LFS pull for deployment
npm run start            # Start production server
npm run start:static     # Test static build locally
```

### LFS & Image Management
```bash
npm run lfs:pull             # Pull all Git LFS files
npm run lfs:status           # Check Git LFS status
npm run lfs:check            # Comprehensive LFS + missing image check
npm run images:find-missing  # Find all missing images in markdown
npm run images:status        # Check image optimization status
npm run images:report        # View last optimization report
```

### Optimization Scripts
```bash
npm run optimize:images          # Interactive optimization (asks for each image)
npm run optimize:images:force    # Force re-optimize all images
npm run optimize:images:auto     # Non-interactive with auto-resize (used in build)
npm run optimize:images:preview  # Preview changes without modifying files
npm run optimize:images:resize   # Check and resize oversized images only
npm run optimize:images:safe     # Compress only, no resizing
npm run optimize:images:avif     # Generate AVIF versions for better compression
```

### Restore & Cleanup Scripts
```bash
npm run restore:images             # Quick restore all from local backup
npm run restore:images:external    # Restore all from external backup
npm run restore:images:interactive # Interactive restore menu
npm run clean                      # Clean build artifacts
npm run clean:images               # Remove optimization cache and logs
npm run clean:all                  # Full cleanup including Next.js cache
```

### Analysis & SEO
```bash
npm run sitemap          # Generate sitemap manually
npm run analyze          # Bundle size analysis (requires ANALYZE=true)
npm run postbuild        # Post-build sitemap generation (auto-runs)
```

## Image Optimization

The project includes an advanced image optimization system that automatically runs during builds, featuring parallel processing, smart resizing, and modern format generation.

### Automatic Optimization

Images are **automatically optimized** during `npm run build` with:
- **Smart Detection**: Skips already-optimized images (10x faster rebuilds)
- **Parallel Processing**: Uses multiple CPU cores for speed
- **Modern Formats**: Generates WebP versions, optionally AVIF
- **Intelligent Resizing**: Detects and resizes oversized images
- **Backup Safety**: Preserves originals in `public/_originals/` and `../../image-backups/`

### Build Integration

```bash
# Standard build (includes auto optimization)
npm run build

# What happens:
# 1. Runs optimize:images:auto (non-interactive)
# 2. Processes only new/changed images
# 3. Generates WebP versions
# 4. Shows optimization report
# 5. Continues with Next.js build
```

### Restoring Images

If you need to restore original images:

```bash
# Quick restore all images
npm run restore:images

# Interactive restore (choose specific files/directories)
npm run restore:images:interactive

# View what was changed
npm run images:status
```

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
npm run optimize:images:preview # Preview image optimizations
```

### Adding New Images

```bash
# Add image file (automatically tracked by LFS)
cp my-screenshot.png public/assets/blog/my-post/
git add public/assets/blog/my-post/my-screenshot.png
git commit -m "Add screenshot for blog post"
git push

# Images are automatically optimized during build
# To optimize manually:
npm run optimize:images
```

## Architecture

**Stack**: Next.js 14 + TypeScript + Tailwind + Framer Motion  
**Content**: Markdown with gray-matter frontmatter  
**SEO**: Dynamic metadata + structured data + auto-sitemaps  
**Analytics**: Vercel Analytics + Google Analytics + Microsoft Clarity (GDPR compliant)  
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

## Branding & Design System

### Core Brand Colors

| Color | Hex Code | Usage | Role |
|-------|----------|-------|------|
| **Light Parchment** | `#fbf6ef` | Primary light background | Warm base |
| **Light Paper** | `#f5ede1` | Secondary light background | Paper texture |
| **Light Cream** | `#ede4d6` | Tertiary light background | Subtle accent |
| **Dark Ink** | `#3a2f25` | Primary text (light theme) | Rich sepia |
| **Light Sepia** | `#7a6d60` | Secondary text (light theme) | Muted sepia |
| **Dark Background** | `#22182b` | Primary dark background | Deep purple |
| **Mid Background** | `#402e46` | Secondary dark background | Medium purple |
| **Light Background** | `#5f4867` | Tertiary dark background | Light purple |
| **Pure White** | `#ffffff` | Text on dark theme | Crisp contrast |
| **Light Mid** | `#e8dce6` | Secondary dark text | Soft white |

### Accent Colors

| Color | Hex Code | Light Theme Use | Dark Theme Use |
|-------|----------|-----------------|----------------|
| **Burgundy** | `#b66880` → `#e85a88` | Primary accent | Brighter pink |
| **Sage** | `#7ea196` → `#7de8c9` | Secondary accent | Mint green |
| **Gold** | `#b88e62` → `#f4c892` | Highlight accent | Warm gold |
| **Rose** | `#d4bbc9` → `#d9c2d6` | Muted accent 1 | Soft lavender |
| **Blue** | `#b5c7d8` → `#b8c8d8` | Muted accent 2 | Powder blue |
| **Alert** | `#d07676` → `#ff7979` | Error/warning | Bright coral |

### Current Theme Implementation

The site uses a sophisticated dual-theme system with warm, editorial colors:

**Light Theme**:
- Background: `#fbf6ef` (warm parchment)
- Text: `#3a2f25` (dark sepia)
- Accent: `#b66880` (burgundy), `#7ea196` (sage), `#b88e62` (gold)

**Dark Theme**:
- Background: `#22182b` (deep purple)
- Text: `#ffffff` (pure white)
- Accent: `#e85a88` (pink), `#7de8c9` (mint), `#f4c892` (warm gold)

### Typography Stack

- **Display**: Lato (clean sans-serif)
- **Body**: Inter (system UI optimized)
- **Mono**: IBM Plex Mono (code)
- **Blog Headings**: Playfair Display (elegant serif)
- **Blog Body**: Merriweather (readable serif)
- **Script**: Dancing Script (decorative)

### Theme Variables

All colors are defined in `src/app/styles/theme.css` using CSS custom properties for easy customization:

```css
/* Light theme */
--bg-primary: #fbf6ef;
--text-primary: #4a3f35;
--accent-primary: #b66880;

/* Dark theme overrides */
html.dark {
  --bg-primary: #22182b;
  --text-primary: #ffffff;
  --accent-primary: #e85a88;
}
```

## SEO & Performance Features

✅ **Automated SEO**: Dynamic meta tags, OpenGraph, Twitter cards  
✅ **Structured Data**: JSON-LD for rich snippets  
✅ **Sitemaps**: Auto-generated with `next-sitemap`
✅ **Smart Image Optimization**: Parallel processing, automatic presets  
✅ **Modern Formats**: WebP + optional AVIF generation  
✅ **Accessibility**: WCAG compliance, semantic HTML  
✅ **Analytics**: Privacy-first tracking with consent management, GDPR-compliant

### Analytics Configuration

This project supports **Google Analytics** and **Microsoft Clarity** with full cookie consent integration.

#### Environment Setup

**GitHub Secrets Only Approach:**
This project uses GitHub Secrets exclusively - no local environment files needed.

**For Production (Required):**
Add these as GitHub Secrets (Repository Settings > Secrets and variables > Actions):

```
NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX
NEXT_PUBLIC_CLARITY_PROJECT_ID=your_clarity_project_id
RESEND_API_KEY=re_xxxxxxxxxxxxxxxxxxxxxxxxxx
RESEND_AUDIENCE_ID=xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx
NEXT_PUBLIC_EMAILJS_SERVICE_ID=your_service_id
NEXT_PUBLIC_EMAILJS_NEWSLETTER_TEMPLATE_ID=template_k3v4qm9
NEXT_PUBLIC_EMAILJS_CONTACT_TEMPLATE_ID=template_rq6cbua
NEXT_PUBLIC_EMAILJS_PUBLIC_KEY=CU78N6a7mfAlrjGWo
```

Resend is used for contact forms and newsletter submissions (and can be used for sending emails). EmailJS is used as a backup/alternative for contact forms in static deployments. Google Analytics and Clarity are used for analytics, are fully GDPR-compliant, and are not necessary to run.

**For Local Development:**
No setup required! Analytics and newsletter will be gracefully disabled if environment variables are missing.
Just run `npm run dev` and the app handles missing values automatically.

#### Getting Your Analytics IDs

**Google Analytics**:
1. Create a GA4 property at [analytics.google.com](https://analytics.google.com)
2. Copy your Measurement ID (format: `G-XXXXXXXXXX`)
3. Add to environment variables

**Microsoft Clarity**:
1. Create a project at [clarity.microsoft.com](https://clarity.microsoft.com)
2. Go to Settings > Overview to find your Project ID
3. Add to environment variables

**Resend Newsletter**:
1. Create an account at [resend.com](https://resend.com)
2. Verify your domain
3. Create an API key in the API Keys section
4. (Optional) Create an audience for subscriber management
5. Add both keys to environment variables

#### Usage

```typescript
// Use the analytics hook in components
import { useAnalytics } from '@/components/Analytics';

const { trackEvent, trackPageView, setUserTag, canTrack } = useAnalytics();

// Track custom events (only if user consented)
trackEvent('button_click', { button_id: 'download', section: 'hero' });

// Set user segments for Clarity
setUserTag('user_type', 'returning_visitor');
```  

### Newsletter System

The project includes a comprehensive newsletter system with **Resend** integration, featuring GDPR compliance and context-aware messaging.

#### Components

**NewsletterForm**: Reusable form component with multiple variants
```typescript
import NewsletterForm from '@/components/NewsletterForm';

// Main site version
<NewsletterForm variant="main" />

// Blog version with different messaging
<NewsletterForm variant="blog" />

// Compact inline version
<NewsletterForm variant="main" compact inline />
```

**NewsletterSection**: Full-featured section with social proof
```typescript
import NewsletterSection from '@/components/NewsletterSection';

// For main pages
<NewsletterSection variant="main" background="accent" />

// For blog pages
<NewsletterSection variant="blog" background="default" />
```

#### API Endpoints

- **POST /api/subscribe**: Subscribe users with welcome emails
- **POST/GET /api/unsubscribe**: GDPR-compliant unsubscribe with confirmation

#### GDPR Features

- ✅ **One-click unsubscribe** links in all emails
- ✅ **Permanent dismissal** with localStorage persistence  
- ✅ **Context-aware messaging** (blog vs main site)
- ✅ **Welcome email automation** based on subscription source
- ✅ **Privacy policy integration** with cookie consent
- ✅ **Graceful degradation** when API keys are missing

#### Email Templates

The system automatically sends different welcome emails based on subscription context:

- **Blog subscribers**: "Welcome to The Looking Glass Chronicles"
- **Main site subscribers**: "Welcome to Manic Agency"

All emails include unsubscribe links and match the site's visual branding.

### Contact Form System

The project includes a comprehensive contact form system using **Resend** for email delivery, featuring rate limiting, validation, and professional email templates.

#### Features

- ✅ **Rate Limiting**: 5 requests per 15-minute window per IP
- ✅ **Form Validation**: Email format, message length, required fields
- ✅ **Professional Templates**: Branded emails for both admin and user
- ✅ **Auto-Reply**: Confirmation emails to users with next steps
- ✅ **Direct Reply**: Admin emails configured for direct replies
- ✅ **GDPR Compliant**: Privacy policy integration and consent notices
- ✅ **Graceful Degradation**: Fallback to direct email if API fails

#### Configuration

The contact form uses the same `RESEND_API_KEY` as the newsletter system. Admin emails are sent to `team@manic.agency` (configured in `src/lib/constants.ts`).

#### API Endpoint

- **POST /api/contact**: Processes contact form submissions with validation and email delivery

#### Contact Form Fields

- **Required**: Name, Email, Message (12 char minimum)
- **Optional**: Company, Phone, Subject, Budget Range
- **Features**: Real-time validation, submission analytics, cookie consent integration

### Other Configuration

```typescript
// src/app/open-source/OpenSourcePageClient.tsx
const GITHUB_USERNAME = 'manicinc';           // Change to your GitHub username
const GITHUB_SPONSOR_URL = `https://github.com/sponsors/${GITHUB_USERNAME}`;
const TWITTER_HANDLE = "manicagency";         // Optional: X/Twitter handle
const BUYMEACOFFEE_USERNAME = null;           // Optional: Buy Me a Coffee username
```

## Contributing

**Content**: Add `.md` files to `src/posts/` with proper frontmatter  
**Images**: Add to `public/assets/`, automatically optimized on build  

See [contribution guide](https://manic.agency/blog/tutorials/contribute) for detailed guidelines.

------------------------------

Built by manic.agency