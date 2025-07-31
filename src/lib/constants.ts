// src/lib/constants.ts (Example path)

// Giscus Configuration Constants
export const GISCUS_CONFIG = {
    REPO: "manicinc/manicinc" as `<span class="math-inline">\{string\}/</span>{string}`, // Type assertion for safety
    REPO_ID: "R_kgDOOb1tSQ",
    CATEGORY: "Blog",
    CATEGORY_ID: "DIC_kwDOOb1tSc4CpSFh",
    MAPPING: "pathname", // Or "pathname" etc.
    STRICT: "0", // '1' for true, '0' for false
    REACTIONS: "1", // '1' for true, '0' for false
    EMIT_METADATA: "0", // '1' for true, '0' for false
    INPUT_POSITION: "top", // "top" or "bottom"
    THEME: "preferred_color_scheme", // Or specific theme name
    LANG: "en",
    LOADING: "lazy" // "lazy" or "eager"
} as const; // Using 'as const' makes properties readonly and more specific

// Other constants for your app can go here...
export const SITE_NAME = "Manic Agency";

// Analytics Configuration
export const ANALYTICS_CONFIG = {
  GA_ID: process.env.NEXT_PUBLIC_GA_ID,
  CLARITY_PROJECT_ID: process.env.NEXT_PUBLIC_CLARITY_PROJECT_ID,
} as const;

// Contact Configuration
export const CONTACT_CONFIG = {
  ADMIN_EMAIL: 'team@manic.agency',
  FROM_EMAIL: 'Manic Agency <team@manic.agency>',
  REPLY_EMAIL: 'Manic Agency <team@manic.agency>',
} as const;
// src/lib/constants.ts

// --- (Keep existing interfaces: FooterLink, FooterSection) ---
interface FooterLink { title: string; href: string; }
interface FooterSection { title: string; links: FooterLink[]; }

// --- Existing Footer Data ---
export const footerNavigationData: FooterSection[] = [
  {
    title: 'Navigate',
    links: [ /* ... your main site links ... */
        { title: 'Home', href: '/' },
        { title: 'Services', href: '/#services' },
        { title: 'Projects', href: '/projects' },
        { title: 'Open Source', href: '/open-source' },
        { title: 'Blog', href: '/blog' },
    ],
  },
  {
    title: 'Platform',
    links: [
        { title: 'Manic Games', href: 'https://games.manic.agency' },
        { title: 'Publishing', href: 'https://games.manic.agency/publishing' },
        { title: 'Licensing', href: 'https://games.manic.agency/licensing' },
    ],
  },
  {
    title: 'Company',
    links: [ /* ... your main company links ... */
        { title: 'About Us', href: '/team' },
        { title: 'Mission', href: '/mission' },
        { title: 'Process', href: '/process' },
        { title: 'Contact', href: '/contact' },
    ],
  },
  {
    title: 'Legal',
    links: [ /* ... your legal links ... */
        { title: 'Privacy Policy', href: '/privacy' },
        { title: 'Terms of Service', href: '/terms' },
    ],
  },
];

// --- NEW: Blog-Specific Footer Data ---
export const blogFooterNavigationData: FooterSection[] = [
  {
    title: 'Explore the Looking Glass', // Blog-specific title
    links: [
      { title: 'Latest Posts', href: '/blog' },
      // Add links to categories, archives, etc. as desired
      // { title: 'Archives', href: '/blog/archives' },
      { title: 'Category: Tutorials', href: '/blog/category/tutorials' },
      { title: 'Category: Research', href: '/blog/category/research' },
      { title: 'Category: Thinkpieces', href: '/blog/category/thinkpieces'}
    ],
  },
  {
    title: 'Through the Mirror', // The specific title you wanted
    links: [
      { title: 'About This Blog', href: '/blog/about' }, // Example link
      { title: 'Contribute', href: '/blog/tutorials/contribute' },
      { title: 'Agency Home', href: '/' }, // Link back to main site
    ],
  },
    {
    title: 'Connect', // Keep a connect section?
    links: [
         { title: 'Contact Us', href: '/contact' },
    ],
  },
  {
    title: 'Legal', // Keep legal section consistent
    links: [
      { title: 'Privacy Policy', href: '/privacy' },
      { title: 'Terms of Service', href: '/terms' },
    ],
  },
];


// --- (Keep GISCUS_CONFIG, SITE_NAME, mainHeaderNavLinks etc.) ---