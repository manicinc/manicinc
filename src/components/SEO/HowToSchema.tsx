// src/components/SEO/HowToSchema.tsx
"use client";

interface HowToStep {
  name: string;
  text: string;
  url?: string;
  image?: string;
}

interface HowToSchemaProps {
  name: string;
  description: string;
  totalTime?: string; // e.g., "PT30M" for 30 minutes
  estimatedCost?: {
    value: string;
    currency: string;
  };
  steps: HowToStep[];
  image?: string;
}

export default function HowToSchema({ 
  name, 
  description, 
  totalTime, 
  estimatedCost, 
  steps, 
  image 
}: HowToSchemaProps) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "HowTo",
    "name": name,
    "description": description,
    "totalTime": totalTime,
    "estimatedCost": estimatedCost ? {
      "@type": "MonetaryAmount",
      "currency": estimatedCost.currency,
      "value": estimatedCost.value
    } : undefined,
    "supply": [],
    "tool": [],
    "step": steps.map((step, index) => ({
      "@type": "HowToStep",
      "position": index + 1,
      "name": step.name,
      "text": step.text,
      "url": step.url,
      "image": step.image
    })),
    "image": image
  };

  // Remove undefined values
  Object.keys(schema).forEach(key => 
    schema[key as keyof typeof schema] === undefined && delete schema[key as keyof typeof schema]
  );

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
