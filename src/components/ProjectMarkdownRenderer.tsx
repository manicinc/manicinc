// src/components/ProjectMarkdownRenderer.tsx
// Renderer for Project pages, aiming for a cleaner, more modern aesthetic.
// V2 - Fixed TypeScript errors related to 'node' and 'rehypeAllowDangerousHtml'.

'use client';

// --- Core React/Next Imports ---
import React, { ReactNode, useMemo, isValidElement, ComponentPropsWithoutRef, CSSProperties, Children, useState, useEffect } from 'react';

// --- Markdown Processing Libraries ---
import ReactMarkdown from 'react-markdown';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import rehypeSlug from 'rehype-slug';
import rehypeAutolinkHeadings from 'rehype-autolink-headings';
import remarkGfm from 'remark-gfm';
import remarkUnwrapImages from 'remark-unwrap-images';
// *** FIX 2a: Import rehype-raw ***
import rehypeRaw from 'rehype-raw'; // <--- Import this
import { Components } from 'react-markdown';
import type { PluggableList } from 'unified';
import type { Element, Text, Comment, ElementContent, Root } from 'hast';
import { visit } from 'unist-util-visit';

// --- Syntax Highlighting Types (lazy loaded) ---
type PrismComponent = React.ComponentType<any> | null;
type PrismStyle = Record<string, React.CSSProperties> | null;

// Lazy loading hook for syntax highlighter (reduces initial bundle by ~244 KiB)
const useLazySyntaxHighlighter = (shouldLoad: boolean, isDarkMode: boolean) => {
    const [highlighter, setHighlighter] = useState<PrismComponent>(null);
    const [style, setStyle] = useState<PrismStyle>(null);

    useEffect(() => {
        if (!shouldLoad || (highlighter && style)) return;

        let cancelled = false;

        const load = async () => {
            try {
                const [{ Prism }, themeModule] = await Promise.all([
                    import('react-syntax-highlighter'),
                    import('react-syntax-highlighter/dist/esm/styles/prism')
                ]);

                if (!cancelled) {
                    setHighlighter(() => Prism);
                    setStyle(isDarkMode ? themeModule.vscDarkPlus : themeModule.oneLight);
                }
            } catch (error) {
                console.error('Failed to load syntax highlighter', error);
            }
        };

        load();

        return () => {
            cancelled = true;
        };
    }, [shouldLoad, isDarkMode, highlighter, style]);

    return { highlighter, style };
};

// --- Theme Context & Custom Components ---
import { useTheme } from '@/context/ThemeContext';
import ZoomableImage from './ZoomableImage';
import { AsciiArtPlaceholder } from '@/lib/asciiPlaceholders';

// --- Icons (Example) ---
import { Copy } from 'lucide-react';

// === Interfaces & Types ===
interface ProjectMarkdownRendererProps {
    children: string;
    className?: string;
}
// Keep other necessary types (ReactMarkdownProps, ParagraphProps, etc.)
type ReactMarkdownProps = { node?: Element; children?: ReactNode; [key: string]: any; };
type ParagraphProps = ComponentPropsWithoutRef<'p'> & ReactMarkdownProps;
type BlockquoteProps = ComponentPropsWithoutRef<'blockquote'> & ReactMarkdownProps;
type CodeProps = ComponentPropsWithoutRef<'code'> & ReactMarkdownProps & { inline?: boolean };
type DivProps = ComponentPropsWithoutRef<'div'> & ReactMarkdownProps;
type HeadingProps = ComponentPropsWithoutRef<'h1'> & ReactMarkdownProps;
type ImgProps = ComponentPropsWithoutRef<'img'> & ReactMarkdownProps;
type TableProps = ComponentPropsWithoutRef<'table'> & ReactMarkdownProps;
type TableCellProps = ComponentPropsWithoutRef<'td'> & ReactMarkdownProps & { isHeader?: boolean };
type ListProps = ComponentPropsWithoutRef<'ul'> & ReactMarkdownProps & { ordered?: boolean; depth?: number };
type ListItemProps = ComponentPropsWithoutRef<'li'> & ReactMarkdownProps & { checked?: boolean | null; index?: number; ordered?: boolean };
type LinkProps = ComponentPropsWithoutRef<'a'> & ReactMarkdownProps;
type HrProps = ComponentPropsWithoutRef<'hr'> & ReactMarkdownProps;
type MarkProps = ComponentPropsWithoutRef<'mark'> & ReactMarkdownProps;

interface ProjectCalloutProps { children: React.ReactNode; type: 'note' | 'warning' | 'tip' | 'alert'; }
interface ImageGridProps { children: React.ReactNode; columns?: number; } // Keep if used


// === Helper Functions ===
/**
 * Extracts the raw text content from a HAST node or its children.
 */
const getNodeText = (node: ElementContent | Root | undefined): string => {
    // (Keep implementation as before)
    if (!node) return '';
    if (node.type === 'text') return node.value || '';
    // @ts-ignore
    if (node.children && Array.isArray(node.children)) {
        // @ts-ignore
        return node.children.map(getNodeText).join('');
    }
    return '';
};
/**
 * Parses a string of simple key=value attributes.
 */
const parseAttributes = (attrString: string): Record<string, string> => {
    // (Keep implementation as before)
    const attributes: Record<string, string> = {};
    const regex = /(\w+)(?:=(?:"([^"]*)"|'([^']*)'|([^}\s]+)))?/g;
    let match;
    while ((match = regex.exec(attrString)) !== null) {
        const key = match[1];
        const value = match[2] ?? match[3] ?? match[4] ?? 'true';
        attributes[key] = value;
    }
    return attributes;
};


// === Helper Components (Project Specific) ===

/**
 * Renders a simpler callout box for projects.
 */
const ProjectCallout: React.FC<ProjectCalloutProps> = ({ type, children }) => {
    return <div className={`project-callout project-callout-${type}`}>{children}</div>;
};

/**
 * Renders an image grid layout. (Keep if parsing logic added)
 */
const ImageGrid: React.FC<ImageGridProps> = ({ children, columns = 2 }) => {
    return <div className="image-grid" style={{ gridTemplateColumns: `repeat(${columns}, 1fr)` }}>{children}</div>;
};


// === Main Project Renderer Component ===
export function ProjectMarkdownRenderer({ children: rawMarkdown, className = "" }: ProjectMarkdownRendererProps) {
    const { isDarkMode } = useTheme();

    // Check if markdown has code blocks to trigger lazy loading
    const hasCodeBlocks = useMemo(() => /```\w+/.test(rawMarkdown), [rawMarkdown]);

    // Lazy load syntax highlighter only when needed
    const { highlighter: SyntaxHighlighter, style: syntaxStyle } = useLazySyntaxHighlighter(hasCodeBlocks, isDarkMode);

    // --- Optional: HAST Preprocessing for Project-Specific Syntax ---
    const rehypeProcessProjectSyntax: PluggableList[number] = () => {
        return (tree: Root) => {
           visit(tree, 'element', (node: Element) => {
                // Transform :::note/warning/tip/alert in blockquotes
                if (node.tagName === 'blockquote') {
                    const firstChild = node.children?.[0];
                    if (firstChild?.type === 'element' && firstChild.tagName === 'p') {
                        const textContent = getNodeText(firstChild).trim();
                         const calloutMatch = textContent.match(/^:::(note|warning|tip|alert)\s*$/);
                         if(calloutMatch) {
                            const type = calloutMatch[1] as ProjectCalloutProps['type'];
                            node.tagName = 'div';
                            node.properties = {
                                'data-custom-component': 'project-callout',
                                'data-callout-type': type,
                                className: ['project-callout', `project-callout-${type}`]
                            };
                            node.children = node.children.slice(1);
                         }
                    }
                }
                 // Add ImageGrid parsing if needed, e.g., based on :::grid{cols=3} syntax
                 // Example: Look for paragraphs starting with :::grid
                 if (node.tagName === 'p') {
                     const textContent = getNodeText(node).trim();
                     const gridMatch = textContent.match(/^:::grid\s*(?:\{columns?=(\d+)\})?\s*$/); // Match :::grid {cols=3}
                     if (gridMatch) {
                         const columns = gridMatch[1] ? parseInt(gridMatch[1], 10) : 2; // Default 2 columns
                         node.tagName = 'div'; // Change p to div
                         node.properties = {
                             'data-custom-component': 'image-grid',
                             'data-columns': String(columns), // Store columns
                             className: ['image-grid'] // Add class for CSS targeting
                         };
                         node.children = []; // Remove the marker text
                     }
                 }
           });
        };
    };

    // --- Component Overrides Map (Modern Style) ---
    const markdownComponents = useMemo((): Components => ({
        // Keep all Heading, p, a, hr, ul, ol, li overrides applying project-* classes

        h1: ({ node, children, ...props }: HeadingProps) => <h1 className="project-h1" {...props}>{children}</h1>,
        h2: ({ node, children, ...props }: HeadingProps) => <h2 className="project-h2" {...props}>{children}</h2>,
        h3: ({ node, children, ...props }: HeadingProps) => <h3 className="project-h3" {...props}>{children}</h3>,
        h4: ({ node, children, ...props }: HeadingProps) => <h4 className="project-h4" {...props}>{children}</h4>,
        h5: ({ node, children, ...props }: HeadingProps) => <h5 className="project-h5" {...props}>{children}</h5>,
        h6: ({ node, children, ...props }: HeadingProps) => <h6 className="project-h6" {...props}>{children}</h6>,
        p: ({ node, children, ...props }: ParagraphProps) => <p className="project-p" {...props}>{children}</p>,
        a: ({ node, children, href, ...props }: LinkProps) => ( <a href={href} className="project-link" target={href?.startsWith('http') ? '_blank' : undefined} rel={href?.startsWith('http') ? 'noopener noreferrer' : undefined} {...props}>{children}</a> ),
        hr: ({ node, ...props }: HrProps) => <hr className="project-hr" {...props} />,
        ul: ({ node, children, ...props }: ListProps) => <ul className="project-ul" {...props}>{children}</ul>,
        ol: ({ node, children, ...props }: ListProps) => <ol className="project-ol" {...props}>{children}</ol>,
        li: ({ node, children, ...props }: ListItemProps) => <li className="project-li" {...props}>{children}</li>,


        blockquote: ({ node, children, ...props }: BlockquoteProps) => {
            // Render standard project blockquote (callouts handled by div override now)
            return <blockquote className="project-blockquote" {...props}>{children}</blockquote>;
        },

        code: ({ node, inline, className: codeClassName, children: codeChildren, ...props }: CodeProps) => {
            const match = /language-(\w+)/.exec(codeClassName || '');
            const isBlock = !inline && match;
            if (isBlock) {
                const language = match[1];
                const codeString = String(codeChildren ?? '').replace(/\n$/, '');
                const handleCopy = () => navigator.clipboard.writeText(codeString);

                // Show loading skeleton while syntax highlighter loads
                if (!SyntaxHighlighter || !syntaxStyle) {
                    return (
                        <div className="project-code-block-wrapper">
                            <pre className="project-code-loading" style={{ padding: '1.2rem 1.5rem', borderRadius: 'var(--radius-lg)', backgroundColor: 'var(--bg-secondary)', fontFamily: 'var(--font-mono)', fontSize: '0.9rem' }}>
                                <code>{codeString}</code>
                            </pre>
                        </div>
                    );
                }

                return (
                    <div className="project-code-block-wrapper">
                        <SyntaxHighlighter style={syntaxStyle as any} language={language} PreTag="div" showLineNumbers customStyle={{ margin: '0', padding: '1.2rem 1.5rem', borderRadius: 'var(--radius-lg)', backgroundColor: 'transparent', }} codeTagProps={{ style: { fontFamily: 'var(--font-mono)', fontSize: '0.9rem', lineHeight: '1.6', } }} {...props} >
                            {codeString}
                        </SyntaxHighlighter>
                        <button type="button" className="project-copy-button" onClick={handleCopy} aria-label="Copy code" title="Copy"> <Copy size={14} /> </button>
                    </div> );
            }
            return <code className={`project-inline-code ${codeClassName || ''}`} {...props}>{codeChildren}</code>;
        },

        img: ({ node, src, alt, ...props }: ImgProps) => {
            // (Keep the existing image parsing logic and ZoomableImage rendering from previous response)
            if (!src) return <AsciiArtPlaceholder className="mx-auto my-8" />;
            const altString = typeof alt === 'string' ? alt : '';
            let imageSize: 'small' | 'medium' | 'large' | 'full' = 'large';
            let imageAlign: 'left' | 'center' | 'right' = 'center';
            let imageEffect: 'shadow' | 'none' = 'shadow';
            let imageBorder: 'none' | 'simple' = 'none'; // Simplified project borders
            let imageCaption = '';
            let altText = altString;
            let isZoomable = true;
             if (altString.includes('|')) {
                 const parts = altString.split('|');
                 altText = parts[0].trim();
                 parts.slice(1).forEach(part => {
                     const [key, value] = part.includes('=') ? part.split('=', 2) : [part.trim(), 'true'];
                     const trimmedKey = key.trim().toLowerCase();
                     const trimmedValue = value.trim().replace(/^["']|["']$/g, '');
                     switch (trimmedKey) {
                         case 'size': if (['small', 'medium', 'large', 'full'].includes(trimmedValue)) imageSize = trimmedValue as any; break;
                         case 'align': if (['left', 'center', 'right'].includes(trimmedValue)) imageAlign = trimmedValue as any; break;
                         case 'effect': if (['shadow', 'none'].includes(trimmedValue)) imageEffect = trimmedValue as any; break;
                         case 'border': if (['none', 'simple'].includes(trimmedValue)) imageBorder = trimmedValue as any; break;
                         case 'caption': imageCaption = trimmedValue; break;
                         case 'zoomable': isZoomable = trimmedValue !== 'false'; break;
                     }
                 });
             }
             return ( <div className={`markdown-image-wrapper project-image-wrapper align-${imageAlign}`}> <ZoomableImage src={src} alt={altText} caption={imageCaption} size={imageSize} effect={imageEffect} border={imageBorder} zoomable={isZoomable} {...props} /> </div> );
        },

        table: ({ node, children, ...props }: TableProps) => ( <div className="project-table-wrapper"> <table className="project-table" {...props}>{children}</table> </div> ),
        th: ({ node, children, ...props }: TableCellProps) => <th className="project-th" {...props}>{children}</th>,
        td: ({ node, children, ...props }: TableCellProps) => <td className="project-td" {...props}>{children}</td>,

        // --- Div Override (Handles components transformed by HAST plugin) ---
        div: ({ node, children, ...props }: DivProps) => {
            // *** FIX 1: Add check for node ***
            if (!node) {
                // Render a default div or fragment if node is somehow undefined
                // This case should be rare with react-markdown
                return <div {...props}>{children}</div>;
            }

            const componentType = node.properties?.['data-custom-component'];

            // Handle project callouts transformed by HAST plugin
            if (componentType === 'project-callout') {
                const calloutType = node.properties['data-callout-type'];
                if (typeof calloutType === 'string') {
                     return <ProjectCallout type={calloutType as ProjectCalloutProps['type']}>{children}</ProjectCallout>;
                }
            }

            // Handle Image Grids transformed by HAST plugin
            if (componentType === 'image-grid') {
                const columnsAttr = node.properties['data-columns'];
                const columns = typeof columnsAttr === 'string' ? parseInt(columnsAttr, 10) : 2;
                // Need to filter children if HAST plugin didn't remove text nodes
                 const imageChildren = Children.toArray(children).filter(child =>
                     isValidElement(child) &&
                     (child.type === 'img' || (child.props as any)?.className?.includes('markdown-image-wrapper'))
                 );
                return <ImageGrid columns={columns}>{imageChildren}</ImageGrid>;
            }

            // Default div rendering
            return <div {...props}>{children}</div>;
        },

        // --- Mark Tag Override ---
        mark: ({ node, children, ...props }: MarkProps) => {
           return <mark className="project-mark" {...props}>{children}</mark>
        }

    }), [isDarkMode, SyntaxHighlighter, syntaxStyle]);

    // --- Plugin Configuration ---
    const remarkPlugins: PluggableList = [remarkGfm, remarkMath, remarkUnwrapImages];
    const rehypePlugins: PluggableList = [
        // *** FIX 2b: Add rehype-raw ***
        rehypeRaw, // Process raw HTML elements like <mark>
        rehypeSlug,
        [rehypeAutolinkHeadings, { behavior: 'wrap' }],
        rehypeKatex,
        rehypeProcessProjectSyntax // Apply project-specific transformations
    ];

    // --- Final Render ---
    return (
        <div className={`project-prose ${className}`}>
            <ReactMarkdown
                children={rawMarkdown}
                components={markdownComponents}
                remarkPlugins={remarkPlugins}
                rehypePlugins={rehypePlugins}
                // *** FIX 2c: Remove invalid prop ***
                // rehypeAllowDangerousHtml={true} // REMOVED - Use rehype-raw plugin instead
            />
        </div>
    );
}