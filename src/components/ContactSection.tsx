// src/components/ContactSection.tsx
'use client';

import { useState } from 'react';
import Link from 'next/link';
// Use lazy-loaded motion for better performance
import { motion } from '@/components/LazyMotion';

export interface ContactSectionProps {
  onNewsletterSignup?: () => void;
}

const ContactSection = ({ onNewsletterSignup }: ContactSectionProps = {}) => {
  const [hoveredLocation, setHoveredLocation] = useState<string | null>(null);

  const locations = [
    {
      id: 'la',
      city: 'Los Angeles',
      timezone: 'PST',
      coordinates: '34.0522°N, 118.2437°W',
      status: 'Primary Nexus'
    },
    {
      id: 'digital',
      city: 'Digital Frontier',
      timezone: 'Universal',
      coordinates: 'Everywhere & Nowhere',
      status: 'Always Online'
    }
  ];

  return (
    <section className="relative mt-4 sm:mt-2 lg:mt-8 overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 bg-gradient-to-b from-bg-primary via-bg-secondary to-bg-tertiary opacity-50" />
      <div className="absolute inset-0">
        <CircuitBackground />
      </div>

      {/* Main Container */}
      <div className="relative rounded-3xl bg-gradient-to-br from-bg-tertiary/90 to-bg-secondary/90 backdrop-blur-sm border border-accent-secondary/20 overflow-hidden">
        {/* Decorative Corner Elements */}
        <div className="absolute top-0 left-0 w-32 h-32 opacity-10">
          <CornerOrnament />
        </div>
        <div className="absolute bottom-0 right-0 w-32 h-32 opacity-10 rotate-180">
          <CornerOrnament />
        </div>

        <div className="relative z-10 px-6 py-16 sm:px-12 sm:py-20 lg:px-16 lg:py-24">
          {/* Header */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-4xl mx-auto text-center mb-12"
          >
            <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold text-text-primary mb-4">
              Initialize Transmission
            </h2>
            <p className="text-lg text-text-secondary max-w-2xl mx-auto">
              Open a direct channel to our creative collective. 
              We&apos;re architecting the future of digital experiences.
            </p>
          </motion.div>

          {/* Toggle Section */}
          <div className="flex justify-center mb-12">
            <div className="inline-flex rounded-xl bg-bg-secondary/50 p-1 backdrop-blur-sm border border-accent-secondary/20 shadow-lg">
              <button
                className={`
                  px-6 py-3 rounded-lg font-medium transition-all duration-300 relative overflow-hidden group
                  bg-gradient-to-r from-accent-primary to-accent-highlight text-text-primary shadow-lg transform scale-105
                  hover:from-accent-primary/90 hover:to-accent-highlight/90 hover:scale-[1.08] hover:shadow-xl hover:text-white
                  active:scale-[1.03] active:shadow-md
                  focus:outline-none focus:ring-2 focus:ring-accent-primary/50 focus:ring-offset-2 focus:ring-offset-bg-primary
                `}
              >
                <span className="relative z-10 drop-shadow-sm">Direct Contact</span>
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-white/10 to-white/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  whileHover={{ scale: 1.02 }}
                />
              </button>
              <Link
                href="/newsletter"
                className={`
                  px-6 py-3 rounded-lg font-medium transition-all duration-300 relative overflow-hidden group
                  text-text-primary hover:text-white
                  hover:bg-gradient-to-r hover:from-accent-burgundy hover:to-accent-sage hover:scale-105 hover:shadow-lg
                  active:scale-[1.02] active:shadow-md
                  border border-transparent hover:border-accent-secondary/30
                  focus:outline-none focus:ring-2 focus:ring-accent-burgundy/50 focus:ring-offset-2 focus:ring-offset-bg-primary
                `}
              >
                <span className="relative z-10 group-hover:drop-shadow-sm">Subscribe</span>
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-accent-burgundy/10 to-accent-sage/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  whileHover={{ scale: 1.02 }}
                />
              </Link>
            </div>
          </div>

          {/* Content Sections */}
          <div className="grid lg:grid-cols-2 gap-12 items-start max-w-6xl mx-auto">
            {/* Contact CTA */}
            <div>
                  <h3 className="font-display text-2xl font-semibold text-text-primary mb-6 flex items-center gap-3">
                    <TransmissionIcon />
                    Begin Transmission
                  </h3>
                  
                  <p className="text-text-secondary mb-8 leading-relaxed">
                    Whether you&apos;re building the next metaverse, exploring AI frontiers, 
                    or crafting revolutionary digital experiences, we&apos;re here to amplify your vision.
                  </p>

                  {/* CTA Buttons */}
                  <div className="space-y-4">
                    <Link 
                      href="/contact"
                      className="group relative block"
                    >
                      <motion.div
                        className="relative bg-gradient-to-r from-accent-burgundy to-accent-highlight text-white rounded-xl p-6 overflow-hidden
                                 hover:from-accent-burgundy/90 hover:to-accent-highlight/90 hover:shadow-xl
                                 active:scale-[0.99] transition-all duration-300
                                 focus-within:ring-2 focus-within:ring-accent-burgundy/50 focus-within:ring-offset-2 focus-within:ring-offset-bg-primary"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <div className="absolute inset-0 bg-gradient-to-r from-white/10 to-white/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                        
                        <div className="relative z-10 flex items-center justify-between">
                          <div>
                            <h4 className="font-display text-lg font-semibold mb-1 drop-shadow-sm">
                              Start a Project
                            </h4>
                            <p className="text-sm opacity-90 drop-shadow-sm">
                              Full collaboration protocol
                            </p>
                          </div>
                          <div className="w-12 h-12 opacity-90 group-hover:opacity-100 transition-opacity duration-300 text-white">
                            <ProjectIcon />
                          </div>
                        </div>
                      </motion.div>
                    </Link>

                    <Link 
                      href="mailto:team@manic.agency"
                      className="group relative block"
                    >
                      <motion.div
                        className="relative bg-bg-primary border border-accent-secondary text-text-primary rounded-xl p-6 overflow-hidden"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <div className="absolute inset-0 bg-accent-secondary/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                        
                        <div className="relative z-10 flex items-center justify-between">
                          <div>
                            <h4 className="font-display text-lg font-semibold mb-1 group-hover:text-accent-secondary transition-colors">
                              Quick Message
                            </h4>
                            <p className="text-sm text-text-secondary">
                              team@manic.agency
                            </p>
                          </div>
                          <div className="w-12 h-12 text-accent-secondary">
                            <EmailIcon />
                          </div>
                        </div>
                      </motion.div>
                    </Link>
                  </div>

                  {/* Social Links */}
                  <div className="mt-8 pt-8 border-t border-border">
                    <h4 className="text-sm font-mono text-text-secondary uppercase tracking-wider mb-4">
                      Alternative Channels
                    </h4>
                    <div className="flex gap-4">
                      <SocialLink href="https://discord.gg/manic" icon={<DiscordIcon />} label="Discord" />
                      <SocialLink href="https://github.com/manicinc" icon={<GithubIcon />} label="GitHub" />
                      <SocialLink href="https://linkedin.com/company/manic-agency-llc" icon={<LinkedInIcon />} label="LinkedIn" />
                      <SocialLink href="https://x.com/manicagency" icon={<XIcon />} label="X" />
                    </div>
                  </div>
                </div>

                {/* Locations */}
                <div>
                  <h3 className="font-display text-2xl font-semibold text-text-primary mb-6 flex items-center gap-3">
                    <NetworkIcon />
                    Network Nodes
                  </h3>
                  
                  <div className="space-y-4">
                    {locations.map((location) => (
                      <motion.div
                        key={location.id}
                        className="relative bg-bg-primary/50 border border-border rounded-xl p-6 backdrop-blur-sm overflow-hidden group"
                        onMouseEnter={() => setHoveredLocation(location.id)}
                        onMouseLeave={() => setHoveredLocation(null)}
                        whileHover={{ scale: 1.02 }}
                      >
                        <div className="absolute inset-0 bg-gradient-to-br from-accent-sage/5 to-accent-secondary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                        
                        <div className="relative z-10">
                          <div className="flex items-start justify-between mb-3">
                            <h4 className="font-display text-lg font-semibold text-text-primary">
                              {location.city}
                            </h4>
                            <span className="text-xs font-mono text-accent-sage">
                              {location.status}
                            </span>
                          </div>
                          
                          <div className="space-y-1 text-sm text-text-secondary">
                            <div className="flex items-center gap-2">
                              <TimezoneIcon />
                              <span>{location.timezone}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <CoordinatesIcon />
                              <span className="font-mono text-xs">{location.coordinates}</span>
                            </div>
                          </div>
                        </div>
                        
                        {hoveredLocation === location.id && (
                          <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="absolute top-2 right-2"
                          >
                            <PulseIndicator />
                          </motion.div>
                        )}
                      </motion.div>
                    ))}
                  </div>

                  {/* Map Visualization */}
                  <div className="mt-6 relative h-48 rounded-xl overflow-hidden border border-border bg-bg-primary/30">
                    <NetworkMap />
                  </div>
                </div>
              </div>
        </div>
      </div>
    </section>
  );
};

// Social Link Component
const SocialLink = ({ href, icon, label }: { href: string; icon: React.ReactNode; label: string }) => (
  <motion.a
    href={href}
    target="_blank"
    rel="noopener noreferrer"
    className="group relative w-12 h-12 rounded-xl bg-bg-secondary border border-border flex items-center justify-center overflow-hidden"
    whileHover={{ scale: 1.1 }}
    whileTap={{ scale: 0.95 }}
    aria-label={label}
  >
    <div className="absolute inset-0 bg-gradient-to-br from-accent-secondary/20 to-accent-sage/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
    <div className="relative z-10 w-5 h-5 text-text-secondary group-hover:text-accent-secondary transition-colors">
      {icon}
    </div>
  </motion.a>
);

// SVG Components
const CircuitBackground = () => (
  <svg className="absolute inset-0 w-full h-full opacity-[0.03]" viewBox="0 0 400 400" preserveAspectRatio="xMidYMid slice">
    <defs>
      <pattern id="contact-circuit" x="0" y="0" width="100" height="100" patternUnits="userSpaceOnUse">
        <path d="M50 0 L50 30 M50 70 L50 100 M0 50 L30 50 M70 50 L100 50" stroke="var(--accent-secondary)" strokeWidth="0.5"/>
        <circle cx="50" cy="50" r="5" fill="none" stroke="var(--accent-secondary)" strokeWidth="0.5"/>
        <circle cx="50" cy="30" r="2" fill="var(--accent-secondary)" opacity="0.5"/>
        <circle cx="50" cy="70" r="2" fill="var(--accent-secondary)" opacity="0.5"/>
        <circle cx="30" cy="50" r="2" fill="var(--accent-secondary)" opacity="0.5"/>
        <circle cx="70" cy="50" r="2" fill="var(--accent-secondary)" opacity="0.5"/>
      </pattern>
    </defs>
    <rect width="400" height="400" fill="url(#contact-circuit)" />
  </svg>
);

const CornerOrnament = () => (
  <svg viewBox="0 0 100 100" className="w-full h-full">
    <path 
      d="M0 0 L100 0 L100 20 Q80 20 80 40 L80 100 L60 100 Q60 60 40 60 L0 60 Z" 
      fill="none" 
      stroke="var(--accent-highlight)" 
      strokeWidth="0.5"
    />
    <circle cx="20" cy="20" r="3" fill="var(--accent-highlight)" opacity="0.5"/>
    <circle cx="20" cy="40" r="2" fill="var(--accent-sage)" opacity="0.5"/>
    <circle cx="40" cy="20" r="2" fill="var(--accent-sage)" opacity="0.5"/>
  </svg>
);

const TransmissionIcon = () => (
  <svg width="24" height="24" viewBox="0 0 48 48" fill="none">
    <circle cx="24" cy="24" r="20" stroke="currentColor" strokeWidth="1.5" opacity="0.3"/>
    <circle cx="24" cy="24" r="14" stroke="currentColor" strokeWidth="1.5" opacity="0.5"/>
    <circle cx="24" cy="24" r="8" stroke="currentColor" strokeWidth="1.5"/>
    <circle cx="24" cy="24" r="3" fill="currentColor"/>
    <path d="M24 3 L24 12 M24 36 L24 45 M3 24 L12 24 M36 24 L45 24" stroke="currentColor" strokeWidth="1" opacity="0.5"/>
  </svg>
);

const NetworkIcon = () => (
  <svg width="24" height="24" viewBox="0 0 48 48" fill="none">
    <circle cx="24" cy="8" r="4" stroke="currentColor" strokeWidth="1.5"/>
    <circle cx="8" cy="32" r="4" stroke="currentColor" strokeWidth="1.5"/>
    <circle cx="40" cy="32" r="4" stroke="currentColor" strokeWidth="1.5"/>
    <circle cx="24" cy="40" r="4" stroke="currentColor" strokeWidth="1.5"/>
    <path d="M24 12 L8 28 M24 12 L40 28 M8 32 L24 36 M40 32 L24 36" stroke="currentColor" strokeWidth="1" strokeDasharray="2 2"/>
  </svg>
);

const ProjectIcon = () => (
  <svg viewBox="0 0 48 48" className="w-full h-full" fill="none">
    <rect x="8" y="8" width="32" height="32" rx="4" stroke="currentColor" strokeWidth="1.5"/>
    <path d="M16 8 L16 40 M32 8 L32 40 M8 16 L40 16 M8 32 L40 32" stroke="currentColor" strokeWidth="1" opacity="0.3"/>
    <circle cx="24" cy="24" r="6" fill="currentColor" opacity="0.2"/>
    <circle cx="24" cy="24" r="3" fill="currentColor"/>
  </svg>
);

const EmailIcon = () => (
  <svg viewBox="0 0 48 48" className="w-full h-full" fill="none">
    <rect x="6" y="12" width="36" height="24" rx="3" stroke="currentColor" strokeWidth="1.5"/>
    <path d="M6 15 L24 26 L42 15" stroke="currentColor" strokeWidth="1.5"/>
    <circle cx="38" cy="32" r="2" fill="currentColor" opacity="0.5"/>
  </svg>
);

const TimezoneIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
    <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.5"/>
    <path d="M12 6 L12 12 L16 16" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
  </svg>
);

const CoordinatesIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
    <path d="M12 2 L12 22 M2 12 L22 12" stroke="currentColor" strokeWidth="1" opacity="0.3"/>
    <circle cx="12" cy="12" r="3" fill="currentColor"/>
  </svg>
);

const PulseIndicator = () => (
  <svg width="24" height="24" viewBox="0 0 24 24">
    <circle cx="12" cy="12" r="4" fill="var(--accent-sage)" className="animate-pulse"/>
    <circle cx="12" cy="12" r="8" fill="none" stroke="var(--accent-sage)" strokeWidth="1" opacity="0.3" className="animate-ping"/>
  </svg>
);

const NetworkMap = () => (
  <svg className="w-full h-full" viewBox="0 0 300 150">
    <defs>
      <radialGradient id="node-gradient">
        <stop offset="0%" stopColor="var(--accent-burgundy)" stopOpacity="0.6"/>
        <stop offset="100%" stopColor="var(--accent-burgundy)" stopOpacity="0"/>
      </radialGradient>
    </defs>
    
    {/* Grid */}
    <pattern id="map-grid-contact" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
      <path d="M20 0 L0 0 L0 20" fill="none" stroke="var(--text-muted)" strokeWidth="0.25" opacity="0.2"/>
    </pattern>
    <rect width="300" height="150" fill="url(#map-grid-contact)" />
    
    {/* Connection Lines */}
    <path d="M50 75 Q150 30 250 75" fill="none" stroke="var(--accent-secondary)" strokeWidth="0.5" opacity="0.3" strokeDasharray="5 5"/>
    <path d="M50 75 Q150 120 250 75" fill="none" stroke="var(--accent-sage)" strokeWidth="0.5" opacity="0.3" strokeDasharray="5 5"/>
    
    {/* Nodes */}
    <circle cx="50" cy="75" r="15" fill="url(#node-gradient)"/>
    <circle cx="50" cy="75" r="5" fill="var(--accent-burgundy)"/>
    <text x="50" y="95" textAnchor="middle" className="text-xs fill-text-secondary">LA</text>
    
    <circle cx="250" cy="75" r="15" fill="url(#node-gradient)"/>
    <circle cx="250" cy="75" r="5" fill="var(--accent-sage)"/>
    <text x="250" y="95" textAnchor="middle" className="text-xs fill-text-secondary">Digital</text>
    
    {/* Pulse Animation */}
    <circle cx="50" cy="75" r="5" fill="none" stroke="var(--accent-burgundy)" strokeWidth="1" opacity="0.5" className="animate-ping"/>
    <circle cx="250" cy="75" r="5" fill="none" stroke="var(--accent-sage)" strokeWidth="1" opacity="0.5" className="animate-ping"/>
  </svg>
);

// Social Icons (same as before)
const DiscordIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor">
    <path d="M19.27 5.33C17.94 4.71 16.5 4.26 15 4a.09.09 0 0 0-.07.03c-.18.33-.39.76-.53 1.09a16.09 16.09 0 0 0-4.8 0c-.14-.34-.35-.76-.54-1.09c-.01-.02-.04-.03-.07-.03c-1.5.26-2.93.71-4.27 1.33c-.01 0-.02.01-.03.02c-2.72 4.07-3.47 8.03-3.1 11.95c0 .02.01.04.03.05c1.8 1.32 3.53 2.12 5.24 2.65c.03.01.06 0 .07-.02c.4-.55.76-1.13 1.07-1.74c.02-.04 0-.08-.04-.09c-.57-.22-1.11-.48-1.64-.78c-.04-.02-.04-.08-.01-.11c.11-.08.22-.17.33-.25c.02-.02.05-.02.07-.01c3.44 1.57 7.15 1.57 10.55 0c.02-.01.05-.01.07.01c.11.09.22.17.33.26c.04.03.04.09-.01.11c-.52.31-1.07.56-1.64.78c-.04.01-.05.06-.04.09c.32.61.68 1.19 1.07 1.74c.03.01.06.02.09.01c1.72-.53 3.45-1.33 5.25-2.65c.02-.01.03-.03.03-.05c.44-4.53-.73-8.46-3.1-11.95c-.01-.01-.02-.02-.04-.02zM8.52 14.91c-1.03 0-1.89-.95-1.89-2.12s.84-2.12 1.89-2.12c1.06 0 1.9.96 1.89 2.12c0 1.17-.84 2.12-1.89 2.12zm6.97 0c-1.03 0-1.89-.95-1.89-2.12s.84-2.12 1.89-2.12c1.06 0 1.9.96 1.89 2.12c0 1.17-.83 2.12-1.89 2.12z"/>
  </svg>
);

const GithubIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504c.5.092.682-.217.682-.483c0-.237-.008-.868-.013-1.703c-2.782.605-3.369-1.343-3.369-1.343c-.454-1.158-1.11-1.466-1.11-1.466c-.908-.62.069-.608.069-.608c1.003.07 1.531 1.032 1.531 1.032c.892 1.53 2.341 1.088 2.91.832c.092-.647.35-1.088.636-1.338c-2.22-.253-4.555-1.113-4.555-4.951c0-1.093.39-1.988 1.029-2.688c-.103-.253-.446-1.272.098-2.65c0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337c1.909-1.296 2.747-1.027 2.747-1.027c.546 1.379.202 2.398.1 2.651c.64.7 1.028 1.595 1.028 2.688c0 3.848-2.339 4.695-4.566 4.943c.359.309.678.92.678 1.855c0 1.338-.012 2.419-.012 2.747c0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"/>
  </svg>
);

const LinkedInIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor">
    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037c-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85c3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065c0-1.138.92-2.063 2.063-2.063c1.14 0 2.064.925 2.064 2.063c0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
  </svg>
);

const XIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
  </svg>
);

export default ContactSection;