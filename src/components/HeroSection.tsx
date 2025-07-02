// src/components/HeroSection.tsx
// V9 - Definitive Quote Fix (useEffect depends only on mount) + V6 Styles

'use client';
import React, { useState, useEffect, useCallback, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowRight, ArrowUpRight, Rabbit, ArrowUp, FileText, FolderGit2, RefreshCw } from 'lucide-react'; // Corrected Icons
import GlitchAnimation from "./GlitchAnimation"; // Ensure path is correct
import AsciiArtPlaceholder from "../lib/asciiPlaceholders"; // Ensure path is correct
import { HeroFeedItem } from "@/types/common"; // Ensure path is correct
import { motion } from 'framer-motion';
import { useCookieConsent } from '@/context/CookieConsentContext';

// --- Dynamic Quote System ---
const LOCAL_STORAGE_KEY = 'manicAgencyHeroVisitData';
interface VisitData {
  count: number;
  lastVisitTimestamp: number;
  lastQuote?: string;
}
const quoteCategories = {
    FIRST_VISIT: ["Welcome. The looking-glass shimmers.", "Connection established. Observe.", "System initializing...", "The rabbit hole awaits.", "Consciousness detected.", "Console ready.", "Perception calibrated.", "Doors opening...", "Dreamer or dream?", "First step taken."],
    SECOND_VISIT_EXCLUSIVE: ["You've been down this path before, haven't you?", "This digital echo... it recognizes you.", "Return signature verified.", "Memory fragments accessed."],
    RETURNING_VISIT_GENERAL: ["Welcome back. Architecture remembers.", "Familiar territory?", "The rabbit hole deepens.", "Persistence logged.", "System adapting.", "Curiosity commended.", "Crossroads of logic and mania.", "Return signature detected.", "Through the looking-glass again."],
    GENERAL_MYSTICAL: ["We craft the code that dreams.", "Elegant design, emergent intelligence.", "Building the future, one algorithm.", "Ghost in the machine: Purposed.", "Reality: A persistent simulation.", "Glitches: Errors or whispers?", "Beyond the UI: Art of the possible.", "Tears in rain... Architecture endures.", "The street finds its own uses.", "Turtles all the way down.", "Real life? Fantasy? We blur lines.", "Moments lost? Not if backed up.", "Curiouser and curiouser...", "Forward is through the looking-glass.", "Six impossible things before breakfast."],
};
const allGeneralQuotes = Array.from(new Set([...quoteCategories.RETURNING_VISIT_GENERAL, ...quoteCategories.GENERAL_MYSTICAL]));

const getRandomQuote = (quotes: string[], currentQuote?: string): string => {
    if (!quotes || quotes.length === 0) return "[STATIC]";
    if (quotes.length === 1) return quotes[0];
    let newQuote: string; let attempts = 0;
    const maxAttempts = quotes.length * 3;
    do {
        newQuote = quotes[Math.floor(Math.random() * quotes.length)]; attempts++;
    } while (newQuote === currentQuote && attempts < maxAttempts);
    if (newQuote === currentQuote && quotes.length > 1) {
        const currentIndex = quotes.indexOf(currentQuote ?? '');
        newQuote = quotes[(currentIndex + 1) % quotes.length];
    }
    return newQuote;
};
const QUOTE_GLITCH_DURATION_MS = 500;

// --- Helper ---
const maxTerminalChars = 36;
const abbreviateText = (text: string, maxLength: number = maxTerminalChars): string => { if (!text || text.length <= maxLength) return text || ''; return text.substring(0, maxLength - 1) + '…'; };

// --- Props ---
interface HeroSectionProps { featuredItems: HeroFeedItem[]; }

// --- Component ---
export function HeroSection({ featuredItems = [] }: HeroSectionProps) {
    const router = useRouter();
    const { setItem, getItem } = useCookieConsent();
    const [currentQuote, setCurrentQuote] = useState<string>(" "); // Start blank
    const [mounted, setMounted] = useState(false);
    const [glitchingQuote, setGlitchingQuote] = useState(false);
    const [decryptingLink, setDecryptingLink] = useState<string | null>(null);
    const [showBackToTop, setShowBackToTop] = useState<boolean>(false);
    const [terminalText, setTerminalText] = useState<string>(abbreviateText("link_init..."));
    const [showCursor, setShowCursor] = useState<boolean>(true);
    const [isDecryptingTerminal, setIsDecryptingTerminal] = useState<boolean>(false);
    const terminalRef = useRef<HTMLDivElement>(null);
    const cycleIntervalRef = useRef<NodeJS.Timeout | null>(null);
    const decryptIntervalRef = useRef<NodeJS.Timeout | null>(null);
    const glitchTimeoutRef = useRef<NodeJS.Timeout | null>(null);

    useEffect(() => { setMounted(true); }, []);

    // --- **DEFINITIVELY FIXED Quote Logic (Load Once, Click Change ONLY)** ---

    // Memoized function to change quote and trigger glitch
    const triggerQuoteChange = useCallback((newQuote: string) => {
        console.log("Attempting to change quote to:", newQuote); // DEBUG
        // Prevent setting the exact same quote again unless it's the initial load placeholder
        if (newQuote === currentQuote && currentQuote !== " ") {
            console.log("Skipping identical quote."); // DEBUG
            return;
        }

        setGlitchingQuote(true);
        setCurrentQuote(newQuote); // Update state first
        console.log("Set quote state to:", newQuote); // DEBUG

        if (glitchTimeoutRef.current) clearTimeout(glitchTimeoutRef.current);
        glitchTimeoutRef.current = setTimeout(() => {
            setGlitchingQuote(false);
            console.log("Glitch effect ended."); // DEBUG
        }, QUOTE_GLITCH_DURATION_MS);

        // Update last quote shown in localStorage
        try {
            const storedData = getItem(LOCAL_STORAGE_KEY);
            const visitData: VisitData = storedData ? JSON.parse(storedData) : { count: 0, lastVisitTimestamp: 0 };
            visitData.lastQuote = newQuote;
            setItem(LOCAL_STORAGE_KEY, JSON.stringify(visitData), 'functional');
        } catch (e) { console.error("LS error (update lastQuote):", e); }
    }, [currentQuote]); // Re-memoize only when currentQuote changes

    // Effect for **INITIAL** quote selection **ONLY**
    useEffect(() => {
        // This effect now ONLY depends on 'mounted'. It will run exactly ONCE.
        if (!mounted) return;
        console.log("Quote Initial useEffect RUNNING"); // DEBUG

        let initialQuote = "";
        let visitData: VisitData = { count: 0, lastVisitTimestamp: 0 };
        let lastQuoteFromStorage: string | undefined = undefined;

        try {
            const storedData = getItem(LOCAL_STORAGE_KEY);
            if (storedData) {
                visitData = JSON.parse(storedData);
                visitData.count = Number(visitData.count) || 0;
                visitData.lastVisitTimestamp = Number(visitData.lastVisitTimestamp) || 0;
                lastQuoteFromStorage = visitData.lastQuote;
                const now = Date.now();
                const timeSinceLastVisit = now - visitData.lastVisitTimestamp;
                const oneMinute = 60 * 1000;

                console.log("Visit data:", visitData, "Time since last:", timeSinceLastVisit); // DEBUG

                if (visitData.count === 0) {
                    console.log("Determined: First Visit"); // DEBUG
                    initialQuote = getRandomQuote(quoteCategories.FIRST_VISIT);
                    visitData.count = 1;
                } else if (visitData.count === 1 && timeSinceLastVisit > oneMinute) {
                    console.log("Determined: Second Visit (Exclusive)"); // DEBUG
                    initialQuote = getRandomQuote(quoteCategories.SECOND_VISIT_EXCLUSIVE, lastQuoteFromStorage);
                    visitData.count = 2;
                } else {
                    console.log("Determined: Returning Visit"); // DEBUG
                    initialQuote = getRandomQuote(allGeneralQuotes, lastQuoteFromStorage);
                    visitData.count += 1;
                }
                visitData.lastVisitTimestamp = now;
                // Update storage with new count/timestamp, but clear lastQuote (it gets set in triggerQuoteChange)
                setItem(LOCAL_STORAGE_KEY, JSON.stringify({ ...visitData, lastQuote: undefined }), 'functional');
            } else {
                 console.log("Determined: First Visit Ever (no storage)"); // DEBUG
                initialQuote = getRandomQuote(quoteCategories.FIRST_VISIT);
                visitData = { count: 1, lastVisitTimestamp: Date.now(), lastQuote: undefined };
                setItem(LOCAL_STORAGE_KEY, JSON.stringify(visitData), 'functional');
            }
        } catch (error) {
            console.error("LS error (initial quote):", error);
            initialQuote = getRandomQuote(quoteCategories.FIRST_VISIT);
            // Note: No need to remove from localStorage as consent-aware setItem handles this
        }

        console.log("Initial quote selected:", initialQuote); // DEBUG

        // Set the initial quote after a short delay
        const initialDelay = setTimeout(() => {
            triggerQuoteChange(initialQuote || getRandomQuote(allGeneralQuotes)); // Ensure a quote is set
        }, 300); // Delay helps ensure DOM is ready for glitch

        // **NO INTERVAL TIMER IS SET HERE**

        return () => {
            console.log("Quote Initial useEffect CLEANUP"); // DEBUG
            clearTimeout(initialDelay);
            if (glitchTimeoutRef.current) clearTimeout(glitchTimeoutRef.current);
        };
    // **CRITICAL FIX: Dependency array only includes 'mounted'.**
    // This guarantees the effect runs ONLY once when the component mounts.
    // triggerQuoteChange is stable due to useCallback([]) or useCallback([currentQuote])
    // but putting it here could theoretically cause issues if its reference changed unexpectedly.
    // Relying solely on 'mounted' is the most robust way to ensure single execution.
    }, [mounted]);

    // Click handler for Manual Quote Change
    const handleQuoteClick = useCallback(() => {
        console.log("handleQuoteClick triggered"); // DEBUG
        const newQuote = getRandomQuote(allGeneralQuotes, currentQuote);
        triggerQuoteChange(newQuote); // Trigger change + glitch
    }, [currentQuote, triggerQuoteChange]); // Okay for this to depend on currentQuote

    // --- Terminal Logic ---
    const startTitleCycle = useCallback(() => { if (cycleIntervalRef.current) clearInterval(cycleIntervalRef.current); if (decryptIntervalRef.current) clearInterval(decryptIntervalRef.current); if (!featuredItems?.length) { setTerminalText(abbreviateText("feed_offline::no_items")); setIsDecryptingTerminal(false); return; } const files = featuredItems.map(item => { const typePrefix = item.type === 'blog' ? 'LOG' : 'PRJ'; const safeSlug = item.slug?.toLowerCase().replace(/[^a-z0-9_-]/g, '_') || 'unknown'; return `${typePrefix}_${safeSlug}.dat`; }); let currentIndex = 0; const cycleToNextFile = () => { if (decryptIntervalRef.current) clearInterval(decryptIntervalRef.current); setIsDecryptingTerminal(true); const targetFilename = abbreviateText(files[currentIndex]); let currentIteration = 0; const maxIterations = 8; const decryptionSpeed = 60; decryptIntervalRef.current = setInterval(() => { if (currentIteration >= maxIterations) { clearInterval(decryptIntervalRef.current!); setTerminalText(targetFilename); setIsDecryptingTerminal(false); currentIndex = (currentIndex + 1) % files.length; } else { setTerminalText( targetFilename.split('').map((char, index) => { const revealThreshold = (currentIteration / maxIterations); const randomFactor = Math.random(); if (['_', '.', '…'].includes(char) || randomFactor < revealThreshold) { return char; } else { return "!<>-_#%*?/$".charAt(Math.floor(Math.random() * 10)); } }).join('') ); currentIteration++; } }, decryptionSpeed); }; cycleToNextFile(); cycleIntervalRef.current = setInterval(cycleToNextFile, 4000); }, [featuredItems]);
    useEffect(() => { if (!mounted) return; const cleanup = () => { if (cycleIntervalRef.current) clearInterval(cycleIntervalRef.current); if (decryptIntervalRef.current) clearInterval(decryptIntervalRef.current); }; const cursorInterval = setInterval(() => setShowCursor(prev => !prev), 530); if (!featuredItems?.length) { setTerminalText(abbreviateText("no_signals_detected")); setIsDecryptingTerminal(false); setShowCursor(true); return () => { cleanup(); clearInterval(cursorInterval); }; } let t1: NodeJS.Timeout, t2: NodeJS.Timeout, t3: NodeJS.Timeout; setTerminalText(abbreviateText("link_init...")); setShowCursor(true); setIsDecryptingTerminal(false); t1 = setTimeout(() => { setIsDecryptingTerminal(true); setTerminalText(abbreviateText("scanning_signals...")); t2 = setTimeout(() => { setTerminalText(abbreviateText("receiving_data...")); t3 = setTimeout(() => { setIsDecryptingTerminal(false); startTitleCycle(); }, 700); }, 900); }, 1200); return () => { cleanup(); clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); clearInterval(cursorInterval); }; }, [mounted, featuredItems, startTitleCycle]);

    // --- Other Logic ---
    const handleDecodeClick = useCallback((e: React.MouseEvent<HTMLAnchorElement>, urlPath: string | null, isDraft: boolean) => { if (isDraft || !urlPath) { e.preventDefault(); return; } e.preventDefault(); if (decryptingLink === urlPath) return; setDecryptingLink(urlPath); setTimeout(() => { router.push(urlPath); setTimeout(() => setDecryptingLink(null), 150); }, 400); }, [decryptingLink, router]);
    const scrollToTop = useCallback(() => { window.scrollTo({ top: 0, behavior: 'smooth' }); }, []);
    useEffect(() => { const h = () => setShowBackToTop(window.scrollY > 150); window.addEventListener('scroll', h); return () => window.removeEventListener('scroll', h); }, []);
    const animationClass = (delay = 'delay-0') => mounted ? `fade-in-up ${delay}` : 'opacity-0';
    const fadeIn = { hidden: { opacity: 0, y: 15 }, visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } } };

    // --- Render ---
    const displayItems = featuredItems;

    return (
        <div id="hero-section" className="hero-wrapper themed hero-bottom-fade">
            {/* Backgrounds */}
            <div className="hero-bg-effects"> <GlitchAnimation width="100%" height="100%" /> <div className="noise-overlay"></div> </div>
            <div className="mesh-gradient-overlay"></div>

            <div className="hero-container">
                <div className="hero-content-main compact-top">
                    {/* Quote Display */}
                    <div className={`quote-wrapper ${animationClass('delay-100')}`} onClick={handleQuoteClick} title="System Transmission // Click to Cycle" >
                        <p className={`quote-text ${glitchingQuote ? 'quote-glitch-active' : ''}`} data-text={currentQuote} > {currentQuote} </p>
                    </div>
                    {/* Heading */}
                    {/* <div className={`hero-heading-container ${animationClass('delay-200')}`}>
                        <h1 className="hero-main-heading"> <span className="heading-perspective-wrapper"> <span className="main-heading-glitch main-heading-popout" data-text="mania-driven development"> mania-driven development </span> </span> </h1>
                    </div> */}
                        <motion.div variants={fadeIn} className="mt-6">
                                <h2 className="mania-title mania-glitch-text">
                                    <span data-text="[ Mania-Driven Development ]">[ Mania-Driven Development ]</span>
                                </h2>
                            </motion.div>
                </div>
                {/* Terminal & Contact */}
                <div className={`terminal-contact-row compact-row ${animationClass('delay-300')}`}>
                    <div className="terminal-container"> <div className="terminal-header"><div className="terminal-buttons"><div className="terminal-button red"></div><div className="terminal-button yellow"></div><div className="terminal-button green"></div></div><div className="terminal-label">// ACTIVE_FEED <span className="ellipsis-anim"></span></div></div> <div ref={terminalRef} className="terminal-text-area"><span className="terminal-prompt">{'>'}</span><span className={`terminal-text ${isDecryptingTerminal ? 'decrypting' : ''}`} data-text={terminalText}>{terminalText}</span><span className={`terminal-cursor ${showCursor ? 'visible' : ''}`}>_</span></div> <div className="terminal-scanline"></div> </div>
                    <Link href="/contact" className={`contact-btn ${animationClass('delay-350')} `}><span className="contact-btn-content">Establish Connection<ArrowUpRight className="contact-btn-icon" /></span><span className="contact-btn-glow"></span></Link>
                </div>
                {/* Featured Items */}
                 {displayItems.length > 0 && (
                     <div className={`featured-items-area compact-area ${animationClass('delay-500')}`}>
                         {displayItems.map((item, index) => {
                             const isDraft = item.draft === true;
                             const url = isDraft ? '#' : item.urlPath;
                             return (
                                 <div key={item.id || index} className={`featured-item-wrapper item-${index + 1}`}>
                                     <div className={`holographic-card group ${item.type === 'blog' ? 'card-is-blog' : 'card-is-project'} ${isDraft ? 'is-draft' : ''}`}>
                                          <div className="card-header"> {item.type === 'blog' ? <FileText size={14} className="icon" /> : <FolderGit2 size={14} className="icon" />} <span className="card-type-label">{item.type === 'blog' ? 'Log Entry' : 'Project File'}</span> {item.category && <div className="card-category-badge">{item.category.replace(/-/g, ' ')}</div>} </div>
                                          <div className="card-image-container"> <div className="image-link-wrapper"> <Link href={url} aria-label={item.title} onClick={(e) => handleDecodeClick(e, url, isDraft)} className={`card-image-link ${isDraft ? 'draft-disabled' : ''}`} aria-disabled={isDraft} tabIndex={isDraft ? -1 : 0}> {item.image ? <img src={item.image} alt="" className="card-image" loading="lazy"/> : <AsciiArtPlaceholder className="card-ascii-placeholder" animate={true} height="140px" width="100%" />} <div className="card-image-overlay"></div> </Link> {isDraft && <div className="draft-overlay"><span className="draft-overlay-text">// ACCESS_PENDING //</span><span className="draft-overlay-subtext">[ COMING SOON ]</span></div>} </div> </div>
                                          <div className="card-content-area">
                                               <h3 className={`card-title`}> {isDraft ? <span className="draft-title">{item.title}</span> : <Link href={url} className="animated-underline relative" onClick={(e) => handleDecodeClick(e, url, isDraft)}>{item.title}</Link>} </h3>
                                               <p className={`card-excerpt ${isDraft ? 'draft-excerpt' : ''}`}>{item.excerpt || (isDraft ? "// Metadata Redacted..." : "// No Description Available...")}</p>
                                               {!isDraft && ( <div className="card-link-wrapper"> <Link href={url} onClick={(e) => handleDecodeClick(e, url, isDraft)} className="decrypt-link group/link"> {decryptingLink === url ? ( <span className="decrypting-text"><svg className="decrypt-spinner" /*...*/></svg>Decrypting...</span> ) : ( <> &gt; {item.type === 'blog' ? 'Read Entry' : 'View Project'} <ArrowRight size={12} className="card-arrow"/> </> )} </Link> </div> )}
                                           </div>
                                     </div>
                                 </div>
                             );
                         })}
                     </div>
                 )}
                 {/* Empty State */}
                 {(!displayItems || displayItems.length === 0) && mounted && ( <div className={`empty-state compact-area ${animationClass('delay-500')}`}><p>// NO FEATURED TRANSMISSIONS //</p><p>[ Awaiting Signal Acquisition ]</p></div> )}
                {/* Enter Archives Button */}
                 <div className={`text-center mt-8 md:mt-10 ${animationClass('delay-700')}`}> <Link href="/blog" className="rabbit-trail group"> <span className="relative z-10">Enter the Archives</span> <div className="rabbit-hole-animation"> <Rabbit size={16} className="rabbit-icon"/> <div className="rabbit-hole"><svg viewBox="0 0 100 100" className="hole-svg"><circle cx="50" cy="50" r="45" fill="var(--bg-primary)" stroke="currentColor" strokeWidth="3" className="hole-circle-bg"/><circle cx="50" cy="50" r="45" fill="none" stroke="currentColor" strokeWidth="4" className="hole-circle-border"/><path d="M 50,50 m -40,0 a 40,40 0 1,0 80,0 a 40,40 0 1,0 -80,0" fill="none" stroke="currentColor" strokeWidth="1.5" strokeDasharray="2 4" className="hole-spiral"/></svg></div> </div> </Link> </div>
            </div> {/* End Container */}
           

            {/* --- Styles --- */}
            <style jsx>{`
                /* --- Base & Layout --- */
                 .hero-wrapper.themed { position: relative; overflow: hidden; padding-top: 2.5rem; padding-bottom: 3rem; background: var(--bg-gradient-dark), var(--bg-noise-standard); color: var(--text-primary); font-family: var(--font-body); min-height: auto; }
                 .hero-wrapper.hero-bottom-fade::after { content: ''; position: absolute; bottom: 0; left: 0; right: 0; height: 120px; background: linear-gradient(to bottom, transparent, var(--bg-primary) 90%); pointer-events: none; z-index: 15; }
                 .hero-bg-effects { position: absolute; inset: 0; z-index: 0; pointer-events: none; }
                 .hero-bg-effects > :global(*) { opacity: 0.12; }
                 .noise-overlay { position: absolute; inset: 0; background: var(--bg-noise-soft); opacity: 0.4; mix-blend-mode: overlay; z-index: 1; }
                 .mesh-gradient-overlay { position: absolute; inset: 0; z-index: -1; opacity: 0.25; }
                 * Ensure the hero content is always centered, even during initial load */
                .hero-wrapper,
                .hero-content-main,
                .mania-title,
                .hero-container {
                display: flex !important;
                flex-direction: column !important;
                align-items: center !important;
                justify-content: center !important;
                text-align: center !important;
                width: 100% !important;
                margin-left: auto !important;
                margin-right: auto !important;
                position: relative !important;
                }

                /* Hide content until styles are properly loaded */
                .mania-title {
                opacity: 0;
                animation: fade-in 0.3s ease-in forwards;
                animation-delay: 0.1s;
                }

                @keyframes fade-in {
                from { opacity: 0; }
                to { opacity: 1; }
                }

                /* Prevent layout shift for title */
                .mania-title {
                margin-left: auto !important;
                margin-right: auto !important;
                text-align: center !important;
                }

                /* Style for the glitch text */
                .mania-glitch-text {
                position: relative !important;
                display: inline-block !important;
                text-align: center !important;
                margin: 0 auto !important;
                font-size: clamp(1.5rem, 4vw, 2.5rem) !important;
                font-weight: bold !important;
                color: var(--text-heading) !important;
                letter-spacing: 0.05em !important;
                }

                /* Styles for the terminal section to prevent layout shift */
                .terminal-contact-row {
                display: flex !important;
                flex-direction: column !important;
                align-items: center !important;
                justify-content: center !important;
                width: 100% !important;
                max-width: 100% !important;
                margin-left: auto !important;
                margin-right: auto !important;
                }

                /* Ensure skeleton loads with proper centering */
                .hero-skeleton {
                display: flex !important;
                flex-direction: column !important;
                align-items: center !important;
                justify-content: center !important;
                width: 100% !important;
                max-width: 100% !important;
                text-align: center !important;
                padding: 2rem 1rem !important;
                }
                 .hero-content-main.compact-top { margin-bottom: 1.5rem; margin-top: 0; text-align: center; }

                /* --- Minimal Quote Styling --- */
                 .quote-wrapper { display: block; margin-bottom: 1.5rem; cursor: pointer; background: none; border: none; padding: 0; user-select: none; max-width: 65ch; margin-left: auto; margin-right: auto; min-height: 1.6em; position: relative; text-align: center; }
                 .quote-text { font-family: var(--font-mono); font-size: clamp(0.8rem, 1.6vw, 0.9rem); line-height: 1.6; color: var(--text-secondary); opacity: 0.65; transition: opacity 0.3s ease, color 0.3s ease, text-shadow 0.3s ease; position: relative; display: inline-block; padding: 0.1rem 0.3rem; text-shadow: 0 0 3px rgba(var(--bg-primary-rgb), 0.5); animation: subtle-flicker 18s infinite ease-in-out alternate; }
                 .quote-wrapper:hover .quote-text:not(.quote-glitch-active) { opacity: 0.9; color: var(--accent-highlight); text-shadow: 0 0 8px rgba(var(--accent-highlight-rgb), 0.3); animation-play-state: paused; }
                 @keyframes subtle-flicker { 0%, 100% { opacity: 0.6; filter: brightness(0.9); } 30% { opacity: 0.65; filter: brightness(1); } 70% { opacity: 0.55; filter: brightness(0.95); } }
                 /* Glitch Effect */
                  .quote-glitch-active { animation: ethereal-glitch-v2 ${QUOTE_GLITCH_DURATION_MS}ms ease-in-out forwards; color: transparent !important; text-shadow: none !important; opacity: 1 !important; }
                  .quote-glitch-active::before, .quote-glitch-active::after { content: attr(data-text); position: absolute; top: 0; left: 0; width: 100%; height: 100%; background: none; overflow: hidden; clip-path: none; opacity: 0.9; }
                  .quote-glitch-active::before { color: var(--accent-secondary); text-shadow: -0.5px 0 rgba(var(--accent-primary-rgb), 0.7); animation: glitch-layer-1 ${QUOTE_GLITCH_DURATION_MS / 2}ms infinite linear alternate-reverse; }
                  .quote-glitch-active::after { color: var(--accent-primary); text-shadow: 0.5px 0 rgba(var(--accent-alert-rgb), 0.6); animation: glitch-layer-2 ${QUOTE_GLITCH_DURATION_MS / 3}ms infinite linear alternate-reverse; }
                  @keyframes glitch-layer-1 { 0%, 100% { transform: translate(0, 0); opacity: 0.8; } 50% { transform: translate(1.5px, -0.5px); opacity: 0.5; } }
                  @keyframes glitch-layer-2 { 0%, 100% { transform: translate(0, 0); opacity: 0.7; } 33% { transform: translate(-0.5px, 0.5px); opacity: 0.9; } 66% { transform: translate(0.5px, 1px); opacity: 0.6; } }
                  @keyframes ethereal-glitch-v2 { 0% { opacity: 0.1; } 10%, 90% { opacity: 1; } 100% { opacity: 0.8; } }

                 /* --- V6 Refined Main Heading Styling --- */
                  .hero-heading-container { margin-bottom: 1.5rem; perspective: 1000px; }
                  .hero-main-heading { font-size: clamp(2.4rem, 7vw, 4.5rem); color: var(--text-heading); font-weight: 800; position: relative; display: inline-block; font-family: var(--font-display); letter-spacing: -0.035em; line-height: 1.05; }
                  .heading-perspective-wrapper { display: inline-block; transition: transform 0.4s ease-out; transform-style: preserve-3d; }
                  .hero-heading-container:hover .heading-perspective-wrapper { transform: translateZ(12px) rotateX(-3.5deg); }
                  .main-heading-popout { display: inline-block; transform-style: preserve-3d; transform: translateZ(28px) rotateX(-9deg) rotateY(1.2deg); text-shadow: 1px 1px 0px rgba(0,0,0, 0.18), 2px 2px 0px rgba(0,0,0, 0.16), 3px 3px 0px rgba(0,0,0, 0.14), 4px 4px 0px rgba(0,0,0, 0.12), 5px 5px 0px rgba(0,0,0, 0.10), 0 0 20px rgba(var(--accent-highlight-rgb), 0.3), 0 0 35px rgba(var(--accent-highlight-rgb), 0.2); transition: text-shadow 0.4s ease-out, transform 0.4s ease-out; animation: heading-float 12s infinite alternate ease-in-out; }
                  .hero-heading-container:hover .main-heading-popout { transform: translateZ(32px) rotateX(-10deg) rotateY(1.5deg); text-shadow: 1px 1px 0px rgba(0,0,0, 0.22), 2px 2px 0px rgba(0,0,0, 0.20), 3px 3px 0px rgba(0,0,0, 0.18), 4px 4px 0px rgba(0,0,0, 0.16), 5px 5px 0px rgba(0,0,0, 0.14), 6px 6px 0px rgba(0,0,0, 0.12), 7px 7px 0px rgba(0,0,0, 0.10), 0 0 25px rgba(var(--accent-highlight-rgb), 0.4), 0 0 40px rgba(var(--accent-highlight-rgb), 0.3); }
                  .main-heading-glitch::before, .main-heading-glitch::after { opacity: 0.5; content: attr(data-text); position: absolute; top: 0; left: 0; width: 100%; height: 100%; background: var(--bg-primary); overflow: hidden; color: var(--accent-muted1); }
                  .main-heading-glitch::before { left: 1px; animation: glitch-anim-subtle-1 4s infinite linear alternate steps(2, end); }
                  .main-heading-glitch::after { left: -1px; color: var(--accent-muted2); animation: glitch-anim-subtle-2 4.5s infinite linear alternate-reverse steps(3, start); }
                  @keyframes glitch-anim-subtle-1 { 0% { clip-path: rect(10px, 9999px, 30px, 0); } 100% { clip-path: rect(70px, 9999px, 90px, 0); } }
                  @keyframes glitch-anim-subtle-2 { 0% { clip-path: rect(50px, 9999px, 75px, 0); } 100% { clip-path: rect(20px, 9999px, 45px, 0); } }
                  @keyframes heading-float { from { transform: translateZ(27px) rotateX(-8.5deg) rotateY(1deg); } to { transform: translateZ(31px) rotateX(-9.5deg) rotateY(1.5deg); } }

                 /* --- Terminal & Contact (V6 Styles) --- */
                  .terminal-contact-row.compact-row { margin-bottom: 1.5rem; gap: 0.8rem; display: flex; flex-direction: column; align-items: center;}
                  @media (min-width: 768px) { .terminal-contact-row.compact-row { flex-direction: row; justify-content: center; gap: 1rem; align-items: center; } }
                  .terminal-container { max-width: 300px; background: rgba(var(--bg-terminal, var(--bg-secondary-rgb)), 0.97); border: 1px solid rgba(var(--accent-terminal-border, var(--accent-secondary-rgb)), 0.4); box-shadow: 0 1px 6px rgba(var(--shadow-color), 0.18), inset 0 0 6px rgba(var(--accent-terminal-glow, var(--accent-secondary-rgb)), 0.1); padding: 0.3rem 0.4rem 0.4rem 0.4rem; border-radius: var(--radius-sm); backdrop-filter: blur(6px); position: relative; width: 100%; margin: 0 auto; transition: box-shadow 0.3s ease; }
                  @media (min-width: 768px) { .terminal-container { width: 400px; max-width: 400px; margin: 0; flex-shrink: 0; } }
                  .terminal-header { display: flex; align-items: center; height: 1.1rem; margin-bottom: 0.3rem; padding: 0 0.15rem; }
                  .terminal-buttons { display: flex; gap: 0.35rem; } .terminal-button { width: 0.55rem; height: 0.55rem; border-radius: 50%; opacity: 0.9; } .terminal-button.red { background-color: #ff5f57; } .terminal-button.yellow { background-color: #febc2e; } .terminal-button.green { background-color: #28c840; }
                  .terminal-label { font-family: var(--font-mono); font-size: 0.6rem; color: var(--text-muted); text-transform: uppercase; letter-spacing: 0.08em; margin-left: auto; opacity: 0.8; padding-right: 0.2rem; }
                  .ellipsis-anim::after { content: '.'; animation: ellipsis-anim 1.5s infinite steps(3, end); display: inline-block; vertical-align: bottom; overflow: hidden; width: 1.2em; }
                  @keyframes ellipsis-anim { 0% { width: 0.3em; } 33% { width: 0.6em; } 66%, 100% { width: 0.9em; } }
                  .terminal-text-area { display: flex; align-items: baseline; font-family: var(--font-mono); font-size: 0.75rem; line-height: 1.45; color: var(--accent-terminal-text, var(--accent-primary)); padding: 0.3rem 0.4rem 0.15rem 0.4rem; min-height: 1.9rem; width: 100%; overflow: hidden; background: rgba(var(--bg-primary-rgb), 0.3); border-radius: 2px; border: 1px solid rgba(var(--accent-terminal-border, var(--accent-secondary-rgb)), 0.2); }
                  .terminal-prompt { color: var(--accent-terminal-prompt, var(--accent-secondary)); margin-right: 0.3rem; flex-shrink: 0; }
                  .terminal-text { flex-grow: 1; flex-shrink: 1; min-width: 0; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; text-align: left; position: relative; vertical-align: baseline; }
                  .terminal-text.decrypting { animation: terminal-decrypt 0.08s steps(1) infinite; }
                  .terminal-cursor { margin-left: 0.1rem; font-weight: bold; color: var(--accent-terminal-cursor, var(--accent-highlight)); vertical-align: baseline; flex-shrink: 0; animation: cursor-blink 1.06s infinite steps(2); opacity: 0; }
                  .terminal-cursor.visible { opacity: 1; }
                  .terminal-scanline { position: absolute; top: 0; left: 0; right: 0; bottom: 0; pointer-events: none; background: linear-gradient(to bottom, transparent 50%, rgba(var(--accent-terminal-glow, var(--accent-secondary-rgb)), 0.06) 51%, transparent 52%); background-size: 100% 2.5px; opacity: 0.4; animation: scan-anim 7s linear infinite; z-index: -1; }
                  @keyframes scan-anim { from { background-position: 0 0; } to { background-position: 0 70px; } }
                  @keyframes cursor-blink { 0%, 100% { opacity: 1; } 50% { opacity: 0; } }
                  @keyframes terminal-decrypt { 0% { filter: brightness(1.2) contrast(1.1); } 50% { filter: brightness(0.9) contrast(0.9) } 100% { filter: none; } }
                  .contact-btn { display: inline-flex; align-items: center; justify-content: center; font-family: var(--font-mono); font-size: 0.8rem; font-weight: 600; text-transform: uppercase; letter-spacing: 0.06em; padding: 0.6rem 1.3rem; border-radius: 4px; border: 1px solid var(--accent-primary); color: var(--bg-primary); background: linear-gradient(45deg, var(--accent-primary), var(--accent-highlight)); box-shadow: 2px 2px 0px rgba(var(--accent-primary-rgb), 0.6), 0 0 15px rgba(var(--accent-highlight-rgb), 0.2); transition: all 0.2s ease-out; text-decoration: none; position: relative; overflow: hidden; margin-top: 0.5rem; }
                  @media (min-width: 768px) { .contact-btn { margin-top: 0; } }
                  .contact-btn-content { display: inline-flex; align-items: center; gap: 0.5rem; position: relative; z-index: 2; }
                  .contact-btn-icon { width: 1rem; height: 1rem; transition: transform 0.2s ease; }
                  .contact-btn:hover .contact-btn-icon { transform: translateX(2px) translateY(-2px); }
                  .contact-btn:hover { border-color: white; color: white; transform: translate(-1px, -1px); box-shadow: 3px 3px 0px rgba(var(--accent-primary-rgb), 0.8), 0 0 20px rgba(var(--accent-highlight-rgb), 0.4); background: linear-gradient(45deg, var(--accent-highlight), var(--accent-primary)); }
                  .contact-btn-glow { position: absolute; inset: -2px; z-index: 1; background: radial-gradient(circle, rgba(var(--accent-highlight-rgb), 0.5) 0%, transparent 70%); filter: blur(10px); opacity: 0; transition: opacity 0.3s ease; }
                  .contact-btn:hover .contact-btn-glow { opacity: 0.6; }

                 /* --- Featured Items (V6 Styles) --- */
                 .featured-items-area.compact-area { margin-top: 1.5rem; gap: 0.8rem; min-height: 270px; display: grid; grid-template-columns: repeat(6, 1fr); position: relative; }
                 .featured-item-wrapper { transition: transform 0.3s ease-out; position: relative; }
                 .item-1 { grid-column: 1 / span 2; grid-row: 1; transform: rotate(-1.8deg) translateX(-4px) translateY(4px); z-index: 3; } .item-2 { grid-column: 3 / span 2; grid-row: 1; transform: rotate(1.2deg) translateY(-4px) translateX(4px); z-index: 2; } .item-3 { grid-column: 5 / span 2; grid-row: 1; transform: rotate(2.2deg) translateY(2px) translateX(0px); z-index: 1; } .item-4 { grid-column: 2 / span 2; grid-row: 2; transform: rotate(-1.5deg) translateY(-15px) translateX(-5px); z-index: 4; } .item-5 { grid-column: 4 / span 2; grid-row: 2; transform: rotate(2.0deg) translateY(-18px) translateX(5px); z-index: 0; }
                 @media (max-width: 1024px) { .featured-items-area { grid-template-columns: repeat(4, 1fr); gap: 0.6rem; } .item-1 { grid-column: 1 / span 2; } .item-2 { grid-column: 3 / span 2; } .item-3 { grid-column: 1 / span 2; grid-row: 2; transform: rotate(-1deg) translateY(-10px) translateX(-2px); } .item-4 { grid-column: 3 / span 2; grid-row: 2; transform: rotate(1deg) translateY(-12px) translateX(2px); } .item-5 { display: none; } }
                 @media (max-width: 767px) { .featured-items-area { grid-template-columns: 1fr; gap: 1rem; min-height: auto; } .featured-item-wrapper { grid-column: auto !important; grid-row: auto !important; transform: none !important; z-index: auto !important; } }
                 .holographic-card { min-height: 250px; background: rgba(var(--bg-tertiary-rgb), 0.35); border: 1px solid rgba(var(--accent-primary-rgb), 0.12); border-radius: 8px 3px 10px 4px; padding: 0; overflow: hidden; transition: transform 0.3s ease, box-shadow 0.3s ease; box-shadow: 0 3px 10px rgba(var(--shadow-color), 0.12), inset 0 0 4px rgba(var(--bg-primary-rgb), 0.15); backdrop-filter: blur(6px); -webkit-backdrop-filter: blur(6px); z-index: 1; height: 100%; display: flex; flex-direction: column; position: relative; }
                 .featured-item-wrapper > .holographic-card { height: 100%; }
                 .holographic-card:hover { box-shadow: 0 10px 25px rgba(var(--shadow-color), 0.25), inset 0 0 8px rgba(var(--bg-primary-rgb), 0.1), 0 0 15px rgba(var(--accent-highlight-rgb), 0.1); transform: var(--card-transform, translateY(-3px)) scale(1.015); }
                 .card-header { padding: 0.3rem 0.5rem; display: flex; align-items: center; gap: 0.35rem; border-bottom: 1px solid rgba(var(--text-primary-rgb), 0.05); background: rgba(var(--bg-secondary-rgb), 0.25); }
                 .card-header .icon { width: 14px; height: 14px; flex-shrink: 0; } .card-type-label { font-family: var(--font-mono); font-size: 0.6rem; text-transform: uppercase; letter-spacing: 0.05em; opacity: 0.8; } .card-category-badge { padding: 0.1rem 0.4rem; font-size: 0.55rem; font-weight: 600; border-radius: 3px; text-transform: capitalize; margin-left: auto; }
                 .card-is-blog .card-header .icon { color: var(--accent-secondary); } .card-is-blog .card-category-badge { background-color: rgba(var(--accent-secondary-rgb), 0.2); color: var(--accent-secondary); border: 1px solid rgba(var(--accent-secondary-rgb), 0.3); }
                 .card-is-project .card-header .icon { color: var(--accent-primary); } .card-is-project .card-category-badge { background-color: rgba(var(--accent-primary-rgb), 0.2); color: var(--accent-primary); border: 1px solid rgba(var(--accent-primary-rgb), 0.3); }
                 .card-image-container { position: relative; aspect-ratio: 16 / 9.5; overflow: hidden; }
                 .image-link-wrapper { position: relative; display: block; width: 100%; height: 100%; }
                 .card-image-link.draft-disabled { cursor: default; }
                 .card-image { display: block; width: 100%; height: 100%; object-fit: cover; transition: transform 0.4s ease, filter 0.4s ease; filter: saturate(0.9); }
                 .group:hover .holographic-card:not(.is-draft) .card-image { transform: scale(1.05); filter: saturate(1.1); }
                 .card-ascii-placeholder { padding: 0.5rem; height: 100%; width: 100%; display: flex; align-items: center; justify-content: center; background: var(--bg-secondary); color: var(--accent-primary); opacity: 0.6; font-size: 0.6rem; line-height: 1; }
                 .card-image-overlay { position: absolute; inset: 0; background: linear-gradient(to top, rgba(var(--bg-primary-rgb), 0.5) 0%, transparent 40%); pointer-events: none; }
                 .draft-overlay { position: absolute; inset: 0; z-index: 5; display: flex; flex-direction: column; align-items: center; justify-content: center; background: rgba(var(--bg-primary-rgb), 0.88); backdrop-filter: blur(1.5px); color: var(--accent-alert); text-align: center; font-family: var(--font-mono); opacity: 0; animation: fade-in-draft-overlay 0.4s ease forwards; border-top: 1px dashed rgba(var(--accent-alert-rgb), 0.4); }
                 @keyframes fade-in-draft-overlay { from { opacity: 0; } to { opacity: 1; } }
                 .draft-overlay-text { font-size: 0.75rem; font-weight: bold; text-transform: uppercase; letter-spacing: 0.1em; margin-bottom: 0.2rem; text-shadow: 0 0 4px var(--accent-alert); }
                 .draft-overlay-subtext { font-size: 0.65rem; opacity: 0.8; letter-spacing: 0.05em; }
                 .card-content-area { padding: 0.6rem 0.7rem 0.7rem 0.7rem; flex-grow: 1; display: flex; flex-direction: column; }
                 .card-title { font-size: 0.95rem; line-height: 1.25; margin-bottom: 0.25rem; font-weight: 600; color: var(--text-heading); }
                 .card-title a { color: inherit; text-decoration: none; }
                 .draft-title { color: var(--text-muted); }
                 .card-excerpt { font-size: 0.8rem; line-height: 1.45; margin-bottom: 0.6rem; color: var(--text-secondary); max-height: 4.35em; overflow: hidden; position: relative; mask-image: linear-gradient(to bottom, black 70%, transparent 100%); -webkit-mask-image: linear-gradient(to bottom, black 70%, transparent 100%); }
                 .draft-excerpt { filter: blur(1.2px); opacity: 0.65; mask-image: none; -webkit-mask-image: none; color: var(--text-muted); }
                 .card-link-wrapper { padding-top: 0.3rem; border-top: 1px solid rgba(var(--accent-primary-rgb), 0.1); text-align: right; margin-top: auto; }
                 .decrypt-link { display: inline-flex; align-items: center; gap: 0.3rem; font-family: var(--font-mono); font-size: 0.75rem; color: var(--accent-primary); transition: color 0.2s ease, letter-spacing 0.2s ease; text-transform: uppercase; letter-spacing: 0.05em; cursor: pointer; }
                 .group\/link:hover .decrypt-link { color: var(--accent-highlight); letter-spacing: 0.07em; }
                 .decrypting-text { display: inline-flex; align-items: center; color: var(--accent-highlight); font-style: italic; }
                 .decrypt-spinner { width: 0.9rem; height: 0.9rem; margin-right: 0.4rem; animation: spin 1s linear infinite; }
                 @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
                 .card-arrow { width: 12px; height: 12px; margin-left: 0.25rem; transition: transform 0.2s ease; }
                 .group\/link:hover .card-arrow { transform: translateX(3px); }

                 /* --- Enter Archives Button --- */
                 .rabbit-trail { 
                     display: inline-flex; align-items: center; justify-content: center; 
                     padding: 0.7rem 1.5rem; font-family: var(--font-display); font-size: 0.9rem; font-weight: 600; 
                     color: var(--text-primary); background: var(--bg-secondary); 
                     border: 1px solid rgba(var(--accent-secondary-rgb), 0.4); border-radius: 5px; 
                     box-shadow: var(--shadow-medium); text-decoration: none; position: relative; overflow: hidden; 
                     transition: all 0.3s ease; letter-spacing: 0.03em; 
                 }
                 
                 /* Light mode specific styling for rabbit trail */
                 :root .rabbit-trail {
                     color: var(--color-light-ink); /* Dark text for light mode */
                     background: var(--color-light-paper);
                     border-color: rgba(var(--color-light-burgundy), 0.4);
                 }
                 
                 /* Dark mode specific styling for rabbit trail */
                 html.dark .rabbit-trail {
                     color: var(--text-primary); /* Light text for dark mode */
                     background: var(--bg-secondary);
                     border-color: rgba(var(--accent-secondary-rgb), 0.4);
                 }
                 
                 .rabbit-trail:hover { 
                     background: var(--bg-tertiary); border-color: var(--accent-secondary); 
                     color: var(--accent-secondary); box-shadow: var(--shadow-lifted), 0 0 15px rgba(var(--accent-secondary-rgb), 0.2); 
                     transform: translateY(-2px); 
                 }
                 
                 /* Light mode hover styling */
                 :root .rabbit-trail:hover {
                     background: var(--color-light-cream);
                     border-color: var(--color-light-burgundy);
                     color: var(--color-light-burgundy);
                 }
                 
                 /* Dark mode hover styling */
                 html.dark .rabbit-trail:hover {
                     background: var(--bg-tertiary);
                     border-color: var(--accent-secondary);
                     color: var(--accent-secondary);
                 }

                 /* --- Animation & Utility --- */
                 @keyframes fadeInUp { from { opacity: 0; transform: translateY(12px); filter: blur(2px); } to { opacity: 1; transform: translateY(0); filter: blur(0); } }
                 .fade-in-up { animation: fadeInUp 0.45s ease-out both; }
                 .delay-100 { animation-delay: 0.1s; } .delay-200 { animation-delay: 0.18s; } .delay-300 { animation-delay: 0.26s; } .delay-350 { animation-delay: 0.30s; } .delay-500 { animation-delay: 0.4s; } .delay-700 { animation-delay: 0.5s; }
                 .animated-underline::after { content: ''; position: absolute; width: 0; height: 1.5px; display: block; margin-top: 2px; right: 0; background: var(--accent-highlight); transition: width .3s ease; }
                 .animated-underline:hover::after { width: 100%; left: 0; background: var(--accent-highlight); }
                 .empty-state { text-align: center; padding: 1.5rem; color: var(--text-muted); font-family: var(--font-mono); font-size: 0.8rem; border: 1px dashed var(--bg-tertiary); border-radius: var(--radius-base); background: rgba(var(--bg-secondary-rgb), 0.2); margin-top: 1.5rem; /* Compressed */ }

            `}</style>
        </div>
    );
}