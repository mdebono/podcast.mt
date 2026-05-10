// src/lib/data.js
// Helpers to load and work with ingested JSON data

import showsRaw from '../../data/shows-enriched.json';
import episodesRaw from '../../data/episodes.json';

export const shows = showsRaw;
export const episodes = episodesRaw;

/** Get a show by slug */
export function getShow(slug) {
  return shows.find((s) => s.slug === slug) ?? null;
}

/** Episodes for a specific show, newest first */
export function getEpisodesForShow(slug) {
  return episodes.filter((e) => e.showSlug === slug);
}

/** Latest N episodes across all shows */
export function getLatestEpisodes(n = 8) {
  return episodes.slice(0, n);
}

/** Featured shows */
export function getFeaturedShows() {
  return shows.filter((s) => s.featured && s.active);
}

/** All active shows */
export function getActiveShows() {
  return shows.filter((s) => s.active);
}

/** Format seconds → "42 min" or "1h 12min" */
export function formatDuration(seconds) {
  if (!seconds) return null;
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  if (h > 0) return `${h}h ${m}min`;
  return `${m} min`;
}

/** Format ISO date → "6 May 2024" */
export function formatDate(iso) {
  if (!iso) return null;
  return new Date(iso).toLocaleDateString('en-MT', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
}

/** Days since ISO date */
export function daysSince(iso) {
  if (!iso) return 999;
  return Math.floor((Date.now() - new Date(iso)) / 86_400_000);
}

/** Language badge label */
export function langLabel(languages) {
  if (!languages?.length) return 'EN';
  if (languages.includes('mt') && languages.includes('en')) return 'MT + EN';
  if (languages.includes('mt')) return 'Malti';
  return 'EN';
}

/** All unique tags across active shows */
export function getAllTags() {
  const set = new Set();
  shows.filter((s) => s.active).forEach((s) => s.tags?.forEach((t) => set.add(t)));
  return [...set].sort();
}
