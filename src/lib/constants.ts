// src/lib/constants.ts (Example path)

// Giscus Configuration Constants
export const GISCUS_CONFIG = {
    REPO: "manicinc/manicinc" as `<span class="math-inline">\{string\}/</span>{string}`, // Type assertion for safety
    REPO_ID: "R_kgDOLPzZxQ",
    CATEGORY: "Blogs",
    CATEGORY_ID: "DIC_kwDOLPzZxc4CpDyi",
    MAPPING: "og:title", // Or "pathname" etc.
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