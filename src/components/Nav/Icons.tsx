// src/components/Icons.tsx
"use client";
import React, { useState, useEffect } from "react";

// Base Interface for className prop
interface IconProps {
    className?: string;
    size?: number | string; // Allow number or string (e.g., "1.5em")
}

// Base Interface for Animated ASCII
interface AnimatedAsciiProps {
    chars?: string[];
    interval?: number;
    className?: string;
}

// --- Navigation Icons ---
// Added more specific internal classes for easier animation targeting

export const ServicesIcon = ({ className = "", size = "1.2em" }: IconProps) => ( // Slightly larger
    <svg style={{ width: size, height: size }} className={`nav-svg services-icon ${className}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <g className="icon-group-services">
            <path d="M12 2 C 6.48 2 2 6.48 2 12 S 6.48 22 12 22 S 22 17.52 22 12 S 17.52 2 12 2 Z" className="svg-bg services-outline" />
            <circle cx="12" cy="12" r="2.5" className="svg-core services-center-node svg-pulse" /> {/* Pulsing core */}
            <g className="services-spokes">
                {/* Add classes for staggered animation */}
                <path d="M 12 6 V 8" className="svg-line services-line line-n" />
                <path d="M 12 16 V 18" className="svg-line services-line line-s" />
                <path d="M 8 12 H 6" className="svg-line services-line line-w" />
                <path d="M 18 12 H 16" className="svg-line services-line line-e" />
                <path d="M 9.17 9.17 l -1.41 -1.41" className="svg-line svg-diag services-line line-nw" />
                <path d="M 16.24 16.24 l -1.41 -1.41" className="svg-line svg-diag services-line line-se" />
                <path d="M 14.83 9.17 l 1.41 -1.41" className="svg-line svg-diag services-line line-ne" />
                <path d="M 7.76 16.24 l 1.41 -1.41" className="svg-line svg-diag services-line line-sw" />
            </g>
            {/* Add subtle energy arcs */}
            <path d="M 6 6 Q 12 0 18 6" className="svg-detail services-arc arc-1" strokeWidth="1" />
            <path d="M 18 18 Q 12 24 6 18" className="svg-detail services-arc arc-2" strokeWidth="1" />
        </g>
    </svg>
);

export const ProjectsIcon = ({ className = "", size = "1.2em" }: IconProps) => (
    <svg style={{ width: size, height: size }} className={`nav-svg projects-icon ${className}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <g className="icon-group-projects">
            <path d="M1 12s3-7 11-7 11 7 11 7-3 7-11 7-11-7-11-7z" className="svg-bg svg-eye-outline"/>
            <circle cx="12" cy="12" r="3.5" className="svg-core svg-pupil svg-pulse" /> {/* Slightly larger, pulsing pupil */}
            {/* Eyelid path for blinking - control via CSS transform/opacity */}
            <path d="M 1 12 C 4 8, 8 6, 12 6 C 16 6, 20 8, 23 12" className="svg-detail svg-eyelid" style={{ transformOrigin: "center center" }} />
            {/* More detailed reflection */}
            <path d="M 10.5 10.5 Q 12 9.5 13.5 10.5 Q 12.5 13 10.5 13 Z" fill="currentColor" className="svg-detail svg-reflection" opacity="0.7"/>
             {/* Add subtle scan lines */}
            <line x1="4" y1="10" x2="20" y2="10" className="svg-detail eye-scanline scan-1" strokeWidth="0.5" opacity="0"/>
            <line x1="5" y1="14" x2="19" y2="14" className="svg-detail eye-scanline scan-2" strokeWidth="0.5" opacity="0"/>
        </g>
    </svg>
);

export const OpenSourceIcon = ({ className = "", size = "1.2em" }: IconProps) => (
    <svg style={{ width: size, height: size }} className={`nav-svg open-source-icon ${className}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <g className="icon-group-opensource">
            {/* Main structure */}
            <path d="M16 4 L16 10 C16 12.21 14.21 14 12 14 S8 12.21 8 10 L8 4" className="svg-line svg-main-branch"/>
            <polyline points="12 14 12 20" className="svg-line svg-trunk"/>
            {/* Branches with leaves/nodes */}
            <g className="branch-left">
                <polyline points="5 7 8 4 11 7" className="svg-detail svg-branch-line"/>
                <circle cx="5" cy="7" r="1.5" className="svg-detail svg-node node-left svg-pulse"/>
            </g>
             <g className="branch-right">
                <polyline points="13 7 16 4 19 7" className="svg-detail svg-branch-line"/>
                 <circle cx="19" cy="7" r="1.5" className="svg-detail svg-node node-right svg-pulse"/>
            </g>
            {/* Code brackets/chevrons */}
            <path d="M6 10l-3 3 3 3" className="svg-detail svg-chevron-left" />
            <path d="M18 10l3 3-3 3" className="svg-detail svg-chevron-right" />
        </g>
    </svg>
);

// OLD BlogIcon - Commented out for reference
export const BlogIcon = ({ className = "" }) => (
 <svg className={`nav-svg ${className}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
 <defs>
     <filter id="blogIconWarp" x="-20%" y="-20%" width="140%" height="140%">
         <feTurbulence type="fractalNoise" baseFrequency="0.5" numOctaves="1" result="warp" seed="10"/>
         <feDisplacementMap in="SourceGraphic" in2="warp" scale="1.5" xChannelSelector="R" yChannelSelector="G"/>
     </filter>
 </defs>
 <path d="M 18 4 L 6 16 C 4 18 4 21 6 22 S 10 21 11 20 L 20 11 C 22 9 21 6 20 4 S 18 3 18 4 Z" className="svg-line" />
 <path d="M 14 8 L 18 4" className="svg-detail"/>
 <circle cx="6" cy="18" r="2" className="svg-pulse"/>
 </svg>
);

// --- Utility Icons ---

export const HourglassIcon = ({ className = "" }: IconProps) => ( // Keep as is, animation in CSS
    <svg className={`hourglass-svg ${className}`} viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M6 2h12v6l-4 4 4 4v6H6v-6l4-4-4-4z"/>
        <path d="M6 8h12" className="sand sand-top"/>
        <path d="M6 16h12" className="sand sand-bottom"/>
    </svg>
);

// CustomLookingGlassIcon - Enhanced for animation
export const CustomLookingGlassIcon = ({ size = 24, isToggle = false, className = "" }: { size?: number, isToggle?: boolean, className?: string }) => (
    // Filter IDs defined globally or passed via props if needed
    <svg className={`custom-looking-glass-svg ${isToggle ? 'mobile-blog-icon' : ''} ${className}`} viewBox="0 0 100 100" width={size} height={size} xmlns="http://www.w3.org/2000/svg" fill="none" stroke="currentColor" >
        <defs>
            <filter id={`strongGlow${size}`} x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="2.5" result="blur"/><feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
            <filter id={`glassWarp${size}`} x="-20%" y="-20%" width="140%" height="140%"><feTurbulence type="fractalNoise" baseFrequency="0.04 0.08" numOctaves="1" seed="5" result="warp"/><feDisplacementMap in="SourceGraphic" in2="warp" scale="1.5" /></filter>
        </defs>
        <g className="glass-group" filter={`url(#strongGlow${size})`}>
            <path d="M50 5 C 20 5, 5 25, 5 50 S 20 95, 50 95 S 95 75, 95 50 S 80 5, 50 5 Z" strokeWidth="5" strokeLinecap="round" className="glass-frame-outer">
                <animate attributeName="stroke-dasharray" values="5 15; 20 5; 5 15" dur="6s" repeatCount="indefinite" />
            </path>
            <path d="M50 15 C 30 15, 15 30, 15 50 S 30 85, 50 85 S 85 70, 85 50 S 70 15, 50 15 Z" strokeWidth="3" className="glass-frame-inner"/>
            <ellipse cx="50" cy="50" rx="32" ry="30" strokeWidth="2.5" strokeDasharray="4 2" className="glass-surface" filter={`url(#glassWarp${size})`}>
                <animate attributeName="stroke-dashoffset" from="0" to="-12" dur="1s" repeatCount="indefinite" />
                <animate attributeName="ry" values="30; 28; 32; 30" dur="7s" repeatCount="indefinite" />
            </ellipse>
            <path d="M 50 35 L 65 50 L 50 65 L 35 50 Z" strokeWidth="3" fill="currentColor" className="glass-center">
                <animate attributeName="opacity" values="0.6;1;0.8; 1; 0.6" dur="4s" repeatCount="indefinite" />
                <animateTransform attributeName="transform" type="rotate" from="0 50 50" to="360 50 50" dur="12s" repeatCount="indefinite" />
                <animateTransform attributeName="transform" type="scale" values="1; 1.1; 1; 0.9; 1" dur="5s" repeatCount="indefinite" additive="sum"/>
            </path>
        </g>
    </svg>
);

// --- Services: Circuit Board Animation ---
export const ServiceHoverAnimation = ({ className = "" }) => (
    <svg className={`hover-animation-svg service-hover-anim ${className}`} viewBox="0 0 80 40" fill="none" stroke="currentColor" strokeWidth="0.75" strokeLinecap="round" strokeLinejoin="round" preserveAspectRatio="xMidYMid meet">
        <defs>
            <filter id="serviceGlow" x="-50%" y="-50%" width="200%" height="200%">
                <feGaussianBlur stdDeviation="1" result="blur"/>
                <feFlood floodColor="currentColor" floodOpacity="0.7" result="color"/>
                <feComposite in="color" in2="blur" operator="in" result="glow"/>
                <feMerge>
                    <feMergeNode in="glow"/>
                </feMerge>
            </filter>
        </defs>
        {/* Main trace */}
        <path className="animated-stroke" d="M 5 20 H 15 Q 20 20 20 15 V 10 H 60 V 25 Q 60 30 65 30 H 75" style={{ '--stroke-length': 200 } as React.CSSProperties}></path>
        {/* Branch 1 */}
        <path className="animated-stroke" d="M 20 12 H 30 L 35 17" style={{ '--stroke-length': 30, animationDelay: '0.1s' } as React.CSSProperties}></path>
        <circle className="animated-stroke-fill" cx="35" cy="17" r="1.5" style={{ '--stroke-length': 10, animationDelay: '0.3s' } as React.CSSProperties}></circle>
        {/* Branch 2 */}
        <path className="animated-stroke" d="M 60 28 H 50 L 45 23" style={{ '--stroke-length': 30, animationDelay: '0.15s' } as React.CSSProperties}></path>
        <circle className="animated-stroke-fill" cx="45" cy="23" r="1.5" style={{ '--stroke-length': 10, animationDelay: '0.35s' } as React.CSSProperties}></circle>
        {/* Center pulse node */}
         <circle className="animated-stroke-fill pulse-node" cx="40" cy="20" r="2.5" style={{ '--stroke-length': 16, animationDelay: '0.2s' } as React.CSSProperties}></circle>
         {/* Apply glow filter to the center node */}
         {/* <use href="#serviceGlow" xlink:href="#centerNode" /> This doesn't work directly, apply filter via CSS or to group */}
         <circle cx="40" cy="20" r="2.5" filter="url(#serviceGlow)" fill="transparent" stroke="none" className="pulse-node" style={{ animationDelay: '0.2s' } as React.CSSProperties}/>
    </svg>
);

// --- Projects: Blueprint / Eye Animation ---
export const ProjectsHoverAnimation = ({ className = "" }) => (
    <svg className={`hover-animation-svg projects-hover-anim ${className}`} viewBox="0 0 80 40" fill="none" stroke="currentColor" strokeWidth="0.75" strokeLinecap="round" strokeLinejoin="round" preserveAspectRatio="xMidYMid meet">
        {/* Outer Eye Shape / Frame */}
        <path className="animated-stroke" d="M 10 20 Q 40 5 70 20 Q 40 35 10 20 Z" style={{ '--stroke-length': 150 } as React.CSSProperties}></path>
        {/* Inner Iris */}
        <circle className="animated-stroke" cx="40" cy="20" r="10" style={{ '--stroke-length': 65, animationDelay: '0.2s' } as React.CSSProperties}></circle>
        {/* Pupil - simple fill */}
        <circle className="animated-stroke-fill pulse-node" cx="40" cy="20" r="4" style={{ '--stroke-length': 26, animationDelay: '0.4s' } as React.CSSProperties}></circle>
        {/* Blueprint lines extending */}
        <path className="animated-stroke dashed" d="M 70 20 H 78" style={{ '--stroke-length': 8, animationDelay: '0.1s' } as React.CSSProperties}></path>
        <path className="animated-stroke dashed" d="M 10 20 H 2" style={{ '--stroke-length': 8, animationDelay: '0.15s' } as React.CSSProperties}></path>
        <path className="animated-stroke dashed" d="M 40 5 V -3" style={{ '--stroke-length': 8, animationDelay: '0.2s' } as React.CSSProperties}></path>
        <path className="animated-stroke dashed" d="M 40 35 V 43" style={{ '--stroke-length': 8, animationDelay: '0.25s' } as React.CSSProperties}></path>
    </svg>
);

// --- Open Source: Branching / Git Animation ---
export const OpenSourceHoverAnimation = ({ className = "" }) => (
    <svg className={`hover-animation-svg opensource-hover-anim ${className}`} viewBox="0 0 80 40" fill="none" stroke="currentColor" strokeWidth="0.75" strokeLinecap="round" strokeLinejoin="round" preserveAspectRatio="xMidYMid meet">
        {/* Main trunk */}
        <path className="animated-stroke" d="M 40 35 V 15" style={{ '--stroke-length': 20 } as React.CSSProperties}></path>
        {/* Branch 1 */}
        <path className="animated-stroke" d="M 40 15 Q 30 15 25 10" style={{ '--stroke-length': 25, animationDelay: '0.1s' } as React.CSSProperties}></path>
        <circle className="animated-stroke-fill pulse-node" cx="25" cy="10" r="2" style={{ '--stroke-length': 13, animationDelay: '0.3s' } as React.CSSProperties}></circle>
        {/* Branch 2 */}
        <path className="animated-stroke" d="M 40 25 Q 50 25 55 20" style={{ '--stroke-length': 25, animationDelay: '0.15s' } as React.CSSProperties}></path>
        <circle className="animated-stroke-fill pulse-node" cx="55" cy="20" r="2" style={{ '--stroke-length': 13, animationDelay: '0.35s' } as React.CSSProperties}></circle>
         {/* Branch 3 (Off Branch 2) */}
        <path className="animated-stroke" d="M 55 20 Q 60 20 65 15" style={{ '--stroke-length': 18, animationDelay: '0.25s' } as React.CSSProperties}></path>
        <circle className="animated-stroke-fill pulse-node" cx="65" cy="15" r="2" style={{ '--stroke-length': 13, animationDelay: '0.45s' } as React.CSSProperties}></circle>
        {/* Branch 4 (Off Branch 1) */}
        <path className="animated-stroke" d="M 25 10 Q 20 10 15 5" style={{ '--stroke-length': 18, animationDelay: '0.2s' } as React.CSSProperties}></path>
        <circle className="animated-stroke-fill pulse-node" cx="15" cy="5" r="2" style={{ '--stroke-length': 13, animationDelay: '0.4s' } as React.CSSProperties}></circle>
    </svg>
);

// --- Blog: Ink / Quill / Line Animation --- NEW VERSION ---
export const BlogHoverAnimation = ({ className = "" }) => (
    <svg className={`hover-animation-svg blog-hover-anim ${className}`} viewBox="0 0 80 40" fill="none" stroke="currentColor" strokeWidth="0.75" strokeLinecap="round" strokeLinejoin="round" preserveAspectRatio="xMidYMid meet">
        {/* Quill/Pen shape */}
        <g className="quill-group">
             <path className="animated-stroke" d="M 25 30 Q 30 10 50 10 T 75 20" style={{ '--stroke-length': 100, animationDelay: '0.1s', strokeWidth: 1 } as React.CSSProperties} />
             {/* Nib */}
             <path className="animated-stroke-fill" d="M 25 30 L 23 28 L 27 26 Z" style={{ '--stroke-length': 10, animationDelay: '0s' } as React.CSSProperties} />
        </g>
        {/* Line being drawn */}
        <path className="animated-stroke dashed" d="M 5 35 H 75" style={{ '--stroke-length': 70, animationDelay: '0.3s', strokeWidth: 0.5 } as React.CSSProperties} />
    </svg>
);


// AnimatedAscii (Keep as is, styling in CSS)
export const AnimatedAscii = ({ chars = ['▸', '▹', '◆', '◇', '◈'], interval = 150, className = "" }: AnimatedAsciiProps) => {
   const [currentChar, setCurrentChar] = useState(chars[0]);
   const [index, setIndex] = useState(0);
   useEffect(() => {
       const intervalId = setInterval(() => {
           setIndex(prevIndex => (prevIndex + 1) % chars.length);
       }, interval);
       return () => clearInterval(intervalId);
   }, [chars, interval]);
   useEffect(() => {
       setCurrentChar(chars[index]);
   }, [index, chars]);
   // Added a key prop to potentially help React trigger animations on change if needed
   return <span key={currentChar} className={`animated-ascii inline-block ${className}`}>{currentChar}</span>;
};

// --- Mobile Toggle Icons ---

// Hamburger - Ready for CSS Animation
export const HamburgerIcon = ({ className = "" }: IconProps) => (
    <svg className={`hamburger-svg ${className}`} width="26" height="20" viewBox="0 0 26 20" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path className="bar bar-1" d="M1 2H25" stroke="currentColor" strokeWidth="3" strokeLinecap="round"/>
        <path className="bar bar-2" d="M1 10H25" stroke="currentColor" strokeWidth="3" strokeLinecap="round"/>
        <path className="bar bar-3" d="M1 18H25" stroke="currentColor" strokeWidth="3" strokeLinecap="round"/>
    </svg>
);

// Close X - Ready for CSS Animation
export const CloseXIcon = ({ className = "", size = 26 }: IconProps) => (
   <svg className={`close-x-svg ${className}`} width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
       <line className="x-line x-line-1" x1="6" y1="6" x2="18" y2="18" />
       <line className="x-line x-line-2" x1="6" y1="18" x2="18" y2="6" />
   </svg>
);

// --- Contact Button Animation: Orbiting Dots (CSS Driven) ---
export const ContactHoverAnimation = ({ className = "" }) => (
    <svg className={`hover-animation-svg contact-hover-anim ${className}`} viewBox="0 0 80 40" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" preserveAspectRatio="xMidYMid meet">
        <defs>
            {/* Define motion path for orbit */}
            <circle id="orbitPath" cx="40" cy="20" r="15" fill="none"/>
        </defs>

        {/* Optional: Visible Orbit Path */}
        {/* <use href="#orbitPath" strokeDasharray="2 2" strokeWidth="0.5" opacity="0.5"/> */}

        {/* Central Point - can use pulse-node class from global styles */}
        <circle cx="40" cy="20" r="2.5" fill="currentColor" className="pulse-node contact-center" style={{ '--anim-delay': '0s' } as React.CSSProperties}/>

        {/* Orbiting Dots - animation applied via CSS */}
        <circle r="2.5" className="orbiting-dot dot-1">
            <animateMotion dur="4s" repeatCount="indefinite" rotate="auto">
                <mpath href="#orbitPath"/>
            </animateMotion>
        </circle>
        <circle r="2" className="orbiting-dot dot-2" opacity="0.8">
            <animateMotion dur="5s" repeatCount="indefinite" rotate="auto" begin="-2.5s"> {/* Offset start */}
                <mpath href="#orbitPath"/>
            </animateMotion>
        </circle>
         <circle r="1.5" className="orbiting-dot dot-3" opacity="0.6">
            <animateMotion dur="6s" repeatCount="indefinite" rotate="auto" begin="-4s"> {/* Offset start */}
                <mpath href="#orbitPath"/>
            </animateMotion>
        </circle>
    </svg>
);

// Helper to create forwardRef components for icons
const createIcon = (pathData: string | JSX.Element, viewBox = "0 0 24 24", strokeWidth = 1.5) =>
    React.forwardRef<SVGSVGElement, React.SVGProps<SVGSVGElement>>((props, ref) => (
        <svg ref={ref} xmlns="http://www.w3.org/2000/svg" viewBox={viewBox} fill="none" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false" {...props}>
            {typeof pathData === 'string' ? <path d={pathData} /> : pathData}
        </svg>
));

// --- Refined Ornate Icons ---
// (Keep remaining icons as they were)
export const IconOpenFlourish = createIcon(<> <path d="M3 12h18M3 6h18M3 18h18" strokeWidth="1.5"/><path d="M3 8 C 1 9, 0 11, 1 13 M21 8 C 23 9, 24 11, 23 13" strokeWidth="0.7" opacity="0.9"/><path d="M12 6V3M12 18v3" strokeWidth="0.7" opacity="0.9"/> </>, "0 0 24 24", 1);
export const IconCloseFlourish = createIcon(<> <path d="M18 6L6 18M6 6l12 12" strokeWidth="1.5"/><circle cx="12" cy="12" r="10" strokeWidth="0.7" opacity="0.5" strokeDasharray="3 3"/> </>, "0 0 24 24", 1);
// ... rest of createIcon exports ...
export const IconOrnateUpArrow = createIcon(<> <path d="M12 19 V 5 M 5 12 l 7 -7 l 7 7" strokeWidth="1.5"/> <path d="M5 15 C 7 11, 17 11, 19 15" strokeWidth="1" opacity="0.7"/> <path d="M9 20 C 10 18, 14 18, 15 20" strokeWidth="0.5"/> </>, "0 0 24 24", 1.5);
export const IconOrnateCalendar = createIcon(<> <rect x="4" y="5" width="16" height="16" rx="1.5" ry="1.5" strokeWidth="1"/> <circle cx="8" cy="4" r="1" fill="currentColor"/><circle cx="16" cy="4" r="1" fill="currentColor"/> <line x1="4" y1="10" x2="20" y2="10" strokeWidth="1"/> <path d="M8 14h.01M12 14h.01M16 14h.01M8 18h.01M12 18h.01M16 18h.01" strokeWidth="1.5"/> <path d="M4 6 Q 6 3, 12 3 T 20 6" strokeWidth="0.5"/> <path d="M4 20 Q 6 22, 12 22 T 20 20" strokeWidth="0.5"/> </>, "0 0 24 24", 1);
export const IconOrnateClock = createIcon(<> <circle cx="12" cy="12" r="10" strokeWidth="0.75" /> <path d="M12 6.5 V 12 L 16 14" strokeWidth="1.5"/> <circle cx="12" cy="12" r=".75" fill="currentColor"/> <path d="M12 2 V 4 M22 12 H 20 M12 22 V 20 M2 12 H 4 M19.07 4.93 L 17.66 6.34 M4.93 19.07 L 6.34 17.66 M19.07 19.07 L 17.66 17.66 M4.93 4.93 L 6.34 6.34" strokeWidth="0.5"/> </>, "0 0 24 24", 1);
export const IconOrnateTag = createIcon(<> <path d="M19.4 14.8L12 22.2a1 1 0 0 1-1.4 0l-8-8V4.6a1 1 0 0 1 1-1h7.8a1 1 0 0 1 .7.3l7.3 7.3a1 1 0 0 1 0 1.4z" strokeWidth="1"/> <circle cx="7.5" cy="7.5" r="1.5" fill="currentColor"/> <path d="M11 2 Q 9 5, 9 7 C 9 9, 10 11, 12 12 M 2 11 C 1 13, 1 15, 2 17" strokeWidth="0.5"/> </>, "0 0 24 24", 1);
export const IconOrnateShare = createIcon(<> <path d="M18 5a3 3 0 1 0 0-6 3 3 0 0 0 0 6z M6 12a3 3 0 1 0 0-6 3 3 0 0 0 0 6z M18 19a3 3 0 1 0 0-6 3 3 0 0 0 0 6z" strokeWidth="1"/> <path d="M8.59 13.51 C 10 15, 14 16, 15.42 17.49 M15.41 6.51 C 14 8, 10 9, 8.59 10.49" strokeWidth="1"/> <path d="M12 2 C 6 4, 4 8, 4 12 S 6 20, 12 22 C 18 20, 20 16, 20 12 S 18 4, 12 2 Z" strokeWidth="0.5" opacity="0.3" strokeDasharray="3 3"/> </>, "0 0 24 24", 1);
export const IconOrnateUser = createIcon(<> <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" strokeWidth="1"/> <circle cx="12" cy="7" r="4" strokeWidth="1"/> <path d="M8 3 C 6 4, 5 6, 5 7 M16 3 C 18 4, 19 6, 19 7" strokeWidth="0.5"/> </>, "0 0 24 24", 1);
export const IconOrnateEdit = createIcon(<> <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" strokeWidth="1"/> <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" strokeWidth="1"/> <path d="M17 11 C 18 10, 19 10, 20 11" strokeWidth="0.5"/> </>, "0 0 24 24", 1);
export const IconPageTurnNext = createIcon(<> <path d="M9 4 L 15 12 L 9 20" strokeWidth="1.5"/> <path d="M15 4 V 20 C 18 17, 18 7, 15 4 Z" strokeWidth="0.5" fill="currentColor" fillOpacity="0.05"/> <path d="M8 4 H 15 M 8 20 H 15" strokeWidth="0.5"/> </>, "0 0 24 24", 1);
export const IconPageTurnPrev = createIcon(<> <path d="M15 4 L 9 12 L 15 20" strokeWidth="1.5"/> <path d="M9 4 V 20 C 6 17, 6 7, 9 4 Z" strokeWidth="0.5" fill="currentColor" fillOpacity="0.05"/> <path d="M16 4 H 9 M 16 20 H 9" strokeWidth="0.5"/> </>, "0 0 24 24", 1);
export const IconOrnateList = createIcon(<> <path d="M8 6h13M8 12h11M8 18h9" strokeWidth="1"/> <path d="M4.5 6a.5.5 0 1 0 0-1 .5.5 0 0 0 0 1z M 4.5 12a.5.5 0 1 0 0-1 .5.5 0 0 0 0 1z M 4.5 18a.5.5 0 1 0 0-1 .5.5 0 0 0 0 1z" fill="currentColor"/> <path d="M21 7c-1 1-2 1-3 0 M19 13c-1 1-2 1-3 0 M17 19c-1 1-2 1-3 0" strokeWidth="0.5"/> </>, "0 0 24 24", 1);
export const IconReadingMode = createIcon(<> <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" strokeWidth="1"/> <path d="M12 5 C 11 7, 11 10, 12 12 S 13 17, 12 19" strokeWidth="0.5"/> <circle cx="7" cy="6" r="2.5" strokeWidth="1"/><circle cx="17" cy="6" r="2.5" strokeWidth="1"/> <path d="M9.5 6 H 14.5" strokeWidth="1"/> </>, "0 0 24 24", 1);
export const IconOrnateSearch = createIcon(<> <circle cx="11" cy="11" r="7" strokeWidth="1"/> <path d="M16 16 L 21 21" strokeWidth="1.5"/> <path d="M19 18 C 21 19, 22 21, 21 23" strokeWidth="0.5"/> <path d="M8 9 A 3 3 0 0 1 11 7" strokeWidth="0.5"/> </>, "0 0 24 24", 1);
export const IconOrnateFilter = createIcon(<> <path d="M22 3 H 2 L 10 12.46 V 19 L 14 21 V 12.46 L 22 3 z" strokeWidth="1"/> <path d="M2 4 C 1 6, 1 8, 2 10 M22 4 C 23 6, 23 8, 22 10" strokeWidth="0.5"/> </>, "0 0 24 24", 1);
export const IconOrnateSliders = createIcon(<> <line x1="4" y1="21" x2="4" y2="14" /> <line x1="4" y1="10" x2="4" y2="3" /> <line x1="12" y1="21" x2="12" y2="12" /> <line x1="12" y1="8" x2="12" y2="3" /> <line x1="20" y1="21" x2="20" y2="16" /> <line x1="20" y1="12" x2="20" y2="3" /> <line x1="1" x2="7" y1="14" y2="14" /> <line x1="9" x2="15" y1="8" y2="8" /> <line x1="17" x2="23" y1="16" y2="16" /> <path d="M1 16 C 0 14, 0 12, 1 10 M7 16 C 8 14, 8 12, 7 10 M9 10 C 8 8, 8 6, 9 4 M15 10 C 16 8, 16 6, 15 4 M17 18 C 16 16, 16 14, 17 12 M23 18 C 24 16, 24 14, 23 12" strokeWidth="0.5"/> </>, "0 0 24 24", 1.5);
export const IconOrnateX = createIcon(<> <path d="M18 6 L 6 18 M 6 6 L 18 18" strokeWidth="1.5"/> <path d="M18 8 C 21 9, 22 11, 21 13 M6 8 C 3 9, 2 11, 3 13 M8 6 C 9 3, 11 2, 13 3 M8 18 C 9 21, 11 22, 13 21" strokeWidth="0.5" opacity="0.8"/> </>, "0 0 24 24", 1.5);
