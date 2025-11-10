// src/components/SEO/OrganizationSchema.tsx
"use client";

export default function OrganizationSchema() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "Manic Agency",
    "alternateName": "MANIC AGENCY",
    "url": "https://manic.agency",
    "logo": "https://manic.agency/manic-logo.png",
    "description": "Digital innovation studio specializing in emergent AI technologies, web development, and creative digital solutions.",
    "foundingDate": "2024",
    "founders": [
      {
        "@type": "Person",
        "name": "Johnny Gall"
      }
    ],
    "address": {
      "@type": "PostalAddress",
      "addressLocality": "San Francisco",
      "addressRegion": "CA",
      "addressCountry": "US"
    },
    "sameAs": [
      "https://github.com/manicinc",
      "https://twitter.com/manicinc"
    ],
    "contactPoint": {
      "@type": "ContactPoint",
      "contactType": "general",
      "email": "contact@manic.agency",
      "url": "https://manic.agency/contact"
    },
    "makesOffer": [
      {
        "@type": "Offer",
        "itemOffered": {
          "@type": "Service",
          "name": "AI Development",
          "description": "Custom AI solutions including Frame.dev ecosystem"
        }
      },
      {
        "@type": "Offer",
        "itemOffered": {
          "@type": "Service",
          "name": "Web Development",
          "description": "Modern web applications with cutting-edge technologies"
        }
      }
    ],
    "knowsAbout": [
      "Artificial Intelligence",
      "Web Development", 
      "Open Source Software",
      "Digital Design",
      "Voice Interfaces",
      "Knowledge Management Systems"
    ]
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
