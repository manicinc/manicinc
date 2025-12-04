// src/components/ShareButtons.tsx
"use client";

import { useEffect, useState } from "react";
import { IconOrnateShare } from '@/components/Icons';


type ShareButtonsProps = {
  title: string;
  url: string; // Full absolute URL is best for sharing
  excerpt?: string; // Optional excerpt for some platforms
};

export default function ShareButtons({ title, url, excerpt = "" }: ShareButtonsProps) {
  const [isClient, setIsClient] = useState(false);
  const [copySuccess, setCopySuccess] = useState(false);

  useEffect(() => {
    // Ensure component runs only on client for navigator/fetch
    setIsClient(true);
  }, []);

  // Fetching counts can be unreliable and add network requests.
  // Consider removing if not essential or finding more robust APIs.
  // const [redditCount, setRedditCount] = useState<number | null>(null);
  // const [hnCount, setHnCount] =useState<number | null>(null);
  // useEffect(() => { if(isClient) { /* ... fetch logic ... */ } }, [url, isClient]);


  const encodedTitle = encodeURIComponent(title);
  // Ensure URL is absolute for sharing robustness
  const absoluteUrl = isClient ? new URL(url, window.location.origin).href : url;
  const encodedUrl = encodeURIComponent(absoluteUrl);
  const encodedExcerpt = encodeURIComponent(excerpt);

  const handleCopy = () => {
    if (!isClient) return;
    navigator.clipboard.writeText(absoluteUrl).then(() => {
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000); // Reset after 2 seconds
    }).catch(err => {
      console.error('Failed to copy:', err);
      alert('Failed to copy link.');
    });
  };

  // --- Share Targets ---
  const shareTargets = [
    { name: 'Twitter', icon: '🐦', href: `https://twitter.com/intent/tweet?text=${encodedTitle}&url=${encodedUrl}`, className: 'twitter' },
    { name: 'Facebook', icon: '📘', href: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`, className: 'facebook' },
    { name: 'LinkedIn', icon: '💼', href: `https://www.linkedin.com/shareArticle?mini=true&url=${encodedUrl}&title=${encodedTitle}&summary=${encodedExcerpt}`, className: 'linkedin' },
    { name: 'Reddit', icon: '👽', href: `https://reddit.com/submit?url=${encodedUrl}&title=${encodedTitle}`, className: 'reddit' },
    { name: 'Hacker News', icon: '🧡', href: `https://news.ycombinator.com/submitlink?u=${encodedUrl}&t=${encodedTitle}`, className: 'hackernews' },
    { name: 'WhatsApp', icon: '💬', href: `https://api.whatsapp.com/send?text=${encodedTitle}%20${encodedUrl}`, className: 'whatsapp', mobileOnly: true }, // Often better on mobile
    { name: 'Telegram', icon: '✈️', href: `https://t.me/share/url?url=${encodedUrl}&text=${encodedTitle}`, className: 'telegram' },
    { name: 'Pinterest', icon: '📌', href: `https://pinterest.com/pin/create/button/?url=${encodedUrl}&description=${encodedTitle}`, className: 'pinterest' }, // Needs media URL ideally
    { name: 'Email', icon: '✉️', href: `mailto:?subject=${encodedTitle}&body=Check%20out%20this%20post:%20${encodedUrl}`, className: 'email' },
  ];


  return (
    <div className="share-buttons-container">
      <h3 className="share-heading">
          <IconOrnateShare className="heading-icon" aria-hidden="true"/>
          Spread the Word
      </h3>

      <div className="share-grid">
        {shareTargets.map(target => (
          <a
            key={target.className}
            href={target.href}
            target="_blank"
            rel="noopener noreferrer"
            className={`share-btn ${target.className} ${target.mobileOnly ? 'mobile-only' : ''}`}
            title={`Share on ${target.name}`}
            aria-label={`Share on ${target.name}`}
          >
            <span className="share-icon" aria-hidden="true">{target.icon}</span>
            <span className="share-text">{target.name}</span>
            {/* Add counts here if implemented */}
          </a>
        ))}

        {/* Copy Button */}
        {isClient && navigator.clipboard && ( // Render only if copy is supported
           <button
             className="share-btn copy"
             onClick={handleCopy}
             title="Copy link to clipboard"
             aria-label="Copy link to clipboard"
           >
             <span className="share-icon" aria-hidden="true">{copySuccess ? '✅' : '📋'}</span>
             <span className="share-text">{copySuccess ? 'Copied!' : 'Copy Link'}</span>
           </button>
        )}
      </div>
    </div>
  );
}