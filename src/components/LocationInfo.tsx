import React from 'react';
import { MapPin } from 'lucide-react'; // Or your preferred icon library

const LocationInfo = () => {
  return (
    // Use theme variables via Tailwind arbitrary properties or CSS
    <div className="location-widget p-6 border border-[color:var(--bg-tertiary)] rounded-[--radius-lg] bg-[color:var(--bg-secondary)] shadow-soft">
      <h4 className="font-meta-blog text-sm font-semibold uppercase text-[color:var(--accent-secondary)] flex items-center mb-3 tracking-wider"> {/* Sage green header */}
        <MapPin className="mr-2 w-4 h-4 flex-shrink-0"/>
        Our Workshop
      </h4>
      {/* Use blog body font for address */}
      <address className="text-[color:var(--text-secondary)] text-sm not-italic font-body-blog leading-relaxed">
        Manic Agency<br />
        Los Angeles, California<br />
        United States
      </address>
      <p className="text-xs text-[color:var(--text-muted)] mt-3 font-meta-blog">
        (Consultations primarily virtual or by appointment)
      </p>
      {/* Optional: Map Placeholder - Replace with actual embed if desired */}
      <div className="mt-4 aspect-video bg-[color:var(--bg-tertiary)] border border-[color:var(--bg-tertiary)] rounded-[--radius-base] flex items-center justify-center text-[color:var(--text-muted)] text-xs font-mono">
         [Map Area Placeholder]
      </div>
    </div>
  );
};

export default LocationInfo;