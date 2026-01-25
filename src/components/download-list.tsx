// file: src/components/download-list.tsx
'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { formatFileSize, copyToClipboard } from '@/lib/utils';
import { ChecksumVerifyModal } from '@/components/checksum-verify-modal';
import type { IsoFile } from '@/types/distro.schema';
import { Download, Shield, Copy, Check } from 'lucide-react';

interface DownloadListProps {
  isoFiles: IsoFile[];
  distroName: string;
}

export function DownloadList({ isoFiles, distroName }: DownloadListProps) {
  const [copiedChecksum, setCopiedChecksum] = useState<string | null>(null);
  const [selectedIso, setSelectedIso] = useState<IsoFile | null>(null);

  const handleCopyChecksum = async (checksum: string) => {
    const success = await copyToClipboard(checksum);
    if (success) {
      setCopiedChecksum(checksum);
      setTimeout(() => setCopiedChecksum(null), 2000);
    }
  };

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Download {distroName}</CardTitle>
          <CardDescription>
            Verify checksums before installation to ensure file integrity and security
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {isoFiles.map((iso) => (
            <div
              key={iso.id}
              className="rounded-lg border p-4 transition-shadow hover:shadow-md"
            >
              <div className="mb-3 flex items-start justify-between">
                <div>
                  <h3 className="font-semibold">{iso.filename}</h3>
                  <div className="mt-1 flex flex-wrap gap-2 text-sm text-muted-foreground">
                    <span>{formatFileSize(iso.size_mb)}</span>
                    <span>·</span>
                    <span className="uppercase">{iso.protocol}</span>
                    {iso.region && (
                      <>
                        <span>·</span>
                        <span>{iso.region}</span>
                      </>
                    )}
                  </div>
                </div>
                {iso.hosted && <Badge variant="secondary">Hosted</Badge>}
              </div>

              {/* Checksum Display */}
              <div className="mb-3 rounded-md bg-muted p-3">
                <div className="mb-1 flex items-center gap-2">
                  <Shield className="h-4 w-4 text-primary" aria-hidden="true" />
                  <span className="text-xs font-semibold uppercase text-muted-foreground">
                    SHA256 Checksum
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <code className="flex-1 overflow-x-auto text-xs">{iso.sha256}</code>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleCopyChecksum(iso.sha256)}
                    aria-label="Copy checksum"
                  >
                    {copiedChecksum === iso.sha256 ? (
                      <Check className="h-4 w-4 text-green-600" aria-hidden="true" />
                    ) : (
                      <Copy className="h-4 w-4" aria-hidden="true" />
                    )}
                  </Button>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap gap-2">
                <Button asChild className="flex-1">
                  <a
                    href={iso.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    download={iso.filename}
                  >
                    <Download className="mr-2 h-4 w-4" aria-hidden="true" />
                    Download ISO
                  </a>
                </Button>
                <Button variant="outline" onClick={() => setSelectedIso(iso)}>
                  <Shield className="mr-2 h-4 w-4" aria-hidden="true" />
                  Verify Checksum
                </Button>
              </div>
            </div>
          ))}

          {/* Safety Notice */}
          <div className="rounded-lg border-l-4 border-yellow-500 bg-yellow-50 p-4 dark:bg-yellow-950">
            <h4 className="mb-2 flex items-center gap-2 font-semibold">
              <Shield className="h-4 w-4" aria-hidden="true" />
              Important Security Notice
            </h4>
            <ul className="list-inside list-disc space-y-1 text-sm">
              <li>Always verify SHA256 checksums before installing</li>
              <li>Download only from official sources or trusted mirrors</li>
              <li>Backup your data before installing a new operating system</li>
              <li>Creating bootable media will erase the USB drive</li>
            </ul>
          </div>
        </CardContent>
      </Card>

      {selectedIso && (
        <ChecksumVerifyModal
          iso={selectedIso}
          isOpen={!!selectedIso}
          onClose={() => setSelectedIso(null)}
        />
      )}
    </>
  );
}
