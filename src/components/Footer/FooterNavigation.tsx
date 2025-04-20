// src/components/FooterNavigation.tsx
"use client";
import React from 'react';
import Link from 'next/link';
// --- IMPORT BOTH navigation data arrays ---
import { footerNavigationData, blogFooterNavigationData } from '@/lib/constants'; // Adjust path if needed

// --- Define props for the component ---
interface FooterNavigationProps {
    isBlog: boolean; // Add prop to receive blog status
}

const FooterNavigation: React.FC<FooterNavigationProps> = ({ isBlog }) => { // Destructure isBlog from props
  // --- Conditionally choose the data source ---
  const navigation = isBlog ? blogFooterNavigationData : footerNavigationData;

  // Check if the chosen navigation data exists
  if (!navigation || navigation.length === 0) {
    return null;
  }

  return (
    <nav aria-label="Footer Navigation">
      {/* Styling/Layout remains the same, data source changes */}
      <ul role="list" className="grid grid-cols-2 gap-x-8 gap-y-10 sm:grid-cols-3 lg:grid-cols-4">
        {navigation.map((section) => (
          section?.title && (
            <li key={section.title}>
              {/* Heading class might need conditional logic if blog titles are styled differently */}
              <div className={`footer-heading ${isBlog ? 'blog-footer-heading' : ''}`}>
                {section.title}
              </div>
              <ul role="list" className={`mt-4 space-y-3 text-sm footer-list ${isBlog ? 'blog-footer-list' : ''}`}>
                {section.links?.map((link) => (
                  link?.title && link.href && (
                    <li key={link.title}>
                      <Link
                        href={link.href}
                        // Apply conditional link styles if needed
                        className={`footer-link ${isBlog ? 'blog-footer-link' : ''}`}>
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