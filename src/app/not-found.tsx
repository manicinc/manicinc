// src/app/not-found.tsx
"use client";

import { useEffect, useState, useCallback } from "react"; // Added useCallback
import Link from "next/link";
import { usePathname } from "next/navigation";
import Image, { StaticImageData } from "next/image"; // Ensure StaticImageData is imported if using typed arrays

// Import themed Nav if available, otherwise assume it's handled in layout
// import { Nav } from "@/components/Nav";

// --- Import 404 Images ---
// Ensure these paths are correct relative to your project structure
import dark1 from "@/images/404/dark-1.png";
import dark2 from "@/images/404/dark-2.png";
import dark3 from "@/images/404/dark-3.png";
import dark4 from "@/images/404/dark-4.png";
import white1 from "@/images/404/white-1.png";
import white2 from "@/images/404/white-2.png";
import white3 from "@/images/404/white-3.png";
import white4 from "@/images/404/white-4.png";

// Define image sets (typing helps prevent errors)
const darkImages: StaticImageData[] = [dark1, dark2, dark3, dark4];
const whiteImages: StaticImageData[] = [white1, white2, white3, white4];

export default function NotFound() {
    const pathname = usePathname();
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [isGlitching, setIsGlitching] = useState(false);
    const [activeTheme, setActiveTheme] = useState<'dark' | 'light'>('dark'); // Default to dark, detect on mount
    const [mounted, setMounted] = useState(false);

    // --- Theme Detection ---
    useEffect(() => {
        setMounted(true);
        // Function to check theme
        const checkTheme = () => {
            // Check for dark class on html element (adjust if your toggle uses body or other selector)
            const isDark = document.documentElement.classList.contains('dark');
            setActiveTheme(isDark ? 'dark' : 'light');
        };

        checkTheme(); // Check immediately on mount

        // Optional: Observe theme changes if they can happen without page reload
        const observer = new MutationObserver((mutationsList) => {
            for (let mutation of mutationsList) {
                if (mutation.type === 'attributes' && mutation.attributeName === 'class') {
                    checkTheme();
                }
            }
        });

        observer.observe(document.documentElement, { attributes: true });

        // Cleanup observer on unmount
        return () => observer.disconnect();
    }, []); // Runs only once on mount

    // Determine which image set to use based on detected theme
    const imageSet = activeTheme === 'dark' ? darkImages : whiteImages;

    // --- Old Blog Slug Redirection ---
    useEffect(() => {
        if (pathname && pathname.startsWith("/blog/") && pathname.split("/").length === 3) {
            const slug = pathname.split("/").pop();
            // Assuming categories are lowercased in the URL structure
            const categories = ["thinkpieces", "tutorials", "case-studies", "guides"]; // Add all potential categories
            const checkCategory = async (index: number): Promise<void> => {
                if (!slug || index >= categories.length) return; // Exit if no slug or no more categories
                const url = `/blog/${categories[index]}/${slug}`;
                try {
                     // Use HEAD request to check existence without downloading content
                     const res = await fetch(url, { method: 'HEAD' });
                     if (res.ok) {
                         // If found, redirect
                         window.location.href = url;
                     } else {
                         // If not found, check next category
                         checkCategory(index + 1);
                     }
                 } catch (error) {
                     // Network error or other issue, check next category
                     console.warn(`Error checking old slug URL ${url}:`, error);
                     checkCategory(index + 1);
                 }
             };
             checkCategory(0); // Start checking from the first category
         }
     }, [pathname]); // Re-run if pathname changes

    // --- Image Glitching Effect ---
    useEffect(() => {
        if (!mounted) return; // Don't run interval until mounted

        const intervalId = setInterval(() => {
            setIsGlitching(true);
            // Use setTimeout to ensure state update happens before reverting
            setTimeout(() => {
                 // Pick a new random index, ensuring it's different from the current one if possible
                 let newIndex = currentImageIndex;
                 if (imageSet.length > 1) {
                     do {
                         newIndex = Math.floor(Math.random() * imageSet.length);
                     } while (newIndex === currentImageIndex);
                 }
                 setCurrentImageIndex(newIndex);
                 setIsGlitching(false); // End glitch effect after image changes
             }, 120); // Duration of the visual glitch (slightly shorter)
        }, 4500); // Interval between glitches (e.g., every 4.5 seconds)

        // Cleanup interval on unmount or when imageSet changes
        return () => clearInterval(intervalId);
    }, [mounted, imageSet, currentImageIndex]); // Add currentImageIndex to ensure new random index is different

    return (
        <>
            {/* If Nav is handled by layout, this div might not be needed */}
            {/* <div className='bg-[color:var(--bg-secondary)]'> <Nav /> </div> */}
            <div
                className="not-found-page flex min-h-screen flex-col items-center justify-center p-6 sm:p-8"
            >
                {/* Background Effects */}
                <div className="background-overlay absolute inset-0 z-0 overflow-hidden">
                     <div className="shape shape-1"></div>
                     <div className="shape shape-2"></div>
                     <div className="noise-layer"></div> {/* Add noise layer */}
                </div>

                {/* Content */}
                <div className="relative z-10 flex flex-col items-center">
                    {/* Image Container */}
                    <div className="image-container relative mb-6 w-full max-w-sm aspect-square overflow-hidden">
                        {/* Use AnimatePresence if you want cross-fade, requires unique key */}
                         {mounted && imageSet[currentImageIndex] && ( // Ensure image exists before rendering
                            <Image
                                key={currentImageIndex} // Change key to trigger potential animation
                                src={imageSet[currentImageIndex]}
                                alt="Abstract 404 Glitch Art"
                                fill
                                priority // Prioritize loading the 404 image
                                sizes="(max-width: 640px) 90vw, 448px" // Provide sizes hint
                                className={`image-element ${isGlitching ? 'animate-glitch-image' : ''}`}
                            />
                         )}
                        <div className="image-border-overlay"></div> {/* Overlay for border effect */}
                    </div>

                    {/* Heading */}
                    <h1 className="title-404 mb-3 text-center">
                        <span className="glitch-text-layer" data-text="404">404</span>
                    </h1>

                    {/* Subtitle */}
                    <p className="subtitle mb-8 text-center">
                        Signal lost... this frequency doesn't resonate within the nexus.
                    </p>

                    {/* Return Button */}
                    <Link href="/" className="return-button group">
                        <span>Return to Origin</span>
                        {/* Consider adding an icon like Home or ArrowLeft */}
                    </Link>
                </div>

                 {/* Global Styles Specific to 404 Page */}
                 <style jsx global>{`
                     .not-found-page {
                         background-color: var(--bg-primary);
                         color: var(--text-primary);
                         transition: background-color 0.3s ease, color 0.3s ease;
                         position: relative; /* Needed for absolute background */
                     }

                     /* Background Effects */
                     .background-overlay { pointer-events: none; }
                     .noise-layer {
                        position: absolute;
                        inset: 0;
                        background-image: url('/assets/images/noise.svg'); /* Use your noise pattern */
                        opacity: 0.04;
                        mix-blend-mode: overlay;
                     }
                     .shape {
                        position: absolute;
                        border-radius: 30% 70% 70% 30% / 30% 30% 70% 70%; /* Organic blob shape */
                        opacity: 0.1;
                        filter: blur(60px);
                        animation: shape-morph-rotate 25s infinite linear alternate;
                     }
                     .shape-1 {
                         width: 50vmax; height: 50vmax; top: -20%; left: -20%;
                         background: var(--accent-primary);
                         animation-duration: 30s;
                     }
                     .shape-2 {
                         width: 40vmax; height: 40vmax; bottom: -15%; right: -15%;
                         background: var(--accent-secondary);
                         animation-delay: -5s;
                         animation-duration: 22s;
                     }
                     @keyframes shape-morph-rotate {
                         0% { transform: rotate(0deg) scale(1); border-radius: 30% 70% 70% 30% / 30% 30% 70% 70%; }
                         100% { transform: rotate(360deg) scale(1.1); border-radius: 70% 30% 30% 70% / 70% 70% 30% 30%; }
                     }

                     /* Image Container Styling */
                     .image-container {
                         border-radius: 12px 6px 18px 8px; /* Organic radius */
                         border: 1px solid rgba(var(--text-primary-rgb, 255, 255, 255), 0.1);
                         box-shadow: 0 10px 30px rgba(var(--shadow-color), 0.2), inset 0 0 15px rgba(var(--shadow-color), 0.1);
                         position: relative; /* For border overlay */
                     }
                     .image-border-overlay { /* Creates the inner glow/border */
                          position: absolute;
                          inset: 0;
                          border-radius: inherit;
                          box-shadow: inset 0 0 8px 2px rgba(var(--accent-highlight-rgb), 0.3), inset 0 0 2px 1px rgba(var(--accent-highlight-rgb), 0.2);
                          pointer-events: none;
                          opacity: 0.8;
                          transition: box-shadow 0.3s ease, opacity 0.3s ease;
                      }
                     .image-container:hover .image-border-overlay {
                          opacity: 1;
                           box-shadow: inset 0 0 12px 3px rgba(var(--accent-highlight-rgb), 0.4), inset 0 0 3px 1px rgba(var(--accent-highlight-rgb), 0.3);
                      }

                     .image-element {
                         object-fit: cover;
                         transition: transform 0.3s ease-out, filter 0.2s linear; /* Smooth transitions */
                         filter: saturate(0.9) contrast(1.05); /* Subtle image adjustment */
                     }
                     .image-container:hover .image-element:not(.animate-glitch-image) {
                         transform: scale(1.03);
                     }

                     /* Image Glitch Animation */
                     @keyframes glitch-image-anim {
                         0% { transform: translate(0, 0) scale(1.03); opacity: 1; filter: contrast(1.2) brightness(1.1); }
                         10% { transform: translate(-3px, 2px) scale(1.03); }
                         20% { transform: translate(3px, -2px) scale(1.03); filter: contrast(1.5) brightness(0.9) saturate(1.5); }
                         30% { transform: translate(-3px, -1px) scale(1.03); }
                         40% { transform: translate(3px, 1px) scale(1.03); }
                         50% { transform: translate(-3px, 3px) scale(1.03); filter: contrast(1.1) brightness(1.2) saturate(0.8); }
                         60% { transform: translate(3px, -3px) scale(1.03); }
                         70% { transform: translate(-3px, 1px) scale(1.03); }
                         80% { transform: translate(3px, -1px) scale(1.03); filter: contrast(1.3) brightness(1.0); }
                         90% { transform: translate(-3px, 0px) scale(1.03); }
                         100% { transform: translate(0, 0) scale(1.03); opacity: 1; filter: contrast(1.2) brightness(1.1); }
                     }
                     .animate-glitch-image {
                         animation: glitch-image-anim 120ms linear forwards; /* Run once */
                     }

                     /* Title Styling */
                     .title-404 {
                         font-family: var(--font-display); /* Or --font-mono */
                         font-size: clamp(4rem, 15vw, 8rem); /* Responsive size */
                         font-weight: 900;
                         letter-spacing: 0.1em; /* Wide spacing */
                         color: var(--text-heading);
                         position: relative;
                         line-height: 1;
                     }
                     .glitch-text-layer {
                         position: relative;
                         display: inline-block; /* Important for pseudo-elements */
                         /* Base text shadow */
                         text-shadow: 0 0 5px rgba(var(--accent-primary-rgb), 0.5),
                                      0 0 10px rgba(var(--accent-secondary-rgb), 0.3);
                     }
                     .glitch-text-layer::before,
                     .glitch-text-layer::after {
                         content: attr(data-text);
                         position: absolute;
                         top: 0;
                         left: 0;
                         width: 100%;
                         height: 100%;
                         background: transparent;
                         overflow: hidden;
                         clip-path: polygon(0 0, 100% 0, 100% 100%, 0% 100%);
                     }
                     .glitch-text-layer::before {
                         left: 2px;
                         text-shadow: -2px 0 var(--accent-primary); /* Use theme color */
                         animation: text-glitch-anim 2s infinite linear alternate-reverse;
                     }
                      .glitch-text-layer::after {
                         left: -2px;
                         text-shadow: 2px 0 var(--accent-secondary); /* Use theme color */
                         animation: text-glitch-anim 2.5s infinite linear alternate-reverse; /* Different timing */
                     }
                     @keyframes text-glitch-anim {
                         0% { clip-path: polygon(0 0, 100% 0, 100% 5%, 0 5%); }
                         10% { clip-path: polygon(0 40%, 100% 40%, 100% 45%, 0 45%); transform: translate(-1px, 1px); }
                         20% { clip-path: polygon(0 80%, 100% 80%, 100% 90%, 0 90%); transform: translate(1px, -1px); }
                         30% { clip-path: polygon(0 20%, 100% 20%, 100% 22%, 0 22%); }
                         40% { clip-path: polygon(0 60%, 100% 60%, 100% 75%, 0 75%); transform: translate(-1px, -1px); }
                         50% { clip-path: polygon(0 15%, 100% 15%, 100% 18%, 0 18%); }
                         60% { clip-path: polygon(0 50%, 100% 50%, 100% 55%, 0 55%); transform: translate(1px, 1px); }
                         70% { clip-path: polygon(0 90%, 100% 90%, 100% 100%, 0 100%); }
                         80% { clip-path: polygon(0 30%, 100% 30%, 100% 35%, 0 35%); transform: translate(-1px, 0); }
                         90% { clip-path: polygon(0 70%, 100% 70%, 100% 80%, 0 80%); transform: translate(1px, 0); }
                         100% { clip-path: polygon(0 5%, 100% 5%, 100% 10%, 0 10%); }
                     }


                     /* Subtitle Styling */
                     .subtitle {
                         font-family: var(--font-body);
                         color: var(--text-secondary);
                         font-size: 1.1rem;
                         max-width: 45ch; /* Limit line length */
                         line-height: 1.6;
                     }
                     @media (min-width: 640px) {
                         .subtitle { font-size: 1.25rem; }
                     }

                     /* Button Styling (Adapting rabbit-hole-btn) */
                     .return-button {
                         display: inline-flex; /* Use flex for potential icon */
                         align-items: center;
                         justify-content: center;
                         padding: 0.75rem 2rem; /* Adjust padding */
                         font-family: var(--font-mono);
                         font-size: 0.9rem; /* Adjust size */
                         font-weight: 600;
                         text-transform: uppercase;
                         letter-spacing: 0.05em;
                         border-radius: var(--radius-base); /* Match theme */
                         position: relative;
                         overflow: hidden;
                         z-index: 1;
                         transition: all 0.3s ease-out;
                         /* Theme Colors */
                         border: 1px solid var(--accent-primary);
                         background-color: transparent;
                         color: var(--accent-primary);
                     }
                     .return-button::before { /* Fill effect */
                         content: '';
                         position: absolute;
                         inset: 0;
                         background: linear-gradient(45deg, var(--accent-primary), var(--accent-highlight));
                         transform: scaleY(0);
                         transform-origin: bottom;
                         transition: transform 0.4s cubic-bezier(0.7, 0, 0.3, 1);
                         z-index: -1;
                         border-radius: inherit; /* Match parent radius */
                     }
                     .return-button:hover {
                         color: var(--text-on-accent); /* Change text color */
                         border-color: transparent; /* Hide border */
                         transform: translateY(-2px);
                         box-shadow: 0 5px 15px rgba(var(--accent-primary-rgb), 0.3);
                     }
                     .return-button:hover::before {
                         transform: scaleY(1); /* Scale up to fill */
                         transform-origin: top;
                     }

                 `}</style>
            </div>
        </>
    );
}