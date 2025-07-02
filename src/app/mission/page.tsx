// src/app/mission/page.tsx
import type { Metadata } from 'next';
import MissionPageClient from './MissionPageClient';

// SEO Metadata for Mission Page
export const metadata: Metadata = {
    title: 'Our Mission - Charting Uncharted Code | Manic Agency',
    description: 'Discover Manic Agency\'s mission: experimental creative development & design agency forging reality from digital ether. Learn about our mania-driven development philosophy.',
    keywords: [
        'mission statement',
        'experimental development',
        'creative technology philosophy',
        'mania-driven development',
        'digital innovation approach',
        'sustainable software',
        'true ownership development',
        'portability in tech',
        'elegant integration'
    ],
    authors: [{ name: 'Manic Agency', url: 'https://manic.agency' }],
    alternates: {
        canonical: '/mission'
    },
    openGraph: {
        type: 'website',
        url: '/mission',
        title: 'Our Mission - Charting Uncharted Code | Manic Agency',
        description: 'Discover Manic Agency\'s mission: experimental creative development & design agency forging reality from digital ether.',
        images: [
            {
                url: '/og-default.webp',
                width: 1200,
                height: 630,
                alt: 'Manic Agency Mission - Charting Uncharted Code'
            }
        ]
    },
    twitter: {
        card: 'summary_large_image',
        title: 'Our Mission - Charting Uncharted Code | Manic Agency',
        description: 'Discover Manic Agency\'s mission: experimental creative development & design agency forging reality from digital ether.',
        images: [{
            url: '/og-default.webp',
            alt: 'Manic Agency Mission - Charting Uncharted Code'
        }]
    }
};

// Server Component
export default function MissionPage() {
    return <MissionPageClient />;
}