'use client';

import { DiscussionEmbed } from "disqus-react";
import { useTheme } from "@/context/ThemeContext";

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
  
  // Get the full URL for Disqus
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://manic.agency';
  const fullUrl = `${siteUrl}`;
  
  return (
    <div className={`disqus-comments-container ${className}`}>
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
      
      {/* Global styles for dark mode */}
      <style jsx global>{`
        /* Dark mode fixes for Disqus */
        .dark #disqus_thread {
          color-scheme: dark;
        }
        
        /* Force Disqus iframe to use dark mode in dark theme */
        .dark #disqus_thread iframe {
          color-scheme: dark;
        }
      `}</style>
    </div>
  );
}