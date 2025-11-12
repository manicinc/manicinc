// src/components/Nav/ManicAgencyLogo.tsx
import React from 'react';
import navStyles from './Nav.module.css'; // Import Nav module for styles applied to the SVG

const ManicAgencyLogo = () => {
    // Generate unique IDs for SVG elements to prevent conflicts
    const uniqueId = React.useId ? React.useId().replace(/:/g, '') : Math.random().toString(36).substring(7);
    const gradientId = `manic-grad-${uniqueId}`;
    // const glowFilterId = `logoGlow`; // Define globally if used

    // Animation timings
    const duration = "15s";
    const panicStartTime = 0.41 * 15;
    const panicEndTime = 0.46 * 15;
    const manicOpacityValues = "1 ; 1 ; 0.3 ; 0 ; 0 ; 0.7 ; 1 ; 1";
    const panicOpacityValues = "0 ; 0 ; 0.7 ; 1 ; 1 ; 0.3 ; 0 ; 0";
    const keyTimes = `0; ${(panicStartTime / 15) - 0.01}; ${(panicStartTime / 15)}; ${(panicStartTime / 15) + 0.01}; ${(panicEndTime / 15) - 0.01}; ${(panicEndTime / 15)}; ${(panicEndTime / 15) + 0.01}; 1`.replace(/\s+/g, ' ');

    // *** REMOVED the surrounding <Link> component ***
    // The component now directly returns the SVG.
    // The parent component (NavLogo) provides the actual link functionality.
    return (
        <svg
            viewBox="0 0 380 60" // Keep widened viewBox
            preserveAspectRatio="xMidYMid meet"
            // Apply SVG specific class + responsive height/width from Tailwind
            // Keep classes that style the SVG itself.
            // Removed 'group' and wrapper classes that belonged to the Link.
            className={`${navStyles.manicLogoSvg} w-auto h-10 sm:h-11 md:h-12 lg:h-12 xl:h-12 transition-all duration-300 ease-out`}
            aria-hidden="true" // The link in NavLogo provides the accessible name
            xmlns="http://www.w3.org/2000/svg"
            style={{
                fontSize: 'clamp(28px, 5vw, 40px)', // Increased minimum size for mobile
            }}
        >
            <defs>
                {/* Gradient using CSS Variables */}
                <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="var(--accent-primary)" />
                    <stop offset="50%" stopColor="var(--accent-highlight)" />
                    <stop offset="100%" stopColor="var(--accent-secondary)" />
                </linearGradient>
                {/* Define Alert Gradient for PANIC text */}
                <linearGradient id={`${gradientId}-alert`} x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="var(--accent-alert)" />
                    <stop offset="50%" stopColor="var(--accent-highlight)" />
                    <stop offset="100%" stopColor="var(--accent-secondary)" />
                </linearGradient>
            </defs>

            <g transform="translate(0, 5)">
                {/* Base Text Style Attributes */}
                <text
                    textAnchor="middle" x="190" y="50%" dominantBaseline="central"
                    fontFamily="var(--font-logo, Mona Sans, sans-serif)"
                    fontWeight="900" letterSpacing="3" lengthAdjust="spacingAndGlyphs"
                    fill={`url(#${gradientId})`}
                    style={{ fontSize: 'inherit' }} // Use the responsive font size from parent
                >
                    {/* MANIC Text - Animated Opacity */}
                    <tspan>MANIC AGENCY</tspan>
                    <animate
                        attributeName="opacity" values={manicOpacityValues}
                        keyTimes={keyTimes} dur={duration} repeatCount="indefinite"
                    />
                </text>

                {/* PANIC Text - Positioned identically, different fill, animated opacity */}
                <text
                    textAnchor="middle" x="190" y="50%" dominantBaseline="central"
                    fontFamily="var(--font-logo, Mona Sans, sans-serif)"
                    fontWeight="900" letterSpacing="3" lengthAdjust="spacingAndGlyphs"
                    fill={`url(#${gradientId}-alert)`} opacity="0"
                    style={{ fontSize: 'inherit' }} // Use the responsive font size from parent
                >
                    <tspan>PANIC AGENCY</tspan>
                    <animate
                        attributeName="opacity" values={panicOpacityValues}
                        keyTimes={keyTimes} dur={duration} repeatCount="indefinite"
                    />
                </text>
            </g>
        </svg>
        // *** REMOVED the sr-only span, label is handled by the Link in NavLogo ***
    );
};

export default ManicAgencyLogo;