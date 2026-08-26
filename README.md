# Rovo Agent Toolkit

Copy-paste prompts and JQL for daily **Jira Service Management** and **Confluence** work with Atlassian Rovo.

This is a **static catalog**, not a Jira app. Markdown under `prompts/` is the source of truth. A tiny zero-dependency Node build writes plain HTML/CSS/JS to `site/dist/`. No backend, no secrets, no CDN.

**Live site:** [https://lbrealdev.github.io/rovo-catalog/](https://lbrealdev.github.io/rovo-catalog/)

**Daily loop:** browse → fill placeholders → copy → paste into Rovo.

---

## Use it

1. Open the [live site](https://lbrealdev.github.io/rovo-catalog/) (or your fork’s Pages URL).
2. Set **Profile** — project key and username (optional Confluence page URL). Values stay in `localStorage` on this browser only.
3. Browse **Prompts** by category or situation. Open one, fill placeholders, **Copy**, paste into Rovo Chat.
4. Use **Queries** for reusable JQL. Use **Commands** for slash-command safety notes (`/update-work-items`, `/create-work-items`).

Reading the HTML works with JavaScript off. Copy, Profile, Theme, favorites, and filters need JS.

---

## Fork and host on GitHub Pages

1. Fork this repository (keep the name `rovo-catalog`, or see base path below).
2. In the fork: **Settings → Pages → Build and deployment → Source: GitHub Actions**.
3. Push to `main` (or run the **Deploy GitHub Pages** workflow). The workflow builds with a base path derived from the repository name — no secrets required.
4. Site URL: `https://<your-user>.github.io/<repo-name>/`

**Base path:** CI sets `SITE_BASE_PATH` from the repo name (`/rovo-catalog/` for this project). If you rename the fork, the workflow still matches. For a user/org site repo named `<user>.github.io`, it builds at `/`.

Local preview of the Pages base path:

```bash
npm run build:pages
mkdir -p /tmp/rovo-pages/rovo-catalog && cp -a site/dist/. /tmp/rovo-pages/rovo-catalog/
python3 -m http.server 8765 --directory /tmp/rovo-pages
# open http://127.0.0.1:8765/rovo-catalog/
```

---

## Build locally

Requires **Node ≥ 24**. Zero npm dependencies.

```bash
npm run build
python3 -m http.server 8765 --directory site/dist
# open http://127.0.0.1:8765/
```

The build log prints current listed-prompt and query counts.

Customize defaults: edit Profile in the site, or change markdown under `prompts/` / `queries/jql/` and rebuild.

---

## What’s in the catalog

| Section | Source | Notes |
|---------|--------|--------|
| Prompts | `prompts/` | Triage, tickets, SLA, communication, utilities, Confluence |
| Queries | `lang: jql` entries in `prompts/` + `queries/jql/` | Shown on the Queries page |
| Commands | `site/content/commands.md` | Slash-command explainers only |

Hubs stack review → apply (or draft) steps on one page. Placeholders use `<PROJECT>`, `<YOUR-USER>`, `<TICKET-KEY>`, `<CONFLUENCE-PAGE-URL>`, selects, and tag chips.

**Not a Jira/Confluence API client.** You copy text into Rovo (or Jira JQL search). Profile never leaves the browser.

Experimental notes live in `workbench/` (pointers after promotion). Contributor conventions: [AGENTS.md](AGENTS.md). Frontmatter shape: [docs/prompt-schema.md](docs/prompt-schema.md). Roadmap scraps: [docs/BACKLOG.md](docs/BACKLOG.md).
