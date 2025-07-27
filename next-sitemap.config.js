// next-sitemap.config.js

/**
 * @type {import('next-sitemap').IConfig}
 */
module.exports = {
  // Base URL of your website
  siteUrl: process.env.SITE_URL || 'https://holastars.com',

  // Whether to generate a robots.txt file
  generateRobotsTxt: true,

  // Configuration for robots.txt
  robotsTxtOptions: {
    policies: [
      { userAgent: '*', allow: '/' },
    ],
    additionalSitemaps: [],
  },

  // Output directory for generated files
  outDir: './public',

  // Custom transformation for each URL
  transform: async (config, path) => {
    return {
      loc: path,
      changefreq: config.changefreq || 'monthly',
      priority: config.priority || 0.7,
      lastmod: config.autoLastmod ? new Date().toISOString() : undefined,
      alternateRefs: config.alternateRefs || [],
    }
  },

  // Define URL paths to exclude from the sitemap
  exclude: [
    '/api/*',
    '/admin/*',
    '/404',
    '/500',
    '/_*',
  ],

  // Additional paths for dynamic routes
  additionalPaths: async (config) => {
    const result = []

    // This would typically come from your database or API
    const dynamicData = await new Promise((resolve) => resolve([]))

    for (const item of dynamicData) {
      result.push({
        loc: `/products/${item}`,
        lastmod: new Date().toISOString(),
        changefreq: 'daily',
        priority: 0.8
      })
    }

    return result
  },

  sitemapSize: 5000,
  generateIndexSitemap: true,
  trailingSlash: false,
}