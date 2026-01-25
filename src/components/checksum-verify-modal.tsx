// file: src/components/checksum-verify-modal.tsx
'use client';

import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { getChecksumCommand, copyToClipboard } from '@/lib/utils';
import type { IsoFile } from '@/types/distro.schema';
import { Copy, Check, Terminal } from 'lucide-react';

interface ChecksumVerifyModalProps {
  iso: IsoFile;
  isOpen: boolean;
  onClose: () => void;
}

export function ChecksumVerifyModal({ iso, isOpen, onClose }: ChecksumVerifyModalProps) {
  const [copiedCommand, setCopiedCommand] = useState<string | null>(null);

  const handleCopyCommand = async (platform: string, command: string) => {
    const success = await copyToClipboard(command);
    if (success) {
      setCopiedCommand(platform);
      setTimeout(() => setCopiedCommand(null), 2000);
    }
  };

  const windowsCmd = getChecksumCommand('windows', iso.filename);
  const linuxCmd = getChecksumCommand('linux', iso.filename);
  const macosCmd = getChecksumCommand('macos', iso.filename);

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Verify ISO Checksum</DialogTitle>
          <DialogDescription>
            Verify the integrity and authenticity of {iso.filename}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Expected Checksum */}
          <div className="rounded-lg bg-muted p-4">
            <div className="mb-2 text-sm font-semibold">Expected SHA256 Checksum:</div>
            <code className="block overflow-x-auto text-xs">{iso.sha256}</code>
          </div>

          {/* Platform-Specific Commands */}
          <Tabs defaultValue="windows" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="windows">Windows</TabsTrigger>
              <TabsTrigger value="linux">Linux</TabsTrigger>
              <TabsTrigger value="macos">macOS</TabsTrigger>
            </TabsList>

            {/* Windows PowerShell */}
            <TabsContent value="windows" className="space-y-3">
              <div>
                <div className="mb-2 flex items-center gap-2">
                  <Terminal className="h-4 w-4" aria-hidden="true" />
                  <span className="text-sm font-semibold">PowerShell Command</span>
                </div>
                <div className="rounded-lg border bg-muted p-3">
                  <code className="block overflow-x-auto text-sm">{windowsCmd}</code>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="mt-2"
                    onClick={() => handleCopyCommand('windows', windowsCmd)}
                  >
                    {copiedCommand === 'windows' ? (
                      <>
                        <Check className="mr-2 h-4 w-4" aria-hidden="true" />
                        Copied
                      </>
                    ) : (
                      <>
                        <Copy className="mr-2 h-4 w-4" aria-hidden="true" />
                        Copy Command
                      </>
                    )}
                  </Button>
                </div>
              </div>
              <div className="text-sm text-muted-foreground">
                <p className="mb-2 font-medium">Instructions:</p>
                <ol className="list-inside list-decimal space-y-1">
                  <li>Open PowerShell (right-click Start → Windows PowerShell)</li>
                  <li>Navigate to the folder containing the ISO file</li>
                  <li>Run the command above</li>
                  <li>Compare the output hash with the expected checksum</li>
                </ol>
              </div>
            </TabsContent>

            {/* Linux */}
            <TabsContent value="linux" className="space-y-3">
              <div>
                <div className="mb-2 flex items-center gap-2">
                  <Terminal className="h-4 w-4" aria-hidden="true" />
                  <span className="text-sm font-semibold">Terminal Command</span>
                </div>
                <div className="rounded-lg border bg-muted p-3">
                  <code className="block overflow-x-auto text-sm">{linuxCmd}</code>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="mt-2"
                    onClick={() => handleCopyCommand('linux', linuxCmd)}
                  >
                    {copiedCommand === 'linux' ? (
                      <>
                        <Check className="mr-2 h-4 w-4" aria-hidden="true" />
                        Copied
                      </>
                    ) : (
                      <>
                        <Copy className="mr-2 h-4 w-4" aria-hidden="true" />
                        Copy Command
                      </>
                    )}
                  </Button>
                </div>
              </div>
              <div className="text-sm text-muted-foreground">
                <p className="mb-2 font-medium">Instructions:</p>
                <ol className="list-inside list-decimal space-y-1">
                  <li>Open your terminal</li>
                  <li>Navigate to the download directory</li>
                  <li>Run the command above</li>
                  <li>Verify the output matches the expected checksum</li>
                </ol>
              </div>
            </TabsContent>

            {/* macOS */}
            <TabsContent value="macos" className="space-y-3">
              <div>
                <div className="mb-2 flex items-center gap-2">
                  <Terminal className="h-4 w-4" aria-hidden="true" />
                  <span className="text-sm font-semibold">Terminal Command</span>
                </div>
                <div className="rounded-lg border bg-muted p-3">
                  <code className="block overflow-x-auto text-sm">{macosCmd}</code>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="mt-2"
                    onClick={() => handleCopyCommand('macos', macosCmd)}
                  >
                    {copiedCommand === 'macos' ? (
                      <>
                        <Check className="mr-2 h-4 w-4" aria-hidden="true" />
                        Copied
                      </>
                    ) : (
                      <>
                        <Copy className="mr-2 h-4 w-4" aria-hidden="true" />
                        Copy Command
                      </>
                    )}
                  </Button>
                </div>
              </div>
              <div className="text-sm text-muted-foreground">
                <p className="mb-2 font-medium">Instructions:</p>
                <ol className="list-inside list-decimal space-y-1">
                  <li>Open Terminal application</li>
                  <li>Navigate to the Downloads folder</li>
                  <li>Run the command above</li>
                  <li>Compare the hash with the expected checksum</li>
                </ol>
              </div>
            </TabsContent>
          </Tabs>

          {/* Warning */}
          <div className="rounded-lg border-l-4 border-red-500 bg-red-50 p-4 dark:bg-red-950">
            <p className="text-sm font-semibold">⚠️ Security Warning</p>
            <p className="mt-1 text-sm">
              If the checksum does NOT match, do not use the ISO file. Delete it and download again
              from the official source.
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
