import { defineConfig } from "astro/config";
import trustKit from './src/integrations/trust-kit.mjs';
import react from "@astrojs/react";
import sitemap from "@astrojs/sitemap";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  trailingSlash: 'always',  site: "https://ordenadoliquido.pt",
  integrations: [
    trustKit({ lang: 'pt', siteUrl: 'https://ordenadoliquido.pt', siteName: 'Salário Líquido', founded: '2026-06-27', about: '/sobre/', method: '/metodologia/' }), react(), sitemap()],
  vite: {
    plugins: [tailwindcss()],
  },
});
