// src/components/FooterNavigation.tsx
"use client"; // May not be needed if 'navigation' constant is simple
import React from 'react';
import { footerNavigationData as navigation } from '@/lib/constants'; // Assuming path and structure are correct
import Link from 'next/link';

const FooterNavigation: React.FC = () => {
  // Check if navigation data exists
  if (!navigation || navigation.length === 0) {
    return null; // Render nothing if no navigation data
  }

  return (
    <nav aria-label="Footer Navigation">
      {/* Responsive grid layout */}
      <ul role="list" className="grid grid-cols-2 gap-x-8 gap-y-10 sm:grid-cols-3 lg:grid-cols-4">
        {navigation.map((section) => (
          // Ensure section and section.title exist
          section?.title && (
            <li key={section.title}>
              {/* Section Title - Use meta font, themed color */}
              {/* Using class defined in Footer's global style or move to CSS file */}
              <div className="footer-heading">
                {section.title}
              </div>
              {/* Link List */}
              <ul role="list" className="mt-4 space-y-3 text-sm footer-list"> {/* Use list class */}
                {section.links?.map((link) => (
                  // Ensure link, link.title, and link.href exist
                  link?.title && link.href && (
                    <li key={String(link.title)}>
                      <Link
                        href={link.href}
                        className="footer-link"> {/* Use link class */}
                        {link.title}
                      </Link>
                    </li>
                  )
                ))}
              </ul>
            </li>
          )
        ))}
      </ul>
    </nav>
  );
};

export default FooterNavigation;