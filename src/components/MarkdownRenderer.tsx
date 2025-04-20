'use client';

import React, { ReactNode, useMemo, isValidElement, ComponentPropsWithoutRef, CSSProperties } from 'react';
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { coldarkDark } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { prism } from 'react-syntax-highlighter/dist/esm/styles/prism'; // Light theme
import { useTheme } from '@/context/ThemeContext'; // Adjust path if needed
import ZoomableImage from './ZoomableImage';
import { AsciiArtPlaceholder } from '@/lib/asciiPlaceholders';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import rehypeSlug from 'rehype-slug';
import rehypeAutolinkHeadings from 'rehype-autolink-headings';
import remarkGfm from 'remark-gfm';
import remarkUnwrapImages from 'remark-unwrap-images';
import { Components } from 'react-markdown';
import type { PluggableList } from 'unified';
import type { Element, Text, Comment, ElementContent } from 'hast';

// --- Interfaces ---
interface CustomReactMarkdownProps {
    children: string;
    className?: string;
}

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

interface ImageGridProps { children: React.ReactNode; columns?: number; }
interface BannerProps { text: string; attributes?: Record<string, string>; /* Allow passing parsed attributes */ }
interface NoteProps { children: React.ReactNode; type?: 'note' | 'warning' | 'tip' | 'info'; attributes?: Record<string, string>; }
interface CustomQuoteProps { children: React.ReactNode; attributes?: Record<string, string>; }

// --- Helper Components ---
const ImageGrid: React.FC<ImageGridProps> = ({ children, columns = 2 }) => { 
    return <div className="image-grid" style={{ display: 'grid', gridTemplateColumns: `repeat(${columns}, 1fr)`, gap: '1rem' }}>{children}</div>; 
};

// Basic Banner - Enhance this as needed based on your design
const Banner: React.FC<BannerProps> = ({ text, attributes }) => {
    // Example: Apply styles/classes based on attributes
    const bgColor = attributes?.backgroundColor || 'rgba(var(--accent-highlight-rgb), 0.1)'; // Default background
    const textColor = attributes?.textColor || 'var(--accent-highlight)'; // Default text color
    return <div className="banner" style={{ backgroundColor: bgColor, color: textColor, padding: '1rem 1.5rem', margin: '2rem 0' }}>{text}</div>;
};

// New Note Component
const Note: React.FC<NoteProps> = ({ children, type = 'note', attributes }) => {
    // Define styles based on note type and theme compatibility
    const getNoteStyles = () => {
        const baseStyles = {
            padding: '1rem 1.5rem',
            margin: '1.5rem 0',
            borderLeft: '4px solid var(--note-border-color, #6B7280)',
            backgroundColor: 'var(--note-bg-color, rgba(107, 114, 128, 0.1))',
            borderRadius: '0.375rem',
        };
        
        // You could add specific styles for different note types
        return baseStyles;
    };

    const style = getNoteStyles();
    
    // Add CSS variables that will be controlled by theme
    const cssVars = {
        '--note-border-color': attributes?.borderColor || '#6B7280',
        '--note-bg-color': attributes?.backgroundColor || 'rgba(107, 114, 128, 0.1)'
    } as React.CSSProperties;

    return (
        <div className={`markdown-note markdown-note-${type}`} style={{...style, ...cssVars}}>
            {children}
        </div>
    );
};

const getNodeText = (node: ElementContent | undefined): string => {
    if (!node) return '';
    if (node.type === 'text') return node.value || '';
    if (node.type === 'element' && node.children) {
        return node.children.map(getNodeText).join('');
    }
    return '';
};

// Helper to parse simple key=value attributes from a string like {key1="value1" key2=value2}
const parseAttributes = (attrString: string): Record<string, string> => {
    const attributes: Record<string, string> = {};
    const regex = /(\w+)(?:=(?:"([^"]*)"|'([^']*)'|([^}\s]+)))?/g;
    let match;
    while ((match = regex.exec(attrString)) !== null) {
        const key = match[1];
        const value = match[2] ?? match[3] ?? match[4] ?? 'true'; // Handle double quotes, single quotes, or unquoted values
        attributes[key] = value;
    }
    return attributes;
};

// Helper function to preprocess markdown content
const preprocessMarkdown = (content: string): string => {
    let processed = content.replace(/:::(note|warning|tip|info)\s+([\s\S]*?):::/g, (_, type, content) => {
        // Convert to a div with special data attributes that our renderer can identify
        return `<div data-note-type="${type}">\n\n${content.trim()}\n\n</div>`;
    });
    
    // Process :::quote syntax similarly
    processed = processed.replace(/:::quote\s*(?:\{([^}]*)\})?\s*([\s\S]*?):::/g, (_, attrs, content) => {
        // Convert to a div with a data-quote attribute
        const attrString = attrs ? ` data-quote-attrs="${attrs.replace(/"/g, '&quot;')}"` : '';
        return `<div data-quote${attrString}>\n\n${content.trim()}\n\n</div>`;
    });
    
    return processed;
};

// New Custom Quote Component
const CustomQuote: React.FC<CustomQuoteProps> = ({ children, attributes }) => {
    const { isDarkMode } = useTheme();
    
    // Define styles that adapt to dark/light mode
    const quoteStyles = {
        padding: '1.25rem 1.5rem',
        margin: '1.5rem 0',
        borderLeft: `4px solid ${isDarkMode ? '#8B5CF6' : '#6D28D9'}`, // Purple in dark/light variants
        backgroundColor: isDarkMode ? 'rgba(139, 92, 246, 0.1)' : 'rgba(109, 40, 217, 0.08)',
        borderRadius: '0.375rem',
        fontStyle: 'italic',
        fontSize: '1.05em',
        lineHeight: '1.6',
        color: isDarkMode ? '#E5E7EB' : '#1F2937',
    };
    
    // Apply any custom attributes passed in
    const customStyles = { 
        ...quoteStyles,
        ...(attributes?.backgroundColor ? { backgroundColor: attributes.backgroundColor } : {}),
        ...(attributes?.borderColor ? { borderLeft: `4px solid ${attributes.borderColor}` } : {}),
        ...(attributes?.textColor ? { color: attributes.textColor } : {})
    };

    return (
        <blockquote className="markdown-custom-quote" style={customStyles}>
            {children}
        </blockquote>
    );
};


// --- Main Renderer Component ---
export function CustomMarkdownRenderer({ children, className = "" }: CustomReactMarkdownProps) {
    const { isDarkMode } = useTheme();
    
    // Preprocess the markdown content
    const processedContent = useMemo(() => preprocessMarkdown(children), [children]);

    type SyntaxHighlighterStyleType = { [key: string]: CSSProperties };

    const markdownComponents = useMemo((): Components => ({
        p: ({ node, children: pChildren, ...props }: ParagraphProps) => {
            // Ensure children are processed first before checking text content
            const firstChildNode = node?.children?.[0];
            const firstChildIsText = firstChildNode?.type === 'text';
            let textValue = '';
            if (firstChildIsText) {
                // Get the raw text value directly from the node
                textValue = (firstChildNode as Text).value;
            }

            // --- NEW: Banner Detection ---
            // Check if the entire paragraph content matches the banner syntax
            const fullTextContent = getNodeText(node).trim(); // Get text of the whole paragraph node
            const bannerMatch = fullTextContent.match(/^:::banner\s*(?:\{([^}]*)\})?\s*([\s\S]*?)\s*:::$/m);
            if (bannerMatch) {
                const [, attrString = '', bannerText] = bannerMatch;
                const attributes = parseAttributes(attrString);
                // Return the Banner component instead of a paragraph
                return <Banner text={bannerText.trim()} attributes={attributes} />;
            }
            // --- End Banner Detection ---

            // --- REVISED: Lead Paragraph Check ---
            // Check if the raw text value starts with '>>> '
            const leadMarker = '>>> ';
            const isLead = firstChildIsText && textValue.startsWith(leadMarker);

            if (isLead) {
                let modifiedChildren = pChildren;
                const leadMarkerLength = leadMarker.length;

                // Carefully remove the marker from the *rendered* children
                if (Array.isArray(pChildren) && pChildren.length > 0) {
                    const firstRenderedChild = pChildren[0];
                    if (typeof firstRenderedChild === 'string' && firstRenderedChild.startsWith(leadMarker)) {
                        // If the first rendered child is a string starting with the marker, remove it
                        const updatedFirstChild = firstRenderedChild.substring(leadMarkerLength);
                        modifiedChildren = [updatedFirstChild, ...pChildren.slice(1)];
                    }
                } else if (typeof pChildren === 'string' && pChildren.startsWith(leadMarker)) {
                    // Handle case where children is just a single string
                    modifiedChildren = pChildren.substring(leadMarkerLength);
                }

                return <p className="lead-paragraph" {...props}>{modifiedChildren}</p>;
            }
            // --- End Lead Paragraph Check ---

            // Regular paragraph
            return <p {...props}>{pChildren}</p>;
        },

        blockquote: ({ node, children: bqChildren, ...props }: BlockquoteProps) => {
            const firstChildNode = node?.children?.[0];

            if (firstChildNode?.type === 'element' && firstChildNode.tagName === 'p') {
                const quoteTextContent = getNodeText(firstChildNode).trim();
                if (quoteTextContent.startsWith('*"') && quoteTextContent.endsWith('"*')) {
                    const quoteText = quoteTextContent.substring(2, quoteTextContent.length - 2).trim();
                    let attributionContent: ReactNode = null;

                    // --- REVISED CHECK for Attribution ---
                    // Explicitly check if node, node.children exist and have at least 2 elements
                    if (node && node.children && node.children.length > 1) {
                        const secondChild = node.children[1]; // Now safer to access

                        // Check if the second child is an element before trying to extract React children or HAST nodes
                        if (secondChild.type === 'element') {
                            // Attempt extraction using rendered children first (often simpler and more reliable)
                            if (Array.isArray(bqChildren) && bqChildren.length > 1 && isValidElement(bqChildren[1])) {
                                let rawAttribution = (bqChildren[1] as React.ReactElement).props.children;

                                // Remove leading '— ' if present
                                const dashMarker = '— ';
                                if (typeof rawAttribution === 'string' && rawAttribution.startsWith(dashMarker)) {
                                    rawAttribution = rawAttribution.substring(dashMarker.length);
                                } else if (Array.isArray(rawAttribution) && rawAttribution.length > 0 && typeof rawAttribution[0] === 'string' && rawAttribution[0].startsWith(dashMarker)) {
                                    // Create new array to avoid mutation if needed, or modify in place if safe
                                    const updatedFirst = rawAttribution[0].substring(dashMarker.length);
                                    rawAttribution = [updatedFirst, ...rawAttribution.slice(1)];
                                }
                                attributionContent = rawAttribution;
                            } else {
                                // Fallback: Try rendering HAST nodes if extraction from bqChildren fails (less common)
                                // Safely map children if secondChild.children exists
                                attributionContent = secondChild.children?.map((child, index) => {
                                    return <React.Fragment key={index}>{renderNode(child, String(index))}</React.Fragment>;
                                });
                            }
                        }
                    }
                    // --- END REVISED CHECK ---

                    return (
                        <blockquote className="styled-quote">
                            <div className="quote-content">{quoteText}</div>
                            {attributionContent && (
                                <footer className="quote-attribution">{attributionContent}</footer>
                            )}
                        </blockquote>
                    );
                }
            }
            // --- End Styled Quote Logic ---

            // Regular Blockquote
            return <blockquote className="standard-blockquote" {...props}>{bqChildren}</blockquote>;
        },

        // --- Code Override with Conditional Style ---
        code: ({ node, inline, className: codeClassName, children: codeChildren, ...props }: CodeProps) => {
            const match = /language-(\w+)/.exec(codeClassName || '');
            const isBlock = !inline && match;

            if (isBlock) {
                return (
                    <div className="code-block-wrapper">
                        <div className="code-block-header">
                            <span className="code-language">{match[1]}</span>
                            <button type="button" className="code-copy-button" onClick={() => { if (codeChildren) navigator.clipboard.writeText(String(codeChildren).replace(/\n$/, '')); }} aria-label="Copy code">Copy</button>
                        </div>
                        <SyntaxHighlighter
                            style={(isDarkMode ? coldarkDark : prism) as any}
                            language={match[1]}
                            PreTag="div"
                            customStyle={{
                                borderRadius: '0.375rem',
                                border: isDarkMode ? '1px solid rgba(255,255,255,0.1)' : '1px solid rgba(0,0,0,0.1)',
                                boxShadow: 'none', // Remove any underlines/shadows
                                textDecoration: 'none', // Ensure no underlines
                            }}
                            codeTagProps={{
                                style: {
                                    textDecoration: 'none', // No underlines
                                }
                            }}
                            {...props}
                        >
                            {String(codeChildren ?? '').replace(/\n$/, '')}
                        </SyntaxHighlighter>
                    </div>
                );
            }

            // Inline Code
            return ( 
                <code 
                    className={`inline-code ${codeClassName || ''}`} 
                    style={{ 
                        textDecoration: 'none',
                        backgroundColor: isDarkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)',
                        color: isDarkMode ? '#e6e6e6' : '#333',
                        padding: '0.2em 0.4em',
                        borderRadius: '3px'
                    }}
                    {...props}
                >
                    {codeChildren}
                </code> 
            );
        },

        // --- Image Override ---
        img: ({ node, src, alt, ...props }: ImgProps) => {
            if (!src) return <AsciiArtPlaceholder className="mx-auto my-8" />;
            const altString = typeof alt === 'string' ? alt : ''; // Ensure alt is a string

            let imageSize: 'small' | 'medium' | 'large' | 'full' = 'medium';
            let imageAlign: 'left' | 'center' | 'right' = 'center';
            let imageEffect: 'shadow' | 'border' | 'glow' | 'glitch' | 'none' = 'none';
            let imageBorder: 'simple' | 'gradient' | 'glow' | 'inset' | 'dashed' | 'none' = 'none';
            let imageCaption = '';
            let altText = altString;
            let isZoomable = true;

            if (altString.includes('|')) {
                const parts = altString.split('|');
                altText = parts[0].trim();
                parts.slice(1).forEach(part => {
                    const [key, value] = part.includes('=') ? part.split('=', 2) : [part.trim(), 'true'];
                    const trimmedKey = key.trim(); const trimmedValue = value.trim().replace(/^"|"$/g, '');
                    if (trimmedKey === 'size' && ['small', 'medium', 'large', 'full'].includes(trimmedValue)) imageSize = trimmedValue as any;
                    else if (trimmedKey === 'align' && ['left', 'center', 'right'].includes(trimmedValue)) imageAlign = trimmedValue as any;
                    else if (trimmedKey === 'effect' && ['shadow', 'border', 'glow', 'glitch', 'none'].includes(trimmedValue)) imageEffect = trimmedValue as any;
                    else if (trimmedKey === 'border' && ['simple', 'gradient', 'glow', 'inset', 'dashed', 'none'].includes(trimmedValue)) imageBorder = trimmedValue as any;
                    else if (trimmedKey === 'caption') imageCaption = trimmedValue;
                    else if (trimmedKey === 'zoomable') isZoomable = trimmedValue !== 'false';
                });
            }

            return (
                <div className={`markdown-image-wrapper align-${imageAlign}`}>
                    <ZoomableImage 
                        src={src} 
                        alt={altText} 
                        caption={imageCaption} 
                        size={imageSize} 
                        align={imageAlign} 
                        effect={imageEffect} 
                        border={imageBorder} 
                        zoomable={isZoomable} 
                    />
                </div>
            );
        },

        // --- Other Overrides (Tables, Headings, Lists, etc.) ---
        table: ({ node, children, ...props }: TableProps) => (<div className="table-wrapper my-6"><table {...props}>{children}</table></div>),
        thead: ({ node, children, ...props }) => <thead {...props}>{children}</thead>,
        tbody: ({ node, children, ...props }) => <tbody {...props}>{children}</tbody>,
        tr: ({ node, children, ...props }) => <tr {...props}>{children}</tr>,
        th: ({ node, children, isHeader, ...props }: TableCellProps) => <th {...props}>{children}</th>,
        td: ({ node, children, isHeader, ...props }: TableCellProps) => <td {...props}>{children}</td>,
        h1: ({ node, children, level, ...props }: HeadingProps) => <h1 className="md-h1" {...props}>{children}</h1>,
        h2: ({ node, children, level, ...props }: HeadingProps) => <h2 className="md-h2" {...props}>{children}</h2>,
        h3: ({ node, children, level, ...props }: HeadingProps) => <h3 className="md-h3" {...props}>{children}</h3>,
        h4: ({ node, children, level, ...props }: HeadingProps) => <h4 className="md-h4" {...props}>{children}</h4>,
        h5: ({ node, children, level, ...props }: HeadingProps) => <h5 className="md-h5" {...props}>{children}</h5>,
        h6: ({ node, children, level, ...props }: HeadingProps) => <h6 className="md-h6" {...props}>{children}</h6>,
        a: ({ node, children, href, ...props }: LinkProps) => (<a href={href} className="md-link" target={href?.startsWith('http') ? '_blank' : undefined} rel={href?.startsWith('http') ? 'noopener noreferrer' : undefined} {...props}>{children}</a>),
        hr: ({ node, ...props }: HrProps) => <hr className="md-hr" {...props} />,
        ul: ({ node, children, ordered, depth, ...props }: ListProps) => <ul className="md-ul" {...props}>{children}</ul>,
        ol: ({ node, children, ordered, depth, ...props }: ListProps) => <ol className="md-ol" {...props}>{children}</ol>,
        li: ({ node, children, checked, index, ordered, ...props }: ListItemProps) => <li className="md-li" {...props}>{children}</li>,

        // --- Enhanced div component to handle notes and image grids ---
        div: ({ node, children, ...props }: DivProps) => {
            // Check for data attributes first
            const noteType = node?.properties?.['data-note-type'];
            if (noteType && (typeof noteType === 'string')) {
                // This is a :::note syntax parsed by our preprocessor
                return <Note type={noteType as any} attributes={{}}>{children}</Note>;
            }

            // Check for quote attribute
            const hasQuote = !!node?.properties?.['data-quote'] ;
            console.log("Has Quote ", hasQuote)
            if (hasQuote) {
                // Extract any attributes that were passed
                const attrString = node?.properties?.['data-quote-attrs'];
                let attributes = {};
                if (attrString && typeof attrString === 'string') {
                    attributes = parseAttributes(attrString);
                }
                return <CustomQuote attributes={attributes}>{children}</CustomQuote>;
            }
            
            // Then check for image grid
            const dataColumns = node?.properties?.['data-columns'];
            let hasImageGridClass = false;
            const classValue = node?.properties?.className;

            if (Array.isArray(classValue)) {
                hasImageGridClass = classValue.includes('image-grid');
            } else if (typeof classValue === 'string') {
                hasImageGridClass = classValue.split(' ').includes('image-grid');
            }

            if (hasImageGridClass && typeof dataColumns === 'string') {
                const columns = Number(dataColumns) || 2;
                return <ImageGrid columns={columns}>{children}</ImageGrid>;
            }

            // Default div rendering
            return <div {...props}>{children}</div>;
        },

    }), [isDarkMode]); // isDarkMode dependency is mainly for syntax highlighting style

    const remarkPlugins: PluggableList = [remarkGfm, remarkMath, remarkUnwrapImages];
    const rehypePlugins: PluggableList = [rehypeSlug, [rehypeAutolinkHeadings, { behavior: 'wrap' }], rehypeKatex];

    return (
        <div className={`blog-content ${className}`}>
            <ReactMarkdown
                components={markdownComponents}
                remarkPlugins={remarkPlugins}
                rehypePlugins={rehypePlugins}
                children={processedContent} // Use the preprocessed content
            />
        </div>
    );
}

// Helper function to render HAST nodes (needed for attribution extraction)
function renderNode(node: ElementContent, key: string): ReactNode {
    if (node.type === 'text') {
        return node.value;
    }
    if (node.type === 'element') {
        const TagName = node.tagName as keyof JSX.IntrinsicElements;
        const props = { ...node.properties, key: key };
        const children = node.children?.map((child, index) => renderNode(child, `${key}-${index}`));
        return <TagName {...props}>{children}</TagName>;
    }
    return null; // Ignore comments, etc.
}