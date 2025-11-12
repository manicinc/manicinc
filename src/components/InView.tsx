// src/components/InView.tsx
'use client';

import React from 'react';

type InViewProps = {
  children: React.ReactNode;
  rootMargin?: string;
  once?: boolean;
};

export default function InView({ children, rootMargin = '200px', once = true }: InViewProps) {
  const ref = React.useRef<HTMLDivElement | null>(null);
  const [visible, setVisible] = React.useState(false);

  React.useEffect(() => {
    if (!ref.current || visible) return;
    const el = ref.current;
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setVisible(true);
            if (once) obs.disconnect();
          }
        });
      },
      { root: null, rootMargin, threshold: 0.01 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [rootMargin, once, visible]);

  return <div ref={ref}>{visible ? children : null}</div>;
}


