// src/components/SEO/WebSiteSchema.tsx
"use client";

export default function WebSiteSchema() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "Manic Agency",
    "alternateName": "MANIC AGENCY",
    "url": "https://manic.agency",
    "description": "Digital innovation studio - We are the Framers, denoising the web through AI and open source",
    "publisher": {
      "@type": "Organization",
      "name": "Manic Agency",
      "url": "https://manic.agency"
    },
    "potentialAction": {
      "@type": "SearchAction",
      "target": {
        "@type": "EntryPoint",
        "urlTemplate": "https://manic.agency/blog?search={search_term_string}"
      },
      "query-input": "required name=search_term_string"
    },
    "inLanguage": "en-US",
    "copyrightYear": 2024,
    "copyrightHolder": {
      "@type": "Organization",
      "name": "Manic Agency"
    },
    "mainEntity": {
      "@type": "CreativeWork",
      "name": "Frame.dev",
      "url": "https://frame.dev",
      "description": "Open-source AI development ecosystem"
    }
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
