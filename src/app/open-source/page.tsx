// src/app/open-source/page.tsx
import type { Metadata } from 'next';
import OpenSourcePageClient from './OpenSourcePageClient';

// SEO Metadata for Open Source Page
export const metadata: Metadata = {
    title: 'Open Source Projects - Community Contributions | Manic Agency',
    description: 'Discover Manic Agency\'s open source contributions to the developer community. Explore our public repositories, tools, and collaborative projects on GitHub.',
    keywords: [
        'manic agency open source',
        'open source projects',
        'GitHub contributions',
        'developer community',
        'open source tools',
        'collaborative development',
        'public repositories',
        'open wavelengths',
        'community contributions',
        'shared knowledge'
    ],
    authors: [{ name: 'Manic Agency', url: 'https://manic.agency' }],
    alternates: {
        canonical: '/open-source'
    },
    openGraph: {
        type: 'website',
        url: '/open-source',
        title: 'Open Source Projects - Community Contributions | Manic Agency',
        description: 'Discover Manic Agency\'s open source contributions to the developer community. Explore our public repositories and collaborative projects.',
        images: [
            {
                url: '/og-default.png',
                width: 1200,
                height: 630,
                alt: 'Manic Agency Open Source Projects'
            }
        ]
    },
    twitter: {
        card: 'summary_large_image',
        title: 'Open Source Projects - Community Contributions | Manic Agency',
        description: 'Discover Manic Agency\'s open source contributions to the developer community. Explore our public repositories and collaborative projects.',
        images: [{
            url: '/og-default.png',
            alt: 'Manic Agency Open Source Projects'
        }]
    }
};

// Server Component
export default function OpenSourcePage() {
    return <OpenSourcePageClient />;
} 