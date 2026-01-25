import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export const metadata = {
  title: 'Find Your Linux Distro - Interactive Quiz',
  description: 'Take our interactive quiz to find the perfect Linux distribution for your needs',
};

export default function QuizPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mx-auto max-w-2xl">
        <h1 className="mb-4 text-4xl font-bold">Find Your Perfect Distro</h1>
        <p className="mb-8 text-lg text-muted-foreground">
          Answer a few questions and we&apos;ll recommend the best Linux distribution for your needs.
        </p>

        <Card>
          <CardHeader>
            <CardTitle>Interactive Quiz (Coming Soon)</CardTitle>
            <CardDescription>
              This feature is under development. In the meantime, you can browse all distributions
              or use our AI assistant for personalized recommendations.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">
              The quiz will ask about your:
            </p>
            <ul className="list-inside list-disc space-y-2 text-sm text-muted-foreground">
              <li>Experience level with Linux</li>
              <li>Hardware specifications</li>
              <li>Primary use case (desktop, server, development, etc.)</li>
              <li>Desktop environment preferences</li>
              <li>Software installation preferences</li>
            </ul>

            <div className="flex gap-4 pt-4">
              <Button asChild>
                <Link href="/distros">Browse All Distros</Link>
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
