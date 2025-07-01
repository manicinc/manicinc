// src/lib/structuredData.ts
export const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  "name": "Manic Agency",
  "alternateName": "Manic Inc",
  "url": "https://manic.agency",
  "logo": "https://manic.agency/logo-transparent.png",
  "description": "Digital agency specializing in Web3, AI, AR/VR, creative technology, and game publishing through Manic Games platform",
  "foundingDate": "2023",
  "address": {
    "@type": "PostalAddress",
    "addressLocality": "Los Angeles", 
    "addressRegion": "CA",
    "addressCountry": "US"
  },
  "contactPoint": {
    "@type": "ContactPoint",
    "contactType": "Customer Service",
    "email": "team@manic.agency"
  },
  "sameAs": [
    "https://github.com/manicinc",
    "https://twitter.com/manicagency",
    "https://games.manic.agency"
  ],
  "hasOfferCatalog": {
    "@type": "OfferCatalog",
    "name": "Services",
    "itemListElement": [
      {
        "@type": "Offer",
        "itemOffered": {
          "@type": "Service", 
          "name": "Web3 Development",
          "description": "Custom blockchain and decentralized applications"
        }
      },
      {
        "@type": "Offer",
        "itemOffered": {
          "@type": "Service",
          "name": "AI Integration", 
          "description": "AI-powered solutions and implementations"
        }
      },
      {
        "@type": "Offer",
        "itemOffered": {
          "@type": "Service",
          "name": "Game Publishing",
          "description": "Game publishing through Manic Games platform"
        }
      }
    ]
  }
}

export const websiteSchema = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  "name": "Manic Agency",
  "url": "https://manic.agency",
  "potentialAction": {
    "@type": "SearchAction",
    "target": {
      "@type": "EntryPoint",
      "urlTemplate": "https://manic.agency/blog?search={search_term_string}"
    },
    "query-input": "required name=search_term_string"
  }
}

export const blogSchema = {
  "@context": "https://schema.org",
  "@type": "Blog",
  "name": "Chronicles from the Looking-Glass",
  "description": "Dispatches, discoveries, and coded visions from Manic Agency",
  "url": "https://manic.agency/blog",
  "publisher": {
    "@type": "Organization",
    "name": "Manic Agency",
    "logo": "https://manic.agency/logo-transparent.png"
  }
} 