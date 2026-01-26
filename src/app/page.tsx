// file: src/app/page.tsx
'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { DistroCard } from '@/components/distro-card';
import { OnboardingTour } from '@/components/onboarding-tour';
import { ContextualHelp } from '@/components/contextual-help';
import { Search, Zap, Shield, TrendingUp } from 'lucide-react';
import type { Distro } from '@/types/distro.schema';

export default function HomePage() {
  const [recommended, setRecommended] = useState<Distro[]>([]);
  const [allDistros, setAllDistros] = useState<Distro[]>([]);
  const [isFirstVisit, setIsFirstVisit] = useState(false);
  const [chatRef, setChatRef] = useState<HTMLDivElement | null>(null);

  useEffect(() => {
    // Check if user has visited before
    const hasVisited = localStorage.getItem('tour-completed');
    setIsFirstVisit(!hasVisited);

    // Load distros
    const loadDistros = async () => {
      try {
        const response = await fetch('/api/distros');
        const data = await response.json();
        setAllDistros(data);
        // Get first 4 as recommended
        setRecommended(data.slice(0, 4));
      } catch (error) {
        console.error('Failed to load distros:', error);
      }
    };

    loadDistros();
  }, []);

  const handleOpenChat = () => {
    // Find and click the chat widget button
    const chatButton = document.querySelector('[aria-label="Open AI assistant"]') as HTMLButtonElement;
    if (chatButton) {
      chatButton.click();
    }
  };

  return (
    <>
      <OnboardingTour 
        isFirstVisit={isFirstVisit} 
        onClose={() => localStorage.setItem('tour-completed', 'true')}
      />
      <div className="container mx-auto px-4 py-8">
        {/* Hero Section */}
        <section className="mb-16 text-center">
          <h1 className="mb-4 text-5xl font-bold tracking-tight sm:text-6xl">
            Find Your Perfect
            <span className="block text-primary">Linux Distribution</span>
          </h1>
          <p className="mx-auto mb-8 max-w-2xl text-lg text-muted-foreground">
            Explore {allDistros.length}+ Linux distributions with detailed guides, verified ISO
            downloads, and AI-powered recommendations tailored to your needs.
          </p>
          <div className="flex flex-col gap-4 sm:flex-row sm:justify-center">
            <Button asChild size="lg" id="browse-button">
              <Link href="/distros">Browse All Distros</Link>
            </Button>
            <Button asChild variant="outline" size="lg" id="quiz-button">
              <Link href="/quiz">Take the Quiz</Link>
            </Button>
          </div>
          <div className="mt-4 flex justify-center">
            <ContextualHelp pageType="home" onOpenChat={handleOpenChat} />
          </div>
        </section>

        {/* Features Grid */}
        <section className="mb-16">
          <h2 className="mb-8 text-center text-3xl font-bold">Why Use Our Catalog?</h2>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4" id="search-area">
            <Card>
              <CardHeader>
                <Search className="mb-2 h-8 w-8 text-primary" aria-hidden="true" />
                <CardTitle>Advanced Search</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Filter by family, desktop environment, system requirements, and more with
                  lightning-fast MeiliSearch.
                </CardDescription>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <Shield className="mb-2 h-8 w-8 text-primary" aria-hidden="true" />
                <CardTitle>Verified Checksums</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Every ISO includes SHA256 checksums verified against official sources with
                  platform-specific verification commands.
                </CardDescription>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <Zap className="mb-2 h-8 w-8 text-primary" aria-hidden="true" />
                <CardTitle>AI Assistant</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Get personalized recommendations and installation help powered by Ollama running
                  locally—no data leaves your device.
                </CardDescription>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <TrendingUp className="mb-2 h-8 w-8 text-primary" aria-hidden="true" />
                <CardTitle>Compare & Decide</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Side-by-side comparison of up to 4 distributions to help you make an informed
                  choice.
                </CardDescription>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Recommended Distros */}
        <section className="mb-16">
          <div className="mb-8 flex items-center justify-between">
            <h2 className="text-3xl font-bold">Recommended for Beginners</h2>
            <Button asChild variant="outline">
              <Link href="/distros">View All</Link>
            </Button>
          </div>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {recommended.map((distro) => (
              <DistroCard key={distro.id} distro={distro} />
            ))}
          </div>
        </section>

        {/* CTA Section */}
        <section className="rounded-lg bg-primary px-8 py-12 text-center text-primary-foreground">
          <h2 className="mb-4 text-3xl font-bold">Ready to Switch to Linux?</h2>
          <p className="mx-auto mb-6 max-w-2xl text-lg opacity-90">
            Take our interactive quiz to find the distribution that matches your experience level,
            hardware, and use case.
          </p>
          <Button asChild size="lg" variant="secondary">
            <Link href="/quiz">Start Quiz</Link>
          </Button>
        </section>
      </div>
    </>
  );
}
