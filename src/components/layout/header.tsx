// file: src/components/layout/header.tsx
'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { useTheme } from 'next-themes';
import { Moon, Sun, Menu, Heart, Info } from 'lucide-react';
import { useState } from 'react';

export function Header() {
  const { theme, setTheme } = useTheme();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <div className="flex items-center gap-6">
          <Link href="/" className="flex items-center space-x-2">
            <span className="text-xl font-bold">Linux Distro Catalog</span>
          </Link>

          <nav className="hidden items-center gap-6 md:flex">
            <Link href="/about" className="flex items-center gap-2 text-sm font-medium transition-colors hover:text-primary">
              <Info className="h-4 w-4" />
              About
            </Link>
            <Link href="/distros" className="text-sm font-medium transition-colors hover:text-primary">
              Browse
            </Link>
            <Link href="/distros/quiz" className="text-sm font-medium transition-colors hover:text-primary">
              🎯 Quiz
            </Link>
            <Link href="/submit" className="text-sm font-medium transition-colors hover:text-primary">
              Submit
            </Link>
            <Link href="/favorites" className="flex items-center gap-2 text-sm font-medium transition-colors hover:text-primary">
              <Heart className="h-4 w-4" />
              Favorites
            </Link>
          </nav>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            aria-label="Toggle theme"
          >
            <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
            <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
          </Button>

          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle menu"
          >
            <Menu className="h-5 w-5" />
          </Button>
        </div>
      </div>

        <div className="border-t bg-background md:hidden">
          <nav className="container mx-auto flex flex-col gap-4 p-4">
            <Link href="/about" className="flex items-center gap-2 text-sm font-medium" onClick={() => setMobileMenuOpen(false)}>
              <Info className="h-4 w-4" />
              About
            </Link>
            <Link href="/distros" className="text-sm font-medium" onClick={() => setMobileMenuOpen(false)}>
              Browse
            </Link>
            <Link href="/distros/quiz" className="text-sm font-medium" onClick={() => setMobileMenuOpen(false)}>
              🎯 Quiz
            </Link>
            <Link href="/submit" className="text-sm font-medium" onClick={() => setMobileMenuOpen(false)}>
              Submit
            </Link>
            <Link href="/favorites" className="flex items-center gap-2 text-sm font-medium" onClick={() => setMobileMenuOpen(false)}>
              <Heart className="h-4 w-4" />
              Favorites
            </Link>
          </nav>
        </div>
    </header>
  );
}
