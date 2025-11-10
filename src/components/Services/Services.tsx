// src/components/Services.tsx
"use client";
import React, { useState, useRef, useEffect } from "react";
import Image, { StaticImageData } from "next/image";
import Link from 'next/link';
import { motion, useInView } from "framer-motion";
import { MoveRight, Clock } from 'lucide-react'; // Using Clock for stopwatch base

// Import styles and other components
import styles from './Services.module.css'; // Ensure path is correct
import ClientsSection from "../Clients/ClientsSection"; // Ensure path is correct


import curve from "@/images/curve.png";

// Import Animated Icons
import IconDev from '../icons/IconDev';
import IconTech from '../icons/IconTech';
import IconDesign from '../icons/IconDesign';
import IconMarketing from '../icons/IconMarketing';
import IconData from '../icons/IconData';
import IconSimulation from '../icons/IconSimulation';



// --- TEMP PLACEHOLDERS FOR MISSING ICONS ---
const IconPlaceholder: React.FC<{ isActive: boolean; className?: string }> = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"></circle></svg>
);

interface Service {
  id: number; // Add unique ID
  title: string;
  IconComponent: React.FC<{ isActive: boolean; className?: string }>; // Use component type
  description: string;
  features: string[];
}

// Define services with IDs and Icon Components
const servicesData: Service[] = [
  {
    id: 1,
    title: "Open-Source Innovation & AI Infrastructure",
    IconComponent: IconSimulation, // Use created component
    description:
      "Through Frame.dev and Framers AI, we build emergent, adaptive AI systems. We denoise the web and create permanent AI agency through open-source tools.",
    features: [
      "Frame.dev ecosystem: VCA, AgentOS, OpenStrand, and emerging OS platforms",
      "Voice Chat Assistant for natural language coding",
      "AgentOS orchestration runtime for intelligent AI applications",
      "OpenStrand collaborative knowledge management",
      "HomeOS, WebOS, SafeOS, MyOS, WorkOS (in development)"
    ],
},
 {
   id: 2,
   title: "Development and deployments on every platform",
   IconComponent: IconDev,
   description:
     "Each of our devs is full-stack with at least one specialization, e.g. frontend, SEO, mobile, VR / AR, deep learning, databases, web scraping, smart contracts, devops.",
   features: [
     "Cross-platform mobile app and web development",
     "Machine learning, data analytics, deep learning, and generative AI expertise",
     "Cloud infrastructure, DevOps automations, and CI / CD pipelines",
     "Security auditing and penetration testing"
   ],
 },
 {
   id: 3,
   title: "Innovative & Emergent Tech",
   IconComponent: IconTech,
   description:
     "We rely on battle-tested tech, continually keep up-to-date with trends and research in fields poised to shift paradigms. Demand and innovation are bidirectional.",
   features: [
     "ML, AI, LLMs / GenAI",
     "Web3 & blockchain solutions",
     "Mixed reality experiences",
     "Metaverses development",
     "IoT ecosystems",
     "Robotics and hardware protoyping",
   ],
 },
 {
   id: 4,
   title: "Designs with clarity and artistry",
   IconComponent: IconDesign, // Use created component
   description:
     "Our branding and UI / UX skills are unparalleled, as we employ true artists with a passion for their craft. We focus on humanistic-centric design and aim for simplicity.",
   features: [
      "Visual design systems with atomic component libraries",
      "Animated graphics and motion designs with custom scripts",
      "Hardware UX and rapid prototyping for physical interfaces",
      "End-to-end game design from narrative to mechanics to graphics",
      "Figma-based pipelines with collaborative dev handoffs",
   ],
 },
  {
   id: 5,
   title: "Creative & Results-Oriented Marketing",
   IconComponent: IconMarketing, // Use created component
   description:
     "Growth hacking and going viral come naturally for us. Our in-house tools for social media analytics and brand monitoring aid us in bringing campaigns and user acquisition to the next level.",
   features: [
     "Textual and visual and auditory content creations",
     "Social media management with automated posts",
     "Performance analytics across all spectrums & mediums",
     "SEO auditing and custom management solutions"
   ],
 },
 {
   id: 6,
   title: "Data Intelligence & Analytics",
   IconComponent: IconData, // Use created component
   description:
     "We transform raw data into actionable insights through visualization and predictive modeling, from traditional datasets to behavioral analytics in virtual environments / simulations.",
   features: [
     "Behavioral analytics in XR",
     "Real-time data visualization",
     "Predictive user modeling",
     "Cross-platform attribution",
     "Engagement & retention metrics",
     "Complex, scalable ETL data pipelines",
     "Architecting and managing data warehouses, lakehouses"
   ],
 }
];


interface StylizedStopwatchProps {
  text: string;
  // No dark mode prop needed if relying on parent CSS class like body.dark
}

const StylizedStopwatchInternal: React.FC<StylizedStopwatchProps> = ({ text }) => {
  const midPoint = Math.ceil(text.length / 2);
  const textPart1 = text.substring(0, midPoint);
  const textPart2 = text.substring(midPoint);

  // --- Radii and Constants ---
  const centerX = 32;
  const centerY = 32;
  const outerRadius = 28;
  const faceRadius = 24;
  // Adjusted Radii for LAGER text:
  const numeralRadius = faceRadius - 7; // Further inward for bigger numerals
  const textPathRadius = outerRadius - 3; // Slightly further out on bezel for bigger text

  const textCirclePathData = `
    M ${centerX - textPathRadius}, ${centerY}
    a ${textPathRadius},${textPathRadius} 0 1,1 ${textPathRadius * 2},0
    a ${textPathRadius},${textPathRadius} 0 1,1 -${textPathRadius * 2},0
  `;

  // --- Roman Numerals ---
  const numerals = ['XII', 'I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X', 'XI'];
  const numeralElements = numerals.map((numeral, index) => {
    const angleDeg = (index / 12) * 360 - 90;
    const angleRad = angleDeg * (Math.PI / 180);
    // Fix hydration issues by rounding coordinates to avoid floating point precision differences
    const x = Math.round((centerX + numeralRadius * Math.cos(angleRad)) * 100) / 100;
    const y = Math.round((centerY + numeralRadius * Math.sin(angleRad)) * 100) / 100;

    return (
      <text
        key={numeral}
        x={x}
        y={y}
        // Use CSS variable for color
        fill="var(--stopwatch-numeral-color)"
        fontSize="5.5" // Increased size
        fontFamily="'Times New Roman', Times, serif"
        fontWeight="bold"
        textAnchor="middle"
        dominantBaseline="middle"
        className="stopwatch-numeral" // Add class for easier CSS targeting
      >
        {numeral}
      </text>
    );
  });

  return (
    <motion.div
        className="stopwatch-wrapper" // Apply base jitter and intermittent glitch here
        initial={{ opacity: 0, scale: 0.5 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, delay: 0.5, ease: "backOut" }}
    >
      {/* Apply base jitter animation to the SVG */}
      <svg
        viewBox="0 0 64 64"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="stopwatch-svg-base-jitter w-full h-full"
        // Overflow visible to see the waves expanding beyond the viewbox
        style={{ overflow: 'visible' }}
      >
        <defs>
          {/* --- Gradients (Can remain fixed unless you want them dark mode specific) --- */}
          <linearGradient id="goldGradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" style={{stopColor: '#FDE047', stopOpacity: 1}} />
            <stop offset="50%" style={{stopColor: '#EAB308', stopOpacity: 1}} />
            <stop offset="100%" style={{stopColor: '#B45309', stopOpacity: 1}} />
          </linearGradient>
          <radialGradient id="faceGradientLight" cx="50%" cy="50%" r="50%" fx="50%" fy="50%">
            <stop offset="0%" style={{stopColor: '#FFFBEB', stopOpacity: 1}} />
            <stop offset="80%" style={{stopColor: '#FEF3C7', stopOpacity: 1}} />
            <stop offset="100%" style={{stopColor: '#FDE68A', stopOpacity: 0.8}} />
           </radialGradient>
           {/* Simple dark face gradient/color can be defined via CSS variable */}
           <linearGradient id="darkGoldGradient" x1="0%" y1="0%" x2="0%" y2="100%">
             <stop offset="0%" style={{stopColor: '#CA8A04'}} />
             <stop offset="100%" style={{stopColor: '#854D0E'}} />
           </linearGradient>
           <radialGradient id="jewelGradient" cx="50%" cy="25%" r="65%">
                <stop offset="0%" stopColor="#F87171" />
                <stop offset="60%" stopColor="#DC2626" />
                <stop offset="100%" stopColor="#7F1D1D" />
            </radialGradient>

           {/* --- Paths --- */}
           <path id="textCirclePath" d={textCirclePathData} fill="none" />
        </defs>

        {/* === ALARM WAVE / SPURT EFFECT ELEMENTS === */}
        {/* Group for the waves */}
        <g className="alarm-wave-group">
            {/* Create 3 concentric circles for the wave effect */}
            {[0, 1, 2].map(i => (
                 <circle
                    key={`wave-${i}`}
                    cx={centerX} cy={centerY} r={outerRadius} // Start at bezel size
                    fill="none"
                    // Stroke color from CSS variable
                    stroke="var(--stopwatch-wave-color)"
                    // Opacity, stroke-width, scale controlled by animation
                    opacity="0"
                    strokeWidth="3" // Initial thick stroke
                    className="alarm-wave-circle"
                    // Stagger the animation start for each circle
                    style={{ animationDelay: `${i * 0.15}s` }}
                 />
            ))}
        </g>

        {/* --- Base Stopwatch Elements --- */}
        <g className="stopwatch-body">
            {/* Outer Bezel */}
            <circle cx={centerX} cy={centerY} r={outerRadius} fill="url(#goldGradient)" stroke="#78350F" strokeWidth="2.5" />
            <circle cx={centerX} cy={centerY} r={outerRadius - 1.5} fill="none" stroke="#EAB308" strokeWidth="0.4" opacity="0.7" />

            {/* Inner Face - Use CSS variable for fill */}
            <circle cx={centerX} cy={centerY} r={faceRadius} fill="var(--stopwatch-face-bg)" stroke="var(--stopwatch-tick-color)" strokeWidth="0.75" />

            {/* Top Knob & Loop */}
            <path d="M 30 6 Q 32 3 34 6 L 35 9 L 29 9 L 30 6 Z" fill="url(#goldGradient)" stroke="#854D0E" strokeWidth="1" />
            <circle cx="32" cy="3" r="2.5" stroke="url(#goldGradient)" strokeWidth="1.2" fill="none" />

            {/* Minute Tick Marks */}
             {Array.from({ length: 60 }).map((_, index) => {
                 if (index % 5 === 0) return null;
                 const angleDeg = (index / 60) * 360 - 90; const angleRad = angleDeg * (Math.PI / 180);
                 const startRadius = faceRadius - 1; const endRadius = faceRadius - 2.5;
                 // Fix hydration issues by rounding coordinates to avoid floating point precision differences
                 const x1 = Math.round((centerX + startRadius * Math.cos(angleRad)) * 100) / 100; 
                 const y1 = Math.round((centerY + startRadius * Math.sin(angleRad)) * 100) / 100;
                 const x2 = Math.round((centerX + endRadius * Math.cos(angleRad)) * 100) / 100; 
                 const y2 = Math.round((centerY + endRadius * Math.sin(angleRad)) * 100) / 100;
                 return <line key={`minute-${index}`} x1={x1} y1={y1} x2={x2} y2={y2} stroke="var(--stopwatch-tick-color)" strokeWidth="0.6" opacity="0.6" />;
             })}

            {/* ROMAN NUMERALS */}
            {numeralElements}

            {/* Mirrored Text Around Bezel */}
            <text className="stopwatch-text-bezel" dy="-1.5" > {/* Adjusted dy */}
              <textPath href="#textCirclePath" startOffset="25%" textAnchor="middle"> {textPart1} </textPath>
            </text>
            <text className="stopwatch-text-bezel" dy="4.5" > {/* Adjusted dy */}
              <textPath href="#textCirclePath" startOffset="75%" textAnchor="middle"> {textPart2} </textPath>
            </text>

            {/* ROTATING HAND */}
             <path d={` M ${centerX}, ${centerY + 2} L ${centerX - 0.8}, ${centerY + 0.5} L ${centerX - 0.4}, ${centerY - 2} L ${centerX}, ${centerY - (faceRadius + 2)} L ${centerX + 0.4}, ${centerY - 2} L ${centerX + 0.8}, ${centerY + 0.5} Z `}
                fill="url(#darkGoldGradient)" stroke="#3A1E00" strokeWidth="0.3" className="stopwatch-hand-rotate" />

            {/* Center Pin */}
            <circle cx={centerX} cy={centerY} r="2.5" fill="#B45309" />
            <circle cx={centerX} cy={centerY} r="1.5" fill="url(#jewelGradient)" stroke="var(--stopwatch-wave-color)" strokeWidth="0.3"/>
        </g>

      </svg>

      {/* --- Style JSX Block --- */}
      <style jsx>{`
        /* --- CSS Variables --- */
        :global(:root) {
            /* Light Mode Defaults */
            --stopwatch-face-bg: url(#faceGradientLight);
            --stopwatch-numeral-color: #452A08; /* Dark Brown */
            --stopwatch-tick-color: #A16207; /* Dark Yellow */
            --stopwatch-bezel-text-color: #FFFBEB; /* Light Cream */
            --stopwatch-bezel-text-shadow: 0px 1px 2px rgba(0, 0, 0, 0.7);
            --stopwatch-wave-color: #DC2626; /* Red Jewel Color */
        }

        :global(body.dark) {
            /* Dark Mode Overrides */
            --stopwatch-face-bg: #1f2937; /* Dark Gray */
            --stopwatch-numeral-color: #EAEAEA; /* Off White */
            --stopwatch-tick-color: #9CA3AF; /* Medium Gray */
            --stopwatch-bezel-text-color: #FEF3C7; /* Light Gold/Cream */
             /* Keep dark shadow for light text */
            --stopwatch-bezel-text-shadow: 0px 1px 2px rgba(0, 0, 0, 0.8);
            --stopwatch-wave-color: #F87171; /* Lighter Red */
        }

        /* --- Base Wrapper & SVG --- */
        .stopwatch-wrapper {
            position: absolute;
            top: 50%; left: 50%;
            transform: translate(-50%, -50%);
            width: 144px; height: 144px;
            z-index: 5;
            filter: drop-shadow(0 3px 6px rgba(0, 0, 0, 0.3));

            /* Apply intermittent glitch animation */
            animation: alarmGlitch 15s infinite ease-in-out;
        }

        .stopwatch-svg-base-jitter {
             /* Apply continuous base jitter */
             animation: stopwatchJitter 8s infinite steps(8, jump-none);
             transform-origin: center;
        }

        /* --- Text Styling --- */
        .stopwatch-numeral {
             /* Styles set via attributes, color via variable */
             /* Consider adding transition for color changes */
             transition: fill 0.3s ease;
        }
        .stopwatch-text-bezel {
            font-size: 4.8px; /* Increased bezel text size */
            font-family: 'Georgia', serif;
            font-weight: normal;
            letter-spacing: 0.6px; /* Slightly reduced spacing for bigger font */
            fill: var(--stopwatch-bezel-text-color);
            text-shadow: var(--stopwatch-bezel-text-shadow);
            transition: fill 0.3s ease, text-shadow 0.3s ease;
        }

        /* --- Hand Rotation --- */
        @keyframes rotateHand {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .stopwatch-hand-rotate {
            transform-origin: ${centerX}px ${centerY}px;
            animation: rotateHand 60s linear infinite;
        }

        /* --- Base Jitter Animation --- */
        @keyframes stopwatchJitter {
            0%, 100% { transform: rotate(0deg) scale(1); }
            /* (Previous subtle jitter keyframes) */
           10% { transform: rotate(-1.2deg) scale(1.005); }
           25% { transform: rotate(1.5deg) scale(0.995); }
           40% { transform: rotate(-1.8deg) scale(1); }
           55% { transform: rotate(0.8deg) scale(1.01); }
           70% { transform: rotate(-0.8deg) scale(0.99); }
           85% { transform: rotate(1.6deg) scale(1); }
        }

        /* === Intermittent Glitch & Wave Animations === */

        /* 1. Glitch Animation for the Wrapper */
        @keyframes alarmGlitch {
            0%, 85%, 100% { /* Normal state for most of the time */
                 transform: translate(-50%, -50%) rotate(0deg);
                 filter: drop-shadow(0 3px 6px rgba(0, 0, 0, 0.3)) brightness(1);
            }
            /* Glitch period between 85% and 95% */
            86% { transform: translate(-51%, -49%) rotate(-3deg); filter: brightness(1.1); }
            88% { transform: translate(-49%, -51%) rotate(4deg); }
            90% { transform: translate(-50%, -52%) rotate(-2deg); filter: brightness(1.2); }
            92% { transform: translate(-52%, -50%) rotate(5deg); }
            94% { transform: translate(-49%, -49%) rotate(-1deg); filter: brightness(1); }
        }

         /* 2. Wave/Spurt Animation for the Circles */
         @keyframes alarmWave {
            0%, 85%, 100% { /* Hidden most of the time */
                opacity: 0;
                transform: scale(0.9); /* Start slightly smaller than bezel */
                stroke-width: 3;
            }
             /* Wave appears and expands during glitch period */
            86% {
                 opacity: 0.6;
                 transform: scale(1.0);
                 stroke-width: 3;
            }
            95% { /* Fully expanded and faded */
                opacity: 0;
                transform: scale(1.6); /* Expand outwards */
                stroke-width: 0.5; /* Dissipate */
            }
         }

         .alarm-wave-circle {
            transform-origin: center center;
            /* Run wave animation with the same long duration */
            animation: alarmWave 15s infinite ease-out;
            /* Individual delays are set inline */
         }

      `}</style>
    </motion.div>
  );
};


// --- Main Services Component ---
const Services: React.FC = () => {
  const [activeCardIndex, setActiveCardIndex] = useState<number>(0);
  const [isHoveringGrid, setIsHoveringGrid] = useState<boolean>(false);
  const gridLeaveTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [hoveredCardIndex, setHoveredCardIndex] = useState<number | null>(null);
  const sectionRef = useRef(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const rotationWrapperRef = useRef<HTMLDivElement | null>(null);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);
  const isInView = useInView(sectionRef, { once: true, margin: "-10% 0px" });

  useEffect(() => { // Grid leave handler
      if (gridLeaveTimeoutRef.current) clearTimeout(gridLeaveTimeoutRef.current);
      if (!isHoveringGrid) {
          gridLeaveTimeoutRef.current = setTimeout(() => {
              setActiveCardIndex(0);
          } , 100);
      }
      return () => { if (gridLeaveTimeoutRef.current) clearTimeout(gridLeaveTimeoutRef.current); };
  }, [isHoveringGrid]);

  const handleGridMouseEnter = () => { setIsHoveringGrid(true); if (gridLeaveTimeoutRef.current) clearTimeout(gridLeaveTimeoutRef.current); };
  const handleGridMouseLeave = () => { setIsHoveringGrid(false); setHoveredCardIndex(null); };
  const handleCardMouseEnter = (index: number) => { setActiveCardIndex(index); setHoveredCardIndex(index); };
  const handleCardMouseMove = (e: React.MouseEvent<HTMLDivElement>, index: number) => { /* ... (keep existing mouse light logic) ... */ };

  const sentenceVariant = {
    hidden: { opacity: 1 }, // Parent doesn't need fade for children trigger
    visible: {
        opacity: 1,
        transition: {
            delay: 0.6, // Delay after container appears
            staggerChildren: 0.05, // Stagger each word/space
        },
    },
    hover: { // Trigger children's hover variant
        transition: {
            staggerChildren: 0.04 // Stagger hover effect
        }
    }
  };

  const wordVariant = {
    hidden: { opacity: 0, y: 8, filter: 'blur(1px)' }, // Start state
    visible: { opacity: 1, y: 0, filter: 'blur(0px)', transition: { type: 'spring', damping: 14, stiffness: 100 } }, // Entrance
    hover: { // Hover state for individual words
        y: [0, -4, 0],
        rotate: [-1.5, 1.5, 0],
        scale: [1, 1.03, 1],
        color: 'var(--accent-highlight)', // Example color change on word hover
        transition: { duration: 0.35, ease: "backInOut" }
    },
    tap: { // Tap effect for word
        scale: 0.97
    }
  };

  // Arrow variant tied to parent hover
  const arrowVariant = {
        initial: { x: 0, rotate: 0, scale: 1, color: 'var(--accent-primary)' },
        hover: { x: 10, rotate: 15, scale: 1.15, color: 'var(--brand-cyan)' } // Use different color for arrow
  };

  const ctaText = "Peek Behind the Curtain: Explore Our Process".split(/(\s+)/); // Split text into words and spaces


  const fadeIn = { hidden: { opacity: 0, y: 8 }, visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } } };
  const staggerContainer = { hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.07, delayChildren: 0.1 } } }; // Slightly faster stagger

  return (
      <section
          ref={sectionRef}
          className={`relative py-6 md:py-8 overflow-hidden ${styles.servicesSection}`}
          style={{ backgroundColor: 'var(--color-space-purple)' }} // Use CSS var
          id="services"
      >
          {/* Background elements */}
          <div className={`absolute inset-0 ${styles.sectionBackground}`}>
              {/* ... (keep gridOverlay, glowEffect, starsContainer) ... */}
          </div>

          <div className="container mx-auto px-4 relative z-10">
              {/* Heading Section */}
              <div className="text-center mb-10 md:mb-12">
                  {/* Container for circular heading and stopwatch */}
                  <div ref={headingRef} className={styles.circularHeadingContainer}>
                      {/* Stopwatch SVG */}
                      <StylizedStopwatchInternal text="fall down the rabbit hole.."/>
                      {/* Placeholder text span (removed by useEffect) */}
                      {/* <span className={`opacity-0 ${styles.placeholderTextSpan}`}>fall down the rabbit hole</span> */}
                      {/* The rotator div is appended here by the useEffect */}
                  </div>
              </div>

               {/* Decorative Curve Image */}
             {/* "With Us" Text and Decorative Curve Section */}
            <motion.div
              className="container relative mx-auto text-center mt-2 md:mt-0 px-4" // Added vertical margin (mt) and horizontal padding (px)
              initial={{ opacity: 0, y: 25 }} // Start invisible and slightly down
              animate={{ opacity: 1, y: 0 }}  // Fade in and slide up
              transition={{
                duration: 0.7, // Control animation speed
                delay: 0.9,    // Start slightly after the stopwatch finishes appearing (adjust as needed)
                ease: "easeOut" // Smoother easing
              }}
            >
              {/* Text Styling */}
              <p className="
                mx-auto
                text-center
                text-lg md:text-xl
                font-serif
                text-amber-800
                dark:text-amber-200
                tracking-wider
                mb-0
              ">
                with us...
              </p>

              {/* Decorative Curve Image */}
              <Image
                src={curve}
                alt="decorative element"
                className="
                  w-20 md:w-24            // Slightly adjusted size
                  mx-auto                 // Center the image
                  mt-[-8px] md:mt-[-10px] // Fine-tuned negative margin for overlap
                  opacity-65              // Slightly adjusted opacity
                  dark:opacity-50         // Different opacity for dark mode?
                "
                // Consider adding width/height if not automatically inferred by Next.js
                // width={100} // example
                // height={30} // example
              />
            </motion.div>
              {/* Desktop Services Grid */}
              <div
                  className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-5 mt-8 md:mt-10" // Added margin top
                  onMouseEnter={handleGridMouseEnter}
                  onMouseLeave={handleGridMouseLeave}
              >
                 {servicesData.map((service, index) => {
                      const isActive = activeCardIndex === index;
                      const IconComp = service.IconComponent;
                      

                      return (
                          <motion.div
                              key={service.id}
                              ref={(el: HTMLDivElement | null) => (cardRefs.current[index] = el)}
                              initial={{ opacity: 0, y: 25 }} whileInView={{ opacity: 1, y: 0 }}
                              transition={{ duration: 0.4, delay: index * 0.06 + 0.15 }}
                              viewport={{ once: true, margin: "-40px" }}
                              className={`${styles.serviceCard} ${isActive ? styles.active : ''} rounded-lg p-4 lg:p-5 flex flex-col text-center`}
                              onMouseEnter={() => handleCardMouseEnter(index)}
                              onMouseMove={(e: React.MouseEvent<HTMLDivElement>) => handleCardMouseMove(e, index)}
                          >
                              {/* ... (keep existing card structure: bgImageHover, mouseLightEffect) ... */}

                              {/* Card Content */}
                              <div className="relative z-10 flex flex-col flex-grow">
                                   {/* ... (keep IconWrapper, h3 title) ... */}
                                  <div className={`${styles.iconWrapper} text-[--accent-primary] mx-auto mb-2`}>
                                      <IconComp isActive={isActive} className="h-8 w-8 lg:h-9 lg:w-9" />
                                  </div>
                                  <h3 className="text-sm lg:text-base font-semibold text-[--text-primary] font-display mb-1.5 leading-tight">
                                      {service.title}
                                  </h3>

                                  {/* Description Decrypt Area */}
                                  <div className={styles.descriptionWrapper} style={{ minHeight: '105px' }}> {/* Keep min-height */}
                                      <p className={styles.encryptedText}>{service.description}</p>
                                      <p className={styles.decryptedText}>{service.description}</p>
                                  </div>

                                  {/* Feature List */}
                                  <ul className={`space-y-1 text-left mt-auto ${styles.featureList}`}>
                                       {/* ... (keep feature mapping logic) ... */}
                                      {service.features.map((feature, idx) => (
                                          <li key={idx} className={styles.featureItem}>
                                              <span className={styles.featureDot}></span>
                                              <span>{feature}</span>
                                          </li>
                                      ))}
                                  </ul>
                              </div>
                          </motion.div>
                      );
                  })}
              </div>


        {/* --- REVISED ORNATE HOLOGRAPHIC/GLITCH CTA SECTION --- */}
        <motion.section
            className={styles.ctaSection} // Base section class
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.1 }} // Faster delay
            viewport={{ once: true, amount: 0.2 }}
        >
            {/* Wrapper for positioning link and hover trigger area */}
            <div className={styles.ctaWrapper}>

                {/* --- Inline SVG Decorations - Constantly Visible & Animated by CSS --- */}
                {/* Replace path 'd' with actual intricate vine/flourish data */}
                 {/* Make sure these SVGs have stroke defined or inherit via 'currentColor' */}
                 <svg className={`${styles.ctaDecoration} ${styles.ctaDecorationTL}`} width="100" height="80" viewBox="0 0 100 80" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M98 78 C 70 80, 50 60, 40 40 C 30 20, 10 25, 2 8 M40 40 C 30 50, 15 65, 2 78 M40 40 C 50 50, 65 65, 78 78" stroke="currentColor" strokeWidth="1" strokeLinecap="round"/>
                    <circle cx="2" cy="8" r="2" fill="currentColor" opacity="0.7"/>
                 </svg>
                 <svg className={`${styles.ctaDecoration} ${styles.ctaDecorationTR}`} width="100" height="80" viewBox="0 0 100 80" fill="none" xmlns="http://www.w3.org/2000/svg">
                     <path d="M98 78 C 70 80, 50 60, 40 40 C 30 20, 10 25, 2 8 M40 40 C 30 50, 15 65, 2 78 M40 40 C 50 50, 65 65, 78 78" stroke="currentColor" strokeWidth="1" strokeLinecap="round"/>
                     <circle cx="2" cy="8" r="2" fill="currentColor" opacity="0.7"/>
                </svg>
                 <svg className={`${styles.ctaDecoration} ${styles.ctaDecorationBL}`} width="90" height="70" viewBox="0 0 90 70" fill="none" xmlns="http://www.w3.org/2000/svg">
                     <path d="M2 2 C 20 -5, 40 10, 50 30 C 60 50, 80 45, 88 62 M50 30 C 40 20, 25 5, 2 2 M50 30 C 60 20, 75 5, 88 2" stroke="currentColor" strokeWidth="1" strokeLinecap="round"/>
                     <circle cx="88" cy="62" r="2" fill="currentColor" opacity="0.7"/>
                 </svg>
                 <svg className={`${styles.ctaDecoration} ${styles.ctaDecorationBR}`} width="90" height="70" viewBox="0 0 90 70" fill="none" xmlns="http://www.w3.org/2000/svg">
                     <path d="M2 2 C 20 -5, 40 10, 50 30 C 60 50, 80 45, 88 62 M50 30 C 40 20, 25 5, 2 2 M50 30 C 60 20, 75 5, 88 2" stroke="currentColor" strokeWidth="1" strokeLinecap="round"/>
                     <circle cx="88" cy="62" r="2" fill="currentColor" opacity="0.7"/>
                </svg>
                {/* Add Mid Left/Right if desired */}
                {/* --- End Decorations --- */}

                {/* Link container with entrance animation */}
                 <motion.div
                    className="relative z-10" // Text above decorations
                    variants={sentenceVariant}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, amount: 0.6 }}
                 >
                     <Link href="/process" legacyBehavior>
                         <motion.a
                            className={styles.ornateLink} // Apply main link style
                            whileTap={{ scale: 0.98 }} // Keep tap effect
                            transition={{ duration: 0.15 }}
                         >
                             {/* Text Span with glitch/shimmer wrapper */}
                             <span className={styles.ctaTextWrapper} data-text="Peek Behind the Curtain: Explore Our Process">
                                 {/* Inner span for base color/animation */}
                                 <span className={styles.ctaTextAnimated}>
                                     Peek Behind the Curtain: Explore Our Process
                                 </span>
                             </span>
                             {/* Arrow Span */}
                             <span className={styles.ctaArrow}>
                                 <MoveRight strokeWidth={2.5} />
                             </span>
                         </motion.a>
                     </Link>
                 </motion.div>
            </div>
        </motion.section>
        {/* --- END REVISED CTA SECTION --- */}
        {/* --- END REVISED CTA BANNER SECTION --- */}
              {/* --- WRAPPED Clients Section --- */}
              <motion.section
                  // Use a variant or inline animation props for slow reveal
                  initial="hidden" // Use the existing fadeIn variant name
                  whileInView="visible"
                  viewport={{ once: true, amount: 0.1 }} // Trigger early
                  transition={{ duration: 0.9, delay: 0.2, ease: "easeOut" }} // Slower duration
                  variants={{
                      hidden: { opacity: 0, y: 30 },
                      visible: { opacity: 1, y: 0 },
                  }} // Define fadeIn inline
                  // Add padding/margin for spacing relative to the CTA banner above
                  className="pt-16 pb-12 md:pt-20 md:pb-16" // Added padding top/bottom
              >
                  <ClientsSection /> {/* Render the actual ClientsSection component */}
              </motion.section>
            </div>
      </section>
  );
};

export default Services;