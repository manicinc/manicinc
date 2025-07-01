import type { Metadata } from 'next';

// SEO Metadata for Process Page
export const metadata: Metadata = {
    title: 'The Manic Blueprint - Our Development Process | Manic Agency',
    description: 'Discover Manic Agency\'s signature methodology: The Manic Blueprint. Our 7-phase process combines creative mania with rigorous engineering to deliver exceptional digital experiences.',
    keywords: [
        'development process',
        'manic blueprint',
        'software development methodology',
        'creative development process',
        'agile development',
        'MVP development',
        'Los Angeles development agency',
        'experimental coding methodology',
        'rapid prototyping',
        'creative engineering process',
        'digital transformation process',
        'innovation methodology',
        'design thinking process',
        'technical architecture'
    ],
    authors: [{ name: 'Manic Agency', url: 'https://manic.agency' }],
    alternates: {
        canonical: '/process'
    },
    openGraph: {
        type: 'website',
        url: '/process',
        title: 'The Manic Blueprint - Our Development Process | Manic Agency',
        description: 'Discover Manic Agency\'s signature methodology: The Manic Blueprint. Our 7-phase process combines creative mania with rigorous engineering to deliver exceptional digital experiences.',
        images: [
            {
                url: '/og-default.png',
                width: 1200,
                height: 630,
                alt: 'Manic Agency Development Process - The Manic Blueprint'
            }
        ]
    },
    twitter: {
        card: 'summary_large_image',
        title: 'The Manic Blueprint - Our Development Process | Manic Agency',
        description: 'Discover Manic Agency\'s signature methodology: The Manic Blueprint. Our 7-phase process combines creative mania with rigorous engineering.',
        images: [{
            url: '/og-default.png',
            alt: 'Manic Agency Development Process - The Manic Blueprint'
        }]
    }
};

// Server Component
export default function ProcessPage() {
    return (
        <div className="min-h-screen py-12">
            <div className="container mx-auto px-4">
                <h1 className="text-4xl font-bold text-center mb-8">The Manic Blueprint</h1>
                <p className="text-center text-lg">
                    Our signature methodology for delivering exceptional digital experiences.
                </p>
                <div className="mt-8 text-center">
                    <p>Coming soon: Interactive process visualization</p>
                </div>
            </div>
        </div>
    );
} 