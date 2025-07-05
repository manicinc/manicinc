// src/app/contact/page.tsx
'use client';

import React from 'react';
import Link from 'next/link';
import { Mail as Envelope, Phone, Instagram, MapPin, Send, Github, Linkedin, Twitter, Disc3 } from 'lucide-react'; // Using Lucide where possible for consistency
import { FaDiscord } from 'react-icons/fa'; // Keep FaDiscord if preferred

// --- Component Imports ---
// Assuming these components now correctly use theme variables internally
import ContactDetails from "@/components/ContactDetails"; // This will be effectively replaced by inline structure below
import ContactForm from "@/components/ContactForm";
import Offices from '@/components/Offices'; // Needed for address info if used

// --- SVG Placeholder Components (Ensure themed colors) ---
const TeamSVG = () => <svg viewBox="0 0 100 100" className="w-12 h-12 mb-3 transition-transform duration-300 ease-in-out group-hover:scale-110 group-hover:-rotate-3 text-[color:var(--accent-secondary)]"><path d="M50,10 C70,10 90,30 90,50 C90,70 70,90 50,90 C30,90 10,70 10,50 C10,30 30,10 50,10 Z M30,60 Q50,75 70,60 M40,40 Q45,50 50,40 M50,40 Q55,50 60,40" stroke="currentColor" strokeWidth="3" fill="none" strokeLinecap="round" strokeLinejoin="round" /></svg>;
const ProjectsSVG = () => <svg viewBox="0 0 100 100" className="w-12 h-12 mb-3 transition-transform duration-300 ease-in-out group-hover:scale-110 group-hover:rotate-2 text-[color:var(--accent-secondary)]"><path d="M10,20 V80 H90 V20 H70 L60,10 H40 L30,20 Z M10,40 H90 M35,50 A15,15 0 1,1 65,50 A15,15 0 1,1 35,50" stroke="currentColor" strokeWidth="3" fill="none" strokeLinecap="round" strokeLinejoin="round"/></svg>;
const ServicesSVG = () => <svg viewBox="0 0 100 100" className="w-12 h-12 mb-3 transition-transform duration-300 ease-in-out group-hover:scale-110 group-hover:rotate-3 text-[color:var(--accent-secondary)]"><path d="M30,20 L70,20 L85,50 L70,80 L30,80 L15,50 Z M30,50 H70 M50,20 V80" stroke="currentColor" strokeWidth="3" fill="none" strokeLinecap="round" strokeLinejoin="round" /><circle cx="50" cy="50" r="8" fill="currentColor"/></svg>;
const DiscordSVG = () => <FaDiscord className="w-5 h-5 mr-2 social-icon icon-discord" />; // Added classes for animation targeting


// --- *** GENERATED ANIMATED SVG COMPONENTS *** ---

// Updated Location SVG - Abstract US Map with LA point
const LocationMapSVG = () => (
    <svg viewBox="0 0 100 65" className="w-full h-auto location-map-svg overflow-visible my-4">
        <defs>
            <filter id="map-glow" x="-50%" y="-50%" width="200%" height="200%">
                <feGaussianBlur stdDeviation="2.5" result="coloredBlur"/>
                <feMerge>
                    <feMergeNode in="coloredBlur"/>
                    <feMergeNode in="SourceGraphic"/>
                </feMerge>
            </filter>
            {/* Abstract US Shape Path Data (Simplified) */}
            <path id="us-shape" d="M11.2,30.7 C10.6,29.1 10.1,26.7 10.6,25.3 C11.6,22.6 15.2,22.1 17.6,22.3 C22.2,22.6 25.5,25.9 28.7,26.8 C31.9,27.7 37,26.8 40.4,26.2 C48.6,24.6 56.8,24.5 64.9,25.6 C71.9,26.5 78.1,29.7 82.5,32.8 C87.6,36.4 90.9,42.2 90.8,48.4 C90.6,54.6 86.2,59.7 80.9,61.7 C75.6,63.7 68.8,62.5 63.5,61.5 C56.7,60.2 49.9,59.5 43.2,59.3 C36.5,59.1 30.5,59.8 25.5,57.9 C20.5,56 17.6,52.2 16.4,47.4 C15.2,42.6 15.4,37.1 13.9,33 C13.1,30.7 11.8,31.6 11.2,30.7 Z" />
        </defs>

        {/* Subtle map outline */}
        <use href="#us-shape" fill="none" stroke="var(--bg-tertiary)" strokeWidth="1" opacity="0.5" />
        <use href="#us-shape" fill="rgba(var(--bg-secondary-rgb), 0.5)" />

        {/* LA Marker (Pulsing) */}
        <g className="la-marker" transform="translate(20, 45)"> {/* Approximate LA position */}
            <circle r="6" fill="var(--accent-primary)" opacity="0.7" filter="url(#map-glow)">
                 <animate attributeName="r" values="4; 7; 4" dur="2.5s" repeatCount="indefinite" />
                 <animate attributeName="opacity" values="0.7; 1; 0.7" dur="2.5s" repeatCount="indefinite" />
            </circle>
            <circle r="2" fill="#FFFFFF" /> {/* Inner dot */}
        </g>

         {/* Connection Lines (Example - can be removed or expanded) */}
         <line x1="20" y1="45" x2="50" y2="30" stroke="var(--accent-highlight)" strokeWidth="0.5" opacity="0.3" strokeDasharray="3 2" />
         <line x1="20" y1="45" x2="75" y2="40" stroke="var(--accent-highlight)" strokeWidth="0.5" opacity="0.3" strokeDasharray="3 2" />
    </svg>
);

// Animated Envelope (Placed near subtitle)
const AnimatedEnvelopeSVG = ({ className = "" }: { className?: string }) => (
    <svg viewBox="-2 -2 68 68" className={`inline-block w-10 h-10 mx-2 text-[color:var(--accent-highlight)] envelope-svg ${className}`}>
        <defs>
            <linearGradient id="envShimmerHeader" x1="-100%" y1="-100%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="currentColor" stopOpacity="0.1"/>
                <stop offset="50%" stopColor="currentColor" stopOpacity="0.5"/>
                <stop offset="100%" stopColor="currentColor" stopOpacity="0.1"/>
                <animate attributeName="x1" values="-100%; 200%" dur="2.5s" repeatCount="indefinite" />
                <animate attributeName="y1" values="-100%; 200%" dur="2.5s" repeatCount="indefinite" />
                <animate attributeName="x2" values="100%; -100%" dur="2.5s" repeatCount="indefinite" />
                <animate attributeName="y2" values="100%; -100%" dur="2.5s" repeatCount="indefinite" />
            </linearGradient>
            <filter id="envGlowHeader" x="-50%" y="-50%" width="200%" height="200%">
                <feGaussianBlur stdDeviation="1.5" result="coloredBlur"/>
                <feMerge> <feMergeNode in="coloredBlur"/> <feMergeNode in="SourceGraphic"/> </feMerge>
            </filter>
        </defs>
        <g className="envelope-group" filter="url(#envGlowHeader)">
            <path d="M4,16 V48 H60 V16 L32,32 Z" fill="var(--bg-tertiary)" stroke="currentColor" strokeWidth="1.5">
                <animateTransform attributeName="transform" type="translate" values="0 0; 0 -0.5; 0 0" dur="4s" repeatCount="indefinite" />
            </path>
            <path d="M4,16 L32,32 L60,16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" strokeLinecap="round" >
                <animateTransform attributeName="transform" type="translate" values="0 0; 0 -0.5; 0 0" dur="4s" repeatCount="indefinite" />
            </path>
            <path d="M4,16 V48 H60 V16 L32,32 Z" fill="url(#envShimmerHeader)" opacity="0.8" />
        </g>
    </svg>
);

// New Teacup SVG with Animation
const TeacupSVG = ({ className = "" }: { className?: string }) => (
    <svg viewBox="0 0 64 64" className={`w-12 h-12 teacup-svg ${className}`}>
         <defs>
             <filter id="teaGlow" x="-50%" y="-50%" width="200%" height="200%">
                  <feGaussianBlur stdDeviation="1.5" result="blurOut" />
                  <feColorMatrix in="blurOut" type="matrix" values="1 0 0 0 0 0 1 0 0 0 0 0 1 0 0 0 0 0 0.6 0" result="matrixOut"/>
                  <feMerge> <feMergeNode in="matrixOut"/> <feMergeNode in="SourceGraphic"/> </feMerge>
              </filter>
          </defs>
        {/* Steam Paths */}
        <g className="steam" fill="none" stroke="var(--accent-secondary)" strokeWidth="1.5" strokeLinecap="round" opacity="0.6">
            <path d="M28,18 Q30,14 32,18 T36,18" />
            <path d="M29,14 Q31,10 33,14 T37,14" />
            <path d="M30,10 Q32,6 34,10 T38,10" />
        </g>
        {/* Cup */}
        <path d="M12,24 C12,22 14,20 16,20 H48 C50,20 52,22 52,24 V44 C52,48 48,52 44,52 H20 C16,52 12,48 12,44 Z" fill="var(--bg-tertiary)" stroke="var(--accent-highlight)" strokeWidth="1.5" filter="url(#teaGlow)"/>
        {/* Handle */}
        <path d="M52,30 C58,30 58,42 52,42" fill="none" stroke="var(--accent-highlight)" strokeWidth="1.5" />
        {/* Saucer */}
        <path d="M8,54 H56 C54,58 44,60 32,60 C20,60 10,58 8,54 Z" fill="var(--bg-secondary)" stroke="var(--accent-highlight)" strokeWidth="1.5"/>
    </svg>
);


// --- Contact Page Component ---
const ContactPage = () => {
    const discordLink = "https://discord.gg/DzNgXdYm"; // <<<--- REPLACE THIS
    const instagramLink = "https://instagram.com/manic.agency"; // <<<--- REPLACE THIS
    const githubLink = "https://github.com/manicinc";
    const linkedinLink = "https://www.linkedin.com/company/manic-agency-llc/";
    const twitterLink = "https://x.com/manicagency";

    return (
        <div className="contact-page-wrapper bg-bg-primary text-text-primary font-body">

            {/* 1. Page Header Section (Tighter Padding) */}
            <header className="py-16 sm:py-20 md:py-24 text-center relative overflow-hidden border-b border-[color:var(--bg-secondary)]">
                <div className="absolute inset-0 z-0 opacity-[0.04] bg-[url('/assets/images/noise.svg')] bg-repeat mix-blend-overlay"></div>
                <div className="absolute top-0 left-0 w-1/3 h-full bg-gradient-to-r from-[color:var(--accent-primary)] to-transparent opacity-10 blur-3xl -z-10 animate-pulse-slow"></div>
                <div className="absolute bottom-0 right-0 w-1/2 h-2/3 bg-gradient-to-t from-[color:var(--accent-secondary)] to-transparent opacity-10 blur-3xl -z-10 animate-pulse-slower"></div>

                <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                    <h1 className="projects-title project-header-glitch text-shadow-glow">
                        Open a Dialogue<span className="accent-dot">.</span>
                    </h1>
                    <p className="text-lg sm:text-xl text-[color:var(--text-secondary)] max-w-2xl mx-auto font-body-blog leading-relaxed inline-flex items-center justify-center flex-wrap">
                         {/* Glitch Effect */}
                         <span className="contact-subtitle-glitch mr-2" data-text="You're invited to the tea party!">
                             You're invited to the tea party!
                         </span>
                         {/* Animated Envelope */}
                         <AnimatedEnvelopeSVG className="inline-block align-middle" />
                     </p>
                      <hr className="w-20 h-[2px] mx-auto mt-6 border-0 bg-gradient-to-r from-transparent via-[color:var(--accent-highlight)] to-transparent opacity-50" />
                  </div>
             </header>

            {/* 2. "Explore Further" Links Section (Tighter Padding) */}
             <section className="py-12 sm:py-16 bg-gradient-to-b from-[color:var(--bg-primary)] to-[color:var(--bg-secondary)]">
                  <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                      <h2 className="text-xl font-heading-blog font-semibold text-[color:var(--text-heading)] mb-10 text-center">
                          Peruse Our Archives
                      </h2>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6"> {/* Reduced Gap */}
                          <Link href="/team" className="explore-link-card group">
                              <TeamSVG /> <h3 className="explore-link-title">Our Collective</h3> <p className="explore-link-desc">Meet the artisans and technicians.</p> <span className="explore-link-cta">Discover More &rarr;</span>
                          </Link>
                          <Link href="/projects" className="explore-link-card group">
                              <ProjectsSVG /> <h3 className="explore-link-title">Past and Current Works</h3> <p className="explore-link-desc">View our ventures.</p> <span className="explore-link-cta">Explore Portfolio &rarr;</span>
                          </Link>
                          <Link href="/process" className="explore-link-card group">
                              <ServicesSVG /> <h3 className="explore-link-title">Capabilities</h3> <p className="explore-link-desc">Learn about offered services.</p> <span className="explore-link-cta">View Services &rarr;</span>
                          </Link>
                      </div>
                  </div>
              </section>

            {/* 3. Main Contact Grid (Tighter Padding) */}
             <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-20 grid grid-cols-1 gap-x-12 gap-y-12 lg:grid-cols-5 items-start">
                 {/* Contact Form Column */}
                 <div className="lg:col-span-3 contact-form-container relative"> {/* Added relative positioning */}
                      {/* Floating Teacup */}
                      <div className="absolute -top-10 -right-5 z-0 hidden lg:block">
                          <TeacupSVG className="opacity-50" />
                      </div>

                      <h2 className="text-2xl sm:text-3xl font-heading-blog font-semibold text-[color:var(--text-heading)] mb-6 flex items-center">
                           {/* Using standard Envelope icon */}
                          <Envelope className="w-6 h-6 mr-3 text-[color:var(--accent-primary)] opacity-80"/> Send Your Inquiry
                      </h2>
                      <ContactForm />
                       <p className="mt-5 text-xs text-[color:var(--text-muted)] font-body-blog italic">
                          Your privacy is paramount. Information submitted is confidential and used solely for correspondence.
                       </p>
                  </div>

                 {/* Details & Location Column */}
                 <div className="lg:col-span-2 space-y-8 lg:sticky lg:top-[calc(var(--header-height)_+_1.5rem)]"> {/* Reduced top offset */}
                     {/* Contact Points */}
                     <div className="themed-contact-details">
                         <h3 className="footer-heading">Contact Points</h3>
                          <dl className="mt-4 space-y-2 text-sm"> {/* Adjusted spacing */}
                             {/* Email */}
                             <div>
                                 <dt className="sr-only">Email</dt>
                                 <dd>
                                     <a href={`mailto:team@manic.agency`} className="contact-detail-link group/email">
                                         <Envelope className="w-5 h-5 social-icon icon-mail" />
                                         <span>team@manic.agency</span>
                                     </a>
                                 </dd>
                             </div>
                             {/* Phone Example */}
                             {/* <div><dt className="sr-only">Phone</dt><dd><a href="tel:+1..." className="contact-detail-link group/phone"><Phone className="w-5 h-5 social-icon icon-phone" /><span>+1 (XXX) XXX-XXXX</span></a></dd></div> */}
                             {/* Social Links */}
                             <div>
                                 <dt className="sr-only">Discord</dt>
                                 <dd>
                                     <a href={discordLink} target="_blank" rel="noopener noreferrer" className="contact-detail-link group/discord">
                                         <DiscordSVG /> {/* Uses FaDiscord */}
                                         <span>Follow us on Discord</span>
                                     </a>
                                 </dd>
                             </div>
                             <div>
                                 <dt className="sr-only">GitHub</dt>
                                 <dd>
                                     <a href={githubLink} target="_blank" rel="noopener noreferrer" className="contact-detail-link group/github">
                                         <Github className="w-5 h-5 social-icon icon-github" />
                                         <span>Follow us on GitHub</span>
                                     </a>
                                 </dd>
                             </div>
                             <div>
                                 <dt className="sr-only">LinkedIn</dt>
                                 <dd>
                                     <a href={linkedinLink} target="_blank" rel="noopener noreferrer" className="contact-detail-link group/linkedin">
                                         <Linkedin className="w-5 h-5 social-icon icon-linkedin" />
                                         <span>Follow us on LinkedIn</span>
                                     </a>
                                 </dd>
                             </div>
                              <div>
                                 <dt className="sr-only">Twitter</dt>
                                 <dd>
                                     <a href={twitterLink} target="_blank" rel="noopener noreferrer" className="contact-detail-link group/twitter">
                                         <Twitter className="w-5 h-5 social-icon icon-twitter" />
                                         <span>Follow us on X</span>
                                     </a>
                                 </dd>
                             </div>
                             <div>
                                 <dt className="sr-only">Instagram</dt>
                                 <dd>
                                     <a href={instagramLink} target="_blank" rel="noopener noreferrer" className="contact-detail-link group/insta">
                                         <Instagram className="w-5 h-5 social-icon icon-instagram" />
                                         <span>Follow us on Instagram</span>
                                     </a>
                                 </dd>
                             </div>
                          </dl>
                      </div>

                     {/* Location Section */}
                     <div>
                         <h3 className="footer-heading flex items-center">
                             <MapPin className="w-4 h-4 mr-2 text-[color:var(--accent-highlight)] opacity-90" /> Nexus Location
                         </h3>
                          <p className="text-[color:var(--text-secondary)] text-sm font-body-blog mb-2 leading-relaxed">
                             Headquarters anchored in Los Angeles, California, while our core operates within the digital ether.
                          </p>
                          <LocationMapSVG /> {/* Updated SVG */}
                      </div>
                 </div>
             </section>

            {/* 4. Animated Discord CTA Banner (Tighter Padding) */}
             <section className="discord-cta-banner py-12 sm:py-16"> {/* Reduced Padding */}
                 <div className="discord-cta-content">
                     {/* <h2 className="discord-cta-title">Join Our Comms Channel</h2> */}
                     <p className="discord-cta-text">
                         Engage with our community, share insights, and connect in real-time on our Discord server.
                     </p>
                     <a
                         href={discordLink} target="_blank" rel="noopener noreferrer"
                         className="discord-cta-button"
                     >
                         <FaDiscord className="w-5 h-5 mr-2" /> Access Granted
                     </a>
                 </div>
                  <div className="discord-bg-shape discord-bg-shape-1"></div>
                  <div className="discord-bg-shape discord-bg-shape-2"></div>
                  <div className="discord-bg-shape discord-bg-shape-3"></div>
             </section>

            {/* Global Styles */}
            <style jsx global>{`
                /* General Page Styles */
                .contact-page-wrapper { min-height: 100vh; }

                /* Header Glitch Effect */
                .contact-subtitle-glitch { position: relative; display: inline-block; }
                .contact-subtitle-glitch::before, .contact-subtitle-glitch::after { content: attr(data-text); position: absolute; top: 0; left: 0; width: 100%; height: 100%; background: var(--bg-primary); overflow: hidden; clip-path: inset(50% 0 50% 0); }
                .contact-subtitle-glitch::before { left: 1px; text-shadow: -1px 0 var(--accent-primary); animation: glitch-sub 2.5s infinite linear alternate-reverse steps(3, jump-end); }
                .contact-subtitle-glitch::after { left: -1px; text-shadow: 1px 0 var(--accent-secondary); animation: glitch-sub 3s infinite linear alternate-reverse steps(4, jump-start); }
                @keyframes glitch-sub { 0% { clip-path: inset(80% 0 10% 0); } 20% { clip-path: inset(10% 0 75% 0); } 40% { clip-path: inset(55% 0 20% 0); } 60% { clip-path: inset(30% 0 60% 0); } 80% { clip-path: inset(90% 0 5% 0); } 100% { clip-path: inset(40% 0 45% 0); } }

                /* Animated Envelope Styles */
                .envelope-svg { vertical-align: middle; } /* Align better with text */
                /* Envelope animation is defined within its component's defs */

                /* Teacup Animation Styles */
                .teacup-svg {
                    animation: teacup-wobble 8s infinite ease-in-out;
                    transform-origin: bottom center;
                }
                @keyframes teacup-wobble {
                  0%, 100% { transform: rotate(-1deg) translateY(0px); }
                  50% { transform: rotate(1.5deg) translateY(-2px); }
                }
                .teacup-svg .steam path {
                    stroke-dasharray: 10;
                    stroke-dashoffset: 10;
                    animation: steam-fade 3s infinite linear;
                }
                .teacup-svg .steam path:nth-child(1) { animation-delay: 0s; }
                .teacup-svg .steam path:nth-child(2) { animation-delay: 0.5s; }
                .teacup-svg .steam path:nth-child(3) { animation-delay: 1s; }
                @keyframes steam-fade {
                  0% { opacity: 0; stroke-dashoffset: 10; transform: translateY(5px); }
                  50% { opacity: 0.6; stroke-dashoffset: 5; }
                  100% { opacity: 0; stroke-dashoffset: 0; transform: translateY(-10px); }
                }


                /* Explore Link Card Styles */
                .explore-link-card { display: block; background-color: var(--bg-secondary); border: 1px solid var(--bg-tertiary); border-radius: var(--radius-lg); padding: 1.5rem; /* Reduced padding */ transition: all 0.3s ease-out; text-align: center; position: relative; overflow: hidden; }
                .explore-link-card:hover { transform: translate(2px, 2px); border-color: var(--accent-secondary); box-shadow: 4px 4px 0 var(--accent-primary), 0 8px 15px var(--shadow-color-light); background-color: var(--bg-tertiary); }
                .explore-link-card::before { content: ''; position: absolute; inset: 0; border-radius: inherit; background: radial-gradient(ellipse at center, rgba(var(--accent-highlight-rgb), 0.1) 0%, transparent 70%); opacity: 0; transition: opacity 0.3s ease-out; z-index: 0; }
                .explore-link-card:hover::before { opacity: 1; }
                .explore-link-card > * { position: relative; z-index: 1; }
                .explore-link-title { font-family: var(--font-display); font-size: 1.2rem; font-weight: 700; color: var(--text-heading); margin-bottom: 0.25rem; transition: color 0.2s ease; }
                .explore-link-card:hover .explore-link-title { color: var(--accent-primary); }
                .explore-link-desc { font-family: var(--font-body); font-size: 0.85rem; color: var(--text-secondary); margin-bottom: 1rem; line-height: 1.5; }
                .explore-link-cta { font-family: var(--font-mono); font-size: 0.75rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.05em; color: var(--accent-primary); transition: color var(--transition-fast); }
                .explore-link-card:hover .explore-link-cta { color: var(--accent-highlight); }
                .explore-link-card svg { transition: transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1); margin-left: auto; margin-right: auto; color: var(--accent-secondary); }
                .explore-link-card:hover svg { transform: scale(1.1) rotate(-4deg); color: var(--accent-primary); filter: drop-shadow(0 1px 3px rgba(var(--accent-primary-rgb), 0.2)); }

                /* --- Contact Form Theming (Ensure ContactForm uses 'themed-contact-form' class) --- */
                .themed-contact-form label { display: block; font-family: var(--font-mono); font-size: 0.7rem; font-weight: 600; color: var(--text-secondary); margin-bottom: 0.3rem; text-transform: uppercase; letter-spacing: 0.05em; }
                .themed-contact-form input[type="text"], .themed-contact-form input[type="email"], .themed-contact-form input[type="tel"], .themed-contact-form textarea { display: block; width: 100%; background-color: rgba(var(--bg-secondary-rgb), 0.7) !important; color: var(--text-primary) !important; border: 1px solid var(--bg-tertiary) !important; border-radius: var(--radius-base) !important; padding: 0.7rem 0.9rem !important; /* Adjusted padding */ font-family: var(--font-body); font-size: 0.9rem; transition: border-color var(--transition-fast), box-shadow var(--transition-fast), background-color var(--transition-fast); appearance: none; line-height: 1.5; }
                .themed-contact-form textarea { min-height: 100px; } /* Reduced min height */
                .themed-contact-form input::placeholder, .themed-contact-form textarea::placeholder { color: var(--text-muted); opacity: 0.7; font-size: 0.85rem; }
                .themed-contact-form input:focus, .themed-contact-form textarea:focus { outline: none; border-color: var(--accent-highlight) !important; box-shadow: 0 0 0 3px rgba(var(--accent-highlight-rgb), 0.25) !important; background-color: rgba(var(--bg-tertiary-rgb), 0.8) !important; }
                .themed-contact-form fieldset { border: 1px dashed var(--bg-tertiary); padding: 0.8rem 1.2rem 1.2rem 1.2rem; /* Reduced padding */ border-radius: var(--radius-base); margin-top: 0.8rem; }
                .themed-contact-form legend { font-family: var(--font-mono); font-size: 0.75rem; font-weight: 600; color: var(--text-secondary); text-transform: uppercase; letter-spacing: 0.05em; padding: 0 0.5rem; }
                .themed-contact-form .radio-label { display: flex; align-items: center; cursor: pointer; font-family: var(--font-body); font-size: 0.85rem; color: var(--text-secondary); transition: color var(--transition-fast); }
                .themed-contact-form .radio-label:hover { color: var(--text-primary); }
                .themed-contact-form input[type="radio"] { opacity: 0; position: absolute; width: 1px; height: 1px; }
                .themed-contact-form .radio-custom { width: 16px; height: 16px; border: 2px solid var(--bg-tertiary); border-radius: 50%; margin-right: 0.6rem; display: inline-flex; align-items: center; justify-content: center; transition: border-color var(--transition-fast), background-color var(--transition-fast); flex-shrink: 0; }
                .themed-contact-form .radio-label:hover .radio-custom { border-color: var(--accent-secondary); }
                .themed-contact-form input[type="radio"]:checked + .radio-custom { border-color: var(--accent-primary); background-color: var(--accent-primary); box-shadow: 0 0 0 2px var(--bg-primary), inset 0 0 0 2px var(--bg-primary); }
                .themed-contact-form input[type="radio"]:focus + .radio-custom { box-shadow: 0 0 0 3px rgba(var(--accent-primary-rgb), 0.3); border-color: var(--accent-primary); }
                .themed-contact-form button[type="submit"] { font-family: var(--font-mono); font-weight: bold; text-transform: uppercase; letter-spacing: 0.08em; padding: 0.7rem 1.5rem; /* Adjusted padding */ border-radius: var(--radius-base); cursor: pointer; transition: all 0.15s ease-out; position: relative; display: inline-flex; align-items: center; gap: 0.5rem; background-color: var(--accent-highlight); color: var(--text-on-accent); border: 2px solid var(--accent-primary); box-shadow: 3px 3px 0 var(--accent-primary); /* Adjusted shadow */ }
                .themed-contact-form button[type="submit"]:hover:not(:disabled) { background-color: var(--accent-primary); color: var(--text-on-accent); border-color: var(--accent-highlight); box-shadow: 1px 1px 0 var(--accent-highlight); transform: translate(2px, 2px); }
                .themed-contact-form button[type="submit"]:active:not(:disabled) { box-shadow: 0px 0px 0 var(--accent-highlight); transform: translate(3px, 3px); }
                .themed-contact-form button[type="submit"]:disabled { opacity: 0.6; cursor: not-allowed; box-shadow: 1px 1px 0 var(--accent-primary); transform: none; }

                /* --- Contact Details Styling --- */
                 .themed-contact-details .footer-heading { /* Inherit from Footer for now, or define specific styles */
                     font-family: var(--font-heading-blog);
                     font-size: 1.1rem; /* Smaller heading */
                     color: var(--text-heading);
                     text-transform: none;
                     letter-spacing: normal;
                     border-bottom: 1px solid var(--bg-tertiary);
                     padding-bottom: 0.4rem;
                     margin-bottom: 0.8rem;
                 }
                .contact-detail-link { display: flex; align-items: center; font-family: var(--font-body); color: var(--text-secondary); transition: color 0.2s ease-out, border-color 0.2s ease-out; text-decoration: none !important; padding: 0.3rem 0; border-bottom: 1px dotted transparent; }
                .contact-detail-link:hover { color: var(--accent-highlight); border-bottom-color: rgba(var(--accent-highlight-rgb), 0.4); }
                .contact-detail-link span { margin-left: 0.6rem; font-size: 0.9rem; } /* Tighter spacing */
                .contact-detail-link .social-icon {
                     width: 1.1rem; height: 1.1rem; /* Consistent size */
                     margin-right: 0.6rem;
                     color: var(--text-secondary); /* Base color */
                     transition: transform 0.3s ease-out, color 0.2s ease-out;
                 }
                 .contact-detail-link:hover .social-icon {
                     color: var(--accent-highlight); /* Highlight color on hover */
                 }

                 /* Individual Social Icon Hover Animations */
                 @keyframes icon-shake { 0%, 100% { transform: rotate(0deg); } 25% { transform: rotate(-8deg); } 75% { transform: rotate(8deg); } }
                 .contact-detail-link:hover .icon-mail { animation: icon-shake 0.5s ease-in-out; }

                 @keyframes icon-spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
                 .contact-detail-link:hover .icon-github { animation: icon-spin 0.8s linear; }

                 @keyframes icon-pulse { 0%, 100% { transform: scale(1); } 50% { transform: scale(1.2); } }
                 .contact-detail-link:hover .icon-linkedin { animation: icon-pulse 0.6s ease-in-out; }

                 @keyframes icon-fly { 0% { transform: translateY(0) rotate(0); } 50% { transform: translateY(-4px) rotate(5deg); } 100% { transform: translateY(0) rotate(0); } }
                 .contact-detail-link:hover .icon-twitter { animation: icon-fly 0.7s ease-out; }

                 @keyframes icon-glow-pulse { 0%, 100% { opacity: 0.8; filter: drop-shadow(0 0 1px currentColor); } 50% { opacity: 1; filter: drop-shadow(0 0 3px currentColor); } }
                 .contact-detail-link:hover .icon-instagram { animation: icon-glow-pulse 1s infinite ease-in-out; }
                 .contact-detail-link:hover .icon-discord { animation: icon-glow-pulse 1.2s infinite ease-in-out; /* Slightly different timing */}


                /* --- Location Map SVG Animation --- */
                 @keyframes draw-lines { from { stroke-dashoffset: 50; } to { stroke-dashoffset: 0; } }
                 .radiating-lines line { stroke-dasharray: 50; stroke-dashoffset: 50; animation: draw-lines 1.2s ease-out forwards; animation-delay: calc(var(--line-index, 0) * 0.08s + 0.5s); }
                 .orbiting-dots { animation: rotate-orbit 20s linear infinite; transform-origin: center; }
                 @keyframes rotate-orbit { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }

                /* --- Discord CTA Banner --- */
                .discord-cta-banner { padding: 3rem 1rem; /* Reduced padding */ background: linear-gradient(135deg, var(--bg-secondary) 0%, var(--bg-tertiary) 100%); border-top: 1px solid var(--bg-tertiary); border-bottom: 1px solid var(--bg-secondary); text-align: center; position: relative; overflow: hidden; }
                .discord-cta-content { position: relative; z-index: 1; max-width: 600px; margin: 0 auto; }
                .discord-cta-title { font-family: var(--font-script-blog); font-size: clamp(2.2rem, 5vw, 3rem); color: var(--accent-primary); margin-bottom: 0.5rem; text-shadow: 0 1px 3px var(--shadow-color-light); animation: text-flicker 5s linear infinite alternate; }
                @keyframes text-flicker { /* Same as before */ }
                .discord-cta-text { font-family: var(--font-body-blog); font-size: 1rem; color: var(--text-secondary); max-width: 500px; margin: 0 auto 1.2rem auto; line-height: 1.6; }
                .discord-cta-button { display: inline-flex; align-items: center; justify-content: center; padding: 0.6rem 1.5rem; /* Reduced padding */ font-family: var(--font-mono); font-size: 0.8rem; font-weight: bold; text-transform: uppercase; letter-spacing: 0.05em; border-radius: var(--radius-base); border: 2px solid transparent; background: linear-gradient(45deg, var(--accent-highlight), var(--accent-primary)); color: var(--text-on-accent); box-shadow: 0 3px 8px rgba(var(--accent-primary-rgb), 0.3); transition: all 0.3s ease-out; }
                .discord-cta-button:hover { transform: translateY(-3px) scale(1.03); box-shadow: 0 6px 12px rgba(var(--accent-primary-rgb), 0.4); background: linear-gradient(45deg, var(--accent-primary), var(--accent-highlight)); color: #fff; }
                .discord-bg-shape { position: absolute; border-radius: 50%; opacity: 0.08; filter: blur(40px); z-index: 0; animation: bg-shape-morph 15s infinite alternate ease-in-out; }
                .discord-bg-shape-1 { width: 300px; height: 300px; top: -50px; left: -50px; background-color: var(--accent-secondary); animation-delay: 0s; }
                .discord-bg-shape-2 { width: 250px; height: 250px; bottom: -80px; right: -80px; background-color: var(--accent-highlight); animation-delay: -5s; }
                .discord-bg-shape-3 { width: 200px; height: 200px; top: 50%; left: 50%; transform: translate(-50%, -50%); background-color: var(--accent-muted1); animation-delay: -10s; opacity: 0.05; }
                @keyframes bg-shape-morph { /* Same as before */ }

                /* Success Message Styling */
                .messageSuccess { z-index: 1001; line-height: 1.5; text-align: center; padding: 1.2rem 1.8rem; background: var(--accent-secondary); color: var(--text-on-accent); position: fixed; left: 50%; top: 15%; transform: translateX(-50%); border-radius: var(--radius-md); box-shadow: var(--shadow-medium); font-family: var(--font-body); font-size: 0.95rem; width: 90%; max-width: 450px; transition: opacity 0.3s ease, transform 0.3s ease; }
                .messageSuccess.hidden { opacity: 0; transform: translateX(-50%) translateY(-20px); pointer-events: none; }
                .messageSuccess.visible { opacity: 1; transform: translateX(-50%) translateY(0); }

            `}</style>
        </div>
    );
};

export default ContactPage;