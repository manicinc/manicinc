// src/types/window.ts

// This file defines global augmentations for the Window interface.
// Make sure this file is included in your tsconfig.json "include" or "files" array
// so TypeScript picks up these global definitions.

declare global {
    interface Window {
      /**
       * Optional function to toggle the color scheme (dark/light mode).
       * Defined in LayoutClient.tsx
       */
      toggleTheme?: () => void; // <-- FIXED: Ensure '?' makes it optional
  
      // Add other custom window properties here if needed
      // Example: myCustomGlobal?: string;
    }
  }
  
  // Export empty object to make this a module file if needed,
  // though for global augmentations using `declare global` it's often not required.
  export {};