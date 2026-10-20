# StreamBay — Independent Video-Sharing Platform

A standalone, original-branded video platform starter inspired by common long-form video services. It is not affiliated with or a copy of YouTube. It does not touch any other project or deployment.

## Features included

- Responsive desktop/mobile interface with category chips, video search, trending, subscriptions, history and creator channel pages.
- Account registration and login; passwords are hashed with Node's `scrypt` and authentication uses signed, expiring bearer tokens.
- Video uploads (MP4, WebM, MOV, M4V), playback with HTTP byte-range support, title/description/category.
- Creator channels, subscribe/unsubscribe, video likes, comments, view counts and channel profile editing.
- JSON file persistence for a local, easy-to-run starter; uploads stored separately.
- Built-in automated API smoke tests; no third-party runtime dependencies.

## Requirements

- Node.js 20 or newer.

## Run locally

```bash
npm test
npm start
```

Open `http://localhost:3000` in a browser. To change the port, set `PORT`. Copy `.env.example` to `.env` only if your hosting environment loads it; this code reads environment variables directly and does not load `.env` itself. Set a strong `SESSION_SECRET` before deploying. `MAX_UPLOAD_MB` defaults to 500.

## Upload and data

Create an account, sign in, click **Create**, fill in the video details and choose a supported video file. The local database is written to `data/db.json`; uploaded media goes to `uploads/`. These folders are ignored by Git to help avoid accidentally committing private user data or large media.

## Important production gaps

This is a functional starter, not a production-scale YouTube replacement. Before public production use, add a managed database and migrations, object storage and CDN, resilient upload/chunking and transcoding, malware/content scanning, robust authorization/rate limiting, CSRF protections for any cookie auth, email verification and password reset, account recovery, moderation/reporting, copyright/takedown workflow, privacy controls, analytics, accessible captions, search indexing, recommendations, creator monetization, backups, monitoring, and security review. JSON storage and local disk are intended for local testing or a single instance only. The current API does not implement a full admin/moderation console, livestreaming, DMs, monetization or transcoding. The sample channel art and thumbnail placeholders are decorative when videos have no generated thumbnail.

## Repository layout

- `server.js` — HTTP server, API routes, auth, upload parsing and byte-range media playback.
- `public/index.html` — interface structure and dialogs.
- `public/styles.css` — responsive styling.
- `public/app.js` — feed, search, channel, upload and interaction logic.
- `tests/server.test.js` — API smoke tests using Node's built-in test runner.
- `data/` — local JSON persistence created on first run.
- `uploads/` — uploaded video files.
