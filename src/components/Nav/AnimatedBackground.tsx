// src/components/Nav/AnimatedBackground.tsx
import React, { useMemo } from 'react';

// Simple seeded pseudo-random for deterministic values (avoids hydration mismatch)
const seededRandom = (seed: number) => {
    const x = Math.sin(seed * 9999) * 10000;
    return x - Math.floor(x);
};

// Re-using the component logic from BlogNavControls V5
const BackgroundArtSVG = React.memo(() => {
    // Use static deterministic values to avoid hydration mismatch
    const config = useMemo(() => ({
        lines: 18,
        circles: 7,
        turbulenceSeed: 42,
        turbulenceFreq: '0.003',
        warpScale: '2.5',
    }), []);

    const elements = useMemo(() => {
        const items: JSX.Element[] = [];
        for (let i = 0; i < config.lines; i++) {
            // Use seeded random for deterministic but varied positions
            const seed = i * 7 + 1;
            const dashArray = `${Math.floor(seededRandom(seed) * 15 + 5)} ${Math.floor(seededRandom(seed + 1) * 10 + 5)}`;
            items.push(
                <line
                    key={`l-${i}`}
                    x1={`${(seededRandom(seed + 2) * 110 - 5).toFixed(1)}%`}
                    y1={`${(seededRandom(seed + 3) * 110 - 5).toFixed(1)}%`}
                    x2={`${(seededRandom(seed + 4) * 110 - 5).toFixed(1)}%`}
                    y2={`${(seededRandom(seed + 5) * 110 - 5).toFixed(1)}%`}
                    strokeWidth={(seededRandom(seed + 6) * 0.5 + 0.1).toFixed(2)}
                    strokeDasharray={dashArray}
                    className="bg-svg-line"
                    style={{
                        ['--anim-duration' as any]: `${(seededRandom(seed + 7) * 15 + 12).toFixed(1)}s`,
                        ['--anim-delay' as any]: `-${(seededRandom(seed + 8) * 10).toFixed(1)}s`,
                        ['--stroke-dasharray' as any]: dashArray,
                    } as React.CSSProperties}
                />
            );
        }
        for (let i = 0; i < config.circles; i++) {
            const seed = i * 11 + 100;
            items.push(
                <circle
                    key={`c-${i}`}
                    cx={`${(seededRandom(seed) * 100).toFixed(1)}%`}
                    cy={`${(seededRandom(seed + 1) * 100).toFixed(1)}%`}
                    r={`${(seededRandom(seed + 2) * 1.5 + 0.5).toFixed(1)}%`}
                    strokeWidth={(seededRandom(seed + 3) * 0.4 + 0.1).toFixed(2)}
                    className="bg-svg-circle"
                    style={{
                        ['--anim-duration' as any]: `${(seededRandom(seed + 4) * 12 + 8).toFixed(1)}s`,
                        ['--anim-delay' as any]: `-${(seededRandom(seed + 5) * 8).toFixed(1)}s`,
                    } as React.CSSProperties}
                />
            );
        }
        return items;
    }, [config]);

    return (
        <svg width="100%" height="100%" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg" className="blog-nav-bg-svg">
             <defs>
                 <filter id="bgGlowSubtle" x="-50%" y="-50%" width="200%" height="200%"> <feGaussianBlur stdDeviation="0.8" result="blur" /> </filter>
                 <filter id="bgTurbulence" x="-20%" y="-20%" width="140%" height="140%"> <feTurbulence type="fractalNoise" baseFrequency={config.turbulenceFreq} numOctaves="2" seed={config.turbulenceSeed} result="warp"/> <feDisplacementMap in="SourceGraphic" in2="warp" scale={config.warpScale} xChannelSelector="R" yChannelSelector="G"/> </filter>
                 <linearGradient id="bgLineGradient" gradientTransform="rotate(45)"> <stop offset="0%" stopColor="var(--accent-primary)" stopOpacity="0.4" /> <stop offset="30%" stopColor="var(--accent-highlight)" stopOpacity="0.2" /> <stop offset="70%" stopColor="var(--accent-secondary)" stopOpacity="0.2" /> <stop offset="100%" stopColor="var(--brand-cyan)" stopOpacity="0.4" /> </linearGradient>
                 <radialGradient id="bgCircleGradient"> <stop offset="0%" stopColor="var(--accent-highlight)" stopOpacity="0.5"/> <stop offset="100%" stopColor="var(--accent-highlight)" stopOpacity="0"/> </radialGradient>
             </defs>
             <g stroke="url(#bgLineGradient)" filter="url(#bgTurbulence) url(#bgGlowSubtle)">
                 {elements}
             </g>
        </svg>
    );
});
BackgroundArtSVG.displayName = 'BackgroundArtSVG';

export { BackgroundArtSVG }; // Export if needed directly
