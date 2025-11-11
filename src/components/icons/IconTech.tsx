// src/components/icons/IconTech.tsx
"use client";
import React from 'react';
// Use lazy-loaded motion for better performance
import { motion } from '@/components/LazyMotion';

interface IconProps {
  isActive: boolean;
  className?: string;
}

const svgVariants = {
  initial: { scale: 1 },
  hover: { scale: 1.1 },
};

const centerVariants = {
    initial: { rotate: 0, scale: 1, fill: "none" },
    hover: { rotate: 90, scale: 1.1, fill: "rgba(var(--accent-secondary-rgb), 0.3)" },
    active: { rotate: 45, scale: 1.05, fill: "rgba(var(--accent-secondary-rgb), 0.5)" }
};

const rayVariants = {
    initial: { scale: 0, opacity: 0, stroke: "var(--accent-primary)" },
    hover: { scale: 1, opacity: 1, stroke: "var(--accent-highlight)" },
    active: { scale: 1, opacity: 1, stroke: "var(--accent-highlight)" }
};

const IconTech: React.FC<IconProps> = ({ isActive, className }) => (
  <motion.svg
    key="icon-tech"
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
    <motion.circle cx="12" cy="12" r="4" variants={centerVariants} stroke="var(--accent-secondary)" />
    {[0, 45, 90, 135, 180, 225, 270, 315].map((angle, i) => (
        <motion.line
            key={angle}
            x1="12" y1="12"
            x2={12 + 5 * Math.cos(angle * Math.PI / 180)}
            y2={12 + 5 * Math.sin(angle * Math.PI / 180)}
            variants={rayVariants}
            transition={{ delay: i * 0.05 }}
            custom={isActive}
        />
    ))}
  </motion.svg>
);

export default IconTech;