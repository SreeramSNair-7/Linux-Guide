# file: src/app/submit/page.tsx
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export const metadata = {
  title: 'Submit a Linux Distribution',
  description: 'Submit a new Linux distribution to our catalog',
};

export default function SubmitPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mx-auto max-w-2xl">
        <h1 className="mb-4 text-4xl font-bold">Submit a Distribution</h1>
        <p className="mb-8 text-lg text-muted-foreground">
          Help us grow our catalog by submitting a Linux distribution.
        </p>

        <Card>
          <CardHeader>
            <CardTitle>Submission Form (Coming Soon)</CardTitle>
            <CardDescription>
              This feature is under development. For now, you can contribute via GitHub.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">
              To submit a distribution:
            </p>
            <ol className="list-inside list-decimal space-y-2 text-sm text-muted-foreground">
              <li>Fork our GitHub repository</li>
              <li>Create a JSON file in <code className="rounded bg-muted px-1">data/distros/</code></li>
              <li>Follow the schema in our README</li>
              <li>Submit a pull request</li>
            </ol>

            <div className="rounded-lg border-l-4 border-primary bg-muted/50 p-4">
              <h3 className="mb-2 font-semibold">Requirements</h3>
              <ul className="list-inside list-disc space-y-1 text-sm">
                <li>Valid JSON following our schema</li>
                <li>Verified SHA256 checksums from official sources</li>
                <li>Active download links</li>
                <li>Complete installation steps</li>
              </ul>
            </div>

            <div className="flex gap-4 pt-4">
              <Button asChild>
                <a href="https://github.com" target="_blank" rel="noopener noreferrer">
                  View on GitHub
                </a>
              </Button>
              <Button asChild variant="outline">
                <Link href="/">Back to Home</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
