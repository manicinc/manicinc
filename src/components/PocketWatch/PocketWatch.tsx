// src/components/PocketWatch/PocketWatch.tsx
import React from 'react';
import styles from './PocketWatch.module.css';

interface PocketWatchProps {
  elapsedTime: number; // Time in seconds
}

// Helper function to format time (MM:SS)
const formatTime = (totalSeconds: number): string => {
  if (totalSeconds < 0) totalSeconds = 0;
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(
    2,
    '0'
  )}`;
};

const PocketWatch: React.FC<PocketWatchProps> = ({ elapsedTime }) => {
  const formattedTime = formatTime(elapsedTime);
  // Calculate second hand rotation (360 degrees / 60 seconds = 6 degrees per second)
  const secondHandRotation = (elapsedTime % 60) * 6;

  return (
    <div className={styles.pocketWatchWrapper} title={`Time on page: ${formattedTime}`}>
       {/* Simplified Pocket Watch SVG */}
       <svg
          viewBox="0 0 30 35" // Adjusted viewBox for crown
          className={styles.pocketWatchSvg}
          aria-hidden="true"
          xmlns="http://www.w3.org/2000/svg"
        >
         {/* Crown */}
         <path className={styles.pocketWatchCrown} d="M13 2.5 A 2 2 0 0 1 17 2.5 V 1 A 1 1 0 0 1 18 0 H 12 A 1 1 0 0 1 13 1 Z" />
         {/* Outer Frame */}
         <circle className={styles.pocketWatchFrame} cx="15" cy="17.5" r="14" />
         {/* Inner Face */}
         <circle className={styles.pocketWatchFace} cx="15" cy="17.5" r="12" />
         {/* Time Text */}
         <text x="15" y="18" className={styles.pocketWatchText}>
           {formattedTime}
         </text>
         {/* Optional: Second Hand */}
         <line
            x1="15" y1="17.5" x2="15" y2="8"
            className={styles.pocketWatchHand}
            style={{ transform: `rotate(${secondHandRotation}deg)` }}
          />
          {/* Center dot */}
         <circle cx="15" cy="17.5" r="0.8" fill="currentColor" className={styles.pocketWatchFrame} />
       </svg>
    </div>
  );
};

export default PocketWatch;