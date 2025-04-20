// src/components/FooterBranding.tsx
'use client'; // Needs client for usePathname

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import LookingGlassLogo from '../LookingGlassLogo/LookingGlassLogo'; // Import the new component

const FooterBranding = () => {
  const pathname = usePathname();
  const isBlog = pathname.startsWith('/blog');

  const BrandLogo = isBlog ? LookingGlassLogo : () => (
    <Link href="/" aria-label="Manic Agency Home" className="block footer-logo standard-logo-wrapper group logo-glitch"> {/* Add logo-glitch class */}
       <Image
        src="/logo-transparent.png" // Path from /public
        alt="Manic Agency Logo"
        width={80} // Adjust size as needed
        height={80} // Adjust size
        className="mx-auto transition-transform duration-300 ease-out group-hover:scale-105"
        // Add priority if it's above the fold, otherwise lazy loading is default
       />
    </Link>
  );

  const brandName = isBlog ? "Manic Agency" : "Manic Agency";
  const tagline = isBlog ? "Curiouser and curiouser..." : "Mania Driven Development"; // Themed taglines

  return (
    <div className="footer-branding text-center">
      <div className="mb-3">
        <BrandLogo />
      </div>
      {/* Conditionally render name with link to respective home */}
      <Link href={isBlog ? "" : "/"} className={`inline-block font-bold text-lg mb-1 transition-colors hover:text-[color:var(--accent-highlight)] ${ isBlog ? 'font-script-blog' : 'font-display'}`}>
        {/* {brandName} */}
      </Link>
      {/* Tagline */}
      <p className={`text-xs font-mono text-[color:var(--text-muted)] opacity-80 tracking-wide ${isBlog ? 'italic' : ''}`}>
        {tagline} {/* Apply glitch effect via CSS if needed */}
      </p>
    </div>
  );
};

export default FooterBranding;