# DevOps By Nabawy — agent notes

- Static TanStack Start site, prerendered to `dist/client` for GitHub Pages.
- Do not rewrite published git history (no force-push / rebase of pushed commits).
- Keep the `main` branch in a working state; pushes deploy via `.github/workflows/deploy-pages.yml`.
- Content PDFs live under `public/pdf` and `content/manifest.json`; don't alter book content in structural passes.
