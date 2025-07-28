#!/usr/bin/env node
/**
 * Image Status Checker for Manic Agency
 * Shows current state of images and optimization status
 */

const fs = require('fs');
const path = require('path');
const { promisify } = require('util');
const sharp = require('sharp');

const PUBLIC_DIR = path.join(__dirname, '../public');
const BACKUP_DIR = path.join(PUBLIC_DIR, '_originals');
const EXTERNAL_BACKUP_DIR = path.join(__dirname, '../../image-backups');
const CACHE_FILE = path.join(__dirname, '.image-optimization-cache.json');
const REPORT_FILE = path.join(__dirname, '.optimization-report.json');

const SUPPORTED_EXTENSIONS = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.svg'];

async function getFileSize(filePath) {
  try {
    const stats = await promisify(fs.stat)(filePath);
    return stats.size;
  } catch {
    return 0;
  }
}

async function getImageDimensions(filePath) {
  try {
    const metadata = await sharp(filePath).metadata();
    return { width: metadata.width, height: metadata.height };
  } catch {
    return { width: 0, height: 0 };
  }
}

async function findImageFiles(dir, fileList = []) {
  const entries = await promisify(fs.readdir)(dir, { withFileTypes: true });
  
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    
    if (entry.isDirectory()) {
      if (!['_originals', 'node_modules', '.git'].includes(entry.name)) {
        await findImageFiles(fullPath, fileList);
      }
    } else if (entry.isFile()) {
      const ext = path.extname(entry.name).toLowerCase();
      if (SUPPORTED_EXTENSIONS.includes(ext)) {
        fileList.push(fullPath);
      }
    }
  }
  
  return fileList;
}

async function main() {
  console.log('📊 Image Status Report');
  console.log('====================\n');
  
  // Check cache
  let cache = {};
  if (fs.existsSync(CACHE_FILE)) {
    try {
      cache = JSON.parse(fs.readFileSync(CACHE_FILE, 'utf8'));
      console.log(`📂 Cache loaded: ${Object.keys(cache).length} entries`);
    } catch (e) {
      console.log('⚠️  Cache file exists but could not be loaded');
    }
  } else {
    console.log('ℹ️  No optimization cache found');
  }
  
  // Check last report
  if (fs.existsSync(REPORT_FILE)) {
    try {
      const report = JSON.parse(fs.readFileSync(REPORT_FILE, 'utf8'));
      console.log(`📄 Last optimization: ${report.date}`);
      console.log(`   Processed: ${report.processed} files`);
      console.log(`   Optimized: ${report.optimized}`);
      console.log(`   Saved: ${report.savedMB}MB\n`);
    } catch (e) {
      console.log('⚠️  Report file exists but could not be loaded\n');
    }
  }
  
  // Check backup directories
  console.log('📁 Backup Status:');
  if (fs.existsSync(BACKUP_DIR)) {
    const backupFiles = await findImageFiles(BACKUP_DIR);
    console.log(`   ✓ Local backup: ${backupFiles.length} files`);
  } else {
    console.log('   ✗ Local backup: Not found');
  }
  
  if (fs.existsSync(EXTERNAL_BACKUP_DIR)) {
    const externalFiles = await findImageFiles(EXTERNAL_BACKUP_DIR);
    console.log(`   ✓ External backup: ${externalFiles.length} files`);
  } else {
    console.log('   ✗ External backup: Not found');
  }
  
  console.log('\n📸 Current Images:');
  console.log('-----------------');
  
  const imageFiles = await findImageFiles(PUBLIC_DIR);
  const stats = {
    total: imageFiles.length,
    optimized: 0,
    unoptimized: 0,
    totalSize: 0,
    byType: {},
    largeImages: [],
    smallImages: []
  };
  
  // Analyze each image
  for (const filePath of imageFiles) {
    const relativePath = path.relative(PUBLIC_DIR, filePath);
    const ext = path.extname(filePath).toLowerCase();
    const size = await getFileSize(filePath);
    const sizeKB = size / 1024;
    
    stats.totalSize += size;
    
    // Count by type
    stats.byType[ext] = (stats.byType[ext] || 0) + 1;
    
    // Check if optimized (in cache)
    if (cache[relativePath] && cache[relativePath].optimized) {
      stats.optimized++;
    } else {
      stats.unoptimized++;
    }
    
    // Track large images
    if (sizeKB > 500) {
      const dims = await getImageDimensions(filePath);
      stats.largeImages.push({
        path: relativePath,
        sizeKB: sizeKB.toFixed(1),
        dimensions: `${dims.width}×${dims.height}`
      });
    }
    
    // Track very small images
    if (sizeKB < 10) {
      stats.smallImages.push({
        path: relativePath,
        sizeKB: sizeKB.toFixed(1)
      });
    }
  }
  
  // Display summary
  console.log(`Total images: ${stats.total}`);
  console.log(`Total size: ${(stats.totalSize / 1024 / 1024).toFixed(1)}MB`);
  console.log(`Average size: ${(stats.totalSize / stats.total / 1024).toFixed(1)}KB\n`);
  
  console.log('Optimization status:');
  console.log(`   ✅ Optimized: ${stats.optimized} (${(stats.optimized / stats.total * 100).toFixed(1)}%)`);
  console.log(`   ❌ Not optimized: ${stats.unoptimized} (${(stats.unoptimized / stats.total * 100).toFixed(1)}%)\n`);
  
  console.log('By file type:');
  Object.entries(stats.byType).forEach(([ext, count]) => {
    console.log(`   ${ext}: ${count} files`);
  });
  
  if (stats.largeImages.length > 0) {
    console.log(`\n⚠️  Large images (>500KB): ${stats.largeImages.length}`);
    stats.largeImages.slice(0, 10).forEach(img => {
      console.log(`   ${img.path}`);
      console.log(`   ${img.sizeKB}KB - ${img.dimensions}`);
    });
    if (stats.largeImages.length > 10) {
      console.log(`   ... and ${stats.largeImages.length - 10} more`);
    }
  }
  
  // Recommendations
  console.log('\n💡 Recommendations:');
  if (stats.unoptimized > 0) {
    console.log(`   - Run 'npm run optimize:images' to optimize ${stats.unoptimized} images`);
  }
  if (stats.largeImages.length > 0) {
    console.log(`   - ${stats.largeImages.length} images are large and may benefit from resizing`);
    console.log('   - Use \'npm run optimize:images:preview\' to see potential savings');
  }
  if (!fs.existsSync(BACKUP_DIR) && !fs.existsSync(EXTERNAL_BACKUP_DIR)) {
    console.log('   - No backups found - images haven\'t been optimized yet');
  }
  
  console.log('\n📋 Quick commands:');
  console.log('   npm run optimize:images:preview  # Preview optimizations');
  console.log('   npm run optimize:images          # Interactive optimization');
  console.log('   npm run optimize:images:auto     # Auto-optimize with resizing');
  console.log('   npm run restore:images           # Restore from backup');
}

// Run if called directly
if (require.main === module) {
  main().catch(console.error);
}