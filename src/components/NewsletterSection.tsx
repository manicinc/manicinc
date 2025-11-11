// src/components/NewsletterSection.tsx
'use client';

import dynamic from 'next/dynamic';
// Use lazy-loaded motion for better performance
import { motion, AnimatePresence } from '@/components/LazyMotion';
import { useEffect, useRef, useState } from 'react';

// Import EmailOctopus component with no SSR
const EmailOctopusForm = dynamic(
  () => import('./EmailOctopusForm').then(mod => mod.default),
  {
    ssr: false,
    loading: () => (
      <div className="flex items-center justify-center py-8">
        <div className="w-6 h-6 border-2 border-accent-burgundy border-t-transparent rounded-full animate-spin"></div>
        <span className="ml-3 text-sm text-text-secondary">Loading newsletter form...</span>
      </div>
    )
  }
);

// Lazy Sender init; only when newsletter section is visible/used
const SenderInit = dynamic(
  () => import('./SenderScript').then(mod => mod.SenderScript),
  { ssr: false, loading: () => null }
);

export interface NewsletterSectionProps {
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
  const [currentTestimonial, setCurrentTestimonial] = useState(0);
  const [randomizedTestimonials, setRandomizedTestimonials] = useState<Testimonial[]>([]);
  const [hoveredTestimonial, setHoveredTestimonial] = useState<number | null>(null);
  const [loadSender, setLoadSender] = useState(false);
  const sectionRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    // Randomize testimonials on mount
    const shuffled = [...testimonials].sort(() => Math.random() - 0.5);
    setRandomizedTestimonials(shuffled);
  }, []);

  // Auto-rotate testimonials every 5 seconds
  useEffect(() => {
    if (randomizedTestimonials.length === 0) return;
    
    const interval = setInterval(() => {
      setCurrentTestimonial((prev) => (prev + 1) % randomizedTestimonials.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [randomizedTestimonials.length]);

  const goToNext = () => {
    setCurrentTestimonial((prev) => (prev + 1) % randomizedTestimonials.length);
  };

  const goToPrev = () => {
    setCurrentTestimonial((prev) => (prev - 1 + randomizedTestimonials.length) % randomizedTestimonials.length);
  };

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

  // Load Sender only when section is visible or on user interaction
  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (!process.env.NEXT_PUBLIC_SENDER_ACCOUNT_ID) return;
    if (loadSender) return;

    let observer: IntersectionObserver | null = null;
    const onVisible = (entries: IntersectionObserverEntry[]) => {
      if (entries.some(e => e.isIntersecting)) {
        setLoadSender(true);
        cleanup();
      }
    };
    const observe = () => {
      if (sectionRef.current) {
        observer = new IntersectionObserver(onVisible, { rootMargin: '200px 0px' });
        observer.observe(sectionRef.current);
      }
    };

    const onInteract = () => {
      setLoadSender(true);
      cleanup();
    };

    const addInteraction = () => {
      window.addEventListener('scroll', onInteract, { passive: true, once: true });
      window.addEventListener('click', onInteract, { once: true });
      window.addEventListener('touchstart', onInteract, { passive: true, once: true });
      const idle = (cb: () => void) =>
        ('requestIdleCallback' in window ? (window as any).requestIdleCallback(cb, { timeout: 5000 }) : setTimeout(cb, 4000));
      idle(() => setLoadSender(true));
    };

    const cleanup = () => {
      if (observer && sectionRef.current) {
        try { observer.unobserve(sectionRef.current); } catch {}
      }
      observer?.disconnect();
      window.removeEventListener('scroll', onInteract as any);
      window.removeEventListener('click', onInteract as any);
      window.removeEventListener('touchstart', onInteract as any);
    };

    observe();
    addInteraction();
    return cleanup;
  }, [loadSender]);

  return (
    <section ref={sectionRef} id="newsletter-section" className={`py-16 sm:py-24 relative overflow-hidden ${className}`}>
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
              {/* Left Column - Features + Testimonials */}
              <div className="space-y-12">
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

                {/* Ornate Testimonials */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1 }}
                  className="relative"
                >
                  {/* Decorative Header */}
                  <div className="relative mb-8 text-center">
                    <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                      <ScrollDivider />
                    </div>
                    <h3 className="font-display text-xl font-semibold text-text-primary relative z-10 bg-bg-secondary px-4 inline-block">
                      What Our Readers Say
                    </h3>
                  </div>

                  <div className="space-y-4">
                    {randomizedTestimonials.length > 0 && (
                      <div className="relative">
                        {/* Carousel Navigation */}
                        <div className="flex items-center justify-between mb-4">
                          <button
                            onClick={goToPrev}
                            className="p-2 rounded-full bg-bg-primary border border-border hover:border-accent-burgundy/40 transition-colors"
                          >
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                              <path d="M15 18L9 12L15 6" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                          </button>
                          
                          <div className="flex gap-2">
                            {randomizedTestimonials.map((_, index) => (
                              <button
                                key={index}
                                onClick={() => setCurrentTestimonial(index)}
                                className={`w-2 h-2 rounded-full transition-colors ${
                                  index === currentTestimonial 
                                    ? 'bg-accent-burgundy' 
                                    : 'bg-border hover:bg-accent-burgundy/40'
                                }`}
                              />
                            ))}
                          </div>

                          <button
                            onClick={goToNext}
                            className="p-2 rounded-full bg-bg-primary border border-border hover:border-accent-burgundy/40 transition-colors"
                          >
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                              <path d="M9 18L15 12L9 6" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                          </button>
                        </div>

                        {/* Current Testimonial */}
                        <motion.div
                          key={currentTestimonial}
                          initial={{ opacity: 0, x: 20 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: -20 }}
                          transition={{ duration: 0.3 }}
                          onMouseEnter={() => setHoveredTestimonial(0)}
                          onMouseLeave={() => setHoveredTestimonial(null)}
                          className="relative group"
                        >
                          <div className={`
                            relative p-4 rounded-xl border transition-all duration-500
                            ${hoveredTestimonial === 0 
                              ? 'bg-gradient-to-br from-accent-rose/10 via-accent-blue/10 to-accent-sage/10 border-accent-burgundy/40 shadow-lg transform -translate-y-1' 
                              : 'bg-bg-primary/50 border-border hover:border-accent-burgundy/20'
                            }
                          `}>
                            {/* Ornate Quote Marks */}
                            <div className="absolute -top-3 -left-3 text-5xl font-serif opacity-20">
                              <motion.span
                                animate={{ 
                                  rotate: hoveredTestimonial === 0 ? -5 : 0,
                                  scale: hoveredTestimonial === 0 ? 1.2 : 1 
                                }}
                                transition={{ duration: 0.3 }}
                                className="block text-accent-burgundy"
                              >
                                ❝
                              </motion.span>
                            </div>
                            
                            {/* Decorative Corner Flourishes */}
                            <AnimatePresence>
                              {hoveredTestimonial === 0 && (
                                <>
                                  <motion.div
                                    initial={{ opacity: 0, scale: 0 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0 }}
                                    className="absolute -top-2 -right-2"
                                  >
                                    <CornerFlourish />
                                  </motion.div>
                                  <motion.div
                                    initial={{ opacity: 0, scale: 0 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0 }}
                                    className="absolute -bottom-2 -left-2 rotate-180"
                                  >
                                    <CornerFlourish />
                                  </motion.div>
                                </>
                              )}
                            </AnimatePresence>

                            <blockquote className="relative z-10">
                              <div className="flex items-start gap-3">
                                <p className="text-text-secondary italic text-base flex-1 leading-relaxed">
                                  &ldquo;{randomizedTestimonials[currentTestimonial]?.quote}&rdquo;
                                </p>
                                <div className="flex items-center gap-2 flex-shrink-0">
                                  <div className="text-right">
                                    <cite className="font-semibold text-text-primary not-italic text-sm block leading-tight">
                                      {randomizedTestimonials[currentTestimonial]?.author}
                                    </cite>
                                    {randomizedTestimonials[currentTestimonial]?.role && (
                                      <p className="text-xs text-text-muted">
                                        {randomizedTestimonials[currentTestimonial]?.role}
                                      </p>
                                    )}
                                  </div>
                                  <motion.div
                                    animate={{ 
                                      rotate: hoveredTestimonial === 0 ? 360 : 0 
                                    }}
                                    transition={{ duration: 0.6 }}
                                    className="w-6 h-6 flex-shrink-0"
                                  >
                                    <AuthorFlourish />
                                  </motion.div>
                                </div>
                              </div>
                            </blockquote>

                            {/* Subtle pattern overlay on hover */}
                            <AnimatePresence>
                              {hoveredTestimonial === 0 && (
                                <motion.div
                                  initial={{ opacity: 0 }}
                                  animate={{ opacity: 0.05 }}
                                  exit={{ opacity: 0 }}
                                  className="absolute inset-0 pointer-events-none"
                                >
                                  <FioriPattern />
                                </motion.div>
                              )}
                            </AnimatePresence>
                          </div>
                        </motion.div>
                      </div>
                    )}
                  </div>

                  {/* Bottom Decorative Element */}
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1.6 }}
                    className="mt-6 flex justify-center"
                  >
                    <DecorativeEnd />
                  </motion.div>
                </motion.div>
              </div>

              {/* Newsletter Form - EmailOctopus */}
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
                  
                  {/* EmailOctopus Form */}
                  <div className="relative z-10">
                    {process.env.NEXT_PUBLIC_EMAILOCTOPUS_FORM_ID ? (
                      <EmailOctopusForm 
                        formId={process.env.NEXT_PUBLIC_EMAILOCTOPUS_FORM_ID}
                        className="w-full"
                        variant={variant}
                        showTitle={false}
                      />
                    ) : (
                      <div className="text-center py-8">
                        <p className="text-text-secondary">Newsletter form unavailable - NEXT_PUBLIC_EMAILOCTOPUS_FORM_ID not configured</p>
                      </div>
                    )}
                    {/* Load Sender only when needed */}
                    {process.env.NEXT_PUBLIC_SENDER_ACCOUNT_ID && loadSender && (
                      <SenderInit accountId={process.env.NEXT_PUBLIC_SENDER_ACCOUNT_ID} />
                    )}
                  </div>
                </div>
              </motion.div>
            </div>

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

// SVG Components (keeping all the existing ones)
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

const FioriPattern = () => (
  <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="xMidYMid slice">
    <defs>
      <pattern id="fiori" x="0" y="0" width="25" height="25" patternUnits="userSpaceOnUse">
        <circle cx="12.5" cy="12.5" r="2" fill="var(--accent-rose)" opacity="0.3"/>
        <path d="M12.5 10 Q15 12.5 12.5 15 Q10 12.5 12.5 10" fill="var(--accent-sage)" opacity="0.2"/>
        <circle cx="12.5" cy="12.5" r="8" fill="none" stroke="var(--accent-blue)" strokeWidth="0.5" opacity="0.2"/>
      </pattern>
    </defs>
    <rect width="100" height="100" fill="url(#fiori)" />
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

const ScrollDivider = () => (
  <svg width="200" height="20" viewBox="0 0 200 20" fill="none" className="text-accent-burgundy/20">
    <path d="M0 10 Q50 0 100 10 T200 10" stroke="currentColor" strokeWidth="1"/>
    <circle cx="100" cy="10" r="3" fill="currentColor"/>
    <path d="M90 10 Q100 5 110 10" stroke="currentColor" strokeWidth="1" fill="none"/>
  </svg>
);

const CornerFlourish = () => (
  <svg width="30" height="30" viewBox="0 0 30 30" fill="none" className="text-accent-burgundy/30">
    <path d="M0 0 Q15 0 15 15 T30 30" stroke="currentColor" strokeWidth="1" fill="none"/>
    <circle cx="15" cy="15" r="2" fill="currentColor"/>
    <path d="M5 5 L10 10 M20 20 L25 25" stroke="currentColor" strokeWidth="0.5"/>
  </svg>
);

const AuthorFlourish = () => (
  <svg width="30" height="30" viewBox="0 0 30 30" fill="none" className="text-accent-secondary/40">
    <circle cx="15" cy="15" r="14" stroke="currentColor" strokeWidth="1"/>
    <path d="M15 5 Q20 15 15 25 Q10 15 15 5" fill="currentColor" opacity="0.3"/>
    <circle cx="15" cy="15" r="3" fill="currentColor"/>
  </svg>
);

const DecorativeEnd = () => (
  <svg width="60" height="20" viewBox="0 0 60 20" fill="none" className="text-accent-burgundy/20">
    <path d="M0 10 L20 10 M40 10 L60 10" stroke="currentColor" strokeWidth="1"/>
    <circle cx="30" cy="10" r="5" stroke="currentColor" strokeWidth="1" fill="none"/>
    <circle cx="30" cy="10" r="2" fill="currentColor"/>
    <path d="M25 5 Q30 10 35 5 M25 15 Q30 10 35 15" stroke="currentColor" strokeWidth="0.5" fill="none"/>
  </svg>
);