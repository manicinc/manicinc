// src/app/newsletter/page.tsx
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Subscribe to Transmissions - Manic Agency',
  description: 'Receive curated intelligence on AI, Web3, metaverse design, and digital frontier explorations.',
};

import NewsletterSection from '@/components/NewsletterSection';

export default function NewsletterPage() {
  return (
    <div className="min-h-screen bg-bg-primary">
      {/* Hero Section */}
      <section className="pt-24 pb-16 relative overflow-hidden">
        {/* Subtle geometric background pattern */}
        <div className="absolute inset-0 opacity-[0.02]">
          <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="xMidYMid slice">
            <pattern id="grid" x="0" y="0" width="10" height="10" patternUnits="userSpaceOnUse">
              <path d="M10,0 L0,0 L0,10" fill="none" stroke="var(--text-muted)" strokeWidth="0.5"/>
            </pattern>
            <rect width="100" height="100" fill="url(#grid)" />
          </svg>
        </div>
        
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative">
          <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold text-text-primary mb-6">
            Subscribe to Transmissions
          </h1>
          <p className="text-xl text-text-secondary max-w-2xl mx-auto font-body leading-relaxed">
            Curated intelligence from the digital frontier. Weekly dispatches on AI, Web3, metaverse architecture, and synthetic futures.
          </p>
          <div className="w-24 h-px bg-gradient-to-r from-transparent via-accent-highlight to-transparent mx-auto mt-8" />
        </div>
      </section>

      {/* What You'll Receive Section */}
      <section className="pb-12">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12 mb-16">
            {/* Agency Transmissions */}
            <div className="relative">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 flex-shrink-0">
                  <AgencyTransmissionIcon />
                </div>
                <div>
                  <h3 className="font-display text-xl font-semibold text-text-primary mb-3">
                    Agency Intelligence
                  </h3>
                  <ul className="space-y-2 text-text-secondary">
                    <li className="flex items-start gap-2">
                      <span className="text-accent-sage mt-1">→</span>
                      <span>Strategic frameworks for digital transformation</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-accent-sage mt-1">→</span>
                      <span>Exclusive project architectures and methodologies</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-accent-sage mt-1">→</span>
                      <span>Partnership opportunities and collaboration protocols</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Looking Glass Chronicles */}
            <div className="relative">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 flex-shrink-0">
                  <LookingGlassIcon />
                </div>
                <div>
                  <h3 className="font-display text-xl font-semibold text-text-primary mb-3">
                    Research Dispatches
                  </h3>
                  <ul className="space-y-2 text-text-secondary">
                    <li className="flex items-start gap-2">
                      <span className="text-accent-sage mt-1">→</span>
                      <span>Technical deep-dives on emerging technologies</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-accent-sage mt-1">→</span>
                      <span>Philosophical explorations of digital consciousness</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-accent-sage mt-1">→</span>
                      <span>Early access to experimental prototypes and tools</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Newsletter Form Section */}
      <NewsletterSection variant="main" background="accent" />

      {/* Privacy Protocol */}
      <section className="py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-bg-secondary rounded-2xl p-8 border border-border relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 opacity-5">
              <PrivacyShieldIcon />
            </div>
            
            <h3 className="font-display text-xl font-semibold text-text-primary mb-4">
              Privacy Protocol
            </h3>
            <div className="space-y-4 text-text-secondary">
              <p className="leading-relaxed">
                Your data sovereignty is paramount. We operate under strict privacy protocols:
              </p>
              <ul className="space-y-2">
                <li className="flex items-start gap-3">
                  <div className="w-5 h-5 rounded-full bg-accent-sage/20 flex items-center justify-center mt-0.5 flex-shrink-0">
                    <div className="w-2 h-2 rounded-full bg-accent-sage" />
                  </div>
                  <span>Zero third-party data sharing. Your information remains exclusively within our secure infrastructure.</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-5 h-5 rounded-full bg-accent-sage/20 flex items-center justify-center mt-0.5 flex-shrink-0">
                    <div className="w-2 h-2 rounded-full bg-accent-sage" />
                  </div>
                  <span>One-click unsubscribe protocol embedded in every transmission.</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-5 h-5 rounded-full bg-accent-sage/20 flex items-center justify-center mt-0.5 flex-shrink-0">
                    <div className="w-2 h-2 rounded-full bg-accent-sage" />
                  </div>
                  <span>Full GDPR compliance with data portability and deletion rights.</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-5 h-5 rounded-full bg-accent-sage/20 flex items-center justify-center mt-0.5 flex-shrink-0">
                    <div className="w-2 h-2 rounded-full bg-accent-sage" />
                  </div>
                  <span>Encrypted transmission channels using industry-standard protocols.</span>
                </li>
              </ul>
              <div className="flex flex-wrap gap-4 pt-4 border-t border-border">
                <a 
                  href="/privacy" 
                  className="text-accent-burgundy hover:text-accent-highlight transition-colors font-medium"
                >
                  Privacy Policy
                </a>
                <a 
                  href="/terms" 
                  className="text-accent-burgundy hover:text-accent-highlight transition-colors font-medium"
                >
                  Terms of Service
                </a>
                <a 
                  href="mailto:privacy@manic.agency" 
                  className="text-accent-burgundy hover:text-accent-highlight transition-colors font-medium"
                >
                  Data Inquiries
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

// SVG Icon Components
const AgencyTransmissionIcon = () => (
  <svg viewBox="0 0 64 64" className="w-full h-full">
    <defs>
      <linearGradient id="agency-grad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="var(--accent-burgundy)" />
        <stop offset="100%" stopColor="var(--accent-highlight)" />
      </linearGradient>
    </defs>
    {/* Hexagonal frame with circuit patterns */}
    <g className="agency-icon-group">
      {/* Outer hexagon */}
      <path 
        d="M32 4 L54 16 L54 48 L32 60 L10 48 L10 16 Z" 
        fill="none" 
        stroke="url(#agency-grad)" 
        strokeWidth="1.5"
        className="animate-draw-in"
      />
      {/* Inner circuit patterns */}
      <path 
        d="M32 12 L44 20 M44 20 L44 32 M32 12 L20 20 M20 20 L20 32 M20 32 L32 40 M44 32 L32 40 M32 40 L32 52"
        stroke="var(--accent-secondary)" 
        strokeWidth="1" 
        fill="none"
        strokeLinecap="round"
        className="animate-draw-in animation-delay-200"
      />
      {/* Center node */}
      <circle cx="32" cy="32" r="4" fill="var(--accent-highlight)" className="animate-pulse-subtle" />
      {/* Connection points */}
      <circle cx="32" cy="12" r="2" fill="var(--accent-burgundy)" />
      <circle cx="44" cy="20" r="2" fill="var(--accent-burgundy)" />
      <circle cx="44" cy="32" r="2" fill="var(--accent-burgundy)" />
      <circle cx="32" cy="52" r="2" fill="var(--accent-burgundy)" />
      <circle cx="20" cy="32" r="2" fill="var(--accent-burgundy)" />
      <circle cx="20" cy="20" r="2" fill="var(--accent-burgundy)" />
    </g>
  </svg>
);

const LookingGlassIcon = () => (
  <svg viewBox="0 0 64 64" className="w-full h-full">
    <defs>
      <linearGradient id="glass-grad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="var(--accent-secondary)" />
        <stop offset="100%" stopColor="var(--accent-sage)" />
      </linearGradient>
    </defs>
    {/* Ornate looking glass with geometric patterns */}
    <g className="glass-icon-group">
      {/* Main circle/lens */}
      <circle 
        cx="26" 
        cy="26" 
        r="18" 
        fill="none" 
        stroke="url(#glass-grad)" 
        strokeWidth="1.5"
        className="animate-draw-in"
      />
      {/* Inner refractive patterns */}
      <path 
        d="M26 8 L26 44 M8 26 L44 26 M14.5 14.5 L37.5 37.5 M37.5 14.5 L14.5 37.5"
        stroke="var(--accent-secondary)" 
        strokeWidth="0.5" 
        opacity="0.4"
        className="animate-draw-in animation-delay-200"
      />
      {/* Handle */}
      <path 
        d="M39 39 L52 52 L56 48 L43 35"
        fill="none" 
        stroke="var(--accent-highlight)" 
        strokeWidth="1.5"
        strokeLinecap="round"
        className="animate-draw-in animation-delay-300"
      />
      {/* Decorative vine detail on handle */}
      <path 
        d="M45 45 Q47 43 49 45 T53 49"
        fill="none" 
        stroke="var(--accent-sage)" 
        strokeWidth="0.75"
        opacity="0.6"
        className="animate-draw-in animation-delay-400"
      />
    </g>
  </svg>
);

const PrivacyShieldIcon = () => (
  <svg viewBox="0 0 64 64" className="w-full h-full">
    <defs>
      <linearGradient id="shield-grad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="var(--accent-sage)" opacity="0.3" />
        <stop offset="100%" stopColor="var(--accent-secondary)" opacity="0.3" />
      </linearGradient>
    </defs>
    {/* Shield with lock pattern */}
    <path 
      d="M32 4 L52 12 L52 28 C52 42 42 54 32 58 C22 54 12 42 12 28 L12 12 Z"
      fill="url(#shield-grad)"
      stroke="var(--accent-secondary)"
      strokeWidth="1"
      opacity="0.5"
    />
    {/* Lock icon inside */}
    <g transform="translate(32, 28)">
      <rect x="-8" y="-4" width="16" height="12" rx="2" fill="none" stroke="var(--accent-sage)" strokeWidth="1" opacity="0.6" />
      <path d="M-5 -4 L-5 -8 A5 5 0 0 1 5 -8 L5 -4" fill="none" stroke="var(--accent-sage)" strokeWidth="1" opacity="0.6" />
      <circle cx="0" cy="2" r="2" fill="var(--accent-sage)" opacity="0.6" />
    </g>
  </svg>
);