# Rovo Catalog

Copy-paste Rovo prompts and JQL for Jira Service Management, plus a zero-dependency static catalog app.

**Live site:** [https://lbrealdev.github.io/rovo-catalog/](https://lbrealdev.github.io/rovo-catalog/)

Daily loop: browse → fill → copy → paste into Rovo.

---

## Use it

Set **Profile** (`PROJECT`, `YOUR-USER`, optional Confluence page URL) in the browser. Browse **Prompts** by category or situation, **Queries** for reusable JQL, and **Commands** for slash-command notes.

Reading the generated HTML works with JavaScript off. Copy, Profile, and Theme need JS.

---

## Fork and host on GitHub Pages

1. Fork this repo. Keep the name `rovo-catalog`, or see the base path note below.
2. In the fork: **Settings → Pages → Build and deployment → Source: GitHub Actions**.
3. Push to `main` or run the **Deploy GitHub Pages** workflow. The workflow derives `SITE_BASE_PATH` from the repository name; no secrets. Site URL: `https://<your-user>.github.io/<repo-name>/`.

CI sets the base path from the repo name (`/rovo-catalog/` here). A renamed fork still matches. A repo named `<user>.github.io` builds at `/`.

Local preview of the Pages base path:

```bash
npm run build:pages
python3 -m http.server 8765 --directory site/dist
# open http://127.0.0.1:8765/rovo-catalog/
```

---

## Build locally

Node ≥ 24, zero npm dependencies.

```bash
npm run build
python3 -m http.server 8765 --directory site/dist
# open http://127.0.0.1:8765/
```

Markdown under `prompts/` (and JQL under `queries/jql/`) is the source of truth.
