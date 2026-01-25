// file: src/app/distros/page.tsx
import { Suspense } from 'react';
import { loadAllDistros } from '@/lib/distro-loader';
import { DistroCard } from '@/components/distro-card';
import { DistroFilters } from '@/components/distro-filters';
import { DistroSearch } from '@/components/distro-search';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Filter } from 'lucide-react';

export const metadata = {
  title: 'Browse Linux Distributions',
  description: 'Explore our comprehensive catalog of Linux distributions',
};

export const revalidate = 3600; // Revalidate every hour

interface DistrosPageProps {
  searchParams: {
    family?: string;
    target?: string;
    tag?: string;
    search?: string;
  };
}

export default async function DistrosPage({ searchParams }: DistrosPageProps) {
  const allDistros = await loadAllDistros();

  // Apply filters from search params
  let filteredDistros = allDistros;

  if (searchParams.family) {
    filteredDistros = filteredDistros.filter((d) => d.family === searchParams.family);
  }

  if (searchParams.target) {
    filteredDistros = filteredDistros.filter((d) =>
      d.target_users.includes(searchParams.target as any)
    );
  }

  if (searchParams.tag) {
    filteredDistros = filteredDistros.filter((d) => d.tags.includes(searchParams.tag as string));
  }

  if (searchParams.search) {
    const query = searchParams.search.toLowerCase();
    filteredDistros = filteredDistros.filter(
      (d) =>
        d.name.toLowerCase().includes(query) ||
        d.id.toLowerCase().includes(query) ||
        d.tags.some((tag) => tag.toLowerCase().includes(query))
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="mb-2 text-4xl font-bold">Linux Distributions</h1>
        <p className="text-lg text-muted-foreground">
          Browse {allDistros.length} distributions and find the one that fits your needs
        </p>
      </div>

      {/* Search and Compare Actions */}
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex-1">
          <DistroSearch initialQuery={searchParams.search} />
        </div>
        <Button asChild variant="outline">
          <Link href="/distros/compare">
            <Filter className="mr-2 h-4 w-4" aria-hidden="true" />
            Compare Distros
          </Link>
        </Button>
      </div>

      {/* Filters and Results */}
      <div className="grid gap-8 lg:grid-cols-[250px_1fr]">
        {/* Filters Sidebar */}
        <aside className="space-y-4">
          <DistroFilters
            currentFamily={searchParams.family}
            currentTarget={searchParams.target}
            currentTag={searchParams.tag}
          />
        </aside>

        {/* Distro Grid */}
        <div>
          <div className="mb-4 text-sm text-muted-foreground">
            Showing {filteredDistros.length} of {allDistros.length} distributions
          </div>
          <Suspense fallback={<LoadingSkeleton />}>
            <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
              {filteredDistros.map((distro) => (
                <DistroCard key={distro.id} distro={distro} />
              ))}
            </div>
          </Suspense>

          {filteredDistros.length === 0 && (
            <div className="py-16 text-center">
              <p className="text-lg text-muted-foreground">
                No distributions found matching your filters.
              </p>
              <Button asChild variant="outline" className="mt-4">
                <Link href="/distros">Clear Filters</Link>
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function LoadingSkeleton() {
  return (
    <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
      {[...Array(6)].map((_, i) => (
        <div key={i} className="h-64 rounded-lg border bg-card skeleton" />
      ))}
    </div>
  );
}
