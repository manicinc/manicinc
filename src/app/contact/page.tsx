// src/app/contact/page.tsx
'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import ContactForm from "@/components/ContactForm";

const ContactPage = () => {
    const [hoveredSection, setHoveredSection] = useState<string | null>(null);

    return (
        <div className="contact-page-wrapper bg-bg-primary text-text-primary font-body min-h-screen">
            {/* Header Section */}
            <header className="py-20 sm:py-24 md:py-28 relative overflow-hidden">
                {/* Geometric Background Pattern */}
                <div className="absolute inset-0 opacity-[0.02]">
                    <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="xMidYMid slice">
                        <defs>
                            <pattern id="contact-grid" x="0" y="0" width="10" height="10" patternUnits="userSpaceOnUse">
                                <path d="M10,0 L0,0 L0,10" fill="none" stroke="var(--text-muted)" strokeWidth="0.5"/>
                                <circle cx="10" cy="10" r="0.5" fill="var(--accent-highlight)" opacity="0.3"/>
                            </pattern>
                        </defs>
                        <rect width="100" height="100" fill="url(#contact-grid)" />
                    </svg>
                </div>

                {/* Animated Accent Lines */}
                <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-accent-highlight to-transparent opacity-50" />
                <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-accent-burgundy to-transparent opacity-50" />

                <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <motion.h1 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold text-text-primary mb-6"
                    >
                        Establish Connection
                    </motion.h1>
                    <motion.p 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.1 }}
                        className="text-lg sm:text-xl text-text-secondary max-w-2xl mx-auto font-body leading-relaxed"
                    >
                        Open a direct channel to our creative collective. 
                        We respond to all transmissions within 24 Earth hours.
                    </motion.p>
                    <motion.div
                        initial={{ scaleX: 0 }}
                        animate={{ scaleX: 1 }}
                        transition={{ duration: 0.8, delay: 0.3 }}
                        className="w-24 h-px bg-gradient-to-r from-transparent via-accent-highlight to-transparent mx-auto mt-8"
                    />
                </div>
            </header>

            {/* Quick Links Section */}
            <section className="py-16 bg-gradient-to-b from-bg-primary to-bg-secondary relative">
                <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                    <motion.h2 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.4 }}
                        className="text-xl font-display font-semibold text-text-heading mb-10 text-center"
                    >
                        Explore Our Digital Architecture
                    </motion.h2>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {[
                            { 
                                href: "/team", 
                                title: "Creative Collective", 
                                desc: "Meet the architects and engineers",
                                icon: <CollectiveIcon />,
                                id: "collective"
                            },
                            { 
                                href: "/projects", 
                                title: "Project Archive", 
                                desc: "Explore our digital constructions",
                                icon: <ArchiveIcon />,
                                id: "archive"
                            },
                            { 
                                href: "/process", 
                                title: "Methodologies", 
                                desc: "Discover our creation protocols",
                                icon: <MethodologyIcon />,
                                id: "methodology"
                            }
                        ].map((item, index) => (
                            <motion.div
                                key={item.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.5 + index * 0.1 }}
                            >
                                <Link 
                                    href={item.href}
                                    className="block relative group"
                                    onMouseEnter={() => setHoveredSection(item.id)}
                                    onMouseLeave={() => setHoveredSection(null)}
                                >
                                    <div className="relative bg-bg-secondary border border-border rounded-2xl p-6 transition-all duration-300 group-hover:transform group-hover:translate-y-[-2px] group-hover:shadow-lg overflow-hidden">
                                        {/* Neumorphic effect */}
                                        <div className="absolute inset-0 bg-gradient-to-br from-bg-primary via-bg-secondary to-bg-tertiary opacity-0 group-hover:opacity-30 transition-opacity duration-300" />
                                        
                                        <div className="relative z-10">
                                            <div className="w-12 h-12 mb-4 text-accent-secondary group-hover:text-accent-primary transition-colors duration-300">
                                                {item.icon}
                                            </div>
                                            <h3 className="font-display text-lg font-semibold text-text-heading mb-2 group-hover:text-accent-primary transition-colors duration-300">
                                                {item.title}
                                            </h3>
                                            <p className="text-sm text-text-secondary">
                                                {item.desc}
                                            </p>
                                            <div className="mt-4 text-sm font-mono text-accent-primary opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center gap-1">
                                                <span>Access</span>
                                                <motion.span
                                                    animate={{ x: hoveredSection === item.id ? 5 : 0 }}
                                                    transition={{ type: "spring", stiffness: 300 }}
                                                >
                                                    →
                                                </motion.span>
                                            </div>
                                        </div>
                                    </div>
                                </Link>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Main Contact Section */}
            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-20 grid grid-cols-1 lg:grid-cols-5 gap-12">
                {/* Contact Form */}
                <motion.div 
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.6, delay: 0.6 }}
                    className="lg:col-span-3"
                >
                    <h2 className="text-2xl sm:text-3xl font-display font-semibold text-text-heading mb-6 flex items-center gap-3">
                        <TransmissionIcon />
                        Transmit Message
                    </h2>
                    <ContactForm />
                    <p className="mt-6 text-xs text-text-muted font-body italic">
                        All transmissions are encrypted end-to-end. Your data remains sovereign.
                    </p>
                </motion.div>

                {/* Contact Details */}
                <motion.div 
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.6, delay: 0.7 }}
                    className="lg:col-span-2 space-y-8"
                >
                    {/* Direct Channels */}
                    <div>
                        <h3 className="font-display text-lg font-semibold text-text-heading mb-4 flex items-center gap-2">
                            <ChannelIcon />
                            Direct Channels
                        </h3>
                        <dl className="space-y-3">
                            <ContactLink 
                                href="mailto:team@manic.agency"
                                icon={<EmailIcon />}
                                text="team@manic.agency"
                                label="Primary Channel"
                            />
                            <ContactLink 
                                href="https://discord.gg/manic"
                                icon={<DiscordIcon />}
                                text="Discord Collective"
                                label="Community Hub"
                                external
                            />
                            <ContactLink 
                                href="https://github.com/manicinc"
                                icon={<GithubIcon />}
                                text="@manicinc"
                                label="Source Repository"
                                external
                            />
                            <ContactLink 
                                href="https://linkedin.com/company/manic-agency-llc"
                                icon={<LinkedInIcon />}
                                text="Professional Network"
                                label="LinkedIn"
                                external
                            />
                            <ContactLink 
                                href="https://x.com/manicagency"
                                icon={<XIcon />}
                                text="@manicagency"
                                label="Broadcast Channel"
                                external
                            />
                        </dl>
                    </div>

                    {/* Headquarters */}
                    <div>
                        <h3 className="font-display text-lg font-semibold text-text-heading mb-4 flex items-center gap-2">
                            <LocationIcon />
                            Physical Nexus
                        </h3>
                        <p className="text-text-secondary text-sm leading-relaxed mb-4">
                            Primary operations anchored in Los Angeles, California. 
                            Our collective spans the digital frontier, unbound by geography.
                        </p>
                        <div className="relative h-32 rounded-xl overflow-hidden border border-border">
                            <LocationMap />
                        </div>
                    </div>
                </motion.div>
            </section>

            {/* Call to Action */}
            <section className="py-16 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-b from-bg-secondary to-bg-primary opacity-50" />
                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.8 }}
                    className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center"
                >
                    <h2 className="font-display text-2xl sm:text-3xl font-semibold text-text-heading mb-4">
                        Ready to Create Something Extraordinary?
                    </h2>
                    <p className="text-text-secondary mb-8 max-w-2xl mx-auto">
                        Whether you&apos;re building the next metaverse, exploring AI frontiers, 
                        or crafting digital experiences, we&apos;re here to amplify your vision.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Link 
                            href="#contact-form"
                            className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-accent-burgundy hover:bg-accent-highlight text-white font-medium rounded-xl transition-all duration-300 hover:transform hover:scale-105"
                        >
                            Start a Project
                            <ArrowIcon />
                        </Link>
                        <Link 
                            href="/newsletter"
                            className="inline-flex items-center justify-center gap-2 px-6 py-3 border border-accent-secondary text-accent-secondary hover:bg-accent-secondary hover:text-white font-medium rounded-xl transition-all duration-300"
                        >
                            Subscribe to Updates
                        </Link>
                    </div>
                </motion.div>
            </section>
        </div>
    );
};

// Contact Link Component
const ContactLink = ({ href, icon, text, label, external = false }: {
    href: string;
    icon: React.ReactNode;
    text: string;
    label: string;
    external?: boolean;
}) => (
    <dd>
        <a 
            href={href}
            target={external ? "_blank" : undefined}
            rel={external ? "noopener noreferrer" : undefined}
            className="group flex items-start gap-3 p-2 -m-2 rounded-lg transition-all duration-200 hover:bg-bg-tertiary/30"
        >
            <div className="w-10 h-10 rounded-xl bg-bg-tertiary/50 flex items-center justify-center text-accent-secondary group-hover:text-accent-primary group-hover:bg-accent-primary/10 transition-all duration-300">
                {icon}
            </div>
            <div className="flex-1">
                <div className="text-text-primary font-medium group-hover:text-accent-primary transition-colors">
                    {text}
                </div>
                <div className="text-xs text-text-muted">
                    {label}
                </div>
            </div>
        </a>
    </dd>
);

// SVG Icon Components
const CollectiveIcon = () => (
    <svg viewBox="0 0 48 48" className="w-full h-full">
        <defs>
            <linearGradient id="collective-grad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="currentColor" stopOpacity="0.8" />
                <stop offset="100%" stopColor="currentColor" stopOpacity="1" />
            </linearGradient>
        </defs>
        <g className="animate-draw-in">
            <circle cx="24" cy="12" r="5" fill="none" stroke="url(#collective-grad)" strokeWidth="1.5" />
            <circle cx="12" cy="28" r="5" fill="none" stroke="url(#collective-grad)" strokeWidth="1.5" />
            <circle cx="36" cy="28" r="5" fill="none" stroke="url(#collective-grad)" strokeWidth="1.5" />
            <path d="M24 17 L12 23 M24 17 L36 23 M12 33 L36 33" stroke="url(#collective-grad)" strokeWidth="1" strokeDasharray="2 2" />
        </g>
    </svg>
);

const ArchiveIcon = () => (
    <svg viewBox="0 0 48 48" className="w-full h-full">
        <g className="animate-draw-in">
            <rect x="8" y="12" width="32" height="28" rx="2" fill="none" stroke="currentColor" strokeWidth="1.5" />
            <path d="M8 20 L40 20" stroke="currentColor" strokeWidth="1.5" />
            <rect x="20" y="8" width="8" height="4" rx="1" fill="none" stroke="currentColor" strokeWidth="1.5" />
            <circle cx="24" cy="28" r="4" fill="none" stroke="currentColor" strokeWidth="1" />
            <path d="M16 32 L32 32" stroke="currentColor" strokeWidth="1" strokeDasharray="3 2" />
        </g>
    </svg>
);

const MethodologyIcon = () => (
    <svg viewBox="0 0 48 48" className="w-full h-full">
        <g className="animate-draw-in">
            <path d="M24 8 L38 16 L38 32 L24 40 L10 32 L10 16 Z" fill="none" stroke="currentColor" strokeWidth="1.5" />
            <path d="M24 8 L24 24 M10 16 L24 24 M38 16 L24 24 M24 24 L24 40" stroke="currentColor" strokeWidth="1" />
            <circle cx="24" cy="24" r="3" fill="currentColor" />
        </g>
    </svg>
);

const TransmissionIcon = () => (
    <svg width="24" height="24" viewBox="0 0 48 48" fill="none">
        <path d="M24 36 L24 12 M12 24 L24 12 L36 24" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        <circle cx="24" cy="12" r="2" fill="currentColor" />
        <path d="M16 8 Q24 4 32 8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" opacity="0.5" />
        <path d="M12 4 Q24 0 36 4" stroke="currentColor" strokeWidth="1" strokeLinecap="round" opacity="0.3" />
    </svg>
);

const ChannelIcon = () => (
    <svg width="20" height="20" viewBox="0 0 48 48" fill="none">
        <circle cx="24" cy="24" r="3" fill="currentColor" />
        <path d="M24 27 L24 38 M24 21 L24 10 M27 24 L38 24 M21 24 L10 24" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        <path d="M34 14 L36 12 M14 34 L12 36 M34 34 L36 36 M14 14 L12 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" opacity="0.5" />
    </svg>
);

const LocationIcon = () => (
    <svg width="20" height="20" viewBox="0 0 48 48" fill="none">
        <path d="M24 44 C24 44 38 32 38 20 C38 12 31 4 24 4 C17 4 10 12 10 20 C10 32 24 44 24 44 Z" fill="none" stroke="currentColor" strokeWidth="2" />
        <circle cx="24" cy="20" r="4" fill="currentColor" />
    </svg>
);

const EmailIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
        <rect x="3" y="6" width="18" height="12" rx="2" stroke="currentColor" strokeWidth="1.5" />
        <path d="M3 8 L12 13 L21 8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
);

const DiscordIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
        <path d="M19.27 5.33C17.94 4.71 16.5 4.26 15 4a.09.09 0 0 0-.07.03c-.18.33-.39.76-.53 1.09a16.09 16.09 0 0 0-4.8 0c-.14-.34-.35-.76-.54-1.09c-.01-.02-.04-.03-.07-.03c-1.5.26-2.93.71-4.27 1.33c-.01 0-.02.01-.03.02c-2.72 4.07-3.47 8.03-3.1 11.95c0 .02.01.04.03.05c1.8 1.32 3.53 2.12 5.24 2.65c.03.01.06 0 .07-.02c.4-.55.76-1.13 1.07-1.74c.02-.04 0-.08-.04-.09c-.57-.22-1.11-.48-1.64-.78c-.04-.02-.04-.08-.01-.11c.11-.08.22-.17.33-.25c.02-.02.05-.02.07-.01c3.44 1.57 7.15 1.57 10.55 0c.02-.01.05-.01.07.01c.11.09.22.17.33.26c.04.03.04.09-.01.11c-.52.31-1.07.56-1.64.78c-.04.01-.05.06-.04.09c.32.61.68 1.19 1.07 1.74c.03.01.06.02.09.01c1.72-.53 3.45-1.33 5.25-2.65c.02-.01.03-.03.03-.05c.44-4.53-.73-8.46-3.1-11.95c-.01-.01-.02-.02-.04-.02zM8.52 14.91c-1.03 0-1.89-.95-1.89-2.12s.84-2.12 1.89-2.12c1.06 0 1.9.96 1.89 2.12c0 1.17-.84 2.12-1.89 2.12zm6.97 0c-1.03 0-1.89-.95-1.89-2.12s.84-2.12 1.89-2.12c1.06 0 1.9.96 1.89 2.12c0 1.17-.83 2.12-1.89 2.12z"/>
    </svg>
);

const GithubIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504c.5.092.682-.217.682-.483c0-.237-.008-.868-.013-1.703c-2.782.605-3.369-1.343-3.369-1.343c-.454-1.158-1.11-1.466-1.11-1.466c-.908-.62.069-.608.069-.608c1.003.07 1.531 1.032 1.531 1.032c.892 1.53 2.341 1.088 2.91.832c.092-.647.35-1.088.636-1.338c-2.22-.253-4.555-1.113-4.555-4.951c0-1.093.39-1.988 1.029-2.688c-.103-.253-.446-1.272.098-2.65c0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337c1.909-1.296 2.747-1.027 2.747-1.027c.546 1.379.202 2.398.1 2.651c.64.7 1.028 1.595 1.028 2.688c0 3.848-2.339 4.695-4.566 4.943c.359.309.678.92.678 1.855c0 1.338-.012 2.419-.012 2.747c0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"/>
    </svg>
);

const LinkedInIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037c-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85c3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065c0-1.138.92-2.063 2.063-2.063c1.14 0 2.064.925 2.064 2.063c0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
    </svg>
);

const XIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
    </svg>
);

const ArrowIcon = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
        <path d="M5 12H19M19 12L12 5M19 12L12 19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
);

const LocationMap = () => (
    <svg className="w-full h-full" viewBox="0 0 200 100">
        <defs>
            <linearGradient id="map-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="var(--accent-secondary)" stopOpacity="0.2" />
                <stop offset="100%" stopColor="var(--accent-burgundy)" stopOpacity="0.2" />
            </linearGradient>
        </defs>
        {/* Abstract US West Coast */}
        <path 
            d="M20 20 Q30 15 40 20 L50 25 L55 35 L52 50 L48 65 L45 75 Q40 80 35 75 L30 60 L25 45 L20 30 Z"
            fill="url(#map-gradient)"
            stroke="var(--accent-secondary)"
            strokeWidth="0.5"
        />
        {/* LA Marker */}
        <circle cx="35" cy="55" r="3" fill="var(--accent-burgundy)" className="animate-pulse" />
        <circle cx="35" cy="55" r="6" fill="none" stroke="var(--accent-burgundy)" strokeWidth="0.5" opacity="0.5" className="animate-ping" />
        {/* Connection Lines */}
        <path d="M35 55 L100 40 M35 55 L120 70 M35 55 L80 30" stroke="var(--accent-highlight)" strokeWidth="0.5" opacity="0.3" strokeDasharray="2 4" />
        {/* Grid */}
        <pattern id="map-grid" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
            <path d="M20 0 L0 0 L0 20" fill="none" stroke="var(--text-muted)" strokeWidth="0.25" opacity="0.3"/>
        </pattern>
        <rect width="200" height="100" fill="url(#map-grid)" />
    </svg>
);

// Add CSS for animations
const styles = `
@keyframes draw-in {
    from {
        stroke-dashoffset: 100;
        opacity: 0;
    }
    to {
        stroke-dashoffset: 0;
        opacity: 1;
    }
}

.animate-draw-in {
    stroke-dasharray: 100;
    animation: draw-in 1s ease-out forwards;
}
`;

export default ContactPage;