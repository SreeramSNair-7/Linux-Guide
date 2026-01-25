// file: src/components/distro-detail.tsx
'use client';

import Link from 'next/link';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { formatFileSize, formatDate } from '@/lib/utils';
import { InstallStepper } from '@/components/install-stepper';
import { DownloadList } from '@/components/download-list';
import type { Distro } from '@/types/distro.schema';
import {
  Calendar,
  HardDrive,
  Cpu,
  Package,
  Users,
  Shield,
  ExternalLink,
} from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

interface DistroDetailProps {
  distro: Distro;
}

export function DistroDetail({ distro }: DistroDetailProps) {
  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div>
        <div className="mb-2 flex items-center gap-2">
          <h1 className="text-4xl font-bold">{distro.name}</h1>
          {distro.popularity_rank && distro.popularity_rank <= 10 && (
            <Badge variant="default">Top 10</Badge>
          )}
        </div>
        <p className="text-lg text-muted-foreground">
          Version {distro.latest_version} {distro.codename && `(${distro.codename})`}
        </p>
      </div>

      {/* Quick Info Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="pb-3">
            <CardDescription className="flex items-center gap-2">
              <Package className="h-4 w-4" aria-hidden="true" />
              Family
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{distro.family}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardDescription className="flex items-center gap-2">
              <Calendar className="h-4 w-4" aria-hidden="true" />
              Released
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatDate(distro.release_date)}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardDescription className="flex items-center gap-2">
              <HardDrive className="h-4 w-4" aria-hidden="true" />
              Min RAM
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatFileSize(distro.min_ram_mb)}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardDescription className="flex items-center gap-2">
              <Cpu className="h-4 w-4" aria-hidden="true" />
              Package Manager
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{distro.package_manager}</div>
          </CardContent>
        </Card>
      </div>

      {/* Main Tabs */}
      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="install">Installation</TabsTrigger>
          <TabsTrigger value="download">Download</TabsTrigger>
          <TabsTrigger value="specs">Specifications</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>About</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="mb-2 font-semibold">Target Users</h3>
                <div className="flex flex-wrap gap-2">
                  {distro.target_users.map((user) => (
                    <Badge key={user} variant="secondary">
                      <Users className="mr-1 h-3 w-3" aria-hidden="true" />
                      {user}
                    </Badge>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="mb-2 font-semibold">Desktop Environments</h3>
                <div className="flex flex-wrap gap-2">
                  {distro.desktop_environments.map((de) => (
                    <Badge key={de} variant="outline">
                      {de}
                    </Badge>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="mb-2 font-semibold">Tags</h3>
                <div className="flex flex-wrap gap-2">
                  {distro.tags.map((tag) => (
                    <Badge key={tag} variant="outline">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>

              {distro.privacy_notes && (
                <div className="rounded-lg bg-muted p-4">
                  <h3 className="mb-2 flex items-center gap-2 font-semibold">
                    <Shield className="h-4 w-4" aria-hidden="true" />
                    Privacy
                  </h3>
                  <p className="text-sm text-muted-foreground">{distro.privacy_notes}</p>
                </div>
              )}

              <div>
                <h3 className="mb-2 font-semibold">License</h3>
                <p className="text-sm text-muted-foreground">{distro.license}</p>
              </div>

              {distro.notes && (
                <div className="rounded-lg border-l-4 border-primary bg-muted/50 p-4">
                  <p className="text-sm">{distro.notes}</p>
                </div>
              )}

              <Button asChild variant="outline" className="w-full">
                <Link href={distro.official_docs_url} target="_blank" rel="noopener noreferrer">
                  Official Documentation
                  <ExternalLink className="ml-2 h-4 w-4" aria-hidden="true" />
                </Link>
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Installation Tab */}
        <TabsContent value="install" className="space-y-4">
          {distro.install_guide_markdown && (
            <Card>
              <CardHeader>
                <CardTitle>Installation Guide</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="markdown-content">
                  <ReactMarkdown remarkPlugins={[remarkGfm]}>
                    {distro.install_guide_markdown}
                  </ReactMarkdown>
                </div>
              </CardContent>
            </Card>
          )}
          <InstallStepper steps={distro.install_steps} distroName={distro.name} />
        </TabsContent>

        {/* Download Tab */}
        <TabsContent value="download" className="space-y-4">
          <DownloadList isoFiles={distro.iso_files} distroName={distro.name} />
        </TabsContent>

        {/* Specifications Tab */}
        <TabsContent value="specs" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Technical Specifications</CardTitle>
            </CardHeader>
            <CardContent>
              <dl className="grid gap-4 sm:grid-cols-2">
                <SpecItem label="Kernel Version" value={distro.kernel} />
                <SpecItem label="Package Manager" value={distro.package_manager} />
                <SpecItem label="Minimum RAM" value={formatFileSize(distro.min_ram_mb)} />
                <SpecItem label="Minimum Storage" value={formatFileSize(distro.min_storage_mb)} />
                <SpecItem label="Family" value={distro.family} />
                <SpecItem label="Latest Version" value={distro.latest_version} />
                <SpecItem label="Release Date" value={formatDate(distro.release_date)} />
                {distro.codename && <SpecItem label="Codename" value={distro.codename} />}
                <SpecItem label="Last Verified" value={formatDate(distro.last_verified)} />
              </dl>

              {distro.maintainers && distro.maintainers.length > 0 && (
                <div className="mt-6">
                  <h3 className="mb-3 font-semibold">Maintainers</h3>
                  <div className="space-y-2">
                    {distro.maintainers.map((maintainer, idx) => (
                      <div key={idx} className="flex items-center justify-between">
                        <div>
                          <div className="font-medium">{maintainer.name}</div>
                          {maintainer.role && (
                            <div className="text-sm text-muted-foreground">{maintainer.role}</div>
                          )}
                        </div>
                        {maintainer.url && (
                          <Button asChild variant="ghost" size="sm">
                            <Link href={maintainer.url} target="_blank" rel="noopener noreferrer">
                              <ExternalLink className="h-4 w-4" />
                            </Link>
                          </Button>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

interface SpecItemProps {
  label: string;
  value: string;
}

function SpecItem({ label, value }: SpecItemProps) {
  return (
    <div>
      <dt className="text-sm font-medium text-muted-foreground">{label}</dt>
      <dd className="mt-1 text-sm font-semibold">{value}</dd>
    </div>
  );
}
