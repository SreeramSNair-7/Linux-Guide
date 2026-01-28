'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle } from 'lucide-react';

interface SubmissionData {
  osName: string;
  submitterName: string;
  submitterEmail: string;
  submitterPhone: string;
  submitterMessage: string;
}

export default function SubmitForm() {
  const [submitted, setSubmitted] = useState(false);
  const [submissionData, setSubmissionData] = useState<SubmissionData | null>(null);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    osName: '',
    submitterName: '',
    submitterEmail: '',
    submitterPhone: '',
    submitterMessage: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch('/api/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setSubmissionData(formData);
        setSubmitted(true);
        setFormData({
          osName: '',
          submitterName: '',
          submitterEmail: '',
          submitterPhone: '',
          submitterMessage: '',
        });
      }
    } catch (error) {
      console.error('Submission failed:', error);
    } finally {
      setLoading(false);
    }
  };

  if (submitted && submissionData) {
    return (
      <div className="space-y-6">
        <div className="rounded-lg border border-green-200 bg-green-50 p-6 dark:border-green-900 dark:bg-green-950">
          <div className="flex items-center gap-4">
            <CheckCircle className="h-12 w-12 text-green-600" />
            <div>
              <h2 className="text-2xl font-bold text-green-900 dark:text-green-100">
                Thank You! ✨
              </h2>
              <p className="text-green-800 dark:text-green-200">
                Your submission has been received successfully.
              </p>
            </div>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Submission Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="rounded-lg bg-muted/50 p-4 space-y-3">
              <div>
                <p className="text-sm font-semibold text-muted-foreground">Operating System</p>
                <p className="text-lg font-bold">{submissionData.osName}</p>
              </div>

              <div className="border-t pt-3">
                <p className="text-sm font-semibold text-muted-foreground">Submitter Name</p>
                <p className="text-lg">{submissionData.submitterName}</p>
              </div>

              <div className="border-t pt-3">
                <p className="text-sm font-semibold text-muted-foreground">Email Address</p>
                <p className="text-lg">{submissionData.submitterEmail}</p>
              </div>

              <div className="border-t pt-3">
                <p className="text-sm font-semibold text-muted-foreground">Phone Number</p>
                <p className="text-lg">{submissionData.submitterPhone || 'Not provided'}</p>
              </div>

              {submissionData.submitterMessage && (
                <div className="border-t pt-3">
                  <p className="text-sm font-semibold text-muted-foreground">Message</p>
                  <p className="text-lg whitespace-pre-wrap">{submissionData.submitterMessage}</p>
                </div>
              )}
            </div>

            <div className="rounded-lg border-l-4 border-blue-500 bg-blue-50 p-4 dark:bg-blue-950">
              <p className="text-sm text-blue-900 dark:text-blue-100">
                <strong>What happens next?</strong> Our team will review your submission and may contact you at the provided email or phone number if we need more information about the distribution.
              </p>
            </div>

            <Button onClick={() => setSubmitted(false)} className="w-full">
              Submit Another Distribution
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label htmlFor="osName" className="block text-sm font-semibold mb-2">
          Operating System Name *
        </label>
        <Input
          id="osName"
          name="osName"
          type="text"
          placeholder="e.g., AlmaLinux, Void Linux, Elementary OS"
          value={formData.osName}
          onChange={handleChange}
          required
          className="h-10"
        />
      </div>

      <div>
        <label htmlFor="submitterName" className="block text-sm font-semibold mb-2">
          Your Full Name *
        </label>
        <Input
          id="submitterName"
          name="submitterName"
          type="text"
          placeholder="John Doe"
          value={formData.submitterName}
          onChange={handleChange}
          required
          className="h-10"
        />
      </div>

      <div>
        <label htmlFor="submitterEmail" className="block text-sm font-semibold mb-2">
          Email Address *
        </label>
        <Input
          id="submitterEmail"
          name="submitterEmail"
          type="email"
          placeholder="john@example.com"
          value={formData.submitterEmail}
          onChange={handleChange}
          required
          className="h-10"
        />
      </div>

      <div>
        <label htmlFor="submitterPhone" className="block text-sm font-semibold mb-2">
          Phone Number (Optional)
        </label>
        <Input
          id="submitterPhone"
          name="submitterPhone"
          type="tel"
          placeholder="+1 (555) 123-4567"
          value={formData.submitterPhone}
          onChange={handleChange}
          className="h-10"
        />
      </div>

      <div>
        <label htmlFor="submitterMessage" className="block text-sm font-semibold mb-2">
          Additional Information (Optional)
        </label>
        <textarea
          id="submitterMessage"
          name="submitterMessage"
          placeholder="Why should this distribution be added? Any special features or details?"
          value={formData.submitterMessage}
          onChange={handleChange}
          className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 min-h-24"
        />
      </div>

      <Button type="submit" disabled={loading} size="lg" className="w-full">
        {loading ? 'Submitting...' : 'Submit Distribution'}
      </Button>

      <p className="text-xs text-muted-foreground text-center">
        * Required fields. We&apos;ll review your submission and get back to you within 48 hours.
      </p>
    </form>
  );
}
