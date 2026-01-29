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

const PREFS_EVENT = 'linuxSite:prefs-changed';
const isBrowser = typeof window !== 'undefined';

// Local cache for favorites (synced with server)
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
  try {
    const response = await fetch('/api/favorites');
    if (!response.ok) throw new Error('Failed to load favorites');
    const data = await response.json();
    favoritesCache = data.distroIds || [];
    return favoritesCache as string[];
  } catch (error) {
    console.error('Error loading favorites:', error);
    return [];
  }
}

export function getFavorites(): string[] {
  // Return cached favorites (call loadFavorites first in useEffect)
  return favoritesCache || [];
}

export function isFavorite(distroId: string): boolean {
  return getFavorites().includes(distroId);
}

export async function toggleFavorite(distroId: string): Promise<boolean> {
  try {
    const response = await fetch('/api/favorites', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ distroId }),
    });

    if (!response.ok) throw new Error('Failed to toggle favorite');
    
    const data = await response.json();
    
    // Update cache
    if (data.isFavorite) {
      favoritesCache = [...(favoritesCache || []), distroId];
    } else {
      favoritesCache = (favoritesCache || []).filter(id => id !== distroId);
    }
    
    notifyChange();
    return data.isFavorite;
  } catch (error) {
    console.error('Error toggling favorite:', error);
    return false;
  }
}

export async function clearAllFavorites(): Promise<void> {
  try {
    const response = await fetch('/api/favorites', {
      method: 'DELETE',
    });

    if (!response.ok) throw new Error('Failed to clear favorites');
    
    favoritesCache = [];
    notifyChange();
  } catch (error) {
    console.error('Error clearing favorites:', error);
  }
}

// ===== REVIEWS =====

export async function getReviews(distroId: string): Promise<{ reviews: ReviewEntry[]; summary: ReviewSummary }> {
  try {
    const response = await fetch(`/api/reviews?distroId=${encodeURIComponent(distroId)}`);
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
    const response = await fetch('/api/compare-history');
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
    });

    if (!response.ok) throw new Error('Failed to clear compare history');
    notifyChange();
  } catch (error) {
    console.error('Error clearing compare history:', error);
  }
}

