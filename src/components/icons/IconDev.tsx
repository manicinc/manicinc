// src/components/icons/IconDev.tsx
"use client";
import React from 'react';
import { motion } from 'framer-motion';

interface IconProps {
  isActive: boolean;
  className?: string;
}

const svgVariants = {
  initial: { rotate: 0 },
  hover: { rotate: 5 },
};

const pathVariants = {
  initial: { pathLength: 0, opacity: 0, stroke: "var(--accent-primary)" },
  hover: {
    pathLength: 1,
    opacity: 1,
    stroke: "var(--accent-highlight)", // Change color on hover
    transition: { duration: 0.5, ease: "easeInOut" }
  },
  active: { // State when the card is active
    pathLength: 1,
    opacity: 1,
    stroke: "var(--accent-highlight)",
    transition: { duration: 0.3 }
  },
};

const IconDev: React.FC<IconProps> = ({ isActive, className }) => (
  <motion.svg
    key="icon-dev" // Add key for motion layout animations if needed
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
    animate={isActive ? "active" : "initial"} // Animate based on active state
  >
    {/* Animated chevron */}
    <motion.polyline
        points="16 18 22 12 16 6"
        variants={pathVariants}
        custom={isActive}
    />
    <motion.polyline
        points="8 6 2 12 8 18"
        variants={pathVariants}
        transition={{ delay: 0.1 }}
        custom={isActive}
    />
    {/* Add a central element */}
    <motion.circle
        cx="12" cy="12" r="1.5"
        stroke="var(--accent-secondary)"
        variants={{
             initial: { scale: 0, opacity: 0 },
             hover: { scale: 1.2, opacity: 1, fill: "var(--accent-secondary)" },
             active: { scale: 1.1, opacity: 1, fill: "var(--accent-secondary)" }
        }}
        transition={{ delay: 0.2 }}
        custom={isActive}
     />
  </motion.svg>
);

export default IconDev; // Export the component for use in other parts of the application