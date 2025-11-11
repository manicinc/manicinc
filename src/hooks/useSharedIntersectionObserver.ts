// src/hooks/useSharedIntersectionObserver.ts
// Consolidated IntersectionObserver to reduce overhead

import { useEffect, useState, useRef, RefObject } from 'react';

interface UseInViewOptions {
  threshold?: number | number[];
  rootMargin?: string;
  once?: boolean;
}

// Shared observer instance
let sharedObserver: IntersectionObserver | null = null;
const observedElements = new Map<Element, Set<(inView: boolean) => void>>();

function getSharedObserver(options: IntersectionObserverInit): IntersectionObserver {
  if (typeof window === 'undefined' || typeof IntersectionObserver === 'undefined') {
    // Fallback no-op observer
    return {
      observe() {},
      unobserve() {},
      disconnect() {},
      root: null,
      rootMargin: options.rootMargin ?? '0px',
      thresholds: Array.isArray(options.threshold) ? options.threshold : [options.threshold ?? 0],
      takeRecords() { return []; }
    } as unknown as IntersectionObserver;
  }

  if (!sharedObserver || 
      sharedObserver.rootMargin !== options.rootMargin ||
      JSON.stringify(sharedObserver.thresholds) !== JSON.stringify(options.threshold)) {
    
    // Disconnect old observer if options changed
    if (sharedObserver) {
      sharedObserver.disconnect();
    }
    
    sharedObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        const callbacks = observedElements.get(entry.target);
        if (callbacks) {
          callbacks.forEach(callback => callback(entry.isIntersecting));
        }
      });
    }, options);
  }
  
  return sharedObserver;
}

export function useSharedInView(
  ref: RefObject<Element>,
  options: UseInViewOptions = {}
): boolean {
  const [inView, setInView] = useState(false);
  const hasTriggeredRef = useRef(false);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    // Skip attaching if already triggered and once is true
    if (options.once && hasTriggeredRef.current) return;

    const observer = getSharedObserver({
      threshold: options.threshold ?? 0.1,
      rootMargin: options.rootMargin ?? '0px',
    });

    const callback = (isIntersecting: boolean) => {
      if (isIntersecting) {
        setInView(true);
        if (options.once && !hasTriggeredRef.current) {
          hasTriggeredRef.current = true;
          // Stop observing on first intersect
          observer.unobserve(element);
          const callbacks = observedElements.get(element);
          if (callbacks) {
            callbacks.delete(callback);
            if (callbacks.size === 0) {
              observedElements.delete(element);
            }
          }
        }
      } else if (!options.once) {
        // Only update to false when not once mode
        setInView(false);
      }
    };

    // Register callback
    if (!observedElements.has(element)) {
      observedElements.set(element, new Set());
    }
    observedElements.get(element)!.add(callback);

    // Start observing
    observer.observe(element);

    return () => {
      // Cleanup
      const callbacks = observedElements.get(element);
      if (callbacks) {
        callbacks.delete(callback);
        if (callbacks.size === 0) {
          observedElements.delete(element);
          observer.unobserve(element);
        }
      }
    };
  }, [ref, options.threshold, options.rootMargin, options.once]);

  return inView;
}

