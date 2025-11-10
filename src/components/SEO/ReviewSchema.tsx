// src/components/SEO/ReviewSchema.tsx
"use client";

interface Review {
  author: string;
  reviewRating: number;
  reviewBody: string;
  datePublished?: string;
}

interface ReviewSchemaProps {
  reviews: Review[];
  itemReviewed: {
    type: 'Organization' | 'Service' | 'Product';
    name: string;
  };
}

export default function ReviewSchema({ reviews, itemReviewed }: ReviewSchemaProps) {
  const aggregateRating = reviews.reduce((sum, review) => sum + review.reviewRating, 0) / reviews.length;
  
  const schema = {
    "@context": "https://schema.org",
    "@type": itemReviewed.type,
    "name": itemReviewed.name,
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": aggregateRating.toFixed(1),
      "reviewCount": reviews.length,
      "bestRating": "5",
      "worstRating": "1"
    },
    "review": reviews.map(review => ({
      "@type": "Review",
      "author": {
        "@type": "Person",
        "name": review.author
      },
      "reviewRating": {
        "@type": "Rating",
        "ratingValue": review.reviewRating,
        "bestRating": "5",
        "worstRating": "1"
      },
      "reviewBody": review.reviewBody,
      "datePublished": review.datePublished || new Date().toISOString()
    }))
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
