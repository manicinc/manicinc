'use client';

import React, { useState, useEffect, useRef } from 'react';

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
  const [zoomLevel, setZoomLevel] = useState(1);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const imageRef = useRef<HTMLImageElement>(null);

  // Generate unique ID for modal
  useEffect(() => {
    setModalId(`zoom-modal-${Math.random().toString(36).substring(2, 9)}`);
  }, []);

  // Handle opening the zoom view
  const openZoom = () => {
    if (!zoomable) return;
    setIsZoomed(true);
    // Reset zoom level and position when opening
    setZoomLevel(1);
    setPosition({ x: 0, y: 0 });
    // Prevent body scrolling when zoomed
    document.body.style.overflow = 'hidden';
  };

  // Handle closing the zoom view
  const closeZoom = () => {
    setIsZoomed(false);
    document.body.style.overflow = '';
  };

  // Zoom in function
  const zoomIn = () => {
    setZoomLevel(prev => Math.min(prev + 0.25, 4));
  };

  // Zoom out function
  const zoomOut = () => {
    setZoomLevel(prev => Math.max(prev - 0.25, 0.5));
  };

  // Reset zoom and position
  const resetZoom = () => {
    setZoomLevel(1);
    setPosition({ x: 0, y: 0 });
  };

  // Handle drag start
  const handleDragStart = (e: React.MouseEvent<HTMLImageElement>) => {
    if (zoomLevel <= 1) return; // Only allow dragging when zoomed in
    setIsDragging(true);
    setDragStart({ 
      x: e.clientX - position.x, 
      y: e.clientY - position.y 
    });
  };

  // Handle drag move
  const handleDragMove = (e: MouseEvent) => {
    if (!isDragging) return;
    
    // Calculate new position
    const newX = e.clientX - dragStart.x;
    const newY = e.clientY - dragStart.y;
    
    // Limit dragging based on zoom level and image size
    setPosition({ x: newX, y: newY });
    
    e.preventDefault();
  };

  // Handle drag end
  const handleDragEnd = () => {
    setIsDragging(false);
  };

  // Close on ESC key
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (isZoomed && e.key === 'Escape') {
        closeZoom();
      }
    };
    
    // Setup drag handlers
    const handleMouseMove = (e: MouseEvent) => {
      handleDragMove(e);
    };
    
    const handleMouseUp = () => {
      handleDragEnd();
    };
    
    // Setup wheel zoom
    const handleWheel = (e: WheelEvent) => {
      if (isZoomed) {
        if (e.deltaY < 0) {
          zoomIn();
        } else {
          zoomOut();
        }
        e.preventDefault();
      }
    };
    
    window.addEventListener('keydown', handleEsc);
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
    window.addEventListener('wheel', handleWheel, { passive: false });
    
    return () => {
      window.removeEventListener('keydown', handleEsc);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
      window.removeEventListener('wheel', handleWheel);
    };
  }, [isZoomed, isDragging, dragStart]);

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
      case 'left': return 'align-left';
      case 'center': return 'align-center';
      case 'right': return 'align-right';
      default: return 'align-center';
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
          <div class="zoom-image-wrapper">
            <img 
              src="${src}" 
              alt="${alt}" 
              class="image-zoom-img" 
              style="transform: scale(${zoomLevel}) translate(${position.x / zoomLevel}px, ${position.y / zoomLevel}px)"
            />
          </div>
          ${caption ? `<div class="image-zoom-caption">${caption}</div>` : ''}
          <div class="zoom-controls">
            <button class="zoom-btn zoom-out-btn" aria-label="Zoom out">−</button>
            <button class="zoom-btn zoom-reset-btn" aria-label="Reset zoom">1:1</button>
            <button class="zoom-btn zoom-in-btn" aria-label="Zoom in">+</button>
          </div>
        </div>
        <button class="image-zoom-close" aria-label="Close image">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>
      `;
      
      document.body.appendChild(modal);
      
      // Add click handlers
      const closeButton = modal.querySelector('.image-zoom-close');
      if (closeButton) {
        closeButton.addEventListener('click', closeZoom);
      }
      
      const zoomInButton = modal.querySelector('.zoom-in-btn');
      if (zoomInButton) {
        zoomInButton.addEventListener('click', zoomIn);
      }
      
      const zoomOutButton = modal.querySelector('.zoom-out-btn');
      if (zoomOutButton) {
        zoomOutButton.addEventListener('click', zoomOut);
      }
      
      const resetButton = modal.querySelector('.zoom-reset-btn');
      if (resetButton) {
        resetButton.addEventListener('click', resetZoom);
      }
      
      // Get the image element to attach drag handlers
      const zoomImg = modal.querySelector('.image-zoom-img') as HTMLImageElement;
      if (zoomImg) {
        zoomImg.addEventListener('mousedown', (e) => {
          if (zoomLevel > 1) {
            setIsDragging(true);
            setDragStart({ 
              x: e.clientX - position.x, 
              y: e.clientY - position.y 
            });
            e.preventDefault();
          }
        });
      }
      
      // Background click to close
      modal.addEventListener('click', (e) => {
        if (e.target === modal) {
          closeZoom();
        }
      });
      
      // Prevent propagation from container clicks
      const imgContainer = modal.querySelector('.image-zoom-container');
      if (imgContainer) {
        imgContainer.addEventListener('click', (e) => {
          e.stopPropagation();
        });
      }
      
      // Update the image transform whenever zoom or position changes
      const updateImageTransform = () => {
        const img = document.querySelector(`#${modalId} .image-zoom-img`) as HTMLImageElement;
        if (img) {
          img.style.transform = `scale(${zoomLevel}) translate(${position.x / zoomLevel}px, ${position.y / zoomLevel}px)`;
        }
      };
      
      // Set up a mutation observer to update the image when the DOM changes
      const observer = new MutationObserver(() => {
        updateImageTransform();
      });
      
      observer.observe(modal, { attributes: true, childList: true, subtree: true });
      
      return () => {
        observer.disconnect();
        const modalElement = document.getElementById(modalId);
        if (modalElement) {
          document.body.removeChild(modalElement);
        }
      };
    }
  }, [isZoomed, src, alt, caption, modalId, zoomLevel, position]);

  // Combine all classes
  const imageClasses = `
    content-image 
    ${getSizeClass()} 
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
    <figure className={`markdown-image-wrapper ${getAlignClass()}`}>
      <img
        ref={imageRef}
        src={src}
        alt={parsedAlt}
        className={imageClasses}
        onClick={zoomable ? openZoom : undefined}
        loading="lazy"
      />
      {parsedCaption && (
        <figcaption>
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
          background-color: rgba(10, 11, 19, 0.95);
          backdrop-filter: blur(8px);
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
          display: flex;
          flex-direction: column;
          align-items: center;
          max-width: 95vw;
          max-height: 95vh;
        }
        
        .zoom-image-wrapper {
          overflow: hidden;
          position: relative;
          display: flex;
          align-items: center;
          justify-content: center;
          width: 100%;
          height: 100%;
          max-width: 95vw;
          max-height: 85vh;
        }
        
        .image-zoom-img {
          max-width: 95vw;
          max-height: 85vh;
          object-fit: contain;
          transform-origin: center;
          transition: transform 0.3s ease;
          box-shadow: 0 10px 40px rgba(0, 0, 0, 0.4);
          cursor: move;
          will-change: transform;
          user-select: none;
        }
        
        .image-zoom-caption {
          margin-top: 15px;
          text-align: center;
          color: var(--text-primary);
          padding: 10px 20px;
          font-size: 16px;
          background-color: rgba(29, 32, 56, 0.7);
          border-radius: 8px;
          max-width: 90%;
          font-family: var(--font-body-blog);
          font-style: italic;
        }
        
        .zoom-controls {
          position: absolute;
          bottom: -70px;
          left: 50%;
          transform: translateX(-50%);
          display: flex;
          gap: 15px;
          background-color: rgba(29, 32, 56, 0.7);
          padding: 8px 16px;
          border-radius: 30px;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
        }
        
        .zoom-btn {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          background: rgba(var(--accent-primary-rgb), 0.3);
          color: white;
          font-size: 20px;
          font-weight: bold;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          border: none;
          transition: background-color 0.3s ease, transform 0.2s ease;
        }
        
        .zoom-btn:hover {
          background: rgba(var(--accent-primary-rgb), 0.5);
          transform: scale(1.1);
        }
        
        .zoom-btn:active {
          transform: scale(0.95);
        }
        
        .zoom-reset-btn {
          font-size: 14px;
          width: auto;
          padding: 0 15px;
          border-radius: 20px;
        }
        
        .image-zoom-close {
          position: absolute;
          top: 20px;
          right: 20px;
          width: 48px;
          height: 48px;
          border-radius: 50%;
          background: rgba(var(--bg-tertiary-rgb), 0.8);
          backdrop-filter: blur(10px);
          color: var(--text-primary);
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          border: 2px solid rgba(var(--accent-primary-rgb), 0.3);
          transition: all 0.3s ease;
          z-index: 10;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
        }
        
        .image-zoom-close svg {
          width: 24px;
          height: 24px;
          transition: transform 0.3s ease;
        }
        
        .image-zoom-close:hover {
          background: rgba(var(--accent-primary-rgb), 0.9);
          border-color: var(--accent-primary);
          transform: scale(1.1);
          box-shadow: 0 6px 20px rgba(var(--accent-primary-rgb), 0.4);
        }
        
        .image-zoom-close:hover svg {
          color: white;
          transform: rotate(90deg);
        }
        
        .image-zoom-close:active {
          transform: scale(0.95);
        }
        
        /* Light mode adjustments for close button */
        .light .image-zoom-close {
          background: rgba(255, 255, 255, 0.95);
          color: var(--color-light-ink);
          border-color: rgba(var(--accent-secondary-rgb), 0.3);
        }
        
        .light .image-zoom-close:hover {
          background: var(--accent-secondary);
          color: white;
          border-color: var(--accent-secondary);
          box-shadow: 0 6px 20px rgba(var(--accent-secondary-rgb), 0.4);
        }
        
        /* Improved Glitch effect */
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
          background-color: rgba(var(--accent-primary-rgb), 0.2);
          mix-blend-mode: multiply;
        }
        
        .image-glitch::after {
          transform: translateX(5px);
          background-color: rgba(var(--accent-highlight-rgb), 0.2);
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
        
        /* Make regular images bigger by default */
        .image-medium {
          max-width: 650px; /* Increased from 500px */
          height: auto;
        }
        
        .image-large {
          max-width: 950px; /* Increased from 800px */
          height: auto;
        }
        
        /* Responsive adjustments */
        @media (max-width: 768px) {
          .zoom-controls {
            bottom: -60px;
          }
          
          .zoom-btn {
            width: 36px;
            height: 36px;
            font-size: 18px;
          }
          
          .image-zoom-close {
            top: 10px;
            right: 10px;
          }
          
          .image-zoom-img {
            max-height: 80vh;
          }
          
          .image-medium, .image-large {
            max-width: 100%;
          }
        }
      `}</style>
    </figure>
  );
}