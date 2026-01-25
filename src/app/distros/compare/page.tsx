// file: src/app/distros/compare/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { formatFileSize } from '@/lib/utils';
import Link from 'next/link';
import { ArrowLeft, X } from 'lucide-react';
import type { Distro } from '@/types/distro.schema';

export default function ComparePage() {
  const searchParams = useSearchParams();
  const [distros, setDistros] = useState<Distro[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const ids = searchParams.get('ids')?.split(',').filter(Boolean) || [];
    if (ids.length > 0 && ids.length <= 4) {
      // Fetch distros by IDs
      Promise.all(ids.map((id) => fetch(`/api/distros/${id}`).then((r) => r.json())))
        .then((results) => {
          setDistros(results.filter((d: Distro | null) => d !== null));
          setLoading(false);
        })
        .catch(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, [searchParams]);

  const removeDistro = (id: string) => {
    const newIds = distros.filter((d) => d.id !== id).map((d) => d.id);
    const newParams = new URLSearchParams();
    if (newIds.length > 0) {
      newParams.set('ids', newIds.join(','));
    }
    window.history.pushState({}, '', `/distros/compare?${newParams.toString()}`);
    setDistros((prev) => prev.filter((d) => d.id !== id));
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="h-96 animate-pulse rounded-lg bg-muted" />
      </div>
    );
  }

  if (distros.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Button asChild variant="ghost" className="mb-6">
          <Link href="/distros">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Distros
          </Link>
        </Button>
        <Card>
          <CardHeader>
            <CardTitle>No Distributions Selected</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="mb-4 text-muted-foreground">
              Select up to 4 distributions from the catalog to compare side-by-side.
            </p>
            <Button asChild>
              <Link href="/distros">Browse Distros</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Button asChild variant="ghost" className="mb-6">
        <Link href="/distros">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Distros
        </Link>
      </Button>

      <h1 className="mb-8 text-4xl font-bold">Compare Distributions</h1>

      {/* Comparison Table */}
      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="border-b">
              <th className="sticky left-0 bg-background p-4 text-left font-semibold">
                <span className="sr-only">Feature</span>
              </th>
              {distros.map((distro) => (
                <th key={distro.id} className="min-w-[250px] p-4">
                  <div className="flex items-start justify-between">
                    <div className="text-left">
                      <div className="font-semibold">{distro.name}</div>
                      <div className="text-sm font-normal text-muted-foreground">
                        v{distro.latest_version}
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => removeDistro(distro.id)}
                      aria-label={`Remove ${distro.name}`}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            <ComparisonRow
              label="Family"
              values={distros.map((d) => d.family)}
              renderValue={(v) => <Badge variant="outline">{v}</Badge>}
            />
            <ComparisonRow
              label="Package Manager"
              values={distros.map((d) => d.package_manager)}
            />
            <ComparisonRow
              label="Desktop Environments"
              values={distros.map((d) => d.desktop_environments.join(', '))}
            />
            <ComparisonRow label="Kernel" values={distros.map((d) => d.kernel)} />
            <ComparisonRow
              label="Min RAM"
              values={distros.map((d) => formatFileSize(d.min_ram_mb))}
            />
            <ComparisonRow
              label="Min Storage"
              values={distros.map((d) => formatFileSize(d.min_storage_mb))}
            />
            <ComparisonRow
              label="Target Users"
              values={distros.map((d) => d.target_users.join(', '))}
            />
            <ComparisonRow
              label="ISO Size"
              values={distros.map((d) =>
                d.iso_files[0] ? formatFileSize(d.iso_files[0].size_mb) : 'N/A'
              )}
            />
            <ComparisonRow label="License" values={distros.map((d) => d.license)} />
            <ComparisonRow
              label="Actions"
              values={distros.map((d) => d.id)}
              renderValue={(id) => (
                <div className="flex flex-col gap-2">
                  <Button asChild size="sm" className="w-full">
                    <Link href={`/distros/${id}`}>View Details</Link>
                  </Button>
                </div>
              )}
            />
          </tbody>
        </table>
      </div>
    </div>
  );
}

interface ComparisonRowProps {
  label: string;
  values: string[];
  renderValue?: (value: string) => React.ReactNode;
}

function ComparisonRow({ label, values, renderValue }: ComparisonRowProps) {
  return (
    <tr className="border-b">
      <td className="sticky left-0 bg-background p-4 font-medium">{label}</td>
      {values.map((value, idx) => (
        <td key={idx} className="p-4">
          {renderValue ? renderValue(value) : <span className="text-sm">{value}</span>}
        </td>
      ))}
    </tr>
  );
}
