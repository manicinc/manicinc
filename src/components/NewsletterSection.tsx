'use client';

// Option 1: Try embed (might not work due to Sender.net issues)
// import SenderNewsletterEmbed from './SenderNewsletterEmbed';

// Option 2: Simple button solution (guaranteed to work)
import SenderNewsletterButton from './SenderNewsletterButton';
import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

interface NewsletterSectionProps {
  variant?: 'main' | 'blog';
  className?: string;
  background?: 'default' | 'dark' | 'accent';
  onSignupSuccess?: () => void;
}

interface Testimonial {
  quote: string;
  author: string;
  role?: string;
}

const testimonials: Testimonial[] = [
  {
    quote: "This is gold.",
    author: "Dariq",
    role: "Digital Pioneer"
  },
  {
    quote: "The graphics explain it all",
    author: "FIFE1.btc",
    role: "Web3 Developer"
  },
  {
    quote: "A distilled masterclass in AI agent design.",
    author: "Brainard",
    role: "AI Researcher"
  },
  {
    quote: "Straight to the point, practical, and actually battle-tested.",
    author: "Legend",
    role: "Tech Strategist"
  }
];

export default function NewsletterSection({ 
  variant = 'main',
  className = '',
  background = 'default',
  onSignupSuccess
}: NewsletterSectionProps) {
  const [randomizedTestimonials, setRandomizedTestimonials] = useState<Testimonial[]>([]);

  useEffect(() => {
    // Randomize testimonials on mount
    const shuffled = [...testimonials].sort(() => Math.random() - 0.5);
    setRandomizedTestimonials(shuffled);
  }, []);

  const backgroundClasses = {
    default: 'bg-bg-secondary border border-border',
    dark: 'bg-gradient-to-br from-bg-tertiary to-bg-secondary text-white',
    accent: 'bg-gradient-to-br from-accent-rose/5 via-accent-blue/5 to-accent-sage/5 border border-accent-rose/10'
  };

  const copy = variant === 'blog' ? {
    badge: 'Subscribe to our Digital Collective',
    title: 'The Looking Glass Chronicles',
    subtitle: 'Technical analysis and philosophical frameworks from the digital frontier.',
    features: [
      'Deep technical architectures on AI, metaverse, SaaS, defi, & quantum systems',
      'Philosophical explorations of digital consciousness and synthetic futures', 
      'Early access to experimental prototypes and research tools',
      'Curated intelligence without algorithmic interference',
      'Direct channel to our creative collective'
    ]
  } : {
    badge: 'Subscribe to our Digital Collective',
    title: 'Manic Agency Newsletter',
    subtitle: 'Strategic intelligence on digital transformation, metaverse architecture, and creative technology.',
    features: [
      'Deep technical architectures on AI, metaverse, SaaS, defi, & quantum systems',
      'Partnership protocols and collaboration opportunities',
      'Industry insights on emerging technology adoption',
      'Curated intelligence without algorithmic interference',
      'Direct channel to our creative collective'
    ]
  };

  return (
    <section id="newsletter-section" className={`py-16 sm:py-24 relative overflow-hidden ${className}`}>
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-[0.015] pointer-events-none">
        <GridPattern />
      </div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className={`
            rounded-3xl p-8 sm:p-12 lg:p-16 relative overflow-hidden
            ${backgroundClasses[background]}
          `}
        >
          {/* Decorative Elements */}
          <div className="absolute top-0 right-0 w-64 h-64 opacity-5">
            <TransmissionWaveIcon />
          </div>
          
          <div className="max-w-4xl mx-auto">
            {/* Header */}
            <div className="text-center mb-12">
              <motion.div 
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent-burgundy/10 border border-accent-burgundy/20 mb-6"
              >
                <TransmissionBadgeIcon />
                <span className="text-sm font-medium text-accent-burgundy">
                  {copy.badge}
                </span>
              </motion.div>
              
              <motion.h2 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold text-text-primary mb-6"
              >
                {copy.title}
              </motion.h2>
              
              <motion.p 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="text-lg sm:text-xl text-text-secondary max-w-3xl mx-auto leading-relaxed"
              >
                {copy.subtitle}
              </motion.p>
            </div>

            {/* Content Grid */}
            <div className="grid lg:grid-cols-2 gap-12 items-start">
              {/* Features List */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 }}
              >
                <h3 className="font-display text-xl font-semibold text-text-primary mb-6 flex items-center gap-3">
                  <ProtocolIcon />
                  Transmission Protocol
                </h3>
                
                <ul className="space-y-4">
                  {copy.features.map((feature, index) => (
                    <motion.li 
                      key={index}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.6 + index * 0.1 }}
                      className="flex items-start gap-3"
                    >
                      <div className="flex-shrink-0 w-6 h-6 rounded-full bg-accent-sage/20 flex items-center justify-center mt-0.5">
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{ delay: 0.7 + index * 0.1, type: "spring" }}
                          className="w-2 h-2 rounded-full bg-accent-sage"
                        />
                      </div>
                      <span className="text-text-secondary leading-relaxed">
                        {feature}
                      </span>
                    </motion.li>
                  ))}
                </ul>
              </motion.div>

              {/* Newsletter Form */}
              <motion.div 
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.6 }}
                className="lg:pl-8"
              >
                <div className="bg-bg-primary rounded-2xl p-8 border border-border shadow-lg relative overflow-hidden">
                  {/* Form Background Pattern */}
                  <div className="absolute inset-0 opacity-[0.02]">
                    <CircuitPattern />
                  </div>
                  
                  {/* Using button solution since Sender.net embed is broken */}
                  <SenderNewsletterButton className="relative z-10" variant={variant} />
                </div>
              </motion.div>
            </div>

            {/* Testimonials Grid */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1 }}
              className="mt-16 pt-12 border-t border-border"
            >
              <h3 className="text-center font-display text-2xl font-semibold text-text-primary mb-8">
                What Our Readers Say
              </h3>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {randomizedTestimonials.map((testimonial, index) => (
                  <motion.div
                    key={testimonial.author}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 1.2 + index * 0.1 }}
                    className="relative group"
                  >
                    <div className="bg-bg-primary border border-border rounded-xl p-6 h-full transition-all duration-300 group-hover:border-accent-burgundy/30 group-hover:shadow-lg">
                      {/* Quote Mark */}
                      <div className="absolute -top-3 -left-2 text-6xl text-accent-burgundy/10 font-serif">
                        &ldquo;
                      </div>
                      
                      <blockquote className="relative z-10">
                        <p className="text-text-secondary mb-4 italic">
                          {testimonial.quote}
                        </p>
                        <footer className="text-sm">
                          <cite className="font-semibold text-text-primary not-italic">
                            {testimonial.author}
                          </cite>
                          {testimonial.role && (
                            <p className="text-xs text-text-muted mt-1">
                              {testimonial.role}
                            </p>
                          )}
                        </footer>
                      </blockquote>
                      
                      {/* Decorative Corner */}
                      <div className="absolute bottom-0 right-0 w-8 h-8 border-b border-r border-accent-sage/20 rounded-br-xl" />
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Privacy & GDPR Notice */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.5 }}
              className="mt-12 pt-8 border-t border-border"
            >
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div className="flex items-start gap-3">
                  <SecurityShieldIcon />
                  <div className="text-sm text-text-secondary">
                    <p className="font-medium text-text-primary mb-1">Zero-knowledge protocol</p>
                    <p>Your data sovereignty is absolute. No third-party sharing. Ever.</p>
                  </div>
                </div>
                <div className="flex items-center gap-4 text-sm">
                  <a 
                    href="/privacy" 
                    className="text-accent-burgundy hover:text-accent-highlight transition-colors font-medium"
                  >
                    Privacy Protocol
                  </a>
                  <a 
                    href="/terms" 
                    className="text-accent-burgundy hover:text-accent-highlight transition-colors font-medium"
                  >
                    Terms
                  </a>
                </div>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

// SVG Components
const GridPattern = () => (
  <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="xMidYMid slice">
    <defs>
      <pattern id="newsletter-grid" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
        <path d="M20,0 L0,0 L0,20" fill="none" stroke="var(--text-muted)" strokeWidth="0.5"/>
        <circle cx="0" cy="0" r="1" fill="var(--text-muted)" opacity="0.3"/>
      </pattern>
    </defs>
    <rect width="100" height="100" fill="url(#newsletter-grid)" />
  </svg>
);

const CircuitPattern = () => (
  <svg className="w-full h-full" viewBox="0 0 200 200" preserveAspectRatio="xMidYMid slice">
    <defs>
      <pattern id="circuit" x="0" y="0" width="50" height="50" patternUnits="userSpaceOnUse">
        <path d="M25 0 L25 15 M25 35 L25 50 M0 25 L15 25 M35 25 L50 25" stroke="var(--accent-secondary)" strokeWidth="0.5" opacity="0.3"/>
        <circle cx="25" cy="25" r="3" fill="var(--accent-secondary)" opacity="0.2"/>
      </pattern>
    </defs>
    <rect width="200" height="200" fill="url(#circuit)" />
  </svg>
);

const TransmissionWaveIcon = () => (
  <svg viewBox="0 0 100 100" className="w-full h-full">
    <g opacity="0.5">
      <circle cx="50" cy="50" r="10" fill="none" stroke="var(--accent-secondary)" strokeWidth="0.5"/>
      <circle cx="50" cy="50" r="20" fill="none" stroke="var(--accent-secondary)" strokeWidth="0.5" opacity="0.7"/>
      <circle cx="50" cy="50" r="30" fill="none" stroke="var(--accent-secondary)" strokeWidth="0.5" opacity="0.5"/>
      <circle cx="50" cy="50" r="40" fill="none" stroke="var(--accent-secondary)" strokeWidth="0.5" opacity="0.3"/>
    </g>
  </svg>
);

const TransmissionBadgeIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
    <path d="M5 12L12 5L19 12M12 5V19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M8 9L12 5L16 9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" opacity="0.5"/>
  </svg>
);

const ProtocolIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" className="text-accent-highlight">
    <path d="M3 9L12 2L21 9V20C21 21 20 22 19 22H5C4 22 3 21 3 20V9Z" stroke="currentColor" strokeWidth="1.5"/>
    <path d="M9 22V12H15V22M9 8H15" stroke="currentColor" strokeWidth="1.5"/>
  </svg>
);

const SecurityShieldIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" className="text-accent-secondary">
    <path d="M12 2L4 7V11C4 16 7 20 12 21C17 20 20 16 20 11V7L12 2Z" stroke="currentColor" strokeWidth="1.5"/>
    <path d="M9 12L11 14L15 10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);