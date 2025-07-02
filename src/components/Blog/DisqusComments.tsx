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
  
  // Get the full URL for Disqus
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://manic.agency';
  const fullUrl = `${siteUrl}${postUrl}`;
  
  // Define a function to apply theme-specific styles
  const applyThemeStyles = () => {
    if (!disqusRef.current) return;
    
    // Add a data attribute to the container for CSS targeting
    disqusRef.current.setAttribute('data-disqus-theme', isDarkMode ? 'dark' : 'light');
    
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
    try {
      const iframes = document.querySelectorAll('iframe');
      iframes.forEach(iframe => {
        if (iframe.src && iframe.src.includes('disqus.com')) {
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
          iframe.contentWindow?.postMessage(message, '*');
        }
      });
    } catch (err) {
      console.warn("Could not communicate with Disqus iframe via postMessage:", err);
    }
  };
  
  // Effect to handle theme changes (including initial load)
  useEffect(() => {
    // Apply theme immediately on mount and theme changes
    const initialTimer = setTimeout(applyThemeStyles, 100);
    const secondTimer = setTimeout(applyThemeStyles, 1000);
    const thirdTimer = setTimeout(applyThemeStyles, 2000);
    const fourthTimer = setTimeout(applyThemeStyles, 3000);
    
    // Dispatch a custom event that our other effect can listen for
    const themeChangeEvent = new CustomEvent('themeChanged', {
      detail: { isDarkMode }
    });
    document.dispatchEvent(themeChangeEvent);

    // Reset Disqus if it exists and this isn't the initial load
    if ('DISQUS' in window) {
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
        console.log("Disqus reset with theme:", isDarkMode ? 'dark' : 'light');
      } catch (err) {
        console.error("Error resetting Disqus:", err);
      }
    }
    
    // Set up a mutation observer to watch for Disqus iframe being added/changed
    let observer: MutationObserver | null = null;
    if (disqusRef.current) {
      observer = new MutationObserver((mutations) => {
        mutations.forEach(() => {
          applyThemeStyles();
        });
      });
      
      observer.observe(disqusRef.current, { 
        childList: true, 
        subtree: true,
        attributes: true,
        attributeFilter: ['src', 'style', 'class']
      });
    }
    
    // Also listen for theme changes in the parent document
    const handleThemeChange = () => {
      setTimeout(applyThemeStyles, 500);
    };
    document.addEventListener('themeChanged', handleThemeChange);
    
    // Cleanup
    return () => {
      clearTimeout(initialTimer);
      clearTimeout(secondTimer);
      clearTimeout(thirdTimer);
      clearTimeout(fourthTimer);
      if (observer) {
        observer.disconnect();
      }
      document.removeEventListener('themeChanged', handleThemeChange);
    };
  }, [isDarkMode, fullUrl, postIdentifier, postTitle]);
  
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
      
      {/* Enhanced global styles for Disqus with initial theme support */}
      <style jsx global>{`
        /* Critical styles that override Disqus defaults - apply immediately */
        #disqus_thread {
          color-scheme: ${isDarkMode ? 'dark' : 'light'} !important;
          font-family: var(--font-body-blog) !important;
          position: relative;
          padding-bottom: 2rem;
          /* Force proper background and text colors */
          background-color: ${isDarkMode ? '#302435' : '#faf3e9'} !important;
          color: ${isDarkMode ? '#d8cce6' : '#4a3f35'} !important;
        }
        
        /* Disqus container theming */
        #disqus_thread,
        #disqus_thread .disqus-container,
        #disqus_thread [data-testid="disqus-container"] {
          background-color: ${isDarkMode ? '#302435' : '#faf3e9'} !important;
          color: ${isDarkMode ? '#d8cce6' : '#4a3f35'} !important;
        }
        
        /* Force Disqus iframe to use proper theme immediately */
        iframe[src*="disqus.com"],
        iframe#dsq-app2 {
          color-scheme: ${isDarkMode ? 'dark' : 'light'} !important;
          background-color: ${isDarkMode ? '#302435' : '#faf3e9'} !important;
        }
        
        /* Reactions container styling */
        #reactions__container,
        #reactions__container * {
          background-color: ${isDarkMode ? '#402e46' : '#f5ede1'} !important;
          color: ${isDarkMode ? '#d8cce6' : '#4a3f35'} !important;
        }
        
        /* Reaction items */
        .reaction-item,
        .reaction-item__button,
        .reaction-item__text {
          background-color: ${isDarkMode ? '#5f4867' : '#ede4d6'} !important;
          color: ${isDarkMode ? '#d8cce6' : '#4a3f35'} !important;
          border-color: ${isDarkMode ? '#6f586f' : '#d4c4b6'} !important;
        }
        
        .reaction-item__button:hover {
          background-color: ${isDarkMode ? '#d65076' : '#b66880'} !important;
          color: ${isDarkMode ? '#ffffff' : '#ffffff'} !important;
        }
        
        .reaction-item__selected {
          background-color: ${isDarkMode ? '#d65076' : '#b66880'} !important;
          color: ${isDarkMode ? '#ffffff' : '#ffffff'} !important;
        }
        
        /* Apply theme-specific styles immediately based on current theme */
        ${isDarkMode ? `
          #disqus_thread {
            --disqus-text-color: #d8cce6;
            --disqus-background: #402e46;
            --disqus-input-background: #22182b;
            --disqus-link-color: #d65076;
            --disqus-text-light: #a896b8;
            --disqus-border-color: #5a4a60;
          }
          
          #disqus_thread .post-message,
          #disqus_thread .reply-content,
          #disqus_thread button,
          #disqus_thread .publisher-desc {
            color: #d8cce6 !important;
            background-color: #402e46 !important;
          }
          
          #disqus_thread .textarea,
          #disqus_thread textarea {
            color: #f5f0e6 !important;
            background: #22182b !important;
            border-color: #5a4a60 !important;
          }
          
          #disqus_thread .publisher,
          #disqus_thread .reply-content,
          #disqus_thread .comment-content {
            background: #402e46 !important;
            border-color: #5a4a60 !important;
          }
          
          #disqus_thread a,
          #disqus_thread .publisher-anchor-color,
          #disqus_thread .publisher-anchor-hover-color {
            color: #d65076 !important;
          }
        ` : `
          #disqus_thread {
            --disqus-text-color: #4a3f35;
            --disqus-background: #f5ede1;
            --disqus-input-background: #fbf6ef;
            --disqus-link-color: #b66880;
            --disqus-text-light: #7a6d60;
            --disqus-border-color: #d4c4b6;
          }
          
          #disqus_thread .post-message,
          #disqus_thread .reply-content,
          #disqus_thread button,
          #disqus_thread .publisher-desc {
            color: #4a3f35 !important;
            background-color: #f5ede1 !important;
          }
          
          #disqus_thread .textarea,
          #disqus_thread textarea {
            color: #4a3f35 !important;
            background: #fbf6ef !important;
            border-color: #d4c4b6 !important;
          }
          
          #disqus_thread .publisher,
          #disqus_thread .reply-content,
          #disqus_thread .comment-content {
            background: #f5ede1 !important;
            border-color: #d4c4b6 !important;
          }
          
          #disqus_thread a,
          #disqus_thread .publisher-anchor-color,
          #disqus_thread .publisher-anchor-hover-color {
            color: #b66880 !important;
          }
        `}
      `}</style>
    </div>
  );
}