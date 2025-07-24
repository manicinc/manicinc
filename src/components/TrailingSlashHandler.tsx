'use client';

import { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';

/**
 * Client-side handler for trailing slash redirects
 * Works with static exports where server-side redirects aren't available
 */
export default function TrailingSlashHandler() {
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    // Check if current path has trailing slash (except root)
    if (pathname !== '/' && pathname.endsWith('/')) {
      // Remove trailing slash and redirect
      const newPath = pathname.slice(0, -1);
      router.replace(newPath);
    }
  }, [pathname, router]);

  return null; // This component doesn't render anything
}
