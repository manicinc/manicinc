// src/components/CodeHighlighter.tsx
// Lazy-loaded syntax highlighter wrapper to reduce initial bundle size
'use client';

import React, { lazy, Suspense } from 'react';
import { useTheme } from '@/context/ThemeContext';

// Lazy load the heavy syntax highlighter only when needed
const SyntaxHighlighter = lazy(() =>
  import('react-syntax-highlighter').then(mod => ({
    default: mod.Prism || mod.Light,
  }))
);

const darkTheme = lazy(() =>
  import('react-syntax-highlighter/dist/esm/styles/prism').then(mod => ({
    default: mod.coldarkDark,
  }))
);

const lightTheme = lazy(() =>
  import('react-syntax-highlighter/dist/esm/styles/prism').then(mod => ({
    default: mod.prism,
  }))
);

interface CodeHighlighterProps {
  language?: string;
  children: string;
  className?: string;
}

// Fallback component while loading
const CodeFallback = ({ children }: { children: string }) => (
  <pre className="overflow-x-auto rounded-lg bg-gray-100 dark:bg-gray-800 p-4">
    <code className="text-sm font-mono">{children}</code>
  </pre>
);

export function CodeHighlighter({ language = 'text', children, className }: CodeHighlighterProps) {
  const { theme } = useTheme();
  const [themeStyle, setThemeStyle] = React.useState<any>(null);

  React.useEffect(() => {
    // Load theme dynamically based on current theme
    if (theme === 'dark') {
      import('react-syntax-highlighter/dist/esm/styles/prism').then(mod => {
        setThemeStyle(mod.coldarkDark);
      });
    } else {
      import('react-syntax-highlighter/dist/esm/styles/prism').then(mod => {
        setThemeStyle(mod.prism);
      });
    }
  }, [theme]);

  return (
    <Suspense fallback={<CodeFallback>{children}</CodeFallback>}>
      <SyntaxHighlighter
        language={language}
        style={themeStyle}
        className={className}
        customStyle={{
          margin: 0,
          borderRadius: '0.5rem',
          fontSize: '0.875rem',
        }}
      >
        {children}
      </SyntaxHighlighter>
    </Suspense>
  );
}

export default CodeHighlighter;