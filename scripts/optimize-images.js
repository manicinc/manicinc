#!/usr/bin/env node
/**
 * Image Optimization Script for Manic Agency
 * ==========================================
 * 
 * A comprehensive image optimization tool that intelligently compresses and resizes images
 * for optimal web performance while maintaining visual quality.
 * 
 * Features:
 * - Smart compression with content analysis
 * - Flexible resizing strategies (standard 2K, conservative, aggressive, custom)
 * - Scaling options for high-resolution preservation (1x to 3x)
 * - Modern format generation (WebP, AVIF)
 * - Parallel processing with progress tracking
 * - Safe backups with deduplication
 * - Interactive and automated modes
 * - Intelligent caching system
 * - Format conversion (PNG to JPEG when beneficial)
 * - SVG optimization
 * 
 * @author Manic Agency
 * @version 2.0.0
 */

const sharp = require('sharp');
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const readline = require('readline');
const { promisify } = require('util');
const { Worker } = require('worker_threads');
const os = require('os');

// ============================================================================
// CONFIGURATION
// ============================================================================

/**
 * Directory Configuration
 * These paths define where images are located and where backups are stored
 */
const PUBLIC_DIR = path.join(__dirname, '../public');
const BACKUP_DIR = path.join(PUBLIC_DIR, '_originals');
const EXTERNAL_BACKUP_DIR = path.join(__dirname, '../../image-backups');
const CACHE_FILE = path.join(__dirname, '.image-optimization-cache.json');
const LOG_FILE = path.join(__dirname, '.image-optimization.log');

/**
 * Processing Configuration
 * Controls parallel processing for optimal performance
 */
const MAX_WORKERS = Math.max(1, os.cpus().length - 1);
const BATCH_SIZE = 10;

/**
 * Compression Presets
 * Different compression strategies for various use cases
 */
const COMPRESSION_PRESETS = {
  // Smart compression (default) - Analyzes each image individually
  smart: {
    name: 'Smart (Adaptive)',
    description: 'Analyzes each image and applies optimal compression',
    analyze: true,
    skipWellOptimized: true,
    baseQuality: {
      photo: { high: 75, medium: 68, low: 60 },
      screenshot: { high: 78, medium: 70, low: 65 },
      logo: { high: 85, medium: 78, low: 72 },
      diagram: { high: 75, medium: 68, low: 62 },
      background: { high: 55, medium: 48, low: 40 },
      meme: { high: 65, medium: 58, low: 50 }
    }
  },
  
  // Heavy compression - Maximum file size reduction
  heavy: {
    name: 'Heavy',
    description: 'Aggressive compression for maximum file size reduction',
    analyze: false,
    skipWellOptimized: false,
    fixedQuality: {
      jpeg: 60,
      png: 65,
      webp: 50,
      avif: 45
    }
  },
  
  // Light compression - Preserve quality
  light: {
    name: 'Light',
    description: 'Minimal compression to preserve quality',
    analyze: false,
    skipWellOptimized: false,
    fixedQuality: {
      jpeg: 85,
      png: 90,
      webp: 80,
      avif: 75
    }
  }
};

/**
 * Image Format Optimization Settings
 * Base settings for each format - actual values determined by compression preset
 */
const OPTIMIZATION_CONFIG = {
  jpeg: {
    progressive: true,
    mozjpeg: true,
    // Quality determined by preset/analysis
  },
  png: {
    compressionLevel: 9,
    adaptiveFiltering: true,
    // Quality and other settings determined by preset/analysis
  },
  webp: {
    effort: 6,
    smartSubsample: true,
    // Quality determined by preset/analysis
  },
  avif: {
    effort: 9,
    chromaSubsampling: '4:2:0',
    // Quality determined by preset/analysis
  }
};

/**
 * Resizing Configuration
 * Controls how images are resized with various strategies and scaling options
 * 
 * IMPORTANT: By default, resizing preserves aspect ratios (no cropping).
 * Images are fit within target dimensions using letterboxing/pillarboxing.
 * Smart crop must be explicitly enabled and will CROP images to exact dimensions.
 */
const RESIZE_CONFIG = {
  // Smart crop detection - DISABLED by default to prevent unexpected cropping
  // When enabled, uses AI to find important parts of image
  smartCrop: false,
  
  // Resolution tiers for categorizing images
  resolutionTiers: {
    'small': { width: 1200, name: 'Small (1200px)' },
    'medium': { width: 1600, name: 'Medium (1600px)' },
    'large': { width: 2000, name: 'Large (2K)' },
    'xlarge': { width: 2560, name: 'Extra Large (2.5K)' },
    'ultra': { width: 3840, name: 'Ultra (4K)' }
  },
  
  // Default target resolution (2K is a good balance)
  defaultTargetResolution: 2000,
  
  // Minimum dimensions to prevent over-downsizing
  minWidth: 800,
  minHeight: 600,
  
  // Scaling factors for high-resolution preservation
  scalingFactors: {
    '1.0x (Standard)': 1.0,
    '1.25x (125%)': 1.25,
    '1.5x (150%)': 1.5,
    '1.75x (175%)': 1.75,
    '2.0x (200%)': 2.0,
    '2.25x (225%)': 2.25,
    '2.5x (250%)': 2.5,
    '2.75x (275%)': 2.75,
    '3.0x (300%)': 3.0,
  },
  
  // Default scaling factor
  defaultScale: 1.0,
  
  // Common aspect ratios for detection
  aspectRatios: {
    '16:9': 1.7778,
    '4:3': 1.3333,
    '1:1': 1.0,
    '3:2': 1.5,
    '2:3': 0.6667,
    '9:16': 0.5625, // Mobile/portrait
    '21:9': 2.3333, // Ultra-wide
  },
  
  // Size presets for different use cases
  presets: {
    hero: {
      name: 'Hero/Banner',
      maxWidth: 2560,
      maxHeight: 1440,
      quality: 82,
      description: 'Full-width hero sections and banners (QHD base)'
    },
    featured: {
      name: 'Featured/Card',
      maxWidth: 1920,
      maxHeight: 1280,
      quality: 75,
      description: 'Blog cards, featured content (Full HD+ base)'
    },
    content: {
      name: 'Content/Article',
      maxWidth: 1600,
      maxHeight: 1200,
      quality: 72,
      description: 'Images within blog posts and articles'
    },
    thumbnail: {
      name: 'Thumbnail',
      maxWidth: 800,
      maxHeight: 600,
      quality: 65,
      description: 'Small preview images (sharp on retina)'
    },
    social: {
      name: 'Social Media',
      maxWidth: 1600,
      maxHeight: 900,
      quality: 78,
      description: 'Open Graph and social sharing (high-res base)'
    },
    portrait: {
      name: 'Portrait/Mobile',
      maxWidth: 1200,
      maxHeight: 2000,
      quality: 73,
      description: 'Mobile-first and portrait layouts'
    },
    panoramic: {
      name: 'Panoramic',
      maxWidth: 3440,
      maxHeight: 1440,
      quality: 80,
      description: 'Ultra-wide and panoramic images'
    },
    square: {
      name: 'Square',
      maxWidth: 1600,
      maxHeight: 1600,
      quality: 75,
      description: 'Square format for social media (high-res base)'
    },
    original: {
      name: 'Original (Web-safe)',
      maxWidth: 3840,
      maxHeight: 2160,
      quality: 85,
      description: 'Minimal resize, preserve quality (4K base)'
    },
    background: {
      name: 'Background',
      maxWidth: 2560,
      maxHeight: 1440,
      quality: 65,
      description: 'Background images, patterns, textures'
    }
  },
  
  // Auto-detection patterns for matching images to presets
  patterns: {
    hero: /hero|banner|header|cover/i,
    featured: /featured|card|preview|listing/i,
    thumbnail: /thumb|small|mini|icon/i,
    social: /og|opengraph|twitter|social|share/i,
    portrait: /portrait|mobile|vertical|story/i,
    panoramic: /panoramic|wide|landscape|pano/i,
    square: /square|avatar|profile|instagram/i,
    background: /\/(bg-|background-|pattern|texture)|[-_](bg|background|pattern|texture)[-.]/i,
  },
  
  // Resize modes for different workflows
  modes: {
    AUTO: 'auto',           // Auto-detect best preset
    CONFIRM: 'confirm',     // Ask for each image
    BATCH: 'batch',         // Apply same to similar images
    PRESET: 'preset',       // Use specific preset
    UNIVERSAL: 'universal', // Resize all to target resolution
    TIERED: 'tiered',      // Use resolution tiers
  },
  
  // Resize strategies control how aggressively to resize
  strategies: {
    CONSERVATIVE: 'conservative', // Only resize if exceeds preset
    STANDARD: 'standard',         // Resize all to 2K max (default)
    AGGRESSIVE: 'aggressive',     // Resize more aggressively using tiers
    CUSTOM: 'custom'             // User-defined target
  },
  
  defaultStrategy: 'standard',
  universalTargetWidth: 2000  // 2K standard
};

/**
 * File Processing Configuration
 */
const SUPPORTED_EXTENSIONS = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.svg'];
const MIN_SIZE_KB = 2; // Skip tiny images like favicons
const EXCLUDED_DIRS = ['_originals', 'node_modules', '.git'];

// ============================================================================
// GLOBAL STATE
// ============================================================================

/**
 * Cache for tracking optimized images
 * Structure: { [relativePath]: { hash, optimized, timestamp, ... } }
 */
let optimizationCache = {};

/**
 * Processing flags and options
 */
let isInteractive = true;
let isDryRun = false;
let generateAvif = false;
let verboseMode = false;
let enableSmartCrop = false; // Smart crop disabled by default
let resizeMode = RESIZE_CONFIG.modes.CONFIRM;
let resizeStrategy = RESIZE_CONFIG.strategies.STANDARD;
let compressionPreset = COMPRESSION_PRESETS.smart;
let customTargetWidth = RESIZE_CONFIG.universalTargetWidth;
let globalScalingFactor = RESIZE_CONFIG.defaultScale;

/**
 * Statistics tracking for reporting
 */
const stats = {
  totalFiles: 0,
  optimized: 0,
  skipped: 0,
  errors: 0,
  resized: 0,
  compressed: 0,
  totalSavedKB: 0,
  startTime: Date.now(),
};

/**
 * Batch processing settings
 */
let batchResizeSettings = null;

// ============================================================================
// UTILITY CLASSES
// ============================================================================

/**
 * Enhanced logging with file output
 * Logs to both console (when verbose) and log file
 */
class Logger {
  constructor(logFile) {
    this.logFile = logFile;
    this.logStream = fs.createWriteStream(logFile, { flags: 'a' });
  }

  log(level, message, data = {}) {
    const timestamp = new Date().toISOString();
    const logEntry = {
      timestamp,
      level,
      message,
      ...data
    };
    
    // Console output for verbose mode or errors
    if (verboseMode || level === 'error') {
      console.log(`[${level.toUpperCase()}] ${message}`, data);
    }
    
    // Always write to log file
    this.logStream.write(JSON.stringify(logEntry) + '\n');
  }

  close() {
    this.logStream.end();
  }
}

/**
 * Progress reporter for visual feedback
 * Shows progress bar with ETA calculation
 */
class ProgressReporter {
  constructor(total) {
    this.total = total;
    this.current = 0;
    this.startTime = Date.now();
  }

  update(increment = 1) {
    this.current += increment;
    const percentage = ((this.current / this.total) * 100).toFixed(1);
    const elapsed = (Date.now() - this.startTime) / 1000;
    const rate = this.current / elapsed;
    const remaining = (this.total - this.current) / rate;
    
    process.stdout.write(`\r📊 Progress: ${this.current}/${this.total} (${percentage}%) - ETA: ${remaining.toFixed(0)}s`);
    
    if (this.current === this.total) {
      process.stdout.write('\n');
    }
  }
}

// Initialize logger
const logger = new Logger(LOG_FILE);

// ============================================================================
// CACHE MANAGEMENT
// ============================================================================

/**
 * Load optimization cache from disk
 * Validates entries and removes expired ones
 */
async function loadCache() {
  try {
    if (fs.existsSync(CACHE_FILE)) {
      const cacheData = fs.readFileSync(CACHE_FILE, 'utf8');
      const rawCache = JSON.parse(cacheData);
      const totalEntries = Object.keys(rawCache).length;
      
      // Validate cache entries (30-day expiry)
      const validEntries = Object.entries(rawCache).filter(([path, data]) => {
        return data.hash && data.timestamp && (Date.now() - data.timestamp < 30 * 24 * 60 * 60 * 1000);
      });
      
      optimizationCache = Object.fromEntries(validEntries);
      
      console.log(`📂 Loaded optimization cache:`);
      console.log(`   Total entries: ${totalEntries}`);
      console.log(`   Valid entries: ${validEntries.length}`);
      if (totalEntries > validEntries.length) {
        console.log(`   Expired entries removed: ${totalEntries - validEntries.length}`);
      }
      
      logger.log('info', 'Cache loaded and validated', { 
        total: totalEntries, 
        valid: validEntries.length,
        expired: totalEntries - validEntries.length 
      });
    }
  } catch (error) {
    console.log('⚠️  Could not load cache, starting fresh');
    logger.log('error', 'Cache load failed', { error: error.message });
    optimizationCache = {};
  }
}

/**
 * Save optimization cache to disk
 * Sorts entries for better readability
 */
async function saveCache() {
  try {
    const sortedCache = Object.fromEntries(
      Object.entries(optimizationCache).sort(([a], [b]) => a.localeCompare(b))
    );
    
    fs.writeFileSync(CACHE_FILE, JSON.stringify(sortedCache, null, 2));
    console.log('💾 Optimization cache saved');
    logger.log('info', 'Cache saved', { entries: Object.keys(sortedCache).length });
  } catch (error) {
    console.error('❌ Could not save cache:', error.message);
    logger.log('error', 'Cache save failed', { error: error.message });
  }
}

// ============================================================================
// FILE SYSTEM UTILITIES
// ============================================================================

/**
 * Calculate MD5 hash of a file
 * Used for cache validation and deduplication
 */
async function getFileHash(filePath) {
  try {
    const fileBuffer = await promisify(fs.readFile)(filePath);
    return crypto.createHash('md5').update(fileBuffer).digest('hex');
  } catch (error) {
    logger.log('error', 'Hash calculation failed', { file: filePath, error: error.message });
    return null;
  }
}

/**
 * Get file size in KB
 */
async function getFileSize(filePath) {
  const stats = await promisify(fs.stat)(filePath);
  return (stats.size / 1024).toFixed(1);
}

/**
 * Find all image files recursively
 * Filters by extension and minimum size
 */
async function findImageFiles(dir, fileList = []) {
  const entries = await promisify(fs.readdir)(dir, { withFileTypes: true });
  
  const promises = entries.map(async (entry) => {
    const fullPath = path.join(dir, entry.name);
    
    if (entry.isDirectory()) {
      // Skip excluded directories
      if (!EXCLUDED_DIRS.includes(entry.name) && !entry.name.startsWith('.')) {
        await findImageFiles(fullPath, fileList);
      }
    } else if (entry.isFile()) {
      const ext = path.extname(entry.name).toLowerCase();
      if (SUPPORTED_EXTENSIONS.includes(ext)) {
        // Check file size - skip tiny files
        const stats = await promisify(fs.stat)(fullPath);
        const sizeKB = stats.size / 1024;
        
        if (sizeKB >= MIN_SIZE_KB) {
          fileList.push({
            path: fullPath,
            size: stats.size,
            ext: ext,
            mtime: stats.mtime
          });
        }
      }
    }
  });
  
  await Promise.all(promises);
  
  // Sort by size (process larger files first for better progress feedback)
  return fileList.sort((a, b) => b.size - a.size);
}

/**
 * Create backup directories if they don't exist
 */
async function createBackupDir() {
  const dirs = [BACKUP_DIR, EXTERNAL_BACKUP_DIR];
  
  for (const dir of dirs) {
    if (!fs.existsSync(dir)) {
      await promisify(fs.mkdir)(dir, { recursive: true });
      console.log(`📁 Created backup directory: ${path.relative(process.cwd(), dir)}`);
      logger.log('info', 'Backup directory created', { dir });
    }
  }
}

/**
 * Windows-safe temp file cleanup with retry logic
 * Handles EBUSY errors that occur on Windows due to file locking
 */
async function cleanupTempFileWithRetry(filePath, maxRetries = 3, delay = 100) {
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
      return; // Success
    } catch (error) {
      if (error.code === 'EBUSY' || error.code === 'ENOENT') {
        if (attempt < maxRetries) {
          // Wait before retry
          await new Promise(resolve => setTimeout(resolve, delay * attempt));
          continue;
        }
        // Last attempt failed, log but don't throw
        console.warn(`⚠️  Could not cleanup temp file: ${path.basename(filePath)} (file locked)`);
        return;
      }
      // Non-recoverable error
      throw error;
    }
  }
}

/**
 * Windows-safe file rename with retry logic
 */
function renameFileWithRetry(oldPath, newPath, maxRetries = 3, delay = 100) {
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      fs.renameSync(oldPath, newPath);
      return; // Success
    } catch (error) {
      if (error.code === 'EBUSY' && attempt < maxRetries) {
        // Wait before retry
        setTimeout(() => {}, delay * attempt);
        continue;
      }
      // Last attempt or non-recoverable error
      throw error;
    }
  }
}

/**
 * Backup original file with deduplication
 * Creates backups in both local and external directories
 */
async function backupOriginal(filePath) {
  const relativePath = path.relative(PUBLIC_DIR, filePath);
  const backupPath = path.join(BACKUP_DIR, relativePath);
  const externalBackupPath = path.join(EXTERNAL_BACKUP_DIR, relativePath);
  
  // Create backup directory structure
  await promisify(fs.mkdir)(path.dirname(backupPath), { recursive: true });
  await promisify(fs.mkdir)(path.dirname(externalBackupPath), { recursive: true });
  
  // Check if backups already exist and are identical
  const fileHash = await getFileHash(filePath);
  
  for (const bPath of [backupPath, externalBackupPath]) {
    if (fs.existsSync(bPath)) {
      const backupHash = await getFileHash(bPath);
      if (backupHash === fileHash) {
        continue; // Skip identical backup
      }
    }
    
    if (!isDryRun) {
      await promisify(fs.copyFile)(filePath, bPath);
      logger.log('info', 'File backed up', { file: relativePath, backup: bPath });
    }
  }
}

// ============================================================================
// USER INTERACTION UTILITIES
// ============================================================================

/**
 * Ask a yes/no question
 */
async function askQuestion(question) {
  if (!isInteractive || isDryRun) return true;
  
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });
  
  return new Promise((resolve) => {
    rl.question(question + ' (y/N): ', (answer) => {
      rl.close();
      resolve(answer.toLowerCase() === 'y' || answer.toLowerCase() === 'yes');
    });
  });
}

// ============================================================================
// IMAGE ANALYSIS FUNCTIONS
// ============================================================================

/**
 * Analyze image complexity and characteristics
 * This is the core intelligence for smart compression
 */
async function analyzeImageComplexity(filePath) {
  try {
    const metadata = await sharp(filePath).metadata();
    const stats = await sharp(filePath).stats();
    const fileSize = (await promisify(fs.stat)(filePath)).size;
    const fileName = path.basename(filePath);
    
    // Calculate compression metrics
    const pixelCount = metadata.width * metadata.height;
    const uncompressedSize = pixelCount * (metadata.channels || 3);
    const currentCompressionRatio = 1 - (fileSize / uncompressedSize);
    const bytesPerPixel = fileSize / pixelCount;
    
    // Build comprehensive analysis
    const analysis = {
      // Basic metrics
      width: metadata.width,
      height: metadata.height,
      format: metadata.format,
      channels: metadata.channels,
      hasAlpha: metadata.channels === 4,
      fileSize: fileSize,
      fileSizeKB: fileSize / 1024,
      fileName: fileName,
      
      // Compression metrics
      currentCompressionRatio: currentCompressionRatio,
      bytesPerPixel: bytesPerPixel,
      isAlreadyCompressed: currentCompressionRatio > 0.85 || bytesPerPixel < 0.5,
      
      // Content analysis
      entropy: await calculateImageEntropy(stats),
      colorCount: await estimateColorCount(stats),
      hasText: await detectTextContent(stats),
      imageType: await detectImageType(metadata, stats, filePath),
      
      // Quality metrics
      estimatedQuality: await estimateCurrentQuality(bytesPerPixel, metadata.format),
      hasCompressionArtifacts: bytesPerPixel < 0.3,
    };
    
    return analysis;
  } catch (error) {
    logger.log('error', 'Image analysis failed', { file: filePath, error: error.message });
    return null;
  }
}

/**
 * Calculate image entropy (complexity)
 * Higher entropy = more complex/detailed image
 */
async function calculateImageEntropy(stats) {
  let totalEntropy = 0;
  
  stats.channels.forEach(channel => {
    const mean = channel.mean;
    const std = channel.std;
    const range = channel.max - channel.min;
    
    // Higher std and range = more complex image
    const channelEntropy = (std / 128) * (range / 255);
    totalEntropy += channelEntropy;
  });
  
  // Normalize to 0-1 scale
  return Math.min(1, totalEntropy / stats.channels.length);
}

/**
 * Estimate color count based on channel statistics
 */
async function estimateColorCount(stats) {
  let colorVariation = 1;
  
  stats.channels.forEach(channel => {
    const range = channel.max - channel.min;
    const std = channel.std;
    colorVariation *= (range / 255) * (std / 128);
  });
  
  // Categorize color complexity
  if (colorVariation < 0.01) return 'low';      // < 256 colors
  if (colorVariation < 0.1) return 'medium';    // < 10k colors  
  return 'high';                                 // > 10k colors
}

/**
 * Detect if image likely contains text or UI elements
 * Text images need different compression treatment
 */
async function detectTextContent(stats) {
  const avgStd = stats.channels.reduce((sum, ch) => sum + ch.std, 0) / stats.channels.length;
  const avgRange = stats.channels.reduce((sum, ch) => sum + (ch.max - ch.min), 0) / stats.channels.length;
  
  // High contrast with full range suggests text/UI
  return avgStd > 80 && avgRange > 200;
}

/**
 * Detect image type based on characteristics and filename
 */
async function detectImageType(metadata, stats, filePath) {
  const fileName = path.basename(filePath).toLowerCase();
  const entropy = await calculateImageEntropy(stats);
  const hasText = await detectTextContent(stats);
  
  // Check filename patterns first
  if (/screenshot|capture|snap/i.test(fileName)) return 'screenshot';
  if (/logo|icon|brand/i.test(fileName)) return 'logo';
  if (/bg|background|pattern|texture/i.test(fileName)) return 'background';
  if (/chart|graph|diagram/i.test(fileName)) return 'diagram';
  if (/meme|funny|joke|reddit|twitter|tweet|shitpost/i.test(fileName)) return 'meme';
  
  // Analyze image characteristics
  if (hasText && entropy < 0.3) return 'screenshot';
  if (metadata.width === metadata.height && metadata.width < 512) return 'icon';
  if (entropy < 0.2) return 'simple-graphic';
  if (entropy > 0.7) return 'photo';
  
  return 'photo'; // Default
}

/**
 * Estimate current JPEG quality
 * Helps avoid re-compressing already optimized images
 */
async function estimateCurrentQuality(bytesPerPixel, format) {
  if (format !== 'jpeg') return null;
  
  // Rough estimation based on bytes per pixel
  if (bytesPerPixel > 1.5) return 95;   // Very high quality
  if (bytesPerPixel > 1.0) return 90;   // High quality
  if (bytesPerPixel > 0.6) return 85;   // Good quality
  if (bytesPerPixel > 0.4) return 75;   // Medium quality
  if (bytesPerPixel > 0.25) return 65;  // Low quality
  return 50; // Very low quality
}

/**
 * Determine optimal compression settings based on analysis
 * This is the brain of smart compression
 */
function determineOptimalCompression(analysis) {
  const { 
    imageType, 
    entropy, 
    colorCount, 
    hasAlpha, 
    isAlreadyCompressed,
    estimatedQuality,
    fileSizeKB,
    hasText,
    bytesPerPixel
  } = analysis;
  
  // For smart preset, check if already well optimized
  if (compressionPreset.skipWellOptimized) {
    if (isAlreadyCompressed && bytesPerPixel < 0.3) {
      return {
        quality: Math.max(estimatedQuality - 10, 60),
        skipOptimization: bytesPerPixel < 0.2,
        reason: 'Already well compressed'
      };
    }
  }
  
  // Use fixed quality for non-smart presets
  if (!compressionPreset.analyze) {
    const format = analysis.format || 'jpeg';
    return {
      quality: compressionPreset.fixedQuality[format] || compressionPreset.fixedQuality.jpeg,
      skipOptimization: false,
      reason: `${compressionPreset.name} preset`
    };
  }
  
  // Smart compression based on image type
  const qualitySettings = compressionPreset.baseQuality[imageType] || compressionPreset.baseQuality.photo;
  
  // Determine complexity level
  let complexityLevel = 'medium';
  if (entropy > 0.7 || colorCount === 'high') complexityLevel = 'high';
  if (entropy < 0.3 && colorCount === 'low') complexityLevel = 'low';
  
  // Get base quality
  let quality = qualitySettings[complexityLevel];
  
  // Adjust based on file size
  if (fileSizeKB > 3000) quality -= 15;
  else if (fileSizeKB > 2000) quality -= 12;
  else if (fileSizeKB > 1000) quality -= 8;
  else if (fileSizeKB > 500) quality -= 5;
  else if (fileSizeKB < 100) quality += 3;
  
  // Adjust for text content
  if (hasText && quality < 65) quality = 65;
  
  // Special handling for social media images
  if (/social|og|twitter|reddit/i.test(analysis.fileName) && !hasText) {
    quality = Math.min(quality, 68);
  }
  
  // PNG specific adjustments
  if (!hasAlpha && colorCount !== 'high' && analysis.format === 'png') {
    return {
      quality: Math.min(quality, 72),
      convertToJpeg: true,
      reason: `PNG without transparency, ${colorCount} colors - convert to JPEG`
    };
  }
  
  // Ensure quality bounds
  quality = Math.max(40, Math.min(85, quality));
  
  return {
    quality: quality,
    effort: complexityLevel === 'high' ? 'max' : 'balanced',
    imageType: imageType,
    complexity: complexityLevel,
    targetCompression: `${Math.round((1 - quality/100) * 100)}%`,
    reason: `${imageType} image with ${complexityLevel} complexity`
  };
}

/**
 * Check if image is already optimized using cache
 */
async function isAlreadyOptimized(filePath) {
  const fileHash = await getFileHash(filePath);
  const relativePath = path.relative(PUBLIC_DIR, filePath);
  
  if (!fileHash) return false;
  
  // Check cache first
  if (optimizationCache[relativePath]) {
    const cached = optimizationCache[relativePath];
    if (cached.hash === fileHash && cached.optimized) {
      // File hasn't changed and was previously optimized
      return true;
    }
  }
  
  return false;
}

// ============================================================================
// RESIZE ANALYSIS FUNCTIONS
// ============================================================================

/**
 * Determine resolution tier based on current width
 */
function determineResolutionTier(width) {
  if (width <= 1200) return RESIZE_CONFIG.resolutionTiers.small;
  if (width <= 1600) return RESIZE_CONFIG.resolutionTiers.medium;
  if (width <= 2000) return RESIZE_CONFIG.resolutionTiers.large;
  if (width <= 2560) return RESIZE_CONFIG.resolutionTiers.xlarge;
  return RESIZE_CONFIG.resolutionTiers.ultra;
}

/**
 * Get target tier for aggressive resizing
 */
function getTargetTier(currentTier) {
  if (currentTier === RESIZE_CONFIG.resolutionTiers.ultra) {
    return RESIZE_CONFIG.resolutionTiers.large; // 4K → 2K
  }
  if (currentTier === RESIZE_CONFIG.resolutionTiers.xlarge) {
    return RESIZE_CONFIG.resolutionTiers.large; // 2.5K → 2K
  }
  return currentTier; // Keep as is for others
}

/**
 * Detect aspect ratio and find closest standard ratio
 */
function detectAspectRatio(width, height) {
  const ratio = width / height;
  let closestRatio = '16:9';
  let minDiff = Infinity;
  
  for (const [name, value] of Object.entries(RESIZE_CONFIG.aspectRatios)) {
    const diff = Math.abs(ratio - value);
    if (diff < minDiff) {
      minDiff = diff;
      closestRatio = name;
    }
  }
  
  return { ratio, closestRatio, isPortrait: height > width };
}

/**
 * Auto-detect best preset based on image path and dimensions
 */
function detectBestPreset(filePath, metadata) {
  const relativePath = path.relative(PUBLIC_DIR, filePath);
  const { width, height } = metadata;
  const { isPortrait } = detectAspectRatio(width, height);
  
  // Check patterns in order of priority
  const patternPriority = [
    'thumbnail',
    'social',
    'square',
    'portrait',
    'panoramic',
    'featured',
    'background',
    'hero'
  ];
  
  for (const presetKey of patternPriority) {
    const pattern = RESIZE_CONFIG.patterns[presetKey];
    if (pattern && pattern.test(relativePath)) {
      return RESIZE_CONFIG.presets[presetKey];
    }
  }
  
  // Fallback based on dimensions
  if (isPortrait) {
    return RESIZE_CONFIG.presets.portrait;
  } else if (width > 2400) {
    return RESIZE_CONFIG.presets.hero;
  } else if (width > 1200) {
    return RESIZE_CONFIG.presets.featured;
  } else if (width < 600) {
    return RESIZE_CONFIG.presets.thumbnail;
  }
  
  return RESIZE_CONFIG.presets.content;
}

/**
 * Calculate resize suggestions with scaling
 */
function calculateResizeSuggestions(metadata, preset, scaleFactor = 1.0) {
  const { width, height } = metadata;
  const aspectRatio = width / height;
  
  // Apply scaling factor to preset dimensions
  const scaledMaxWidth = Math.round(preset.maxWidth * scaleFactor);
  const scaledMaxHeight = Math.round(preset.maxHeight * scaleFactor);
  
  // Calculate dimensions maintaining aspect ratio
  let newWidth = width;
  let newHeight = height;
  
  if (width > scaledMaxWidth || height > scaledMaxHeight) {
    const widthRatio = scaledMaxWidth / width;
    const heightRatio = scaledMaxHeight / height;
    const scale = Math.min(widthRatio, heightRatio);
    
    newWidth = Math.round(width * scale);
    newHeight = Math.round(height * scale);
  }
  
  // Ensure minimum dimensions
  const scaledMinWidth = Math.round(RESIZE_CONFIG.minWidth * Math.max(1, scaleFactor * 0.75));
  const scaledMinHeight = Math.round(RESIZE_CONFIG.minHeight * Math.max(1, scaleFactor * 0.75));
  
  if (newWidth < scaledMinWidth && newHeight < scaledMinHeight) {
    const scale = Math.max(
      scaledMinWidth / newWidth,
      scaledMinHeight / newHeight
    );
    newWidth = Math.round(newWidth * scale);
    newHeight = Math.round(newHeight * scale);
  }
  
  return { width: newWidth, height: newHeight };
}

/**
 * Calculate dimensions for a specific target width
 */
function calculateDimensionsForWidth(current, targetWidth) {
  const aspectRatio = current.width / current.height;
  const targetHeight = Math.round(targetWidth / aspectRatio);
  return { width: targetWidth, height: targetHeight };
}

/**
 * Analyze image for resize opportunities
 * Implements different strategies (standard, conservative, aggressive)
 */
async function analyzeImageForResize(metadata, filePath) {
  const { width, height } = metadata;
  const relativePath = path.relative(PUBLIC_DIR, filePath);
  const aspectRatio = width / height;
  
  // Determine target based on strategy
  let targetWidth = RESIZE_CONFIG.universalTargetWidth;
  let reason = '';
  let needsResize = false;
  
  // Apply different strategies
  switch (resizeStrategy) {
    case RESIZE_CONFIG.strategies.CONSERVATIVE:
      // Original behavior - only resize if exceeds preset
      const detectedPreset = detectBestPreset(filePath, metadata);
      const scaledMaxWidth = Math.round(detectedPreset.maxWidth * globalScalingFactor);
      if (width > scaledMaxWidth) {
        targetWidth = scaledMaxWidth;
        needsResize = true;
        reason = `Exceeds ${detectedPreset.name} preset`;
      }
      break;
      
    case RESIZE_CONFIG.strategies.STANDARD:
      // Resize anything over 2K (or scaled target)
      targetWidth = Math.round(RESIZE_CONFIG.universalTargetWidth * globalScalingFactor);
      if (width > targetWidth) {
        needsResize = true;
        reason = `Standardizing to ${targetWidth}px (2K${globalScalingFactor !== 1.0 ? ` × ${globalScalingFactor}` : ''})`;
      }
      break;
      
    case RESIZE_CONFIG.strategies.AGGRESSIVE:
      // More aggressive - resize based on tiers
      const tier = determineResolutionTier(width);
      const targetTier = getTargetTier(tier);
      targetWidth = Math.round(targetTier.width * globalScalingFactor);
      
      if (width > targetWidth * 1.1) { // 10% tolerance
        needsResize = true;
        reason = `Optimizing to ${targetTier.name}`;
      }
      break;
      
    case RESIZE_CONFIG.strategies.CUSTOM:
      // User-defined target
      targetWidth = Math.round(customTargetWidth * globalScalingFactor);
      if (width > targetWidth) {
        needsResize = true;
        reason = `Custom target: ${targetWidth}px`;
      }
      break;
  }
  
  // Skip if already small
  if (width <= RESIZE_CONFIG.minWidth && height <= RESIZE_CONFIG.minHeight) {
    return { needsResize: false, reason: 'Already at minimum size' };
  }
  
  // Skip if no significant reduction
  if (!needsResize) {
    return { needsResize: false, reason: 'Already optimally sized' };
  }
  
  // Calculate new dimensions
  const targetHeight = Math.round(targetWidth / aspectRatio);
  const pixelReduction = 1 - (targetWidth * targetHeight) / (width * height);
  
  const { closestRatio } = detectAspectRatio(width, height);
  
  return {
    needsResize: true,
    current: { width, height },
    suggestion: { width: targetWidth, height: targetHeight },
    targetWidth: targetWidth,
    aspectRatio: closestRatio,
    pixelReduction: pixelReduction * 100,
    fileSizeReduction: pixelReduction * 0.7 * 100, // Estimated
    reason: reason
  };
}

// ============================================================================
// USER INTERACTION FUNCTIONS
// ============================================================================

/**
 * Choose scaling factor interactively
 */
async function chooseScalingFactor() {
  console.log('\n🔍 Choose scaling factor for high-resolution preservation:');
  const scaleKeys = Object.keys(RESIZE_CONFIG.scalingFactors);
  
  scaleKeys.forEach((key, index) => {
    const value = RESIZE_CONFIG.scalingFactors[key];
    const isDefault = value === RESIZE_CONFIG.defaultScale;
    console.log(`   [${index + 1}] ${key}${isDefault ? ' (default)' : ''}`);
  });
  
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });
  
  return new Promise((resolve) => {
    rl.question(`   Select scale (1-${scaleKeys.length}): `, (answer) => {
      rl.close();
      const index = parseInt(answer) - 1;
      const key = scaleKeys[index];
      
      if (key && RESIZE_CONFIG.scalingFactors[key]) {
        resolve(RESIZE_CONFIG.scalingFactors[key]);
      } else {
        resolve(RESIZE_CONFIG.defaultScale);
      }
    });
  });
}

/**
 * Choose target width for resizing
 */
async function chooseTargetWidth() {
  console.log('\n   Common target widths:');
  console.log('   [1] 1200px (Small)');
  console.log('   [2] 1600px (Medium)');
  console.log('   [3] 2000px (Large/2K)');
  console.log('   [4] 2560px (Extra Large/2.5K)');
  console.log('   [5] 3840px (Ultra/4K)');
  console.log('   [6] Custom width');
  
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });
  
  return new Promise((resolve) => {
    rl.question('   Select target (1-6): ', async (answer) => {
      rl.close();
      
      switch (answer) {
        case '1': resolve(1200); break;
        case '2': resolve(1600); break;
        case '3': resolve(2000); break;
        case '4': resolve(2560); break;
        case '5': resolve(3840); break;
        case '6':
          const customWidth = await getCustomWidth();
          resolve(customWidth);
          break;
        default: resolve(2000); // Default to 2K
      }
    });
  });
}

/**
 * Get custom width from user
 */
async function getCustomWidth() {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });
  
  return new Promise((resolve) => {
    rl.question('   Enter target width in pixels: ', (answer) => {
      rl.close();
      const width = parseInt(answer);
      if (!isNaN(width) && width >= RESIZE_CONFIG.minWidth) {
        resolve(width);
      } else {
        resolve(RESIZE_CONFIG.universalTargetWidth);
      }
    });
  });
}

/**
 * Choose from available presets
 */
async function choosePreset() {
  console.log('\n   Available presets:');
  const presetKeys = Object.keys(RESIZE_CONFIG.presets);
  
  presetKeys.forEach((key, index) => {
    const preset = RESIZE_CONFIG.presets[key];
    console.log(`   [${index + 1}] ${preset.name} (${preset.maxWidth}×${preset.maxHeight} base) - ${preset.description}`);
  });
  
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });
  
  return new Promise((resolve) => {
    rl.question('   Select preset (1-' + presetKeys.length + '): ', (answer) => {
      rl.close();
      const index = parseInt(answer) - 1;
      const key = presetKeys[index] || 'content';
      resolve(RESIZE_CONFIG.presets[key]);
    });
  });
}

/**
 * Get custom dimensions from user
 */
async function getCustomDimensions(current) {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });
  
  return new Promise((resolve) => {
    rl.question(`   Enter width (current: ${current.width}): `, (widthAnswer) => {
      rl.question(`   Enter height (current: ${current.height}): `, (heightAnswer) => {
        rl.close();
        
        const width = parseInt(widthAnswer) || current.width;
        const height = parseInt(heightAnswer) || current.height;
        
        // Ensure minimum dimensions
        const finalWidth = Math.max(width, RESIZE_CONFIG.minWidth);
        const finalHeight = Math.max(height, RESIZE_CONFIG.minHeight);
        
        resolve({ width: finalWidth, height: finalHeight });
      });
    });
  });
}

/**
 * Interactive preset selection with detailed preview
 */
async function selectResizePreset(analysis, filePath) {
  const { current, suggestion, aspectRatio, pixelReduction, reason } = analysis;
  const fileName = path.basename(filePath);
  
  // Get current file size
  const currentFileSize = await getFileSize(filePath);
  
  // Analyze image to get compression estimates
  const imageAnalysis = await analyzeImageComplexity(filePath);
  const compressionSettings = determineOptimalCompression(imageAnalysis);
  
  // Check if cropping will occur
  const currentAspectRatio = current.width / current.height;
  const targetAspectRatio = suggestion.width / suggestion.height;
  const willCrop = enableSmartCrop && Math.abs(currentAspectRatio - targetAspectRatio) > 0.01;
  
  // Estimate final size
  const dimensionReduction = pixelReduction / 100;
  const qualityReduction = (100 - compressionSettings.quality) / 100;
  const formatBonus = fileName.endsWith('.png') && compressionSettings.convertToJpeg ? 0.5 : 1;
  
  const estimatedSizeReduction = 1 - ((1 - dimensionReduction) * (1 - qualityReduction * 0.8) * formatBonus);
  const estimatedFinalSize = parseFloat(currentFileSize) * (1 - estimatedSizeReduction);
  
  // Display detailed preview
  console.log(`\n📏 ${fileName}`);
  console.log(`   Dimensions: ${current.width}×${current.height} (${aspectRatio})`);
  console.log(`   Current size: ${currentFileSize}KB`);
  console.log(`   Image type: ${imageAnalysis.imageType} (${imageAnalysis.entropy > 0.7 ? 'complex' : imageAnalysis.entropy > 0.3 ? 'medium' : 'simple'})`);
  console.log(`   Current compression: ${(imageAnalysis.currentCompressionRatio * 100).toFixed(1)}%`);
  console.log(`   `);
  console.log(`   📐 Resize: ${current.width}×${current.height} → ${suggestion.width}×${suggestion.height}`);
  console.log(`   📋 Reason: ${reason}`);
  
  // Warn about cropping
  if (willCrop) {
    console.log(`   ⚠️  WARNING: Smart crop will CROP this image to fit!`);
    console.log(`   ⚠️  Aspect ratio change: ${currentAspectRatio.toFixed(2)} → ${targetAspectRatio.toFixed(2)}`);
    console.log(`   ⚠️  Parts of the image will be removed. Use --no-smart-crop to resize without cropping.`);
  } else if (Math.abs(currentAspectRatio - targetAspectRatio) > 0.01) {
    console.log(`   ✅ Aspect ratio preserved (letterboxing/pillarboxing will be used)`);
  }
  
  console.log(`   🎨 Quality: ${compressionSettings.quality}% (${compressionSettings.reason})`);
  console.log(`   💾 Estimated size: ${currentFileSize}KB → ~${estimatedFinalSize.toFixed(0)}KB (${(estimatedSizeReduction * 100).toFixed(0)}% reduction)`);
  
  if (compressionSettings.convertToJpeg && fileName.endsWith('.png')) {
    console.log(`   🔄 Format: PNG → JPEG conversion recommended`);
  }
  
  if (imageAnalysis.isAlreadyCompressed && imageAnalysis.bytesPerPixel < 0.5) {
    console.log(`   ⚠️  Warning: Image appears already compressed (${imageAnalysis.bytesPerPixel.toFixed(2)} bytes/pixel)`);
  }
  
  if (!isInteractive || resizeMode === RESIZE_CONFIG.modes.AUTO) {
    return { dimensions: suggestion, confirmed: true, scaleFactor: globalScalingFactor };
  }
  
  console.log('\n   Choose optimization option:');
  console.log(`   [1] Apply suggested resize${willCrop ? ' (WITH CROPPING)' : ''}`);
  console.log('   [2] Choose different target width');
  console.log('   [3] Change scale factor');
  console.log('   [4] Custom dimensions');
  console.log('   [5] Skip this image');
  console.log('   [6] Apply to all similar images');
  if (willCrop) {
    console.log('   [7] Disable smart crop for this image');
  }
  
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });
  
  return new Promise((resolve) => {
    rl.question('   Selection (1-' + (willCrop ? '7' : '6') + '): ', async (answer) => {
      rl.close();
      
      switch (answer) {
        case '1':
          resolve({ dimensions: suggestion, confirmed: true, scaleFactor: globalScalingFactor, useSmartCrop: enableSmartCrop });
          break;
          
        case '2':
          const newTarget = await chooseTargetWidth();
          const newDimensions = calculateDimensionsForWidth(current, newTarget);
          resolve({ dimensions: newDimensions, confirmed: true, scaleFactor: 1.0, useSmartCrop: enableSmartCrop });
          break;
          
        case '3':
          const newScaleFactor = await chooseScalingFactor();
          const scaledTarget = Math.round(analysis.targetWidth * newScaleFactor);
          const scaledDimensions = calculateDimensionsForWidth(current, scaledTarget);
          resolve({ dimensions: scaledDimensions, confirmed: true, scaleFactor: newScaleFactor, useSmartCrop: enableSmartCrop });
          break;
          
        case '4':
          const customDimensions = await getCustomDimensions(current);
          resolve({ dimensions: customDimensions, confirmed: true, scaleFactor: 1.0, useSmartCrop: enableSmartCrop });
          break;
          
        case '5':
          resolve({ confirmed: false });
          break;
          
        case '6':
          batchResizeSettings = { dimensions: suggestion, scaleFactor: globalScalingFactor, useSmartCrop: enableSmartCrop };
          resolve({ dimensions: suggestion, confirmed: true, applyToAll: true, scaleFactor: globalScalingFactor, useSmartCrop: enableSmartCrop });
          break;
          
        case '7':
          if (willCrop) {
            resolve({ dimensions: suggestion, confirmed: true, scaleFactor: globalScalingFactor, useSmartCrop: false });
          } else {
            resolve({ dimensions: suggestion, confirmed: true, scaleFactor: globalScalingFactor, useSmartCrop: enableSmartCrop });
          }
          break;
          
        default:
          resolve({ dimensions: suggestion, confirmed: true, scaleFactor: globalScalingFactor, useSmartCrop: enableSmartCrop });
      }
    });
  });
}

/**
 * Process all images to find which need resizing
 */
async function processOversizedImages() {
  console.log('\n🔍 Analyzing images for resize opportunities...');
  console.log(`   Strategy: ${resizeStrategy} ${resizeStrategy === RESIZE_CONFIG.strategies.CUSTOM ? `(${customTargetWidth}px)` : ''}`);
  if (enableSmartCrop) {
    console.log(`   ⚠️  Smart crop: ENABLED - images may be cropped!`);
  } else {
    console.log(`   ✅ Smart crop: DISABLED - aspect ratios preserved`);
  }
  console.log('');
  
  // Interactive configuration
  if (isInteractive && resizeMode !== RESIZE_CONFIG.modes.AUTO && resizeMode !== 'skip') {
    // For standard strategy, ask if they want to change the target
    if (resizeStrategy === RESIZE_CONFIG.strategies.STANDARD) {
      console.log('💡 Current target resolution: 2000px (2K)');
      const changeTarget = await askQuestion('Would you like to set a different target resolution?');
      
      if (changeTarget) {
        const rl = readline.createInterface({
          input: process.stdin,
          output: process.stdout
        });
        
        const newTarget = await new Promise((resolve) => {
          rl.question('   Enter target width in pixels (e.g. 1600, 2000, 2560): ', (answer) => {
            rl.close();
            const value = parseInt(answer);
            if (!isNaN(value) && value >= RESIZE_CONFIG.minWidth) {
              resolve(value);
            } else {
              resolve(RESIZE_CONFIG.universalTargetWidth);
            }
          });
        });
        
        customTargetWidth = newTarget;
        resizeStrategy = RESIZE_CONFIG.strategies.CUSTOM;
        console.log(`\n✨ Using custom target: ${customTargetWidth}px\n`);
      }
    }
    
    // Ask about scaling factor
    console.log('💡 Would you like to set a global scaling factor for higher resolution preservation?');
    const useGlobalScale = await askQuestion('Use global scaling factor?');
    
    if (useGlobalScale) {
      globalScalingFactor = await chooseScalingFactor();
      console.log(`\n✨ Using ${globalScalingFactor}x scaling for all presets\n`);
    }
  }
  
  const imageFiles = await findImageFiles(PUBLIC_DIR);
  const oversizedImages = [];
  const analysisByType = new Map();
  let totalCurrentSize = 0;
  
  // Analyze all images
  for (const fileInfo of imageFiles) {
    try {
      const metadata = await sharp(fileInfo.path).metadata();
      const analysis = await analyzeImageForResize(metadata, fileInfo.path);
      
      if (analysis.needsResize) {
        const currentSize = fileInfo.size / 1024; // Convert to KB
        totalCurrentSize += currentSize;
        
        analysis.currentSizeKB = currentSize;
        oversizedImages.push({ ...fileInfo, analysis });
        
        // Group by reason/type
        const type = analysis.reason;
        if (!analysisByType.has(type)) {
          analysisByType.set(type, []);
        }
        analysisByType.get(type).push({ ...fileInfo, analysis });
      }
    } catch (error) {
      logger.log('error', 'Image analysis failed', { file: fileInfo.path, error: error.message });
    }
  }
  
  if (oversizedImages.length === 0) {
    console.log('✅ No images need resizing! Proceeding to compression optimization...');
    return [];
  }
  
  // Show summary
  console.log(`📊 Found ${oversizedImages.length} images that need resizing:\n`);
  
  for (const [type, images] of analysisByType.entries()) {
    const totalSize = images.reduce((sum, img) => sum + img.analysis.currentSizeKB, 0);
    const avgReduction = images.reduce((sum, img) => sum + img.analysis.pixelReduction, 0) / images.length;
    
    console.log(`   ${type}: ${images.length} images (${(totalSize / 1024).toFixed(1)}MB total)`);
    console.log(`   Average size reduction potential: ${avgReduction.toFixed(1)}%\n`);
  }
  
  console.log(`   Total size: ${(totalCurrentSize / 1024).toFixed(1)}MB`);
  console.log(`   Estimated after optimization: ~${(totalCurrentSize * 0.3 / 1024).toFixed(1)}MB`);
  if (globalScalingFactor !== 1.0) {
    console.log(`   📈 Global scaling factor: ${globalScalingFactor}x (preserving higher resolution)`);
  }
  
  console.log(`\n   Note: All ${imageFiles.length} images will be analyzed for compression`);
  console.log(`   Only the ${oversizedImages.length} images above need dimension reduction`);
  console.log(`   Images already optimized will be skipped (use --force to re-process)`);
  
  if (resizeMode === 'skip') {
    console.log(`\n   ⚠️  Resize mode is 'skip' - only compression will be applied`);
  }
  
  // Process based on mode
  if (resizeMode === RESIZE_CONFIG.modes.AUTO) {
    console.log('\n🤖 Auto-resizing all images with detected presets...');
    if (enableSmartCrop) {
      console.log('⚠️  Smart crop enabled - images may be cropped to fit!');
    }
    return oversizedImages.map(img => ({
      ...img,
      resizeConfig: { 
        dimensions: img.analysis.suggestion,
        confirmed: true,
        scaleFactor: globalScalingFactor,
        useSmartCrop: enableSmartCrop
      }
    }));
  }
  
  // Interactive mode
  const toResize = [];
  let batchSettings = null;
  
  for (const [type, images] of analysisByType.entries()) {
    console.log(`\n📁 Processing: ${type} (${images.length} total)`);
    
    if (batchSettings && batchSettings.type === type) {
      // Apply batch settings
      images.forEach(img => {
        const dimensions = calculateDimensionsForWidth(img.analysis.current, batchSettings.dimensions.width);
        toResize.push({
          ...img,
          resizeConfig: { 
            ...batchSettings, 
            dimensions,
            confirmed: true 
          }
        });
      });
      continue;
    }
    
    // Ask for first image in group
    const first = images[0];
    const config = await selectResizePreset(first.analysis, first.path);
    
    if (config.confirmed) {
      toResize.push({ ...first, resizeConfig: config });
      
      if (config.applyToAll || images.length > 1) {
        const applyToAll = config.applyToAll || await askQuestion(`Apply same settings to all similar images?`);
        
        if (applyToAll) {
          batchSettings = { ...config, type };
          images.slice(1).forEach(img => {
            const dimensions = calculateDimensionsForWidth(img.analysis.current, config.dimensions.width);
            toResize.push({
              ...img,
              resizeConfig: { dimensions, confirmed: true, scaleFactor: config.scaleFactor, useSmartCrop: config.useSmartCrop }
            });
          });
        } else {
          // Process remaining individually
          for (const img of images.slice(1)) {
            const imgConfig = await selectResizePreset(img.analysis, img.path);
            if (imgConfig.confirmed) {
              toResize.push({ ...img, resizeConfig: imgConfig });
            }
          }
        }
      }
    }
  }
  
  return toResize;
}

// ============================================================================
// SVG OPTIMIZATION
// ============================================================================

/**
 * Optimize SVG files by removing unnecessary elements
 */
async function optimizeSVG(filePath) {
  try {
    const svgContent = await promisify(fs.readFile)(filePath, 'utf8');
    
    // Basic SVG optimizations
    let optimized = svgContent
      .replace(/<!--[\s\S]*?-->/g, '') // Remove comments
      .replace(/\s+/g, ' ') // Collapse whitespace
      .replace(/>\s+</g, '><') // Remove whitespace between tags
      .replace(/\s+\/>/g, '/>') // Clean self-closing tags
      .replace(/\sid="[^"]*"/g, (match) => { // Shorten IDs
        if (!/id="(icon|logo|svg)/i.test(match)) {
          return '';
        }
        return match;
      });
    
    const originalSize = Buffer.byteLength(svgContent, 'utf8') / 1024;
    const optimizedSize = Buffer.byteLength(optimized, 'utf8') / 1024;
    
    if (optimizedSize < originalSize && !isDryRun) {
      await promisify(fs.writeFile)(filePath, optimized);
      const savings = ((originalSize - optimizedSize) / originalSize * 100).toFixed(1);
      return { originalSize, optimizedSize, savings };
    }
    
    return null;
  } catch (error) {
    logger.log('error', 'SVG optimization failed', { file: filePath, error: error.message });
    return null;
  }
}

// ============================================================================
// MAIN OPTIMIZATION FUNCTION
// ============================================================================

/**
 * Optimize a single image file
 * This is the core function that handles compression and resizing
 */
async function optimizeImage(fileInfo, force = false, resizeConfig = null) {
  const { path: filePath, ext } = fileInfo;
  const fileName = path.basename(filePath);
  const relativePath = path.relative(PUBLIC_DIR, filePath);
  
  if (!fs.existsSync(filePath)) {
    logger.log('warning', 'File not found', { file: fileName });
    return null;
  }

  // Check cache first (unless forced)
  if (!force) {
    const cached = await isAlreadyOptimized(filePath);
    if (cached) {
      if (verboseMode) {
        console.log(`⏭️  ${relativePath}: Already optimized (cached)`);
      }
      return { skipped: true, reason: 'Already optimized (cached)' };
    }
  }

  // Analyze image
  const analysis = await analyzeImageComplexity(filePath);
  if (!analysis) {
    console.error(`❌ Could not analyze: ${relativePath}`);
    return { error: true };
  }

  // Get compression settings
  const compressionSettings = determineOptimalCompression(analysis);
  
  // Show analysis in verbose mode
  if (verboseMode || (isInteractive && !resizeMode)) {
    console.log(`\n📊 Analysis for ${fileName}:`);
    console.log(`   Type: ${analysis.imageType} (${analysis.entropy > 0.7 ? 'complex' : analysis.entropy > 0.3 ? 'medium' : 'simple'})`);
    console.log(`   Current: ${analysis.fileSizeKB.toFixed(1)}KB, ${analysis.bytesPerPixel.toFixed(2)} bytes/pixel`);
    console.log(`   Compression: ${(analysis.currentCompressionRatio * 100).toFixed(1)}% compressed`);
    console.log(`   Recommendation: ${compressionSettings.quality}% quality (${compressionSettings.reason})`);
    
    if (compressionSettings.skipOptimization) {
      console.log(`   ⚠️  Already optimally compressed, skipping`);
      return { skipped: true };
    }
    
    if (compressionSettings.convertToJpeg && ext === '.png') {
      console.log(`   💡 Suggest converting PNG → JPEG (no transparency, ${analysis.colorCount} colors)`);
    }
  }

  // Check if compression analysis says to skip
  if (!force && compressionSettings.skipOptimization) {
    if (verboseMode) {
      console.log(`⏭️  ${relativePath}: Already optimally compressed (${compressionSettings.reason})`);
    }
    return { skipped: true, reason: 'Already optimally compressed' };
  }

  const originalSize = await getFileSize(filePath);
  
  try {
    // Handle SVG files separately
    if (ext === '.svg') {
      const result = await optimizeSVG(filePath);
      if (result) {
        console.log(`✅ ${relativePath}: ${result.originalSize.toFixed(1)}KB → ${result.optimizedSize.toFixed(1)}KB (${result.savings}% smaller)`);
        stats.totalSavedKB += (result.originalSize - result.optimizedSize);
        return { optimized: true, savings: result.savings };
      }
      return { skipped: true };
    }

    // Get image metadata
    const metadata = await sharp(filePath).metadata();
    
    // Use provided resize config or analyze
    let resizeDimensions = null;
    let selectedPreset = null;
    let scaleFactor = globalScalingFactor;
    
    if (resizeConfig && resizeConfig.confirmed) {
      resizeDimensions = resizeConfig.dimensions;
      selectedPreset = resizeConfig.preset;
      scaleFactor = resizeConfig.scaleFactor || globalScalingFactor;
    } else {
      // Check if resizing needed
      const resizeAnalysis = await analyzeImageForResize(metadata, filePath);
      if (resizeAnalysis.needsResize && resizeMode !== 'skip') {
        if (resizeMode === RESIZE_CONFIG.modes.AUTO) {
          resizeDimensions = resizeAnalysis.suggestion;
        } else if (isInteractive) {
          const config = await selectResizePreset(resizeAnalysis, filePath);
          if (config.confirmed) {
            resizeDimensions = config.dimensions;
            scaleFactor = config.scaleFactor || globalScalingFactor;
          }
        }
      }
    }
    
    // Backup original
    await backupOriginal(filePath);
    
    // Process image
    const tempFile = filePath + '.tmp';
    const backupPath = path.join(BACKUP_DIR, relativePath);
    const sourceFile = fs.existsSync(backupPath) ? backupPath : filePath;
    
    let sharpInstance = sharp(sourceFile, {
      limitInputPixels: 0, // Handle large images
      sequentialRead: true, // Better memory usage
    });
    
    // Get dominant color for smart fills
    const { dominant } = await sharpInstance.stats();
    
    // Apply resizing if needed
    if (resizeDimensions && !isDryRun) {
      // Determine if smart crop should be used for this image
      const useSmartCrop = resizeConfig?.useSmartCrop || enableSmartCrop;
      
      // Check if aspect ratios differ (cropping will occur)
      const currentAspectRatio = metadata.width / metadata.height;
      const targetAspectRatio = resizeDimensions.width / resizeDimensions.height;
      const willCrop = useSmartCrop && Math.abs(currentAspectRatio - targetAspectRatio) > 0.01;
      
      if (willCrop && verboseMode) {
        console.log(`   ⚠️  Cropping ${relativePath}: aspect ratio ${currentAspectRatio.toFixed(2)} → ${targetAspectRatio.toFixed(2)}`);
      }
      
      sharpInstance = sharpInstance.resize(resizeDimensions.width, resizeDimensions.height, {
        fit: useSmartCrop ? 'cover' : 'inside',
        position: useSmartCrop ? 'attention' : 'center', // 'attention' uses smart detection, 'center' is safe default
        withoutEnlargement: true,
        background: { r: dominant.r, g: dominant.g, b: dominant.b, alpha: 0 }
      });
    }
    
    // Use compression quality
    const quality = compressionSettings.quality;
    
    // Apply format-specific optimizations
    if (!isDryRun) {
      switch (ext) {
        case '.jpg':
        case '.jpeg':
          await sharpInstance
            .jpeg({
              quality: quality,
              progressive: true,
              mozjpeg: true,
              chromaSubsampling: analysis.hasText ? '4:4:4' : '4:2:0',
              trellisQuantisation: true,
              overshootDeringing: true,
              optimizeScans: compressionSettings.effort === 'max',
              quantizationTable: quality > 85 ? 0 : quality > 70 ? 2 : 3
            })
            .toFile(tempFile);
          break;
          
        case '.png':
          const hasAlpha = metadata.channels === 4;
          
          if (!hasAlpha && compressionSettings.convertToJpeg) {
            // Convert to JPEG if recommended
            await sharpInstance
              .jpeg({
                quality: quality,
                progressive: true,
                mozjpeg: true,
                chromaSubsampling: analysis.hasText ? '4:4:4' : '4:2:0'
              })
              .toFile(tempFile.replace('.tmp', '.jpg.tmp'));
            
            // Compare sizes
            const jpegSize = await getFileSize(tempFile.replace('.tmp', '.jpg.tmp'));
            const pngSize = (await sharp(sourceFile).png({
              quality: quality,
              compressionLevel: 9,
              effort: 10
            }).toBuffer()).length / 1024;
            
            if (parseFloat(jpegSize) < pngSize * 0.8) {
              // Use JPEG if significantly smaller
              renameFileWithRetry(tempFile.replace('.tmp', '.jpg.tmp'), tempFile);
              console.log(`🔄 Converted ${fileName} from PNG to JPEG (${compressionSettings.reason})`);
            } else {
              // Keep as PNG
              await cleanupTempFileWithRetry(tempFile.replace('.tmp', '.jpg.tmp'));
              await sharpInstance.png({
                quality: quality,
                compressionLevel: 9,
                adaptiveFiltering: true,
                palette: analysis.colorCount !== 'high',
                effort: compressionSettings.effort === 'max' ? 10 : 7,
                dither: analysis.colorCount === 'low' ? 1.0 : 0
              }).toFile(tempFile);
            }
          } else {
            await sharpInstance
              .png({
                quality: quality,
                compressionLevel: 9,
                adaptiveFiltering: true,
                effort: compressionSettings.effort === 'max' ? 10 : 7
              })
              .toFile(tempFile);
          }
          break;
          
        case '.webp':
          await sharpInstance
            .webp({
              quality: Math.min(quality - 15, 65),
              effort: 6,
              smartSubsample: true,
              preset: analysis.imageType === 'photo' ? 'photo' : 'picture',
              method: compressionSettings.effort === 'max' ? 6 : 4,
              alphaQuality: Math.min(quality, 80)
            })
            .toFile(tempFile);
          break;
          
        case '.gif':
          // For GIFs, check if animated
          if (metadata.pages > 1) {
            console.log(`⏭️  Skipping animated GIF: ${fileName}`);
            return { skipped: true };
          } else {
            // Convert static GIF to WebP
            await sharpInstance
              .webp({
                quality: quality - 10,
                effort: 6
              })
              .toFile(tempFile.replace('.tmp', '.webp.tmp'));
            renameFileWithRetry(tempFile.replace('.tmp', '.webp.tmp'), tempFile);
            console.log(`🔄 Converted static GIF to WebP: ${fileName}`);
          }
          break;
          
        default:
          console.log(`⏭️  Skipping: ${fileName} (unsupported format)`);
          return { skipped: true };
      }
      
      // Validate optimized image
      const validImage = await validateOptimizedImage(tempFile);
      if (!validImage) {
        throw new Error('Optimized image validation failed');
      }
      
      // Check if optimization actually made it smaller
      const optimizedSize = await getFileSize(tempFile);
      if (parseFloat(optimizedSize) >= parseFloat(originalSize) * 0.95) {
        // Less than 5% savings, keep original
        fs.unlinkSync(tempFile);
        console.log(`⏭️  ${relativePath}: No significant size reduction (${originalSize}KB → ${optimizedSize}KB)`);
        return { skipped: true, reason: 'No benefit from optimization' };
      }
      
      // Replace original with optimized
      fs.renameSync(tempFile, filePath);
    }
    
    const newSize = await getFileSize(filePath);
    const savings = ((parseFloat(originalSize) - parseFloat(newSize)) / parseFloat(originalSize) * 100).toFixed(1);
    
    // Update cache
    const fileHash = await getFileHash(filePath);
    optimizationCache[relativePath] = {
      hash: fileHash,
      optimized: true,
      originalSize: parseFloat(originalSize),
      optimizedSize: parseFloat(newSize),
      savings: parseFloat(savings),
      resized: !!resizeDimensions,
      dimensions: resizeDimensions,
      preset: selectedPreset?.name,
      scaleFactor: scaleFactor,
      quality: quality,
      imageType: analysis.imageType,
      compressionReason: compressionSettings.reason,
      timestamp: Date.now()
    };
    
    if (!isDryRun) {
      const presetInfo = selectedPreset ? ` [${selectedPreset.name}${scaleFactor !== 1.0 ? ` @${scaleFactor}x` : ''}]` : '';
      const qualityInfo = ` (Q:${quality}%, ${analysis.imageType})`;
      const resizeInfo = resizeDimensions ? `📐 ` : '';
      console.log(`${resizeInfo}✅ ${relativePath}: ${originalSize}KB → ${newSize}KB (${savings}% smaller)${resizeDimensions ? ` → ${resizeDimensions.width}×${resizeDimensions.height}${presetInfo}` : ''}${qualityInfo}`);
      stats.totalSavedKB += (parseFloat(originalSize) - parseFloat(newSize));
      
      // Track stats
      if (resizeDimensions) {
        stats.resized++;
      }
      stats.compressed++;
    }
    
    return { optimized: true, savings: parseFloat(savings), quality: quality };
    
  } catch (error) {
    console.error(`❌ Error optimizing ${relativePath}:`, error.message);
    logger.log('error', 'Optimization failed', { file: relativePath, error: error.message });
    
    // Clean up temp files with Windows-safe retry logic
    const tempFiles = [
      filePath + '.tmp',
      filePath.replace(ext, '.jpg.tmp'),
      filePath.replace(ext, '.webp.tmp')
    ];
    
    for (const temp of tempFiles) {
      if (fs.existsSync(temp)) {
        try {
          // Retry cleanup with delay for Windows file locking
          await cleanupTempFileWithRetry(temp);
        } catch (cleanupError) {
          logger.log('warning', 'Failed to cleanup temp file', { 
            file: temp, 
            error: cleanupError.message 
          });
          // Don't fail the whole process for cleanup issues
        }
      }
    }
    
    return { error: true };
  }
}

/**
 * Validate that optimized image is valid
 */
async function validateOptimizedImage(filePath) {
  try {
    const metadata = await sharp(filePath).metadata();
    return metadata.width > 0 && metadata.height > 0;
  } catch (error) {
    logger.log('error', 'Image validation failed', { file: filePath, error: error.message });
    return false;
  }
}

// ============================================================================
// BATCH PROCESSING
// ============================================================================

/**
 * Process images in parallel batches
 */
async function processImagesInBatches(imageFiles, force, resizeConfigs = new Map()) {
  const progress = new ProgressReporter(imageFiles.length);
  const results = [];
  
  // Process in batches to avoid memory issues
  for (let i = 0; i < imageFiles.length; i += BATCH_SIZE) {
    const batch = imageFiles.slice(i, i + BATCH_SIZE);
    
    const batchResults = await Promise.all(
      batch.map(async (fileInfo) => {
        const resizeConfig = resizeConfigs.get(fileInfo.path);
        const result = await optimizeImage(fileInfo, force, resizeConfig);
        progress.update();
        return result;
      })
    );
    
    results.push(...batchResults);
    
    // Save cache periodically
    if (i % (BATCH_SIZE * 5) === 0) {
      await saveCache();
    }
  }
  
  return results;
}

// ============================================================================
// MODERN FORMAT GENERATION
// ============================================================================

/**
 * Generate WebP and AVIF versions of images
 */
async function generateModernFormats(imageFiles) {
  console.log('\n🔄 Generating modern format versions...');
  
  const formats = ['webp'];
  if (generateAvif) {
    formats.push('avif');
  }
  
  const candidates = imageFiles.filter(({ path: filePath, ext }) => {
    const isJpgOrPng = ['.jpg', '.jpeg', '.png'].includes(ext);
    const isFavicon = path.basename(filePath).includes('favicon');
    return isJpgOrPng && !isFavicon;
  });
  
  const progress = new ProgressReporter(candidates.length * formats.length);
  
  for (const format of formats) {
    for (const { path: filePath } of candidates) {
      const modernPath = filePath.replace(/\.(jpg|jpeg|png)$/i, `.${format}`);
      const relativePath = path.relative(PUBLIC_DIR, filePath);
      const fileName = path.basename(filePath);
      
      // Skip if already exists and is newer than source
      if (fs.existsSync(modernPath)) {
        const sourceStats = await promisify(fs.stat)(filePath);
        const modernStats = await promisify(fs.stat)(modernPath);
        
        if (modernStats.mtime > sourceStats.mtime) {
          progress.update();
          continue;
        }
      }
      
      try {
        if (!isDryRun) {
          // Analyze image to determine quality
          const analysis = await analyzeImageComplexity(filePath);
          const compressionSettings = analysis ? determineOptimalCompression(analysis) : { quality: 70 };
          
          if (format === 'webp') {
            await sharp(filePath)
              .webp({
                quality: Math.min(compressionSettings.quality - 15, 65),
                effort: 6,
                smartSubsample: true,
                preset: /photo|camera|portrait/i.test(fileName) ? 'photo' : 'picture',
                method: 6
              })
              .toFile(modernPath);
          } else if (format === 'avif') {
            await sharp(filePath)
              .avif({
                quality: Math.min(compressionSettings.quality - 20, 60),
                effort: 9,
                chromaSubsampling: '4:2:0',
                pixelFormat: 'yuv420'
              })
              .toFile(modernPath);
          }
          
          const originalSize = await getFileSize(filePath);
          const modernSize = await getFileSize(modernPath);
          
          if (verboseMode) {
            console.log(`\n📸 ${relativePath} → ${format.toUpperCase()}: ${originalSize}KB → ${modernSize}KB`);
          }
        }
      } catch (error) {
        logger.log('error', `${format} generation failed`, { file: relativePath, error: error.message });
      }
      
      progress.update();
    }
  }
}

// ============================================================================
// REPORTING
// ============================================================================

/**
 * Generate optimization report with statistics
 */
function generateReport() {
  const duration = (Date.now() - stats.startTime) / 1000;
  
  // Analyze cache for compression statistics
  const compressionStats = {};
  Object.values(optimizationCache).forEach(entry => {
    if (entry.imageType && entry.quality) {
      if (!compressionStats[entry.imageType]) {
        compressionStats[entry.imageType] = {
          count: 0,
          totalSavings: 0,
          qualities: [],
          avgQuality: 0,
          scalingFactors: []
        };
      }
      compressionStats[entry.imageType].count++;
      compressionStats[entry.imageType].totalSavings += parseFloat(entry.savings);
      compressionStats[entry.imageType].qualities.push(entry.quality);
      if (entry.scaleFactor) {
        compressionStats[entry.imageType].scalingFactors.push(entry.scaleFactor);
      }
    }
  });
  
  // Calculate averages
  Object.keys(compressionStats).forEach(type => {
    const stat = compressionStats[type];
    stat.avgQuality = Math.round(stat.qualities.reduce((a, b) => a + b, 0) / stat.qualities.length);
    stat.avgSavings = Math.round(stat.totalSavings / stat.count);
    if (stat.scalingFactors.length > 0) {
      stat.avgScaling = (stat.scalingFactors.reduce((a, b) => a + b, 0) / stat.scalingFactors.length).toFixed(2);
    }
  });
  
  const report = {
    date: new Date().toISOString(),
    duration: `${duration.toFixed(1)}s`,
    processed: stats.totalFiles,
    optimized: stats.optimized,
    resized: stats.resized,
    compressed: stats.compressed,
    skipped: stats.skipped,
    errors: stats.errors,
    savedKB: stats.totalSavedKB.toFixed(1),
    savedMB: (stats.totalSavedKB / 1024).toFixed(2),
    globalScalingFactor: globalScalingFactor,
    compressionPreset: compressionPreset.name,
    resizeStrategy: resizeStrategy,
    compressionByType: compressionStats
  };
  
  // Save report
  const reportPath = path.join(__dirname, '.optimization-report.json');
  fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));
  
  return report;
}

// ============================================================================
// MAIN FUNCTION
// ============================================================================

/**
 * Main entry point
 */
async function main() {
  const args = process.argv.slice(2);
  const force = args.includes('--force');
  const nonInteractive = args.includes('--non-interactive') || args.includes('-y');
  const resizeOnly = args.includes('--resize-only');
  const analyzeOnly = args.includes('--analyze-only');
  isDryRun = args.includes('--dry-run');
  generateAvif = args.includes('--avif');
  verboseMode = args.includes('--verbose') || args.includes('-v');
  
  // Compression preset handling
  if (args.includes('--compress-heavy')) {
    compressionPreset = COMPRESSION_PRESETS.heavy;
  } else if (args.includes('--compress-light')) {
    compressionPreset = COMPRESSION_PRESETS.light;
  } else {
    compressionPreset = COMPRESSION_PRESETS.smart; // Default
  }
  
  // Resize mode handling
  if (args.includes('--resize-auto')) {
    resizeMode = RESIZE_CONFIG.modes.AUTO;
  } else if (args.includes('--resize-skip')) {
    resizeMode = 'skip';
  } else if (args.includes('--resize-batch')) {
    resizeMode = RESIZE_CONFIG.modes.BATCH;
  } else if (args.includes('--resize-universal')) {
    resizeMode = RESIZE_CONFIG.modes.UNIVERSAL;
    resizeStrategy = RESIZE_CONFIG.strategies.STANDARD;
  }
  
  // Resize strategy handling
  if (args.includes('--resize-conservative')) {
    resizeStrategy = RESIZE_CONFIG.strategies.CONSERVATIVE;
  } else if (args.includes('--resize-standard')) {
    resizeStrategy = RESIZE_CONFIG.strategies.STANDARD;
  } else if (args.includes('--resize-aggressive')) {
    resizeStrategy = RESIZE_CONFIG.strategies.AGGRESSIVE;
  }
  
  // Custom target width
  const targetArgIndex = args.findIndex(arg => arg.startsWith('--target='));
  if (targetArgIndex !== -1) {
    const targetValue = parseInt(args[targetArgIndex].split('=')[1]);
    if (!isNaN(targetValue) && targetValue >= RESIZE_CONFIG.minWidth) {
      customTargetWidth = targetValue;
      resizeStrategy = RESIZE_CONFIG.strategies.CUSTOM;
      console.log(`📏 Using custom target width: ${customTargetWidth}px`);
    }
  }
  
  // Smart crop handling
  if (args.includes('--smart-crop')) {
    enableSmartCrop = true;
    console.log('⚠️  Smart crop enabled - images may be cropped to fit dimensions');
  }
  
  // Handle scale factor from command line
  const scaleArgIndex = args.findIndex(arg => arg.startsWith('--scale='));
  if (scaleArgIndex !== -1) {
    const scaleValue = parseFloat(args[scaleArgIndex].split('=')[1]);
    if (!isNaN(scaleValue) && scaleValue > 0 && scaleValue <= 5) {
      globalScalingFactor = scaleValue;
      console.log(`📈 Using scaling factor: ${globalScalingFactor}x`);
    }
  }
  
  if (nonInteractive) {
    isInteractive = false;
    if (!args.includes('--resize-auto')) {
      console.log('⚠️  Non-interactive mode: use --resize-auto to enable automatic resizing');
    }
  }
  
  // Display configuration
  console.log(`🚀 Starting image optimization...`);
  console.log(`   Mode: ${isDryRun ? 'DRY RUN' : analyzeOnly ? 'ANALYZE ONLY' : 'LIVE'}`);
  console.log(`   Force: ${force ? 'YES' : 'NO'}`);
  console.log(`   Interactive: ${isInteractive ? 'YES' : 'NO'}`);
  console.log(`   Resize mode: ${resizeMode}`);
  console.log(`   Resize strategy: ${resizeStrategy}${resizeStrategy === RESIZE_CONFIG.strategies.CUSTOM ? ` (${customTargetWidth}px)` : ''}`);
  console.log(`   Smart crop: ${enableSmartCrop ? 'ENABLED ⚠️' : 'DISABLED (safe)'}`);
  console.log(`   Compression: ${compressionPreset.name} - ${compressionPreset.description}`);
  console.log(`   Modern formats: WebP${generateAvif ? ', AVIF' : ''}`);
  if (globalScalingFactor !== 1.0) {
    console.log(`   Scaling factor: ${globalScalingFactor}x (preserving higher resolution)`);
  }
  if (enableSmartCrop) {
    console.log(`\n   ⚠️  WARNING: Smart crop is enabled!`);
    console.log(`   ⚠️  Images may be CROPPED to fit target dimensions`);
    console.log(`   ⚠️  Important parts of images could be removed`);
  }
  console.log('\n📋 Process overview:');
  console.log('   1. Analyze images for resize opportunities');
  console.log('   2. Compress ALL images with smart optimization');
  console.log('   3. Generate WebP versions');
  console.log('');
  
  await loadCache();
  await createBackupDir();
  
  // Show backup directory location
  console.log(`💾 Backups stored in: ${path.resolve(EXTERNAL_BACKUP_DIR)}\n`);
  
  // Find all image files
  console.log('🔍 Scanning for images...');
  const imageFiles = await findImageFiles(PUBLIC_DIR);
  stats.totalFiles = imageFiles.length;
  
  // Check how many are in cache
  let cachedCount = 0;
  for (const fileInfo of imageFiles) {
    const relativePath = path.relative(PUBLIC_DIR, fileInfo.path);
    if (optimizationCache[relativePath]) {
      const fileHash = await getFileHash(fileInfo.path);
      if (fileHash && optimizationCache[relativePath].hash === fileHash) {
        cachedCount++;
      }
    }
  }
  
  console.log(`📊 Found ${imageFiles.length} image files`);
  console.log(`   Already optimized (in cache): ${cachedCount}`);
  console.log(`   New/modified images: ${imageFiles.length - cachedCount}`);
  if (!force && cachedCount > 0) {
    console.log(`   💡 Use --force to re-optimize cached images`);
  }
  console.log('');
  
  // Analyze only mode
  if (analyzeOnly) {
    console.log('🔬 Analyzing images...\n');
    
    for (const fileInfo of imageFiles) {
      const analysis = await analyzeImageComplexity(fileInfo.path);
      if (analysis) {
        const compression = determineOptimalCompression(analysis);
        const relativePath = path.relative(PUBLIC_DIR, fileInfo.path);
        
        console.log(`📊 ${relativePath}`);
        console.log(`   Type: ${analysis.imageType} (${analysis.entropy > 0.7 ? 'complex' : analysis.entropy > 0.3 ? 'medium' : 'simple'})`);
        console.log(`   Size: ${analysis.fileSizeKB.toFixed(1)}KB (${analysis.bytesPerPixel.toFixed(2)} bpp)`);
        console.log(`   Compression: ${(analysis.currentCompressionRatio * 100).toFixed(1)}%`);
        console.log(`   Recommendation: ${compression.quality}% quality (${compression.targetCompression} reduction)`);
        console.log(`   Reason: ${compression.reason}`);
        if (compression.skipOptimization) {
          console.log(`   Status: ✅ Already optimized`);
        } else if (compression.convertToJpeg) {
          console.log(`   Action: Convert PNG → JPEG`);
        }
        console.log('');
      }
    }
    
    console.log('✅ Analysis complete!');
    return;
  }
  
  let resizeConfigs = new Map();
  
  // Process resize-only mode
  if (resizeOnly) {
    const toResize = await processOversizedImages();
    if (toResize.length > 0) {
      console.log(`\n🔧 Resizing ${toResize.length} images...\n`);
      
      const progress = new ProgressReporter(toResize.length);
      for (const item of toResize) {
        try {
          if (item.resizeConfig && item.resizeConfig.confirmed) {
            await backupOriginal(item.path);
            
            if (!isDryRun) {
              const tempFile = item.path + '.tmp';
              const metadata = await sharp(item.path).metadata();
              const useSmartCrop = item.resizeConfig.useSmartCrop || false;
              
              // Check if cropping will occur
              const currentAspectRatio = metadata.width / metadata.height;
              const targetAspectRatio = item.resizeConfig.dimensions.width / item.resizeConfig.dimensions.height;
              const willCrop = useSmartCrop && Math.abs(currentAspectRatio - targetAspectRatio) > 0.01;
              
              await sharp(item.path)
                .resize(item.resizeConfig.dimensions.width, item.resizeConfig.dimensions.height, {
                  fit: useSmartCrop ? 'cover' : 'inside',
                  position: useSmartCrop ? 'attention' : 'center',
                  withoutEnlargement: true
                })
                .toFile(tempFile);
              
              fs.renameSync(tempFile, item.path);
              
              const presetInfo = item.resizeConfig.preset ? ` [${item.resizeConfig.preset.name}${item.resizeConfig.scaleFactor !== 1.0 ? ` @${item.resizeConfig.scaleFactor}x` : ''}]` : '';
              const cropInfo = willCrop ? ' ⚠️ CROPPED' : '';
              console.log(`📐 Resized: ${path.relative(PUBLIC_DIR, item.path)} → ${item.resizeConfig.dimensions.width}×${item.resizeConfig.dimensions.height}${presetInfo}${cropInfo}`);
            }
          }
        } catch (error) {
          console.error(`❌ Error resizing ${path.relative(PUBLIC_DIR, item.path)}:`, error.message);
          logger.log('error', 'Resize failed', { file: item.path, error: error.message });
        }
        progress.update();
      }
    }
    
    console.log('\n🏁 Resize-only mode complete');
    return;
  }
  
  // Process resizing first if not in skip mode
  if (resizeMode !== 'skip') {
    const toResize = await processOversizedImages();
    // Build resize config map
    toResize.forEach(item => {
      if (item.resizeConfig && item.resizeConfig.confirmed) {
        resizeConfigs.set(item.path, item.resizeConfig);
      }
    });
  }
  
  // Process all images with optimization
  console.log('\n🔧 Optimizing all images (compression + resizing where configured)...');
  console.log(`   Total images to process: ${imageFiles.length}`);
  console.log(`   Using ${MAX_WORKERS} parallel workers\n`);
  const results = await processImagesInBatches(imageFiles, force, resizeConfigs);
  
  // Count results
  results.forEach(result => {
    if (result) {
      if (result.optimized) stats.optimized++;
      else if (result.skipped) stats.skipped++;
      else if (result.error) stats.errors++;
    }
  });
  
  // Generate modern formats
  if (!isDryRun) {
    await generateModernFormats(imageFiles);
  }
  
  // Save cache and generate report
  await saveCache();
  const report = generateReport();
  
  // Close logger
  logger.close();
  
  // Display summary
  console.log('\n' + '='.repeat(60));
  console.log('✅ Image optimization complete!');
  console.log('='.repeat(60));
  console.log(`📊 Processed: ${report.processed} files in ${report.duration}`);
  console.log(`🔧 Optimized: ${report.optimized}`);
  if (stats.resized > 0) {
    console.log(`📐 Resized: ${stats.resized} (compression applied to all)`);
  }
  console.log(`⏭️  Skipped: ${report.skipped}`);
  if (report.errors > 0) {
    console.log(`❌ Errors: ${report.errors}`);
  }
  console.log(`💾 Total saved: ${report.savedKB}KB (${report.savedMB}MB)`);
  if (report.globalScalingFactor !== 1.0) {
    console.log(`📈 Scaling factor used: ${report.globalScalingFactor}x`);
  }
  
  // Show compression by type
  if (Object.keys(report.compressionByType).length > 0) {
    console.log('\n📈 Smart Compression Applied:');
    Object.entries(report.compressionByType).forEach(([type, stats]) => {
      console.log(`   ${type}: ${stats.count} images`);
      console.log(`      Quality: ${stats.avgQuality}% avg (adaptive per image)`);
      console.log(`      Savings: ${stats.avgSavings}% avg reduction`);
      if (stats.avgScaling) {
        console.log(`      Scaling: ${stats.avgScaling}x avg`);
      }
    });
  }
  
  console.log(`\n📁 Backups: ${path.resolve(EXTERNAL_BACKUP_DIR)}`);
  console.log(`📄 Report: ${path.join(__dirname, '.optimization-report.json')}`);
  console.log(`📋 Log: ${LOG_FILE}`);
  
  if (stats.skipped > 0 && !force) {
    console.log('\n💡 Tips:');
    console.log('   - Use --force to re-optimize ALL images (ignores cache)');
    console.log('   - Use --verbose to see which images were skipped from cache');
    console.log('   - Images were analyzed individually for optimal compression');
  }
  
  if (isDryRun) {
    console.log('\n⚠️  This was a DRY RUN - no files were modified');
  }
  
  console.log('\n🎯 Additional options:');
  console.log('   --dry-run         Preview changes without modifying files');
  console.log('   --analyze-only    Analyze images and show recommendations');
  console.log('   --avif            Generate AVIF versions (better compression)');
  console.log('   --verbose         Show detailed progress and analysis');
  console.log('   --force           Re-optimize ALL images (ignores cache)');
  console.log('   --non-interactive Skip all prompts (add --resize-auto for automatic resizing)');
  console.log('\n🎨 Compression presets:');
  console.log('   --compress-smart  Smart adaptive compression (default) - analyzes each image');
  console.log('   --compress-heavy  Heavy compression for maximum file size reduction');
  console.log('   --compress-light  Light compression to preserve quality');
  console.log('\n📐 Resize options:');
  console.log('   --resize-auto     Auto-resize with smart presets');
  console.log('   --resize-skip     Skip resizing, only compress');
  console.log('   --resize-only     Only resize images, skip compression');
  console.log('   --resize-universal Resize all images to 2K standard');
  console.log('   --smart-crop      Enable smart cropping (⚠️  CROPS images to fit!)');
  console.log('\n📏 Resize strategies:');
  console.log('   --resize-conservative Only resize images that exceed presets (original behavior)');
  console.log('   --resize-standard    Resize all images over 2K to 2K (default)');
  console.log('   --resize-aggressive  Use tiered sizing (4K→2K, 2.5K→2K, etc)');
  console.log('   --target=WIDTH       Set custom target width (e.g. --target=1600)');
  console.log('   --scale=X.X          Set global scaling factor (e.g. --scale=2.0)');
  console.log('\n💡 Understanding the process:');
  console.log('   • Phase 1: Analyze which images need resizing (based on strategy)');
  console.log('   • Phase 2: Compress ALL images with smart optimization');
  console.log('   • Cached images are skipped unless --force is used');
  console.log('   • By default, NO CROPPING occurs - aspect ratios are preserved');
  console.log('   • Use --smart-crop ONLY when you need exact dimensions (will crop!)');
  console.log('\n💡 Smart compression (default) features:');
  console.log('   • Analyzes each image individually');
  console.log('   • Skips already well-optimized images');
  console.log('   • Adjusts quality based on content type and complexity');
  console.log('   • Converts PNG to JPEG when beneficial');
  console.log('\n📈 Scaling factors preserve higher resolution:');
  console.log('   • 1.0x = Standard (default)');
  console.log('   • 1.5x = 50% larger dimensions');
  console.log('   • 2.0x = Double dimensions');
  console.log('   • 3.0x = Triple dimensions (maximum quality)');
}

// ============================================================================
// ERROR HANDLING
// ============================================================================

process.on('unhandledRejection', (error) => {
  console.error('❌ Unhandled error:', error);
  logger.log('error', 'Unhandled rejection', { error: error.message, stack: error.stack });
  process.exit(1);
});

process.on('SIGINT', async () => {
  console.log('\n\n🛑 Optimization interrupted');
  await saveCache();
  logger.close();
  process.exit(0);
});

// ============================================================================
// ENTRY POINT
// ============================================================================

if (require.main === module) {
  main().catch(error => {
    console.error('❌ Fatal error:', error);
    logger.log('error', 'Fatal error', { error: error.message, stack: error.stack });
    process.exit(1);
  });
}

// ============================================================================
// EXPORTS
// ============================================================================

module.exports = { 
  optimizeImage, 
  generateModernFormats, 
  processOversizedImages,
  analyzeImageComplexity,
  determineOptimalCompression
};