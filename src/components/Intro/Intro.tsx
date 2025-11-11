"use client";
// src/components/Intro.tsx
import React from 'react';
import { Limelight } from 'next/font/google';
import Container from "../Container"; // Assuming this provides centering/max-width
import FadeInLong from "../FadeIn"; // Assuming this handles fade-in

const limelight = Limelight({ subsets: ['latin'], weight: '400', display: 'swap' });

const Intro = () => {
  return (
    // Outer wrapper with background and increased padding
    <div
      // Added more padding: px-8 sm:px-12 md:px-16 lg:px-20
      className="intro-wrapper relative overflow-hidden py-20 sm:py-24 md:py-28 lg:py-32 px-8 sm:px-12 md:px-16 lg:px-20"
      style={{
        // Background using theme variables for the overlay
        background: `linear-gradient(var(--bg-overlay-start, rgba(32, 22, 36, 0.85)), var(--bg-overlay-end, rgba(32, 22, 36, 0.98))), url(//images.weserv.nl/?url=i.imgur.com/6QJjYMe.jpg) center center / cover no-repeat fixed`,
        backgroundSize: "cover",
        backgroundPosition: "center center",
      }}
    >
      {/* Centering Container */}
      <Container> {/* Handles max-width and mx-auto */}
        <FadeInLong>
          {/* Text wrapper */}
          <div className="neon-text-wrapper w-full text-center">
              {/* Use a semantic tag like h2 or p */}
              {/* The 'neon-text' class will be styled by styled-jsx below */}
              <h2 className={`neon-text ${limelight.className}`}>
                 We&apos;re all mad here
              </h2>
          </div>
        </FadeInLong>
      </Container>

      {/* --- STYLES DEFINED IN-COMPONENT --- */}
      <style jsx>{`
        .neon-text-wrapper {
          perspective: 400px; /* Optional: For 3D effects */
        }

        .neon-text {
          /* --- ADJUSTED Font Size (Smaller Max) --- */
          font-size: clamp(1.9rem, 7vw, 4.8rem); /* Min, Preferred, Max */
          font-weight: normal; /* Adjust based on font */
          line-height: 1.4;
          color: var(--neon-text-color, #00ffff); /* Base color with fallback */
          filter: brightness(1.15); /* Make text slightly brighter */
          margin: 0; /* Reset margin if using h2 */
          padding: 0; /* Reset padding */

          /* --- NEON GLOW using text-shadow --- */
          text-shadow:
            0 0 3px var(--bg-primary, #000), /* Cutout effect */
            0 0 5px var(--neon-glow-color-1, #00ffff),
            0 0 12px var(--neon-glow-color-1, #00ffff),
            0 0 25px var(--neon-glow-color-2, #39a7ff),
            0 0 45px var(--neon-glow-color-2, #39a7ff),
            0 0 65px var(--neon-glow-color-2, #39a7ff);

          /* --- Animation --- */
          animation: flickerNeon 7s infinite alternate ease-in-out;

          /* Improve text rendering */
          -webkit-font-smoothing: antialiased;
          -moz-osx-font-smoothing: grayscale;
        }

        @keyframes flickerNeon {
          0%, 18%, 22%, 25%, 53%, 57%, 100% {
            /* Standard glow */
            text-shadow:
              0 0 3px var(--bg-primary, #000),
              0 0 5px var(--neon-glow-color-1, #00ffff),
              0 0 12px var(--neon-glow-color-1, #00ffff),
              0 0 25px var(--neon-glow-color-2, #39a7ff),
              0 0 45px var(--neon-glow-color-2, #39a7ff),
              0 0 65px var(--neon-glow-color-2, #39a7ff);
            opacity: 1;
          }
          20%, 24%, 55% {
            /* Dimmer glow */
            text-shadow:
              0 0 2px var(--bg-primary, #000),
              0 0 4px var(--neon-glow-color-1, #00ffff),
              0 0 10px var(--neon-glow-color-1, #00ffff),
              0 0 18px var(--neon-glow-color-2, #39a7ff);
            opacity: 0.9;
          }
        }

        /* --- Responsiveness for text-shadow (Optional) --- */
        /* You might reduce blur/spread on smaller screens if needed */
        @media (max-width: 640px) {
          .neon-text {
            /* Slightly reduced glow on small screens */
             text-shadow:
                0 0 2px var(--bg-primary, #000),
                0 0 4px var(--neon-glow-color-1, #00ffff),
                0 0 8px var(--neon-glow-color-1, #00ffff),
                0 0 15px var(--neon-glow-color-2, #39a7ff),
                0 0 25px var(--neon-glow-color-2, #39a7ff);
          }
        }
      `}</style>
    </div>
  );
};

export default Intro;