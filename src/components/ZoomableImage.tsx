'use client';

import React, { useState, useEffect } from 'react';

interface ZoomableImageProps {
  src: string;
  alt?: string;
  caption?: string;
  className?: string;
  size?: 'small' | 'medium' | 'large' | 'full';
  align?: 'left' | 'center' | 'right';
  effect?: 'shadow' | 'border' | 'glow' | 'glitch' | 'none';
  border?: 'simple' | 'gradient' | 'glow' | 'inset' | 'dashed' | 'none';
  zoomable?: boolean;
}

export default function ZoomableImage({ 
  src, 
  alt = '', 
  caption, 
  className = '', 
  size = 'medium',
  align = 'center',
  effect = 'none',
  border = 'none',
  zoomable = true
}: ZoomableImageProps) {
  const [isZoomed, setIsZoomed] = useState(false);
  const [modalId, setModalId] = useState('');

  // Generate unique ID for modal
  useEffect(() => {
    setModalId(`zoom-modal-${Math.random().toString(36).substring(2, 9)}`);
  }, []);

  // Handle opening the zoom view
  const openZoom = () => {
    if (!zoomable) return;
    setIsZoomed(true);
    // Prevent body scrolling when zoomed
    document.body.style.overflow = 'hidden';
  };

  // Handle closing the zoom view
  const closeZoom = () => {
    setIsZoomed(false);
    document.body.style.overflow = '';
  };

  // Close on ESC key
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (isZoomed && e.key === 'Escape') {
        closeZoom();
      }
    };
    
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [isZoomed]);

  // Get CSS classes based on props
  const getSizeClass = () => {
    switch (size) {
      case 'small': return 'image-small';
      case 'medium': return 'image-medium';
      case 'large': return 'image-large';
      case 'full': return 'image-full';
      default: return 'image-medium';
    }
  };

  const getAlignClass = () => {
    switch (align) {
      case 'left': return 'image-left';
      case 'center': return 'image-center';
      case 'right': return 'image-right';
      default: return 'image-center';
    }
  };

  const getEffectClass = () => {
    switch (effect) {
      case 'shadow': return 'image-shadow';
      case 'border': return 'image-border';
      case 'glow': return 'image-glow';
      case 'glitch': return 'image-glitch';
      default: return '';
    }
  };

  const getBorderClass = () => {
    switch (border) {
      case 'simple': return 'border-simple';
      case 'gradient': return 'border-gradient';
      case 'glow': return 'border-glow';
      case 'inset': return 'border-inset';
      case 'dashed': return 'border-dashed';
      default: return '';
    }
  };

  // Add modal to document body to avoid z-index issues
  useEffect(() => {
    if (isZoomed) {
      const modal = document.createElement('div');
      modal.id = modalId;
      modal.className = `image-zoom-overlay ${isZoomed ? 'active' : ''}`;
      modal.innerHTML = `
        <div class="image-zoom-container">
          <img src="${src}" alt="${alt}" class="image-zoom-img" />
          ${caption ? `<div class="image-zoom-caption">${caption}</div>` : ''}
        </div>
        <button class="image-zoom-close" aria-label="Close image">&times;</button>
      `;
      
      document.body.appendChild(modal);
      
      // Add click handler to close on background click
      modal.addEventListener('click', (e) => {
        if (e.target === modal || (e.target as HTMLElement).classList.contains('image-zoom-close')) {
          closeZoom();
        }
      });
      
      // Prevent propagation from image clicks
      const imgContainer = modal.querySelector('.image-zoom-container');
      if (imgContainer) {
        imgContainer.addEventListener('click', (e) => {
          e.stopPropagation();
        });
      }
      
      return () => {
        const modalElement = document.getElementById(modalId);
        if (modalElement) {
          document.body.removeChild(modalElement);
        }
      };
    }
  }, [isZoomed, src, alt, caption, modalId]);

  // Combine all classes
  const imageClasses = `
    content-image 
    ${getSizeClass()} 
    ${getAlignClass()} 
    ${getEffectClass()} 
    ${getBorderClass()} 
    ${zoomable ? 'cursor-zoom-in' : ''} 
    ${className}
  `.trim();

  // Use the caption from the alt text if it has the format: "description|caption=My caption"
  let parsedAlt = alt;
  let parsedCaption = caption;
  
  if (alt && alt.includes('|caption=')) {
    const parts = alt.split('|caption=');
    parsedAlt = parts[0].trim();
    parsedCaption = parts[1].trim() || caption;
  }

  return (
    <figure className={`image-with-caption ${getAlignClass()}`}>
      <img
        src={src}
        alt={parsedAlt}
        className={imageClasses}
        onClick={zoomable ? openZoom : undefined}
        loading="lazy"
      />
      {parsedCaption && (
        <figcaption className="text-center text-sm text-text-muted mt-2">
          {parsedCaption}
        </figcaption>
      )}
      
      {/* Styles for image modal */}
      <style jsx global>{`
        .image-zoom-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background-color: rgba(10, 11, 19, 0.9);
          backdrop-filter: blur(5px);
          z-index: 9999;
          display: flex;
          align-items: center;
          justify-content: center;
          opacity: 0;
          pointer-events: none;
          transition: opacity 0.3s ease;
        }
        
        .image-zoom-overlay.active {
          opacity: 1;
          pointer-events: auto;
        }
        
        .image-zoom-container {
          position: relative;
          max-width: 90vw;
          max-height: 90vh;
        }
        
        .image-zoom-img {
          max-width: 100%;
          max-height: 90vh;
          object-fit: contain;
          transform: scale(0.95);
          transition: transform 0.3s ease;
          box-shadow: 0 5px 30px rgba(0, 0, 0, 0.3);
        }
        
        .image-zoom-overlay.active .image-zoom-img {
          transform: scale(1);
        }
        
        .image-zoom-caption {
          position: absolute;
          bottom: -40px;
          left: 0;
          right: 0;
          text-align: center;
          color: var(--text-primary);
          padding: 10px;
          font-size: 14px;
          background-color: rgba(29, 32, 56, 0.7);
          border-radius: 0 0 8px 8px;
        }
        
        .image-zoom-close {
          position: absolute;
          top: 20px;
          right: 20px;
          width: 40px;
          height: 40px;
          border-radius: 50%;
          background: rgba(229, 49, 112, 0.2);
          color: white;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          font-size: 24px;
          transition: background-color 0.3s ease;
          border: none;
        }
        
        .image-zoom-close:hover {
          background: rgba(229, 49, 112, 0.4);
        }
        
        /* Glitch effect for images */
        .image-glitch {
          position: relative;
          overflow: hidden;
        }
        
        .image-glitch::before,
        .image-glitch::after {
          content: "";
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: inherit;
          background-size: cover;
          background-position: center;
          opacity: 0;
          transition: opacity 0.2s;
          pointer-events: none;
        }
        
        .image-glitch::before {
          transform: translateX(-5px);
          background-color: rgba(229, 49, 112, 0.2);
          mix-blend-mode: multiply;
        }
        
        .image-glitch::after {
          transform: translateX(5px);
          background-color: rgba(127, 90, 240, 0.2);
          mix-blend-mode: screen;
        }
        
        .image-glitch:hover::before,
        .image-glitch:hover::after {
          opacity: 1;
          animation: glitch 0.3s infinite;
        }
        
        @keyframes glitch {
          0%, 100% { opacity: 0.2; }
          50% { opacity: 0.3; }
        }
      `}</style>
    </figure>
  );
}