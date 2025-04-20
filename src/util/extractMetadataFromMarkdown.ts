import { unified } from 'unified';
import remarkParse from 'remark-parse';
import remarkGfm from 'remark-gfm';
import { visit } from 'unist-util-visit';

import { TableOfContentsItem } from '@/types/blog';

export function extractMetadataFromMarkdown(content: string): { toc: TableOfContentsItem[] } {
  const toc: TableOfContentsItem[] = [];

  const processor = unified().use(remarkParse).use(remarkGfm);
  const tree = processor.parse(content);

  visit(tree, 'heading', (node: any) => {
    if (node.depth <= 4) {
      const text = node.children.map((n: any) => n.value).join('').trim();
      const slug = text
        .toLowerCase()
        .replace(/[^\w\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-');
      toc.push({ level: node.depth, text, slug });
    }
  });

  return { toc };
}