// @lovable.dev/vite-tanstack-config already includes the following — do NOT add them manually
// or the app will break with duplicate plugins:
//   - TanStack devtools (dev-only, first), tanstackStart, viteReact, tailwindcss, tsConfigPaths,
//     nitro (build-only using cloudflare as a default target), VITE_* env injection, @ path alias,
//     React/TanStack dedupe, error logger plugins, and sandbox detection (port/host/strictPort).
// You can pass additional config via defineConfig({ vite: { ... }, etc... }) if needed.
import { defineConfig } from "@lovable.dev/vite-tanstack-config";

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
  "devops",
  "aws",
  "aiops",
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
  vite: {
    base: `${pagesBase}/`,
  },
  nitro: false, // skip nitro server build; TanStack prerender emits pure static HTML for Pages
  tanstackStart: {
    // Redirect TanStack Start's bundled server entry to src/server.ts (our SSR error wrapper).
    // nitro/vite builds from this
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
  },
});
