// src/components/Nav/AnimatedBackground.tsx
import React, { useMemo } from 'react';

// Re-using the component logic from BlogNavControls V5
const BackgroundArtSVG = React.memo(() => {
    const config = useMemo(() => ({
        lines: 18, circles: 7, turbulenceSeed: Math.random() * 100,
        turbulenceFreq: (0.001 + Math.random() * 0.004).toFixed(4),
        warpScale: (1.5 + Math.random() * 3).toFixed(1),
    }), []);

    const elements = useMemo(() => {
        const items: JSX.Element[] = [];
        for (let i = 0; i < config.lines; i++) {
            const dashArray = `${(Math.random() * 15 + 5).toFixed(0)} ${(Math.random() * 10 + 5).toFixed(0)}`;
            items.push( <line key={`l-${i}`} x1={`${Math.random() * 110 - 5}%`} y1={`${Math.random() * 110 - 5}%`} x2={`${Math.random() * 110 - 5}%`} y2={`${Math.random() * 110 - 5}%`} strokeWidth={(Math.random() * 0.5 + 0.1).toFixed(2)} strokeDasharray={dashArray} className="bg-svg-line" style={{ ['--anim-duration' as any]: `${(Math.random() * 15 + 12).toFixed(1)}s`, ['--anim-delay' as any]: `-${(Math.random() * 10).toFixed(1)}s`, ['--stroke-dasharray' as any]: dashArray, } as React.CSSProperties}/> );
        }
        for (let i = 0; i < config.circles; i++) {
             items.push( <circle key={`c-${i}`} cx={`${Math.random() * 100}%`} cy={`${Math.random() * 100}%`} r={`${(Math.random() * 1.5 + 0.5).toFixed(1)}%`} strokeWidth={(Math.random() * 0.4 + 0.1).toFixed(2)} className="bg-svg-circle" style={{ ['--anim-duration' as any]: `${(Math.random() * 12 + 8).toFixed(1)}s`, ['--anim-delay' as any]: `-${(Math.random() * 8).toFixed(1)}s`, } as React.CSSProperties}/> );
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