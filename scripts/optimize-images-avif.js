#!/usr/bin/env node

const sharp = require('sharp');
const fs = require('fs').promises;
const path = require('path');
const crypto = require('crypto');

// Configuration
const CONFIG = {
  inputDir: 'public/assets',
  outputFormats: ['webp', 'avif'],
  quality: {
    webp: 85,
    avif: 80,
  },
  maxWidth: 2048,
  maxHeight: 2048,
  cacheFile: '.image-optimization-cache.json',
  skipPatterns: [/node_modules/, /_originals/, /_next/, /\.git/],
  supportedFormats: ['.jpg', '.jpeg', '.png', '.gif'],
};

// Cache management
class ImageCache {
  constructor(cacheFile) {
    this.cacheFile = path.join(__dirname, cacheFile);
    this.cache = {};
  }

  async load() {
    try {
      const data = await fs.readFile(this.cacheFile, 'utf-8');
      this.cache = JSON.parse(data);
    } catch {
      this.cache = {};
    }
  }

  async save() {
    await fs.writeFile(this.cacheFile, JSON.stringify(this.cache, null, 2));
  }

  getHash(filePath) {
    return crypto.createHash('md5').update(filePath).digest('hex');
  }

  async shouldProcess(filePath) {
    const stats = await fs.stat(filePath);
    const hash = this.getHash(filePath);
    const cached = this.cache[hash];

    if (!cached) return true;
    return stats.mtimeMs > cached.modified;
  }

  async markProcessed(filePath) {
    const stats = await fs.stat(filePath);
    const hash = this.getHash(filePath);
    this.cache[hash] = {
      path: filePath,
      modified: stats.mtimeMs,
      processed: Date.now(),
    };
  }
}

// Image processor
class ImageProcessor {
  constructor(cache) {
    this.cache = cache;
    this.processed = 0;
    this.skipped = 0;
    this.errors = 0;
  }

  async processImage(inputPath) {
    try {
      // Check if already processed
      if (!await this.cache.shouldProcess(inputPath)) {
        this.skipped++;
        return;
      }

      const ext = path.extname(inputPath).toLowerCase();
      if (!CONFIG.supportedFormats.includes(ext)) {
        return;
      }

      console.log(`Processing: ${inputPath}`);

      // Load image
      const image = sharp(inputPath);
      const metadata = await image.metadata();

      // Resize if needed
      let pipeline = image;
      if (metadata.width > CONFIG.maxWidth || metadata.height > CONFIG.maxHeight) {
        pipeline = pipeline.resize(CONFIG.maxWidth, CONFIG.maxHeight, {
          fit: 'inside',
          withoutEnlargement: true,
        });
      }

      // Generate WebP version
      const webpPath = inputPath.replace(ext, '.webp');
      await pipeline
        .clone()
        .webp({ quality: CONFIG.quality.webp, effort: 6 })
        .toFile(webpPath);

      // Generate AVIF version
      const avifPath = inputPath.replace(ext, '.avif');
      await pipeline
        .clone()
        .avif({ quality: CONFIG.quality.avif, effort: 6 })
        .toFile(avifPath);

      // Update cache
      await this.cache.markProcessed(inputPath);
      this.processed++;

      console.log(`✓ Generated WebP and AVIF for ${path.basename(inputPath)}`);
    } catch (error) {
      console.error(`✗ Error processing ${inputPath}:`, error.message);
      this.errors++;
    }
  }

  async processDirectory(dir) {
    const entries = await fs.readdir(dir, { withFileTypes: true });

    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name);

      // Skip patterns
      if (CONFIG.skipPatterns.some(pattern => pattern.test(fullPath))) {
        continue;
      }

      if (entry.isDirectory()) {
        await this.processDirectory(fullPath);
      } else if (entry.isFile()) {
        await this.processImage(fullPath);
      }
    }
  }

  printSummary() {
    console.log('\n📊 Optimization Summary:');
    console.log(`   ✓ Processed: ${this.processed} images`);
    console.log(`   ⏭ Skipped: ${this.skipped} images (already optimized)`);
    if (this.errors > 0) {
      console.log(`   ✗ Errors: ${this.errors}`);
    }
  }
}

// Main execution
async function main() {
  console.log('🖼️  Starting image optimization with WebP and AVIF...\n');

  const cache = new ImageCache(CONFIG.cacheFile);
  await cache.load();

  const processor = new ImageProcessor(cache);
  await processor.processDirectory(CONFIG.inputDir);

  await cache.save();
  processor.printSummary();

  // Calculate space saved
  try {
    const { size: originalSize } = await fs.stat(CONFIG.inputDir);
    const webpFiles = await findFiles(CONFIG.inputDir, '.webp');
    const avifFiles = await findFiles(CONFIG.inputDir, '.avif');

    let webpSize = 0;
    let avifSize = 0;

    for (const file of webpFiles) {
      const { size } = await fs.stat(file);
      webpSize += size;
    }

    for (const file of avifFiles) {
      const { size } = await fs.stat(file);
      avifSize += size;
    }

    console.log('\n💾 Space Savings:');
    console.log(`   WebP: ${formatBytes(webpSize)} total`);
    console.log(`   AVIF: ${formatBytes(avifSize)} total`);
  } catch (error) {
    // Space calculation is optional
  }
}

// Helper functions
async function findFiles(dir, extension) {
  const files = [];
  const entries = await fs.readdir(dir, { withFileTypes: true });

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      files.push(...await findFiles(fullPath, extension));
    } else if (entry.isFile() && fullPath.endsWith(extension)) {
      files.push(fullPath);
    }
  }

  return files;
}

function formatBytes(bytes) {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

// Run if called directly
if (require.main === module) {
  main().catch(error => {
    console.error('Fatal error:', error);
    process.exit(1);
  });
}

module.exports = { ImageProcessor, ImageCache };