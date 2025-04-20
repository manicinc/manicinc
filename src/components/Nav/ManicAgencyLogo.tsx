// src/components/Nav/ManicAgencyLogo.tsx
import React from 'react';
import Link from 'next/link';
import navStyles from './Nav.module.css'; // Import Nav module for wrapper styles

const ManicAgencyLogo = () => {
    // Generate unique IDs for SVG elements to prevent conflicts
    const uniqueId = React.useId ? React.useId().replace(/:/g, '') : Math.random().toString(36).substring(7);
    const gradientId = `manic-grad-${uniqueId}`;
    // Note: Filters like glow should ideally be defined globally once (e.g., in LayoutClient or a shared SVG defs component)
    // const glowFilterId = `logoGlow`;

    // Animation timings (total duration 15s, PANIC visible between 41% and 46%)
    const duration = "15s";
    const panicStartTime = 0.41 * 15; // 6.15s
    const panicEndTime = 0.46 * 15;   // 6.9s
    const flickerDuration = "0.1s"; // Short duration for flicker transitions

    // Values for opacity animation: 1 (visible) ; 0 (hidden)
    // Manic Opacity: Visible -> Fade Out -> Hidden -> Fade In -> Visible
    const manicOpacityValues = "1 ; 1 ; 0.3 ; 0 ; 0 ; 0.7 ; 1 ; 1";
    // Panic Opacity: Hidden -> Fade In -> Visible -> Fade Out -> Hidden
    const panicOpacityValues = "0 ; 0 ; 0.7 ; 1 ; 1 ; 0.3 ; 0 ; 0";

    // Key Times (percentage of duration) corresponding to opacity values
    // Matches the start/end times and adds points for flickering
    const keyTimes = `
        0;
        ${(panicStartTime / 15) - 0.01};
        ${(panicStartTime / 15)};
        ${(panicStartTime / 15) + 0.01};
        ${(panicEndTime / 15) - 0.01};
        ${(panicEndTime / 15)};
        ${(panicEndTime / 15) + 0.01};
        1
    `.replace(/\s+/g, ' '); // Remove extra whitespace

    return (
        <Link
            href="/"
            aria-label="Manic Agency Home"
            // Apply base logo link styles (removes underline) and default styles
            className={`block standard-logo-wrapper group ${navStyles.logoLink} ${navStyles.logoLinkDefault}`}
        >
            <svg
                viewBox="0 0 380 60" // Keep widened viewBox
                preserveAspectRatio="xMidYMid meet"
                // Apply SVG specific class + responsive height/width from Tailwind
                className={`${navStyles.manicLogoSvg} w-auto h-10 md:h-12 transition-all duration-300 ease-out`}
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
            >
                <defs>
                    {/* Gradient using CSS Variables from theme.css */}
                    <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="100%">
                        {/* Use theme variables for colors */}
                        <stop offset="0%" stopColor="var(--accent-primary)" />
                        <stop offset="50%" stopColor="var(--accent-highlight)" />
                        <stop offset="100%" stopColor="var(--accent-secondary)" />
                        {/* Optional: Add animate for gradient if needed */}
                    </linearGradient>
                    {/* Define Alert Gradient for PANIC text */}
                    <linearGradient id={`${gradientId}-alert`} x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="var(--accent-alert)" />
                        <stop offset="50%" stopColor="var(--accent-highlight)" />
                        <stop offset="100%" stopColor="var(--accent-secondary)" />
                    </linearGradient>
                    {/* Filters should be defined globally if possible */}
                </defs>

                <g transform="translate(0, 5)">
                    {/* Base Text Style Attributes */}
                    <text
                        textAnchor="middle"
                        x="190" // Center of 380 width
                        y="50%" // Vertical center
                        dominantBaseline="central"
                        fontFamily="var(--font-logo, Mona Sans, sans-serif)"
                        fontSize="40"
                        fontWeight="900"
                        letterSpacing="3"
                        lengthAdjust="spacingAndGlyphs" // Allow adjustments
                        // Apply fill using the gradient ID
                        fill={`url(#${gradientId})`}
                        // Apply CSS module class for potential non-gradient styles (like filter from .logoLinkDefault)
                        // className={navStyles.logoTextSvgBase} /* Create a base class if needed */
                    >
                        {/* MANIC Text - Animated Opacity */}
                        <tspan>MANIC AGENCY</tspan>
                        <animate
                            attributeName="opacity"
                            values={manicOpacityValues}
                            keyTimes={keyTimes}
                            dur={duration}
                            repeatCount="indefinite"
                        />
                    </text>

                    {/* PANIC Text - Positioned identically, different fill, animated opacity */}
                    <text
                        textAnchor="middle"
                        x="190"
                        y="50%"
                        dominantBaseline="central"
                        fontFamily="var(--font-logo, Mona Sans, sans-serif)"
                        fontSize="40"
                        fontWeight="900"
                        letterSpacing="3"
                        lengthAdjust="spacingAndGlyphs"
                        // Use the alert gradient
                        fill={`url(#${gradientId}-alert)`}
                        // Start with opacity 0
                        opacity="0"
                        // Optional: Add specific class if needed
                        // className={navStyles.logoTextSvgPanic}
                    >
                        <tspan>PANIC AGENCY</tspan>
                         <animate
                            attributeName="opacity"
                            values={panicOpacityValues}
                            keyTimes={keyTimes}
                            dur={duration}
                            repeatCount="indefinite"
                        />
                    </text>

                    {/* Underline Removed - Delete the <rect> element */}

                </g>
            </svg>
            {/* Screen reader text */}
            <span className="sr-only">Manic Agency</span>
        </Link>
    );
};

export default ManicAgencyLogo;
