'use client';

import Image from 'next/image';
import { useState } from 'react';

interface OptimizedImageProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  fill?: boolean;
  sizes?: string;
  priority?: boolean;
  className?: string;
  style?: React.CSSProperties;
  placeholder?: 'blur' | 'empty';
  blurDataURL?: string;
}

export default function OptimizedImage({
  src,
  alt,
  width,
  height,
  fill,
  sizes,
  priority = false,
  className,
  style,
  placeholder,
  blurDataURL,
  ...props
}: OptimizedImageProps) {
  const [imgSrc, setImgSrc] = useState(src);
  const [hasError, setHasError] = useState(false);

  // Generate WebP version path
  const webpSrc = src.replace(/\.(jpg|jpeg|png)$/i, '.webp');
  
  // Check if WebP is supported and file exists
  const getOptimalSrc = () => {
    // For static export, we rely on Cloudflare to serve WebP automatically
    // based on browser support and Accept headers
    return imgSrc;
  };

  const handleError = () => {
    if (!hasError && imgSrc.includes('.webp')) {
      // Fallback to original format
      setImgSrc(src);
      setHasError(true);
    } else {
      console.warn(`Failed to load image: ${imgSrc}`);
    }
  };

  const imageProps = {
    src: getOptimalSrc(),
    alt,
    onError: handleError,
    className,
    style,
    priority,
    placeholder,
    blurDataURL,
    ...props,
  };

  if (fill) {
    return (
      <Image
        {...imageProps}
        fill
        sizes={sizes || '100vw'}
      />
    );
  }

  return (
    <Image
      {...imageProps}
      width={width}
      height={height}
      sizes={sizes}
    />
  );
} 