const fs = require('fs');
const path = require('path');

// Execute registry.js in a mock environment to extract data
const registryContent = fs.readFileSync(path.join(__dirname, 'registry.js'), 'utf-8');
const context = { window: {} };
require('vm').createContext(context);
require('vm').runInContext(registryContent, context);

const registry = context.window.TOOLS_REGISTRY;
const baseUrl = 'https://example.com/'; // Replace with actual domain when hosting

// Generate sitemap.xml
let sitemap = `<?xml version="1.0" encoding="UTF-8"?>\n`;
sitemap += `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n`;

// Add Home
sitemap += `  <url>\n    <loc>${baseUrl}</loc>\n    <changefreq>weekly</changefreq>\n    <priority>1.0</priority>\n  </url>\n`;

// Add Tools dynamically
registry.forEach(tool => {
    sitemap += `  <url>\n    <loc>${baseUrl}#/tools/${tool.id}</loc>\n    <changefreq>monthly</changefreq>\n    <priority>0.8</priority>\n  </url>\n`;
});

sitemap += `</urlset>`;

fs.writeFileSync(path.join(__dirname, 'sitemap.xml'), sitemap);
console.log('✅ sitemap.xml generated successfully.');

// Generate robots.txt
const robots = `User-agent: *
Allow: /

Sitemap: ${baseUrl}sitemap.xml
`;
fs.writeFileSync(path.join(__dirname, 'robots.txt'), robots);
console.log('✅ robots.txt generated successfully.');
