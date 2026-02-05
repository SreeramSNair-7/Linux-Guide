// file: src/components/layout/header.tsx
'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { useTheme } from 'next-themes';
import { Moon, Sun, Menu, Heart, Info } from 'lucide-react';
import { useState } from 'react';

export function Header() {
  const { theme, setTheme } = useTheme();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-14 sm:h-16 items-center justify-between px-3 sm:px-4">
        <div className="flex items-center gap-3 sm:gap-6">
          <Link href="/" className="flex items-center space-x-2 hover:opacity-80 transition-opacity">
            <Image 
              src="/image.png" 
              alt="Linux Distro Catalog Logo" 
              width={56} 
              height={56}
              className="h-10 w-10 sm:h-14 sm:w-14"
            />
            <span className="hidden sm:inline text-base sm:text-xl font-bold">Linux Distro Catalog</span>
          </Link>

          <nav className="hidden items-center gap-3 lg:flex">
            <Link href="/about" className="flex items-center gap-1 text-xs sm:text-sm font-medium transition-all cursor-pointer hover:text-primary hover:scale-110">
              <Info className="h-4 w-4" />
              About
            </Link>
            <Link href="/distros" className="text-xs sm:text-sm font-medium transition-all cursor-pointer hover:text-primary hover:scale-110">
              Browse
            </Link>
            <Link href="/distros/quiz" className="text-xs sm:text-sm font-medium transition-all cursor-pointer hover:text-primary hover:scale-110">
              🎯 Quiz
            </Link>
            <Link href="/submit" className="text-xs sm:text-sm font-medium transition-all cursor-pointer hover:text-primary hover:scale-110">
              Submit
            </Link>
            <Link href="/favorites" className="flex items-center gap-1 text-xs sm:text-sm font-medium transition-all cursor-pointer hover:text-primary hover:scale-110">
              <Heart className="h-4 w-4" />
              Favorites
            </Link>
          </nav>
        </div>

        <div className="flex items-center gap-1 sm:gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            aria-label="Toggle theme"
            className="h-8 w-8 sm:h-10 sm:w-10"
          >
            <Sun className="h-4 w-4 sm:h-5 sm:w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
            <Moon className="absolute h-4 w-4 sm:h-5 sm:w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
          </Button>

          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden h-8 w-8 sm:h-10 sm:w-10"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle menu"
          >
            <Menu className="h-4 w-4 sm:h-5 sm:w-5" />
          </Button>
        </div>
      </div>

        {mobileMenuOpen && (
        <div className="border-t bg-background lg:hidden">
          <nav className="container mx-auto flex flex-col gap-3 p-3 sm:p-4">
            <Link href="/about" className="flex items-center gap-2 text-sm font-medium transition-all cursor-pointer hover:text-primary hover:translate-x-1" onClick={() => setMobileMenuOpen(false)}>
              <Info className="h-4 w-4" />
              About
            </Link>
            <Link href="/distros" className="text-sm font-medium transition-all cursor-pointer hover:text-primary hover:translate-x-1" onClick={() => setMobileMenuOpen(false)}>
              Browse
            </Link>
            <Link href="/distros/quiz" className="text-sm font-medium transition-all cursor-pointer hover:text-primary hover:translate-x-1" onClick={() => setMobileMenuOpen(false)}>
              🎯 Quiz
            </Link>
            <Link href="/submit" className="text-sm font-medium transition-all cursor-pointer hover:text-primary hover:translate-x-1" onClick={() => setMobileMenuOpen(false)}>
              Submit
            </Link>
            <Link href="/favorites" className="flex items-center gap-2 text-sm font-medium transition-all cursor-pointer hover:text-primary hover:translate-x-1" onClick={() => setMobileMenuOpen(false)}>
              <Heart className="h-4 w-4" />
              Favorites
            </Link>
          </nav>
        </div>
        )}
    </header>
  );
}
