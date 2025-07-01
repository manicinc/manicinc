import type { Metadata } from 'next';

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
    return (
        <div className="container mx-auto px-4 py-12">
            <div className="max-w-4xl mx-auto text-center">
                <h1 className="text-4xl font-bold mb-4">Open Source Projects</h1>
                <p className="text-lg text-gray-600 dark:text-gray-400 mb-8">
                    Our contributions to the developer community
                </p>
                <p className="text-sm text-gray-500">
                    This page is being restructured for better SEO compliance.
                </p>
            </div>
        </div>
    );
} 