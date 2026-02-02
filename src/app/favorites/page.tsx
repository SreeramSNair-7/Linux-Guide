'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Heart, Search, Trash2, Sparkles, Download, Calendar, HardDrive } from 'lucide-react';
import { loadFavorites, toggleFavorite, clearAllFavorites, subscribePreferences } from '@/lib/user-preferences';
import type { Distro } from '@/types/distro.schema';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { formatDate, formatFileSize } from '@/lib/utils';

export default function FavoritesPage() {
  const [favorites, setFavorites] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [distros, setDistros] = useState<Distro[]>([]);

  useEffect(() => {
    const init = async () => {
      try {
        const response = await fetch('/api/distros');
        if (!response.ok) throw new Error('Failed to fetch distros');
        const allDistros = await response.json();
        setDistros(allDistros);
      } catch (error) {
        console.error('Failed to load distros:', error);
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
    <div className="min-h-screen bg-gradient-to-b from-background to-secondary/20">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Hero Header with Gradient */}
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-pink-500/10 via-red-500/10 to-purple-500/10 border border-pink-500/20 mb-8 p-8">
          <div className="absolute inset-0 bg-grid-white/5 [mask-image:linear-gradient(0deg,white,transparent)]" />
          <div className="relative flex items-start justify-between">
            <div className="space-y-2">
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-xl bg-gradient-to-br from-pink-500 to-red-500 shadow-lg shadow-pink-500/50">
                  <Heart className="h-8 w-8 text-white fill-white" />
                </div>
                <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-pink-600 via-red-600 to-purple-600 bg-clip-text text-transparent">
                  My Favorites
                </h1>
              </div>
              <p className="text-lg text-muted-foreground flex items-center gap-2">
                {favorites.length === 0 ? (
                  <>
                    <Sparkles className="h-4 w-4" />
                    No favorites yet. Start building your collection!
                  </>
                ) : (
                  <>
                    <Sparkles className="h-4 w-4 text-yellow-500" />
                    {favorites.length} handpicked {favorites.length === 1 ? 'distribution' : 'distributions'}
                  </>
                )}
              </p>
            </div>
            
            {favorites.length > 0 && (
              <Button 
                variant="destructive" 
                onClick={handleClearAll}
                className="gap-2 shadow-lg"
                size="lg"
              >
                <Trash2 className="h-4 w-4" />
                Clear All
              </Button>
            )}
          </div>
        </div>

        {/* Search Bar with Modern Styling */}
        {favorites.length > 0 && (
          <div className="mb-8">
            <div className="relative max-w-md">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Search your favorites..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-12 h-12 text-base rounded-xl border-2 focus:border-pink-500 transition-colors"
              />
            </div>
          </div>
        )}

        {/* Favorites Grid or Empty State */}
        {favorites.length === 0 ? (
          <Card className="text-center py-16 border-dashed border-2">
            <CardContent className="space-y-6">
              <div className="relative inline-block">
                <Heart className="h-32 w-32 text-muted-foreground/20 mx-auto" />
                <Sparkles className="h-8 w-8 text-yellow-500 absolute -top-2 -right-2 animate-pulse" />
              </div>
              <div className="space-y-2">
                <h2 className="text-3xl font-bold">Start Your Collection</h2>
                <p className="text-muted-foreground text-lg max-w-md mx-auto">
                  Discover amazing Linux distributions and save your favorites for quick access
                </p>
              </div>
              <Link href="/distros">
                <Button size="lg" className="gap-2 shadow-lg">
                  <Sparkles className="h-5 w-5" />
                  Explore Distributions
                </Button>
              </Link>
            </CardContent>
          </Card>
        ) : filteredDistros.length === 0 ? (
          <Card className="text-center py-12">
            <CardContent className="space-y-4">
              <Search className="h-20 w-20 text-muted-foreground/20 mx-auto" />
              <div>
                <h2 className="text-2xl font-semibold mb-2">No matches found</h2>
                <p className="text-muted-foreground">
                  Try a different search term
                </p>
              </div>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredDistros.map((distro) => {
              const primaryIso = distro.iso_files[0];
              return (
                <Card 
                  key={distro.id}
                  className="group hover:shadow-2xl hover:scale-[1.02] transition-all duration-300 overflow-hidden border-2 hover:border-pink-500/50"
                >
                  {/* Gradient Header */}
                  <div className="h-2 bg-gradient-to-r from-pink-500 via-red-500 to-purple-500" />
                  
                  <CardHeader className="relative pb-3">
                    {/* Remove Button */}
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleRemove(distro.id)}
                      className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-500/10 hover:text-red-600"
                      title="Remove from favorites"
                    >
                      <Heart className="h-5 w-5 fill-current" />
                    </Button>

                    <CardTitle className="text-xl pr-10">
                      <Link 
                        href={`/distros/${distro.id}`}
                        className="hover:text-pink-600 transition-colors"
                      >
                        {distro.name}
                      </Link>
                    </CardTitle>
                    <CardDescription className="flex items-center gap-2">
                      <Badge variant="secondary" className="font-medium">
                        {distro.family}
                      </Badge>
                      <span className="text-xs">v{distro.latest_version}</span>
                    </CardDescription>
                  </CardHeader>

                  <CardContent className="space-y-4 pb-4">
                    {/* Target Users */}
                    <div className="flex flex-wrap gap-1.5">
                      {distro.target_users.slice(0, 3).map((user) => (
                        <Badge 
                          key={user} 
                          variant="outline" 
                          className="text-xs capitalize"
                        >
                          {user}
                        </Badge>
                      ))}
                    </div>

                    {/* Quick Stats */}
                    <div className="space-y-2 text-sm text-muted-foreground">
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4" />
                        <span>{formatDate(distro.release_date)}</span>
                      </div>
                      {primaryIso && (
                        <div className="flex items-center gap-2">
                          <Download className="h-4 w-4" />
                          <span>{formatFileSize(primaryIso.size_mb)}</span>
                        </div>
                      )}
                      <div className="flex items-center gap-2">
                        <HardDrive className="h-4 w-4" />
                        <span>{distro.package_manager}</span>
                      </div>
                    </div>

                    {/* Desktop Environments */}
                    <div>
                      <p className="text-xs font-semibold text-muted-foreground mb-1.5">Desktop Environments</p>
                      <div className="flex flex-wrap gap-1">
                        {distro.desktop_environments.slice(0, 3).map((de) => (
                          <span 
                            key={de}
                            className="px-2 py-0.5 text-xs bg-primary/10 text-primary rounded"
                          >
                            {de}
                          </span>
                        ))}
                        {distro.desktop_environments.length > 3 && (
                          <span className="px-2 py-0.5 text-xs bg-muted text-muted-foreground rounded">
                            +{distro.desktop_environments.length - 3}
                          </span>
                        )}
                      </div>
                    </div>
                  </CardContent>

                  <CardFooter className="bg-secondary/30 pt-4">
                    <Link href={`/distros/${distro.id}`} className="w-full">
                      <Button 
                        variant="outline" 
                        className="w-full group-hover:bg-pink-500 group-hover:text-white group-hover:border-pink-500 transition-all"
                      >
                        View Details
                      </Button>
                    </Link>
                  </CardFooter>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
