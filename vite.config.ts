import { defineConfig, loadEnv, type Plugin } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

/**
 * SEO plumbing. The public site address comes from VITE_SITE_URL (default below).
 * It fills the canonical/OG/JSON-LD tags in index.html and emits robots.txt + sitemap.xml.
 */
function seo(siteUrl: string): Plugin {
  const url = siteUrl.replace(/\/+$/, '');
  return {
    name: 'avenzo-seo',
    transformIndexHtml: (html) => html.replaceAll('__SITE_URL__', url),
    generateBundle() {
      this.emitFile({
        type: 'asset',
        fileName: 'robots.txt',
        source: `User-agent: *\nAllow: /\n\nSitemap: ${url}/sitemap.xml\n`,
      });
      this.emitFile({
        type: 'asset',
        fileName: 'sitemap.xml',
        source: `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n  <url><loc>${url}/</loc><changefreq>weekly</changefreq><priority>1.0</priority></url>\n</urlset>\n`,
      });
    },
  };
}

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  const siteUrl = env.VITE_SITE_URL || 'https://avenzoopg.in';
  return {
    plugins: [react(), tailwindcss(), seo(siteUrl)],
    build: {
      target: 'es2020',
      chunkSizeWarningLimit: 1200,
      rollupOptions: {
        output: {
          manualChunks: {
            three: ['three'],
            r3f: ['@react-three/fiber', '@react-three/drei'],
            gsap: ['gsap', 'lenis'],
          },
        },
      },
    },
  };
});
