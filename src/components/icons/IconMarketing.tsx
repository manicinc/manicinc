// src/components/icons/IconMarketing.tsx
"use client";
import React from 'react';
import { motion } from 'framer-motion';

interface IconProps {
  isActive: boolean;
  className?: string;
}

const svgVariants = {
  initial: {},
  hover: {},
  active: {}
};

const ringVariants = (delay: number = 0) => ({
  initial: { pathLength: 0, opacity: 0, scale: 0.5, originX: '12px', originY: '12px', stroke: "var(--accent-primary)" },
  hover: { pathLength: 1, opacity: 1, scale: 1, stroke: "var(--accent-highlight)" },
  active: { pathLength: 1, opacity: 1, scale: 1, stroke: "var(--accent-highlight)" },
  transition: { duration: 0.5, ease: "circOut", delay }
});

const centerDotVariants = {
    initial: { scale: 0, opacity: 0, fill: "none" },
    hover: { scale: 1.2, opacity: 1, fill: "var(--accent-highlight)" },
    active: { scale: 1.1, opacity: 1, fill: "var(--accent-highlight)" },
    transition: { delay: 0.3, type: "spring", stiffness: 300, damping: 15 }
};

export const IconMarketing: React.FC<IconProps> = ({ isActive, className }) => (
  <motion.svg
    key="icon-marketing"
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
    {/* Target Rings */}
    <motion.circle
        cx="12" cy="12" r="10" // Outer ring
        variants={ringVariants(0)}
        custom={isActive}
    />
    <motion.circle
        cx="12" cy="12" r="6" // Middle ring
        stroke="var(--accent-secondary)" // Different color
        variants={ringVariants(0.1)}
        custom={isActive}
    />
    {/* Center Dot */}
    <motion.circle
        cx="12" cy="12" r="2" // Inner dot
        stroke="var(--accent-highlight)"
        variants={centerDotVariants}
        custom={isActive}
    />
  </motion.svg>
);

export default IconMarketing;