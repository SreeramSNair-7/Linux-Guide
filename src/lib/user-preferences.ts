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
const PREFS_EVENT = 'linuxSite:prefs-changed';
const isBrowser = typeof window !== 'undefined';

// Local cache for favorites
let favoritesCache: string[] | null = null;

function notifyChange() {
  if (!isBrowser) return;
  window.dispatchEvent(new CustomEvent(PREFS_EVENT));
}

export function subscribePreferences(callback: () => void) {
  if (!isBrowser) return () => undefined;
  const handler = () => callback();
  window.addEventListener(PREFS_EVENT, handler as EventListener);
  return () => {
    window.removeEventListener(PREFS_EVENT, handler as EventListener);
  };
}

// ===== FAVORITES =====

export async function loadFavorites(): Promise<string[]> {
  if (!isBrowser) return [];
  
  try {
    // Try to load from API
    const response = await fetch('/api/favorites', {
      credentials: 'include',
    });
    
    if (response.ok) {
      const data = await response.json();
      favoritesCache = data.distroIds || [];
      // Sync to localStorage
      localStorage.setItem(FAVORITES_KEY, JSON.stringify(favoritesCache));
      return favoritesCache;
    }
  } catch (error) {
    console.error('Error loading favorites from API:', error);
  }
  
  // Fallback to localStorage
  try {
    const stored = localStorage.getItem(FAVORITES_KEY);
    favoritesCache = stored ? JSON.parse(stored) : [];
    return favoritesCache;
  } catch {
    favoritesCache = [];
    return [];
  }
}

export function getFavorites(): string[] {
  // Return cached favorites
  return favoritesCache || [];
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
  
  // Update local cache and localStorage immediately for instant UI feedback
  favoritesCache = newFavorites;
  localStorage.setItem(FAVORITES_KEY, JSON.stringify(newFavorites));
  notifyChange();
  
  // Sync to database in background
  try {
    const response = await fetch('/api/favorites', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ distroId }),
    });

    if (!response.ok) {
      console.error('Failed to sync favorite to database');
    }
  } catch (error) {
    console.error('Error syncing favorite:', error);
  }
  
  return !isFav;
}

export async function clearAllFavorites(): Promise<void> {
  if (!isBrowser) return;
  
  favoritesCache = [];
  localStorage.setItem(FAVORITES_KEY, JSON.stringify([]));
  notifyChange();

  try {
    await fetch('/api/favorites', {
      method: 'DELETE',
      credentials: 'include',
    });
  } catch (error) {
    console.error('Error clearing favorites:', error);
  }
}

// ===== REVIEWS =====

export async function getReviews(distroId: string): Promise<{ reviews: ReviewEntry[]; summary: ReviewSummary }> {
  try {
    const response = await fetch(`/api/reviews?distroId=${encodeURIComponent(distroId)}`, {
      credentials: 'include',
    });
    if (!response.ok) throw new Error('Failed to load reviews');
    return await response.json();
  } catch (error) {
    console.error('Error loading reviews:', error);
    return {
      reviews: [],
      summary: {
        totalReviews: 0,
        averageRating: 0,
        ratingCounts: { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 },
      },
    };
  }
}

export async function addReview(input: {
  distroId: string;
  rating: number;
  title: string;
  body: string;
  userName: string;
}): Promise<ReviewEntry | null> {
  try {
    const response = await fetch('/api/reviews', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify(input),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to save review');
    }
    
    const data = await response.json();
    notifyChange();
    return data.review;
  } catch (error) {
    console.error('Error saving review:', error);
    throw error;
  }
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
  try {
    const response = await fetch('/api/compare-history', {
      credentials: 'include',
    });
    if (!response.ok) throw new Error('Failed to load compare history');
    const data = await response.json();
    return data.history || [];
  } catch (error) {
    console.error('Error loading compare history:', error);
    return [];
  }
}

export async function addCompareHistory(distro1Id: string, distro2Id: string): Promise<void> {
  if (!distro1Id || !distro2Id) return;
  
  try {
    const response = await fetch('/api/compare-history', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ distro1Id, distro2Id }),
    });

    if (!response.ok) throw new Error('Failed to save compare history');
    notifyChange();
  } catch (error) {
    console.error('Error saving compare history:', error);
  }
}

export async function clearCompareHistory(): Promise<void> {
  try {
    const response = await fetch('/api/compare-history', {
      method: 'DELETE',
      credentials: 'include',
    });

    if (!response.ok) throw new Error('Failed to clear compare history');
    notifyChange();
  } catch (error) {
    console.error('Error clearing compare history:', error);
  }
}

