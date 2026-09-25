// Vanilla TanStack Start + Vite config (no builder wrappers).
// Plugins: path aliases, Tailwind, TanStack Start (prerender), React.
import { defineConfig } from "vite";
import viteReact from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import tsConfigPaths from "vite-tsconfig-paths";
import { tanstackStart } from "@tanstack/react-start/plugin/vite";

// GitHub Pages (project site): served under /DevOps-By-Nabawy/.
// Keep in sync with `basepath` in src/router.tsx.
const pagesBase = "/DevOps-By-Nabawy";

// Must match the slugs in src/lib/tracks.ts (single source of truth lives there;
// duplicated here because vite.config cannot use the `@/` alias).
const trackSlugs = [
  "cicd",
  "terraform",
  "kubernetes",
  "docker",
  "ansible",
  "linux",
];

// Must match book ids in content/manifest.json.
const bookIds = [
  "k8s-01-complete-guide",
  "k8s-02-config-secrets",
  "k8s-03-services-networking",
  "k8s-04-scheduling",
  "k8s-05-storage",
  "k8s-06-workloads",
  "k8s-07-observability",
  "k8s-08-gitops",
  "k8s-09-production",
  "ansible-complete-guide-en",
  "ansible-complete-guide-ar",
  "ansible-role-generic-package",
  "ansible-mariadb-project",
  "docker-cheat-sheet",
  "docker-cheat-sheet-v2",
  "cicd-01-start-here",
  "cicd-02-pipelines",
  "cicd-03-delivery",
  "cicd-04-observability",
  "cicd-05-jenkins",
  "cicd-06-platforms",
  "cicd-07-labs",
  "cicd-08-cheatsheet",
  "linux-01-complete-guide",
  "terraform-01-foundations",
  "terraform-02-production",
  "terraform-03-practice-lab",
  "terraform-04-exam-center",
  "terraform-05-interview-arsenal",
];

export default defineConfig({
  base: `${pagesBase}/`,
  plugins: [
    tsConfigPaths({
      projects: ["./tsconfig.json"],
    }),
    tailwindcss(),
    tanstackStart({
      // Redirect TanStack Start's bundled server entry to src/server.ts (our SSR error wrapper).
      server: { entry: "server" },
      // Prerender every route to static HTML for GitHub Pages.
      // NOTE: never let the crawler fetch *.pdf — prerender writes every
      // crawled response via res.text(), which corrupts binary PDFs in dist
      // (blank white pages in the viewer). public/pdf copies stay verbatim.
      prerender: {
        enabled: true,
        crawlLinks: true,
        autoSubfolderIndex: true,
        filter: (page: { path: string }) =>
          !page.path.toLowerCase().endsWith(".pdf"),
      },
      pages: [
        { path: "/", prerender: { enabled: true } },
        { path: "/tracks", prerender: { enabled: true } },
        { path: "/tracks/terraform", prerender: { enabled: true } },
        { path: "/tracks/cicd", prerender: { enabled: true } },
        { path: "/tracks/linux", prerender: { enabled: true } },
        { path: "/roadmap", prerender: { enabled: true } },
        { path: "/about", prerender: { enabled: true } },
        { path: "/help", prerender: { enabled: true } },
        { path: "/search", prerender: { enabled: true } },
        ...trackSlugs.map((slug) => ({
          path: `/tracks/${slug}`,
          prerender: { enabled: true },
        })),
        ...bookIds.map((bookId) => ({
          path: `/books/${bookId}`,
          prerender: { enabled: true },
        })),
      ],
    }),
    viteReact(),
  ],
});
