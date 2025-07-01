import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: "Velvet Web - AI-Powered Community for Innovators",
    description: "Join an innovative community of founders, creators, and developers. Get AI-powered insights, project management, advanced code analysis tools, and curated crypto/tech news.",
    keywords: [
        'velvet web',
        'AI-powered community',
        'Discord community hub',
        'founders community',
        'creators community',
        'AI project management',
        'code analysis tools',
        'crypto news',
        'tech news',
        'AI assistants',
        'community platform',
        'innovation community'
    ],
    authors: [{ name: 'Manic Agency', url: 'https://manic.agency' }],
    alternates: {
        canonical: '/velvet'
    },
    openGraph: {
        type: 'website',
        url: '/velvet',
        title: "Velvet Web - AI-Powered Community for Innovators",
        description: "Join an innovative community of founders, creators, and developers. Get AI-powered insights, project management, advanced code analysis tools, and curated crypto/tech news.",
        images: [
            {
                url: '/velvet_web.png',
                width: 1200,
                height: 630,
                alt: 'Velvet Web - AI-Powered Community Platform'
            }
        ]
    },
    twitter: {
        card: 'summary_large_image',
        title: "Velvet Web - AI-Powered Community for Innovators",
        description: "Join an innovative community of founders, creators, and developers. Get AI-powered insights, project management, advanced code analysis tools, and curated crypto/tech news.",
        images: [{
            url: '/velvet_web.png',
            alt: 'Velvet Web - AI-Powered Community Platform'
        }]
    },
    robots: {
        index: true,
        follow: true
    }
};
  
  import VelvetHero from "@/components/VelvetHero";
  import VelvetFeatures from "@/components/VelvetFeatures";
  import VelvetPricing from "@/components/VelvetPricing";
  import DefaultLayout from "@/app/velvet/layout";
  
  export default function Home() {
    return (
      <DefaultLayout>
        <VelvetHero />
        <VelvetFeatures />
        <VelvetPricing />
      </DefaultLayout>
    );
  }
    
  
