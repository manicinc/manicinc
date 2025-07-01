// src/app/page.tsx
import type { Metadata } from 'next';
import { Suspense } from 'react'; // Keep Suspense import
import { getAllPosts } from '@/lib/getAllPosts';
import { getAllProjects } from '@/lib/getAllProjects';
import { HeroFeedItem } from '@/types/common';
import { BlogPost } from '@/types/blog';
import { Project } from '@/types/project';
import { HeroSection } from '@/components/HeroSection';
import Services from "@/components/Services/Services";
import Intro from "@/components/Intro/Intro";
import HomePageSkeleton from '@/components/Skeletons/HomePageSkeleton'; // Keep Skeleton import

// SEO Metadata for Homepage
export const metadata: Metadata = {
    title: 'Manic Agency - Experimental Creative Development & Design Studio',
    description: 'Los Angeles-based creative development agency specializing in AR/VR, blockchain solutions, AI implementation, and innovative web applications. We forge reality from digital ether.',
    keywords: [
        'creative development agency',
        'Los Angeles web development', 
        'AR VR development',
        'blockchain solutions',
        'AI implementation',
        'experimental design',
        'digital innovation',
        'custom software development',
        'creative technology',
        'digital transformation'
    ],
    authors: [{ name: 'Manic Agency', url: 'https://manic.agency' }],
    creator: 'Manic Agency',
    publisher: 'Manic Agency LLC',
    alternates: {
        canonical: '/'
    },
    openGraph: {
        type: 'website',
        locale: 'en_US',
        url: '/',
        siteName: 'Manic Agency',
        title: 'Manic Agency - Experimental Creative Development & Design Studio',
        description: 'Los Angeles-based creative development agency specializing in AR/VR, blockchain solutions, AI implementation, and innovative web applications.',
        images: [
            {
                url: '/og-default.png',
                width: 1200,
                height: 630,
                alt: 'Manic Agency - Experimental Creative Development'
            }
        ]
    },
    twitter: {
        card: 'summary_large_image',
        site: '@manicagency',
        creator: '@manicagency',
        title: 'Manic Agency - Experimental Creative Development & Design Studio',
        description: 'Los Angeles-based creative development agency specializing in AR/VR, blockchain solutions, AI implementation, and innovative web applications.',
        images: [{
            url: '/og-default.png',
            alt: 'Manic Agency - Experimental Creative Development'
        }]
    },
    robots: {
        index: true,
        follow: true,
        googleBot: {
            index: true,
            follow: true,
            'max-video-preview': -1,
            'max-image-preview': 'large',
            'max-snippet': -1
        }
    },
    verification: {
        google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION
    }
};

// Keep your getFeaturedItems function exactly as it is
// (Could also be moved to a separate file like './actions.ts' if preferred)
async function getFeaturedItems(): Promise<HeroFeedItem[]> {
    // Add a small delay FOR DEMONSTRATION ONLY - REMOVE IN PRODUCTION
    // await new Promise(resolve => setTimeout(resolve, 1500)); // 1.5 second delay

    const allPosts: BlogPost[] = getAllPosts();
    const allProjects: Project[] = getAllProjects();

    // Filter posts: Check for 'featured' tag (case-insensitive) or a featured flag if your type has one
    const featuredPosts = allPosts.filter(post =>
        (post.tags && post.tags.map(t => t.toLowerCase()).includes('featured')) ||
        (post as any).featured === true // Add this if your BlogPost type might have a 'featured' boolean
    );

    // Filter projects: Check for featured flag and ensure not draft
    const featuredProjects = allProjects.filter(project => project.featured && !project.draft);

    // Combine and map to the HeroFeedItem structure
    const combinedItems: HeroFeedItem[] = [
        ...featuredPosts.map(post => ({
            id: `blog-${post.category}-${post.slug}`,
            type: 'blog' as const,
            slug: post.slug,
            title: post.title ?? 'Untitled Post',
            excerpt: post.excerpt,
            draft: post.draft ?? false,
            image: post.image,
            category: post.category,
            urlPath: `/blog/${post.category}/${post.slug}`,
            date: post.date ?? new Date().toISOString(),
            tags: post.tags || [],
        })),
        ...featuredProjects.map(project => ({
            id: `project-${project.category}-${project.slug}`,
            type: 'project' as const,
            slug: project.slug,
            title: project.title,
            excerpt: project.description,
            draft: project.draft ?? false,
            image: project.image,
            category: project.category,
            urlPath: `/projects/${project.category}/${project.slug}`,
            date: project.date,
            tags: project.tags || [],
            technologies: project.technologies || [],
            github: project.github,
            link: project.link
        })),
    ];

    // Sort by date, most recent first
    combinedItems.sort((a, b) => {
        const dateA = new Date(a.date).getTime();
        const dateB = new Date(b.date).getTime();
        if (isNaN(dateA)) return 1;
        if (isNaN(dateB)) return -1;
        return dateB - dateA;
    });

    return combinedItems.slice(0, 3);
}


// *** NEW async component that fetches its own data ***
async function HeroSectionWithData() {
    // *** Fetching and awaiting happens INSIDE this component ***
    const featuredItems = await getFeaturedItems();
    // Render the original HeroSection with the fetched data
    return <HeroSection featuredItems={featuredItems} />;
}


// *** HomePage component is now simpler and likely doesn't need to be async ***
export default function HomePage() {
    // No data fetching initiated here

    return (
        // Wrap the parts that need data (or the whole initial view) in Suspense
        <Suspense fallback={<HomePageSkeleton />}>

            {/* Render the component that will fetch/await internally */}
            {/* Add the comment to suppress the TypeScript error for the async Server Component */}
            {/* @ts-expect-error Server Component */}
            <HeroSectionWithData />

            {/* These components render after HeroSectionWithData resolves,
                or instantly if moved outside Suspense boundary */}
            <Services />
            <Intro />

        </Suspense> // Close Suspense tag
    );
}

// Optional: Define metadata if needed for the page
// export const metadata: Metadata = { title: 'Home', ... };