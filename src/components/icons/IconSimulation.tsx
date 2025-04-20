// src/components/icons/IconSimulation.tsx
"use client";
import React from 'react';
import { motion } from 'framer-motion';

interface IconProps {
  isActive: boolean;
  className?: string;
}

const svgVariants = {
  initial: { scale: 1, rotateY: 0 },
  hover: { scale: 1.05, rotateY: 15 },
  active: { scale: 1.05, rotateY: 0 }
};

const faceVariants = (delay: number = 0) => ({
    initial: { opacity: 0, scale: 0.8, originX: '12px', originY: '12px', stroke: "var(--accent-primary)" },
    hover: { opacity: 1, scale: 1, stroke: "var(--accent-highlight)" },
    active: { opacity: 1, scale: 1, stroke: "var(--accent-highlight)" },
    transition: { duration: 0.4, ease: "backOut", delay }
});

const lineVariants = (delay: number = 0) => ({
    initial: { pathLength: 0, opacity: 0, stroke: "var(--accent-secondary)" },
    hover: { pathLength: 1, opacity: 1 },
    active: { pathLength: 1, opacity: 1 },
    transition: { duration: 0.5, delay }
});


const IconSimulation: React.FC<IconProps> = ({ isActive, className }) => (
  <motion.svg
    key="icon-simulation"
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    variants={svgVariants}
    initial="initial"
    whileHover="hover"
    animate={isActive ? "active" : "initial"}
    style={{ transformOrigin: 'center center' }} // For rotateY
  >
    {/* Cube Structure */}
    {/* Front Face */}
    <motion.polygon
        points="12 3 21 7.5 12 12 3 7.5 12 3"
        variants={faceVariants(0)}
        custom={isActive}
     />
     {/* Left Face */}
     <motion.polygon
        points="3 7.5 3 16.5 12 21 12 12 3 7.5"
        fill="rgba(var(--accent-secondary-rgb), 0.1)" // Slight fill for depth
        variants={faceVariants(0.1)}
        custom={isActive}
    />
    {/* Right Face */}
     <motion.polygon
        points="21 7.5 21 16.5 12 21 12 12 21 7.5"
         fill="rgba(var(--accent-primary-rgb), 0.1)" // Slight fill for depth
        variants={faceVariants(0.2)}
        custom={isActive}
    />

     {/* Internal lines - Optional for complexity */}
     <motion.line x1="12" y1="12" x2="12" y2="21" variants={lineVariants(0.3)} custom={isActive} />
     <motion.line x1="3" y1="7.5" x2="12" y2="12" variants={lineVariants(0.35)} custom={isActive} />
     <motion.line x1="21" y1="7.5" x2="12" y2="12" variants={lineVariants(0.4)} custom={isActive} />

  </motion.svg>
);

export default IconSimulation;