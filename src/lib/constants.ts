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

// src/lib/constants.ts

// Interface definitions (keep if you have them)
interface FooterLink {
    title: string;
    href: string;
  }
  interface FooterSection {
    title: string;
    links: FooterLink[];
  }
  
  // --- Define Footer Navigation Data ---
  export const footerNavigationData: FooterSection[] = [
    {
      title: 'Navigate',
      links: [
        { title: 'Home', href: '/' },
        { title: 'Services', href: '/#services' },
        { title: 'Projects', href: '/projects' },
        { title: 'Open Source', href: '/open-source' },
        { title: 'Blog', href: '/blog' },
      ],
    },
    {
      title: 'Company',
      links: [
        { title: 'About Us', href: '/team' }, // Added '/team' link
        { title: 'Mission', href: '/mission' }, // Added '/mission' link
        { title: 'Process', href: '/process' }, // Added '/process' link
        { title: 'Contact', href: '/contact' },
      ],
    },
    {
      title: 'Legal', // Added Legal section
      links: [
        { title: 'Privacy Policy', href: '/privacy' }, // Added '/privacy' link
        { title: 'Terms of Service', href: '/terms' }, // Added '/terms' link
      ],
    },
    // Add more sections if needed
  ];
  
  export interface NavLinkItem {
    title: string;
    href: string;
    id: string; // Used for data-nav-id and active path checks
    isButton?: boolean; // Optional flag for styling contact button
    // Add icon components if you refactor NavLinks to use this fully
    // hoverAnimation?: React.ComponentType<any>;
  }
  
  // --- OPTIONAL: Define Main Nav Links here for consistency ---
  export const mainHeaderNavLinks: NavLinkItem[] = [
      // Note: Order matters for display
      { title: 'Services', href: '/#services', id: 'services' },
      { title: 'Projects', href: '/projects', id: 'projects' },
      { title: 'Blueprint', href: '/process', id: 'process'}, // Added Process/Blueprint
      { title: 'Open Source', href: '/open-source', id: 'open-source' },
      { title: 'Mission', href: '/mission', id: 'mission'},    // Added Mission
      { title: 'Team', href: '/team', id: 'team'},        // Added Team/About Us
      { title: 'Blog', href: '/blog', id: 'blog' },
      // Keep Contact last if it's styled as a button
      { title: 'Contact', href: '/contact', id: 'contact', isButton: true },
  ];