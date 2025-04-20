"use client";
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { placeholders, getRandomAsciiArt } from './placeholders';

// --- Configuration ---
const GLITCH_CHARS = ['*', '#', '%', '$', '&', '@', '░', '▒', '▓', '█', '▄', '▀', '?', '!', ';', ':', '/', '\\', '|', '+', '-'];
const CHARACTER_ANIMATION_INTERVAL_MS = 90;
const CHAR_CHANGE_PROBABILITY = 0.01;
const CHAR_REVERT_PROBABILITY = 0.15;

// --- ADJUSTED TIMING ---
const GLITCH_INTERVAL_MIN_MS = 8000;  // Glitch occurs minimum every 8 seconds
const GLITCH_INTERVAL_MAX_MS = 16000; // Glitch occurs maximum every 16 seconds
const GLITCH_DURATION_MIN_MS = 300;   // Glitch lasts minimum 0.3 seconds
const GLITCH_DURATION_MAX_MS = 700;   // Glitch lasts maximum 0.7 seconds
// --- END ADJUSTED TIMING ---

// --- Props Interface ---
interface AsciiArtPlaceholderProps {
    className?: string;
    preClassName?: string;
    style?: React.CSSProperties;
    animate?: boolean;
    initialArtIndex?: number;
    artSet?: string[];
    animationInterval?: number; // Interval for cycling artSet
    height?: string | number;
    width?: string | number;
    padding?: string | number;
}

// --- Component Implementation (Logic mostly unchanged, using new constants) ---
export const AsciiArtPlaceholder: React.FC<AsciiArtPlaceholderProps> = ({
    className = '',
    preClassName = '',
    style = {},
    animate = true,
    initialArtIndex,
    artSet,
    animationInterval = 3500,
    height = '250px',
    width = '100%',
    padding = '1rem',
}) => {
    // --- State and Refs ---
    const [currentArtIndex, setCurrentArtIndex] = useState<number>(0);
    const [baseArt, setBaseArt] = useState<string>('');
    const [animatedArt, setAnimatedArt] = useState<string>('');
    const [isGlitching, setIsGlitching] = useState<boolean>(false);
    const [mounted, setMounted] = useState<boolean>(false);

    const charAnimationFrameRef = useRef<number>();
    const glitchTimeoutRef = useRef<NodeJS.Timeout>();
    const glitchIntervalRef = useRef<NodeJS.Timeout>(); // To stop the glitch duration
    const artCycleIntervalRef = useRef<NodeJS.Timeout>();

    const artSource = artSet && artSet.length > 0 ? artSet : placeholders;

    // --- Effects ---

    // Effect 1: Select Initial Art & Set Mounted State (Unchanged)
    useEffect(() => {
        let initialIndex = 0;
        if (typeof initialArtIndex === 'number' && initialArtIndex >= 0 && initialArtIndex < artSource.length) {
            initialIndex = initialArtIndex;
        } else if (!artSet) {
            initialIndex = Math.floor(Math.random() * artSource.length);
        }
        setCurrentArtIndex(initialIndex);
        const initialArt = artSource[initialIndex]?.trim() || getRandomAsciiArt();
        setBaseArt(initialArt);
        setAnimatedArt(initialArt);
        setMounted(true);
    }, [initialArtIndex, artSet]);

    // Effect 2: Cycle through artSet if provided and animated (Unchanged)
    useEffect(() => {
        clearInterval(artCycleIntervalRef.current);
        if (animate && artSet && artSet.length > 1) {
            artCycleIntervalRef.current = setInterval(() => {
                setCurrentArtIndex(prevIndex => {
                    const nextIndex = (prevIndex + 1) % artSet.length;
                    const nextArt = artSet[nextIndex]?.trim() || '';
                    setBaseArt(nextArt);
                    return nextIndex;
                });
            }, animationInterval);
        } else {
             const currentStaticArt = artSource[currentArtIndex]?.trim() || getRandomAsciiArt();
             if(baseArt !== currentStaticArt) { setBaseArt(currentStaticArt); }
        }
        return () => clearInterval(artCycleIntervalRef.current);
    }, [animate, artSet, animationInterval, currentArtIndex, artSource]);

    // Effect 3: Character Animation (Unchanged logic)
    const runCharacterAnimation = useCallback(() => {
        if (!animate || !baseArt || !mounted) { /* ... cleanup and static set ... */
            if(baseArt) setAnimatedArt(baseArt); else setAnimatedArt('');
            cancelAnimationFrame(charAnimationFrameRef.current!); return;
        }
        let lastUpdateTime = Date.now();
        const animateLoop = () => { /* ... character animation logic ... */
            const now = Date.now();
            if (now - lastUpdateTime >= CHARACTER_ANIMATION_INTERVAL_MS) {
                lastUpdateTime = now;
                setAnimatedArt(prevAnimatedArt => {
                    if (!baseArt) return '';
                    const currentDisplay = prevAnimatedArt || baseArt; const chars = currentDisplay.split(''); const baseChars = baseArt.split('');
                    const loopLength = Math.max(chars.length, baseChars.length); let newChars = [];
                    for (let i = 0; i < loopLength; i++) {
                        const baseChar = baseChars[i]; const animatedChar = chars[i];
                        if (baseChar === undefined) continue;
                        if (baseChar === '\n' || baseChar === '\r') { newChars.push(baseChar); continue; }
                        if (Math.random() < CHAR_CHANGE_PROBABILITY) { newChars.push(GLITCH_CHARS[Math.floor(Math.random() * GLITCH_CHARS.length)]); }
                        else if (animatedChar !== baseChar && Math.random() < CHAR_REVERT_PROBABILITY) { newChars.push(baseChar); }
                        else { newChars.push(animatedChar !== undefined ? animatedChar : baseChar); }
                    } return newChars.join('');
                });
            } charAnimationFrameRef.current = requestAnimationFrame(animateLoop);
        };
        cancelAnimationFrame(charAnimationFrameRef.current!); charAnimationFrameRef.current = requestAnimationFrame(animateLoop);
    }, [animate, baseArt, mounted]);
    useEffect(() => { runCharacterAnimation(); return () => cancelAnimationFrame(charAnimationFrameRef.current!); }, [runCharacterAnimation]);

    // Effect 4: Glitch Trigger (Using NEW timing constants)
    const triggerGlitch = useCallback(() => {
        if (!animate || !mounted) { /* ... cleanup logic ... */
             setIsGlitching(false); clearTimeout(glitchTimeoutRef.current); clearTimeout(glitchIntervalRef.current); return;
        }
        // Function to schedule the next glitch start
        const scheduleNextGlitchStart = () => {
            clearTimeout(glitchTimeoutRef.current); // Clear previous start timeout
            const glitchStartDelay = Math.random() * (GLITCH_INTERVAL_MAX_MS - GLITCH_INTERVAL_MIN_MS) + GLITCH_INTERVAL_MIN_MS;

            glitchTimeoutRef.current = setTimeout(() => {
                // Start the glitch
                setIsGlitching(true);
                const glitchDuration = Math.random() * (GLITCH_DURATION_MAX_MS - GLITCH_DURATION_MIN_MS) + GLITCH_DURATION_MIN_MS;

                // Schedule the glitch end
                clearTimeout(glitchIntervalRef.current); // Clear previous end timeout
                glitchIntervalRef.current = setTimeout(() => {
                    setIsGlitching(false);
                    scheduleNextGlitchStart(); // Schedule the next start after this one ends
                }, glitchDuration);

            }, glitchStartDelay);
        };
        scheduleNextGlitchStart(); // Start the cycle
    }, [animate, mounted]); // Dependencies

    useEffect(() => {
        triggerGlitch();
        return () => { /* ... cleanup logic ... */
             clearTimeout(glitchTimeoutRef.current); clearTimeout(glitchIntervalRef.current); setIsGlitching(false);
        };
    }, [triggerGlitch]);


    // --- Style Calculation (Unchanged) ---
    const outerStyle: React.CSSProperties = { /* ... */
        ...style, padding: typeof padding === 'number' ? `${padding}px` : padding, position: 'relative', overflow: 'hidden', boxSizing: 'border-box',
    };
    const innerStyle: React.CSSProperties = { /* ... */
        height: typeof height === 'number' ? `${height}px` : height, width: typeof width === 'number' ? `${width}px` : width, overflow: 'hidden', position: 'relative', boxSizing: 'border-box', display: 'flex', alignItems: 'flex-start', justifyContent: 'flex-start',
    };
    const preStyle: React.CSSProperties = { /* ... */
        margin: 0, fontFamily: 'var(--font-mono, monospace)', lineHeight: '1.15', fontSize: 'clamp(8px, 1.5vw, 11px)', whiteSpace: 'pre', flexShrink: 0,
    };

    // --- Render Logic (Unchanged) ---
    if (!mounted || !baseArt) { /* ... loading state ... */
         return ( <div className={`ascii-placeholder loading ${className}`} style={outerStyle} aria-busy="true" aria-label="Loading Content Interface..."> <div className="ascii-inner-wrapper" style={innerStyle}> <div className="ascii-loading-text"> <span>[INITIALIZING...]</span> </div> </div> </div> );
    }
    return (
        <div className={`ascii-placeholder ${animate && isGlitching ? 'glitching' : ''} ${className}`} style={outerStyle} aria-hidden="true" >
            <div className="ascii-inner-wrapper" style={innerStyle}>
                <pre style={preStyle} className={preClassName}> {animatedArt} </pre>
            </div>
            {animate && <div className="glitch-overlay" />}
        </div>
    );
};

export default AsciiArtPlaceholder;