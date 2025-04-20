// src/components/Footer.tsx
"use client";

import React from "react";
import { usePathname } from "next/navigation";
import { FaGithub, FaInstagram, FaLinkedin, FaTwitter, FaDiscord } from "react-icons/fa";
import Link from "next/link";
import OrnamentalThemeToggle from "../Theme/OrnamentalThemeToggle";

// --- Import the child components ---
import FooterBranding from "./FooterBranding";
import FooterNavigation from "./FooterNavigation"; // Import the navigation component

const Footer = () => {
    const pathname = usePathname();
    const isBlog = pathname.startsWith('/blog'); // You calculate this correctly
    const currentYear = new Date().getFullYear();

    return (
        <footer className={`
            relative overflow-hidden border-t
            py-14 px-6 md:px-16 lg:py-20
            ${isBlog
                ? 'bg-[color:var(--bg-blog-secondary)] border-[color:var(--accent-secondary)] border-opacity-30'
                : 'bg-[color:var(--bg-secondary)] border-[color:var(--bg-tertiary)]'}
            text-[color:var(--text-secondary)]
        `}>
            {/* Background texture */}
            <div className={`
                absolute inset-0 bg-[url('/assets/images/footer-texture.png')] bg-repeat -z-10
                ${isBlog ? 'opacity-[0.03]' : 'opacity-[0.02]'}
            `}></div>

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
                            <a href="https://discord.gg/DzNgXdYm" aria-label="Discord" className={`footer-icon-link no-underline ${isBlog ? 'blog-footer-icon' : ''}`} target="_blank" rel="noopener noreferrer"><FaDiscord /></a>
                            <a href="https://github.com/manicinc" aria-label="GitHub" className={`footer-icon-link no-underline ${isBlog ? 'blog-footer-icon' : ''}`} target="_blank" rel="noopener noreferrer"><FaGithub /></a>
                            <a href="https://www.linkedin.com/company/manic-agency-llc/" aria-label="LinkedIn" className={`footer-icon-link no-underline ${isBlog ? 'blog-footer-icon' : ''}`} target="_blank" rel="noopener noreferrer"><FaLinkedin /></a>
                            <a href="https://x.com/manicagency" aria-label="Twitter" className={`footer-icon-link no-underline ${isBlog ? 'blog-footer-icon' : ''}`} target="_blank" rel="noopener noreferrer"><FaTwitter /></a>
                            <a href="https://instagram.com/manic.agency" aria-label="Instagram" className={`footer-icon-link no-underline ${isBlog ? 'blog-footer-icon' : ''}`} target="_blank" rel="noopener noreferrer"><FaInstagram /></a>
                        </div>

                        {/* Theme Toggle */}
                        <div className="mt-4">
                             <h3 className={`footer-heading mb-2 ${isBlog ? 'blog-footer-heading' : ''}`}>
                                 {isBlog ? 'Reality Mode' : 'Display Mode'}
                             </h3>
                             <OrnamentalThemeToggle size="sm" />
                        </div>
                    </div>
                </div> {/* End Grid */}

                {/* Footer Bottom */}
                <div className={`
                    border-t mt-10 pt-8 text-center
                    ${isBlog
                        ? 'border-[color:var(--accent-secondary)] border-opacity-30'
                        : 'border-[color:var(--bg-tertiary)]'}
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
                .footer-heading {
                    font-family: var(--font-meta-blog);
                    font-size: 0.8rem;
                    font-weight: 700;
                    letter-spacing: 0.05em;
                    text-transform: uppercase;
                    color: var(--accent-highlight);
                    margin-bottom: 1rem;
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