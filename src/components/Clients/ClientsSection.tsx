// src/components/Clients/ClientsSection.tsx
"use client";

import React from 'react'; // Only React is needed now
import Image, { StaticImageData } from 'next/image';
import Link from 'next/link';
// Use lazy-loaded motion for better performance
import { motion } from '@/components/LazyMotion';
import { Building } from 'lucide-react'; // Fallback icon

// Import CSS Module - ENSURE THIS PATH IS CORRECT and CSS is up-to-date
import styles from './ClientsSection.module.css';

// --- DATA ---
interface Client {
  name: string;
  logo?: React.FC<{ className?: string }> | StaticImageData | string;
  link?: string; // Optional website link
}

// Example Placeholder Logo (replace or remove if not needed)
const PlaceholderLogo: React.FC<{ className?: string }> = ({ className }) => ( <Building className={`${className} ${styles.fallbackIcon}`} strokeWidth={1} /> );

// Data included directly
const clientsData: Client[] = [
  { name: 'Edelman', logo: PlaceholderLogo, link: 'https://www.edelman.com/' },
  { name: 'Hereafterlegacy.ai', logo: PlaceholderLogo, link: 'https://hereafterlegacy.ai/' },
  { name: 'Grapple Media', logo: undefined },
  { name: 'NuBloom NFTs', logo: PlaceholderLogo, link: "https://opensea.io/collection/nubloomfractal" },
  { name: 'Smurf Finance', logo: PlaceholderLogo, link: 'https://smurf.finance' },
  { name: 'Notebrush', logo: PlaceholderLogo, link: "https://notebrush.com" },
];
// --- END DATA ---

// --- Framer Motion Variants ---
const fadeIn = { hidden: { opacity: 0, y: 8 }, visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } } };
const staggerContainer = { hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.06, delayChildren: 0.1 } } };

// --- Main Component ---
export default function ClientsSection() {
    return (
        <section
            className={`py-12 md:py-16 lg:py-20 relative overflow-hidden ${styles.sectionWrapper}`} // Use styles from module
            style={{ backgroundColor: 'var(--bg-secondary)' }} // Use theme variable
        >
            {/* Background effects */}
            <div className="absolute inset-0 z-0 opacity-[0.04]">
                <div className="absolute top-[10%] left-[10%] w-72 h-72 bg-[--accent-primary] rounded-full filter blur-3xl animate-pulse"></div>
                <div className="absolute bottom-[10%] right-[10%] w-80 h-80 bg-[--accent-secondary] rounded-full filter blur-3xl animate-pulse animation-delay-2000"></div>
            </div>

            {/* Inner div for layout constraints - Standard Tailwind Container */}
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <motion.p // Changed to <p> with styles.heading
                    className={styles.heading}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, amount: 0.3 }}
                    variants={fadeIn}
                >
                    We've worked with these innovative companies and thoughtleaders:
                </motion.p>

                <motion.ul
                    role="list"
                    className={styles.clientGrid}
                    variants={staggerContainer}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, amount: 0.1 }}
                >
                    {clientsData.map((client) => {
                        const LogoComponent = typeof client.logo === 'function' ? client.logo : null;
                        const logoSrc = typeof client.logo === 'string' || (typeof client.logo === 'object' && client.logo && 'src' in client.logo) ? client.logo : null;
                        const hasLogo = LogoComponent || logoSrc;

                        // Define the card content once
                        const cardContent = (
                            <>
                                {/* CONDITIONAL LOGO RENDERING - NO PLACEHOLDER */}
                                {hasLogo && (
                                    <div className={styles.logoContainer}>
                                        {LogoComponent ? (
                                            <LogoComponent className={styles.clientLogo} />
                                        ) : logoSrc ? (
                                            <Image
                                                src={logoSrc} alt={`${client.name} logo`}
                                                className={styles.clientLogo}
                                                width={100} height={40} unoptimized
                                                loading="lazy" decoding="async"
                                                sizes="100px"
                                            />
                                        ) : null} {/* Render nothing if !hasLogo */}
                                    </div>
                                )}
                                <p className={styles.clientName}>
                                    {client.name}
                                </p>
                            </>
                        );

                        return (
                            <motion.li
                                key={client.name}
                                className={styles.clientItemWrapper}
                                variants={fadeIn}
                            >
                                {/* *** FIXED CONDITIONAL RENDERING *** */}
                                {client.link ? (
                                    // --- Render as LINK ---
                                    // Use legacyBehavior + passHref with explicit <a> for robust styling/props
                                    <Link href={client.link} passHref legacyBehavior prefetch={false}>
                                        <a
                                            className={styles.clientCard} // Apply card styles to anchor
                                            target="_blank"
                                            rel="noopener noreferrer"
                                        >
                                            {cardContent}
                                        </a>
                                    </Link>
                                ) : (
                                    // --- Render as DIV ---
                                    <div className={styles.clientCard}> {/* Apply card styles to div */}
                                        {cardContent}
                                    </div>
                                )}
                                {/* *** END FIX *** */}
                            </motion.li>
                        );
                    })}
                </motion.ul>
            </div>
        </section>
    );
}