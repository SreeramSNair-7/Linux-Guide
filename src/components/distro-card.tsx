// file: src/components/distro-card.tsx
'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { formatFileSize, formatDate } from '@/lib/utils';
import type { Distro } from '@/types/distro.schema';
import { Download, Calendar, HardDrive, Cpu, Heart, Star } from 'lucide-react';
import { getRatingSummary, loadFavorites, isFavorite, subscribePreferences, toggleFavorite } from '@/lib/user-preferences';

interface DistroCardProps {
  distro: Distro;
}

export function DistroCard({ distro }: DistroCardProps) {
  const primaryIso = distro.iso_files[0];
  const [favorite, setFavorite] = useState(false);
  const [rating, setRating] = useState<{ average: number; count: number }>({ average: 0, count: 0 });
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const refresh = async () => {
      await loadFavorites();
      setFavorite(isFavorite(distro.id));
      const summary = await getRatingSummary(distro.id);
      setRating(summary);
    };
    refresh();
    const unsubscribe = subscribePreferences(refresh);
    return () => unsubscribe();
  }, [distro.id]);

  const handleToggleFavorite = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    try {
      setIsLoading(true);
      const newState = await toggleFavorite(distro.id);
      setFavorite(newState);
    } catch (error) {
      console.error('Failed to toggle favorite:', error);
      // Revert optimistic update on error
      setFavorite(!favorite);
    } finally {
      setIsLoading(false);
    }
  };

  const renderStars = (value: number) => {
    const rounded = Math.round(value);
    return Array.from({ length: 5 }).map((_, idx) => (
      <Star
        key={idx}
        className={`h-4 w-4 ${idx < rounded ? 'text-yellow-500' : 'text-muted-foreground'}`}
        fill={idx < rounded ? 'currentColor' : 'none'}
      />
    ));
  };

  return (
    <Card className="flex flex-col transition-all cursor-zoom-in hover:shadow-xl hover:-translate-y-1">
      <CardHeader>
        <div className="mb-2 flex items-start justify-between">
          <CardTitle className="text-xl">{distro.name}</CardTitle>
          <Button
            variant="ghost"
            size="icon"
            onClick={handleToggleFavorite}
            disabled={isLoading}
            aria-label={favorite ? 'Remove from favorites' : 'Add to favorites'}
          >
            <Heart
              className={`h-4 w-4 transition-colors ${favorite ? 'text-red-500' : 'text-muted-foreground'}`}
              fill={favorite ? 'currentColor' : 'none'}
            />
          </Button>
        </div>
        {distro.popularity_rank && distro.popularity_rank <= 10 && (
          <Badge variant="default">Popular</Badge>
        )}
        <CardDescription className="mt-1">{distro.family} Family</CardDescription>
        <div className="mt-2 flex items-center gap-2 text-sm text-muted-foreground">
          <div className="flex items-center gap-1">{renderStars(rating.average)}</div>
          <span>{rating.count > 0 ? rating.average.toFixed(1) : 'No ratings'} ({rating.count})</span>
        </div>
      </CardHeader>

      <CardContent className="flex-1">
        <div className="mb-4 space-y-2 text-sm">
          <div className="flex items-center gap-2 text-muted-foreground">
            <Calendar className="h-4 w-4" aria-hidden="true" />
            <span>Released: {formatDate(distro.release_date)}</span>
          </div>
          <div className="flex items-center gap-2 text-muted-foreground">
            <HardDrive className="h-4 w-4" aria-hidden="true" />
            <span>Min RAM: {formatFileSize(distro.min_ram_mb)}</span>
          </div>
          <div className="flex items-center gap-2 text-muted-foreground">
            <Cpu className="h-4 w-4" aria-hidden="true" />
            <span>{distro.package_manager}</span>
          </div>
          {primaryIso && (
            <div className="flex items-center gap-2 text-muted-foreground">
              <Download className="h-4 w-4" aria-hidden="true" />
              <span>ISO: {formatFileSize(primaryIso.size_mb)}</span>
            </div>
          )}
        </div>

        <div className="mb-3">
          <div className="mb-1 text-xs font-semibold uppercase text-muted-foreground">
            Target Users
          </div>
          <div className="flex flex-wrap gap-1">
            {distro.target_users.slice(0, 3).map((user) => (
              <Badge key={user} variant="secondary">
                {user}
              </Badge>
            ))}
          </div>
        </div>

        <div>
          <div className="mb-1 text-xs font-semibold uppercase text-muted-foreground">
            Desktop Environments
          </div>
          <div className="flex flex-wrap gap-1">
            {distro.desktop_environments.slice(0, 3).map((de) => (
              <Badge key={de} variant="outline">
                {de}
              </Badge>
            ))}
            {distro.desktop_environments.length > 3 && (
              <Badge variant="outline">+{distro.desktop_environments.length - 3} more</Badge>
            )}
          </div>
        </div>
      </CardContent>

      <CardFooter className="flex gap-2">
        <Button asChild className="flex-1 cursor-pointer">
          <Link href={`/distros/${distro.id}`}>View Details</Link>
        </Button>
        <Button asChild variant="outline" className="cursor-pointer">
          <Link href={distro.official_docs_url} target="_blank" rel="noopener noreferrer">
            Docs
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
