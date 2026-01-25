'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import type { Distro } from '@/types/distro.schema';
import { CheckCircle } from 'lucide-react';

interface DistroComparatorProps {
  distros: Distro[];
}

export function DistroComparator({ distros }: DistroComparatorProps) {
  const [selected, setSelected] = useState<[Distro | null, Distro | null]>([null, null]);

  const selectDistro = (index: 0 | 1, distro: Distro) => {
    setSelected((prev) => {
      const newSelected = [...prev] as [Distro | null, Distro | null];
      newSelected[index] = distro;
      return newSelected;
    });
  };

  const clearSelection = (index: 0 | 1) => {
    setSelected((prev) => {
      const newSelected = [...prev] as [Distro | null, Distro | null];
      newSelected[index] = null;
      return newSelected;
    });
  };

  const getAdvantage = (
    label: string,
    val1: number | undefined,
    val2: number | undefined
  ): 'first' | 'second' | 'equal' | null => {
    if (!val1 || !val2) return null;
    if (['Minimum RAM', 'Minimum Storage', 'ISO Size'].includes(label)) {
      if (val1 < val2) return 'first';
      if (val2 < val1) return 'second';
      return 'equal';
    }
    return null;
  };

  const selectedDistros = [selected[0], selected[1]].filter(
    (d): d is Distro => d !== null
  );

  return (
    <div className="space-y-8">
      <div className="grid gap-6 md:grid-cols-2">
        {([0, 1] as const).map((index) => (
          <Card key={index} className="relative">
            <CardHeader>
              <CardTitle className="text-lg">
                {index === 0 ? 'First Distro' : 'Second Distro'}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {selected[index] ? (
                <div className="space-y-3">
                  <div className="flex items-center justify-between rounded-lg border p-3">
                    <div>
                      <div className="font-semibold">{selected[index].name}</div>
                      <div className="text-sm text-muted-foreground">
                        v{selected[index].latest_version}
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => clearSelection(index)}
                    >
                      Change
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground">Select a distribution</p>
                </div>
              )}

              {!selected[index] && (
                <div className="space-y-2 max-h-64 overflow-y-auto">
                  {distros.map((distro) => (
                    <button
                      key={distro.id}
                      onClick={() => selectDistro(index, distro)}
                      className="w-full text-left rounded-lg border p-2 hover:bg-accent transition-colors"
                    >
                      <div className="font-medium text-sm">{distro.name}</div>
                      <div className="text-xs text-muted-foreground">
                        {distro.family} · v{distro.latest_version}
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {selectedDistros.length === 2 && selected[0] && selected[1] && (
        <div className="space-y-6">
          <h2 className="text-2xl font-bold">Detailed Comparison</h2>

          <div className="grid gap-4 md:grid-cols-2">
            {[selected[0], selected[1]].map((distro) => (
              <Card key={distro.id} className="border-green-200 bg-green-50 dark:border-green-900 dark:bg-green-950">
                <CardHeader>
                  <CardTitle className="text-lg">{distro.name}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="font-semibold text-sm text-green-900 dark:text-green-100">
                      Key Benefits:
                    </div>
                    <ul className="space-y-1 text-sm">
                      {distro.target_users.slice(0, 3).map((user) => (
                        <li key={user} className="flex items-center gap-2">
                          <CheckCircle className="h-4 w-4 text-green-600 dark:text-green-400" />
                          <span>{user}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="overflow-x-auto rounded-lg border">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b bg-muted/50">
                  <th className="p-3 text-left font-semibold">Feature</th>
                  <th className="p-3 text-left font-semibold">{selected[0].name}</th>
                  <th className="p-3 text-left font-semibold">{selected[1].name}</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b bg-blue-50/30 dark:bg-blue-950/20">
                  <td colSpan={3} className="p-3 font-semibold text-blue-900 dark:text-blue-100">
                    User Experience
                  </td>
                </tr>
                <tr className="border-b">
                  <td className="p-3 font-medium">Family</td>
                  <td className="p-3">
                    <Badge variant="outline">{selected[0].family}</Badge>
                  </td>
                  <td className="p-3">
                    <Badge variant="outline">{selected[1].family}</Badge>
                  </td>
                </tr>
                <tr className="border-b">
                  <td className="p-3 font-medium">Desktop Environments</td>
                  <td className="p-3 text-sm">{selected[0].desktop_environments.join(', ')}</td>
                  <td className="p-3 text-sm">{selected[1].desktop_environments.join(', ')}</td>
                </tr>

                <tr className="border-b bg-purple-50/30 dark:bg-purple-950/20">
                  <td colSpan={3} className="p-3 font-semibold text-purple-900 dark:text-purple-100">
                    Performance & Resources
                  </td>
                </tr>
                <tr
                  className={`border-b ${
                    getAdvantage('Minimum RAM', selected[0].min_ram_mb, selected[1].min_ram_mb) === 'first'
                      ? 'bg-green-100/30 dark:bg-green-900/20'
                      : getAdvantage('Minimum RAM', selected[0].min_ram_mb, selected[1].min_ram_mb) === 'second'
                        ? 'bg-red-100/30 dark:bg-red-900/20'
                        : ''
                  }`}
                >
                  <td className="p-3 font-medium">Minimum RAM</td>
                  <td className="p-3 text-sm">{selected[0].min_ram_mb} MB</td>
                  <td className="p-3 text-sm">{selected[1].min_ram_mb} MB</td>
                </tr>
                <tr
                  className={`border-b ${
                    getAdvantage('Minimum Storage', selected[0].min_storage_mb, selected[1].min_storage_mb) ===
                    'first'
                      ? 'bg-green-100/30 dark:bg-green-900/20'
                      : getAdvantage('Minimum Storage', selected[0].min_storage_mb, selected[1].min_storage_mb) ===
                          'second'
                        ? 'bg-red-100/30 dark:bg-red-900/20'
                        : ''
                  }`}
                >
                  <td className="p-3 font-medium">Minimum Storage</td>
                  <td className="p-3 text-sm">{selected[0].min_storage_mb} MB</td>
                  <td className="p-3 text-sm">{selected[1].min_storage_mb} MB</td>
                </tr>
                <tr
                  className={`border-b ${
                    getAdvantage('ISO Size', selected[0].iso_files[0]?.size_mb, selected[1].iso_files[0]?.size_mb) ===
                    'first'
                      ? 'bg-green-100/30 dark:bg-green-900/20'
                      : getAdvantage('ISO Size', selected[0].iso_files[0]?.size_mb, selected[1].iso_files[0]?.size_mb) ===
                          'second'
                        ? 'bg-red-100/30 dark:bg-red-900/20'
                        : ''
                  }`}
                >
                  <td className="p-3 font-medium">ISO Size</td>
                  <td className="p-3 text-sm">{selected[0].iso_files[0]?.size_mb.toLocaleString()} MB</td>
                  <td className="p-3 text-sm">{selected[1].iso_files[0]?.size_mb.toLocaleString()} MB</td>
                </tr>

                <tr className="border-b bg-orange-50/30 dark:bg-orange-950/20">
                  <td colSpan={3} className="p-3 font-semibold text-orange-900 dark:text-orange-100">
                    Installation & Compatibility
                  </td>
                </tr>
                <tr className="border-b">
                  <td className="p-3 font-medium">Package Manager</td>
                  <td className="p-3 text-sm">{selected[0].package_manager}</td>
                  <td className="p-3 text-sm">{selected[1].package_manager}</td>
                </tr>
                <tr className="border-b">
                  <td className="p-3 font-medium">Kernel</td>
                  <td className="p-3 text-sm">{selected[0].kernel}</td>
                  <td className="p-3 text-sm">{selected[1].kernel}</td>
                </tr>

                <tr className="border-b bg-slate-50/30 dark:bg-slate-900/20">
                  <td colSpan={3} className="p-3 font-semibold text-slate-900 dark:text-slate-100">
                    Metadata
                  </td>
                </tr>
                <tr className="border-b">
                  <td className="p-3 font-medium">Version</td>
                  <td className="p-3 text-sm">{selected[0].latest_version}</td>
                  <td className="p-3 text-sm">{selected[1].latest_version}</td>
                </tr>
                <tr className="border-b">
                  <td className="p-3 font-medium">License</td>
                  <td className="p-3 text-sm">{selected[0].license}</td>
                  <td className="p-3 text-sm">{selected[1].license}</td>
                </tr>
              </tbody>
            </table>
          </div>

          <Card className="border-yellow-200 bg-yellow-50 dark:border-yellow-900 dark:bg-yellow-950">
            <CardHeader>
              <CardTitle className="text-lg">Recommendation Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <p>
                <strong>{selected[0].name}</strong> is ideal for: {selected[0].target_users.slice(0, 2).join(', ')}
              </p>
              <p>
                <strong>{selected[1].name}</strong> is ideal for: {selected[1].target_users.slice(0, 2).join(', ')}
              </p>
              <p className="text-muted-foreground">
                Choose based on your hardware constraints (RAM/Storage), preferred package manager, and desktop
                environment needs.
              </p>
            </CardContent>
          </Card>
        </div>
      )}

      {selectedDistros.length < 2 && (
        <Card className="border-dashed">
          <CardContent className="pt-6 text-center">
            <p className="text-muted-foreground">Select two distributions above to see a detailed comparison</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
