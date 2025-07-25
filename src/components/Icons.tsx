// src/components/Icons.tsx
"use client";
import React, { useState, useEffect } from "react";

// --- Base Interfaces ---
interface IconPropsBase {
    className?: string;
    size?: number | string;
    [key: string]: any;
}
interface CreatedIconProps extends Omit<React.SVGProps<SVGSVGElement>, 'size' | 'className' | 'strokeWidth'> {
    size?: number | string;
    className?: string;
    strokeWidth?: number | string;
}
interface AnimatedAsciiProps {
    chars?: string[];
    interval?: number;
    className?: string;
}
interface IconCalendarProps extends Omit<React.SVGProps<SVGSVGElement>, 'children'> {
    dateString: string | undefined;
    className?: string;
    size?: number | string;
    strokeWidth?: number | string; // Allow string here for flexibility if needed externally
}

// --- CORRECTED createIcon Helper ---
const createIcon = (pathData: string | JSX.Element, viewBox = "0 0 24 24") => {
    const IconComponent = React.forwardRef<SVGSVGElement, CreatedIconProps>(({
        size = "1em",
        className,
        strokeWidth = 1.5, // Default strokeWidth applied here
        ...rest
    }, ref) => (
        <svg
            ref={ref}
            xmlns="http://www.w3.org/2000/svg"
            viewBox={viewBox}
            width={size}
            height={size}
            fill="none"
            stroke="currentColor"
            strokeWidth={strokeWidth} // Apply strokeWidth from props/default
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
            focusable="false"
            className={className}
            {...rest}
        >
            {typeof pathData === 'string' ? <path d={pathData} /> : pathData}
        </svg>
    ));
    
    IconComponent.displayName = 'Icon';
    return IconComponent;
};


// --- Corrected IconCalendar ---
export const IconCalendar = ({
    dateString,
    className = "",
    size = "1.2em",
    strokeWidth = 1, // Base stroke width for this icon
    ...rest
}: IconCalendarProps) => {

    const [day, setDay] = useState<string | null>(null);

    useEffect(() => {
        // ... (date parsing logic remains the same) ...
         if (!dateString) { setDay(null); return; }
         try {
             const date = new Date(`${dateString}T12:00:00Z`);
             if (!isNaN(date.getTime())) {
                 const dayOfMonth = date.getUTCDate();
                 setDay(dayOfMonth.toString());
             } else { setDay("?"); }
         } catch (e) { setDay("!"); }
    }, [dateString]);

    const viewBox = "0 0 24 24";
    // Ensure strokeWidth is a number for calculations
    const numericStrokeWidth = Number(strokeWidth) || 1; // Fallback to 1 if parsing fails

    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox={viewBox}
            width={size}
            height={size}
            fill="none"
            stroke="currentColor"
            strokeWidth={numericStrokeWidth} // Use the numeric value
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
            focusable="false"
            className={className}
            {...rest}
        >
            <rect x="4" y="5" width="16" height="16" rx="1.5" ry="1.5" />
            <line x1="4" y1="10" x2="20" y2="10" />
             {/* FIX: Apply numericStrokeWidth + 0.5 */}
            <path d="M8 3v3M16 3v3" strokeWidth={numericStrokeWidth + 0.5} />
            <path d="M4 6 Q 6 3, 12 3 T 20 6" strokeWidth="0.5"/>

            {day && (
                <text x="50%" y="62%" textAnchor="middle" dominantBaseline="middle" fontSize="10px" fontWeight="700" fill="currentColor" fontFamily="var(--font-meta, sans-serif)">
                    {day}
                </text>
            )}
        </svg>
    );
};


// --- Navigation Icons ---
const defaultIconSize = "1.3em";
export const ServicesIcon = ({ className = "", size = defaultIconSize, ...props }: IconPropsBase) => ( <svg style={{ width: size, height: size }} className={`nav-svg services-icon ${className}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" {...props}> <g className="icon-group-services"><path d="M12 2 C 6.48 2 2 6.48 2 12 S 6.48 22 12 22 S 22 17.52 22 12 S 17.52 2 12 2 Z" className="svg-bg services-outline animated-stroke" style={{ '--stroke-length': 85 } as React.CSSProperties} /><circle cx="12" cy="12" r="2.5" className="svg-core services-center-node pulse-node" /><g className="services-spokes"><path d="M 12 6 V 8" className="svg-line services-line line-n animated-stroke" style={{ '--stroke-length': 2, '--anim-delay': '0.1s' } as React.CSSProperties} /><path d="M 12 16 V 18" className="svg-line services-line line-s animated-stroke" style={{ '--stroke-length': 2, '--anim-delay': '0.15s' } as React.CSSProperties}/><path d="M 8 12 H 6" className="svg-line services-line line-w animated-stroke" style={{ '--stroke-length': 2, '--anim-delay': '0.2s' } as React.CSSProperties}/><path d="M 18 12 H 16" className="svg-line services-line line-e animated-stroke" style={{ '--stroke-length': 2, '--anim-delay': '0.25s' } as React.CSSProperties}/><path d="M 9.17 9.17 l -1.41 -1.41" className="svg-line svg-diag services-line line-nw animated-stroke" style={{ '--stroke-length': 2, '--anim-delay': '0.3s' } as React.CSSProperties}/><path d="M 16.24 16.24 l -1.41 -1.41" className="svg-line svg-diag services-line line-se animated-stroke" style={{ '--stroke-length': 2, '--anim-delay': '0.35s' } as React.CSSProperties}/><path d="M 14.83 9.17 l 1.41 -1.41" className="svg-line svg-diag services-line line-ne animated-stroke" style={{ '--stroke-length': 2, '--anim-delay': '0.4s' } as React.CSSProperties}/><path d="M 7.76 16.24 l 1.41 -1.41" className="svg-line svg-diag services-line line-sw animated-stroke" style={{ '--stroke-length': 2, '--anim-delay': '0.45s' } as React.CSSProperties}/></g><path d="M 6 6 Q 12 0 18 6" className="svg-detail services-arc arc-1 animated-stroke dashed" strokeWidth="1" style={{ '--stroke-length': 15, '--anim-delay': '0.5s' } as React.CSSProperties} /><path d="M 18 18 Q 12 24 6 18" className="svg-detail services-arc arc-2 animated-stroke dashed" strokeWidth="1" style={{ '--stroke-length': 15, '--anim-delay': '0.55s' } as React.CSSProperties} /></g></svg> );
export const ProjectsIcon = ({ className = "", size = defaultIconSize, ...props }: IconPropsBase) => ( <svg style={{ width: size, height: size }} className={`nav-svg projects-icon ${className}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" {...props}><g className="icon-group-projects"><path d="M1 12s3-7 11-7 11 7 11 7-3 7-11 7-11-7-11-7z" className="svg-bg svg-eye-outline animated-stroke" style={{ '--stroke-length': 60 } as React.CSSProperties}/><circle cx="12" cy="12" r="3.5" className="svg-core svg-pupil pulse-node" style={{ '--anim-delay': '0.1s' } as React.CSSProperties} /><path d="M 1 12 C 4 8, 8 6, 12 6 C 16 6, 20 8, 23 12" className="svg-detail svg-eyelid" style={{ transformOrigin: "center 12px", animationDelay: '0.2s' } as React.CSSProperties} /><path d="M 10.5 10.5 Q 12 9.5 13.5 10.5 Q 12.5 13 10.5 13 Z" fill="currentColor" className="svg-detail svg-reflection animated-fill" opacity="0.7" style={{ '--anim-delay': '0.3s' } as React.CSSProperties}/><line x1="4" y1="10" x2="20" y2="10" className="svg-detail eye-scanline scan-1" strokeWidth="0.5" style={{ animationDelay: '0.4s' } as React.CSSProperties} /><line x1="5" y1="14" x2="19" y2="14" className="svg-detail eye-scanline scan-2" strokeWidth="0.5" style={{ animationDelay: '0.6s' } as React.CSSProperties}/></g></svg> );
export const OpenSourceIcon = ({ className = "", size = defaultIconSize, ...props }: IconPropsBase) => ( <svg style={{ width: size, height: size }} className={`nav-svg open-source-icon ${className}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" {...props}><g className="icon-group-opensource"><path d="M16 4 L16 10 C16 12.21 14.21 14 12 14 S8 12.21 8 10 L8 4" className="svg-line svg-main-branch animated-stroke" style={{ '--stroke-length': 20 } as React.CSSProperties}/><polyline points="12 14 12 20" className="svg-line svg-trunk animated-stroke" style={{ '--stroke-length': 6, '--anim-delay': '0.2s' } as React.CSSProperties}/><g className="branch-left"><polyline points="5 7 8 4 11 7" className="svg-detail svg-branch-line animated-stroke" style={{ '--stroke-length': 8, '--anim-delay': '0.1s' } as React.CSSProperties}/><circle cx="5" cy="7" r="1.5" className="svg-detail svg-node node-left pulse-node" style={{ '--anim-delay': '0.3s' } as React.CSSProperties}/></g><g className="branch-right"><polyline points="13 7 16 4 19 7" className="svg-detail svg-branch-line animated-stroke" style={{ '--stroke-length': 8, '--anim-delay': '0.15s' } as React.CSSProperties}/><circle cx="19" cy="7" r="1.5" className="svg-detail svg-node node-right pulse-node" style={{ '--anim-delay': '0.35s' } as React.CSSProperties}/></g><path d="M6 10l-3 3 3 3" className="svg-detail svg-chevron-left svg-chevron" style={{ '--anim-delay': '0.4s' } as React.CSSProperties} /><path d="M18 10l3 3-3 3" className="svg-detail svg-chevron-right svg-chevron" style={{ '--anim-delay': '0.45s' } as React.CSSProperties} /></g></svg> );
export const BlogIcon = ({ className = "", size = defaultIconSize, ...props }: IconPropsBase) => ( <svg style={{ width: size, height: size }} className={`nav-svg blog-icon ${className}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" {...props}><defs><filter id="blogIconWarpInternal" x="-20%" y="-20%" width="140%" height="140%"><feTurbulence type="fractalNoise" baseFrequency="0.5" numOctaves="1" result="warp" seed="10" /><feDisplacementMap in="SourceGraphic" in2="warp" scale="0" xChannelSelector="R" yChannelSelector="G" result="disp"><animate attributeName="scale" values="0; 1.5; 0" dur="0.6s" begin="indefinite" fill="freeze" /></feDisplacementMap></filter></defs><g className="icon-group-blog"><path d="M 18 4 L 6 16 C 4 18 4 21 6 22 S 10 21 11 20 L 20 11 C 22 9 21 6 20 4 S 18 3 18 4 Z" className="svg-line animated-stroke" filter="url(#blogIconWarpInternal)" style={{ '--stroke-length': 40 } as React.CSSProperties} /><path d="M 14 8 L 18 4" className="svg-detail animated-stroke" style={{ '--stroke-length': 5, '--anim-delay': '0.1s' } as React.CSSProperties}/><circle cx="6" cy="18" r="2" className="svg-core pulse-node" style={{ '--anim-delay': '0.2s' } as React.CSSProperties}/></g></svg> );

// --- Utility Icons (Using createIcon where appropriate) ---
export const HourglassIcon = createIcon( <> <path d="M6 2h12v6l-4 4 4 4v6H6v-6l4-4-4-4z"/><path d="M6 8h12" className="sand sand-top"/><path d="M6 16h12" className="sand sand-bottom"/> </>);
export const CustomLookingGlassIcon = ({ size = 24, isToggle = false, className = "", ...props }: { size?: number, isToggle?: boolean, className?: string, [key: string]: any }) => ( <svg className={`custom-looking-glass-svg ${isToggle ? 'mobile-blog-icon' : ''} ${className}`} viewBox="0 0 100 100" width={size} height={size} xmlns="http://www.w3.org/2000/svg" fill="none" stroke="currentColor" {...props}><defs><filter id={`strongGlow${size}`} x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="2.5" result="blur"/><feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge></filter><filter id={`glassWarp${size}`} x="-20%" y="-20%" width="140%" height="140%"><feTurbulence type="fractalNoise" baseFrequency="0.04 0.08" numOctaves="1" seed="5" result="warp"/><feDisplacementMap in="SourceGraphic" in2="warp" scale="1.5" /></filter></defs><g className="glass-group" filter={`url(#strongGlow${size})`}><path d="M50 5 C 20 5, 5 25, 5 50 S 20 95, 50 95 S 95 75, 95 50 S 80 5, 50 5 Z" strokeWidth="5" strokeLinecap="round" className="glass-frame-outer"><animate attributeName="stroke-dasharray" values="5 15; 20 5; 5 15" dur="6s" repeatCount="indefinite" /></path><path d="M50 15 C 30 15, 15 30, 15 50 S 30 85, 50 85 S 85 70, 85 50 S 70 15, 50 15 Z" strokeWidth="3" className="glass-frame-inner"/><ellipse cx="50" cy="50" rx="32" ry="30" strokeWidth="2.5" strokeDasharray="4 2" className="glass-surface" filter={`url(#glassWarp${size})`}><animate attributeName="stroke-dashoffset" from="0" to="-12" dur="1s" repeatCount="indefinite" /><animate attributeName="ry" values="30; 28; 32; 30" dur="7s" repeatCount="indefinite" /></ellipse><path d="M 50 35 L 65 50 L 50 65 L 35 50 Z" strokeWidth="3" fill="currentColor" className="glass-center"><animate attributeName="opacity" values="0.6;1;0.8; 1; 0.6" dur="4s" repeatCount="indefinite" /><animateTransform attributeName="transform" type="rotate" from="0 50 50" to="360 50 50" dur="12s" repeatCount="indefinite" /><animateTransform attributeName="transform" type="scale" values="1; 1.1; 1; 0.9; 1" dur="5s" repeatCount="indefinite" additive="sum"/></path></g></svg> );
export const ServiceHoverAnimation = ({ className = "" }) => ( <svg className={`hover-animation-svg service-hover-anim ${className}`} viewBox="0 0 80 40" fill="none" stroke="currentColor" strokeWidth="0.75" strokeLinecap="round" strokeLinejoin="round" preserveAspectRatio="xMidYMid meet"><defs><filter id="serviceGlowHover" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="1.5" result="blur"/><feFlood floodColor="currentColor" floodOpacity="0.8" result="color"/><feComposite in="color" in2="blur" operator="in" result="glow"/><feMerge><feMergeNode in="glow"/></feMerge></filter></defs><g filter="url(#serviceGlowHover)"><path className="animated-stroke" d="M 5 20 H 15 Q 20 20 20 15 V 10 H 60 V 25 Q 60 30 65 30 H 75" style={{ '--stroke-length': 100 } as React.CSSProperties}></path><path className="animated-stroke" d="M 20 12 H 30 L 35 17" style={{ '--stroke-length': 20, animationDelay: '0.1s' } as React.CSSProperties}></path><circle className="animated-fill svg-pulse" cx="35" cy="17" r="2" style={{ animationDelay: '0.3s' } as React.CSSProperties}></circle><path className="animated-stroke" d="M 60 28 H 50 L 45 23" style={{ '--stroke-length': 20, animationDelay: '0.15s' } as React.CSSProperties}></path><circle className="animated-fill svg-pulse" cx="45" cy="23" r="2" style={{ animationDelay: '0.35s' } as React.CSSProperties}></circle><circle className="svg-pulse" cx="40" cy="20" r="3" fill="currentColor" style={{ animationDelay: '0.2s' } as React.CSSProperties}></circle></g></svg> );
export const ProjectsHoverAnimation = ({ className = "" }) => ( <svg className={`hover-animation-svg projects-hover-anim ${className}`} viewBox="0 0 80 40" fill="none" stroke="currentColor" strokeWidth="0.75" strokeLinecap="round" strokeLinejoin="round" preserveAspectRatio="xMidYMid meet"><defs><pattern id="blueprintGrid" width="10" height="10" patternUnits="userSpaceOnUse"><path d="M 10 0 L 0 0 0 10" fill="none" stroke="currentColor" strokeWidth="0.3"/></pattern></defs><rect width="80" height="40" fill="url(#blueprintGrid)" opacity="0.3" /><path d="M 10 20 Q 40 5 70 20 Q 40 35 10 20 Z" className="animated-stroke svg-eye-outline" style={{ '--stroke-length': 80 } as React.CSSProperties}></path><circle cx="40" cy="20" r="5" className="svg-pulse" fill="currentColor"/><path d="M 40 5 V -5 M 40 35 V 45 M 10 20 H 0 M 70 20 H 80" strokeDasharray="2 2" className="animated-stroke dashed" style={{ '--stroke-length': 10, animationDelay: '0.2s' } as React.CSSProperties}/></svg> );
export const OpenSourceHoverAnimation = ({ className = "" }) => ( <svg className={`hover-animation-svg opensource-hover-anim ${className}`} viewBox="0 0 80 40" fill="none" stroke="currentColor" strokeWidth="0.75" strokeLinecap="round" strokeLinejoin="round" preserveAspectRatio="xMidYMid meet"><g className="icon-group-opensource"><path d="M 40 35 V 15" className="animated-stroke" style={{ '--stroke-length': 20 } as React.CSSProperties}></path><g className="branch-left" style={{ transformOrigin: '40px 15px' } as React.CSSProperties}><path className="animated-stroke" d="M 40 15 Q 30 15 25 10" style={{ '--stroke-length': 18, animationDelay: '0.1s' } as React.CSSProperties}></path><circle className="animated-fill svg-pulse" cx="25" cy="10" r="2.5" style={{ animationDelay: '0.3s' } as React.CSSProperties}></circle></g><g className="branch-right" style={{ transformOrigin: '40px 25px' } as React.CSSProperties}><path className="animated-stroke" d="M 40 25 Q 50 25 55 20" style={{ '--stroke-length': 18, animationDelay: '0.15s' } as React.CSSProperties}></path><circle className="animated-fill svg-pulse" cx="55" cy="20" r="2.5" style={{ animationDelay: '0.35s' } as React.CSSProperties}></circle></g><g style={{ transformOrigin: '55px 20px' } as React.CSSProperties}><path className="animated-stroke" d="M 55 20 Q 60 20 65 15" style={{ '--stroke-length': 12, animationDelay: '0.25s' } as React.CSSProperties}></path><circle className="animated-fill svg-pulse" cx="65" cy="15" r="2" style={{ animationDelay: '0.45s' } as React.CSSProperties}></circle></g></g></svg> );
export const BlogHoverAnimation = ({ className = "" }) => ( <svg className={`hover-animation-svg blog-hover-anim ${className}`} viewBox="0 0 80 40" fill="none" stroke="currentColor" strokeWidth="0.75" strokeLinecap="round" strokeLinejoin="round" preserveAspectRatio="xMidYMid meet"><defs><filter id="inkBleed" x="-50%" y="-50%" width="200%" height="200%"><feTurbulence type="fractalNoise" baseFrequency="0.1" numOctaves="2" result="warp" seed="20"/><feDisplacementMap in="SourceGraphic" in2="warp" scale="3" xChannelSelector="R" yChannelSelector="G" result="bleed"/><feGaussianBlur in="bleed" stdDeviation="0.5" /></filter></defs><g filter="url(#inkBleed)"><path d="M 10 30 C 30 10, 50 35, 70 20" className="animated-stroke quill-feather" style={{ '--stroke-length': 80 } as React.CSSProperties} /><circle cx="10" cy="30" r="3" className="svg-quill-nib animated-fill" fill="currentColor" style={{ animationDelay: '0.1s' } as React.CSSProperties}/></g></svg> );
export const AnimatedAscii = ({ chars = ['▸', '▹', '◆', '◇', '◈'], interval = 150, className = "" }: AnimatedAsciiProps) => { const [currentChar, setCurrentChar] = useState(chars[0]); const [index, setIndex] = useState(0); useEffect(() => { const intervalId = setInterval(() => { setIndex(prevIndex => (prevIndex + 1) % chars.length); }, interval); return () => clearInterval(intervalId); }, [chars, interval]); useEffect(() => { setCurrentChar(chars[index]); }, [index, chars]); return <span key={currentChar} className={`animated-ascii inline-block ${className}`}>{currentChar}</span>; };
export const HamburgerIcon = ({ className = "" }: IconPropsBase) => ( <svg className={`hamburger-svg ${className}`} width="26" height="20" viewBox="0 0 26 20" fill="none" xmlns="http://www.w3.org/2000/svg"><path className="bar bar-1" d="M1 2H25" stroke="currentColor" strokeWidth="3" strokeLinecap="round"/><path className="bar bar-2" d="M1 10H25" stroke="currentColor" strokeWidth="3" strokeLinecap="round"/><path className="bar bar-3" d="M1 18H25" stroke="currentColor" strokeWidth="3" strokeLinecap="round"/></svg> );
export const CloseXIcon = ({ className = "", size = 26 }: IconPropsBase) => ( <svg className={`close-x-svg ${className}`} width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><line className="x-line x-line-1" x1="6" y1="6" x2="18" y2="18" opacity="0" /><line className="x-line x-line-2" x1="6" y1="18" x2="18" y2="6" opacity="0" /></svg> );
export const OrnateDividerSVG = ({ className = "" }: { className?: string }) => ( <svg width="150" height="15" viewBox="0 0 150 15" className={`w-32 md:w-40 h-auto mx-auto my-8 md:my-12 ${className}`}><defs><filter id="wobblyLineDivider" x="-10%" y="-100%" width="120%" height="300%"><feTurbulence type="fractalNoise" baseFrequency="0.02 0.8" numOctaves="2" result="turbulence" seed={Math.random() * 10}/><feDisplacementMap in2="turbulence" in="SourceGraphic" scale="1.5" xChannelSelector="R" yChannelSelector="G"/></filter><linearGradient id="dividerGradientUnique" x1="0%" y1="0%" x2="100%" y2="0%"><stop offset="0%" stopColor="var(--accent-primary)" stopOpacity="0.1"/><stop offset="50%" stopColor="var(--accent-primary)" stopOpacity="0.8"/><stop offset="100%" stopColor="var(--accent-primary)" stopOpacity="0.1"/></linearGradient></defs><path d="M5,7 Q 75,10 145,7" stroke="url(#dividerGradientUnique)" strokeWidth="2" fill="none" strokeLinecap="round" filter="url(#wobblyLineDivider)" opacity="0.7"/><circle cx="75" cy="7.5" r="1.5" fill="var(--accent-highlight)" opacity="0.8"/></svg> );
export const AbstractNetworkSVG = ({ className = "" }: { className?: string }) => ( <svg preserveAspectRatio="xMidYMid slice" viewBox="0 0 100 100" className={`w-full h-full absolute inset-0 z-0 ${className} abstract-network-svg`}><defs><filter id="svgNetworkGlow" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="1" result="blur"/><feOffset dx="0" dy="0" result="offsetBlur"/><feFlood floodColor="var(--accent-highlight)" floodOpacity="0.5" result="flood"/><feComposite in="flood" in2="offsetBlur" operator="in" result="glow"/><feMerge> <feMergeNode in="glow"/> <feMergeNode in="SourceGraphic"/> </feMerge></filter></defs><g opacity="0.1" filter="url(#svgNetworkGlow)"><line x1="10" y1="10" x2="90" y2="90" stroke="currentColor" strokeWidth="0.5" className="network-line line-1" /><line x1="90" y1="10" x2="10" y2="90" stroke="currentColor" strokeWidth="0.5" className="network-line line-2" /><circle cx="50" cy="50" r="20" stroke="currentColor" strokeWidth="0.5" fill="none" className="network-circle circle-1"/><circle cx="50" cy="50" r="35" stroke="currentColor" strokeWidth="0.5" fill="none" className="network-circle circle-2"/><line x1="50" y1="0" x2="50" y2="100" stroke="currentColor" strokeWidth="0.25" className="network-line line-3"/><line x1="0" y1="50" x2="100" y2="50" stroke="currentColor" strokeWidth="0.25" className="network-line line-4"/></g><style jsx global>{` @keyframes svg-pulse-opacity { 0% { opacity: 0.05; } 100% { opacity: 0.15; } } @keyframes svg-dash-flow { to { stroke-dashoffset: -50; } } .abstract-network-svg .network-line, .abstract-network-svg .network-circle { stroke: var(--accent-secondary); animation: svg-pulse-opacity 10s infinite alternate ease-in-out; } .abstract-network-svg .line-1 { animation-delay: -1s; stroke-dasharray: 5 5; animation: svg-pulse-opacity 10s infinite alternate ease-in-out, svg-dash-flow 5s infinite linear; } .abstract-network-svg .line-2 { animation-delay: -3s; stroke-dasharray: 2 4; animation: svg-pulse-opacity 12s infinite alternate ease-in-out, svg-dash-flow 6s infinite linear reverse; } .abstract-network-svg .circle-1 { animation-delay: -5s; } .abstract-network-svg .circle-2 { animation-delay: -7s; } .abstract-network-svg .line-3 { animation-delay: -2s; opacity: 0.03; } .abstract-network-svg .line-4 { animation-delay: -4s; opacity: 0.03; } `}</style></svg> );


export const IconArrowLeft = createIcon(
    // Ornate Path Data + SMIL Animation
    <>
        {/* Group for hover effects */}
        <g className="ornate-arrow-left-group">
            {/* Main Arrow Shaft (slightly curved) & Head (more stylized) */}
            <path
                className="main-arrow-path"
                d="M21 12 Q 13 11.5 5 12 M12 19 C 10 16, 10 8, 12 5 M 9 10 L 5 12 L 9 14"
                strokeWidth="1.5" /* Base stroke */
            />
            {/* Flourish element (initially hidden) */}
            <path
                className="flourish"
                d="M18 9 C 20 10, 21 12, 20 14"
                strokeWidth="0.8"
                opacity="0" /* Start hidden */
                fill="none"
            >
                 {/* Fade in on hover */}
                <animate attributeName="opacity" values="0; 0.7; 0" keyTimes="0; 0.5; 1" dur="0.4s" begin="mouseenter" repeatCount="1" fill="freeze"/>
                {/* Fade out on mouse leave */}
                <animate attributeName="opacity" values="0.7; 0" dur="0.2s" begin="mouseleave" repeatCount="1" fill="freeze"/>
            </path>

             {/* Animation for the main arrow group on hover */}
             <animateTransform
                attributeName="transform"
                type="translate"
                values="0 0; -1.5 0; 0 0" // Slight move left and back
                keyTimes="0; 0.5; 1"
                dur="0.4s"
                begin="mouseenter" // Trigger animation on hover
                repeatCount="1"    // Run once per hover
                fill="freeze"      // Keep end state until mouseleave
             />
             {/* Reset animation on mouse leave */}
              <animateTransform
                attributeName="transform"
                type="translate"
                values="-1.5 0; 0 0" // Animate back to original position
                dur="0.2s"
                begin="mouseleave" // Trigger on mouse out
                repeatCount="1"
                fill="freeze"
             />
        </g>
    </>,
    "0 0 24 24" // Standard viewBox
    // Default strokeWidth is handled by createIcon, but can be overridden via props
);

// --- Refined Ornate Icons (Using Corrected createIcon) ---
// FIX: Removed the 3rd argument (strokeWidth) from these calls
export const IconOpenFlourish = createIcon(<> <path d="M3 12h18M3 6h18M3 18h18" strokeWidth="1.5"/><path d="M3 8 C 1 9, 0 11, 1 13 M21 8 C 23 9, 24 11, 23 13" strokeWidth="0.7" opacity="0.9"/><path d="M12 6V3M12 18v3" strokeWidth="0.7" opacity="0.9"/> </>);
export const IconCloseFlourish = createIcon(<> <path d="M18 6L6 18M6 6l12 12" strokeWidth="1.5"/><circle cx="12" cy="12" r="10" strokeWidth="0.7" opacity="0.5" strokeDasharray="3 3"/> </>);
export const IconOrnateUpArrow = createIcon(<> <path d="M12 19 V 5 M 5 12 l 7 -7 l 7 7" strokeWidth="1.5"/> <path d="M5 15 C 7 11, 17 11, 19 15" strokeWidth="1" opacity="0.7"/> <path d="M9 20 C 10 18, 14 18, 15 20" strokeWidth="0.5"/> </>, "0 0 24 24"); // Removed strokeWidth=1.5
export const IconOrnateCalendar = createIcon(<> 
  {/* Main calendar structure */}
  <rect x="4" y="5" width="16" height="16" rx="1.5" ry="1.5" strokeWidth="1"/> 
  <circle cx="8" cy="4" r="1" fill="currentColor"/>
  <circle cx="16" cy="4" r="1" fill="currentColor"/> 
  <line x1="4" y1="10" x2="20" y2="10" strokeWidth="1"/> 
  {/* Calendar date dots */}
  <path d="M8 14h.01M12 14h.01M16 14h.01M8 18h.01M12 18h.01M16 18h.01" strokeWidth="1.5"/> 
  {/* Art Deco flourishes */}
  <path d="M4 6 Q 6 3, 12 3 T 20 6" strokeWidth="0.5"/> 
  <path d="M4 20 Q 6 22, 12 22 T 20 20" strokeWidth="0.5"/> 
  {/* Additional Art Deco geometric elements */}
  <path d="M6 8 L 8 6 L 8 8 M18 8 L 16 6 L 16 8" strokeWidth="0.3" opacity="0.6"/>
  <circle cx="12" cy="12" r="0.5" fill="currentColor" opacity="0.3"/>
 </>);
export const IconOrnateClock = createIcon(<> 
  {/* Main clock face */}
  <circle cx="12" cy="12" r="10" strokeWidth="0.75" /> 
  {/* Clock hands */}
  <path d="M12 6.5 V 12 L 16 14" strokeWidth="1.5"/> 
  <circle cx="12" cy="12" r=".75" fill="currentColor"/> 
  {/* Hour markers */}
  <path d="M12 2 V 4 M22 12 H 20 M12 22 V 20 M2 12 H 4 M19.07 4.93 L 17.66 6.34 M4.93 19.07 L 6.34 17.66 M19.07 19.07 L 17.66 17.66 M4.93 4.93 L 6.34 6.34" strokeWidth="0.5"/> 
  {/* Art Deco decorative elements */}
  <path d="M8 4 Q 12 2, 16 4 M8 20 Q 12 22, 16 20" strokeWidth="0.3" opacity="0.5"/>
  <circle cx="12" cy="5" r="0.5" fill="currentColor" opacity="0.3"/>
  <circle cx="12" cy="19" r="0.5" fill="currentColor" opacity="0.3"/>
  <circle cx="5" cy="12" r="0.5" fill="currentColor" opacity="0.3"/>
  <circle cx="19" cy="12" r="0.5" fill="currentColor" opacity="0.3"/>
 </>);
export const IconOrnateTag = createIcon(<> 
  {/* Main tag shape */}
  <path d="M19.4 14.8L12 22.2a1 1 0 0 1-1.4 0l-8-8V4.6a1 1 0 0 1 1-1h7.8a1 1 0 0 1 .7.3l7.3 7.3a1 1 0 0 1 0 1.4z" strokeWidth="1"/> 
  <circle cx="7.5" cy="7.5" r="1.5" fill="currentColor"/> 
  {/* Art Deco flourishes */}
  <path d="M11 2 Q 9 5, 9 7 C 9 9, 10 11, 12 12 M 2 11 C 1 13, 1 15, 2 17" strokeWidth="0.5"/> 
  {/* Additional geometric elements */}
  <path d="M4 4 L 6 6 M4 8 L 6 6" strokeWidth="0.3" opacity="0.5"/>
  <path d="M15 15 Q 17 16, 18 18" strokeWidth="0.3" opacity="0.6"/>
  <circle cx="5" cy="6" r="0.3" fill="currentColor" opacity="0.4"/>
 </>);
export const IconOrnateShare = createIcon(<> <path d="M18 5a3 3 0 1 0 0-6 3 3 0 0 0 0 6z M6 12a3 3 0 1 0 0-6 3 3 0 0 0 0 6z M18 19a3 3 0 1 0 0-6 3 3 0 0 0 0 6z" strokeWidth="1"/> <path d="M8.59 13.51 C 10 15, 14 16, 15.42 17.49 M15.41 6.51 C 14 8, 10 9, 8.59 10.49" strokeWidth="1"/> <path d="M12 2 C 6 4, 4 8, 4 12 S 6 20, 12 22 C 18 20, 20 16, 20 12 S 18 4, 12 2 Z" strokeWidth="0.5" opacity="0.3" strokeDasharray="3 3"/> </>);
export const IconOrnateUser = createIcon(<> <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" strokeWidth="1"/> <circle cx="12" cy="7" r="4" strokeWidth="1"/> <path d="M8 3 C 6 4, 5 6, 5 7 M16 3 C 18 4, 19 6, 19 7" strokeWidth="0.5"/> </>);
export const IconOrnateAuthor = createIcon(<> 
  {/* Main person silhouette */}
  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" strokeWidth="1"/> 
  <circle cx="12" cy="7" r="4" strokeWidth="1"/> 
  {/* Art Deco decorative elements */}
  <path d="M6 15 C 8 12, 16 12, 18 15" strokeWidth="0.5" opacity="0.7"/> 
  <path d="M9 20 C 10 19, 14 19, 15 20" strokeWidth="0.5" opacity="0.8"/> 
  <path d="M8 3 Q 12 1, 16 3" strokeWidth="0.5" opacity="0.6"/> 
  {/* Art Deco geometric accents */}
  <circle cx="9" cy="5" r="0.5" fill="currentColor" opacity="0.4"/> 
  <circle cx="15" cy="5" r="0.5" fill="currentColor" opacity="0.4"/> 
  {/* Additional flourishes for Art Deco style */}
  <path d="M7 16 L 9 14 M17 16 L 15 14" strokeWidth="0.3" opacity="0.5"/>
  <path d="M12 2 L 11 4 L 13 4 Z" strokeWidth="0.3" fill="currentColor" opacity="0.3"/>
 </>);
export const IconOrnateEdit = createIcon(<> <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" strokeWidth="1"/> <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" strokeWidth="1"/> <path d="M17 11 C 18 10, 19 10, 20 11" strokeWidth="0.5"/> </>);
export const IconPageTurnNext = createIcon(<> <path d="M9 4 L 15 12 L 9 20" strokeWidth="1.5"/> <path d="M15 4 V 20 C 18 17, 18 7, 15 4 Z" strokeWidth="0.5" fill="currentColor" fillOpacity="0.05"/> <path d="M8 4 H 15 M 8 20 H 15" strokeWidth="0.5"/> </>);
export const IconPageTurnPrev = createIcon(<> <path d="M15 4 L 9 12 L 15 20" strokeWidth="1.5"/> <path d="M9 4 V 20 C 6 17, 6 7, 9 4 Z" strokeWidth="0.5" fill="currentColor" fillOpacity="0.05"/> <path d="M16 4 H 9 M 16 20 H 9" strokeWidth="0.5"/> </>);
export const IconOrnateList = createIcon(<> <path d="M8 6h13M8 12h11M8 18h9" strokeWidth="1"/> <path d="M4.5 6a.5.5 0 1 0 0-1 .5.5 0 0 0 0 1z M 4.5 12a.5.5 0 1 0 0-1 .5.5 0 0 0 0 1z M 4.5 18a.5.5 0 1 0 0-1 .5.5 0 0 0 0 1z" fill="currentColor"/> <path d="M21 7c-1 1-2 1-3 0 M19 13c-1 1-2 1-3 0 M17 19c-1 1-2 1-3 0" strokeWidth="0.5"/> </>);
export const IconReadingMode = createIcon(<> <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" strokeWidth="1"/> <path d="M12 5 C 11 7, 11 10, 12 12 S 13 17, 12 19" strokeWidth="0.5"/> <circle cx="7" cy="6" r="2.5" strokeWidth="1"/><circle cx="17" cy="6" r="2.5" strokeWidth="1"/> <path d="M9.5 6 H 14.5" strokeWidth="1"/> </>);
export const IconOrnateSearch = createIcon(<> <circle cx="11" cy="11" r="7" strokeWidth="1"/> <path d="M16 16 L 21 21" strokeWidth="1.5"/> <path d="M19 18 C 21 19, 22 21, 21 23" strokeWidth="0.5"/> <path d="M8 9 A 3 3 0 0 1 11 7" strokeWidth="0.5"/> </>);
export const IconOrnateFilter = createIcon(<> <path d="M22 3 H 2 L 10 12.46 V 19 L 14 21 V 12.46 L 22 3 z" strokeWidth="1"/> <path d="M2 4 C 1 6, 1 8, 2 10 M22 4 C 23 6, 23 8, 22 10" strokeWidth="0.5"/> </>);
export const IconOrnateSliders = createIcon(<> <line x1="4" y1="21" x2="4" y2="14" /> <line x1="4" y1="10" x2="4" y2="3" /> <line x1="12" y1="21" x2="12" y2="12" /> <line x1="12" y1="8" x2="12" y2="3" /> <line x1="20" y1="21" x2="20" y2="16" /> <line x1="20" y1="12" x2="20" y2="3" /> <line x1="1" x2="7" y1="14" y2="14" /> <line x1="9" x2="15" y1="8" y2="8" /> <line x1="17" x2="23" y1="16" y2="16" /> <path d="M1 16 C 0 14, 0 12, 1 10 M7 16 C 8 14, 8 12, 7 10 M9 10 C 8 8, 8 6, 9 4 M15 10 C 16 8, 16 6, 15 4 M17 18 C 16 16, 16 14, 17 12 M23 18 C 24 16, 24 14, 23 12" strokeWidth="0.5"/> </>, "0 0 24 24"); // Removed strokeWidth=1.5
export const IconOrnateX = createIcon(<> <path d="M18 6 L 6 18 M 6 6 L 18 18" strokeWidth="1.5"/> <path d="M18 8 C 21 9, 22 11, 21 13 M6 8 C 3 9, 2 11, 3 13 M8 6 C 9 3, 11 2, 13 3 M8 18 C 9 21, 11 22, 13 21" strokeWidth="0.5" opacity="0.8"/> </>, "0 0 24 24"); // Removed strokeWidth=1.5

// --- NEW ICONS NEEDED ---
export const IconChevronDown = createIcon("M6 9l6 6 6-6");
export const IconArrowRight = createIcon("M5 12h14M12 5l7 7-7 7");
export const IconClock = createIcon( <> <circle cx="12" cy="12" r="10" /> <polyline points="12 6 12 12 16 14" /> </> );

// Placeholder Icons for Sort Buttons (Using existing ornate icons)
export const IconSortAscDate = IconOrnateCalendar;
export const IconSortDescDate = IconOrnateCalendar;
export const IconSortAscAlpha = IconOrnateTag;
export const IconSortDescAlpha = IconOrnateTag;
export const IconSliders = IconOrnateSliders;
export const IconSearch = IconOrnateSearch;
export const IconX = IconOrnateX;

