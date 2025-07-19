// src/app/projects/[category]/ProjectCategoryClient.tsx

"use client";

import React from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { Project } from '@/types/project';
import { ArrowLeft, FolderOpen, Search, Plus, Code, Palette, Brain, Sparkles } from 'lucide-react';

// Import CSS Module
import styles from './ProjectCategory.module.css';

interface ProjectCategoryClientProps {
    category: string;
    projects: Project[];
}

// Helper function to get category icon
const getCategoryIcon = (category: string) => {
    switch (category.toLowerCase()) {
        case 'ai':
        case 'artificial-intelligence':
            return <Brain size={24} />;
        case 'web':
        case 'frontend':
        case 'backend':
            return <Code size={24} />;
        case 'design':
        case 'ui':
        case 'ux':
            return <Palette size={24} />;
        default:
            return <FolderOpen size={24} />;
    }
};

// Helper function to get category description
const getCategoryDescription = (category: string) => {
    switch (category.toLowerCase()) {
        case 'ai':
            return 'Artificial Intelligence projects exploring the frontiers of machine learning, natural language processing, and neural networks.';
        case 'web':
            return 'Web development projects showcasing modern frameworks, responsive design, and cutting-edge user experiences.';
        case 'design':
            return 'Design projects spanning visual identity, user experience, and interface design across digital and physical mediums.';
        default:
            return `Explore our curated collection of ${category.replace(/-/g, ' ')} projects and case studies.`;
    }
};

// Framer Motion Variants
const fadeIn = { 
    hidden: { opacity: 0, y: 20 }, 
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } } 
};

const staggerContainer = { 
    hidden: {}, 
    visible: { transition: { staggerChildren: 0.1, delayChildren: 0.1 } } 
};

const cardHover = { 
    scale: 1.02, 
    y: -4, 
    transition: { type: "spring", stiffness: 300, damping: 20 } 
};

// Empty State SVG Component
const EmptyStateSVG = ({ className = "" }: { className?: string }) => (
    <svg
        viewBox="0 0 200 160"
        xmlns="http://www.w3.org/2000/svg"
        className={`w-full max-w-sm h-auto mx-auto ${className}`}
    >
        <defs>
            <filter id="emptyGlow" x="-20%" y="-20%" width="140%" height="140%">
                <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
                <feMerge>
                    <feMergeNode in="coloredBlur"/>
                    <feMergeNode in="SourceGraphic"/>
                </feMerge>
            </filter>
            <filter id="floatEffect" x="-10%" y="-10%" width="120%" height="120%">
                <feTurbulence type="fractalNoise" baseFrequency="0.01 0.02" numOctaves="2" result="turbulence" seed="42"/>
                <feDisplacementMap in2="turbulence" in="SourceGraphic" scale="1" xChannelSelector="R" yChannelSelector="G"/>
            </filter>
        </defs>

        <style>
            {`
                .empty-float { animation: float 6s ease-in-out infinite; }
                .empty-pulse { animation: pulse 3s ease-in-out infinite; }
                .empty-shimmer { animation: shimmer 4s ease-in-out infinite; }
                @keyframes float {
                    0%, 100% { transform: translateY(0px); }
                    50% { transform: translateY(-10px); }
                }
                @keyframes pulse {
                    0%, 100% { opacity: 0.6; transform: scale(1); }
                    50% { opacity: 1; transform: scale(1.05); }
                }
                @keyframes shimmer {
                    0%, 100% { opacity: 0.4; }
                    50% { opacity: 0.8; }
                }
            `}
        </style>

        {/* Background grid */}
        <g opacity="0.1" filter="url(#floatEffect)">
            {[...Array(8)].map((_, i) => (
                <line key={i} x1={i * 25} y1="0" x2={i * 25} y2="160" stroke="var(--accent-muted1)" strokeWidth="0.5"/>
            ))}
            {[...Array(7)].map((_, i) => (
                <line key={i} x1="0" y1={i * 23} x2="200" y2={i * 23} stroke="var(--accent-muted1)" strokeWidth="0.5"/>
            ))}
        </g>

        {/* Main folder illustration */}
        <g transform="translate(100, 80)" className="empty-float">
            <rect
                x="-30" y="-20" width="60" height="40"
                fill="none"
                stroke="var(--accent-secondary)"
                strokeWidth="2"
                rx="4"
                filter="url(#emptyGlow)"
                className="empty-pulse"
            />
            <path
                d="M-30,-20 L-20,-30 L10,-30 L20,-20"
                fill="none"
                stroke="var(--accent-secondary)"
                strokeWidth="2"
                className="empty-shimmer"
            />
            
            {/* Dotted content lines */}
            <line x1="-20" y1="-10" x2="20" y2="-10" stroke="var(--accent-muted2)" strokeWidth="1" strokeDasharray="2,2" opacity="0.6"/>
            <line x1="-20" y1="-2" x2="15" y2="-2" stroke="var(--accent-muted2)" strokeWidth="1" strokeDasharray="2,2" opacity="0.4"/>
            <line x1="-20" y1="6" x2="10" y2="6" stroke="var(--accent-muted2)" strokeWidth="1" strokeDasharray="2,2" opacity="0.3"/>
        </g>

        {/* Floating elements */}
        <circle cx="60" cy="40" r="3" fill="var(--accent-highlight)" opacity="0.5" className="empty-pulse" style={{animationDelay: '1s'}}/>
        <circle cx="140" cy="120" r="2" fill="var(--accent-primary)" opacity="0.6" className="empty-pulse" style={{animationDelay: '2s'}}/>
        <circle cx="170" cy="50" r="2.5" fill="var(--accent-secondary)" opacity="0.4" className="empty-pulse" style={{animationDelay: '0.5s'}}/>
    </svg>
);

// Main Client Component
export default function ProjectCategoryClient({ category, projects }: ProjectCategoryClientProps) {
    // Format category name for display
    const categoryDisplayName = category.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());

    return (
        <div className={`min-h-screen ${styles.pageWrapper}`}>
            <main className={styles.contentContainer}>
                
                {/* Header Section */}
                <motion.section
                    className={`py-12 md:py-16 lg:py-20 ${styles.headerSection}`}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, amount: 0.2 }}
                    variants={staggerContainer}
                >
                    <div className={styles.headerBackground}>
                        <div className={styles.headerShape1}></div>
                        <div className={styles.headerShape2}></div>
                    </div>
                    
                    <div className="container mx-auto px-4 relative z-10">
                        {/* Back Navigation */}
                        <motion.div variants={fadeIn} className={styles.backNav}>
                            <Link href="/projects" className={styles.backLink}>
                                <ArrowLeft size={16} />
                                <span>All Projects</span>
                            </Link>
                        </motion.div>

                        {/* Category Header */}
                        <motion.div variants={fadeIn} className={styles.categoryHeader}>
                            <div className={styles.categoryIcon}>
                                {getCategoryIcon(category)}
                            </div>
                            <div className={styles.categoryInfo}>
                                <h1 className={styles.categoryTitle}>
                                    {categoryDisplayName}<span className={styles.accentDot}>.</span>
                                </h1>
                                <p className={styles.categoryDescription}>
                                    {getCategoryDescription(category)}
                                </p>
                            </div>
                        </motion.div>
                    </div>
                </motion.section>

                {/* Content Section */}
                <section className={`py-8 md:py-12 lg:py-16 ${styles.contentSection}`}>
                    <div className="container mx-auto px-4">
                        {projects.length > 0 ? (
                            /* Projects Grid */
                            <motion.div
                                className={styles.projectsGrid}
                                initial="hidden"
                                whileInView="visible"
                                viewport={{ once: true, amount: 0.1 }}
                                variants={staggerContainer}
                            >
                                {projects.map((project) => (
                                    <motion.div
                                        key={project.slug}
                                        variants={fadeIn}
                                        whileHover={cardHover}
                                        className={styles.projectCard}
                                    >
                                        <Link href={`/projects/${category}/${project.slug}`} className={styles.projectLink}>
                                            <div className={styles.projectContent}>
                                                <h3 className={styles.projectTitle}>{project.title}</h3>
                                                <p className={styles.projectDescription}>{project.description}</p>
                                                <div className={styles.projectMeta}>
                                                    <span className={styles.projectCategory}>{categoryDisplayName}</span>
                                                    <span className={styles.projectArrow}>→</span>
                                                </div>
                                            </div>
                                        </Link>
                                    </motion.div>
                                ))}
                            </motion.div>
                        ) : (
                            /* Empty State */
                            <motion.div
                                className={styles.emptyState}
                                initial="hidden"
                                whileInView="visible"
                                viewport={{ once: true, amount: 0.3 }}
                                variants={staggerContainer}
                            >
                                <motion.div variants={fadeIn} className={styles.emptyIllustration}>
                                    <EmptyStateSVG />
                                </motion.div>
                                
                                <motion.div variants={fadeIn} className={styles.emptyContent}>
                                    <h2 className={styles.emptyTitle}>
                                        No Projects Yet<span className={styles.accentDot}>.</span>
                                    </h2>
                                    <p className={styles.emptyDescription}>
                                        We&apos;re constantly working on new {categoryDisplayName.toLowerCase()} projects. 
                                        Check back soon or explore our other categories while we craft something amazing.
                                    </p>
                                </motion.div>

                                <motion.div variants={fadeIn} className={styles.emptyActions}>
                                    <Link href="/projects" className={styles.primaryAction}>
                                        <Search size={18} />
                                        Explore All Projects
                                    </Link>
                                    <Link href="/contact" className={styles.secondaryAction}>
                                        <Plus size={18} />
                                        Suggest a Project
                                    </Link>
                                </motion.div>

                                {/* Floating elements for visual interest */}
                                <div className={styles.floatingElements}>
                                    <Sparkles className={styles.sparkle1} size={20} />
                                    <Sparkles className={styles.sparkle2} size={16} />
                                    <Sparkles className={styles.sparkle3} size={14} />
                                </div>
                            </motion.div>
                        )}
                    </div>
                </section>
            </main>
        </div>
    );
}