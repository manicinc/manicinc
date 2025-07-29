// src/components/LookingGlassLogo/LookingGlassLogo.tsx
import React from 'react';
// Link is now handled by the parent NavLogo component
import styles from './LookingGlassLogo.module.css'; // Import the CSS module

interface LookingGlassLogoProps {
    scale?: number; // Add scale prop for sizing
}

const LookingGlassLogo: React.FC<LookingGlassLogoProps> = ({ scale = 1 }) => {
    // Unique IDs for SVG elements - always call useId unconditionally
    const reactId = React.useId();
    const uniqueSuffix = reactId ? reactId.replace(/:/g, '') : Math.random().toString(36).substring(2, 9);
    const gradientId = `lg-grad-${uniqueSuffix}`;
    const warpFilterId = `lg-warp-${uniqueSuffix}`; // Original warp filter
    const maskId = `lg-mask-${uniqueSuffix}`;
    const patternId = `lg-pattern-${uniqueSuffix}`;
    const glowFilterId = `lg-glow-${uniqueSuffix}`;
    const textGlitchFilterId = `lg-text-glitch-${uniqueSuffix}`; // New filter for text glitch

    // Apply scaling to the wrapper and SVG
    const wrapperStyle = {
        transform: scale !== 1 ? `scale(${scale})` : 'none',
        transformOrigin: 'left top'
    };

    return (
        // The Link component is now wrapping this in NavLogo.tsx
        // Apply wrapper class for styling (e.g., underline removal)
        <div className={`${styles.lookingGlassWrapper} group`} style={wrapperStyle}>
            <svg
                viewBox="-20 -30 260 180" // Adjusted viewBox for reflection text space
                className={styles.lookingGlassSvg + ` w-${36 * scale} md:w-${40 * scale}`}
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                style={{ color: 'var(--lg-logo-color, var(--accent-highlight))' } as React.CSSProperties}
            >
                <defs>
                    {/* Glow Filter */}
                    <filter id={glowFilterId} x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="3" result="coloredBlur"/><feMerge><feMergeNode in="coloredBlur"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
                    {/* Mirror Surface Gradient */}
                    <radialGradient id={gradientId} cx="50%" cy="50%" r="65%" fx="40%" fy="45%"><stop offset="0%" stopColor="rgba(var(--bg-tertiary-rgb, 255, 255, 255), 0.5)" stopOpacity="0.7" /><stop offset="40%" stopColor="rgba(var(--bg-secondary-rgb, 240, 240, 240), 0.6)" stopOpacity="0.8" /><stop offset="85%" stopColor="rgba(var(--bg-primary-rgb, 230, 230, 230), 0.7)" stopOpacity="0.9" /><stop offset="100%" stopColor="rgba(var(--shadow-color-rgb, 0, 0, 0), 0.15)" stopOpacity="1" /></radialGradient>
                    {/* Mirror Surface Warp Filter */}
                    <filter id={warpFilterId} x="-20%" y="-20%" width="140%" height="140%"><feTurbulence type="fractalNoise" baseFrequency="0.03 0.06" numOctaves="2" seed="10" result="warp"/><feGaussianBlur in="warp" stdDeviation="0.7" result="blurWarp" /><feDisplacementMap in="SourceGraphic" in2="blurWarp" scale="1.8" xChannelSelector="R" yChannelSelector="G" result="displaced"/><feSpecularLighting surfaceScale="2" specularConstant=".6" specularExponent="12" lightingColor="rgba(255, 255, 240, 0.8)" in="blurWarp" result="specular"><feDistantLight azimuth="230" elevation="50" /></feSpecularLighting><feComposite in="SourceGraphic" in2="specular" operator="arithmetic" k1="0" k2="0.6" k3="0.6" k4="0" result="lit"/><feComposite in="lit" in2="displaced" operator="in"/></filter>
                    {/* Mask for Mirror Content */}
                    <mask id={maskId}><ellipse cx="50" cy="50" rx="37" ry="43" fill="white" /></mask>
                    {/* Pattern for Background */}
                    <pattern id={patternId} patternUnits="userSpaceOnUse" width="10" height="10" patternTransform="rotate(45)"><path d="M 0 0 L 10 0 L 10 1 L 0 1 Z" fill="rgba(var(--lg-logo-color-rgb, var(--accent-highlight-rgb)), 0.04)" /><path d="M 0 5 L 10 5 L 10 6 L 0 6 Z" fill="rgba(var(--lg-logo-color-rgb, var(--accent-highlight-rgb)), 0.04)" /></pattern>

                    {/* Filter for Text Glitch on Hover */}
                    <filter id={textGlitchFilterId} x="-10%" y="-10%" width="120%" height="120%">
                        <feTurbulence baseFrequency="0.8" numOctaves="1" result="turbulence">
                             {/* Animate baseFrequency on hover via SMIL */}
                             {/* Triggering via CSS hover on the group is more reliable */}
                        </feTurbulence>
                        <feDisplacementMap in="SourceGraphic" in2="turbulence" scale="1.5" />
                         {/* Add slight color shift */}
                         <feColorMatrix type="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 0.9 0" result="transparency"/>
                         <feComponentTransfer in="transparency" result="adjustedColor">
                            <feFuncR type="linear" slope="0.9"/>
                            <feFuncG type="linear" slope="1.1"/>
                            <feFuncB type="linear" slope="1.0"/>
                        </feComponentTransfer>
                        <feMerge>
                            <feMergeNode in="adjustedColor"/>
                            {/* <feMergeNode in="SourceGraphic"/> */}
                        </feMerge>
                    </filter>
                </defs>

                {/* Apply group class for CSS hover targeting */}
                <g className={styles.logoGroup}>
                    {/* Mirror Group */}
                    <g transform="translate(0, 0)">
                        {/* Mirror background pattern */}
                        <path d="M50,2 A48,48 0 0 1 98,50 A48,48 0 0 1 50,98 A48,48 0 0 1 2,50 A48,48 0 0 1 50,2 Z" fill={`url(#${patternId})`} opacity="0.6" className={styles.patternBg}/>
                        {/* Mirror surface ellipse with warp filter */}
                        <ellipse cx="50" cy="50" rx="37" ry="43" fill={`url(#${gradientId})`} filter={`url(#${warpFilterId})`} className={styles.mirrorSurface} />
                        {/* Frame group */}
                        <g className={styles.frameGroup} stroke="currentColor" strokeWidth="1" fill="none" strokeLinecap="round" strokeLinejoin="round">
                            {/* Frame paths and ornaments (kept as before) */}
                            <path d="M50,4 A46,46 0 0 1 96,50 A46,46 0 0 1 50,96 A46,46 0 0 1 4,50 A46,46 0 0 1 50,4 Z" strokeWidth="3.5" opacity="0.9" className={styles.frameMain}/>
                            <path d="M50,8 A42,42 0 0 1 92,50 A42,42 0 0 1 50,92 A42,42 0 0 1 8,50 A42,42 0 0 1 50,8 Z" strokeWidth="0.8" opacity="0.7" strokeDasharray="3 2" className={styles.frameDetail}/>
                            <g className={styles.frameScrollwork}><path d="M35,15 C40,5 60,5 65,15" /> <path d="M40,18 C45,10 55,10 60,18" strokeWidth="0.5"/><path d="M35,85 C40,95 60,95 65,85" /> <path d="M40,82 C45,90 55,90 60,82" strokeWidth="0.5"/><path d="M15,35 C5,40 5,60 15,65" /> <path d="M18,40 C10,45 10,55 18,60" strokeWidth="0.5"/><path d="M85,35 C95,40 95,60 85,65" /> <path d="M82,40 C90,45 90,55 82,60" strokeWidth="0.5"/></g>
                            <g className={`${styles.ornament} ${styles.topOrnament}`} transform="translate(50 4) scale(0.8)"> <path d="M0,0 Q10,-12 20,0 M-20,0 Q-10,-12 0,0 M0,0 Q5,-5 8,-8 C 12,-12 15,-12 15,-8 Q 15, -5 10,0" /><path d="M0,0 Q-5,-5 -8,-8 C -12,-12 -15,-12 -15,-8 Q -15, -5 -10,0" /><path d="M-7,-15 C-7,-20 0,-22 0,-22 C0,-22 7,-20 7,-15 C 7,-10 0,-10 0,-10 C 0,-10 -7,-10 -7,-15 Z" strokeWidth="1"/><circle cx="0" cy="-25" r="2.5" fill="currentColor" stroke="none" className={styles.ornamentJewel}/></g>
                            <g className={`${styles.ornament} ${styles.bottomOrnament}`} transform="translate(50 96) scale(0.8 -0.8)"><path d="M0,0 Q10,-12 20,0 M-20,0 Q-10,-12 0,0 M0,0 Q5,-5 8,-8 C 12,-12 15,-12 15,-8 Q 15, -5 10,0" /><path d="M0,0 Q-5,-5 -8,-8 C -12,-12 -15,-12 -15,-8 Q -15, -5 -10,0" /><path d="M-7,-15 C-7,-20 0,-22 0,-22 C0,-22 7,-20 7,-15 C 7,-10 0,-10 0,-10 C 0,-10 -7,-10 -7,-15 Z" strokeWidth="1"/><circle cx="0" cy="-25" r="2.5" fill="currentColor" stroke="none" className={styles.ornamentJewel}/></g>
                            <g className={`${styles.ornament} ${styles.leftOrnament}`} transform="translate(4 50) scale(0.7) rotate(-90)"><path d="M0,0 C15,-15 35,-15 50,0 C35,15 15,15 0,0 Z" strokeWidth="1.5"/><circle cx="25" cy="-15" r="2" fill="currentColor" className={styles.ornamentJewel}/></g>
                            <g className={`${styles.ornament} ${styles.rightOrnament}`} transform="translate(96 50) scale(0.7) rotate(90)"><path d="M0,0 C15,-15 35,-15 50,0 C35,15 15,15 0,0 Z" strokeWidth="1.5"/><circle cx="25" cy="-15" r="2" fill="currentColor" className={styles.ornamentJewel}/></g>
                        </g>
                        {/* Clock hands */}
                        <g mask={`url(#${maskId})`} className={styles.mirrorContent} opacity="0.15" fill="rgba(var(--text-secondary-rgb), 0.7)">
                            <line x1="50" y1="50" x2="50" y2="32" stroke="currentColor" strokeWidth="1.2" className={styles.hourHand} />
                            <line x1="50" y1="50" x2="68" y2="50" stroke="currentColor" strokeWidth="0.8" className={styles.minuteHand}/>
                        </g>
                    </g> {/* End Mirror Group */}

                    {/* Text Group for Hover Effects */}
                    <g className={styles.textGroup}>
                        {/* Main Text Element */}
                        <text
                            x="110" // Adjusted X position slightly
                            y="55" // Adjusted Y position slightly
                            dominantBaseline="middle"
                            textAnchor="start" // Anchor at the start of the text
                            fontFamily="var(--font-heading-blog, 'Playfair Display', serif)" // Use blog heading font
                            fontSize="40" // Increased font size
                            fontWeight="700"
                            fill="currentColor"
                            letterSpacing="2" // Increased letter spacing
                            className={styles.logoText} // Apply CSS module class for base style + hover filter trigger
                            // Apply glow filter directly
                            filter={`url(#${glowFilterId})`}
                        >
                             {/* Use tspan for potential animation targets */}
                            <tspan>The Looking Glass</tspan>
                              {/* Animate opacity on hover using SMIL (more reliable than CSS for this) */}
                             <animate attributeName="opacity" from="1" to="0.85" dur="0.4s" begin="mouseenter" fill="freeze" />
                             <animate attributeName="opacity" from="0.85" to="1" dur="0.4s" begin="mouseleave" fill="freeze" />
                             
                        </text>

                    </g>
                </g>
            </svg>
            {/* Screen reader text */}
            <span className="sr-only">Looking Glass Chronicles</span>
        </div>
    );
};

export default LookingGlassLogo;