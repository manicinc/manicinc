'use client';

import React, { useState } from 'react';
import { AsciiArtPlaceholder } from '@/lib/asciiPlaceholders';

// Interface for all image component props
interface ImageProps {
  src: string;
  alt?: string;
  size?: 'small' | 'medium' | 'large' | 'full';
  align?: 'left' | 'center' | 'right';
  effect?: 'shadow' | 'border' | 'glow' | 'glitch' | 'none';
  borderStyle?: 'simple' | 'gradient' | 'glow' | 'inset' | 'dashed' | 'none';
  className?: string;
  caption?: string;
  onClick?: () => void;
}

// Base image renderer component
export default function ImageRenderer({
  src,
  alt = '',
  size = 'medium',
  align = 'center',
  effect = 'none',
  className = '',
  caption,
  onClick,
}: ImageProps) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [error, setError] = useState(false);
  
  // Generate CSS classes based on props
  const sizeClass = `image-${size}`;
  const alignClass = `image-${align}`;
  const effectClass = effect !== 'none' ? `image-${effect}` : '';
  
  const combinedClasses = `content-image ${sizeClass} ${alignClass} ${effectClass} ${className} ${isLoaded ? 'opacity-100' : 'opacity-0'} transition-opacity duration-500`;
  
  // Handle image loading and errors
  const handleLoad = () => setIsLoaded(true);
  const handleError = () => {
    setError(true);
    setIsLoaded(true);
  };
  
  return (
    <figure className={`image-with-caption ${alignClass}`}>
      {/* Image placeholder while loading */}
      {!isLoaded && !error && (
        <div 
          className={`animate-pulse bg-bg-tertiary rounded-md ${sizeClass} w-full`}
          style={{ aspectRatio: '16/9' }}
        />
      )}
      
      {/* Error state */}
      {error && (
        <div className={`flex items-center justify-center bg-bg-tertiary text-text-muted rounded-md ${sizeClass}`} style={{ aspectRatio: '16/9' }}>
          <AsciiArtPlaceholder />
        </div>
      )}
      
      {/* Actual image */}
      <img
        src={src}
        alt={alt || caption || 'Image'}
        className={combinedClasses}
        loading="lazy"
        onLoad={handleLoad}
        onError={handleError}
        onClick={onClick}
        style={{ cursor: onClick ? 'pointer' : 'default' }}
      />
      
      {/* Optional caption */}
      {caption && <figcaption>{caption}</figcaption>}
    </figure>
  );
}

// Define interfaces for the image grid
interface ImageGridProps {
  columns?: 2 | 3 | 4;
  gap?: 'small' | 'medium' | 'large';
  children: React.ReactNode;
  caption?: string;
}

/**
 * ImageGrid component for displaying multiple images in a grid layout
 * Use within Markdown content by wrapping regular image markdown
 */
export function ImageGrid({
  columns = 3,
  gap = 'medium',
  children,
  caption
}: ImageGridProps) {
  // Calculate grid template columns based on the number of columns
  const gridTemplateColumns = `repeat(${columns}, 1fr)`;
  
  // Calculate gap size based on the gap prop
  const gapSize = {
    small: '0.5rem',
    medium: '1rem',
    large: '1.5rem'
  }[gap];
  
  // Process children to extract image elements and apply grid cell styling
  const processedChildren = React.Children.map(children, (child) => {
    // Skip non-element children
    if (!React.isValidElement(child)) return null;
    
    // Handle standard img elements
    if (child.type === 'img') {
      const imgProps = child.props as React.ImgHTMLAttributes<HTMLImageElement>;
      return (
        <div className="grid-item">
          <ImageRenderer
            src={imgProps.src || ''}
            alt={imgProps.alt || ''}
            className="grid-image"
            size="full"
          />
        </div>
      );
    }
    
    // Special handling for our own components
    // For these we want to clone and pass props
    if (
      typeof child.type === 'function' && 
      ((typeof (child.type as any).name === 'string' && 
        ['ImageRenderer', 'ZoomableImage', 'AsciiArtPlaceholder'].includes((child.type as any).name)) ||
        // Check if component is one of our known types by name
        child.type === ImageRenderer ||
        child.type === ZoomableImage ||
        child.type === AsciiArtPlaceholder)
    ) {
      return (
        <div className="grid-item">
          {React.cloneElement(child, {
            ...child.props,
            className: `${child.props.className || ''} grid-image`,
            size: 'full'
          })}
        </div>
      );
    }
    
    // Handle any other elements (pass through)
    return <div className="grid-item">{child}</div>;
  });
  
  return (
    <figure className="image-grid-container">
      <div
        className="image-grid"
        style={{
          display: 'grid',
          gridTemplateColumns,
          gap: gapSize
        }}
      >
        {processedChildren}
      </div>
      {caption && <figcaption className="image-grid-caption">{caption}</figcaption>}
      
      {/* Grid-specific styles */}
      <style jsx>{`
        .image-grid-container {
          margin: 2rem 0;
        }
        
        .image-grid-caption {
          text-align: center;
          font-size: 0.9rem;
          color: var(--text-muted);
          margin-top: 0.75rem;
          font-style: italic;
        }
        
        :global(.grid-item) {
          overflow: hidden;
          border-radius: 8px;
          transition: transform 0.3s ease;
        }
        
        :global(.grid-item:hover) {
          transform: translateY(-4px);
        }
        
        :global(.grid-image) {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.5s ease;
        }
        
        :global(.grid-item:hover .grid-image) {
          transform: scale(1.05);
        }
      `}</style>
    </figure>
  );
}

// Image with zoom/lightbox functionality
export function ZoomableImage({ src, alt, size = 'medium', align = 'center', caption }: ImageProps) {
  const [isZoomed, setIsZoomed] = useState(false);
  
  const toggleZoom = () => setIsZoomed(!isZoomed);
  
  return (
    <>
      <ImageRenderer
        src={src}
        alt={alt}
        size={size}
        align={align}
        caption={caption}
        onClick={toggleZoom}
        className="hover:cursor-zoom-in"
      />
      
      {/* Lightbox */}
      {isZoomed && (
        <div 
          className="fixed inset-0 z-50 bg-bg-primary/90 backdrop-blur-md flex items-center justify-center"
          onClick={toggleZoom}
        >
          <div className="relative max-w-[90vw] max-h-[90vh]">
            <img
              src={src}
              alt={alt || caption || 'Zoomed image'}
              className="max-w-full max-h-[90vh] object-contain"
            />
            {caption && (
              <figcaption className="absolute bottom-0 left-0 right-0 p-4 bg-bg-primary/80 text-text-primary text-center">
                {caption}
              </figcaption>
            )}
          </div>
          <button
            className="absolute top-4 right-4 text-4xl text-text-primary hover:text-accent-primary"
            onClick={toggleZoom}
          >
            &times;
          </button>
        </div>
      )}
    </>
  );
}
