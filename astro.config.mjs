import { defineConfig } from "astro/config";
import sitemap from "@astrojs/sitemap";

// Fully pre-rendered HTML. No server adapter.
export default defineConfig({
  site: "https://weaverfineart.com",
  trailingSlash: "always",
  compressHTML: true,
  build: {
    format: "directory",
    inlineStylesheets: "never",
  },
  integrations: [
    sitemap({
      filter: (page) => !page.includes("/thank-you"),
    }),
  ],
});
