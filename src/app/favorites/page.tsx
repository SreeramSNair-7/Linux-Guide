'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Heart, Search, Trash2 } from 'lucide-react';
import { loadFavorites, toggleFavorite, clearAllFavorites, subscribePreferences } from '@/lib/user-preferences';
import type { Distro } from '@/types/distro.schema';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export default function FavoritesPage() {
  const [favorites, setFavorites] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [distros, setDistros] = useState<Distro[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const init = async () => {
      try {
        setIsLoading(true);
        const response = await fetch('/api/distros');
        if (!response.ok) throw new Error('Failed to fetch distros');
        const allDistros = await response.json();
        setDistros(allDistros);
      } catch (error) {
        console.error('Failed to load distros:', error);
      } finally {
        setIsLoading(false);
      }
    };
    init();
  }, []);

  const getDistroById = (id: string): Distro | undefined => distros.find((d: Distro) => d.id === id);

  useEffect(() => {
    // Initial load
    const loadData = async () => {
      const favs = await loadFavorites();
      setFavorites(favs);
    };
    loadData();

    // Subscribe to changes
    const unsubscribe = subscribePreferences(async () => {
      const favs = await loadFavorites();
      setFavorites(favs);
    });

    return unsubscribe;
  }, []);

  const handleRemove = async (distroId: string) => {
    await toggleFavorite(distroId);
  };

  const handleClearAll = async () => {
    if (confirm('Are you sure you want to remove all favorites?')) {
      await clearAllFavorites();
    }
  };

  // Get distro details for each favorite
  const favoriteDistros = favorites
    .map(id => getDistroById(id))
    .filter(d => d !== undefined);

  // Filter by search query
  const filteredDistros = favoriteDistros.filter(distro =>
    distro.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold flex items-center gap-2">
              <Heart className="h-8 w-8 text-red-500 fill-red-500" />
              My Favorites
            </h1>
            <p className="text-muted-foreground mt-2">
              {favorites.length === 0 
                ? 'No favorites yet. Start adding distros you love!'
                : `You have ${favorites.length} favorite ${favorites.length === 1 ? 'distro' : 'distros'}`
              }
            </p>
          </div>
          
          {favorites.length > 0 && (
            <Button 
              variant="destructive" 
              onClick={handleClearAll}
              className="gap-2"
            >
              <Trash2 className="h-4 w-4" />
              Clear All
            </Button>
          )}
        </div>

        {/* Search Bar */}
        {favorites.length > 0 && (
          <div className="mb-6 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search your favorites..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        )}

        {/* Favorites Grid */}
        {favorites.length === 0 ? (
          <div className="text-center py-16">
            <Heart className="h-24 w-24 text-muted-foreground mx-auto mb-4 opacity-20" />
            <h2 className="text-2xl font-semibold mb-2">No favorites yet</h2>
            <p className="text-muted-foreground mb-6">
              Browse distros and click the heart icon to add them to your favorites
            </p>
            <Link href="/distros">
              <Button>Browse Distros</Button>
            </Link>
          </div>
        ) : filteredDistros.length === 0 ? (
          <div className="text-center py-16">
            <Search className="h-16 w-16 text-muted-foreground mx-auto mb-4 opacity-20" />
            <h2 className="text-xl font-semibold mb-2">No matches found</h2>
            <p className="text-muted-foreground">
              Try a different search term
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredDistros.map((distro) => (
              <div
                key={distro.id}
                className="border rounded-lg p-6 hover:shadow-lg transition-shadow relative group"
              >
                {/* Remove Button */}
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleRemove(distro.id)}
                  className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                  title="Remove from favorites"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>

                {/* Distro Info */}
                <Link href={`/distros/${distro.id}`}>
                  <div className="cursor-pointer">
                    <h3 className="text-xl font-bold mb-2 pr-8">{distro.name}</h3>
                    <p className="text-sm text-muted-foreground mb-4 line-clamp-3">
                      {distro.family} distribution - {distro.latest_version}
                    </p>
                    
                    {/* Tags */}
                    <div className="flex flex-wrap gap-2 mb-4">
                      <span className="px-2 py-1 text-xs bg-primary/10 text-primary rounded">
                        {distro.family}
                      </span>
                      {distro.target_users.length > 0 && (
                        <span className="px-2 py-1 text-xs bg-secondary/50 rounded">
                          {distro.target_users[0]}
                        </span>
                      )}
                    </div>

                    {/* Details */}
                    <div className="text-xs text-muted-foreground space-y-1">
                      <p><strong>Version:</strong> {distro.latest_version}</p>
                      <p><strong>Package Manager:</strong> {distro.package_manager}</p>
                      <p><strong>Desktop:</strong> {distro.desktop_environments.slice(0, 2).join(', ')}</p>
                    </div>
                  </div>
                </Link>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
