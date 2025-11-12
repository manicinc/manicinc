// src/components/FooterBranding.tsx
'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import LookingGlassLogo from '../Nav/LookingGlassLogo/LookingGlassLogo';

const FooterBranding = () => {
  const pathname = usePathname();
  const isBlog = pathname.startsWith('/blog');

  // Conditional logo component
  const BrandLogo = isBlog ? () => (
    <div className="looking-glass-wrapper mb-1">
      <LookingGlassLogo scale={0.85} /> {/* Slightly smaller for footer */}
    </div>
  ) : () => (
    <Link href="/" aria-label="Manic Agency Home" className="block footer-logo standard-logo-wrapper group logo-glitch">
       <Image
        src="/logo-transparent.png"
        alt="Manic Agency Logo"
        width={80}
        height={80}
        loading="lazy"
        decoding="async"
        className="mx-auto transition-transform duration-300 ease-out group-hover:scale-105"
       />
    </Link>
  );

  // Conditional branding content
  const brandName = isBlog ? "Looking Glass" : "Manic Agency";
  const tagline = isBlog ? "Curiouser and curiouser..." : "Metaverses intersect here";

  return (
    <div className="footer-branding text-center">
      <div className="mb-3">
        <BrandLogo />
      </div>
      
      {/* Brand name with conditional styling */}
      <h3 className={`
        text-lg font-bold mb-1 
        transition-colors duration-300
        ${isBlog 
          ? 'font-script-blog text-[color:var(--accent-highlight)] hover:text-[color:var(--accent-secondary)]' 
          : 'font-display text-[color:var(--text-primary)] hover:text-[color:var(--accent-primary)]'}
      `}>
        {brandName}
      </h3>
      
      {/* Tagline with conditional styling */}
      <p className={`
        text-xs opacity-80 tracking-wide
        ${isBlog 
          ? 'font-meta-blog italic text-[color:var(--accent-secondary)]' 
          : 'font-mono text-[color:var(--text-muted)]'}
      `}>
        {tagline}
      </p>
    </div>
  );
};

export default FooterBranding;