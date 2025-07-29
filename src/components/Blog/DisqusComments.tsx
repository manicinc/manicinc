'use client';

import { DiscussionEmbed } from "disqus-react";
import { useTheme } from "@/context/ThemeContext";
import { useEffect, useRef, useState } from "react";

interface DisqusCommentsProps {
  postTitle: string;
  postUrl: string;
  postIdentifier: string;
  className?: string;
}

export default function DisqusComments({
  postTitle,
  postUrl,
  postIdentifier,
  className = '',
}: DisqusCommentsProps) {
  const { isDarkMode, mounted } = useTheme();
  const disqusRef = useRef<HTMLDivElement>(null);
  const [disqusLoaded, setDisqusLoaded] = useState(false);
  const [initialThemeDetected, setInitialThemeDetected] = useState(false);
  
  // Get the full URL for Disqus
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://manic.agency';
  const fullUrl = `${siteUrl}${postUrl}`;
  
  // Detect initial theme from DOM before loading Disqus
  useEffect(() => {
    if (mounted) {
      // Theme context is ready, we can proceed
      setInitialThemeDetected(true);
    }
  }, [mounted]);
  
  // Set theme attributes and handle theme changes
  useEffect(() => {
    if (disqusRef.current && initialThemeDetected) {
      disqusRef.current.setAttribute('data-disqus-theme', isDarkMode ? 'dark' : 'light');
      
      // Reset Disqus when theme changes to apply new styling
      if (disqusLoaded && 'DISQUS' in window) {
        try {
          // @ts-ignore - DISQUS is added to window by the Disqus script
          window.DISQUS.reset({
            reload: true,
            config: function () {
              this.page.identifier = postIdentifier;
              this.page.url = fullUrl;
              this.page.title = postTitle;
            }
          });
        } catch (err) {
          console.warn("Error resetting Disqus:", err);
        }
      }
    }
  }, [isDarkMode, postIdentifier, fullUrl, postTitle, disqusLoaded, initialThemeDetected]);
  
  // Track when Disqus is loaded
  useEffect(() => {
    if (!initialThemeDetected) return;
    
    const checkDisqusLoaded = () => {
      if (document.getElementById('disqus_thread')?.innerHTML.trim()) {
        setDisqusLoaded(true);
      }
    };
    
    const timer = setTimeout(checkDisqusLoaded, 1000);
    const observer = new MutationObserver(checkDisqusLoaded);
    
    if (disqusRef.current) {
      observer.observe(disqusRef.current, { childList: true, subtree: true });
    }
    
    return () => {
      clearTimeout(timer);
      observer.disconnect();
    };
  }, [initialThemeDetected]);
  
  // Don't render Disqus until theme is properly detected
  if (!mounted || !initialThemeDetected) {
    return (
      <div className={`disqus-comments-container ${className} loading`}>
        <div className="disqus-header">
          <h3 className="disqus-title">Comments from Disqus</h3>
          <div className="disqus-divider"></div>
        </div>
        <div className="disqus-loading">
          <p>Loading comments...</p>
        </div>
      </div>
    );
  }

  return (
    <div 
      ref={disqusRef}
      className={`disqus-comments-container ${className} ${isDarkMode ? 'dark' : 'light'}`}
      data-theme={isDarkMode ? 'dark' : 'light'}
    >
      <div className="disqus-header">
        <h3 className="disqus-title">Comments from Disqus</h3>
        <div className="disqus-divider"></div>
      </div>
      
      <DiscussionEmbed
        shortname="www-manic-agency"
        config={{
          url: fullUrl,
          identifier: postIdentifier,
          title: postTitle,
          language: 'en'
        }}
      />
      
      {/* Custom styles for Disqus */}
      <style jsx>{`
        .disqus-comments-container {
          margin-top: 2rem;
          margin-bottom: 2rem;
          padding: 1.5rem;
          border-radius: 0.5rem;
          background-color: var(--bg-secondary);
          border: 1px solid var(--border-primary);
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
          transition: all 0.3s ease;
        }
        
        .disqus-comments-container:hover {
          box-shadow: 0 6px 16px rgba(0, 0, 0, 0.1);
          border-color: var(--accent-primary);
        }
        
        .disqus-header {
          display: flex;
          align-items: center;
          margin-bottom: 1.5rem;
        }
        
        .disqus-title {
          font-size: 1.25rem;
          margin: 0;
          color: var(--text-primary);
          font-family: var(--font-display);
          position: relative;
        }
        
        .disqus-title::before {
          content: "";
          position: absolute;
          width: 3px;
          height: 100%;
          background: var(--accent-primary);
          left: -10px;
          border-radius: 3px;
        }
        
        .disqus-divider {
          flex-grow: 1;
          height: 1px;
          background: linear-gradient(
            90deg,
            var(--accent-primary) 0%,
            var(--accent-secondary) 100%
          );
          margin-left: 1rem;
          opacity: 0.6;
        }
      `}</style>
      
      {/* Clean container styling */}
      <style jsx global>{`
        /* Clean container that respects your theme */
        #disqus_thread {
          background-color: ${isDarkMode ? 'var(--bg-secondary)' : 'var(--bg-blog-paper)'} !important;
          border-radius: var(--radius-lg);
          padding: 1rem;
          min-height: 200px;
          position: relative;
          transition: background-color 0.3s ease;
          border: 1px solid ${isDarkMode ? 'rgba(var(--accent-primary-rgb), 0.2)' : 'rgba(var(--text-muted-rgb), 0.1)'};
        }
        
        /* Loading state styling */
        .disqus-loading {
          display: flex;
          align-items: center;
          justify-content: center;
          min-height: 200px;
          color: var(--text-muted);
          font-family: var(--font-meta-blog);
          font-size: 0.9rem;
        }
        
        #disqus_thread:empty::after {
          content: "Loading Disqus comments...";
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          color: var(--text-muted);
          font-family: var(--font-meta-blog);
          font-size: 0.9rem;
          text-align: center;
        }
        

      `}</style>
    </div>
  );
}