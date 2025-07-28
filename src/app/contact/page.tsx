// src/app/contact/page.tsx
'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import ContactForm from "@/components/ContactForm";

const ContactPage = () => {
    const [hoveredCard, setHoveredCard] = useState<string | null>(null);
    const [isTeacupSteaming, setIsTeacupSteaming] = useState(true);

    return (
        <div className="contact-page-wrapper bg-bg-primary text-text-primary font-body min-h-screen">
            {/* Header Section - Invitation Style */}
            <header className="py-20 sm:py-24 md:py-28 relative overflow-hidden">
                {/* Ornate Pattern Background */}
                <div className="absolute inset-0 opacity-[0.03]">
                    <OrnatePattern />
                </div>

                {/* Floating Tea Elements */}
                <div className="absolute inset-0 pointer-events-none">
                    <FloatingTeaElements />
                </div>

                <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    {/* Ornate Invitation Card */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, rotateX: -10 }}
                        animate={{ opacity: 1, scale: 1, rotateX: 0 }}
                        transition={{ duration: 0.8, type: "spring" }}
                        className="invitation-card relative"
                    >
                        <div className="absolute inset-0">
                            <InvitationBorder />
                        </div>
                        
                        <div className="relative z-10 p-12">
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.3 }}
                                className="mb-6"
                            >
                                <TeaPartyEmblem />
                            </motion.div>
                            
                            <h1 className="font-script-blog text-5xl sm:text-6xl lg:text-7xl text-text-primary mb-4">
                                You&apos;re Cordially Invited
                            </h1>
                            
                            <div className="w-24 h-px bg-gradient-to-r from-transparent via-accent-gold to-transparent mx-auto my-6" />
                            
                            <p className="text-lg sm:text-xl text-text-secondary max-w-2xl mx-auto font-body-blog italic leading-relaxed">
                                Down the rabbit hole to our digital tea party. 
                                Where mad ideas brew and curious minds convene.
                            </p>
                            
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.6 }}
                                className="mt-8 flex justify-center"
                            >
                                <RabbitHoleIcon />
                            </motion.div>
                        </div>
                    </motion.div>
                </div>
            </header>

            {/* Quick Links - Playing Cards Style */}
            <section className="py-16 relative">
                <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                    <motion.h2 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.7 }}
                        className="text-2xl font-display font-semibold text-text-heading mb-10 text-center"
                    >
                        Choose Your Adventure
                    </motion.h2>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {[
                            { 
                                href: "/team", 
                                title: "Meet the Mad Hatters", 
                                desc: "Our wonderfully peculiar collective",
                                icon: <MadHatterIcon />,
                                id: "hatters"
                            },
                            { 
                                href: "/projects", 
                                title: "Curious Creations", 
                                desc: "Adventures in digital wonderland",
                                icon: <CheshireIcon />,
                                id: "creations"
                            },
                            { 
                                href: "/process", 
                                title: "The Method to Madness", 
                                desc: "How we brew digital magic",
                                icon: <PotionIcon />,
                                id: "method"
                            }
                        ].map((item, index) => (
                            <motion.div
                                key={item.id}
                                initial={{ opacity: 0, y: 20, rotate: -5 + index * 2 }}
                                animate={{ opacity: 1, y: 0, rotate: 0 }}
                                transition={{ delay: 0.8 + index * 0.1 }}
                                className="relative"
                            >
                                <Link 
                                    href={item.href}
                                    className="block playing-card"
                                    onMouseEnter={() => setHoveredCard(item.id)}
                                    onMouseLeave={() => setHoveredCard(null)}
                                >
                                    <motion.div 
                                        className="card-content"
                                        whileHover={{ scale: 1.05, rotateY: 5 }}
                                        transition={{ type: "spring", stiffness: 300 }}
                                    >
                                        <div className="card-corner top-left">♠</div>
                                        <div className="card-corner top-right">♠</div>
                                        <div className="card-corner bottom-left">♠</div>
                                        <div className="card-corner bottom-right">♠</div>
                                        
                                        <div className="relative z-10 p-8">
                                            <div className="w-16 h-16 mb-4 mx-auto text-accent-burgundy">
                                                {item.icon}
                                            </div>
                                            <h3 className="font-display text-xl font-semibold text-text-heading mb-2">
                                                {item.title}
                                            </h3>
                                            <p className="text-sm text-text-secondary italic">
                                                {item.desc}
                                            </p>
                                        </div>
                                    </motion.div>
                                </Link>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Main Contact Section - Tea Table */}
            <section className="relative py-16 lg:py-20">
                <div className="absolute inset-0 opacity-[0.02]">
                    <TeaTablePattern />
                </div>
                
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-5 gap-12">
                    {/* Contact Form - Parchment Style */}
                    <motion.div 
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.6, delay: 1 }}
                        className="lg:col-span-3"
                    >
                        <div className="parchment-container">
                            <div className="parchment-edges">
                                <ParchmentEdges />
                            </div>
                            
                            <div className="relative z-10 p-8">
                                <h2 className="text-2xl sm:text-3xl font-script-blog text-text-heading mb-6 flex items-center gap-3">
                                    <QuillIcon />
                                    Pen Your Message
                                </h2>
                                <ContactForm />
                                <p className="mt-6 text-xs text-text-muted font-body-blog italic text-center">
                                    ✦ All correspondence sealed with digital wax ✦
                                </p>
                            </div>
                        </div>
                    </motion.div>

                    {/* Contact Details - Victorian Card */}
                    <motion.div 
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.6, delay: 1.1 }}
                        className="lg:col-span-2 space-y-8"
                    >
                        {/* Tea Service Hours */}
                        <div className="victorian-card">
                            <div className="card-ornament">
                                <CardOrnament />
                            </div>
                            
                            <h3 className="font-script-blog text-xl text-text-heading mb-4 text-center">
                                Tea Service Hours
                            </h3>
                            
                            <div className="space-y-3 text-sm">
                                <div className="flex justify-between items-center py-2 border-b border-border/30">
                                    <span className="text-text-secondary">Digital Realm</span>
                                    <span className="font-medium text-text-primary">Always Open</span>
                                </div>
                                <div className="flex justify-between items-center py-2 border-b border-border/30">
                                    <span className="text-text-secondary">Physical Nexus</span>
                                    <span className="font-medium text-text-primary">By Appointment</span>
                                </div>
                                <div className="flex justify-between items-center py-2">
                                    <span className="text-text-secondary">Response Time</span>
                                    <span className="font-medium text-text-primary">24 Hours</span>
                                </div>
                            </div>
                        </div>

                        {/* Direct Channels */}
                        <div className="victorian-card">
                            <h3 className="font-script-blog text-xl text-text-heading mb-4 text-center">
                                Direct Portals
                            </h3>
                            
                            <dl className="space-y-3">
                                <ContactLink 
                                    href="mailto:team@manic.agency"
                                    icon={<EnvelopeIcon />}
                                    text="team@manic.agency"
                                    label="Primary Channel"
                                />
                                <ContactLink 
                                    href="https://discord.gg/manic"
                                    icon={<DiscordIcon />}
                                    text="Discord Tea Room"
                                    label="Community Parlor"
                                    external
                                />
                                <ContactLink 
                                    href="https://github.com/manicinc"
                                    icon={<GithubIcon />}
                                    text="@manicinc"
                                    label="Code Garden"
                                    external
                                />
                            </dl>
                        </div>

                        {/* Nexus Location */}
                        <div className="victorian-card">
                            <h3 className="font-script-blog text-xl text-text-heading mb-4 text-center">
                                Physical Nexus
                            </h3>
                            
                            <div className="relative h-32 rounded-xl overflow-hidden border border-border mb-4">
                                <WonderlandMap />
                            </div>
                            
                            <p className="text-sm text-text-secondary text-center italic">
                                Los Angeles, California
                                <br />
                                <span className="text-xs">Where dreams and digital converge</span>
                            </p>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* Bottom CTA - Teacup Animation */}
            <section className="py-16 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-bg-secondary/30 to-bg-tertiary/50" />
                
                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1.5 }}
                    className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center"
                >
                    <div className="mb-8 flex justify-center">
                        <motion.div
                            animate={{ y: [0, -5, 0] }}
                            transition={{ duration: 3, repeat: Infinity }}
                            onClick={() => setIsTeacupSteaming(!isTeacupSteaming)}
                            className="cursor-pointer"
                        >
                            <AnimatedTeacup steaming={isTeacupSteaming} />
                        </motion.div>
                    </div>
                    
                    <h2 className="font-script-blog text-3xl sm:text-4xl text-text-heading mb-4">
                        You&apos;re invited to the tea party!
                    </h2>
                    <p className="text-text-secondary mb-8 max-w-2xl mx-auto italic">
                        Whether you&apos;re chasing white rabbits or painting roses red, 
                        we&apos;re here to guide your journey through the digital wonderland.
                    </p>
                    
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Link 
                            href="#contact-form"
                            className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-accent-burgundy hover:bg-accent-highlight text-white font-medium rounded-full transition-all duration-300 hover:transform hover:scale-105 shadow-lg"
                        >
                            Begin the Conversation
                            <RightArrowIcon />
                        </Link>
                        <Link 
                            href="/newsletter"
                            className="inline-flex items-center justify-center gap-2 px-8 py-4 border-2 border-accent-sage text-accent-sage hover:bg-accent-sage hover:text-white font-medium rounded-full transition-all duration-300"
                        >
                            Join the Tea Party
                        </Link>
                    </div>
                </motion.div>
            </section>

            {/* Styles */}
            <style jsx>{`
                /* Invitation Card Styles */
                .invitation-card {
                    background: linear-gradient(135deg, var(--bg-primary) 0%, var(--bg-secondary) 100%);
                    border-radius: 0.5rem;
                    box-shadow: 
                        0 20px 40px rgba(var(--shadow-color-rgb), 0.1),
                        inset 0 0 60px rgba(var(--accent-gold-rgb, 184, 142, 98), 0.05);
                }

                /* Playing Card Styles */
                .playing-card {
                    display: block;
                    transform-style: preserve-3d;
                    perspective: 1000px;
                }

                .card-content {
                    position: relative;
                    background: var(--bg-primary);
                    border: 2px solid var(--border);
                    border-radius: 1rem;
                    box-shadow: 0 10px 30px rgba(var(--shadow-color-rgb), 0.1);
                    transition: all 0.3s ease;
                }

                .playing-card:hover .card-content {
                    box-shadow: 
                        0 15px 40px rgba(var(--shadow-color-rgb), 0.15),
                        0 0 20px rgba(var(--accent-burgundy-rgb), 0.1);
                    border-color: var(--accent-burgundy);
                }

                .card-corner {
                    position: absolute;
                    font-size: 1rem;
                    color: var(--accent-burgundy);
                    opacity: 0.3;
                }
                .card-corner.top-left { top: 0.5rem; left: 0.5rem; }
                .card-corner.top-right { top: 0.5rem; right: 0.5rem; }
                .card-corner.bottom-left { bottom: 0.5rem; left: 0.5rem; transform: rotate(180deg); }
                .card-corner.bottom-right { bottom: 0.5rem; right: 0.5rem; transform: rotate(180deg); }

                /* Parchment Styles */
                .parchment-container {
                    position: relative;
                    background: linear-gradient(135deg, 
                        var(--bg-blog-paper) 0%, 
                        rgba(var(--bg-secondary-rgb), 0.5) 100%);
                    border-radius: 0.25rem;
                    box-shadow: 
                        0 15px 35px rgba(var(--shadow-color-rgb), 0.1),
                        inset 0 0 30px rgba(var(--accent-gold-rgb, 184, 142, 98), 0.05);
                }

                .parchment-edges {
                    position: absolute;
                    inset: -2px;
                    opacity: 0.5;
                    pointer-events: none;
                }

                /* Victorian Card Styles */
                .victorian-card {
                    position: relative;
                    background: var(--bg-primary);
                    border: 1px solid var(--border);
                    border-radius: 1rem;
                    padding: 1.5rem;
                    box-shadow: 
                        0 8px 20px rgba(var(--shadow-color-rgb), 0.08),
                        inset 0 0 20px rgba(var(--accent-gold-rgb, 184, 142, 98), 0.03);
                    overflow: hidden;
                }

                .card-ornament {
                    position: absolute;
                    top: 0;
                    left: 50%;
                    transform: translateX(-50%);
                    width: 100px;
                    height: 30px;
                    opacity: 0.3;
                }

                /* Contact Link Styles */
                .contact-link {
                    transition: all 0.2s ease;
                }

                .contact-link:hover {
                    transform: translateX(5px);
                }

                /* Button Color Fixes for Light Mode */
                .contact-btn,
                a[href="#contact-form"],
                a[href="/newsletter"] {
                    color: var(--text-on-accent) !important;
                }

                /* Light mode specific overrides */
                html:not(.dark) .contact-btn:hover,
                html:not(.dark) a[href="#contact-form"]:hover {
                    color: var(--text-on-accent) !important;
                }

                /* Ensure buttons in light mode have proper contrast */
                html:not(.dark) .bg-accent-burgundy {
                    color: white !important;
                }

                html:not(.dark) .border-accent-sage:hover {
                    color: white !important;
                }
            `}</style>
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
            className="contact-link group flex items-center gap-3 p-2 -m-2 rounded-lg transition-all duration-200 hover:bg-bg-tertiary/30"
        >
            <div className="w-10 h-10 rounded-full bg-bg-tertiary/50 flex items-center justify-center text-accent-burgundy group-hover:text-accent-highlight group-hover:bg-accent-burgundy/10 transition-all duration-300">
                {icon}
            </div>
            <div className="flex-1">
                <div className="text-text-primary font-medium group-hover:text-accent-burgundy transition-colors">
                    {text}
                </div>
                <div className="text-xs text-text-muted italic">
                    {label}
                </div>
            </div>
        </a>
    </dd>
);

// Elaborate SVG Components
const OrnatePattern = () => (
    <svg className="w-full h-full" viewBox="0 0 200 200" preserveAspectRatio="xMidYMid slice">
        <defs>
            <pattern id="ornate" x="0" y="0" width="50" height="50" patternUnits="userSpaceOnUse">
                <g className="ornate-group">
                    {/* Victorian Flourish */}
                    <path d="M25 5 Q15 15 25 25 Q35 15 25 5" fill="none" stroke="var(--text-muted)" strokeWidth="0.5" opacity="0.5"/>
                    <path d="M5 25 Q15 35 25 25 Q35 35 45 25" fill="none" stroke="var(--text-muted)" strokeWidth="0.5" opacity="0.5"/>
                    <circle cx="25" cy="25" r="3" fill="none" stroke="var(--accent-gold)" strokeWidth="0.3" opacity="0.3"/>
                    {/* Corner Ornaments */}
                    <path d="M5 5 L10 5 L5 10" fill="none" stroke="var(--accent-burgundy)" strokeWidth="0.3" opacity="0.2"/>
                    <path d="M45 5 L40 5 L45 10" fill="none" stroke="var(--accent-burgundy)" strokeWidth="0.3" opacity="0.2"/>
                    <path d="M5 45 L10 45 L5 40" fill="none" stroke="var(--accent-burgundy)" strokeWidth="0.3" opacity="0.2"/>
                    <path d="M45 45 L40 45 L45 40" fill="none" stroke="var(--accent-burgundy)" strokeWidth="0.3" opacity="0.2"/>
                </g>
            </pattern>
        </defs>
        <rect width="200" height="200" fill="url(#ornate)" />
    </svg>
);

const FloatingTeaElements = () => (
    <div className="absolute inset-0">
        {[...Array(6)].map((_, i) => (
            <motion.div
                key={i}
                className="absolute"
                style={{
                    left: `${10 + i * 15}%`,
                    top: `${20 + (i % 2) * 40}%`
                }}
                animate={{
                    y: [-20, 20, -20],
                    rotate: [-5, 5, -5],
                    opacity: [0.3, 0.6, 0.3]
                }}
                transition={{
                    duration: 5 + i,
                    repeat: Infinity,
                    delay: i * 0.5
                }}
            >
                {i % 3 === 0 ? <TeaLeafIcon /> : i % 3 === 1 ? <ClockIcon /> : <KeyIcon />}
            </motion.div>
        ))}
    </div>
);

const InvitationBorder = () => (
    <svg className="absolute inset-0 w-full h-full" viewBox="0 0 400 300" preserveAspectRatio="none">
        <defs>
            <linearGradient id="goldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="var(--accent-gold)" stopOpacity="0.3"/>
                <stop offset="50%" stopColor="var(--accent-burgundy)" stopOpacity="0.5"/>
                <stop offset="100%" stopColor="var(--accent-gold)" stopOpacity="0.3"/>
            </linearGradient>
        </defs>
        {/* Ornate Corner Flourishes */}
        <g className="corner-flourishes">
            {/* Top Left */}
            <path d="M0 50 Q0 0 50 0 L100 0 Q80 10 60 10 T20 20 Q10 30 10 50" 
                  fill="none" stroke="url(#goldGrad)" strokeWidth="1.5"/>
            {/* Top Right */}
            <path d="M350 0 Q400 0 400 50 L400 100 Q390 80 390 60 T380 20 Q370 10 350 10" 
                  fill="none" stroke="url(#goldGrad)" strokeWidth="1.5"/>
            {/* Bottom Left */}
            <path d="M0 250 Q0 300 50 300 L100 300 Q80 290 60 290 T20 280 Q10 270 10 250" 
                  fill="none" stroke="url(#goldGrad)" strokeWidth="1.5"/>
            {/* Bottom Right */}
            <path d="M350 300 Q400 300 400 250 L400 200 Q390 220 390 240 T380 280 Q370 290 350 290" 
                  fill="none" stroke="url(#goldGrad)" strokeWidth="1.5"/>
        </g>
        {/* Center Ornament */}
        <g transform="translate(200, 20)">
            <path d="M0 0 Q-20 10 -20 20 T0 40 T20 20 T0 0" 
                  fill="none" stroke="var(--accent-gold)" strokeWidth="0.5" opacity="0.5"/>
            <circle cx="0" cy="20" r="3" fill="var(--accent-burgundy)" opacity="0.3"/>
        </g>
    </svg>
);

const TeaPartyEmblem = () => (
    <svg width="80" height="80" viewBox="0 0 100 100" className="mx-auto">
        <defs>
            <radialGradient id="emblemGrad">
                <stop offset="0%" stopColor="var(--accent-gold)" stopOpacity="0.6"/>
                <stop offset="100%" stopColor="var(--accent-burgundy)" stopOpacity="0.3"/>
            </radialGradient>
        </defs>
        {/* Outer Ring */}
        <circle cx="50" cy="50" r="45" fill="none" stroke="url(#emblemGrad)" strokeWidth="1"/>
        <circle cx="50" cy="50" r="40" fill="none" stroke="url(#emblemGrad)" strokeWidth="0.5"/>
        
        {/* Teacup */}
        <g transform="translate(50, 50)">
            <path d="M-15 -5 Q-15 10 0 15 Q15 10 15 -5 Z" 
                  fill="none" stroke="var(--accent-burgundy)" strokeWidth="1.5"/>
            <path d="M15 -2 Q22 -2 22 5 Q22 12 15 12" 
                  fill="none" stroke="var(--accent-burgundy)" strokeWidth="1.5"/>
            {/* Steam */}
            <path d="M-5 -8 Q-3 -12 -1 -8 T3 -8" 
                  fill="none" stroke="var(--accent-sage)" strokeWidth="1" opacity="0.6">
                <animate attributeName="d" 
                         values="M-5 -8 Q-3 -12 -1 -8 T3 -8;M-5 -10 Q-3 -14 -1 -10 T3 -10;M-5 -8 Q-3 -12 -1 -8 T3 -8" 
                         dur="3s" repeatCount="indefinite"/>
            </path>
        </g>
        
        {/* Decorative Text Circle */}
        <path id="textCircle" d="M50,50 m-35,0 a35,35 0 1,1 70,0 a35,35 0 1,1 -70,0" fill="none"/>
        <text className="text-xs fill-text-muted" opacity="0.5">
            <textPath href="#textCircle" startOffset="50%" textAnchor="middle">
                ✦ WONDERLAND TEA SOCIETY ✦
            </textPath>
        </text>
    </svg>
);

const RabbitHoleIcon = () => (
    <svg width="60" height="60" viewBox="0 0 60 60" className="mx-auto">
        <defs>
            <radialGradient id="holeGrad" cx="50%" cy="50%">
                <stop offset="0%" stopColor="var(--accent-burgundy)" stopOpacity="0"/>
                <stop offset="50%" stopColor="var(--accent-burgundy)" stopOpacity="0.3"/>
                <stop offset="100%" stopColor="var(--accent-burgundy)" stopOpacity="0.8"/>
            </radialGradient>
        </defs>
        <g className="rabbit-hole-group">
            {[...Array(5)].map((_, i) => (
                <ellipse 
                    key={i}
                    cx="30" cy="30" 
                    rx={25 - i * 5} ry={15 - i * 3}
                    fill="none" 
                    stroke="url(#holeGrad)" 
                    strokeWidth="1"
                    opacity={0.8 - i * 0.15}
                    transform={`rotate(${i * 15} 30 30)`}
                >
                    <animateTransform
                        attributeName="transform"
                        type="rotate"
                        from={`${i * 15} 30 30`}
                        to={`${360 + i * 15} 30 30`}
                        dur={`${10 + i * 2}s`}
                        repeatCount="indefinite"
                    />
                </ellipse>
            ))}
            <circle cx="30" cy="30" r="3" fill="var(--accent-burgundy)" opacity="0.8"/>
        </g>
    </svg>
);

const MadHatterIcon = () => (
    <svg viewBox="0 0 80 80" className="w-full h-full">
        <g className="mad-hatter-group">
            {/* Hat */}
            <path d="M20 50 L20 30 Q20 20 30 20 L50 20 Q60 20 60 30 L60 50" 
                  fill="none" stroke="currentColor" strokeWidth="2"/>
            <rect x="15" y="50" width="50" height="4" rx="2" fill="currentColor"/>
            {/* Hat Band */}
            <rect x="20" y="35" width="40" height="8" fill="currentColor" opacity="0.3"/>
            {/* Card */}
            <rect x="35" y="25" width="10" height="15" fill="none" stroke="currentColor" strokeWidth="1" transform="rotate(-10 40 32.5)"/>
            <text x="40" y="35" textAnchor="middle" className="text-xs fill-current">10/6</text>
        </g>
    </svg>
);

const CheshireIcon = () => (
    <svg viewBox="0 0 80 80" className="w-full h-full">
        <g className="cheshire-group">
            {/* Smile */}
            <path d="M20 45 Q40 55 60 45" 
                  fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            {/* Eyes */}
            <circle cx="30" cy="35" r="3" fill="currentColor"/>
            <circle cx="50" cy="35" r="3" fill="currentColor"/>
            {/* Stripes */}
            <path d="M15 30 Q40 20 65 30" fill="none" stroke="currentColor" strokeWidth="1" opacity="0.3"/>
            <path d="M15 50 Q40 60 65 50" fill="none" stroke="currentColor" strokeWidth="1" opacity="0.3"/>
        </g>
    </svg>
);

const PotionIcon = () => (
    <svg viewBox="0 0 80 80" className="w-full h-full">
        <g className="potion-group">
            {/* Flask */}
            <path d="M30 20 L30 35 L20 55 Q20 60 25 60 L55 60 Q60 60 60 55 L50 35 L50 20" 
                  fill="none" stroke="currentColor" strokeWidth="2"/>
            <line x1="25" y1="20" x2="55" y2="20" stroke="currentColor" strokeWidth="2"/>
            {/* Liquid */}
            <path d="M25 50 Q40 45 55 50 L55 55 Q55 58 52 58 L28 58 Q25 58 25 55 Z" 
                  fill="currentColor" opacity="0.3"/>
            {/* Bubbles */}
            <circle cx="35" cy="52" r="2" fill="currentColor" opacity="0.5">
                <animate attributeName="cy" values="52;48;52" dur="2s" repeatCount="indefinite"/>
            </circle>
            <circle cx="45" cy="54" r="1.5" fill="currentColor" opacity="0.5">
                <animate attributeName="cy" values="54;50;54" dur="2.5s" repeatCount="indefinite"/>
            </circle>
        </g>
    </svg>
);

const ParchmentEdges = () => (
    <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
        <defs>
            <filter id="roughPaper">
                <feTurbulence type="fractalNoise" baseFrequency="0.02" numOctaves="5" result="noise"/>
                <feDisplacementMap in="SourceGraphic" in2="noise" scale="2"/>
            </filter>
        </defs>
        <path d="M2 2 Q5 0 8 2 T15 2 T22 2 T29 2 T36 2 T43 2 T50 2 T57 2 T64 2 T71 2 T78 2 T85 2 T92 2 Q95 0 98 2 
                 L98 98 Q95 100 92 98 T85 98 T78 98 T71 98 T64 98 T57 98 T50 98 T43 98 T36 98 T29 98 T22 98 T15 98 T8 98 Q5 100 2 98 Z" 
              fill="none" 
              stroke="var(--accent-gold)" 
              strokeWidth="0.5" 
              opacity="0.3"
              filter="url(#roughPaper)"/>
    </svg>
);

const CardOrnament = () => (
    <svg viewBox="0 0 100 30" className="w-full h-full">
        <path d="M10 15 Q30 5 50 15 Q70 25 90 15" 
              fill="none" stroke="var(--accent-gold)" strokeWidth="1" opacity="0.5"/>
        <circle cx="50" cy="15" r="3" fill="var(--accent-burgundy)" opacity="0.3"/>
    </svg>
);

const QuillIcon = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
        <path d="M20 2L18 12L16 22L14 20L16 12L18 4L20 2Z" stroke="currentColor" strokeWidth="1.5"/>
        <path d="M18 8L12 14L8 18L6 20L4 22L2 20L4 18L8 14L14 8" stroke="currentColor" strokeWidth="1.5"/>
        <path d="M10 16L8 18" stroke="currentColor" strokeWidth="1.5"/>
    </svg>
);

const TeaTablePattern = () => (
    <svg className="w-full h-full" viewBox="0 0 200 200" preserveAspectRatio="xMidYMid slice">
        <defs>
            <pattern id="lace" x="0" y="0" width="40" height="40" patternUnits="userSpaceOnUse">
                <circle cx="20" cy="20" r="15" fill="none" stroke="var(--text-muted)" strokeWidth="0.3" opacity="0.3"/>
                <circle cx="20" cy="20" r="10" fill="none" stroke="var(--text-muted)" strokeWidth="0.3" opacity="0.2"/>
                <circle cx="20" cy="20" r="5" fill="none" stroke="var(--text-muted)" strokeWidth="0.3" opacity="0.1"/>
            </pattern>
        </defs>
        <rect width="200" height="200" fill="url(#lace)" />
    </svg>
);

const WonderlandMap = () => (
    <svg className="w-full h-full" viewBox="0 0 200 100">
        <defs>
            <linearGradient id="mapGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="var(--accent-sage)" stopOpacity="0.2"/>
                <stop offset="100%" stopColor="var(--accent-burgundy)" stopOpacity="0.2"/>
            </linearGradient>
        </defs>
        
        {/* Whimsical Map Elements */}
        <path d="M20 50 Q50 20 80 50 T140 50 T180 50" 
              fill="none" stroke="var(--accent-sage)" strokeWidth="1" opacity="0.5" strokeDasharray="3 3"/>
        
        {/* LA Marker - Teacup */}
        <g transform="translate(60, 50)">
            <circle r="15" fill="url(#mapGrad)"/>
            <path d="M-8 -3 Q-8 5 0 8 Q8 5 8 -3 Z" fill="none" stroke="var(--accent-burgundy)" strokeWidth="1"/>
            <path d="M8 -1 Q12 -1 12 3 Q12 7 8 7" fill="none" stroke="var(--accent-burgundy)" strokeWidth="1"/>
        </g>
        
        {/* Decorative Elements */}
        <text x="100" y="80" className="text-xs fill-text-muted italic" textAnchor="middle">
            &apos;We&aquo;re all <s>mad</s> here&apos;
        </text>
    </svg>
);

const AnimatedTeacup = ({ steaming }: { steaming: boolean }) => (
    <svg width="120" height="120" viewBox="0 0 120 120">
        <defs>
            <radialGradient id="teaGrad">
                <stop offset="0%" stopColor="var(--accent-sage)" stopOpacity="0.3"/>
                <stop offset="100%" stopColor="var(--accent-sage)" stopOpacity="0.1"/>
            </radialGradient>
        </defs>
        
        {/* Saucer */}
        <ellipse cx="60" cy="95" rx="35" ry="8" fill="var(--bg-tertiary)" stroke="var(--accent-gold)" strokeWidth="1"/>
        
        {/* Cup */}
        <path d="M30 50 Q30 75 60 85 Q90 75 90 50 Z" 
              fill="var(--bg-secondary)" stroke="var(--accent-gold)" strokeWidth="1.5"/>
        
        {/* Handle */}
        <path d="M90 55 Q100 55 100 65 Q100 75 90 75" 
              fill="none" stroke="var(--accent-gold)" strokeWidth="1.5"/>
        
        {/* Tea */}
        <path d="M35 55 Q60 50 85 55 L85 70 Q60 80 35 70 Z" fill="url(#teaGrad)"/>
        
        {/* Steam */}
        {steaming && (
            <g className="steam-group">
                {[0, 1, 2].map((i) => (
                    <path
                        key={i}
                        d={`M${50 + i * 10} 45 Q${52 + i * 10} 35 ${50 + i * 10} 25 T${50 + i * 10} 5`}
                        fill="none"
                        stroke="var(--accent-sage)"
                        strokeWidth="1"
                        opacity="0"
                    >
                        <animate
                            attributeName="opacity"
                            values="0;0.6;0"
                            dur="3s"
                            begin={`${i * 0.5}s`}
                            repeatCount="indefinite"
                        />
                        <animateTransform
                            attributeName="transform"
                            type="translate"
                            values="0,0; 2,-5; 0,-10"
                            dur="3s"
                            begin={`${i * 0.5}s`}
                            repeatCount="indefinite"
                        />
                    </path>
                ))}
            </g>
        )}
        
        {/* Cup Pattern */}
        <g transform="translate(60, 65)">
            <text className="text-xs fill-accent-burgundy" textAnchor="middle" opacity="0.5">♠</text>
        </g>
    </svg>
);

// Utility Icons
const TeaLeafIcon = () => (
    <svg width="30" height="30" viewBox="0 0 30 30" className="text-accent-sage">
        <path d="M15 5 Q10 15 15 25 Q20 15 15 5" fill="currentColor" opacity="0.5"/>
    </svg>
);

const ClockIcon = () => (
    <svg width="30" height="30" viewBox="0 0 30 30" className="text-accent-gold">
        <circle cx="15" cy="15" r="12" fill="none" stroke="currentColor" strokeWidth="1" opacity="0.5"/>
        <path d="M15 7 L15 15 L20 20" stroke="currentColor" strokeWidth="1" opacity="0.5"/>
    </svg>
);

const KeyIcon = () => (
    <svg width="30" height="30" viewBox="0 0 30 30" className="text-accent-burgundy">
        <circle cx="10" cy="15" r="5" fill="none" stroke="currentColor" strokeWidth="1" opacity="0.5"/>
        <path d="M14 15 L25 15 L25 12 L22 12 L22 18" stroke="currentColor" strokeWidth="1" fill="currentColor" opacity="0.5"/>
    </svg>
);

const EnvelopeIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
        <rect x="3" y="6" width="18" height="12" rx="2" stroke="currentColor" strokeWidth="1.5"/>
        <path d="M3 8 L12 13 L21 8" stroke="currentColor" strokeWidth="1.5"/>
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

const RightArrowIcon = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
        <path d="M5 12H19M19 12L12 5M19 12L12 19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
);

export default ContactPage;