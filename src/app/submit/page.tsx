import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import SubmitForm from '@/components/submit-form';

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
            <CardTitle>Distribution Submission Form</CardTitle>
            <CardDescription>
              Fill in the details below to suggest a new Linux distribution for our catalog.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <SubmitForm />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
