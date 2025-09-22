'use client';

import { useEffect, useState } from 'react';
import Script from 'next/script';

export default function LazyThirdPartyScripts() {
  const [shouldLoad, setShouldLoad] = useState(false);

  useEffect(() => {
    // Load third-party scripts after initial render or on user interaction
    const timer = setTimeout(() => setShouldLoad(true), 2000);

    const handleInteraction = () => {
      setShouldLoad(true);
      cleanup();
    };

    const cleanup = () => {
      clearTimeout(timer);
      window.removeEventListener('scroll', handleInteraction);
      window.removeEventListener('click', handleInteraction);
      window.removeEventListener('touchstart', handleInteraction);
    };

    // Load on first user interaction
    window.addEventListener('scroll', handleInteraction, { once: true, passive: true });
    window.addEventListener('click', handleInteraction, { once: true });
    window.addEventListener('touchstart', handleInteraction, { once: true, passive: true });

    return cleanup;
  }, []);

  if (!shouldLoad) return null;

  return (
    <>
      {/* Google reCAPTCHA - Lazy load */}
      {process.env.NODE_ENV === 'production' && (
        <Script
          src="https://www.google.com/recaptcha/api.js"
          strategy="lazyOnload"
        />
      )}

      {/* EmailOctopus - Lazy load */}
      {process.env.NODE_ENV === 'production' && (
        <Script
          src="https://eocampaign1.com/form/9262a386-6ef5-11ef-afad-4f8f7b8d8f93.js"
          strategy="lazyOnload"
          data-form="9262a386-6ef5-11ef-afad-4f8f7b8d8f93"
        />
      )}
    </>
  );
}