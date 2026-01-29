// file: src/lib/user-preferences.ts

export interface ReviewEntry {
  id: string;
  rating: number;
  title: string;
  body: string;
  userName: string;
  createdAt: string;
  updatedAt: string;
}

export interface ReviewSummary {
  totalReviews: number;
  averageRating: number;
  ratingCounts: {
    5: number;
    4: number;
    3: number;
    2: number;
    1: number;
  };
}

export interface CompareHistoryEntry {
  distro1Id: string;
  distro2Id: string;
  timestamp: string;
}

const FAVORITES_KEY = 'linuxSite:favorites';
const REVIEWS_KEY = 'linuxSite:reviews';
const COMPARE_HISTORY_KEY = 'linuxSite:compareHistory';
const PREFS_EVENT = 'linuxSite:prefs-changed';
const isBrowser = typeof window !== 'undefined';

// Local cache for favorites
let favoritesCache: string[] | null = null;

function readJSON<T>(key: string, fallback: T): T {
  if (!isBrowser) return fallback;
  try {
    const raw = window.localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

function writeJSON<T>(key: string, value: T) {
  if (!isBrowser) return;
  window.localStorage.setItem(key, JSON.stringify(value));
  window.dispatchEvent(new CustomEvent(PREFS_EVENT));
}

function notifyChange() {
  if (!isBrowser) return;
  window.dispatchEvent(new CustomEvent(PREFS_EVENT));
}

export function subscribePreferences(callback: () => void) {
  if (!isBrowser) return () => undefined;
  const handler = () => callback();
  window.addEventListener(PREFS_EVENT, handler as EventListener);
  window.addEventListener('storage', handler);
  return () => {
    window.removeEventListener(PREFS_EVENT, handler as EventListener);
    window.removeEventListener('storage', handler);
  };
}

// ===== FAVORITES =====

export async function loadFavorites(): Promise<string[]> {
  if (!isBrowser) return [];
  favoritesCache = readJSON<string[]>(FAVORITES_KEY, []);
  return favoritesCache;
}

export function getFavorites(): string[] {
  // Return cached favorites
  return favoritesCache || readJSON<string[]>(FAVORITES_KEY, []);
}

export function isFavorite(distroId: string): boolean {
  return getFavorites().includes(distroId);
}

export async function toggleFavorite(distroId: string): Promise<boolean> {
  if (!isBrowser) return false;
  
  const currentFavorites = getFavorites();
  const isFav = currentFavorites.includes(distroId);
  const newFavorites = isFav 
    ? currentFavorites.filter(id => id !== distroId)
    : [...currentFavorites, distroId];
  
  favoritesCache = newFavorites;
  writeJSON(FAVORITES_KEY, newFavorites);
  
  return !isFav;
}

export async function clearAllFavorites(): Promise<void> {
  if (!isBrowser) return;
  
  favoritesCache = [];
  writeJSON(FAVORITES_KEY, []);
}

// ===== REVIEWS =====

export async function getReviews(distroId: string): Promise<{ reviews: ReviewEntry[]; summary: ReviewSummary }> {
  const all = readJSON<ReviewEntry[]>(REVIEWS_KEY, []);
  const reviews = all.filter(r => r.id.startsWith(distroId));
  
  const totalReviews = reviews.length;
  const averageRating = totalReviews > 0
    ? reviews.reduce((sum, r) => sum + r.rating, 0) / totalReviews
    : 0;

  const ratingCounts = {
    5: reviews.filter(r => r.rating === 5).length,
    4: reviews.filter(r => r.rating === 4).length,
    3: reviews.filter(r => r.rating === 3).length,
    2: reviews.filter(r => r.rating === 2).length,
    1: reviews.filter(r => r.rating === 1).length,
  };

  return {
    reviews,
    summary: {
      totalReviews,
      averageRating,
      ratingCounts,
    },
  };
}

export async function addReview(input: {
  distroId: string;
  rating: number;
  title: string;
  body: string;
  userName: string;
}): Promise<ReviewEntry | null> {
  const all = readJSON<ReviewEntry[]>(REVIEWS_KEY, []);
  
  const entry: ReviewEntry = {
    id: `${input.distroId}-${Date.now()}`,
    rating: input.rating,
    title: input.title,
    body: input.body,
    userName: input.userName,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  
  const updated = [entry, ...all];
  writeJSON(REVIEWS_KEY, updated);
  return entry;
}

export async function getRatingSummary(distroId: string): Promise<{ average: number; count: number }> {
  const { summary } = await getReviews(distroId);
  return {
    average: summary.averageRating,
    count: summary.totalReviews,
  };
}

// ===== COMPARE HISTORY =====

export async function getCompareHistory(): Promise<CompareHistoryEntry[]> {
  return readJSON<CompareHistoryEntry[]>(COMPARE_HISTORY_KEY, []);
}

export async function addCompareHistory(distro1Id: string, distro2Id: string): Promise<void> {
  if (!distro1Id || !distro2Id) return;
  
  const all = readJSON<CompareHistoryEntry[]>(COMPARE_HISTORY_KEY, []);
  const key = `${distro1Id}__${distro2Id}`;
  
  const updated = [
    {
      distro1Id,
      distro2Id,
      timestamp: new Date().toISOString(),
    },
    ...all.filter((entry) => `${entry.distro1Id}__${entry.distro2Id}` !== key),
  ].slice(0, 10);

  writeJSON(COMPARE_HISTORY_KEY, updated);
}

export async function clearCompareHistory(): Promise<void> {
  writeJSON(COMPARE_HISTORY_KEY, [] as CompareHistoryEntry[]);
}

