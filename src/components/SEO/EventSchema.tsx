// src/components/SEO/EventSchema.tsx
"use client";

interface EventSchemaProps {
  name: string;
  description: string;
  startDate: string;
  endDate?: string;
  location?: {
    name: string;
    address?: string;
  };
  organizer?: string;
  eventAttendanceMode?: 'OfflineEventAttendanceMode' | 'OnlineEventAttendanceMode' | 'MixedEventAttendanceMode';
  eventStatus?: 'EventScheduled' | 'EventPostponed' | 'EventCancelled';
  offers?: {
    price: string;
    currency: string;
    availability?: string;
    url?: string;
  };
  image?: string;
}

export default function EventSchema({ 
  name,
  description,
  startDate,
  endDate,
  location,
  organizer = "Manic Agency",
  eventAttendanceMode = 'OnlineEventAttendanceMode',
  eventStatus = 'EventScheduled',
  offers,
  image
}: EventSchemaProps) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "Event",
    "name": name,
    "description": description,
    "startDate": startDate,
    "endDate": endDate || startDate,
    "eventAttendanceMode": `https://schema.org/${eventAttendanceMode}`,
    "eventStatus": `https://schema.org/${eventStatus}`,
    "location": location ? {
      "@type": eventAttendanceMode === 'OnlineEventAttendanceMode' ? "VirtualLocation" : "Place",
      "name": location.name,
      "address": location.address,
      "url": eventAttendanceMode === 'OnlineEventAttendanceMode' ? location.address : undefined
    } : {
      "@type": "VirtualLocation",
      "url": "https://manic.agency"
    },
    "organizer": {
      "@type": "Organization",
      "name": organizer,
      "url": "https://manic.agency"
    },
    "offers": offers ? {
      "@type": "Offer",
      "price": offers.price,
      "priceCurrency": offers.currency,
      "availability": offers.availability || "https://schema.org/InStock",
      "url": offers.url || "https://manic.agency/contact",
      "validFrom": new Date().toISOString()
    } : undefined,
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
