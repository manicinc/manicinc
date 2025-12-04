// src/components/Footer.tsx
"use client";

import React from "react";
import { usePathname } from "next/navigation";
import { Github, Instagram, Linkedin, Twitter, MessageCircle } from "lucide-react";
import Link from "next/link";
import OrnamentalThemeToggle from "../Theme/OrnamentalThemeToggle";
import ThemeToggle from "../Theme/ThemeToggle";

// --- Import the child components ---
import FooterBranding from "./FooterBranding";
import FooterNavigation from "./FooterNavigation"; // Import the navigation component

const Footer = () => {
    const pathname = usePathname();
    const isBlog = pathname.startsWith('/blog'); // You calculate this correctly
    const currentYear = new Date().getFullYear();

    return (
        <footer className={`
            site-footer
            ${isBlog ? 'site-footer--blog' : 'site-footer--default'}
            relative overflow-hidden border-t
            py-14 px-6 md:px-16 lg:py-20
            text-[color:var(--text-secondary)]
        `} style={{ contentVisibility: 'auto', containIntrinsicSize: '0 800px' }}>
            {/* Background texture */}
            <div className="max-w-7xl mx-auto relative z-10">
                {/* Top section Grid - REVISED LAYOUT */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-x-8 gap-y-12 mb-14">

                    {/* Column 1-3: Footer Navigation (spans 3 columns on larger screens) */}
                    <div className="md:col-span-3">
                        {/* --- RENDER FOOTER NAVIGATION COMPONENT --- */}
                        {/* --- Pass the isBlog prop down --- */}
                        <FooterNavigation isBlog={isBlog} />
                        {/* ---------------------------------- */}
                    </div>

                    {/* Column 4: Connect & Theme (spans 1 column) */}
                    <div className="md:col-span-1">
                        <h3 className={`footer-heading ${isBlog ? 'blog-footer-heading' : ''}`}>Connect</h3>
                        {/* Social Icons */}
                        <div className="flex flex-wrap gap-x-5 gap-y-3 text-xl text-[color:var(--text-secondary)] mb-8">
                            <a href="https://discord.gg/DzNgXdYm" aria-label="Discord" className={`footer-icon-link no-underline ${isBlog ? 'blog-footer-icon' : ''}`} target="_blank" rel="noopener noreferrer"><MessageCircle size={20} /></a>
                            <a href="https://github.com/manicinc" aria-label="GitHub" className={`footer-icon-link no-underline ${isBlog ? 'blog-footer-icon' : ''}`} target="_blank" rel="noopener noreferrer"><Github size={20} /></a>
                            <a href="https://www.linkedin.com/company/manic-agency-llc/" aria-label="LinkedIn" className={`footer-icon-link no-underline ${isBlog ? 'blog-footer-icon' : ''}`} target="_blank" rel="noopener noreferrer"><Linkedin size={20} /></a>
                            <a href="https://x.com/manicagency" aria-label="Twitter" className={`footer-icon-link no-underline ${isBlog ? 'blog-footer-icon' : ''}`} target="_blank" rel="noopener noreferrer"><Twitter size={20} /></a>
                            <a href="https://instagram.com/manic.agency" aria-label="Instagram" className={`footer-icon-link no-underline ${isBlog ? 'blog-footer-icon' : ''}`} target="_blank" rel="noopener noreferrer"><Instagram size={20} /></a>
                        </div>

                        {/* Theme Toggle */}
                        <div className="mt-4">
                             <h3 className={`footer-heading mb-2 ${isBlog ? 'blog-footer-heading' : ''}`}>
                                 {isBlog ? 'Reality Mode' : 'Display Mode'}
                             </h3>
                             {isBlog ? 
                             <OrnamentalThemeToggle size="sm" />
                             : <ThemeToggle size="sm"/>}
                        </div>
                    </div>
                </div> {/* End Grid */}

                {/* Footer Bottom */}
                <div className={` 
                    site-footer-bottom
                    ${isBlog ? 'site-footer-bottom--blog' : 'site-footer-bottom--default'}
                    border-t mt-10 pt-8 text-center
                `}>
                    {/* RENDER FOOTER BRANDING COMPONENT */}
                    <FooterBranding />

                    {/* COPYRIGHT TEXT */}
                    <p className={`
                        mt-4 text-xs opacity-70
                        ${isBlog
                            ? 'font-meta-blog text-[color:var(--text-secondary)]'
                            : 'font-meta-blog text-[color:var(--text-muted)]'}
                    `}>
                        © {currentYear} Manic Agency LLC | All Rights Reserved
                    </p>
                </div>
            </div>

            {/* KEEP GLOBAL STYLES */}
            <style jsx global>{`
                .site-footer {
                    position: relative;
                    background:
                        radial-gradient(140% 180% at 50% -20%, rgba(var(--bg-primary-rgb), 0.98), rgba(var(--bg-secondary-rgb), 0.9)),
                        linear-gradient(180deg, rgba(var(--bg-primary-rgb), 0.97) 0%, rgba(var(--bg-secondary-rgb), 0.92) 65%, rgba(var(--bg-tertiary-rgb), 0.88) 100%);
                    background-color: rgba(var(--bg-primary-rgb), 0.97);
                    background-blend-mode: soft-light;
                    border-top: 1px solid rgba(var(--bg-tertiary-rgb), 0.18);
                    box-shadow:
                        inset 0 1px 0 rgba(255, 255, 255, 0.55),
                        0 -18px 32px rgba(var(--shadow-color-rgb), 0.08);
                    backdrop-filter: blur(18px) saturate(120%);
                    -webkit-backdrop-filter: blur(18px) saturate(120%);
                    transition: background 0.4s ease, box-shadow 0.4s ease, border-color 0.4s ease;
                }
                .site-footer--blog {
                    background:
                        radial-gradient(150% 200% at 50% -30%, rgba(var(--bg-blog-paper-rgb), 0.96), rgba(var(--bg-blog-paper-rgb), 0.88)),
                        linear-gradient(182deg, rgba(var(--bg-blog-paper-rgb), 0.94) 0%, rgba(var(--bg-blog-paper-rgb), 0.86) 70%, rgba(var(--bg-blog-paper-rgb), 0.82) 100%);
                    border-top-color: rgba(var(--accent-secondary-rgb), 0.24);
                    box-shadow:
                        inset 0 1px 0 rgba(255, 255, 255, 0.45),
                        0 -16px 28px rgba(var(--accent-secondary-rgb), 0.08);
                }
                .dark .site-footer {
                    background:
                        radial-gradient(160% 220% at 50% -40%, rgba(var(--bg-primary-rgb), 0.16), rgba(var(--bg-secondary-rgb), 0.22)),
                        linear-gradient(185deg, rgba(var(--bg-tertiary-rgb), 0.32) 0%, rgba(var(--bg-tertiary-rgb), 0.18) 70%, rgba(var(--bg-tertiary-rgb), 0.12) 100%);
                    border-top-color: rgba(var(--accent-secondary-rgb), 0.26);
                    box-shadow:
                        inset 0 1px 0 rgba(255, 255, 255, 0.05),
                        0 -16px 30px rgba(0, 0, 0, 0.35);
                }
                .dark .site-footer--blog {
                    background:
                        radial-gradient(160% 220% at 50% -50%, rgba(var(--bg-blog-paper-rgb), 0.22), rgba(var(--bg-blog-paper-rgb), 0.14)),
                        linear-gradient(188deg, rgba(var(--bg-blog-paper-rgb), 0.18) 0%, rgba(var(--bg-blog-paper-rgb), 0.1) 100%);
                    border-top-color: rgba(var(--accent-secondary-rgb), 0.36);
                    box-shadow:
                        inset 0 1px 0 rgba(255, 255, 255, 0.06),
                        0 -18px 32px rgba(0, 0, 0, 0.42);
                }
                .site-footer::before {
                    content: "";
                    position: absolute;
                    inset: 0;
                    background:
                        radial-gradient(120% 140% at 20% 0%, rgba(var(--accent-highlight-rgb), 0.08), transparent 65%),
                        radial-gradient(140% 200% at 80% -20%, rgba(var(--accent-secondary-rgb), 0.06), transparent 70%);
                    pointer-events: none;
                    opacity: 0.9;
                }
                .dark .site-footer::before {
                    opacity: 0.45;
                }
                .site-footer-bottom {
                    border-color: rgba(var(--bg-tertiary-rgb), 0.2);
                }
                .site-footer-bottom--blog {
                    border-color: rgba(var(--accent-secondary-rgb), 0.28);
                }
                .site-footer-bottom--default {
                    border-color: rgba(var(--bg-tertiary-rgb), 0.18);
                }
                .footer-heading {
                    font-family: var(--font-meta-blog);
                    font-size: 0.8rem;
                    font-weight: 700;
                    letter-spacing: 0.05em;
                    text-transform: uppercase;
                    color: var(--accent-highlight);
                    margin-bottom: 0.9rem;
                }
                .blog-footer-heading {
                    color: var(--accent-secondary);
                    font-family: var(--font-heading-blog-orig); /* Or --font-heading-blog */
                    font-size: 0.9rem;
                    letter-spacing: 0.03em;
                }
                .footer-list {
                    list-style: none;
                    padding: 0;
                    margin: 0;
                    /* space-y: 0.6rem; Use Tailwind space-y-* on the ul instead */
                    font-family: var(--font-body);
                    font-size: 0.875rem;
                    opacity: 0.9;
                }
                /* Ensure extra breathing room between heading and links on tight columns */
                .footer-heading + .footer-list { margin-top: 0.4rem; }
                @media (max-width: 640px) {
                    .footer-heading { margin-bottom: 1rem; }
                    .footer-heading + .footer-list { margin-top: 0.6rem; }
                }
                .blog-footer-list {
                    font-family: var(--font-body-blog);
                    font-size: 0.85rem;
                }
                .footer-link, .email-link {
                    color: var(--text-secondary);
                    text-decoration: none !important;
                    transition: color var(--transition-fast);
                    border-bottom: 1px solid transparent;
                    padding-bottom: 2px; /* Add padding for underline space */
                    text-underline-offset: 4px; /* Control underline offset */
                }
                .footer-link:hover, .email-link:hover {
                    color: var(--accent-highlight);
                    border-bottom-color: var(--accent-highlight);
                }
                .blog-footer-link:hover {
                    color: var(--accent-secondary);
                    border-bottom-color: var(--accent-secondary);
                }
                .footer-icon-link {
                    color: var(--text-secondary);
                    transition: color var(--transition-fast), transform var(--transition-fast);
                    text-decoration: none !important;
                    display: inline-block;
                }
                .footer-icon-link:hover {
                    color: var(--accent-primary);
                    transform: scale(1.15) rotate(-5deg);
                }
                .blog-footer-icon:hover {
                    color: var(--accent-secondary);
                    transform: scale(1.15) rotate(5deg);
                }
                /* Keep animation if needed */
                @keyframes subtlePulse { /* ... */ }
                .animate-subtle-pulse { /* ... */ }
            `}</style>
        </footer>
    );
};

export default Footer;