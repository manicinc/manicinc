# Image Optimization Script - Complete Guide

A powerful Node.js script for intelligently optimizing images with smart compression, adaptive resizing, and modern format generation. Designed for web developers who need fine-grained control over image optimization with sensible defaults.

## Table of Contents

- [Features](#features)
- [Installation](#installation)
- [Quick Start](#quick-start)
- [Understanding the Process](#understanding-the-process)
- [Command Line Options](#command-line-options)
- [Compression Presets](#compression-presets)
- [Resize Strategies](#resize-strategies)
- [Scaling Options](#scaling-options)
- [Interactive Mode](#interactive-mode)
- [Common Usage Scenarios](#common-usage-scenarios)
- [File Organization](#file-organization)
- [Best Practices](#best-practices)
- [Advanced Configuration](#advanced-configuration)
- [Troubleshooting](#troubleshooting)
- [Performance Metrics](#performance-metrics)

## Features

### Core Features
- **Two-Phase Processing**: Separate resize analysis and compression optimization
- **Smart Compression**: Content-aware quality adjustment that skips well-optimized images
- **Flexible Resizing**: Multiple strategies from conservative to aggressive
- **Modern Formats**: Automatic WebP and AVIF generation
- **Intelligent Caching**: Skip unchanged files automatically
- **Safe Backups**: Automatic backup creation with deduplication
- **Batch Processing**: Parallel optimization with progress tracking

### Smart Features
- **Content Detection**: Identifies photos, screenshots, logos, diagrams, memes
- **Format Conversion**: Automatically converts PNG to JPEG when beneficial
- **Complexity Analysis**: Adjusts compression based on image entropy
- **Text Detection**: Preserves quality for images with text
- **Already-Optimized Detection**: Skips images with < 0.2 bytes/pixel
- **Opt-in Auto-Cropping for Images**: Detects area for maximal attention and focuses on it (opt-in)

## Installation

### Prerequisites

```bash
# Node.js v14 or higher required
node --version

# Install dependencies
npm install sharp
```

### Setup

1. Create directory structure:
```
project/
├── public/           # Images to optimize
├── scripts/          # Place script here
│   └── optimize-images.js
└── package.json
```

2. Add to `package.json`:
```json
{
  "scripts": {
    "optimize:images": "node scripts/optimize-images.js"
  }
}
```

3. The script will automatically create:
- `public/_originals/` - Local backups
- `../image-backups/` - External backups
- `.image-optimization-cache.json` - Optimization tracking
- `.optimization-report.json` - Statistics report

## Quick Start

### Most Common Commands

```bash
# Standard optimization (2K resize + smart compression)
npm run optimize:images

# Fully automatic (no prompts)
npm run optimize:images -- --non-interactive --resize-auto

# Custom target resolution
npm run optimize:images -- --target=1600 --resize-auto

# Preview without modifying files
npm run optimize:images -- --dry-run
```

## Understanding the Process

The script operates in two distinct phases:

### Phase 1: Resize Analysis
- Analyzes ALL images to determine which need dimension reduction
- Decision based on your chosen resize strategy
- Only images exceeding target dimensions are flagged

### Phase 2: Compression Optimization
- Processes ALL images in your project
- Applies compression based on chosen preset
- Skips images already in cache (unless using `--force`)
- Images from Phase 1 get BOTH resized AND compressed

### Example Output Explained

```
Found 77 image files
Found 3 images that need resizing    # Only 3 exceed target dimensions
...
Optimizing all images...              # All 77 get compression analysis
```

This design ensures:
- Small images still get compression optimization
- Large images get both resized AND compressed
- Already-optimized images are skipped for performance

## Command Line Options

### Core Options

| Option | Description | Default |
|--------|-------------|---------|
| `--dry-run` | Preview changes without modifying files | false |
| `--force` | Re-optimize ALL images (ignores cache) | false |
| `--verbose` or `-v` | Show detailed progress and analysis | false |
| `--non-interactive` or `-y` | Skip all prompts | false |
| `--analyze-only` | Analyze images and show recommendations | false |

### Compression Presets

| Option | Description | Behavior |
|--------|-------------|----------|
| `--compress-smart` | **Default**: Adaptive compression | Analyzes each image, skips well-optimized |
| `--compress-heavy` | Maximum file size reduction | Fixed aggressive compression |
| `--compress-light` | Preserve quality | Fixed minimal compression |

### Resize Options

| Option | Description |
|--------|-------------|
| `--resize-auto` | Automatically resize based on strategy |
| `--resize-skip` | Skip resizing, only compress |
| `--resize-only` | Only resize images, skip compression |
| `--resize-universal` | Resize all images to standard resolution |

### Resize Strategies

| Option | Description | Target | When to Use |
|--------|-------------|--------|-------------|
| `--resize-standard` | **Default**: Resize over 2K | 2000px | General web use |
| `--resize-conservative` | Only resize if exceeds preset | Varies | Preserve original sizes |
| `--resize-aggressive` | Tiered sizing | 4K→2K, etc | Maximum reduction |
| `--target=WIDTH` | Custom target width | Custom | Specific requirements |

### Scaling & Format Options

| Option | Description |
|--------|-------------|
| `--scale=X.X` | Global scaling factor (1.0-3.0) |
| `--avif` | Generate AVIF versions (slower, better compression) |

## Compression Presets

### Smart Compression (Default)

The smart preset analyzes each image individually:

1. **Content Detection**
   - Photos: 60-75% quality
   - Screenshots: 65-78% quality
   - Logos: 72-85% quality
   - Diagrams: 62-75% quality
   - Backgrounds: 40-55% quality
   - Memes: 50-65% quality

2. **Skip Criteria**
   - Already compressed (< 0.2 bytes/pixel)
   - High compression ratio (> 85%)
   - Previously optimized (in cache)

3. **Adjustments**
   - File size: Larger files get more compression
   - Text content: Preserves quality for readability
   - Complexity: Simple images compress more

### Heavy Compression

Fixed aggressive settings for maximum file size reduction:
- JPEG: 60% quality
- PNG: 65% quality
- WebP: 50% quality
- AVIF: 45% quality

Best for: High-traffic sites, mobile-first, performance critical

### Light Compression

Fixed minimal settings to preserve quality:
- JPEG: 85% quality
- PNG: 90% quality
- WebP: 80% quality
- AVIF: 75% quality

Best for: Photography, portfolios, print-quality needs

## Resize Strategies

### Standard Strategy (Default)

Resizes all images over 2000px to 2K:
```bash
npm run optimize:images
# OR explicitly:
npm run optimize:images -- --resize-standard
```

- Target: 2000px width
- Maintains aspect ratio
- Can be scaled with `--scale=X.X`

### Conservative Strategy

Only resizes images that exceed their auto-detected preset:
```bash
npm run optimize:images -- --resize-conservative
```

Auto-detection based on filename:
- `hero-*.jpg` → Hero preset (2560px)
- `thumb-*.png` → Thumbnail preset (800px)
- `og-image.jpg` → Social preset (1600px)

### Aggressive Strategy

Uses tiered sizing for maximum reduction:
```bash
npm run optimize:images -- --resize-aggressive
```

Tiers:
- 4K (3840px) → 2K (2000px)
- 2.5K (2560px) → 2K (2000px)
- Others remain at current tier

### Custom Target

Set your own target width:
```bash
npm run optimize:images -- --target=1600
```

Common targets:
- 1200px - Small sites, fast loading
- 1600px - Content sites, blogs
- 2000px - Standard (default)
- 2560px - High quality
- 3840px - 4K preservation

## Scaling Options

Multiply any target by a scaling factor:

```bash
# 2K at 1.5x = 3000px
npm run optimize:images -- --scale=1.5

# Custom 1600px at 2x = 3200px
npm run optimize:images -- --target=1600 --scale=2.0
```

Available scales:
- 1.0x - Standard (default)
- 1.25x - 25% larger
- 1.5x - 50% larger
- 1.75x - 75% larger
- 2.0x - Double (Retina)
- 2.5x - 2.5x resolution
- 3.0x - Triple (maximum)

## Auto Cropping

With smart crop (explicit opt-in):

```bash
npm run optimize:images -- --smart-crop
```
Shows warnings, allows per-image control

```bash
npm run optimize:images -- -y --resize-auto --smart-crop
# ⚠️ Will crop ALL images that need resizing!
```

## Interactive Mode

When running without `--non-interactive`, the script provides rich interaction:

### Initial Setup
```
💡 Current target resolution: 2000px (2K)
Would you like to set a different target resolution? (y/N): y
Enter target width in pixels: 1600

💡 Would you like to set a global scaling factor?
Use global scaling factor? (y/N): y
Choose scaling factor:
[1] 1.0x (Standard)
[2] 1.5x (150%)
[3] 2.0x (200%)
```

### Per-Image Options
```
📏 example-image.png
   Dimensions: 3000×2000 (3:2)
   Current size: 2500KB
   Image type: photo (complex)
   
   📐 Resize: 3000×2000 → 1600×1067
   📋 Reason: Custom target: 1600px
   🎨 Quality: 72% (photo with high complexity)
   💾 Estimated size: 2500KB → ~650KB (74% reduction)
   
   [1] Apply suggested resize
   [2] Choose different target width
   [3] Change scale factor
   [4] Custom dimensions
   [5] Skip this image
   [6] Apply to all similar images
```

## Common Usage Scenarios

### 1. Standard Web Optimization
```bash
npm run optimize:images -- --non-interactive --resize-auto
```
- Resizes images over 2K to 2000px
- Smart compression based on content
- Good for most websites

### 2. High-Performance Mobile Site
```bash
npm run optimize:images -- --target=1200 --resize-auto --compress-heavy
```
- Smaller dimensions for faster loading
- Aggressive compression
- Ideal for mobile-first sites

### 3. Photography Portfolio
```bash
npm run optimize:images -- --scale=2.0 --compress-light --resize-conservative
```
- Preserves high resolution (2x scaling)
- Light compression for quality
- Only resizes huge images

### 4. E-commerce Product Images
```bash
npm run optimize:images -- --target=1600 --scale=1.25
```
- Consistent 2000px sizing (1600 × 1.25)
- Smart compression for balance
- Good for product galleries

### 5. Blog with Mixed Content
```bash
npm run optimize:images -- --target=1800
```
- Interactive mode for control
- 1800px good for article width
- Can customize per image

### 6. CI/CD Pipeline
```bash
npm run optimize:images -- -y --resize-universal --avif --compress-smart
```
- Fully automated
- Universal 2K sizing
- Generates all formats
- Smart compression (skips optimized)

### 7. Quick Performance Boost
```bash
npm run optimize:images -- --resize-aggressive --compress-heavy --non-interactive
```
- Maximum file size reduction
- No user interaction needed
- Best for immediate results

## File Organization

### Directory Structure
```
project/
├── public/
│   ├── images/
│   │   ├── hero/        # Auto-detected as hero images
│   │   ├── blog/        # Auto-detected as content
│   │   ├── products/    # E-commerce images
│   │   └── social/      # Open Graph images
│   └── _originals/      # Local backups (auto-created)
├── scripts/
│   ├── optimize-images.js
│   ├── .image-optimization-cache.json
│   ├── .image-optimization.log
│   └── .optimization-report.json
└── image-backups/       # External backups (auto-created)
```

### Cache File Structure
```json
{
  "images/hero/banner.jpg": {
    "hash": "a3f4b5...",
    "optimized": true,
    "originalSize": 2500.5,
    "optimizedSize": 650.2,
    "savings": 74,
    "resized": true,
    "dimensions": { "width": 2000, "height": 1333 },
    "quality": 72,
    "imageType": "photo",
    "timestamp": 1648235892341
  }
}
```

## Best Practices

### 1. Choosing Compression Presets

**Use Smart (Default) When:**
- You have mixed image types
- Quality matters but so does performance
- You want automatic optimization
- Building a typical website

**Use Heavy When:**
- Performance is critical
- Mobile-first development
- High traffic expected
- File size is primary concern

**Use Light When:**
- Photography showcase
- Print quality needed
- Visual fidelity is critical
- Portfolio sites

### 2. Choosing Resize Strategies

**Use Standard (2K) When:**
- Building for modern web
- Want consistent sizing
- General purpose sites
- Most common choice

**Use Conservative When:**
- Have carefully sized images
- Want minimal changes
- Specific layout requirements
- Preserving original intent

**Use Aggressive When:**
- Need maximum performance
- File size critical
- Mobile-first approach
- Bandwidth concerns

**Use Custom Target When:**
- Specific design requirements
- Known maximum display size
- Consistent layout needs
- Special use cases

### 3. Workflow Recommendations

**Development Workflow:**
```bash
# First time - analyze
npm run optimize:images -- --analyze-only

# Test with dry run
npm run optimize:images -- --dry-run

# Apply optimization
npm run optimize:images

# Force re-optimization after changes
npm run optimize:images -- --force
```

**Production Workflow:**
```json
// package.json
{
  "scripts": {
    "build": "npm run optimize:images:prod && next build",
    "optimize:images:prod": "npm run optimize:images -- -y --resize-auto --avif"
  }
}
```

### 4. Performance Tips

1. **Use Cache Effectively**
   - Don't use `--force` unless needed
   - Cache persists for 30 days
   - Tracks file changes automatically

2. **Batch Similar Images**
   - Organize by type in folders
   - Use "Apply to all similar" option
   - Speeds up processing

3. **Modern Formats**
   - Always generate WebP
   - Use AVIF for maximum savings
   - Implement `<picture>` elements

4. **Monitor Results**
   - Check `.optimization-report.json`
   - Review file size reductions
   - Adjust strategy if needed

## Advanced Configuration

### Custom Image Type Detection

Edit the script to add new patterns:

```javascript
// In detectImageType function
if (/product|item|sku/i.test(fileName)) return 'product';

// Add compression profile
'product': {
  high: { quality: 80, effort: 'max' },
  medium: { quality: 72, effort: 'max' },
  low: { quality: 65, effort: 'balanced' }
}
```

### Custom Presets

Add to `RESIZE_CONFIG.presets`:

```javascript
'product': {
  name: 'Product Image',
  maxWidth: 1400,
  maxHeight: 1400,
  quality: 75,
  description: 'E-commerce product images'
}
```

### Environment-Specific Settings

```bash
# Development
npm run optimize:images -- --compress-light --verbose

# Staging  
npm run optimize:images -- --compress-smart

# Production
npm run optimize:images -- --compress-heavy --resize-aggressive
```

## Troubleshooting

### Common Issues

#### "Found X images that need resizing" Confusion
This only refers to resize analysis. ALL images are still compressed.
```bash
# To see what's happening:
npm run optimize:images -- --verbose
```

#### Images Not Being Resized
Check your strategy and target:
```bash
# Default only resizes images OVER 2000px
# Use lower target or aggressive strategy:
npm run optimize:images -- --target=1600
npm run optimize:images -- --resize-aggressive
```

#### Already Optimized Messages
```bash
# Smart compression skips well-optimized images
# To force reprocessing:
npm run optimize:images -- --force

# Or use different compression:
npm run optimize:images -- --compress-heavy
```

#### Out of Memory
```bash
# Reduce parallel workers by editing script:
const MAX_WORKERS = 2; // Instead of CPU count
```

#### Poor Quality Results
```bash
# Use lighter compression:
npm run optimize:images -- --compress-light

# Or increase scaling:
npm run optimize:images -- --scale=1.5
```

### Debug Mode

Enable verbose logging:
```bash
npm run optimize:images -- --verbose

# Check log file:
cat scripts/.image-optimization.log
```

### Cache Management

```bash
# View cache
cat .image-optimization-cache.json | jq

# Clear cache
rm .image-optimization-cache.json

# Cache location
scripts/.image-optimization-cache.json
```

### Analyzing Results

Check the optimization report:
```bash
cat .optimization-report.json
```

Example report:
```json
{
  "date": "2024-01-15T10:30:00.000Z",
  "duration": "45.3s",
  "processed": 150,
  "optimized": 89,
  "resized": 23,
  "skipped": 61,
  "savedKB": "15234.5",
  "savedMB": "14.88",
  "compressionPreset": "Smart (Adaptive)",
  "resizeStrategy": "standard",
  "compressionByType": {
    "photo": {
      "count": 45,
      "avgQuality": 72,
      "avgSavings": 68
    }
  }
}
```

## Performance Metrics

Typical optimization results:

### File Size Reduction
- **Smart Compression**: 40-70% average reduction
- **Heavy Compression**: 60-85% average reduction  
- **Light Compression**: 15-40% average reduction

### Processing Speed
- **Analysis**: ~100 images/second
- **Optimization**: ~5-10 images/second
- **WebP Generation**: ~3-5 images/second
- **AVIF Generation**: ~1-2 images/second

### Quality Impact
- **Smart**: Visually identical for most users
- **Heavy**: Noticeable on close inspection
- **Light**: Professional quality maintained

### Compression by Image Type
| Type | Smart Quality | Typical Reduction |
|------|--------------|-------------------|
| Photos | 68-75% | 65% |
| Screenshots | 70-78% | 70% |
| Logos | 78-85% | 50% |
| Diagrams | 68-75% | 75% |
| Backgrounds | 48-55% | 80% |
| Memes | 58-65% | 75% |

## Quick Reference

### Most Useful Commands

```bash
# Standard optimization
npm run optimize:images

# Fast automatic
npm run optimize:images -- -y --resize-auto

# Maximum performance
npm run optimize:images -- --compress-heavy --resize-aggressive -y

# High quality preservation
npm run optimize:images -- --compress-light --scale=2.0

# Custom target
npm run optimize:images -- --target=1600

# Analyze only
npm run optimize:images -- --analyze-only

# Force reprocess
npm run optimize:images -- --force
```

### Decision Tree

1. **What's your priority?**
   - Performance → Heavy compression + Aggressive resize
   - Quality → Light compression + Conservative resize
   - Balance → Smart compression + Standard resize

2. **What's your target display?**
   - Mobile → 1200-1600px target
   - Desktop → 2000px target (default)
   - Retina → Add --scale=2.0
   - 4K → 2560px target + scale

3. **What's your workflow?**
   - Development → Interactive mode
   - CI/CD → Non-interactive + auto
   - One-time → Default settings

## Summary

This image optimization script provides a complete solution for:

- **Intelligent compression** based on image content
- **Flexible resizing** with multiple strategies
- **Modern format generation** for better performance
- **Safe optimization** with automatic backups
- **Efficient processing** with caching and parallel execution

The smart defaults work well for most cases, while extensive options provide fine-grained control when needed. The two-phase approach ensures all images are optimized appropriately, whether they need resizing, compression, or both.