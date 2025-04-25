// src/app/teams/page.tsx
"use client";

import React from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { MapPin, Briefcase, BookOpen, Mail, Users as TeamIcon, Sparkles, GitBranch, Palette, BrainCircuit } from 'lucide-react';

// Import CSS Module
import styles from './Team.module.css';

// Import the ASCII Placeholder Component
import AsciiArtPlaceholder from '@/lib/asciiPlaceholders'; // ADJUST PATH AS NEEDED

// --- Hand-Drawn Style SVG Components ---

// --- NEW: Hand-Drawn Style US Map SVG ---
const UsaMapHighlightSVG = ({ className = "" }: { className?: string }) => (
    <svg
        viewBox="0 0 960 600" // Common US map aspect ratio
        xmlns="http://www.w3.org/2000/svg"
        className={`w-full max-w-lg h-auto mx-auto ${className}`} // Responsive sizing
    >
        <title>Map of the United States Highlighting Los Angeles, California</title>
        <desc>A stylized map showing the continental US outline, with California highlighted and an animated pin over Los Angeles.</desc>
        <defs>
            {/* Filter for slight wobble/distortion */}
            <filter id="mapWobble" x="-10%" y="-10%" width="120%" height="120%">
                <feTurbulence type="fractalNoise" baseFrequency="0.02 0.05" numOctaves="2" result="turbulence" seed="20"/>
                <feDisplacementMap in2="turbulence" in="SourceGraphic" scale="1.5" xChannelSelector="R" yChannelSelector="G" result="displacement"/>
                {/* Optional slight blur */}
                {/* <feGaussianBlur in="displacement" stdDeviation="0.3"/> */}
            </filter>
             {/* Filter for Pin Glow */}
             <filter id="pinGlow" x="-50%" y="-50%" width="200%" height="200%">
                <feGaussianBlur stdDeviation="5" result="coloredBlur"/>
                <feMerge>
                    <feMergeNode in="coloredBlur"/>
                    <feMergeNode in="SourceGraphic"/>
                </feMerge>
            </filter>
        </defs>

        {/* Embedded CSS for Animation */}
        <style>
            {`
                .map-pin-pulse {
                    animation: pulse 2s infinite ease-in-out;
                    transform-origin: center;
                }
                .map-pin-glow {
                    animation: pulse-glow 2s infinite ease-in-out;
                     transform-origin: center;
                }
                @keyframes pulse {
                    0%, 100% { transform: scale(1); opacity: 1; }
                    50% { transform: scale(1.4); opacity: 0.8; }
                }
                @keyframes pulse-glow {
                     0%, 100% { transform: scale(1); opacity: 0.5; }
                    50% { transform: scale(1.8); opacity: 0.8; }
                }
            `}
        </style>

        {/* Apply wobble filter to the whole map group */}
        <g filter="url(#mapWobble)">
             {/* US Outline Path (Simplified) */}
             {/* This path data is approximate - replace with a more accurate one if needed */}
            <path
                d="M815 181 L810 177 L795 177 L793 174 L785 171 L778 171 L770 168 L762 171 L754 174 L746 174 L738 177 L730 177 L723 181 L716 181 L710 184 L703 184 L698 188 L692 188 L687 191 L680 191 L677 195 L671 197 L665 197 L661 200 L656 200 L650 204 L646 204 L641 208 L635 208 L631 212 L626 212 L621 217 L617 219 L612 219 L607 223 L603 223 L598 227 L594 227 L590 231 L586 231 L580 234 L576 234 L572 238 L568 238 L562 242 L558 242 L553 246 L547 246 L541 251 L535 251 L530 256 L524 258 L519 258 L514 262 L510 262 L504 267 L498 269 L493 269 L488 273 L482 273 L477 277 L471 277 L466 282 L460 282 L455 287 L449 288 L444 288 L439 293 L433 293 L428 298 L422 298 L417 302 L411 302 L406 307 L400 307 L395 312 L389 312 L384 317 L378 317 L373 322 L367 322 L362 326 L356 326 L351 331 L345 331 L340 336 L334 336 L329 341 L323 341 L318 346 L312 346 L307 351 L301 351 L296 356 L290 356 L285 361 L279 361 L274 366 L268 366 L263 371 L257 371 L252 376 L246 376 L241 381 L235 381 L230 386 L224 386 L219 391 L213 391 L208 396 L202 396 L197 401 L191 401 L186 406 L180 406 L175 411 L169 411 L164 416 L158 416 L153 421 L147 421 L142 426 L136 426 L131 431 L125 431 L120 436 L114 436 L109 441 L103 441 L98 446 L92 446 L87 451 L81 451 L76 456 L70 456 L65 461 L59 461 L54 466 L48 466 L43 471 L37 471 L32 476 L26 476 L21 481 L15 481 L10 486 L12 490 L18 494 L24 494 L29 498 L35 498 L40 502 L46 502 L51 506 L57 506 L62 510 L68 510 L73 514 L79 514 L84 518 L90 518 L95 522 L101 522 L106 526 L112 526 L117 530 L123 530 L128 534 L134 534 L139 538 L145 538 L150 542 L156 542 L161 546 L167 546 L172 550 L178 550 L183 554 L189 554 L194 558 L200 558 L205 562 L211 562 L216 566 L222 566 L227 570 L233 570 L238 574 L244 574 L249 578 L255 578 L260 582 L266 582 L271 586 L277 586 L282 590 L288 590 L293 594 L299 594 L304 598 L310 598 L315 594 L321 594 L326 590 L332 590 L337 586 L343 586 L348 582 L354 582 L359 578 L365 578 L370 574 L376 574 L381 570 L387 570 L392 566 L398 566 L403 562 L409 562 L414 558 L420 558 L425 554 L431 554 L436 550 L442 550 L447 546 L453 546 L458 542 L464 542 L469 538 L475 538 L480 534 L486 534 L491 530 L497 530 L502 526 L508 526 L513 522 L519 522 L524 518 L530 518 L535 514 L541 514 L546 510 L552 510 L557 506 L563 506 L568 502 L574 502 L579 498 L585 498 L590 494 L596 494 L601 490 L607 488 L612 488 L618 484 L624 481 L629 481 L635 477 L641 474 L646 474 L652 470 L658 466 L663 466 L669 462 L675 458 L680 458 L686 454 L692 450 L697 450 L703 446 L709 442 L714 442 L720 438 L726 434 L731 434 L737 430 L743 426 L748 426 L754 422 L760 418 L765 418 L771 414 L777 410 L782 410 L788 406 L794 402 L799 402 L805 398 L811 394 L816 394 L822 390 L828 386 L833 386 L839 382 L845 378 L850 378 L856 374 L862 370 L867 370 L873 366 L879 362 L884 362 L890 358 L896 354 L901 354 L907 350 L913 346 L918 346 L924 342 L930 338 L935 338 L941 334 L947 330 L952 330 L950 325 L946 320 L942 315 L938 310 L934 305 L930 300 L926 295 L922 290 L918 285 L914 280 L910 275 L906 270 L902 265 L898 260 L894 255 L890 250 L886 245 L882 240 L878 235 L874 230 L870 225 L866 220 L862 215 L858 210 L854 205 L850 200 L846 195 L842 190 L838 185 Z"
                fill="var(--bg-tertiary)"
                stroke="var(--accent-muted2)"
                strokeWidth="0.8"
                opacity="0.6"
             />

            {/* California Highlight Path (Simplified) */}
            <path
                d="M118 237 L113 245 L105 253 L97 260 L90 268 L87 278 L85 288 L82 298 L80 308 L78 318 L76 328 L74 338 L72 348 L70 358 L70 368 L70 378 L73 388 L76 398 L81 406 L90 418 L98 427 L106 435 L114 441 L122 446 L127 452 L130 460 L133 468 L136 476 L139 484 L142 492 L145 500 L148 508 L151 516 L154 524 L157 532 L160 540 L163 548 L166 556 L169 564 L171 570 L172 574 L172 578 L170 582 L167 586 L164 590 L161 594 L158 598 L155 598 L152 594 L149 590 L146 586 L143 582 L140 578 L137 574 L134 570 L131 566 L128 562 L125 558 L122 554 L119 550 L116 546 L113 542 L110 538 L107 534 L104 530 L101 526 L98 2 L95 218 L92 214 L89 210 L86 206 L83 202 L80 198 L77 194 L74 190 L71 186 L68 182 L65 178 L62 174 L59 170 L56 166 L53 162 L50 158 L47 154 L44 150 L41 146 L38 142 L35 138 L32 134 L29 130 L26 126 L23 122 L20 118 L25 120 L30 122 L35 124 L40 126 L45 128 L50 130 L55 132 L60 134 L65 136 L70 138 L75 140 L80 142 L85 144 L90 146 L95 148 L100 150 L105 152 L110 154 L115 156 L120 158 L125 160 L130 162 L135 164 L140 166 L145 168 L148 173 L146 179 L144 185 L142 191 L140 197 L138 203 L136 209 L134 215 L132 221 L130 227 L128 233 Z"
                fill="var(--accent-primary)"
                stroke="var(--accent-highlight)"
                strokeWidth="1"
                opacity="0.6" // Make it slightly transparent
             />
        </g>

        {/* LA Pinpoint (Position is approximate within California path) */}
        {/* Adjusted coordinates (cx, cy) might be needed based on your specific path data */}
        <g transform="translate(105, 495)"> {/* Approximate LA position */}
             {/* Pulsing Glow */}
            <circle
                cx="0" cy="0" r="8"
                fill="var(--accent-highlight)"
                opacity="0.5"
                filter="url(#pinGlow)"
                className="map-pin-glow"
            />
             {/* Pulsing Pin */}
            <circle
                cx="0" cy="0" r="5"
                fill="var(--accent-highlight)"
                stroke="var(--bg-primary)" // Add a small stroke for contrast
                strokeWidth="1.5"
                className="map-pin-pulse"
            />
        </g>
    </svg>
);

// --- NEW: Three-Body Problem Nexus SVG ---
const ThreeBodyNexusSVG = ({ className = "" }: { className?: string }) => (
    <svg
        viewBox="0 0 300 200" // Adjusted viewBox for this concept
        xmlns="http://www.w3.org/2000/svg"
        className={`w-full max-w-md h-auto mx-auto ${className}`} // Max width can be adjusted
    >
        <title>Symbolic Representation of the Three-Body Problem</title>
        <desc>An abstract SVG depicting three interconnected nodes with chaotic orbital paths, symbolizing complex interaction within a digital ether. One node pulses, representing the nexus point.</desc>
        <defs>
            {/* Filter for general digital noise/wobble */}
            <filter id="etherWobble" x="-20%" y="-20%" width="140%" height="140%">
                <feTurbulence type="fractalNoise" baseFrequency="0.02 0.06" numOctaves="2" result="turbulence" seed="88"/>
                <feDisplacementMap in2="turbulence" in="SourceGraphic" scale="1.5" xChannelSelector="R" yChannelSelector="G"/>
            </filter>
            {/* Filter for Node Glow */}
            <filter id="nodeGlow3Body" x="-50%" y="-50%" width="200%" height="200%">
                <feGaussianBlur stdDeviation="3.5" result="coloredBlur"/>
                <feMerge>
                    <feMergeNode in="coloredBlur"/>
                    <feMergeNode in="SourceGraphic"/>
                </feMerge>
            </filter>
             {/* Filter for Path Glow */}
             <filter id="pathGlow" x="-30%" y="-30%" width="160%" height="160%">
                <feGaussianBlur stdDeviation="2" result="blur"/>
                 {/* Optional: Add slight color shift to path glow
                 <feColorMatrix in="blur" type="matrix"
                    values="1 0 0 0 0
                            0 1 0 0 0
                            0 0 1.2 0 0
                            0 0 0 1 0" result="colorShift"/> */}
                <feMerge>
                    <feMergeNode in="blur"/>
                    {/* <feMergeNode in="SourceGraphic"/> */}
                </feMerge>
            </filter>
        </defs>

        {/* Embedded CSS for Animations */}
        <style>
            {`
                .nexus-node-pulse {
                    animation: pulseNexus 2.5s infinite ease-in-out;
                    transform-origin: center;
                }
                .nexus-node-glow {
                    animation: pulseGlowNexus 2.5s infinite ease-in-out;
                    transform-origin: center;
                }
                .orbital-path {
                    stroke-dasharray: 4 4;
                    animation: dash-flow-3body 8s linear infinite;
                }
                .orbital-path-slow {
                     stroke-dasharray: 6 6;
                    animation: dash-flow-3body 15s linear infinite reverse; /* Slower, reverse */
                }
                @keyframes pulseNexus {
                    0%, 100% { transform: scale(1); opacity: 1; }
                    50% { transform: scale(1.4); opacity: 0.8; }
                }
                @keyframes pulseGlowNexus {
                     0%, 100% { opacity: 0.4; transform: scale(1); }
                    50% { opacity: 0.9; transform: scale(1.8); }
                }
                 @keyframes dash-flow-3body {
                    to { stroke-dashoffset: -120; }
                }
            `}
        </style>

        {/* Background Ether Lines (subtle) */}
        <g opacity="0.2" filter="url(#etherWobble)">
            <line x1="0" y1="50" x2="300" y2="60" stroke="var(--accent-muted1)" strokeWidth="0.5" />
            <line x1="0" y1="100" x2="300" y2="90" stroke="var(--accent-muted2)" strokeWidth="0.5" />
            <line x1="0" y1="150" x2="300" y2="160" stroke="var(--accent-muted1)" strokeWidth="0.5" />
            <line x1="100" y1="0" x2="90" y2="200" stroke="var(--accent-muted2)" strokeWidth="0.5" />
            <line x1="200" y1="0" x2="210" y2="200" stroke="var(--accent-muted1)" strokeWidth="0.5" />
        </g>

        {/* Three Bodies and their Chaotic Paths */}
        <g filter="url(#etherWobble)"> {/* Apply slight wobble to paths and nodes */}

            {/* Body 1 & Path */}
            <path d="M80,50 C150,10 250,150 180,160 S10,100 80,50 Z"
                  stroke="var(--accent-secondary)" strokeWidth="1" fill="none" opacity="0.7"
                  filter="url(#pathGlow)" className="orbital-path"/>
            <circle cx="80" cy="50" r="6" fill="var(--accent-secondary)" filter="url(#nodeGlow3Body)"/>

            {/* Body 2 & Path (The Nexus - Highlighted) */}
            <g>
                 {/* Path */}
                <path d="M220,60 C280,120 150,180 70,130 S180,-20 220,60 Z"
                    stroke="var(--accent-highlight)" strokeWidth="1.5" fill="none" opacity="0.8" /* Slightly thicker/brighter */
                    filter="url(#pathGlow)" className="orbital-path-slow"/>
                 {/* Node (Animated) */}
                 <g transform="translate(220, 60)"> {/* Position the nexus node */}
                     {/* Pulsing Glow */}
                    <circle cx="0" cy="0" r="9" fill="var(--accent-highlight)" filter="url(#nodeGlow3Body)" className="nexus-node-glow" />
                    {/* Pulsing Core */}
                    <circle cx="0" cy="0" r="7" fill="var(--accent-highlight)" stroke="var(--bg-primary)" strokeWidth="1" className="nexus-node-pulse" />
                 </g>
            </g>

            {/* Body 3 & Path */}
            <path d="M150,150 C50,200 50,50 180,40 S280,100 150,150 Z"
                  stroke="var(--accent-primary)" strokeWidth="1" fill="none" opacity="0.7"
                  filter="url(#pathGlow)" className="orbital-path" style={{ animationDelay: '-4s' }}/>
            <circle cx="150" cy="150" r="6" fill="var(--accent-primary)" filter="url(#nodeGlow3Body)"/>

        </g>
    </svg>
);

// --- NEW: Abstract US Network Map SVG ---
const AbstractUsaMapSVG = ({ className = "" }: { className?: string }) => (
    <svg
        viewBox="0 0 300 180" // Wider aspect ratio for abstract feel
        xmlns="http://www.w3.org/2000/svg"
        className={`w-full max-w-xl h-auto mx-auto ${className}`} // Allow it to be a bit wider
    >
        <title>Abstract Network Map representing US presence</title>
        <desc>An abstract visualization using lines and shapes to suggest a network across the US, with an animated highlight indicating the West Coast / LA nexus.</desc>
        <defs>
            {/* Filter for background line wobble */}
            <filter id="networkWobble" x="-20%" y="-20%" width="140%" height="140%">
                <feTurbulence type="fractalNoise" baseFrequency="0.03 0.08" numOctaves="2" result="turbulence" seed="42"/>
                <feDisplacementMap in2="turbulence" in="SourceGraphic" scale="2" xChannelSelector="R" yChannelSelector="G"/>
            </filter>
             {/* Filter for Highlight Area Glow/Distortion */}
             <filter id="highlightZone" x="-30%" y="-30%" width="160%" height="160%">
                 <feGaussianBlur stdDeviation="4" result="blur" />
                 <feTurbulence type="fractalNoise" baseFrequency="0.05" numOctaves="3" result="turbulence" seed="15"/>
                 <feDisplacementMap in2="turbulence" in="blur" scale="6" xChannelSelector="R" yChannelSelector="G" result="displacement"/>
                 <feMerge>
                     <feMergeNode in="displacement"/>
                     {/* <feMergeNode in="SourceGraphic"/> Optionally merge source back */}
                 </feMerge>
            </filter>
            {/* Filter for Pin Glow */}
            <filter id="pinGlowAbstract" x="-50%" y="-50%" width="200%" height="200%">
                <feGaussianBlur stdDeviation="4" result="coloredBlur"/>
                <feMerge>
                    <feMergeNode in="coloredBlur"/>
                    <feMergeNode in="SourceGraphic"/>
                </feMerge>
            </filter>
        </defs>

        {/* Embedded CSS for Animation */}
        <style>
            {`
                .abstract-pin-pulse {
                    animation: pulseAbstract 2s infinite ease-in-out;
                    transform-origin: center;
                }
                .abstract-pin-glow {
                    animation: pulseGlowAbstract 2s infinite ease-in-out alternate; /* Alternate glow */
                     transform-origin: center;
                }
                .network-line {
                    stroke-dasharray: 3 3; /* Dashed lines */
                    animation: dash-flow 10s linear infinite;
                }
                @keyframes pulseAbstract {
                    0%, 100% { transform: scale(1); opacity: 1; }
                    50% { transform: scale(1.5); opacity: 0.7; }
                }
                @keyframes pulseGlowAbstract {
                     0% { opacity: 0.3; transform: scale(0.8); }
                    100% { opacity: 0.7; transform: scale(1.6); }
                }
                @keyframes dash-flow {
                    to { stroke-dashoffset: -100; } /* Animate dash offset */
                }
            `}
        </style>

        {/* Background Network Grid (Abstract Lines) */}
        <g opacity="0.4" filter="url(#networkWobble)">
            {/* Horizontal-ish lines */}
            <path d="M10,30 Q80,25 150,35 T290,40" stroke="var(--accent-muted2)" strokeWidth="0.7" fill="none" className="network-line" style={{ animationDelay: '-2s' }}/>
            <path d="M15,60 Q100,65 180,55 T280,65" stroke="var(--accent-muted2)" strokeWidth="0.7" fill="none" className="network-line" />
            <path d="M20,90 Q90,95 160,85 T295,95" stroke="var(--accent-muted2)" strokeWidth="0.7" fill="none" className="network-line" style={{ animationDelay: '-5s' }}/>
            <path d="M10,120 Q110,115 190,125 T285,120" stroke="var(--accent-muted2)" strokeWidth="0.7" fill="none" className="network-line" style={{ animationDelay: '-8s' }}/>
             <path d="M25,150 Q100,155 170,145 T290,155" stroke="var(--accent-muted2)" strokeWidth="0.7" fill="none" className="network-line" style={{ animationDelay: '-3s' }}/>
            {/* Vertical-ish lines */}
            <path d="M40,10 Q35,60 45,110 T40,170" stroke="var(--accent-muted1)" strokeWidth="0.7" fill="none" className="network-line" style={{ animationDelay: '-1s' }}/>
            <path d="M90,20 Q95,70 85,120 T95,175" stroke="var(--accent-muted1)" strokeWidth="0.7" fill="none" className="network-line" style={{ animationDelay: '-6s' }}/>
            <path d="M150,15 Q145,65 155,115 T150,170" stroke="var(--accent-muted1)" strokeWidth="0.7" fill="none" className="network-line" style={{ animationDelay: '-4s' }}/>
            <path d="M210,25 Q215,75 205,125 T215,175" stroke="var(--accent-muted1)" strokeWidth="0.7" fill="none" className="network-line" style={{ animationDelay: '-9s' }}/>
             <path d="M260,10 Q255,60 265,110 T260,170" stroke="var(--accent-muted1)" strokeWidth="0.7" fill="none" className="network-line" style={{ animationDelay: '-7s' }}/>
        </g>

        {/* Abstract Highlight Zone (West Coast / CA area) */}
        {/* Using an ellipse or a custom path with the distortion filter */}
        <g transform="translate(50, 90)"> {/* Position the center of the highlight */}
            <ellipse
                cx="0" cy="0" rx="55" ry="75" // Ellipse size covering roughly CA area
                fill="var(--accent-primary)"
                opacity="0.25" // Make it semi-transparent
                filter="url(#highlightZone)"
            />
            {/* Optional: Add a slightly stronger border */}
             <ellipse
                cx="0" cy="0" rx="55" ry="75"
                fill="none"
                stroke="var(--accent-primary)"
                strokeWidth="1.5"
                opacity="0.3"
                filter="url(#highlightZone)" // Apply same filter
            />
        </g>

        {/* LA Pinpoint (Positioned within the abstract highlight zone) */}
        {/* Coordinates are relative to the overall viewBox */}
        <g transform="translate(75, 115)"> {/* Adjusted approximate LA position within abstract map */}
             {/* Pulsing Glow */}
            <circle
                cx="0" cy="0" r="7" // Slightly smaller glow base
                fill="var(--accent-highlight)"
                filter="url(#pinGlowAbstract)"
                className="abstract-pin-glow" // Use new animation class
            />
             {/* Pulsing Pin */}
            <circle
                cx="0" cy="0" r="4" // Slightly smaller pin
                fill="var(--accent-highlight)"
                stroke="var(--bg-primary)"
                strokeWidth="1.5"
                className="abstract-pin-pulse" // Use new animation class
            />
        </g>
    </svg>
);

// Divider with hand-drawn feel
const OrnateDividerSVG = ({ className = "" }: { className?: string }) => (
    <svg width="100" height="20" viewBox="0 0 100 20" className={`w-24 h-auto mx-auto my-6 md:my-8 ${className}`}>
        <defs>
            <filter id="wobbly" x="-10%" y="-50%" width="120%" height="200%">
                <feTurbulence type="fractalNoise" baseFrequency="0.02 0.5" numOctaves="3" result="turbulence" seed="5"/>
                <feDisplacementMap in2="turbulence" in="SourceGraphic" scale="2" xChannelSelector="R" yChannelSelector="G" result="displacement"/>
                <feGaussianBlur in="displacement" stdDeviation="0.5"/>
            </filter>
        </defs>
        <path d="M5,10 Q20,6 35,10 T65,10 Q80,14 95,10"
            stroke="var(--accent-highlight)"
            strokeWidth="1.5"
            fill="none"
            strokeLinecap="round"
            filter="url(#wobbly)"
            opacity="0.7"
        />
    </svg>
);

// Abstract representation for team synergy/network
const SynergyNetworkSVG = ({ className = "" }: { className?: string }) => (
     <svg viewBox="0 0 100 100" className={`w-full h-auto aspect-square ${className} synergy-svg`}>
         <defs>
             <filter id="nodeGlow" x="-50%" y="-50%" width="200%" height="200%">
                 <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
                 <feMerge><feMergeNode in="coloredBlur"/><feMergeNode in="SourceGraphic"/></feMerge>
             </filter>
             <filter id="lineWobble" x="-10%" y="-10%" width="120%" height="120%">
                 <feTurbulence type="turbulence" baseFrequency="0.1 0.9" numOctaves="2" result="turbulence" seed="10"/>
                 <feDisplacementMap in2="turbulence" in="SourceGraphic" scale="1.5" xChannelSelector="R" yChannelSelector="G"/>
             </filter>
         </defs>
         {/* Central Node */}
         <circle cx="50" cy="50" r="8" fill="var(--accent-primary)" filter="url(#nodeGlow)" className="synergy-center-node"/>
         {/* Outer Nodes */}
         {[0, 1, 2].map(i => {
             const angle = (i * 120 + 30) * (Math.PI / 180); // 3 nodes
             const x = 50 + 35 * Math.cos(angle);
             const y = 50 + 35 * Math.sin(angle);
             return (
                 <g key={`node-${i}`} className="synergy-outer-node" style={{ animationDelay: `${i * 0.3}s` }}>
                     <circle cx={x} cy={y} r="5" fill="var(--accent-secondary)" filter="url(#nodeGlow)"/>
                     {/* Connecting Line */}
                     <line x1="50" y1="50" x2={x} y2={y} stroke="var(--accent-highlight)" strokeWidth="1" opacity="0.5" filter="url(#lineWobble)" className="synergy-connector"/>
                 </g>
             );
         })}
     </svg>
);


// --- Team Data ---
const executives = [
    { id: 'jd', name: 'Johnny Dunn', title: 'Lead Engineering & Co-founder', emoji: '🦁', description: 'A NLP wiz navigating the digital ether. Full-stack engineer & artist specializing in crafting complex data pipelines, training SOTA models, and tailoring bespoke web/app experiences. Previously architected systems at eBay & blockchain solutions at Tilting Point.', icon: <GitBranch size={18} /> },
    { id: 'nathan', name: 'Nathan Franc', title: 'Lead Design & Co-founder', emoji: '🦊', description: 'Multidisciplinary Design Principal based in Melbourne, AU. Expertise spans Product Design (UI/UX), intricate Design Systems, and Brand Identity. Explores the liminal space where Generative AI intersects with meaningful, human-centered design applications. Cautiously optimistic alchemist.', icon: <Palette size={18} /> },
    { id: 'godwin', name: 'Godwin', title: 'Junior Marketer', emoji: '🐻‍❄️', description: 'Slowly but surely forging their mark in the digital marketing world, Godwin is becoming a staple in web3 communities globally, and a master of managing social media content.', icon: <BrainCircuit size={18} /> },
];

// --- ASCII Art ---
const teamArtSet = [ // Shortened examples
`   ███╗   ███████╗ ███████╗
  ████║   ██╔════╝ ██╔════╝
  ██╔██╗ ███████╗ ███████╗
  ██║╚██╗╚════██║ ╚════██║
  ██║ ╚██╗███████║ ███████║
  ╚═╝  ╚═╝╚══════╝ ╚══════╝
« CORE ARCHITECTS // MANIC »`,
`  ╔═══════╗ ╔═══════╗ ╔═══════╗
 ║ INPUT  ║═║ LOGIC  ║═║ OUTPUT║
 ╚═══════╝ ╚═══════╝ ╚═══════╝
   \\│/       \\│/       \\│/
    ◇───────◇───────◇
    SYNERGY   FLOW   ENGINE `,
];

const mapArtSet = [
`    _.--""--._
  .-'          '-.
 / o   _,--._   o \\  LA Nexus
 |   /( \`--' )\\   | 34.05°N
 \\   \\ '--' /   / 118.24°W
  '-._ '.__.' _.-'
      \`""""\`     MANIC HQ`,
`  << NETWORK ANCHOR: LOS ANGELES >>
 +---------------------------------+
 |  [ Coordinates Locked ]        |
 *<))><    SIGNAL ORIGIN    ><((>*
 |   \\\\  [ Digital Ether ]  //   |
 +---------------------------------+
            VIRTUAL HQ`,
];

// --- Framer Motion Variants ---
const fadeIn = { hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } } };
const quickFadeIn = { hidden: { opacity: 0 }, visible: { opacity: 1, transition: { duration: 0.4, ease: "easeOut" } } };
const staggerContainer = { hidden: {}, visible: { transition: { staggerChildren: 0.1, delayChildren: 0.1 } } };
const cardHover = { scale: 1.04, rotate: -1, transition: { type: "spring", stiffness: 300, damping: 15 } };
const exploreHover = { scale: 1.05, y: -3, transition: { type: "spring", stiffness: 400, damping: 10 } };


// --- Main Page Component ---
const TeamsPage = () => {

    return (
        <div className={`min-h-screen ${styles.pageWrapper}`}>
            <main className={styles.contentContainer}>

                {/* --- Hero/Intro Section --- */}
                <motion.section
                    className={`py-16 md:py-20 lg:py-28 text-center relative overflow-hidden ${styles.documentSection}`}
                    initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.2 }} variants={staggerContainer}
                >
                    <div className={styles.heroBackgroundShapes}> {/* Decorative shapes */}
                        <div className={styles.shape1}></div>
                        <div className={styles.shape2}></div>
                    </div>
                    <div className="container mx-auto px-4 relative z-10">
                             {/* Hero ASCII */}
                    <motion.div
                      className="md:col-span-1 mb-10 md:mb-0 md:pr-8" // Add right padding on desktop
                      initial={{ opacity: 0, filter: 'blur(5px)' }} whileInView={{ opacity: 1, filter: 'blur(0px)' }}
                      transition={{ duration: 0.8, delay: 0.2 }} viewport={{ once: true }} >
                      {/* *** ASCII PLACEHOLDER - NO animate/artSet *** */}
                      <div className="flex flex-col md:flex-row gap-4">

                          {/* Each child takes full width on mobile, half width on medium+ */}
                          <div className="w-full md:w-1/2">
                              <AsciiArtPlaceholder
                                  padding="1rem"
                                  // REMOVED: width={600} - Let the container control the width
                                  // The component's default width='100%' will fill this div
                              />
                          </div>

                          {/* Each child takes full width on mobile, half width on medium+ */}
                          <div className="w-full md:w-1/2">
                              <AsciiArtPlaceholder
                                  padding="1rem"
                                  // REMOVED: width={600} - Let the container control the width
                              />
                          </div>

                          </div>
                      <br></br>
                    </motion.div>
                    <h1 className="projects-title project-header-glitch text-shadow-glow">Meet the Manics<span className="accent-dot">.</span></h1>
                         <motion.p variants={fadeIn} className={`${styles.sectionSubtitle} max-w-3xl`}>
                             We are a curated collective of senior engineers, visionary designers, and strategic operators – the navigators of the Manic Blueprint. We synthesize diverse expertise to transform ambitious ideas into tangible, impactful digital realities.
                         </motion.p>
                         <OrnateDividerSVG className="text-[color:var(--accent-secondary)]" />
                     </div>
                 </motion.section>

                {/* --- Team Grid Section --- */}
                <section className={`py-12 md:py-16 lg:py-20 relative ${styles.documentSection} ${styles.teamSectionBackground}`}>
                     {/* Add a large, animated SVG background */}
                     <SynergyNetworkSVG className="absolute inset-0 w-full h-full opacity-[0.05] z-0 synergy-background-svg"/>

                     <div className="container mx-auto px-4 relative z-10">
                        <motion.div
                            className={styles.teamGrid}
                            initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.1 }} variants={staggerContainer}
                        >
                            {executives.map((exec) => (
                                <motion.div
                                    key={exec.id}
                                    variants={fadeIn}
                                    whileHover={cardHover}
                                    className={styles.teamCard}
                                >
                                    {/* Inner container for content */}
                                    <div className={styles.cardContent}>
                                         {/* Large Emoji Background - more subtle */}
                                         <div className={styles.emojiBackground}>{exec.emoji}</div>
                                         {/* Card Header with Icon */}
                                         <div className={styles.cardHeader}>
                                             <span className={styles.memberIcon}>{exec.icon}</span>
                                             <h2 className={styles.memberName}>{exec.name}</h2>
                                         </div>
                                         <p className={styles.memberTitle}>{exec.title}</p>
                                         <p className={styles.memberDescription}>{exec.description}</p>
                                    </div>
                                    {/* Glitchy Border Effect */}
                                    <div className={styles.cardBorderGlitch}></div>
                                </motion.div>
                            ))}
                            {/* Collaborator Placeholder Card */}
                             <motion.div variants={fadeIn} className={`${styles.teamCard} ${styles.placeholderCard}`}>
                                  <div className="flex flex-col items-center justify-center h-full text-center p-4">
                                      <div className={styles.placeholderIconWrapper}>
                                          <TeamIcon className="w-10 h-10 mb-3 text-[color:var(--accent-muted1)] opacity-70"/>
                                          <Sparkles className="w-5 h-5 absolute top-0 right-0 text-[color:var(--accent-highlight)] opacity-60 animate-pulse"/>
                                      </div>
                                      <p className="font-mono text-sm font-medium text-[color:var(--text-secondary)]">Extended Network</p>
                                      <p className="text-xs text-[color:var(--text-muted)] mt-1">Collaborators & Future Allies</p>
                                      <Link href="/contact" className={styles.placeholderCTA}>
                                          Inquire Within &rarr;
                                      </Link>
                                  </div>
                              </motion.div>
                        </motion.div>
                    </div>
                </section>

                {/* --- Location Section --- */}<section className={`py-12 md:py-16 lg:py-20 ${styles.documentSection}`}>
                <div className="container mx-auto px-4">
                    <motion.div className="max-w-3xl mx-auto text-center mb-10 md:mb-12" initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.3 }} variants={staggerContainer}>
                        {/* Keep Title/Subtitle - maybe adjust text slightly if desired for the new metaphor? */}
                        <motion.h2 variants={fadeIn} className={`${styles.sectionTitle}`}>Operational Nexus</motion.h2>
                        <motion.p variants={fadeIn} className={`${styles.sectionSubtitle}`}>
                            Our core operates in multiple hemispheres, with a seamless collaborative workflow ensnared within a collective consciousness.
                             {/* Optional: Reworded subtitle to fit the new visual metaphor */}
                        </motion.p>
                    </motion.div>

                    {/* --- REPLACE PREVIOUS SVG WITH 3-BODY SVG --- */}
                    <motion.div
                        className={styles.locationAsciiWrapper} // Keep class or rename to styles.locationMapWrapper
                        initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, amount: 0.3 }} transition={{ duration: 0.5 }}
                    >
                        {/* Use the new Three-Body Nexus SVG component */}
                        <ThreeBodyNexusSVG className={styles.locationMapSvg} /> {/* Ensure this class targets the SVG */}

                        {/* Keep or adapt the location label */}
                        <div className={styles.locationLabel}>
                            <MapPin size={14} className="mr-1.5 inline-block" />
                            {/* You could make this label more abstract too, or keep it */}
                            Digital Nexus // Los Angeles Anchor
                        </div>
                    </motion.div>
                    {/* --- END REPLACEMENT --- */}
                </div>
            </section>

                 <OrnateDividerSVG className="text-[color:var(--accent-secondary)]" />

                {/* --- Explore Further --- */}
                <section className={`py-10 md:py-12 lg:py-16 text-center ${styles.documentSection}`}>
                     <div className="container mx-auto px-4">
                          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.3 }} variants={staggerContainer}>
                              <motion.h2 variants={fadeIn} className={`${styles.sectionTitle} mb-8 md:mb-10`}>Continue the Journey</motion.h2>
                              <motion.div variants={staggerContainer} className={`${styles.exploreGrid}`}>
                                  {/* Explore Links with Motion */}
                                   <motion.div variants={fadeIn} whileHover={exploreHover}>
                                       <Link href="/process" className={styles.exploreLinkCard}>
                                           <BookOpen /> <span className={styles.exploreLinkText}>The Blueprint</span>
                                       </Link>
                                   </motion.div>
                                   <motion.div variants={fadeIn} whileHover={exploreHover}>
                                       <Link href="/projects" className={styles.exploreLinkCard}>
                                           <Briefcase /> <span className={styles.exploreLinkText}>Selected Works</span>
                                       </Link>
                                   </motion.div>
                                   <motion.div variants={fadeIn} whileHover={exploreHover}>
                                       <Link href="/blog" className={styles.exploreLinkCard}>
                                            {/* Replace BookOpen with something else if desired */}
                                           <BookOpen /> <span className={styles.exploreLinkText}>The Æther Log</span>
                                       </Link>
                                   </motion.div>
                                   <motion.div variants={fadeIn} whileHover={exploreHover}>
                                       <Link href="/contact" className={styles.exploreLinkCard}>
                                           <Mail /> <span className={styles.exploreLinkText}>Initiate Contact</span>
                                       </Link>
                                   </motion.div>
                               </motion.div>
                           </motion.div>
                       </div>
                   </section>
            </main>
            {/* Removed AnimatePresence CTA as it wasn't fully defined */}
             {/* Assume Footer is handled by RootLayout */}
        </div>
    );
};

export default TeamsPage;