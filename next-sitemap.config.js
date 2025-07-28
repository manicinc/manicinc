/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: process.env.NEXT_PUBLIC_SITE_URL || 'https://manic.agency',
  generateRobotsTxt: true,
  exclude: ['/admin/*', '/api/*', '/private/*', '/sitemap.xml'],
  changefreq: 'daily',
  priority: 0.7,
  sitemapSize: 5000,
  generateIndexSitemap: false,
  robotsTxtOptions: {
    policies: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/admin/', '/api/', '/private/']
      }
    ],
    additionalSitemaps: [
      'https://manic.agency/sitemap.xml',
    ]
  },
  transform: async (config, path) => {
    const priorities = {
      '/': 1.0,
      '/mission': 0.9,
      '/team': 0.9,
      '/projects': 0.9,
      '/blog': 0.9,
      '/contact': 0.8,
      '/open-source': 0.8,
      '/process': 0.7,
      '/velvet': 0.4,
      '/privacy': 0.3,
      '/terms': 0.3
    }
    
    // Determine changefreq based on path
    let changefreq = 'monthly';
    if (path === '/') {
      changefreq = 'weekly';
    } else if (path.includes('/blog/') && path.split('/').length > 3) {
      changefreq = 'monthly'; // Individual blog posts
    } else if (path.includes('/blog')) {
      changefreq = 'weekly'; // Blog listing pages
    } else if (path.includes('/projects/') && path.split('/').length > 3) {
      changefreq = 'monthly'; // Individual project pages
    } else if (path.includes('/projects')) {
      changefreq = 'weekly'; // Project listing pages
    } else if (path.includes('/tags/')) {
      changefreq = 'weekly'; // Tag pages
    }
    
    return {
      loc: path,
      changefreq,
      priority: priorities[path] || 0.7,
      lastmod: config.autoLastmod ? new Date().toISOString() : undefined,
    }
  },
} 