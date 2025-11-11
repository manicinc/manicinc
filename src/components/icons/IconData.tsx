// src/components/icons/IconData.tsx
"use client";
import React from 'react';
// Use lazy-loaded motion for better performance
import { motion } from '@/components/LazyMotion';

interface IconProps {
  isActive: boolean;
  className?: string;
}

const svgVariants = {
  initial: {},
  hover: {},
  active: {}
};

const axisVariants = {
    initial: { pathLength: 0, opacity: 0, stroke: "var(--text-muted)" },
    hover: { pathLength: 1, opacity: 0.7 },
    active: { pathLength: 1, opacity: 1 },
    transition: { duration: 0.4 }
};

const barVariants = (targetY: number, delay: number = 0) => ({
  initial: { y: 18, height: 0, opacity: 0, fill: "var(--accent-primary)" },
  hover: {
    y: targetY,
    height: 18 - targetY, // Calculate height based on final Y
    opacity: 1,
    fill: "var(--accent-highlight)",
    transition: { duration: 0.4, ease: "easeOut", delay }
  },
  active: {
    y: targetY,
    height: 18 - targetY,
    opacity: 1,
    fill: "var(--accent-highlight)",
    transition: { duration: 0.3, delay }
  }
});

const IconData: React.FC<IconProps> = ({ isActive, className }) => (
  <motion.svg
    key="icon-data"
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
    {/* Axes */}
    <motion.path d="M3 21V3h18" variants={axisVariants} custom={isActive} />

    {/* Animated Bars - Use Rect for fill */}
    <motion.rect
        x="6" // Position of first bar
        width="4"
        rx="1" // Slightly rounded top
        variants={barVariants(12, 0)} // Target Y=12, delay 0
        custom={isActive}
    />
    <motion.rect
        x="12" // Position of second bar
        width="4"
        rx="1"
        fill="var(--accent-secondary)" // Different color
        variants={barVariants(6, 0.1)} // Target Y=6, delay 0.1
        custom={isActive}
    />
     <motion.rect
        x="18" // Position of third bar
        width="4"
        rx="1"
        variants={barVariants(9, 0.2)} // Target Y=9, delay 0.2
        custom={isActive}
    />
  </motion.svg>
);

export default IconData;