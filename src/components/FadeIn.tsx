'use client';

import { createContext, useContext } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
const FadeInStaggerContext = createContext(false);

const viewport = { once: true, margin: '0px 0px -200px' };

const FadeIn: React.FC<React.HTMLAttributes<HTMLDivElement>> = (props) => {
  const shouldReduceMotion = useReducedMotion();
  const isInStaggerGroup = useContext(FadeInStaggerContext);
  return (
    <motion.div
      variants={{
        hidden: { opacity: 0, y: shouldReduceMotion ? 0 : 24 },
        visible: { opacity: 1, y: 0 },
      }}
      transition={{ duration: 0.5 }}
      {...(isInStaggerGroup
        ? {}
        : {
            initial: 'visible',
            whileInView: 'animate',
            viewport,
          })}
      {...(props as any)}
    />
  );
};
const FadeInLong: React.FC<React.HTMLAttributes<HTMLDivElement>> = (props) => {
  const shouldReduceMotion = useReducedMotion();
  const isInStaggerGroup = useContext(FadeInStaggerContext);
  return (
    <motion.div
      variants={{
        hidden: { opacity: 0, y: shouldReduceMotion ? 0 : 24 },
        visible: { opacity: 1, y: 0 },
      }}
      transition={{ duration: 1.05 }}
      {...(isInStaggerGroup
        ? {}
        : {
            initial: 'visible',
            whileInView: 'animate',
            viewport,
          })}
      {...(props as React.ComponentProps<typeof motion.div>)}
    />
  );
};

export const FadeInStagger: React.FC<
  { faster?: boolean } & React.HTMLAttributes<HTMLDivElement>
> = ({ faster = false, ...props }) => {
  return (
    <FadeInStaggerContext.Provider value={true}>
      <motion.div
        // initial="hidden"
        // whileInView="visible"
        initial="initial"
        whileInView="animate"
        viewport={viewport}
        transition={{ staggerChildren: faster ? 0.72 : 0.7 }}
        {...(props as React.ComponentProps<typeof motion.div>)}
      />
    </FadeInStaggerContext.Provider>
  );
};

export default FadeIn;
