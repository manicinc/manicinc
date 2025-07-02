import type { Metadata } from 'next';

// SEO Metadata for Contact Page
export const metadata: Metadata = {
    title: 'Contact Us - Open a Dialogue | Manic Agency',
    description: 'Get in touch with Manic Agency for creative development projects, collaborations, or inquiries. Based in Los Angeles with global reach. Let\'s build something extraordinary together.',
    keywords: [
        'contact manic agency',
        'Los Angeles development agency contact',
        'creative development inquiry',
        'hire developers',
        'custom software development',
        'project collaboration',
        'tech consultation',
        'digital transformation contact',
        'team@manic.agency'
    ],
    authors: [{ name: 'Manic Agency', url: 'https://manic.agency' }],
    alternates: {
        canonical: '/contact'
    },
    openGraph: {
        type: 'website',
        url: '/contact',
        title: 'Contact Us - Open a Dialogue | Manic Agency',
        description: 'Get in touch with Manic Agency for creative development projects, collaborations, or inquiries. Based in Los Angeles with global reach.',
        images: [
            {
                url: '/og-default.webp',
                width: 1200,
                height: 630,
                alt: 'Contact Manic Agency - Creative Development Studio'
            }
        ]
    },
    twitter: {
        card: 'summary_large_image',
        title: 'Contact Us - Open a Dialogue | Manic Agency',
        description: 'Get in touch with Manic Agency for creative development projects, collaborations, or inquiries. Based in Los Angeles with global reach.',
        images: [{
            url: '/og-default.webp',
            alt: 'Contact Manic Agency - Creative Development Studio'
        }]
    }
};

// Server Component
export default function ContactPage() {
    return (
        <div className="min-h-screen py-12">
            <div className="container mx-auto px-4">
                <h1 className="text-4xl font-bold text-center mb-8">Contact Us</h1>
                <p className="text-center text-lg">
                    Ready to start your next project? Get in touch with our team.
                </p>
                <div className="mt-8 text-center">
                    <a href="mailto:team@manic.agency" className="text-blue-600 hover:underline">
                        team@manic.agency
                    </a>
                </div>
            </div>
        </div>
    );
} 