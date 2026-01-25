// file: src/components/distro-filters.tsx
'use client';

import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

interface DistroFiltersProps {
  currentFamily?: string;
  currentTarget?: string;
  currentTag?: string;
}

const FAMILIES = ['Debian', 'Arch', 'Red Hat', 'SUSE', 'Gentoo', 'Independent'];
const TARGET_USERS = ['beginner', 'intermediate', 'advanced', 'enterprise', 'developer'];
const POPULAR_TAGS = ['beginner-friendly', 'LTS', 'rolling-release', 'lightweight', 'server', 'desktop'];

export function DistroFilters({ currentFamily, currentTarget, currentTag }: DistroFiltersProps) {
  const searchParams = useSearchParams();

  const buildLink = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set(key, value);
    return `/distros?${params.toString()}`;
  };

  const clearFilters = () => {
    const params = new URLSearchParams(searchParams.toString());
    params.delete('family');
    params.delete('target');
    params.delete('tag');
    return `/distros${params.toString() ? `?${params.toString()}` : ''}`;
  };

  const hasFilters = currentFamily || currentTarget || currentTag;

  return (
    <div className="space-y-4">
      {hasFilters && (
        <Button asChild variant="outline" size="sm" className="w-full">
          <Link href={clearFilters()}>Clear All Filters</Link>
        </Button>
      )}

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Family</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {FAMILIES.map((family) => (
            <Link
              key={family}
              href={buildLink('family', family)}
              className={`block text-sm ${
                currentFamily === family ? 'font-semibold text-primary' : 'text-muted-foreground hover:text-primary'
              }`}
            >
              {family}
            </Link>
          ))}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Target Users</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-wrap gap-2">
          {TARGET_USERS.map((target) => (
            <Link key={target} href={buildLink('target', target)}>
              <Badge variant={currentTarget === target ? 'default' : 'outline'}>{target}</Badge>
            </Link>
          ))}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Tags</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-wrap gap-2">
          {POPULAR_TAGS.map((tag) => (
            <Link key={tag} href={buildLink('tag', tag)}>
              <Badge variant={currentTag === tag ? 'default' : 'outline'}>{tag}</Badge>
            </Link>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
