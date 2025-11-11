// src/components/icons/IconDesign.tsx
"use client";
import React from 'react';
// Use lazy-loaded motion for better performance
import { motion } from '@/components/LazyMotion';

interface IconProps {
  isActive: boolean;
  className?: string;
}

const svgVariants = {
  initial: { rotate: 0 },
  hover: { rotate: -5, scale: 1.05 },
  active: { rotate: 0, scale: 1.05 }
};

const pathVariants = {
  initial: { pathLength: 0, opacity: 0, stroke: "var(--accent-primary)" },
  hover: { pathLength: 1, opacity: 1, stroke: "var(--accent-highlight)" },
  active: { pathLength: 1, opacity: 1, stroke: "var(--accent-highlight)" }
};

const circleVariants = {
    initial: { scale: 0, opacity: 0, fill: "none" },
    hover: { scale: 1.1, opacity: 1, fill: "rgba(var(--accent-secondary-rgb), 0.3)" },
    active: { scale: 1, opacity: 1, fill: "rgba(var(--accent-secondary-rgb), 0.5)" }
};

const brushStrokeVariants = {
     initial: { scaleX: 0, opacity: 0, originX: 0 },
     hover: { scaleX: 1, opacity: 0.5, originX: 0 },
     active: { scaleX: 1, opacity: 0.7, originX: 0 }
};


const IconDesign: React.FC<IconProps> = ({ isActive, className }) => (
  <motion.svg
    key="icon-design"
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
  >
    {/* Paintbrush handle/structure */}
    <motion.path
        d="M18 13l-1.5-7.5L2 2l3.5 14.5L13 18l5-5z" // Main brush shape
        variants={pathVariants}
        transition={{ duration: 0.6 }}
        custom={isActive}
    />
     {/* Tip of brush */}
     <motion.path
        d="M12 19l7-7 3 3-7 7-3-3z" // Tip part
        variants={pathVariants}
        transition={{ duration: 0.4, delay: 0.2 }}
        custom={isActive}
    />
    {/* Palette/color circle */}
    <motion.circle
        cx="6" cy="6" r="3" // Changed position for balance
        variants={circleVariants}
        stroke="var(--accent-secondary)"
        transition={{ delay: 0.4 }}
        custom={isActive}
    />
    {/* Subtle stroke effect */}
     <motion.path
         d="M5 18 Q 10 21 15 18" // A swoosh path
         strokeWidth="2.5"
         stroke="var(--accent-highlight)"
         variants={brushStrokeVariants}
         transition={{ delay: 0.5 }}
         custom={isActive}
     />
  </motion.svg>
);

// Make sure to export it if not using default export pattern elsewhere
export default IconDesign;