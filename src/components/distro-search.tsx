// file: src/components/distro-search.tsx
'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';
import { debounce } from '@/lib/utils';

interface DistroSearchProps {
  initialQuery?: string;
}

export function DistroSearch({ initialQuery = '' }: DistroSearchProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [query, setQuery] = useState(initialQuery);

  const handleSearch = debounce((value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value) {
      params.set('search', value);
    } else {
      params.delete('search');
    }
    router.push(`/distros?${params.toString()}`);
  }, 300);

  useEffect(() => {
    handleSearch(query);
  }, [query]);

  return (
    <div className="relative">
      <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" aria-hidden="true" />
      <Input
        type="search"
        placeholder="Search distributions..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="pl-10"
        aria-label="Search distributions"
      />
    </div>
  );
}
