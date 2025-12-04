// Lazy Motion Wrapper - Properly lazy loads Framer Motion features
'use client';

import { LazyMotion, domAnimation } from 'framer-motion';
import type { ReactNode } from 'react';

// Re-export commonly used framer-motion exports
export { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
export { domAnimation };

// Lazy motion provider that only loads animation features when needed
interface LazyMotionProviderProps {
  children: ReactNode;
  strict?: boolean;
}

export function LazyMotionProvider({ children, strict = false }: LazyMotionProviderProps) {
  return (
    <LazyMotion features={domAnimation} strict={strict}>
      {children}
    </LazyMotion>
  );
}

// For dynamic imports where you want to load motion only when component mounts
export const loadMotion = () => import('framer-motion').then((mod) => mod.motion);

export default LazyMotionProvider;
