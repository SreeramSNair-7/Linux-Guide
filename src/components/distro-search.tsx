// file: src/components/distro-search.tsx
'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';

interface DistroSearchProps {
  initialQuery?: string;
}

export function DistroSearch({ initialQuery = '' }: DistroSearchProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [query, setQuery] = useState(initialQuery);
  const debounceTimerRef = useRef<NodeJS.Timeout>();

  const handleSearch = useCallback((value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value.trim()) {
      params.set('search', value.trim());
    } else {
      params.delete('search');
    }
    router.push(`/distros?${params.toString()}`);
  }, [router, searchParams]);

  useEffect(() => {
    // Clear existing timer
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }

    // Set new timer for debouncing
    debounceTimerRef.current = setTimeout(() => {
      handleSearch(query);
    }, 300);

    // Cleanup on unmount
    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, [query, handleSearch]);

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
