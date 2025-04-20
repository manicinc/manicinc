// middleware.js
import { NextResponse } from 'next/server';

export function middleware(request) {
  const url = request.nextUrl.clone();
  
  // Exclude /blog exactly - only process /blog/something
  if (url.pathname === '/blog') {
    return NextResponse.next();
  }
  
  // Only process /blog/[slug] URLs (not already categorized ones)
  if (url.pathname.match(/^\/blog\/[\w-]+$/) && !url.pathname.match(/^\/blog\/[\w-]+\/[\w-]+$/)) {
    const slug = url.pathname.split('/').pop();
    
    // Redirect to URL with the slug
    return NextResponse.redirect(new URL(`/blog/${slug}?redirected=true`, url.origin));
  }
  
  return NextResponse.next();
}

// Configure matcher to more specifically target blog paths with slugs
export const config = {
  matcher: [
    '/blog/:path*'
  ],
};