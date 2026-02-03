// file: src/app/about/page.tsx

import Link from 'next/link';
import { ArrowRight, ShieldCheck, Sparkles, Search, Heart, Scale } from 'lucide-react';

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-background to-muted/20">
      <div className="container mx-auto px-4 py-12">
        <div className="mb-12">
          <div className="inline-flex items-center gap-2 rounded-full border bg-gradient-to-r from-primary/10 via-primary/5 to-background px-3 py-1 text-xs font-semibold uppercase tracking-wide text-primary">
            <Sparkles className="h-3.5 w-3.5" />
            Discover • Compare • Learn
          </div>
          <h1 className="mt-4 text-4xl font-extrabold tracking-tight md:text-5xl">
            <span className="bg-gradient-to-r from-primary via-purple-500 to-pink-500 bg-clip-text text-transparent">
              About Linux Distro Catalog
            </span>
          </h1>
          <p className="mt-4 max-w-3xl text-lg text-muted-foreground">
            Linux Distro Catalog is a curated hub to explore, compare, and understand Linux distributions.
            It helps newcomers choose the right distro, while giving experienced users quick access to specs,
            installers, and verified download guidance.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <div className="rounded-2xl border bg-background p-6 shadow-sm">
            <div className="flex items-center gap-2 text-sm font-semibold text-primary">
              <Search className="h-4 w-4" />
              <span className="bg-gradient-to-r from-primary to-purple-500 bg-clip-text text-transparent">
                What it does
              </span>
            </div>
            <ul className="mt-4 space-y-3 text-sm text-muted-foreground">
              <li>• Search 58+ distributions with filters by family, desktop, and requirements.</li>
              <li>• Compare distros side-by-side to find the best fit for your hardware and goals.</li>
              <li>• Access installation steps, ISO downloads, and checksum verification.</li>
              <li>• Save favorites locally and return to them anytime.</li>
            </ul>
          </div>

          <div className="rounded-2xl border bg-background p-6 shadow-sm">
            <div className="flex items-center gap-2 text-sm font-semibold text-primary">
              <ShieldCheck className="h-4 w-4" />
              <span className="bg-gradient-to-r from-primary to-emerald-500 bg-clip-text text-transparent">
                Why it’s trustworthy
              </span>
            </div>
            <ul className="mt-4 space-y-3 text-sm text-muted-foreground">
              <li>• Verified checksums for secure downloads.</li>
              <li>• Clear, step-by-step install guidance.</li>
              <li>• Privacy-first: no PII sent to the AI assistant.</li>
              <li>• Works as a modern PWA with dark mode support.</li>
            </ul>
          </div>
        </div>

        <div className="mt-10 grid gap-6 md:grid-cols-3">
          <div className="rounded-2xl border bg-background p-6 shadow-sm">
            <div className="flex items-center gap-2 text-sm font-semibold text-primary">
              <Sparkles className="h-4 w-4" />
              <span className="bg-gradient-to-r from-primary to-pink-500 bg-clip-text text-transparent">
                AI Assistant
              </span>
            </div>
            <p className="mt-3 text-sm text-muted-foreground">
              Ask distro-specific questions and get installation help. The system uses a free cloud model
              (Hugging Face) and can fall back to local Ollama if configured.
            </p>
          </div>
          <div className="rounded-2xl border bg-background p-6 shadow-sm">
            <div className="flex items-center gap-2 text-sm font-semibold text-primary">
              <Scale className="h-4 w-4" />
              <span className="bg-gradient-to-r from-primary to-blue-500 bg-clip-text text-transparent">
                Compare Tool
              </span>
            </div>
            <p className="mt-3 text-sm text-muted-foreground">
              Compare up to four distros at a glance—requirements, desktop environments, and package managers.
            </p>
          </div>
          <div className="rounded-2xl border bg-background p-6 shadow-sm">
            <div className="flex items-center gap-2 text-sm font-semibold text-primary">
              <Heart className="h-4 w-4" />
              <span className="bg-gradient-to-r from-primary to-red-500 bg-clip-text text-transparent">
                Favorites
              </span>
            </div>
            <p className="mt-3 text-sm text-muted-foreground">
              Save your top picks with localStorage and build a shortlist you can revisit anytime.
            </p>
          </div>
        </div>

        <div className="mt-12 rounded-2xl border bg-gradient-to-r from-primary/10 via-purple-500/10 to-pink-500/10 p-6">
          <div className="flex flex-col items-start gap-3 md:flex-row md:items-center md:justify-between">
            <div>
              <h2 className="text-xl font-semibold">
                <span className="bg-gradient-to-r from-primary via-purple-500 to-pink-500 bg-clip-text text-transparent">
                  Ready to explore?
                </span>
              </h2>
              <p className="mt-1 text-sm text-muted-foreground">
                Browse distros, take the quiz, or compare options to find your perfect Linux setup.
              </p>
            </div>
            <Link
              href="/distros"
              className="inline-flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition hover:bg-primary/90"
            >
              Start browsing
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
