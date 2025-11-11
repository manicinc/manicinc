// src/components/EmailOctopusForm.tsx
'use client';

import { useEffect, useRef } from 'react';

interface EmailOctopusFormProps {
  formId: string;
  className?: string;
  variant?: 'main' | 'blog';
  showTitle?: boolean;
}

export default function EmailOctopusForm({ 
  formId,
  className = '',
  variant = 'main',
  showTitle = true
}: EmailOctopusFormProps) {

  const containerRef = useRef<HTMLDivElement | null>(null);
  const loadedRef = useRef(false);
  const scriptRef = useRef<HTMLScriptElement | null>(null);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const loadFormScript = () => {
      if (loadedRef.current) return;
      loadedRef.current = true;

      const container = containerRef.current;
      if (!container) return;

      // Clear any existing content to prevent duplicates
      container.innerHTML = '';

      // Create and inject the EmailOctopus script
      const script = document.createElement('script');
      script.src = `https://eocampaign1.com/form/${formId}.js`;
      script.async = true;
      script.setAttribute('data-form', formId);
      script.onerror = () => {
        console.warn('EmailOctopus script failed to load - this can be expected in build/test environments');
      };
      container.appendChild(script);
      scriptRef.current = script;

      // Cleanup observers/listeners after load
      cleanup();
    };

    // IntersectionObserver: load when visible
    let observer: IntersectionObserver | null = null;
    const observeVisibility = () => {
      if (!containerRef.current || loadedRef.current) return;
      observer = new IntersectionObserver((entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            loadFormScript();
            break;
          }
        }
      }, { rootMargin: '200px 0px' });
      observer.observe(containerRef.current);
    };

    // Interaction fallback: first scroll/click/touch
    const onInteract = () => loadFormScript();

    const addInteractionListeners = () => {
      if (loadedRef.current) return;
      window.addEventListener('scroll', onInteract, { passive: true, once: true });
      window.addEventListener('click', onInteract, { once: true });
      window.addEventListener('touchstart', onInteract, { passive: true, once: true });
      // Idle fallback in case neither visibility nor interaction happens soon
      const idle = (cb: () => void) =>
        ('requestIdleCallback' in window ? (window as any).requestIdleCallback(cb, { timeout: 4000 }) : setTimeout(cb, 3000));
      idle(() => loadFormScript());
    };

    const cleanup = () => {
      if (observer && containerRef.current) {
        try { observer.unobserve(containerRef.current); } catch {}
      }
      observer?.disconnect();
      window.removeEventListener('scroll', onInteract as any);
      window.removeEventListener('click', onInteract as any);
      window.removeEventListener('touchstart', onInteract as any);
    };

    observeVisibility();
    addInteractionListeners();

    return () => {
      cleanup();
      // Remove injected script node for safety (form markup remains)
      const container = containerRef.current;
      const script = scriptRef.current;
      if (container && script && script.parentNode === container) {
        container.removeChild(script);
      }
    };
  }, [formId]);

  const copy = variant === 'blog' ? {
    title: 'Join The Looking Glass',
    subtitle: 'Weekly insights on digital consciousness and creative technology.'
  } : {
    title: 'Subscribe to Our Newsletter',
    subtitle: 'Strategic intelligence on digital transformation and innovation.'
  };

  return (
    <div className={`email-octopus-form ${className}`}>
      {showTitle && (
        <div className="text-center mb-6">
          <h3 className="text-2xl font-display font-bold text-text-primary mb-3">
            {copy.title}
          </h3>
          <p className="text-text-secondary">
            {copy.subtitle}
          </p>
        </div>
      )}

      {/* Container for the EmailOctopus script */}
      <div ref={containerRef} className="emailoctopus-script-container" />

      {/* Privacy notice */}
      <p className="mt-4 text-xs text-text-muted text-center">
        We respect your privacy. Unsubscribe at any time.
        {' '}
        <a href="/privacy" className="text-accent-burgundy hover:text-accent-highlight underline">
          Privacy Policy
        </a>
      </p>
    </div>
  );
}