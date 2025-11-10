// src/components/SEO/LocalBusinessSchema.tsx
"use client";

export default function LocalBusinessSchema() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "name": "Manic Agency",
    "alternateName": "MANIC AGENCY",
    "description": "Digital innovation studio specializing in AI development and creative technology solutions.",
    "url": "https://manic.agency",
    "logo": "https://manic.agency/manic-logo.png",
    "image": "https://manic.agency/og-default.webp",
    "address": {
      "@type": "PostalAddress",
      "addressLocality": "San Francisco",
      "addressRegion": "CA",
      "addressCountry": "US"
    },
    "geo": {
      "@type": "GeoCoordinates",
      "latitude": 37.7749,
      "longitude": -122.4194
    },
    "priceRange": "$$$",
    "openingHoursSpecification": {
      "@type": "OpeningHoursSpecification",
      "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
      "opens": "09:00",
      "closes": "18:00"
    },
    "telephone": "+1-contact-us",
    "email": "contact@manic.agency",
    "areaServed": "Worldwide",
    "sameAs": [
      "https://github.com/manicinc",
      "https://twitter.com/manicinc",
      "https://www.linkedin.com/company/manic-agency-llc/"
    ],
    "hasOfferCatalog": {
      "@type": "OfferCatalog",
      "name": "AI Development Services",
      "itemListElement": [
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Service",
            "name": "AI Integration",
            "description": "Custom AI solutions for your business needs"
          }
        },
        {
          "@type": "Offer", 
          "itemOffered": {
            "@type": "Service",
            "name": "Web Development",
            "description": "Modern web applications with AI capabilities"
          }
        },
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Service", 
            "name": "Creative Technology",
            "description": "Innovative digital experiences and solutions"
          }
        }
      ]
    }
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
