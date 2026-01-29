// file: src/components/distro-detail.tsx
'use client';

import { useEffect, useState } from 'react';
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
  Heart,
  Star,
} from 'lucide-react';
import {
  addReview,
  getReviews,
  isFavorite,
  loadFavorites,
  subscribePreferences,
  toggleFavorite,
  type ReviewEntry,
} from '@/lib/user-preferences';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

interface DistroDetailProps {
  distro: Distro;
}

export function DistroDetail({ distro }: DistroDetailProps) {
  const [favorite, setFavorite] = useState(false);
  const [reviews, setReviews] = useState<ReviewEntry[]>([]);
  const [rating, setRating] = useState<{ average: number; count: number }>({ average: 0, count: 0 });
  const [reviewRating, setReviewRating] = useState(0);
  const [reviewTitle, setReviewTitle] = useState('');
  const [reviewBody, setReviewBody] = useState('');
  const [reviewName, setReviewName] = useState('');
  const [isFavLoading, setIsFavLoading] = useState(false);
  const [isReviewLoading, setIsReviewLoading] = useState(false);

  useEffect(() => {
    const refresh = async () => {
      await loadFavorites();
      setFavorite(isFavorite(distro.id));
      const { reviews: reviewList, summary } = await getReviews(distro.id);
      setReviews(reviewList);
      setRating({ average: summary.averageRating, count: summary.totalReviews });
    };
    refresh();
    const unsubscribe = subscribePreferences(refresh);
    return () => unsubscribe();
  }, [distro.id]);

  const handleToggleFavorite = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    try {
      setIsFavLoading(true);
      const newState = await toggleFavorite(distro.id);
      setFavorite(newState);
    } catch (error) {
      console.error('Failed to toggle favorite:', error);
      // Revert optimistic update on error
      setFavorite(!favorite);
    } finally {
      setIsFavLoading(false);
    }
  };

  const handleSubmitReview = async () => {
    if (!reviewRating || reviewBody.trim().length < 10) return;
    try {
      setIsReviewLoading(true);
      await addReview({
        distroId: distro.id,
        rating: reviewRating,
        title: reviewTitle.trim() || 'Review',
        body: reviewBody.trim(),
        userName: reviewName.trim() || 'Anonymous',
      });
      setReviewRating(0);
      setReviewTitle('');
      setReviewBody('');
      setReviewName('');
    } catch (error) {
      console.error('Failed to submit review:', error);
      alert('Failed to submit review. Please try again.');
    } finally {
      setIsReviewLoading(false);
    }
  };

  const renderStars = (value: number) => {
    const rounded = Math.round(value);
    return Array.from({ length: 5 }).map((_, idx) => (
      <Star
        key={idx}
        className={`h-4 w-4 ${idx < rounded ? 'text-yellow-500' : 'text-muted-foreground'}`}
        fill={idx < rounded ? 'currentColor' : 'none'}
      />
    ));
  };

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div>
        <div className="mb-2 flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <h1 className="text-4xl font-bold">{distro.name}</h1>
            {distro.popularity_rank && distro.popularity_rank <= 10 && (
              <Badge variant="default">Top 10</Badge>
            )}
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={handleToggleFavorite}
            disabled={isFavLoading}
            aria-label={favorite ? 'Remove from favorites' : 'Add to favorites'}
          >
            <Heart
              className={`mr-2 h-4 w-4 transition-colors ${favorite ? 'text-red-500' : 'text-muted-foreground'}`}
              fill={favorite ? 'currentColor' : 'none'}
            />
            {isFavLoading ? 'Loading...' : favorite ? 'Saved' : 'Save'}
          </Button>
        </div>
        <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
          <span>
            Version {distro.latest_version} {distro.codename && `(${distro.codename})`}
          </span>
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1">{renderStars(rating.average)}</div>
            <span>{rating.count > 0 ? rating.average.toFixed(1) : 'No ratings'} ({rating.count})</span>
          </div>
        </div>
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
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="install">Installation</TabsTrigger>
          <TabsTrigger value="download">Download</TabsTrigger>
          <TabsTrigger value="specs">Specifications</TabsTrigger>
          <TabsTrigger value="reviews">Reviews</TabsTrigger>
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

        {/* Reviews Tab */}
        <TabsContent value="reviews" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Ratings & Reviews</CardTitle>
              <CardDescription>
                {rating.count > 0 ? `${rating.count} review(s) with an average of ${rating.average.toFixed(1)}.` : 'Be the first to review this distro.'}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <div className="flex items-center gap-1">{renderStars(rating.average)}</div>
                <span>{rating.count > 0 ? rating.average.toFixed(1) : 'No ratings'} ({rating.count})</span>
              </div>

              <div className="space-y-3 rounded-lg border p-4">
                <div className="text-sm font-semibold">Write a review</div>
                <div className="flex items-center gap-2">
                  {Array.from({ length: 5 }).map((_, idx) => (
                    <button
                      key={idx}
                      type="button"
                      className="p-1"
                      onClick={() => setReviewRating(idx + 1)}
                      aria-label={`Rate ${idx + 1} stars`}
                    >
                      <Star
                        className={`h-5 w-5 ${idx < reviewRating ? 'text-yellow-500' : 'text-muted-foreground'}`}
                        fill={idx < reviewRating ? 'currentColor' : 'none'}
                      />
                    </button>
                  ))}
                </div>
                <input
                  value={reviewTitle}
                  onChange={(event) => setReviewTitle(event.target.value)}
                  placeholder="Review title"
                  className="w-full rounded-md border bg-background px-3 py-2 text-sm"
                />
                <textarea
                  value={reviewBody}
                  onChange={(event) => setReviewBody(event.target.value)}
                  placeholder="Share your experience (min 10 characters)"
                  className="min-h-[120px] w-full rounded-md border bg-background px-3 py-2 text-sm"
                />
                <input
                  value={reviewName}
                  onChange={(event) => setReviewName(event.target.value)}
                  placeholder="Your name (optional)"
                  className="w-full rounded-md border bg-background px-3 py-2 text-sm"
                />
                <Button onClick={handleSubmitReview} disabled={!reviewRating || reviewBody.trim().length < 10 || isReviewLoading}>
                  {isReviewLoading ? 'Submitting...' : 'Submit Review'}
                </Button>
              </div>

              <div className="space-y-4">
                {reviews.length === 0 && (
                  <p className="text-sm text-muted-foreground">No reviews yet.</p>
                )}
                {reviews.map((review) => (
                  <div key={review.id} className="rounded-lg border p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-semibold">{review.title}</div>
                        <div className="text-xs text-muted-foreground">by {review.userName} · {new Date(review.createdAt).toLocaleDateString()}</div>
                      </div>
                      <div className="flex items-center gap-1">{renderStars(review.rating)}</div>
                    </div>
                    <p className="mt-3 text-sm text-muted-foreground">{review.body}</p>
                  </div>
                ))}
              </div>
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
