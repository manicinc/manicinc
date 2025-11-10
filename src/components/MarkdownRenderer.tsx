// src/components/CustomMarkdownRenderer.tsx
// Renderer for the main Blog section, featuring ornate styles and custom syntax.
// V4 - Improved Formatting & Comments, includes fixes for TS errors.

'use client';

// --- Core React/Next Imports ---
import React, {
    ReactNode,
    useMemo,
    isValidElement,
    ComponentPropsWithoutRef,
    CSSProperties,
    Children,
    useState,
    useEffect,
    useRef
} from 'react';

// --- Markdown Processing Libraries ---
import ReactMarkdown from 'react-markdown';              // Renders Markdown as React components
import remarkMath from 'remark-math';                    // Parses $math$ and $$math$$ syntax
import rehypeKatex from 'rehype-katex';                  // Renders math using KaTeX
import rehypeSlug from 'rehype-slug';                    // Adds `id` slugs to headings
import rehypeAutolinkHeadings from 'rehype-autolink-headings'; // Adds links to headings
import remarkGfm from 'remark-gfm';                      // Adds support for GitHub Flavored Markdown (tables, etc.)
import remarkUnwrapImages from 'remark-unwrap-images';     // Removes <p> tags around images
import rehypeRaw from 'rehype-raw';                      // Allows raw HTML in Markdown (necessary for <mark>, etc.)
import { Components } from 'react-markdown';             // Type definition for component overrides map
import type { PluggableList } from 'unified';            // Type for plugin arrays
import type { Element, Text, Root, ElementContent } from 'hast'; // Types for Abstract Syntax Tree nodes
import { visit } from 'unist-util-visit';                  // AST traversal utility
import { SKIP } from 'unist-util-visit';                 // Visit control constants

// --- Theme Context & Custom Components ---
import { useTheme } from '@/context/ThemeContext';        // Hook for dark/light mode detection
import ResponsiveImage from '@/components/ResponsiveImage';
import { AsciiArtPlaceholder } from '@/lib/asciiPlaceholders'; // Fallback image

// --- Icons (Using lucide-react as an example) ---
import { Info, AlertTriangle, Lightbulb, Siren, Copy } from 'lucide-react';

// ==================================
// === Interfaces & Types ===
// ==================================

interface CustomReactMarkdownProps {
    children: string;   // The raw markdown input string
    className?: string; // Optional additional CSS class
}

// Base type for props passed to component overrides
type ReactMarkdownProps = {
    node?: Element;    // The HAST node being rendered
    children?: ReactNode; // Rendered React children
    [key: string]: any; // Allow other props passed down
};

// Specific prop types for overriding standard HTML elements
type ParagraphProps = ComponentPropsWithoutRef<'p'> & ReactMarkdownProps;
type BlockquoteProps = ComponentPropsWithoutRef<'blockquote'> & ReactMarkdownProps;
type CodeProps = ComponentPropsWithoutRef<'code'> & ReactMarkdownProps & { inline?: boolean };
type DivProps = ComponentPropsWithoutRef<'div'> & ReactMarkdownProps;
type HeadingProps = ComponentPropsWithoutRef<'h1'> & ReactMarkdownProps; // Works for h1-h6
type ImgProps = Omit<ComponentPropsWithoutRef<'img'>, 'children' | 'node'> & ReactMarkdownProps; // Omit conflicting props
type TableProps = ComponentPropsWithoutRef<'table'> & ReactMarkdownProps;
type TableCellProps = ComponentPropsWithoutRef<'td'> & ReactMarkdownProps & { isHeader?: boolean };
type ListProps = ComponentPropsWithoutRef<'ul'> & ReactMarkdownProps & { ordered?: boolean; depth?: number };
type ListItemProps = ComponentPropsWithoutRef<'li'> & ReactMarkdownProps & { checked?: boolean | null; index?: number; ordered?: boolean };
type LinkProps = ComponentPropsWithoutRef<'a'> & ReactMarkdownProps;
type HrProps = ComponentPropsWithoutRef<'hr'> & ReactMarkdownProps;
type MarkProps = ComponentPropsWithoutRef<'mark'> & ReactMarkdownProps;

// Prop types for custom components parsed from markdown or HAST
interface ImageGridProps { children: React.ReactNode; columns?: number; }
interface BannerProps { children: ReactNode; attributes?: Record<string, string>; }
interface CalloutProps { children: React.ReactNode; type: 'note' | 'warning' | 'tip' | 'alert'; }
interface CustomQuoteProps { children: React.ReactNode; attribution?: ReactNode; }

// ==================================
// === Helper Functions ===
// ==================================

/**
 * Extracts the raw text content from a HAST node or its children recursively.
 */
const getNodeText = (node: ElementContent | Root | undefined): string => {
    if (!node) return '';
    if (node.type === 'text') return node.value || '';
    // @ts-ignore Check if node has children (covers Element and Root)
    if (node.children && Array.isArray(node.children)) {
        // @ts-ignore Recursively map children and join text
        return node.children.map(getNodeText).join('');
    }
    return '';
};

/**
 * Parses a string of simple key=value attributes (e.g., {key="value" boolKey}).
 */
const parseAttributes = (attrString: string): Record<string, string> => {
    const attributes: Record<string, string> = {};
    const regex = /(\w+)(?:=(?:"([^"]*)"|'([^']*)'|([^}\s]+)))?/g;
    let match;
    while ((match = regex.exec(attrString)) !== null) {
        const key = match[1];
        const value = match[2] ?? match[3] ?? match[4] ?? 'true'; // Default boolean keys to 'true'
        attributes[key] = value;
    }
    return attributes;
};

// ==================================
// === Helper Components ===
// ==================================

/** Renders an image grid layout. */
const ImageGrid: React.FC<ImageGridProps> = ({ children, columns = 2 }) => {
    return (
        <div className="image-grid" style={{ gridTemplateColumns: `repeat(${columns}, 1fr)` }}>
            {children}
        </div>
    );
};

/** Renders a banner element with customizable attributes. */
const Banner: React.FC<BannerProps> = ({ children, attributes = {} }) => {
    const style: CSSProperties = {
        backgroundColor: attributes.backgroundColor || 'var(--accent-primary)',
        color: attributes.textColor || 'var(--text-on-accent)',
        textAlign: attributes.alignment as any || 'center',
        padding: attributes.size === 'large' ? '2rem' : attributes.size === 'small' ? '0.5rem' : '1rem',
    };
    const icon = attributes.icon;
    return (
        <div className={`banner align-${style.textAlign}`} style={style}>
            {icon && <span className="banner-icon" style={{ marginRight: '0.75rem' }}>{icon}</span>}
            {children}
        </div>
    );
};

/** Renders a callout box (note, warning, tip, alert). */
const Callout: React.FC<CalloutProps> = ({ type, children }) => {
    const Icon = { note: Info, warning: AlertTriangle, tip: Lightbulb, alert: Siren }[type] || Info;
    const title = type.charAt(0).toUpperCase() + type.slice(1);
    return (
        <div className={`callout callout-${type}`}>
            <div className="callout-title">
                <Icon className="callout-icon" size={20} />
                {title}
            </div>
            <div className="callout-content">{children}</div>
        </div>
    );
};

/** Renders an ornate styled quote with optional attribution. */
const CustomQuote: React.FC<CustomQuoteProps> = ({ children, attribution }) => {
    return (
        <blockquote className="styled-quote">
            <div className="quote-content">{children}</div>
            {attribution && (<footer className="quote-attribution">{attribution}</footer>)}
        </blockquote>
    );
};

// ==================================
// === Syntax Highlighter Helpers ===
// ==================================

type PrismComponent = typeof import('react-syntax-highlighter')['Prism'] | null;
type PrismStyle = Record<string, any> | null;

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
                    setStyle(isDarkMode ? themeModule.coldarkDark : themeModule.prism);
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



// ==================================
// === Main Renderer Component ===
// ==================================
export function CustomMarkdownRenderer({ children: rawMarkdown, className = "" }: CustomReactMarkdownProps) {
    const { isDarkMode } = useTheme();

    // --- HAST Tree Preprocessing Plugin ---
    // Modifies the Markdown Abstract Syntax Tree before rendering
    const rehypeProcessCustomSyntax: PluggableList[number] = () => {
        return (tree: Root) => {
            let collectingBanner = false;
            let bannerNode: Element | null = null;
            let bannerContent: string[] = [];
            let collectingCallout = false;
            let calloutNode: Element | null = null;
            let calloutContent: string[] = [];

            visit(tree, 'element', (node: Element, index, parent) => {

                // Transform :::banner paragraphs into divs with data attributes
                if (node.tagName === 'p') {
                    const textContent = getNodeText(node).trim();
                    
                    // Check for single-line banner with closing :::
                    const singleLineBannerMatch = textContent.match(/^:::banner\s*(?:\{([^}]*)\})?\s*(.*?)\s*:::$/);
                    if (singleLineBannerMatch) {
                        const [, attrString = '', bannerText] = singleLineBannerMatch;
                        const attributes = parseAttributes(attrString);
                        
                        // Transform this node to banner
                        node.tagName = 'div';
                        node.properties = {
                            ...node.properties,
                            'data-custom-component': 'banner',
                            'data-banner-attrs': JSON.stringify(attributes),
                        };
                        node.children = [{ type: 'text', value: bannerText.trim() }];
                        return;
                    }
                    
                    // Check for multiline banner start (:::banner{...} or just :::banner)
                    const bannerStartMatch = textContent.match(/^:::banner\s*(?:\{([^}]*)\})?(.*)$/);
                    if (bannerStartMatch) {
                        const [, attrString = '', remainingText] = bannerStartMatch;
                        const attributes = parseAttributes(attrString);
                        
                        // Start collecting banner content
                        collectingBanner = true;
                        bannerContent = [];
                        
                        // Check if there's content on the same line
                        if (remainingText.trim()) {
                            bannerContent.push(remainingText.trim());
                        }
                        
                        // Transform this node to banner
                        node.tagName = 'div';
                        node.properties = {
                            ...node.properties,
                            'data-custom-component': 'banner',
                            'data-banner-attrs': JSON.stringify(attributes),
                        };
                        bannerNode = node;
                        return;
                    }
                    
                    // Check for banner end (standalone :::)
                    if (textContent === ':::' && collectingBanner) {
                        // End banner collection
                        collectingBanner = false;
                        if (bannerNode) {
                            (bannerNode as any).children = [{ type: 'text', value: bannerContent.join(' ') }];
                        }
                        // Mark this node for removal
                        node.properties = { 'data-remove': 'true' };
                        return;
                    }
                    
                    // If we're collecting banner content, add this text
                    if (collectingBanner) {
                        bannerContent.push(textContent);
                        // Mark this node for removal
                        node.properties = { 'data-remove': 'true' };
                        return;
                    }
                    
                    // If we're collecting callout content, add this text
                    if (collectingCallout) {
                        calloutContent.push(textContent);
                        // Mark this node for removal
                        node.properties = { 'data-remove': 'true' };
                        return;
                    }
                    
                    // Check for standalone callouts (:::alert, :::tip, etc.)
                    const calloutMatch = textContent.match(/^:::(note|warning|tip|alert)\s*(.*)$/);
                    if (calloutMatch) {
                        const [, type, content] = calloutMatch;
                        
                        // Check if this is a single-line callout with content
                        if (content.trim()) {
                            // Single-line callout - transform immediately
                            node.tagName = 'div';
                            node.properties = {
                                'data-custom-component': 'callout',
                                'data-callout-type': type,
                                className: ['callout', `callout-${type}`]
                            };
                            node.children = [{ type: 'text', value: content.trim() }];
                            return;
                        } else {
                            // Multi-line callout - start collecting
                            collectingCallout = true;
                            calloutContent = [];
                            
                            // Transform this node to callout
                            node.tagName = 'div';
                            node.properties = {
                                'data-custom-component': 'callout',
                                'data-callout-type': type,
                                className: ['callout', `callout-${type}`]
                            };
                            calloutNode = node;
                            // Clear the marker text
                            node.children = [];
                            return;
                        }
                    }
                    
                    // Check for empty line (end of callout content)
                    if (textContent === '' && collectingCallout) {
                        // End callout collection
                        collectingCallout = false;
                        if (calloutNode) {
                            (calloutNode as any).children = [{ type: 'text', value: calloutContent.join(' ') }];
                        }
                        // Mark this node for removal
                        node.properties = { 'data-remove': 'true' };
                        return;
                    }
                }

                // Transform :::callout blockquotes into divs with data attributes
                if (node.tagName === 'blockquote') {
                    const firstChild = node.children?.[0];
                    if (firstChild?.type === 'element' && firstChild.tagName === 'p') {
                        const textContent = getNodeText(firstChild).trim();
                        const calloutMatch = textContent.match(/^:::(note|warning|tip|alert)\s*$/);
                        if (calloutMatch) {
                            const type = calloutMatch[1] as CalloutProps['type'];
                            node.tagName = 'div';
                            node.properties = {
                                'data-custom-component': 'callout',
                                'data-callout-type': type,
                                className: ['callout', `callout-${type}`]
                            };
                            node.children = node.children.slice(1); // Remove the marker paragraph
                            return; // Stop further processing for this node
                        }
                    }
                }
                 // Add ImageGrid parsing if needed (e.g., :::grid{cols=3})
                 if (node.tagName === 'p') {
                     const textContent = getNodeText(node).trim();
                     const gridMatch = textContent.match(/^:::grid\s*(?:\{columns?=(\d+)\})?\s*$/);
                     if (gridMatch) {
                         const columns = gridMatch[1] ? parseInt(gridMatch[1], 10) : 2;
                         node.tagName = 'div';
                         node.properties = {
                             'data-custom-component': 'image-grid',
                             'data-columns': String(columns),
                             className: ['image-grid']
                         };
                         node.children = []; // Clear the marker text
                         return;
                     }
                 }
            });
            
            // Final cleanup: if we're still collecting content at the end, finalize it
            if (collectingBanner && bannerNode) {
                (bannerNode as any).children = [{ type: 'text', value: bannerContent.join(' ') }];
            }
            if (collectingCallout && calloutNode) {
                (calloutNode as any).children = [{ type: 'text', value: calloutContent.join(' ') }];
            }
            
            // Second pass: remove nodes marked for removal
            visit(tree, 'element', (node: Element, index, parent) => {
                if (node.properties?.['data-remove'] && parent && typeof index === 'number') {
                    parent.children.splice(index, 1);
                    return [SKIP, index];
                }
            });
        };
    };

    // --- Component Overrides Map ---
    // Memoize to avoid re-creation on every render, depends on theme for syntax highlighting
    const markdownComponents = useMemo((): Components => ({

        // Override 'p' for Lead Paragraphs (>>>)
        p: ({ node, children: pChildren, ...props }: ParagraphProps) => {
            const textValue = getNodeText(node).trim();
            const leadMarker = '>>>';
            if (textValue.startsWith(leadMarker)) {
                // Simplified logic to remove marker mainly from first text child
                const stripFirstChildMarker = (childrenToProcess: ReactNode): ReactNode => {
                    const childrenArray = Children.toArray(childrenToProcess);
                    if (childrenArray.length > 0 && typeof childrenArray[0] === 'string') {
                        const firstChild = childrenArray[0];
                        if (firstChild.startsWith(leadMarker)) {
                            // Remove the marker and any immediately following whitespace
                            let modifiedFirst = firstChild.substring(leadMarker.length);
                            // Trim leading whitespace from the modified text
                            modifiedFirst = modifiedFirst.replace(/^\s+/, '');
                            // Return new array with modified first child
                            return [modifiedFirst, ...childrenArray.slice(1)];
                        }
                    }
                    return childrenToProcess; // Return original children if no marker found
                };
                const modifiedChildren = stripFirstChildMarker(pChildren);
                return <p className="lead-paragraph" {...props}>{modifiedChildren}</p>;
            }
            return <p {...props}>{pChildren}</p>; // Default paragraph
        },

        // Override 'blockquote' for Styled Quotes (*"..."*), Lead Paragraphs (>>>), and standard quotes
        blockquote: ({ node, children: bqChildren, ...props }: BlockquoteProps) => {
            // Check if node exists before accessing children (Fixes TS error)
            if (!node) return <blockquote className="standard-blockquote" {...props}>{bqChildren}</blockquote>;

            // Check for Lead Paragraph syntax (>>> converted to nested blockquotes)
            const nodeText = getNodeText(node).trim();
            if (nodeText.startsWith('>>>')) {
                // Extract the content after the >>> marker
                const leadContent = nodeText.substring(3).trim();
                return <p className="lead-paragraph">{leadContent}</p>;
            }
            
            // Check for deeply nested blockquotes (>>> creates nested structure)
            const checkForLeadParagraph = (currentNode: any): boolean => {
                if (currentNode.tagName === 'blockquote') {
                    const childBlockquote = currentNode.children?.find((child: any) => child.tagName === 'blockquote');
                    if (childBlockquote) {
                        const grandchildBlockquote = childBlockquote.children?.find((child: any) => child.tagName === 'blockquote');
                        if (grandchildBlockquote) {
                            // This is likely a >>> lead paragraph (triple nested)
                            return true;
                        }
                    }
                }
                return false;
            };
            
            if (checkForLeadParagraph(node)) {
                // Extract content from deeply nested structure
                const content = getNodeText(node).trim();
                return <p className="lead-paragraph">{content}</p>;
            }

            // Check for Styled Quote syntax
            const firstChild = node.children?.[0];
            if (firstChild?.type === 'element' && firstChild.tagName === 'p') {
                 const quoteTextContent = getNodeText(firstChild).trim();
                 if (quoteTextContent.startsWith('*"') && quoteTextContent.endsWith('"*')) {
                     const quoteText = quoteTextContent.substring(2, quoteTextContent.length - 2).trim();
                     let attributionContent: ReactNode = null;
                     // Check for attribution in the second paragraph
                     if (node.children.length > 1) {
                        const secondChildNode = node.children[1];
                         if (secondChildNode?.type === 'element' && secondChildNode.tagName === 'p') {
                             const rawAttributionText = getNodeText(secondChildNode).trim();
                             const dashMarker = '— ';
                             attributionContent = rawAttributionText.startsWith(dashMarker)
                                 ? rawAttributionText.substring(dashMarker.length)
                                 : rawAttributionText;
                         }
                    }
                     return <CustomQuote attribution={attributionContent}>{quoteText}</CustomQuote>;
                 }
            }
            // Default to standard blockquote rendering
            return <blockquote className="standard-blockquote" {...props}>{bqChildren}</blockquote>;
        },

        // Override 'code' for Syntax Highlighting and Inline Code
        code: ({ inline, className: codeClassName, children: codeChildren, node: _node, ...restProps }: CodeProps) => {
            const match = /language-(\w+)/.exec(codeClassName || '');
            const isBlock = !inline && !!match;
            const codeString = String(codeChildren ?? '').replace(/\n$/, '');

            if (!isBlock) {
                return (
                    <code
                        className={`inline-code ${codeClassName || ''}`}
                        {...restProps}
                    >
                        {codeChildren}
                    </code>
                );
            }

            const language = match ? match[1] : 'text';
            const wrapperRef = useRef<HTMLDivElement | null>(null);
            const [isVisible, setIsVisible] = useState(false);

            useEffect(() => {
                const element = wrapperRef.current;
                if (!element) return;

                const observer = new IntersectionObserver(
                    (entries) => {
                        entries.forEach((entry) => {
                            if (entry.isIntersecting) {
                                setIsVisible(true);
                                observer.disconnect();
                            }
                        });
                    },
                    { rootMargin: '200px' }
                );

                observer.observe(element);
                return () => observer.disconnect();
            }, []);

            const { highlighter, style } = useLazySyntaxHighlighter(isVisible, isDarkMode);
            const handleCopy = () =>
                navigator.clipboard.writeText(codeString).catch(err => console.error('Failed to copy code:', err));

            return (
                <div className="code-block-wrapper" ref={wrapperRef}>
                    <div className="code-block-header">
                        <span className="code-language">{language}</span>
                        <button
                            type="button"
                            className="code-copy-button"
                            onClick={handleCopy}
                            aria-label="Copy code to clipboard"
                        >
                            <Copy size={14} />
                        </button>
                    </div>
                    {highlighter && style ? (
                        React.createElement(highlighter, {
                            style,
                            language,
                            PreTag: 'div',
                            customStyle: {
                                borderRadius: '0 0 var(--radius-lg) var(--radius-lg)',
                                marginTop: 0,
                                marginBottom: 0,
                                padding: '1.2rem 1.5rem',
                                border: 'none',
                                background: 'transparent'
                            },
                            codeTagProps: {
                                style: {
                                    fontFamily: 'var(--font-mono)',
                                    fontSize: '0.95rem',
                                    lineHeight: 1.7
                                }
                            },
                            children: codeString
                        })
                    ) : (
                        <pre className="code-block-placeholder">
                            <code>{codeString}</code>
                        </pre>
                    )}
                </div>
            );
        },

        // Override 'img' for Custom Image Handling (Zoom, Effects, Borders, Captions)
        img: ({ src, alt }: ImgProps) => {
            if (!src) return <AsciiArtPlaceholder className="mx-auto my-8" />;

            const altString = typeof alt === 'string' ? alt : '';
            let altText = altString;
            let imageCaption = '';
            let imageSize: 'small' | 'medium' | 'large' | 'full' = 'medium';
            let imageAlign: 'left' | 'center' | 'right' = 'center';
            let effectClass = '';
            let borderClass = '';
            let customWidth: number | undefined;
            let customHeight: number | undefined;

            if (altString.includes('|')) {
                const parts = altString.split('|');
                altText = parts[0].trim();

                parts.slice(1).forEach(part => {
                    const [key, raw] = part.includes('=') ? part.split('=', 2) : [part.trim(), 'true'];
                    const trimmedKey = key.trim().toLowerCase();
                    const trimmedValue = raw.trim().replace(/^["']|["']$/g, '');

                    switch (trimmedKey) {
                        case 'size':
                            if (['small', 'medium', 'large', 'full'].includes(trimmedValue)) {
                                imageSize = trimmedValue as typeof imageSize;
                            }
                            break;
                        case 'align':
                            if (['left', 'center', 'right'].includes(trimmedValue)) {
                                imageAlign = trimmedValue as typeof imageAlign;
                            }
                            break;
                        case 'effect':
                            effectClass = `image-${trimmedValue}`;
                            break;
                        case 'border':
                            borderClass = `border-${trimmedValue}`;
                            break;
                        case 'caption':
                            imageCaption = trimmedValue;
                            break;
                        case 'width':
                            customWidth = Number(trimmedValue) || undefined;
                            break;
                        case 'height':
                            customHeight = Number(trimmedValue) || undefined;
                            break;
                    }
                });
            }

            const sizeToSizes: Record<'small' | 'medium' | 'large' | 'full', string> = {
                small: '(max-width: 768px) 90vw, 320px',
                medium: '(max-width: 768px) 95vw, 640px',
                large: '(max-width: 768px) 95vw, 960px',
                full: '(max-width: 768px) 100vw, 1200px'
            };

            const widthMap: Record<'small' | 'medium' | 'large' | 'full', number> = {
                small: 480,
                medium: 720,
                large: 1080,
                full: 1280
            };

            const responsiveWidth = customWidth ?? widthMap[imageSize];
            const responsiveHeight = customHeight ?? Math.round(responsiveWidth * 0.5625); // default 16:9

            return (
                <figure className={`markdown-image-wrapper align-${imageAlign}`}>
                    <ResponsiveImage
                        src={src}
                        alt={altText}
                        width={responsiveWidth}
                        height={responsiveHeight}
                        sizes={sizeToSizes[imageSize]}
                        className={`content-image image-${imageSize} ${effectClass} ${borderClass}`.trim()}
                    />
                    {imageCaption && <figcaption>{imageCaption}</figcaption>}
                </figure>
            );
        },

        // Override Table elements for styling
        table: ({ node, children, ...props }: TableProps) => (<div className="table-wrapper"><table {...props}>{children}</table></div>),
        thead: ({ node, children, ...props }) => <thead className="md-thead" {...props}>{children}</thead>,
        tbody: ({ node, children, ...props }) => <tbody className="md-tbody" {...props}>{children}</tbody>,
        tr: ({ node, children, ...props }) => <tr className="md-tr" {...props}>{children}</tr>,
        th: ({ node, children, isHeader, ...props }: TableCellProps) => <th className="md-th" {...props}>{children}</th>,
        td: ({ node, children, isHeader, ...props }: TableCellProps) => <td className="md-td" {...props}>{children}</td>,

        // Override Headings for styling
        h1: ({ node, children, level, ...props }: HeadingProps) => <h1 className="md-h1" {...props}>{children}</h1>,
        h2: ({ node, children, level, ...props }: HeadingProps) => <h2 className="md-h2" {...props}>{children}</h2>,
        h3: ({ node, children, level, ...props }: HeadingProps) => <h3 className="md-h3" {...props}>{children}</h3>,
        h4: ({ node, children, level, ...props }: HeadingProps) => <h4 className="md-h4" {...props}>{children}</h4>,
        h5: ({ node, children, level, ...props }: HeadingProps) => <h5 className="md-h5" {...props}>{children}</h5>,
        h6: ({ node, children, level, ...props }: HeadingProps) => <h6 className="md-h6" {...props}>{children}</h6>,

        // Override Links for styling and target blank
        a: ({ node, children, href, ...props }: LinkProps) => ( <a href={href} className="md-link" target={href?.startsWith('http') ? '_blank' : undefined} rel={href?.startsWith('http') ? 'noopener noreferrer' : undefined} {...props}>{children}</a> ),

        // Override Horizontal Rule for styling
        hr: ({ node, ...props }: HrProps) => <hr className="md-hr" {...props} />,

        // Override Lists for styling
        ul: ({ node, children, ordered, depth, ...props }: ListProps) => <ul className="md-ul" {...props}>{children}</ul>,
        ol: ({ node, children, ordered, depth, ...props }: ListProps) => <ol className="md-ol" {...props}>{children}</ol>,
        li: ({ node, children, checked, index, ordered, ...props }: ListItemProps) => <li className="md-li" {...props}>{children}</li>,

        // Override 'div' to handle components transformed by HAST plugin
        div: ({ node, children, ...props }: DivProps) => {
            // Check node existence (Fixes TS error)
            if (!node) return <div {...props}>{children}</div>;

            const componentType = node.properties?.['data-custom-component'];

            // Render Banner if identified
            if (componentType === 'banner') {
                const attrsString = node.properties['data-banner-attrs'];
                const attributes = typeof attrsString === 'string' ? JSON.parse(attrsString) : {};
                return <Banner attributes={attributes}>{children}</Banner>;
            }

            // Render Callout if identified
            if (componentType === 'callout') {
                const calloutType = node.properties['data-callout-type'];
                if (typeof calloutType === 'string') {
                     return <Callout type={calloutType as CalloutProps['type']}>{children}</Callout>;
                }
            }

             // Render ImageGrid if identified
             if (componentType === 'image-grid') {
                const columnsAttr = node.properties['data-columns'];
                const columns = typeof columnsAttr === 'string' ? parseInt(columnsAttr, 10) : 2;
                // Filter out non-image children if necessary (depends on how HAST plugin structures it)
                 const imageChildren = Children.toArray(children).filter(child => isValidElement(child)); // Basic filter
                return <ImageGrid columns={columns}>{imageChildren}</ImageGrid>;
            }

            // Handle simple alignment divs if raw HTML is used
            const style = node.properties?.style;
            if (typeof style === 'string' && (style.includes('text-align: center') || style.includes('text-align: right') || style.includes('text-align: justify'))) {
                 return <div {...props}>{children}</div>;
            }

            // Default div rendering
            return <div {...props}>{children}</div>;
        },

        // Override 'mark' for styling
        mark: ({ node, children, ...props }: MarkProps) => {
           return <mark className="markdown-mark" {...props}>{children}</mark>
        }

    }), [isDarkMode]); // End of useMemo for components

    // --- Plugin Configuration ---
    const remarkPlugins: PluggableList = [
        remarkGfm,              // GitHub Flavored Markdown support
        remarkMath,             // Math syntax support
        remarkUnwrapImages      // Remove wrapping <p> tags around images
    ];
    const rehypePlugins: PluggableList = [
        rehypeRaw,              // Allow raw HTML rendering (IMPORTANT)
        rehypeSlug,             // Add IDs to headings
        [rehypeAutolinkHeadings, { behavior: 'wrap' }], // Add links to headings
        rehypeKatex,            // Render math equations
        rehypeProcessCustomSyntax // Apply custom HAST transformations
    ];

    // --- Final Render ---
    return (
        <div className={`blog-content ${className || ''}`}> {/* Ensure className is applied */}
            <ReactMarkdown
                components={markdownComponents}
                remarkPlugins={remarkPlugins}
                rehypePlugins={rehypePlugins}
                // Do NOT use rehypeAllowDangerousHtml - use rehypeRaw plugin instead
            >
                {rawMarkdown}
            </ReactMarkdown>
        </div>
    );
}