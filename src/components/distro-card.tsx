// file: src/components/distro-card.tsx
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { formatFileSize, formatDate } from '@/lib/utils';
import type { Distro } from '@/types/distro.schema';
import { Download, Calendar, HardDrive, Cpu } from 'lucide-react';

interface DistroCardProps {
  distro: Distro;
}

export function DistroCard({ distro }: DistroCardProps) {
  const primaryIso = distro.iso_files[0];

  return (
    <Card className="flex flex-col transition-shadow hover:shadow-lg">
      <CardHeader>
        <div className="mb-2 flex items-start justify-between">
          <CardTitle className="text-xl">{distro.name}</CardTitle>
          {distro.popularity_rank && distro.popularity_rank <= 10 && (
            <Badge variant="default">Popular</Badge>
          )}
        </div>
        <CardDescription>{distro.family} Family</CardDescription>
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
        <Button asChild className="flex-1">
          <Link href={`/distros/${distro.id}`}>View Details</Link>
        </Button>
        <Button asChild variant="outline">
          <Link href={distro.official_docs_url} target="_blank" rel="noopener noreferrer">
            Docs
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
