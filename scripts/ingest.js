#!/usr/bin/env node

/**
 * podcast.mt — RSS Ingestion Script
 *
 * Reads shows.json, fetches each RSS feed, extracts the latest episodes,
 * and writes episodes.json and a refreshed shows-meta.json (with live cover art etc.)
 *
 * Run: node scripts/ingest.js
 * Dependencies: fast-xml-parser, node-fetch (or Node 18+ native fetch)
 */

import { readFileSync, writeFileSync, mkdirSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';
import { XMLParser } from 'fast-xml-parser';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, '..');
const DATA_DIR = resolve(ROOT, 'data');

const MAX_EPISODES_PER_SHOW = 5;
const FETCH_TIMEOUT_MS = 10_000;
const CONCURRENCY = 4; // fetch N shows at a time to avoid hammering

// ─── Helpers ────────────────────────────────────────────────────────────────

function log(msg) {
  console.log(`[ingest] ${new Date().toISOString().slice(11, 19)} ${msg}`);
}

function warn(msg) {
  console.warn(`[ingest] ⚠  ${msg}`);
}

/** Fetch with a timeout */
async function fetchWithTimeout(url, ms = FETCH_TIMEOUT_MS) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), ms);
  try {
    const res = await fetch(url, { signal: controller.signal });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return await res.text();
  } finally {
    clearTimeout(timer);
  }
}

/** Run an array of async tasks with limited concurrency */
async function pMap(items, fn, concurrency) {
  const results = [];
  let i = 0;
  async function worker() {
    while (i < items.length) {
      const idx = i++;
      results[idx] = await fn(items[idx], idx);
    }
  }
  await Promise.all(Array.from({ length: concurrency }, worker));
  return results;
}

// ─── RSS Parsing ─────────────────────────────────────────────────────────────

const parser = new XMLParser({
  ignoreAttributes: false,
  attributeNamePrefix: '@_',
  allowBooleanAttributes: true,
  processEntities: false, // Disable entity processing to avoid expansion limits
  ignoreNameSpace: false,
  allowXXE: false,
});

/**
 * Parse raw RSS XML and return { showMeta, episodes }
 */
function parseRSS(xml, showSlug) {
  let parsed;
  try {
    parsed = parser.parse(xml);
  } catch (e) {
    throw new Error(`XML parse error: ${e.message}`);
  }

  const channel = parsed?.rss?.channel;
  if (!channel) throw new Error('No <channel> found in RSS');

  // Show-level metadata (we use this to update cover art, title etc. from feed)
  const showMeta = {
    feedTitle: channel.title ?? null,
    feedDescription: channel.description ?? null,
    feedLink: channel.link ?? null,
    coverArt:
      channel['itunes:image']?.['@_href'] ??
      channel.image?.url ??
      null,
    author:
      channel['itunes:author'] ??
      channel['itunes:owner']?.['itunes:name'] ??
      null,
    lastBuildDate: channel.lastBuildDate ?? channel.pubDate ?? null,
  };

  // Episodes
  const rawItems = Array.isArray(channel.item)
    ? channel.item
    : channel.item
    ? [channel.item]
    : [];

  const episodes = rawItems.slice(0, MAX_EPISODES_PER_SHOW).map((item) => {
    const enclosure = item.enclosure;
    return {
      showSlug,
      guid: String(item.guid?.['#text'] ?? item.guid ?? item.link ?? ''),
      title: item.title ?? '',
      description: stripHtml(
        item['itunes:summary'] ?? item.description ?? ''
      ).slice(0, 300),
      pubDate: item.pubDate ?? null,
      pubDateIso: toIso(item.pubDate),
      durationSeconds: parseDuration(item['itunes:duration']),
      audioUrl: enclosure?.['@_url'] ?? null,
      audioType: enclosure?.['@_type'] ?? null,
      episodeUrl: item.link ?? null,
      episodeNumber: item['itunes:episode'] ?? null,
      season: item['itunes:season'] ?? null,
      imageUrl: item['itunes:image']?.['@_href'] ?? null,
      explicit: item['itunes:explicit'] === 'true',
    };
  });

  return { showMeta, episodes };
}

function stripHtml(str) {
  return String(str).replace(/<[^>]*>/g, '').replace(/&amp;/g, '&').trim();
}

function toIso(dateStr) {
  if (!dateStr) return null;
  try {
    return new Date(dateStr).toISOString();
  } catch {
    return null;
  }
}

/** Convert itunes:duration (HH:MM:SS or seconds) to total seconds */
function parseDuration(raw) {
  if (!raw) return null;
  const str = String(raw).trim();
  if (/^\d+$/.test(str)) return parseInt(str, 10);
  const parts = str.split(':').map(Number);
  if (parts.length === 3) return parts[0] * 3600 + parts[1] * 60 + parts[2];
  if (parts.length === 2) return parts[0] * 60 + parts[1];
  return null;
}

// ─── Main ────────────────────────────────────────────────────────────────────

async function ingestShow(show) {
  if (!show.active) {
    log(`⏭  Skipping inactive show: ${show.slug}`);
    return { show, showMeta: null, episodes: [], error: null };
  }
  if (!show.rssUrl) {
    warn(`No rssUrl for ${show.slug} — skipping`);
    return { show, showMeta: null, episodes: [], error: 'no rssUrl' };
  }

  log(`📡 Fetching ${show.slug} — ${show.rssUrl}`);
  try {
    const xml = await fetchWithTimeout(show.rssUrl);
    const { showMeta, episodes } = parseRSS(xml, show.slug);
    log(`✅ ${show.slug} — ${episodes.length} episodes`);
    return { show, showMeta, episodes, error: null };
  } catch (err) {
    warn(`Failed ${show.slug}: ${err.message}`);
    return { show, showMeta: null, episodes: [], error: err.message };
  }
}

async function main() {
  log('Starting ingestion run…');

  // Load shows manifest
  const shows = JSON.parse(readFileSync(resolve(DATA_DIR, 'shows.json'), 'utf8'));
  log(`Loaded ${shows.length} shows`);

  // Ingest all shows with limited concurrency
  const results = await pMap(shows, ingestShow, CONCURRENCY);

  // Build enriched shows list (merge RSS metadata into our show records)
  const enrichedShows = results.map(({ show, showMeta, error }) => ({
    ...show,
    // Override cover art from feed if we don't have a manual one set
    coverArt: show.coverArtOverride ?? showMeta?.coverArt ?? show.coverArt ?? null,
    feedTitle: showMeta?.feedTitle ?? null,
    feedAuthor: showMeta?.author ?? null,
    lastBuildDate: showMeta?.lastBuildDate ?? null,
    ingestError: error,
    ingestAt: new Date().toISOString(),
  }));

  // Flatten all episodes, sorted newest first
  const allEpisodes = results
    .flatMap(({ episodes }) => episodes)
    .sort((a, b) => {
      const da = a.pubDateIso ? new Date(a.pubDateIso) : new Date(0);
      const db = b.pubDateIso ? new Date(b.pubDateIso) : new Date(0);
      return db - da;
    });

  // Summary stats
  const successCount = results.filter((r) => !r.error && r.show.active).length;
  const errorCount = results.filter((r) => r.error).length;

  const summary = {
    ingestedAt: new Date().toISOString(),
    showCount: shows.length,
    activeCount: shows.filter((s) => s.active).length,
    successCount,
    errorCount,
    episodeCount: allEpisodes.length,
    errors: results
      .filter((r) => r.error)
      .map((r) => ({ slug: r.show.slug, error: r.error })),
  };

  // Write output files
  mkdirSync(DATA_DIR, { recursive: true });

  writeFileSync(
    resolve(DATA_DIR, 'episodes.json'),
    JSON.stringify(allEpisodes, null, 2)
  );
  log(`Wrote episodes.json (${allEpisodes.length} episodes)`);

  writeFileSync(
    resolve(DATA_DIR, 'shows-enriched.json'),
    JSON.stringify(enrichedShows, null, 2)
  );
  log(`Wrote shows-enriched.json`);

  writeFileSync(
    resolve(DATA_DIR, 'ingest-summary.json'),
    JSON.stringify(summary, null, 2)
  );
  log(`Wrote ingest-summary.json`);

  log(`Done — ${successCount} ok, ${errorCount} errors`);
  if (errorCount > 0) {
    summary.errors.forEach((e) => warn(`  ${e.slug}: ${e.error}`));
  }
}

main().catch((err) => {
  console.error('[ingest] Fatal error:', err);
  process.exit(1);
});
