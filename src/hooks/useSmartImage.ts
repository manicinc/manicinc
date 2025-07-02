"use client";

import { useState, useEffect } from 'react';
import { getBestImageFormat, getBestImageFormatSync } from '@/lib/imageUtils';

interface UseSmartImageOptions {
  basePath: string;
  fallbackToSync?: boolean; // If true, will use sync detection as fallback
}

interface SmartImageResult {
  src: string;
  format: 'webp' | 'png';
  isLoading: boolean;
  exists: boolean;
  error?: string;
}

/**
 * React hook for smart image loading with WebP/PNG detection
 * 
 * @example
 * ```tsx
 * function MyComponent() {
 *   const { src, format, isLoading } = useSmartImage({ 
 *     basePath: "/assets/blog/my-image" 
 *   });
 *   
 *   if (isLoading) return <div>Loading...</div>;
 *   
 *   return <Image src={src} alt="My image" />;
 * }
 * ```
 */
export function useSmartImage({ basePath, fallbackToSync = true }: UseSmartImageOptions): SmartImageResult {
  const [result, setResult] = useState<SmartImageResult>({
    src: fallbackToSync ? getBestImageFormatSync(basePath) : `${basePath}.png`,
    format: 'png',
    isLoading: true,
    exists: false,
  });

  useEffect(() => {
    let isMounted = true;

    async function detectImageFormat() {
      try {
        const imageFormat = await getBestImageFormat(basePath);
        
        if (isMounted) {
          setResult({
            src: imageFormat.src,
            format: imageFormat.format,
            isLoading: false,
            exists: imageFormat.exists,
          });
        }
      } catch (error) {
        if (isMounted) {
          setResult(prev => ({
            ...prev,
            isLoading: false,
            error: error instanceof Error ? error.message : 'Unknown error',
          }));
        }
      }
    }

    detectImageFormat();

    return () => {
      isMounted = false;
    };
  }, [basePath]);

  return result;
}

/**
 * Hook for batch loading multiple images
 */
export function useSmartImages(basePaths: string[]) {
  const [results, setResults] = useState<Record<string, SmartImageResult>>({});
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    async function loadAllImages() {
      const newResults: Record<string, SmartImageResult> = {};

      // Initialize with sync detection for immediate rendering
      basePaths.forEach(basePath => {
        newResults[basePath] = {
          src: getBestImageFormatSync(basePath),
          format: 'png',
          isLoading: true,
          exists: false,
        };
      });

      if (isMounted) {
        setResults(newResults);
      }

      // Then do async detection for better accuracy
      const promises = basePaths.map(async (basePath) => {
        try {
          const imageFormat = await getBestImageFormat(basePath);
          return { basePath, imageFormat };
        } catch (error) {
          return { 
            basePath, 
            imageFormat: null, 
            error: error instanceof Error ? error.message : 'Unknown error' 
          };
        }
      });

      const resolvedResults = await Promise.allSettled(promises);

      if (isMounted) {
        const finalResults = { ...newResults };
        
        resolvedResults.forEach((result, index) => {
          const basePath = basePaths[index];
          
          if (result.status === 'fulfilled') {
            const { imageFormat, error } = result.value;
            
            if (imageFormat) {
              finalResults[basePath] = {
                src: imageFormat.src,
                format: imageFormat.format,
                isLoading: false,
                exists: imageFormat.exists,
              };
            } else {
              finalResults[basePath] = {
                ...finalResults[basePath],
                isLoading: false,
                error,
              };
            }
          } else {
            finalResults[basePath] = {
              ...finalResults[basePath],
              isLoading: false,
              error: 'Failed to load image',
            };
          }
        });

        setResults(finalResults);
        setIsLoading(false);
      }
    }

    loadAllImages();

    return () => {
      isMounted = false;
    };
  }, [basePaths.join(',')]); // Re-run when basePaths array changes

  return { results, isLoading };
} 