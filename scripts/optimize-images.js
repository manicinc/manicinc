#!/usr/bin/env node
/**
 * Image Optimization Script for Manic Agency
 * Compresses images in public/ directory for better performance
 */

const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const PUBLIC_DIR = path.join(__dirname, '../public');
const BACKUP_DIR = path.join(PUBLIC_DIR, '_originals');

// Image optimization settings
const OPTIMIZATION_CONFIG = {
  jpeg: {
    quality: 85,
    progressive: true,
    mozjpeg: true,
  },
  png: {
    quality: 90,
    compressionLevel: 8,
    adaptiveFiltering: true,
  },
  webp: {
    quality: 85,
    effort: 6,
  }
};

// Files to optimize (large images)
const TARGET_FILES = [
  'og-default.png',
  'logo-black.png', 
  'logo-transparent.png',
  'velvet-bg.jpg',
  'portapack.jpg',
  'velvet_web.png',
  'android-chrome-512x512.png',
  'android-chrome-192x192.png',
  'apple-touch-icon.png'
];

async function createBackupDir() {
  if (!fs.existsSync(BACKUP_DIR)) {
    fs.mkdirSync(BACKUP_DIR, { recursive: true });
    console.log('📁 Created backup directory');
  }
}

async function backupOriginal(filePath) {
  const fileName = path.basename(filePath);
  const backupPath = path.join(BACKUP_DIR, fileName);
  
  if (!fs.existsSync(backupPath)) {
    fs.copyFileSync(filePath, backupPath);
    console.log(`💾 Backed up: ${fileName}`);
  }
}

async function getFileSize(filePath) {
  const stats = fs.statSync(filePath);
  return (stats.size / 1024).toFixed(1); // KB
}

async function isAlreadyOptimized(filePath) {
  const fileName = path.basename(filePath);
  const backupPath = path.join(BACKUP_DIR, fileName);
  
  // If no backup exists, not optimized yet
  if (!fs.existsSync(backupPath)) {
    return false;
  }
  
  // If backup exists, check if current file is significantly smaller
  const currentSize = await getFileSize(filePath);
  const backupSize = await getFileSize(backupPath);
  
  // If current is at least 10% smaller than backup, consider it optimized
  const compressionRatio = (backupSize - currentSize) / backupSize;
  return compressionRatio > 0.1;
}

async function optimizeImage(filePath, force = false) {
  const fileName = path.basename(filePath);
  const ext = path.extname(fileName).toLowerCase();
  
  if (!fs.existsSync(filePath)) {
    console.log(`⚠️  File not found: ${fileName}`);
    return;
  }

  // Check if already optimized (unless forced)
  if (!force && await isAlreadyOptimized(filePath)) {
    console.log(`⏭️  Already optimized: ${fileName}`);
    return;
  }

  const originalSize = await getFileSize(filePath);
  
  try {
    // Backup original
    await backupOriginal(filePath);
    
    let sharpInstance = sharp(filePath);
    
    // Get image metadata
    const metadata = await sharpInstance.metadata();
    
    // Apply optimizations based on file type
    switch (ext) {
      case '.jpg':
      case '.jpeg':
        await sharpInstance
          .jpeg(OPTIMIZATION_CONFIG.jpeg)
          .toFile(filePath + '.tmp');
        break;
        
      case '.png':
        // For large PNGs, consider converting to WebP
        if (metadata.width > 512 || parseInt(originalSize) > 500) {
          console.log(`🔄 Converting large PNG to WebP: ${fileName}`);
          await sharpInstance
            .webp(OPTIMIZATION_CONFIG.webp)
            .toFile(filePath.replace('.png', '.webp'));
        }
        
        await sharpInstance
          .png(OPTIMIZATION_CONFIG.png)
          .toFile(filePath + '.tmp');
        break;
        
      default:
        console.log(`⏭️  Skipping: ${fileName} (unsupported format)`);
        return;
    }
    
    // Replace original with optimized
    fs.renameSync(filePath + '.tmp', filePath);
    
    const newSize = await getFileSize(filePath);
    const savings = ((originalSize - newSize) / originalSize * 100).toFixed(1);
    
    console.log(`✅ ${fileName}: ${originalSize}KB → ${newSize}KB (${savings}% smaller)`);
    
  } catch (error) {
    console.error(`❌ Error optimizing ${fileName}:`, error.message);
    
    // Clean up temp file if it exists
    const tempFile = filePath + '.tmp';
    if (fs.existsSync(tempFile)) {
      fs.unlinkSync(tempFile);
    }
  }
}

async function generateWebPVersions() {
  console.log('\n🔄 Generating WebP versions...');
  
  const imageFiles = fs.readdirSync(PUBLIC_DIR)
    .filter(file => /\.(jpg|jpeg|png)$/i.test(file))
    .filter(file => !file.includes('favicon')); // Skip favicons
  
  for (const file of imageFiles) {
    const filePath = path.join(PUBLIC_DIR, file);
    const webpPath = filePath.replace(/\.(jpg|jpeg|png)$/i, '.webp');
    
    if (!fs.existsSync(webpPath)) {
      try {
        await sharp(filePath)
          .webp(OPTIMIZATION_CONFIG.webp)
          .toFile(webpPath);
        
        const originalSize = await getFileSize(filePath);
        const webpSize = await getFileSize(webpPath);
        
        console.log(`📸 ${file} → WebP: ${originalSize}KB → ${webpSize}KB`);
      } catch (error) {
        console.error(`❌ Error creating WebP for ${file}:`, error.message);
      }
    }
  }
}

async function main() {
  const force = process.argv.includes('--force');
  console.log(`🚀 Starting image optimization${force ? ' (forced)' : ''}...\n`);
  
  await createBackupDir();
  
  let optimizedCount = 0;
  let skippedCount = 0;
  
  // Optimize target files
  for (const fileName of TARGET_FILES) {
    const filePath = path.join(PUBLIC_DIR, fileName);
    const wasOptimized = await isAlreadyOptimized(filePath);
    
    if (!force && wasOptimized) {
      skippedCount++;
    } else {
      optimizedCount++;
    }
    
    await optimizeImage(filePath, force);
  }
  
  // Generate WebP versions
  await generateWebPVersions();
  
  console.log('\n✅ Image optimization complete!');
  console.log(`📊 Optimized: ${optimizedCount}, Skipped: ${skippedCount}`);
  console.log('💡 Original files backed up to public/_originals/');
  console.log('🌐 WebP versions created for better performance');
  
  if (skippedCount > 0) {
    console.log('💡 Use --force flag to re-optimize all images');
  }
}

// Run if called directly
if (require.main === module) {
  main().catch(console.error);
}

module.exports = { optimizeImage, generateWebPVersions }; 