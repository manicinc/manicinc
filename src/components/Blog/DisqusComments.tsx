'use client';

import { DiscussionEmbed } from "disqus-react";
import { useTheme } from "@/context/ThemeContext";
import { useEffect, useRef } from "react";

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
  const { isDarkMode } = useTheme();
  const disqusRef = useRef<HTMLDivElement>(null);
  const isInitialMount = useRef(true);
  
  // Get the full URL for Disqus
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://manic.agency';
  const fullUrl = `${siteUrl}${postUrl}`;
  
  // Effect to handle theme changes AFTER initial render
  useEffect(() => {
    // Skip the first render - we don't need to reset Disqus then
    if (isInitialMount.current) {
      isInitialMount.current = false;
      return;
    }

    // Dispatch a custom event that our other effect can listen for
    const themeChangeEvent = new CustomEvent('themeChanged', {
      detail: { isDarkMode }
    });
    document.dispatchEvent(themeChangeEvent);

    // Find the Disqus iframe - 'in' operator check ensures we don't cause errors if window.DISQUS isn't defined
    if ('DISQUS' in window) {
      try {
        // @ts-ignore - DISQUS is added to window by the Disqus script
        window.DISQUS.reset({
          reload: true,
          config: function () {
            this.page.identifier = postIdentifier;
            this.page.url = fullUrl;
            this.page.title = postTitle;
            // Theme is handled via CSS, not via config property
          }
        });
        console.log("Disqus reset with theme:", isDarkMode ? 'dark' : 'light');
      } catch (err) {
        console.error("Error resetting Disqus:", err);
      }
    }
  }, [isDarkMode, fullUrl, postIdentifier, postTitle]); // Dependencies include theme state
  
  // Additional effect to apply extra styles AFTER Disqus loads
  useEffect(() => {
    if (!disqusRef.current) return;
    
    // Define a function to apply theme-specific styles
    const applyThemeStyles = () => {
      // Try multiple methods to style Disqus content
      
      // Method 1: Target the Disqus iframe if it exists (most reliable but may be blocked by CORS)
      const disqusIframe = document.getElementById('dsq-app2') as HTMLIFrameElement;
      if (disqusIframe && disqusIframe.contentDocument) {
        try {
          const iframeHead = disqusIframe.contentDocument.head;
          
          // Create a style element if it doesn't exist
          let styleEl = iframeHead.querySelector('#manic-disqus-theme');
          if (!styleEl) {
            styleEl = document.createElement('style');
            styleEl.id = 'manic-disqus-theme';
            iframeHead.appendChild(styleEl);
          }
          
          // Apply different styles based on theme
          styleEl.textContent = isDarkMode 
            ? `.post-message, .reply-content, button, .publisher-desc { color: #d8cce6 !important; }
               .textarea { color: #f5f0e6 !important; background: #22182b !important; }
               .publisher, .reply-content, .comment-content { background: #402e46 !important; }
               body { background: transparent !important; }
               a, .publisher-anchor-color, .publisher-anchor-hover-color { color: #d65076 !important; }`
            : `.post-message, .reply-content, button { color: #4a3f35 !important; }
               .textarea { color: #4a3f35 !important; background: #fbf6ef !important; }
               .publisher, .reply-content, .comment-content { background: #f5ede1 !important; }
               body { background: transparent !important; }
               a, .publisher-anchor-color, .publisher-anchor-hover-color { color: #b66880 !important; }`;
        } catch (err) {
          console.warn("Could not inject styles into Disqus iframe:", err);
        }
      }
      
      // Method 2: Use postMessage API to communicate with Disqus iframe
      // This is a more compatible approach that doesn't require CORS access
      try {
        // Find all iframes that might be Disqus
        const iframes = document.querySelectorAll('iframe');
        iframes.forEach(iframe => {
          if (iframe.src && iframe.src.includes('disqus.com')) {
            // Create a message with theme information
            const message = {
              cssOverride: isDarkMode
                ? `.post-message, .reply-content, button, .publisher-desc { color: #d8cce6 !important; }
                   .textarea { color: #f5f0e6 !important; background: #22182b !important; }
                   .publisher, .reply-content, .comment-content { background: #402e46 !important; }
                   body { background: transparent !important; }
                   a, .publisher-anchor-color, .publisher-anchor-hover-color { color: #d65076 !important; }`
                : `.post-message, .reply-content, button { color: #4a3f35 !important; }
                   .textarea { color: #4a3f35 !important; background: #fbf6ef !important; }
                   .publisher, .reply-content, .comment-content { background: #f5ede1 !important; }
                   body { background: transparent !important; }
                   a, .publisher-anchor-color, .publisher-anchor-hover-color { color: #b66880 !important; }`,
              theme: isDarkMode ? 'dark' : 'light'
            };
            // Post the message to the iframe
            iframe.contentWindow?.postMessage(message, '*');
          }
        });
      } catch (err) {
        console.warn("Could not communicate with Disqus iframe via postMessage:", err);
      }
      
      // Method 3: Add a data attribute to the container for CSS targeting
      if (disqusRef.current) {
        disqusRef.current.setAttribute('data-disqus-theme', isDarkMode ? 'dark' : 'light');
      }
    };
    
    // Wait for Disqus to load before trying to apply styles - try multiple times
    const initialStyleTimer = setTimeout(applyThemeStyles, 1000);
    const secondStyleTimer = setTimeout(applyThemeStyles, 2000);
    const thirdStyleTimer = setTimeout(applyThemeStyles, 3000);
    
    // Set up a mutation observer to watch for Disqus iframe being added/changed
    const observer = new MutationObserver((mutations) => {
      mutations.forEach(() => {
        applyThemeStyles();
      });
    });
    
    // Start observing the Disqus container
    observer.observe(disqusRef.current, { 
      childList: true, 
      subtree: true,
      attributes: true,
      attributeFilter: ['src', 'style', 'class']
    });
    
    // Also listen for theme changes in the parent document
    const handleThemeChange = () => {
      setTimeout(applyThemeStyles, 500);
    };
    document.addEventListener('themeChanged', handleThemeChange);
    
    // Cleanup
    return () => {
      clearTimeout(initialStyleTimer);
      clearTimeout(secondStyleTimer);
      clearTimeout(thirdStyleTimer);
      observer.disconnect();
      document.removeEventListener('themeChanged', handleThemeChange);
    };
  }, [isDarkMode]);
  
  return (
    <div 
      ref={disqusRef}
      className={`disqus-comments-container ${className} ${isDarkMode ? 'dark' : 'light'}`}
      data-theme={isDarkMode ? 'dark' : 'light'} // Add data attribute for potential CSS targeting
    >
      <div className="disqus-header">
        <h3 className="disqus-title">Comments from Disqus</h3>
        <div className="disqus-divider"></div>
      </div>
      
      <DiscussionEmbed
        shortname="www-manic-agency" // Your Disqus shortname
        config={{
          url: fullUrl,
          identifier: postIdentifier,
          title: postTitle,
          language: 'en'
          // Note: theme is handled via reset and CSS, not via config
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
      
      {/* Global styles for Disqus */}
      <style jsx global>{`
        /* Critical styles that override Disqus defaults */
        #disqus_thread {
          color-scheme: ${isDarkMode ? 'dark' : 'light'};
          font-family: var(--font-body-blog);
          position: relative;
          padding-bottom: 2rem;
        }
        
        /* Force Disqus iframe to use proper theme in parent color scheme */
        iframe[src*="disqus.com"],
        iframe#dsq-app2 {
          color-scheme: ${isDarkMode ? 'dark' : 'light'} !important;
        }
        
        /* Force dark theme for Disqus elements in dark mode */
        html.dark body #disqus_thread,
        .disqus-comments-container.dark #disqus_thread {
          --disqus-text-color: var(--text-primary);
          --disqus-background: var(--bg-secondary);
          --disqus-input-background: var(--bg-primary);
          --disqus-link-color: var(--accent-primary);
          --disqus-text-light: var(--text-muted);
          --disqus-border-color: var(--bg-tertiary);
        }
        
        /* Force light theme for Disqus elements in light mode */
        html.light body #disqus_thread,
        .disqus-comments-container.light #disqus_thread {
          --disqus-text-color: var(--text-primary);
          --disqus-background: var(--bg-secondary);
          --disqus-input-background: var(--bg-primary);
          --disqus-link-color: var(--accent-primary);
          --disqus-text-light: var(--text-muted);
          --disqus-border-color: var(--bg-tertiary);
        }
        
        /* Target Disqus elements more specifically */
        #disqus_thread iframe {
          background-color: transparent !important;
        }
        
        /* Apply theme styles to Disqus elements */
        #disqus_thread .textarea,
        #disqus_thread textarea {
          background-color: var(--disqus-input-background) !important;
          color: var(--disqus-text-color) !important;
          border-color: var(--disqus-border-color) !important;
        }
        
        #disqus_thread .post,
        #disqus_thread .publisher-background-color,
        #disqus_thread .publisher-anchor-color,
        #disqus_thread .publisher-background-hover-color {
          background-color: var(--disqus-background) !important;
          color: var(--disqus-text-color) !important;
        }
        
        #disqus_thread .publisher-anchor-hover-color,
        #disqus_thread a {
          color: var(--disqus-link-color) !important;
        }
        
        #disqus_thread .post-body,
        #disqus_thread .post-message,
        #disqus_thread .publisher {
          color: var(--disqus-text-color) !important;
        }
        
        /* CSS Hack: Create a themed overlay during loading */
        body:after {
          content: '';
          position: fixed;
          pointer-events: none;
          top: 0;
          left: 0;
          width: 0;
          height: 0;
          z-index: -9999;
          opacity: 0;
          background: ${isDarkMode ? 'black' : 'white'};
        }
        
        /* If Disqus is loading, show a themed placeholder */
        #disqus_thread:empty::after {
          content: "Loading comments...";
          display: block;
          padding: 2rem;
          text-align: center;
          color: var(--text-muted);
          font-family: var(--font-meta-blog);
          font-style: italic;
          background-color: var(--bg-secondary);
          border-radius: var(--radius-lg);
          border: 1px dashed var(--bg-tertiary);
        }
        
        /* Add style modifications for Disqus specific elements */
        #disqus_thread .thread-message {
          background-color: var(--disqus-background) !important;
          color: var(--disqus-text-color) !important;
          border-color: var(--disqus-border-color) !important;
        }
        
        #disqus_thread .load-more, 
        #disqus_thread .show-all {
          background-color: var(--disqus-background) !important;
          color: var(--disqus-link-color) !important;
          border-color: var(--disqus-border-color) !important;
        }
        
        #disqus_thread .connect__button, 
        #disqus_thread .connect__heading {
          color: var(--disqus-text-color) !important;
          background-color: var(--disqus-background) !important;
        }
      `}</style>
    </div>
  );
}