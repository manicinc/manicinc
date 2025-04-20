"use client";
import ComponentLayout from "./ComponentLayout";
import { usePathname } from "next/navigation";
import { PropsWithChildren } from "react";
import Script from "next/script";

const GA_ID = process.env.NEXT_PUBLIC_GA_ID; // Read GA ID from env

export default function RoutingLayout({ children }: PropsWithChildren) {
  const pathname = usePathname();
  console.log(pathname);

  // If the segment matches your excluded route
  if (pathname === "/velvet") {
    return (
      <html>
        <head>
          <link
            rel="apple-touch-icon"
            sizes="180x180"
            href="/apple-touch-icon.png"
          />
          <link
            rel="icon"
            type="image/png"
            sizes="32x32"
            href="/velvet_favicon-32x32.png"
          />
          <link
            rel="icon"
            type="image/png"
            sizes="16x16"
            href="/velvet_favicon-16x16.png"
          />
          <link rel="manifest" href="/site.webmanifest" />
          <title>Velvet Web</title>

          {/* Google Analytics */}
          {GA_ID && (
            <>
              <Script async src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`} />
              <Script
                id="google-analytics"
                strategy="afterInteractive"
                dangerouslySetInnerHTML={{
                  __html: `
                    window.dataLayer = window.dataLayer || [];
                    function gtag(){dataLayer.push(arguments);}
                    gtag('js', new Date());
                    gtag('config', '${GA_ID}', {
                      page_path: window.location.pathname,
                    });
                  `,
                }}
              />
            </>
          )}

          <meta
            name="description"
            content="Next-gen Discord community hub powered by AI, designed for founders, creators, and builders. Access personalized AI project management, code analysis, market insights, and curated crypto/tech news - all through specialized AI assistants. Join a thriving ecosystem where innovation meets community, with both free and premium tiers available. We're building the future of AI-enhanced community spaces, backed by our own infrastructure for sustainable, long-term value"
          />
        </head>
        <body>{children}</body>
      </html>
    );
  }

  return <ComponentLayout>{children}</ComponentLayout>;
}
