'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Mail, Phone, MapPin, Send } from 'lucide-react';
import Link from 'next/link';

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus('idle');

    try {
      // Here you would typically send the form data to an API endpoint
      // For now, we'll simulate sending it
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Store contact message in localStorage for demo purposes
      const messages = JSON.parse(localStorage.getItem('contact-messages') || '[]');
      messages.push({
        ...formData,
        timestamp: new Date().toISOString(),
      });
      localStorage.setItem('contact-messages', JSON.stringify(messages));

      setSubmitStatus('success');
      setFormData({ name: '', email: '', subject: '', message: '' });

      // Reset success message after 3 seconds
      setTimeout(() => setSubmitStatus('idle'), 3000);
    } catch (error) {
      console.error('Failed to submit form:', error);
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container mx-auto px-3 sm:px-4 py-6 sm:py-12">
      {/* Hero Section */}
      <section className="mb-8 sm:mb-12 text-center">
        <h1 className="mb-3 sm:mb-4 text-3xl sm:text-5xl font-bold">Get in Touch</h1>
        <p className="mx-auto max-w-2xl text-base sm:text-lg text-muted-foreground">
          Have questions or feedback about our Linux distribution catalog? We'd love to hear from you!
        </p>
      </section>

      <div className="grid gap-6 sm:gap-8 grid-cols-1 lg:grid-cols-3 mb-8 sm:mb-12">
        {/* Contact Info Cards */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-3 mb-2">
              <Mail className="h-5 w-5 sm:h-6 sm:w-6 text-primary" />
              <CardTitle className="text-lg sm:text-xl">Email</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <CardDescription className="text-sm sm:text-base">
              <a href="mailto:info@linuxdistrocatalog.com" className="hover:text-primary transition-colors">
                info@linuxdistrocatalog.com
              </a>
            </CardDescription>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center gap-3 mb-2">
              <Phone className="h-5 w-5 sm:h-6 sm:w-6 text-primary" />
              <CardTitle className="text-lg sm:text-xl">Support</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <CardDescription className="text-sm sm:text-base">
              Available 24/7 for questions and technical support
            </CardDescription>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center gap-3 mb-2">
              <MapPin className="h-5 w-5 sm:h-6 sm:w-6 text-primary" />
              <CardTitle className="text-lg sm:text-xl">Community</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <CardDescription className="text-sm sm:text-base">
              Join our growing community of Linux enthusiasts
            </CardDescription>
          </CardContent>
        </Card>
      </div>

      {/* Contact Form */}
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle className="text-2xl sm:text-3xl">Send us a Message</CardTitle>
          <CardDescription>
            Fill out the form below and we'll get back to you as soon as possible.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
            {/* Name Field */}
            <div>
              <label htmlFor="name" className="block text-sm font-medium mb-2">
                Name
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                placeholder="Your name"
                className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-input rounded-md bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-sm sm:text-base"
              />
            </div>

            {/* Email Field */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium mb-2">
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                placeholder="your.email@example.com"
                className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-input rounded-md bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-sm sm:text-base"
              />
            </div>

            {/* Subject Field */}
            <div>
              <label htmlFor="subject" className="block text-sm font-medium mb-2">
                Subject
              </label>
              <input
                type="text"
                id="subject"
                name="subject"
                value={formData.subject}
                onChange={handleChange}
                required
                placeholder="What is this about?"
                className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-input rounded-md bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-sm sm:text-base"
              />
            </div>

            {/* Message Field */}
            <div>
              <label htmlFor="message" className="block text-sm font-medium mb-2">
                Message
              </label>
              <textarea
                id="message"
                name="message"
                value={formData.message}
                onChange={handleChange}
                required
                placeholder="Tell us more..."
                rows={5}
                className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-input rounded-md bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-sm sm:text-base resize-none"
              />
            </div>

            {/* Status Messages */}
            {submitStatus === 'success' && (
              <div className="p-3 sm:p-4 rounded-md bg-green-50 dark:bg-green-900/20 text-green-800 dark:text-green-200 text-sm sm:text-base">
                ✓ Thank you! Your message has been sent successfully. We'll get back to you soon!
              </div>
            )}

            {submitStatus === 'error' && (
              <div className="p-3 sm:p-4 rounded-md bg-red-50 dark:bg-red-900/20 text-red-800 dark:text-red-200 text-sm sm:text-base">
                ✗ Something went wrong. Please try again later.
              </div>
            )}

            {/* Submit Button */}
            <Button
              type="submit"
              disabled={isSubmitting}
              className="w-full h-10 sm:h-11 text-sm sm:text-base cursor-pointer"
            >
              <Send className="mr-2 h-4 w-4" />
              {isSubmitting ? 'Sending...' : 'Send Message'}
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* FAQ Section */}
      <section className="mt-12 sm:mt-16">
        <h2 className="text-2xl sm:text-3xl font-bold mb-6 sm:mb-8 text-center">Frequently Asked Questions</h2>
        <div className="grid gap-4 sm:gap-6 max-w-3xl mx-auto">
          <Card>
            <CardHeader>
              <CardTitle className="text-base sm:text-lg">How can I submit a new Linux distribution?</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm sm:text-base text-muted-foreground">
                Visit our <Link href="/submit" className="text-primary hover:underline">Submit page</Link> to add a new distribution to our catalog. We review all submissions carefully.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base sm:text-lg">What should I do if I found an error?</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm sm:text-base text-muted-foreground">
                Please use the contact form above to report any errors or inaccuracies. Include the distro name and specific details about the issue.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base sm:text-lg">How often is the catalog updated?</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm sm:text-base text-muted-foreground">
                We update the catalog regularly as new distributions are released and information is updated. Check back often for the latest additions!
              </p>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
}
