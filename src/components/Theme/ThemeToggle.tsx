"use client";
import React, { useState, useEffect } from 'react';
import { Zap, ZapOff } from 'lucide-react';
import { useTheme } from '@/context/ThemeContext';

interface ThemeToggleProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

export default function DirectThemeToggle({ className = '', size = 'md' }: ThemeToggleProps) {
  // Use the theme context instead of managing local state
  const { isDarkMode, toggleTheme } = useTheme();
  const [isTransitioning, setIsTransitioning] = useState<boolean>(false);
  const [mounted, setMounted] = useState<boolean>(false);

  // Size mappings
  const iconSizes = {
    sm: { button: 'w-8 h-8', icon: 'w-4 h-4' },
    md: { button: 'w-10 h-10', icon: 'w-5 h-5' },
    lg: { button: 'w-12 h-12', icon: 'w-6 h-6' }
  };

  const { button: buttonSize, icon: iconSize } = iconSizes[size];

  // Initialize on mount
  useEffect(() => {
    setMounted(true);
  }, []);

  // Handle theme toggle with transition state
  const handleToggleTheme = () => {
    if (isTransitioning || !mounted) return;
    
    setIsTransitioning(true);
    
    // Use the context toggle function
    toggleTheme();
    
    // Set a timeout to re-enable the button after transition
    setTimeout(() => {
      setIsTransitioning(false);
    }, 350);
  };

  // SSR placeholder
  if (!mounted) {
    return (
      <div
        className={`${buttonSize} flex items-center justify-center bg-transparent ${className}`}
        aria-hidden="true"
      />
    );
  }

  return (
    <div className={`relative ${className}`}>
      <button
        onClick={handleToggleTheme}
        className={`flex items-center justify-center ${buttonSize} rounded-md
                    bg-bg-tertiary border border-border-primary
                    focus:outline-none transition-all duration-300
                    theme-toggle relative overflow-hidden z-10
                    hover:shadow-md hover:border-accent-primary`}
        aria-label={isDarkMode ? "Switch to light mode" : "Switch to dark mode"}
        disabled={isTransitioning}
        type="button"
      >
        {!isTransitioning ? (
          isDarkMode ? (
            <Zap className={`${iconSize} text-accent-primary`} />
          ) : (
            <ZapOff className={`${iconSize} text-accent-highlight`} />
          )
        ) : (
          <div className="circuit-loader">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path className="circuit-path" d="M12 2L2 7L12 12L22 7L12 2Z" stroke="currentColor" strokeWidth="1.5"/>
              <path className="circuit-path" d="M2 17L12 22L22 17" stroke="currentColor" strokeWidth="1.5"/>
              <path className="circuit-path" d="M2 12L12 17L22 12" stroke="currentColor" strokeWidth="1.5"/>
              <path className="circuit-path" d="M12 2V22" stroke="currentColor" strokeWidth="1.5"/>
            </svg>
          </div>
        )}

        {/* Subtle glow on hover */}
        <span className="absolute inset-0 rounded-md opacity-0 transition-opacity duration-200
                       bg-accent-primary/10 hover:opacity-30"></span>
      </button>

      <style jsx>{`
        .circuit-loader {
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--accent-primary);
        }

        .circuit-path {
          stroke-dasharray: 60;
          stroke-dashoffset: 60;
          animation: circuit 2s infinite linear;
        }

        .circuit-path:nth-child(2) {
          animation-delay: 0.5s;
        }

        .circuit-path:nth-child(3) {
          animation-delay: 1s;
        }

        .circuit-path:nth-child(4) {
          animation-delay: 1.5s;
        }

        @keyframes circuit {
          0% {
            stroke-dashoffset: 60;
          }
          100% {
            stroke-dashoffset: 0;
          }
        }

        .theme-toggle:disabled {
          cursor: not-allowed;
          opacity: 0.5;
        }
      `}</style>
    </div>
  );
}