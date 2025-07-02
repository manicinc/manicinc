/**
 * Smart image loading utility that detects and loads the best available format
 * Automatically tries WebP first (for better compression), falls back to PNG
 */

interface ImageLoadOptions {
  basePath: string;
  alt: string;
  className?: string;
  priority?: boolean;
  sizes?: string;
}

interface ImageFormat {
  src: string;
  format: 'webp' | 'png';
  exists: boolean;
}

// Cache for image format detection to avoid repeated checks
const imageFormatCache = new Map<string, ImageFormat>();

/**
 * Check if an image exists at the given URL
 */
async function checkImageExists(url: string): Promise<boolean> {
  try {
    const response = await fetch(url, { method: 'HEAD' });
    return response.ok;
  } catch {
    return false;
  }
}

/**
 * Get the best available image format for a given base path
 * @param basePath - Path without extension (e.g., "/assets/blog/my-image")
 * @returns Promise with the best available image format
 */
export async function getBestImageFormat(basePath: string): Promise<ImageFormat> {
  // Check cache first
  if (imageFormatCache.has(basePath)) {
    return imageFormatCache.get(basePath)!;
  }

  const webpPath = `${basePath}.webp`;
  const pngPath = `${basePath}.png`;

  // Try WebP first (better compression)
  const webpExists = await checkImageExists(webpPath);
  if (webpExists) {
    const result: ImageFormat = { src: webpPath, format: 'webp', exists: true };
    imageFormatCache.set(basePath, result);
    return result;
  }

  // Fall back to PNG
  const pngExists = await checkImageExists(pngPath);
  if (pngExists) {
    const result: ImageFormat = { src: pngPath, format: 'png', exists: true };
    imageFormatCache.set(basePath, result);
    return result;
  }

  // Neither exists, return PNG path anyway (will show broken image)
  const result: ImageFormat = { src: pngPath, format: 'png', exists: false };
  imageFormatCache.set(basePath, result);
  return result;
}

/**
 * Synchronous version that uses browser's native format support detection
 * This is faster but less reliable than the async version
 */
export function getBestImageFormatSync(basePath: string): string {
  // Check if browser supports WebP
  const supportsWebP = typeof window !== 'undefined' && 
    document.createElement('canvas').toDataURL('image/webp').indexOf('data:image/webp') === 0;
  
  // If WebP is supported, try WebP first, otherwise use PNG
  return supportsWebP ? `${basePath}.webp` : `${basePath}.png`;
}

/**
 * Smart image component props generator
 * Use this with Next.js Image component
 */
export async function getSmartImageProps(options: ImageLoadOptions) {
  const imageFormat = await getBestImageFormat(options.basePath);
  
  return {
    src: imageFormat.src,
    alt: options.alt,
    className: options.className,
    priority: options.priority,
    sizes: options.sizes,
    // Add format-specific optimizations
    quality: imageFormat.format === 'webp' ? 85 : 90,
  };
}

/**
 * Preload images for better performance
 * Call this in useEffect or during build time
 */
export function preloadImage(basePath: string): Promise<void> {
  return new Promise(async (resolve) => {
    const imageFormat = await getBestImageFormat(basePath);
    
    if (imageFormat.exists) {
      const img = new Image();
      img.onload = () => resolve();
      img.onerror = () => resolve(); // Still resolve to avoid hanging
      img.src = imageFormat.src;
    } else {
      resolve();
    }
  });
}

/**
 * Batch preload multiple images
 */
export async function preloadImages(basePaths: string[]): Promise<void> {
  const preloadPromises = basePaths.map(preloadImage);
  await Promise.allSettled(preloadPromises);
}

/**
 * Clear the image format cache (useful for development)
 */
export function clearImageCache(): void {
  imageFormatCache.clear();
}

/**
 * Get cache statistics for debugging
 */
export function getImageCacheStats() {
  return {
    size: imageFormatCache.size,
    entries: Array.from(imageFormatCache.entries()),
  };
} 