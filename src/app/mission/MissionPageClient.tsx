"use client";

import React from 'react';
import Link from 'next/link';
// Use lazy-loaded motion for better performance
import { motion } from '@/components/LazyMotion';
import {
    ArrowRight, Cpu, GitBranch, Recycle, Gift, Archive, // Core Pillars
    Users as TeamIcon, Layers3 as ProjectsIcon, BookOpen as BlogIcon, // Nav Links
    Send as ContactIcon, Settings2 as ProcessIcon, // Nav Links
    Sparkles, Orbit, Puzzle, Rocket // Added more icons
} from 'lucide-react';

// Import the ASCII Placeholder Component
import AsciiArtPlaceholder from '@/lib/asciiPlaceholders'; // ADJUST PATH AS NEEDED

// --- Hand-Drawn Style SVG Components ---
const OrnateDividerSVG = ({ className = "" }: { className?: string }) => (
    // Simple SVG divider with a slight turbulence filter for 'hand-drawn' feel
    <svg width="150" height="15" viewBox="0 0 150 15" className={`w-32 md:w-40 h-auto mx-auto my-8 md:my-12 ${className}`}>
        <defs>
            <filter id="wobblyLine" x="-10%" y="-100%" width="120%" height="300%">
                <feTurbulence type="fractalNoise" baseFrequency="0.02 0.8" numOctaves="2" result="turbulence" seed={Math.random() * 10}/> {/* Random seed */}
                <feDisplacementMap in2="turbulence" in="SourceGraphic" scale="1.5" xChannelSelector="R" yChannelSelector="G"/>
            </filter>
             <linearGradient id="dividerGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="var(--accent-primary)" stopOpacity="0.1"/>
                <stop offset="50%" stopColor="var(--accent-primary)" stopOpacity="0.8"/>
                <stop offset="100%" stopColor="var(--accent-primary)" stopOpacity="0.1"/>
            </linearGradient>
        </defs>
        <path d="M5,7 Q 75,10 145,7"
            stroke="url(#dividerGradient)"
            strokeWidth="2"
            fill="none"
            strokeLinecap="round"
            filter="url(#wobblyLine)"
        />
         <circle cx="75" cy="7.5" r="1.5" fill="var(--accent-highlight)" opacity="0.8"/>
    </svg>
);

// Abstract animated background element
const AbstractNetworkSVG = ({ className = "" }: { className?: string }) => (
    <svg preserveAspectRatio="xMidYMid slice" viewBox="0 0 100 100" className={`w-full h-full absolute inset-0 z-0 ${className} abstract-network-svg`}>
         <defs>
            <filter id="svgGlow" x="-50%" y="-50%" width="200%" height="200%">
                <feGaussianBlur stdDeviation="1" result="blur"/>
                <feOffset dx="0" dy="0" result="offsetBlur"/>
                <feFlood floodColor="var(--accent-highlight)" floodOpacity="0.5" result="flood"/>
                <feComposite in="flood" in2="offsetBlur" operator="in" result="glow"/>
                <feMerge> <feMergeNode in="glow"/> <feMergeNode in="SourceGraphic"/> </feMerge>
            </filter>
         </defs>
        <g opacity="0.1" filter="url(#svgGlow)">
            {/* Example animated lines */}
            <line x1="10" y1="10" x2="90" y2="90" stroke="currentColor" strokeWidth="0.5" className="line-1" />
            <line x1="90" y1="10" x2="10" y2="90" stroke="currentColor" strokeWidth="0.5" className="line-2" />
            <circle cx="50" cy="50" r="20" stroke="currentColor" strokeWidth="0.5" fill="none" className="circle-1"/>
            <circle cx="50" cy="50" r="35" stroke="currentColor" strokeWidth="0.5" fill="none" className="circle-2"/>
        </g>
    </svg>
);


// --- ASCII Art --- (Keep or replace with new ones)
const missionHeroArt = [
`  ███╗   ███████╗ ███╗   ██╗ ██╗ ██╗  ███████╗
 ████║   ██╔════╝ ████╗  ██║ ██║ ██║  ██╔════╝
 ██╔██╗ ███████╗ ██╔██╗ ██║ ██║ ██║  ███████╗
 ██║╚██╗╚════██║ ██║╚██╗██║ ██║ ██║  ╚════██║
 ██║ ╚██╗███████║ ██║ ╚████║ ██║ ████╗███████║
 ╚═╝  ╚═╝╚══════╝ ╚═╝  ╚═══╝ ╚═╝ ╚═══╝╚══════╝
    « C H A R T I N G  U N C H A R T E D »`,
];

// --- Framer Motion Variants ---
const fadeIn = { hidden: { opacity: 0, y: 15 }, visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } } };
const quickFade = { hidden: { opacity: 0 }, visible: { opacity: 1, transition: { duration: 0.4 } } };
const staggerContainer = { hidden: {}, visible: { transition: { staggerChildren: 0.1, delayChildren: 0.1 } } };
const cardHover = { scale: 1.03, y: -4, transition: { type: "spring", stiffness: 350, damping: 15 } };
const iconHover = { scale: 1.15, rotate: -5, transition: { type: "spring", stiffness: 400, damping: 10 } };


// --- Page Component ---
const MissionPageClient = () => {

    return (
        <div className="mission-page"> {/* Base class for page */}
             {/* <Nav /> */} {/* Assume Nav is in RootLayout */}

            <main className="flex-grow">
                {/* --- Hero Section --- */}
                <section className="mission-hero-section">
                    <div className="hero-background">
                        <AbstractNetworkSVG /> {/* Animated background */}
                        <div className="grid-overlay"></div>
                        <div className="glow-effect glow-top-left"></div>
                        <div className="glow-effect glow-bottom-right"></div>
                    </div>
                    <div className="container mx-auto px-4 relative z-10">
                        <motion.div
                            initial="hidden" animate="visible" variants={staggerContainer}
                            className="max-w-3xl mx-auto text-center"
                        >
                            <motion.div variants={fadeIn} className="mb-5">
                                {/* ASCII Art instead of Sparkles */}
                                <AsciiArtPlaceholder
                                    width={400}
                                    animate={true}
                                    className="hero-ascii"
                                />
                            </motion.div>
                            <motion.h1 variants={fadeIn} className="hero-title">
                                Charting Uncharted Code<span className="text-accent-highlight">.</span>
                            </motion.h1>
                            <motion.p variants={fadeIn} className="hero-subtitle">
                                Manic is an <strong className="highlight-text">experimental creative development & design agency</strong> forging reality from the digital ether. We don't just follow the map; sometimes we draw it.
                            </motion.p>
                            <motion.div variants={fadeIn} className="mt-6">
                                <h2 className="mania-title mania-glitch-text">
                                    <span data-text="[ Mania-Driven Development ]">[ Mania-Driven Development ]</span>
                                </h2>
                                <p className="mania-subtitle">
                                    Harnessing creative intensity within rigorous frameworks to build the impossible, faster.
                                </p>
                            </motion.div>
                        </motion.div>
                    </div>
                </section>

                {/* --- Philosophy Section --- */}
                <section className="mission-section">
                    <div className="container mx-auto px-4">
                        <motion.div
                            className="max-w-4xl mx-auto text-center"
                            initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.2 }} variants={staggerContainer}
                        >
                            <motion.h2 variants={fadeIn} className="section-title">
                                The Compass & The Chaos
                            </motion.h2>
                            <motion.blockquote variants={fadeIn} className="quote">
                                "If you don't know where you are going, any road will get you there." While true for aimless wandering, we prefer <strong className="highlight-text">engineered serendipity</strong>. Our 'Manic Blueprint' provides the vector, channeling volatile creative energy into tangible, high-velocity results.
                            </motion.blockquote>
                            <motion.p variants={fadeIn} className="body-text">
                                Operating as a distributed collective, anchored in Los Angeles, we synthesize complexity into elegant, functional realities – from intricate AR/VR and robust backends to intuitive interfaces. We build <strong className="highlight-text">software that feels substantial</strong>, merging cutting-edge digital design with considered engineering.
                            </motion.p>
                             {/* Use a themed link style instead of ShadCN Button */}
                             <motion.div variants={fadeIn} className="mt-8">
                                 <Link href="/process" className="styled-button primary">
                                     Explore the Blueprint <ProcessIcon className="button-icon" />
                                 </Link>
                            </motion.div>
                        </motion.div>
                    </div>
                </section>

                <OrnateDividerSVG />

                {/* --- Core Pillars Section --- */}
                <section className="mission-section">
                    <div className="container mx-auto px-4">
                        <motion.div
                            className="max-w-4xl mx-auto text-center mb-10 md:mb-12" /* Reduced bottom margin */
                            initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.3 }} variants={staggerContainer}
                        >
                            <motion.h2 variants={fadeIn} className="section-title">Core Directives</motion.h2>
                            <motion.p variants={fadeIn} className="section-subtitle">Foundational principles encoded in our operational matrix.</motion.p>
                        </motion.div>
                        <motion.div
                            className="pillar-grid"
                            initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.1 }} variants={staggerContainer}
                        >
                            {/* Pillar Cards */}
                            <motion.div variants={fadeIn} whileHover={cardHover} className="pillar-card">
                                <div className="pillar-icon-wrapper style-1"><Recycle className="pillar-icon"/></div>
                                <h4 className="pillar-title">Sustainability</h4>
                                <p className="pillar-text">Architecting for endurance. Building adaptable systems designed to evolve, minimizing technical debt.</p>
                            </motion.div>
                            <motion.div variants={fadeIn} whileHover={cardHover} className="pillar-card">
                                <div className="pillar-icon-wrapper style-2"><GitBranch className="pillar-icon"/></div>
                                <h4 className="pillar-title">Portability</h4>
                                <p className="pillar-text">Freedom via standards. Prioritizing interoperability, avoiding vendor lock-in, ensuring future agility.</p>
                            </motion.div>
                            <motion.div variants={fadeIn} whileHover={cardHover} className="pillar-card">
                                <div className="pillar-icon-wrapper style-3"><Gift className="pillar-icon"/></div>
                                <h4 className="pillar-title">True Ownership</h4>
                                <p className="pillar-text">Your creation, your code. Delivering documented, clean codebases with transparent licensing.</p>
                            </motion.div>
                            <motion.div variants={fadeIn} whileHover={cardHover} className="pillar-card">
                                 <div className="pillar-icon-wrapper style-4"><Puzzle className="pillar-icon"/></div> {/* Changed Icon */}
                                <h4 className="pillar-title">Elegant Integration</h4> {/* Changed Title */}
                                <p className="pillar-text">Honoring function alongside form. Balancing innovative design with the tactile assurance of robust engineering.</p>
                            </motion.div>
                        </motion.div>
                    </div>
                </section>

                 <OrnateDividerSVG />

                {/* --- Manic Games Platform Section --- */}
                <section className="mission-section">
                    <div className="container mx-auto px-4">
                        <motion.div
                            className="max-w-4xl mx-auto text-center"
                            initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.3 }} variants={staggerContainer}
                        >
                            <motion.h2 variants={fadeIn} className="section-title">Manic Games Platform</motion.h2>
                            <motion.p variants={fadeIn} className="body-text">
                                Our first official initiative: <strong className="highlight-text">Manic Games</strong> - a revolutionary publishing platform where we launch, sell, and curate interactive experiences. Like Steam for the next generation of digital entertainment, we invite creators to build games for our catalog or license our cutting-edge technology to craft custom experiences.
                            </motion.p>
                            <motion.blockquote variants={fadeIn} className="quote">
                                We're not just building games; we're architecting the future of interactive storytelling and fostering a community where innovation thrives through collaboration.
                            </motion.blockquote>
                            <motion.div variants={fadeIn} className="mt-6">
                                 <a href="https://games.manic.agency" target="_blank" rel="noopener noreferrer" className="styled-button primary">
                                     Explore Manic Games <Rocket className="button-icon" />
                                 </a>
                             </motion.div>
                        </motion.div>
                    </div>
                </section>

                <OrnateDividerSVG />

                {/* --- Open Source Section --- */}
                <section className="mission-section">
                    <div className="container mx-auto px-4">
                        <motion.div
                            className="max-w-3xl mx-auto text-center"
                            initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.3 }} variants={staggerContainer}
                        >
                            <motion.h2 variants={fadeIn} className="section-title">Open Wavelengths</motion.h2>
                            <motion.p variants={fadeIn} className="body-text">
                                We thrive on collaboration and shared knowledge, actively contributing to the open-source ecosystem and pioneering next-gen models accessible to all travelers in the digital expanse.
                            </motion.p>
                            <motion.div variants={fadeIn} className="mt-6">
                                 <a href="https://github.com/manicinc" target="_blank" rel="noopener noreferrer" className="styled-button secondary">
                                     Explore Contributions <ArrowRight className="button-icon" />
                                 </a>
                             </motion.div>
                        </motion.div>
                    </div>
                </section>

                <OrnateDividerSVG />

                {/* --- Framers AI / Frame.dev Section --- */}
                <section className="mission-section">
                    <div className="container mx-auto px-4">
                        <motion.div
                            className="max-w-4xl mx-auto text-center"
                            initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.3 }} variants={staggerContainer}
                        >
                            <motion.h2 variants={fadeIn} className="section-title">The Framers: Denoising the Web</motion.h2>
                            <motion.p variants={fadeIn} className="body-text">
                                Through <strong className="highlight-text"><a href="https://frame.dev" target="_blank" rel="noopener noreferrer">Frame.dev</a></strong> and <strong className="highlight-text">Framers AI</strong>, we're building the infrastructure for emergent, adaptive, and permanent AI agency. Our open-source ecosystem includes <a href="https://vca.chat" target="_blank" rel="noopener noreferrer" className="highlight-text">Voice Chat Assistant</a>, <a href="https://agentos.sh" target="_blank" rel="noopener noreferrer" className="highlight-text">AgentOS</a>, and <a href="https://openstrand.ai" target="_blank" rel="noopener noreferrer" className="highlight-text">OpenStrand</a>—alongside emerging platforms like HomeOS, WebOS, SafeOS, MyOS, and WorkOS.
                            </motion.p>
                            <motion.blockquote variants={fadeIn} className="quote">
                                We denoise the web by creating clarity through intelligent systems. AI shouldn't just assist—it should understand, adapt, and persist across contexts.
                            </motion.blockquote>
                            <motion.div variants={fadeIn} className="mt-6">
                                 <a href="https://frame.dev" target="_blank" rel="noopener noreferrer" className="styled-button primary">
                                     Explore Frame.dev <ArrowRight className="button-icon" />
                                 </a>
                             </motion.div>
                        </motion.div>
                    </div>
                </section>

                <OrnateDividerSVG />

                {/* --- Explore Further Section --- */}
                <section className="mission-section text-center">
                    <div className="container mx-auto px-4">
                        <motion.div
                            initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.3 }} variants={staggerContainer}
                        >
                            <motion.h2 variants={fadeIn} className="section-title">Descend Further</motion.h2>
                            <motion.p variants={fadeIn} className="section-subtitle">Navigate the adjacent realities.</motion.p>
                            <motion.div
                                variants={staggerContainer} // Stagger the links themselves
                                className="explore-links-grid mt-8"
                            >
                                <motion.div variants={fadeIn} whileHover={iconHover}>
                                     <Link href="/process" className="explore-link"> <ProcessIcon /><span>The Blueprint</span></Link>
                                </motion.div>
                                <motion.div variants={fadeIn} whileHover={iconHover}>
                                     <Link href="/projects" className="explore-link"> <ProjectsIcon /><span>Creations</span></Link>
                                </motion.div>
                                <motion.div variants={fadeIn} whileHover={iconHover}>
                                     <Link href="/blog" className="explore-link"> <BlogIcon /><span>Æther Log</span></Link>
                                </motion.div>
                                <motion.div variants={fadeIn} whileHover={iconHover}>
                                     <a href="https://games.manic.agency" target="_blank" rel="noopener noreferrer" className="explore-link"> <Rocket /><span>Manic Games</span></a>
                                </motion.div>
                                <motion.div variants={fadeIn} whileHover={iconHover}>
                                     <Link href="/team" className="explore-link"> <TeamIcon /><span>Architects</span></Link>
                                 </motion.div>
                                <motion.div variants={fadeIn} whileHover={iconHover}>
                                    <Link href="/contact" className="explore-link"> <ContactIcon /><span>Contact</span></Link>
                                </motion.div>
                            </motion.div>
                        </motion.div>
                    </div>
                </section>
            </main>

            {/* --- Self-Contained Styles --- */}
            <style jsx global>{`
                /* --- Base & Theme --- */
                .mission-page {
                    background-color: var(--bg-primary);
                    color: var(--text-primary);
                    font-family: var(--font-body);
                    overflow-x: hidden;
                }
                .highlight-text {
                    color: var(--accent-highlight);
                    font-weight: 600; /* Make highlighted text slightly bolder */
                }

                /* --- General Section Styles --- */
                .mission-section { padding: 3rem 0; } /* Reduced padding */
                @media (min-width: 768px) { .mission-section { padding: 4rem 0; } }
                .section-title {
                    font-family: var(--font-display); font-size: clamp(1.8rem, 4.5vw, 2.8rem); font-weight: 800;
                    letter-spacing: -0.025em; color: var(--text-heading);
                    margin-bottom: 0.75rem; /* Reduced margin */
                    text-shadow: 1px 1px 3px var(--shadow-color-light);
                }
                .section-subtitle {
                    font-size: 1rem; color: var(--text-secondary); line-height: 1.6;
                    max-width: 60ch; margin: 0 auto 2rem auto; /* Reduced margin */
                }
                 @media (min-width: 768px) { .section-subtitle { font-size: 1.1rem; margin-bottom: 2.5rem; } }
                 .body-text {
                    font-size: 1rem; color: var(--text-secondary); line-height: 1.7;
                    max-width: 65ch; margin: 0 auto 1.25rem auto; /* Reduced margin */
                 }
                 @media (min-width: 768px) { .body-text { font-size: 1.05rem; } }

                /* --- Hero Section --- */
                .mission-hero-section {
                    position: relative; padding-top: calc(var(--header-height, 60px) + 2rem); /* Adjust based on actual nav height */
                    padding-bottom: 3rem; min-height: 65vh; /* Reduced min-height */
                    display: flex; align-items: center; justify-content: center; overflow: hidden;
                    border-bottom: 1px solid rgba(var(--accent-primary-rgb), 0.1);
                }
                .hero-background { position: absolute; inset: 0; z-index: 0; }
                .grid-overlay { position: absolute; inset: 0; background-image: linear-gradient(to right, rgba(var(--accent-secondary-rgb), 0.05) 1px, transparent 1px), linear-gradient(to bottom, rgba(var(--accent-secondary-rgb), 0.05) 1px, transparent 1px); background-size: 30px 30px; mask-image: radial-gradient(ellipse at center, black 30%, transparent 75%); opacity: 0.6; animation: backgroundPan 60s linear infinite; }
                @keyframes backgroundPan { 0% { background-position: 0% 0%; } 100% { background-position: 100% 100%; } }
                .glow-effect { position: absolute; width: 45vw; height: 45vw; border-radius: 50%; filter: blur(100px); opacity: 0.12; z-index: -1; animation: pulseGlow 10s infinite alternate ease-in-out; }
                .glow-top-left { top: -20%; left: -20%; background-color: var(--accent-primary); }
                .glow-bottom-right { bottom: -20%; right: -20%; background-color: var(--accent-highlight); animation-delay: -5s; }
                @keyframes pulseGlow { from { opacity: 0.1; transform: scale(0.9); } to { opacity: 0.18; transform: scale(1.1); } }
                .hero-title { font-size: clamp(2.2rem, 5.5vw, 3.5rem); /* Reduced size */ font-weight: 800; letter-spacing: -0.03em; line-height: 1.15; color: var(--text-primary); text-shadow: 1px 1px 5px var(--shadow-color-light); margin-bottom: 0.5rem; }
                .hero-subtitle { font-size: 1.05rem; color: var(--text-secondary); line-height: 1.6; max-width: 60ch; margin-left: auto; margin-right: auto; }
                @media (min-width: 768px) { .hero-subtitle { font-size: 1.15rem; } }
                .hero-ascii { color: var(--accent-secondary); /* Adjusted color */ text-shadow: 0 0 4px rgba(var(--accent-secondary-rgb), 0.4); background-color: rgba(var(--bg-tertiary-rgb), 0.1); padding: 0.8rem; border-radius: var(--radius-sm); border: 1px solid rgba(var(--accent-secondary-rgb), 0.1); display: inline-block; line-height: 1.1; font-size: 0.6rem; margin-bottom: 0.5rem; }

                    /* Mania Title */
                .mania-title { font-family: var(--font-mono); font-size: 1rem; color: var(--accent-secondary); text-transform: uppercase; letter-spacing: 0.1em; display: inline-block; position: relative; }
                @media (min-width: 768px) { .mania-title { font-size: 1.1rem; } }
                .mania-glitch-text { position: relative; }
                .mania-glitch-text span::before, .mania-glitch-text span::after { content: attr(data-text); position: absolute; top: 0; left: 0; width: 100%; height: 100%; overflow: hidden; background: var(--bg-primary); }
                .mania-glitch-text span::before { left: 1.5px; text-shadow: -1px 0 var(--accent-highlight); animation: glitchSkew1 2.5s infinite linear alternate-reverse; }
                .mania-glitch-text span::after { left: -1.5px; text-shadow: 1px 0 var(--accent-primary); /* Changed color */ animation: glitchSkew2 3s infinite linear alternate-reverse; }
                @keyframes glitchSkew1 { /* Keep */ } @keyframes glitchSkew2 { /* Keep */ }
                .mania-subtitle { font-size: 0.85rem; md:text-sm text-text-muted font-mono max-w-xl mx-auto mt-1 }

                 /* --- Philosophy Section --- */
                 .quote {
                    border: none; /* Removed border-left */
                    background: linear-gradient(135deg, rgba(var(--bg-secondary-rgb), 0.3), rgba(var(--bg-tertiary-rgb), 0.2));
                    padding: 1.5rem 2rem; margin: 1.5rem auto;
                    max-width: 65ch; border-radius: var(--radius-md);
                    color: var(--text-secondary); font-style: italic;
                    font-family: var(--font-body-blog); /* Use serif for quote */
                    font-size: 1.05rem; line-height: 1.7; position: relative;
                    box-shadow: inset 0 1px 3px rgba(var(--shadow-color), 0.1);
                    border-left: 3px solid var(--accent-primary); /* Keep accent line */
                 }
                 .quote::before { /* Optional: Ornate quote mark */
                     content: '"'; font-family: var(--font-heading-blog); font-size: 3rem;
                     position: absolute; left: 0.5rem; top: 0.5rem;
                     color: var(--accent-primary); opacity: 0.2; line-height: 1;
                 }
                 @media (min-width: 768px) { .quote { font-size: 1.1rem; } }

                 /* --- Themed Button Styles --- */
                 .styled-button {
                     display: inline-flex; align-items: center; justify-content: center;
                     padding: 0.6rem 1.5rem; font-family: var(--font-mono);
                     font-size: 0.85rem; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em;
                     border-radius: var(--radius-base); border: 1px solid;
                     cursor: pointer; transition: all 0.2s ease-out;
                     text-decoration: none;
                 }
                 .styled-button.primary {
                     background-color: var(--accent-primary); border-color: var(--accent-primary); color: var(--text-on-accent);
                     box-shadow: 2px 2px 0px var(--accent-highlight);
                 }
                 .styled-button.primary:hover {
                     background-color: rgba(var(--accent-primary-rgb), 0.85);
                     box-shadow: 1px 1px 0px var(--accent-highlight);
                     transform: translate(1px, 1px);
                 }
                 .styled-button.secondary {
                     background-color: transparent; border-color: var(--accent-secondary); color: var(--accent-secondary);
                 }
                 .styled-button.secondary:hover {
                     background-color: rgba(var(--accent-secondary-rgb), 0.1);
                     color: var(--text-primary); border-color: var(--accent-secondary);
                 }
                 .button-icon { width: 1rem; height: 1rem; margin-left: 0.5rem; }

                 /* --- Pillar Styles --- */
                 .pillar-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(260px, 1fr)); /* Slightly smaller min */ gap: 1.25rem; /* Reduced gap */ }
                 .pillar-card {
                     background: linear-gradient(145deg, rgba(var(--bg-secondary-rgb), 0.5), rgba(var(--bg-tertiary-rgb), 0.3));
                     border: 1px solid rgba(var(--accent-primary-rgb), 0.15); border-radius: var(--radius-md);
                     padding: 1.5rem; text-align: left; /* Align left */
                     transition: transform 0.3s ease, box-shadow 0.3s ease, border-color 0.3s ease; backdrop-filter: blur(4px);
                     display: flex; flex-direction: column; height: 100%;
                     position: relative; overflow: hidden;
                 }
                 .pillar-card::after { /* Subtle edge highlight */
                      content: ''; position: absolute; top: 0; right: 0; bottom: 0; width: 3px;
                      background: linear-gradient(to bottom, transparent, var(--accent-highlight), transparent);
                      opacity: 0; transition: opacity 0.3s ease;
                  }
                 .pillar-card:hover { transform: translateY(-4px); box-shadow: 0 8px 20px var(--shadow-color-light); border-color: rgba(var(--accent-primary-rgb), 0.3); }
                 .pillar-card:hover::after { opacity: 0.5; }
                 .pillar-icon-wrapper {
                      display: inline-flex; padding: 0.6rem; border-radius: var(--radius-sm);
                      background: rgba(var(--accent-primary-rgb), 0.1); margin-bottom: 0.8rem;
                      border: 1px solid rgba(var(--accent-primary-rgb), 0.2);
                      width: fit-content; /* Fit icon size */
                      transition: background-color 0.2s ease;
                  }
                  .pillar-card:hover .pillar-icon-wrapper { background: rgba(var(--accent-primary-rgb), 0.2); }
                  /* Style wrappers differently based on style class */
                  .pillar-icon-wrapper.style-1 { background: rgba(var(--accent-secondary-rgb), 0.1); border-color: rgba(var(--accent-secondary-rgb), 0.2); } .pillar-card:hover .pillar-icon-wrapper.style-1 { background: rgba(var(--accent-secondary-rgb), 0.2); }
                  .pillar-icon-wrapper.style-2 { background: rgba(var(--accent-primary-rgb), 0.1); border-color: rgba(var(--accent-primary-rgb), 0.2); } .pillar-card:hover .pillar-icon-wrapper.style-2 { background: rgba(var(--accent-primary-rgb), 0.2); }
                  .pillar-icon-wrapper.style-3 { background: rgba(var(--accent-highlight-rgb), 0.1); border-color: rgba(var(--accent-highlight-rgb), 0.2); } .pillar-card:hover .pillar-icon-wrapper.style-3 { background: rgba(var(--accent-highlight-rgb), 0.2); }
                  .pillar-icon-wrapper.style-4 { background: rgba(var(--brand-cyan-rgb, 0, 255, 255), 0.1); border-color: rgba(var(--brand-cyan-rgb, 0, 255, 255), 0.2); } .pillar-card:hover .pillar-icon-wrapper.style-4 { background: rgba(var(--brand-cyan-rgb, 0, 255, 255), 0.2); } /* Assuming brand-cyan variable exists or fallback */

                 .pillar-icon { width: 1.5rem; height: 1.5rem; stroke-width: 1.5; color: currentColor; /* Inherit color from wrapper or set directly */ }
                 .pillar-title { font-family: var(--font-display); font-size: 1.1rem; font-weight: 600; color: var(--text-primary); margin-bottom: 0.4rem; }
                 .pillar-text { font-size: 0.85rem; color: var(--text-secondary); line-height: 1.6; flex-grow: 1; }

                 /* --- Explore Links --- */
                 .explore-links-grid { display: flex; flex-wrap: wrap; justify-content: center; align-items: center; gap: 0.8rem; /* Tighter gap */ }
                 .explore-link {
                     display: inline-flex; align-items: center; gap: 0.4rem; font-family: var(--font-mono); font-size: 0.8rem; /* Smaller */ color: var(--text-secondary); text-decoration: none; padding: 0.4rem 0.8rem; /* Tighter */ border: 1px solid var(--bg-tertiary); border-radius: var(--radius-sm); background-color: rgba(var(--bg-secondary-rgb), 0.5); transition: all 0.2s ease-out;
                 }
                 .explore-link svg { width: 1rem; height: 1rem; transition: transform 0.2s ease; }
                 .explore-link:hover { color: var(--accent-highlight); border-color: var(--accent-highlight); background-color: rgba(var(--accent-highlight-rgb), 0.1); box-shadow: 0 0 8px rgba(var(--accent-highlight-rgb), 0.2); }
                 .explore-link:hover svg { transform: rotate(-5deg) scale(1.1); }

                 /* --- SVG Network Background --- */
                 .abstract-network-svg line, .abstract-network-svg circle {
                     stroke: var(--accent-secondary); /* Theme color */
                     animation: svg-pulse-opacity 10s infinite alternate ease-in-out;
                 }
                 .abstract-network-svg .line-1 { animation-delay: -2s; }
                 .abstract-network-svg .line-2 { animation-delay: -4s; }
                 .abstract-network-svg .circle-1 { animation-delay: -6s; }
                 .abstract-network-svg .circle-2 { animation-delay: -8s; }
                 @keyframes svg-pulse-opacity {
                     0% { opacity: 0.05; } 100% { opacity: 0.15; }
                 }

            `}</style>
        </div>
    );
};

export default MissionPageClient; 