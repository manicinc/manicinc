"use client";
import React, { useState, useEffect } from 'react';
import { Zap, ZapOff } from 'lucide-react';
import { useTheme } from '@/context/ThemeContext';

interface ThemeToggleProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

export default function ThemeToggle({ className = '', size = 'md' }: ThemeToggleProps) {
  // Use the theme context for a reliable source of the current theme state
  const { isDarkMode } = useTheme();
  const [isTransitioning, setIsTransitioning] = useState<boolean>(false);
  const [mounted, setMounted] = useState<boolean>(false);

  // Determine icon size based on the size prop
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

  // Toggle theme using the global function from LayoutClient
  const toggleTheme = () => {
    if (isTransitioning) return;

    setIsTransitioning(true);

    // Use the global function if available, otherwise fallback
    if (typeof window.toggleTheme === 'function') {
      window.toggleTheme();

      // Wait for transition to complete
      setTimeout(() => {
        setIsTransitioning(false);
      }, 600); // Allow time for animations
    } else {
      // Fallback if global function is not available
      const htmlElement = document.documentElement;
      const currentTheme = htmlElement.classList.contains('dark') ? 'dark' : 'light';
      const newTheme = currentTheme === 'dark' ? 'light' : 'dark';

      // Add transition class
      htmlElement.classList.add('theme-transitioning');

      // Toggle theme
      htmlElement.classList.remove(currentTheme);
      htmlElement.classList.add(newTheme);

      // Store preference
      localStorage.setItem('theme', newTheme);

      // Remove transition class after animation
      setTimeout(() => {
        htmlElement.classList.remove('theme-transitioning');
        setIsTransitioning(false);
      }, 600);
    }
  };

  // If not mounted yet (SSR), render a placeholder of the same size
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
        onClick={toggleTheme}
        className={`flex items-center justify-center ${buttonSize} rounded-md
                    bg-bg-tertiary border border-border-primary
                    focus:outline-none transition-all duration-300
                    theme-toggle relative overflow-hidden z-10
                    hover:shadow-md hover:border-accent-primary`}
        aria-label={isDarkMode ? "Switch to light mode" : "Switch to dark mode"}
        disabled={isTransitioning}
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

        {/* Subtle glow on hover (neumorphism / retro-futurism hint) */}
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