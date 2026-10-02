# podcast.mt

> Poddati minn Malta — the Maltese podcast directory

Bilingual (EN/MT) portal listing podcasts from Malta, in Maltese, or about Malta.

---

## How it works

```
shows.json  ←  you edit this manually
     ↓
scripts/ingest.js  ←  runs every 6h via GitHub Actions
     ↓
data/episodes.json        (latest 5 eps per show)
data/shows-enriched.json  (shows + live metadata from feed)
     ↓
Astro builds static HTML from those JSON files
     ↓
Vercel deploys
```

---

## Adding a show

Edit `data/shows.json` and add an entry:

```json
{
  "slug": "your-show-slug",
  "name": "Show Name",
  "nameMt": "Isem bil-Malti (optional)",
  "description": {
    "en": "English description",
    "mt": "Deskrizzjoni bil-Malti (optional)"
  },
  "rssUrl": "https://feeds.example.com/your-show.rss",
  "language": ["en"],
  "tags": ["culture", "news"],
  "host": "Host Name",
  "origin": "mt",
  "links": {
    "spotify": "https://open.spotify.com/show/...",
    "apple": "https://podcasts.apple.com/...",
    "web": "https://yoursite.com"
  },
  "featured": false,
  "active": true
}
```

**Language values:** `"mt"`, `"en"` — use both for bilingual shows.

**Tag values (use consistently):**
`news`, `culture`, `politics`, `comedy`, `sport`, `music`, `history`,
`religion`, `business`, `education`, `technology`, `lifestyle`

**Origin values:** `"mt"` (made in Malta), `"diaspora"` (Maltese abroad)

Push the change → GitHub Action runs ingestion + deploys automatically.

---

## Finding a show's RSS URL

1. Check the show's website — usually linked in the footer
2. Search on [podcastindex.org](https://podcastindex.org) — shows RSS directly
3. Search on [listen-notes.com](https://listen-notes.com)
4. If hosted on Spotify for Creators/Anchor:
   `https://anchor.fm/s/[SHOW_ID]/podcast/rss`
5. Ask the creator — require it in the submission form

---

## Local development

```bash
npm install
npm run ingest   # fetch all RSS feeds → writes data/episodes.json
npm run dev      # start Astro dev server
```

---

## GitHub Actions setup

1. Go to your Vercel project → Settings → Git → Deploy Hooks
2. Create a hook named "GitHub Actions" for the `main` branch
3. Copy the hook URL
4. In GitHub repo → Settings → Secrets → Actions
5. Add secret: `VERCEL_DEPLOY_HOOK` = your hook URL

The workflow runs every 6 hours and also whenever you push changes to
`data/shows.json` or `src/`.

---

## Data files (auto-generated, not committed)

These are gitignored: `npm run build` runs the ingestion before `astro build`,
so every Vercel deploy fetches fresh data. The scheduled workflow keeps a copy
of the files as the `ingested-data` artifact on each run (Actions → run →
Artifacts, kept 14 days) and only calls the deploy hook when the data changed.

To detect changes, ingestion also writes a fingerprint of the data (plus the
current date, so "new" badges refresh daily) to `public/data-version.txt`,
which is served at https://podcast.mt/data-version.txt. A scheduled run whose
fingerprint matches the live one skips the deploy.

| File | Contents |
|---|---|
| `data/episodes.json` | Latest 5 episodes per show, all shows, newest first |
| `data/shows-enriched.json` | shows.json merged with live metadata from RSS feeds |
| `data/ingest-summary.json` | Stats + errors from last ingestion run |

---

## Show fields reference

| Field | Required | Notes |
|---|---|---|
| `slug` | ✅ | URL-safe, kebab-case, unique |
| `name` | ✅ | Show name as it appears publicly |
| `nameMt` | — | Maltese name if different |
| `description.en` | ✅ | English description |
| `description.mt` | — | Maltese description |
| `rssUrl` | ✅ | RSS feed URL |
| `language` | ✅ | Array: `["mt"]`, `["en"]`, or `["mt","en"]` |
| `tags` | ✅ | Array from tag list above |
| `host` | — | Host name(s) |
| `origin` | ✅ | `"mt"` or `"diaspora"` |
| `links.spotify` | — | Spotify show URL |
| `links.apple` | — | Apple Podcasts URL |
| `links.web` | — | Show website |
| `coverArtOverride` | — | Manual image URL, overrides RSS feed art |
| `featured` | ✅ | `true` = shown in homepage hero |
| `active` | ✅ | `false` = skipped during ingestion |
