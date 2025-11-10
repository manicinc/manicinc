// scripts/generateSitemap.js
const fs = require('fs');
const path = require('path');
const matter = require('gray-matter');

const SITE_URL = 'https://manic.agency';
const SITEMAP_PATH = path.join(process.cwd(), 'public', 'sitemap.xml');

// Priority configuration
const PRIORITY_MAP = {
  '/': 1.0,
  '/projects': 0.9,
  '/blog': 0.9,
  '/mission': 0.9,
  '/team': 0.9,
  '/open-source': 0.8,
  '/contact': 0.8,
  '/process': 0.7,
  '/newsletter': 0.7,
  '/sitemap': 0.7,
  '/tags': 0.7,
};

// Static pages to include
const STATIC_PAGES = [
  '/',
  '/mission',
  '/newsletter',
  '/contact',
  '/privacy',
  '/process',
  '/blog',
  '/open-source',
  '/sitemap',
  '/projects',
  '/tags',
  '/team',
  '/velvet',
  '/terms',
  '/faq',
  '/offline'
];

// Get all markdown files recursively
function getAllMarkdownFiles(dir) {
  let files = [];
  const items = fs.readdirSync(dir);
  
  for (const item of items) {
    const fullPath = path.join(dir, item);
    const stat = fs.statSync(fullPath);
    
    if (stat.isDirectory()) {
      files = files.concat(getAllMarkdownFiles(fullPath));
    } else if (item.endsWith('.md') || item.endsWith('.mdx')) {
      files.push(fullPath);
    }
  }
  
  return files;
}

// Parse markdown file
function parseMarkdownFile(filePath) {
  const content = fs.readFileSync(filePath, 'utf-8');
  const { data } = matter(content);
  return data;
}

// Generate URL from file path
function generateUrl(filePath, type) {
  const relativePath = path.relative(process.cwd(), filePath);
  const parts = relativePath.split(path.sep);
  const fileName = path.basename(filePath, path.extname(filePath));
  
  if (type === 'blog') {
    // posts/category/slug.md -> /blog/category/slug
    const category = parts[1];
    return `/blog/${category}/${fileName}`;
  } else if (type === 'project') {
    // projects/category/slug.md -> /projects/category/slug
    const category = parts[1];
    return `/projects/${category}/${fileName}`;
  }
  
  return null;
}

// Generate sitemap XML
function generateSitemap() {
  const urls = [];
  const now = new Date().toISOString();
  
  // Add static pages
  STATIC_PAGES.forEach(page => {
    urls.push({
      loc: `${SITE_URL}${page}`,
      lastmod: now,
      changefreq: page === '/' || page.includes('/blog') || page.includes('/projects') ? 'weekly' : 'monthly',
      priority: PRIORITY_MAP[page] || 0.7
    });
  });
  
  // Add blog posts
  const blogFiles = getAllMarkdownFiles(path.join(process.cwd(), 'posts'));
  blogFiles.forEach(file => {
    const data = parseMarkdownFile(file);
    if (!data.draft) {
      const url = generateUrl(file, 'blog');
      if (url) {
        urls.push({
          loc: `${SITE_URL}${url}`,
          lastmod: data.lastModified || data.date || now,
          changefreq: 'monthly',
          priority: data.featured ? 0.8 : 0.7
        });
      }
    }
  });
  
  // Add projects
  const projectFiles = getAllMarkdownFiles(path.join(process.cwd(), 'projects'));
  projectFiles.forEach(file => {
    const data = parseMarkdownFile(file);
    if (!data.draft) {
      const url = generateUrl(file, 'project');
      if (url) {
        urls.push({
          loc: `${SITE_URL}${url}`,
          lastmod: data.modifiedDate || data.date || now,
          changefreq: 'monthly',
          priority: data.featured ? 0.8 : 0.7
        });
      }
    }
  });
  
  // Add category pages
  const categories = new Set();
  const tags = new Set();
  
  [...blogFiles, ...projectFiles].forEach(file => {
    const data = parseMarkdownFile(file);
    if (data.category) categories.add(data.category);
    if (data.tags) data.tags.forEach(tag => tags.add(tag));
  });
  
  categories.forEach(category => {
    urls.push({
      loc: `${SITE_URL}/blog/${category}`,
      lastmod: now,
      changefreq: 'weekly',
      priority: 0.7
    });
    urls.push({
      loc: `${SITE_URL}/projects/${category}`,
      lastmod: now,
      changefreq: 'weekly',
      priority: 0.7
    });
  });
  
  tags.forEach(tag => {
    urls.push({
      loc: `${SITE_URL}/tags/${tag}`,
      lastmod: now,
      changefreq: 'weekly',
      priority: 0.6
    });
  });
  
  // Generate XML
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:news="http://www.google.com/schemas/sitemap-news/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml" xmlns:mobile="http://www.google.com/schemas/sitemap-mobile/1.0" xmlns:image="http://www.google.com/schemas/sitemap-image/1.1" xmlns:video="http://www.google.com/schemas/sitemap-video/1.1">
${urls.map(url => `  <url>
    <loc>${url.loc}</loc>
    <lastmod>${url.lastmod}</lastmod>
    <changefreq>${url.changefreq}</changefreq>
    <priority>${url.priority}</priority>
  </url>`).join('\n')}
</urlset>`;
  
  fs.writeFileSync(SITEMAP_PATH, xml);
  console.log(`✅ Sitemap generated with ${urls.length} URLs at ${SITEMAP_PATH}`);
}

// Run generation
generateSitemap();
