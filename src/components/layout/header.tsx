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

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      {/* Desktop/Tablet Header */}
      <div className="container mx-auto flex h-14 sm:h-16 items-center justify-between px-3 sm:px-4">
        <div className="flex items-center gap-3 sm:gap-6 flex-1">
          <Link href="/" className="flex items-center space-x-2 hover:opacity-80 transition-opacity flex-shrink-0">
            <Image 
              src="/image.png" 
              alt="Linux Distro Catalog Logo" 
              width={56} 
              height={56}
              className="h-10 w-10 sm:h-14 sm:w-14"
            />
            <span className="hidden sm:inline text-base sm:text-xl font-bold">Linux Distro Catalog</span>
          </Link>

          <nav className="hidden md:flex items-center gap-2 lg:gap-4 flex-wrap">
            <Link href="/about" className="flex items-center gap-1 text-xs lg:text-sm font-medium transition-all cursor-pointer hover:text-primary hover:scale-110 whitespace-nowrap">
              <Info className="h-4 w-4" />
              About
            </Link>
            <Link href="/distros" className="text-xs lg:text-sm font-medium transition-all cursor-pointer hover:text-primary hover:scale-110 whitespace-nowrap">
              Browse
            </Link>
            <Link href="/distros/quiz" className="text-xs lg:text-sm font-medium transition-all cursor-pointer hover:text-primary hover:scale-110 whitespace-nowrap">
              🎯 Quiz
            </Link>
            <Link href="/submit" className="text-xs lg:text-sm font-medium transition-all cursor-pointer hover:text-primary hover:scale-110 whitespace-nowrap">
              Submit
            </Link>
            <Link href="/favorites" className="flex items-center gap-1 text-xs lg:text-sm font-medium transition-all cursor-pointer hover:text-primary hover:scale-110 whitespace-nowrap">
              <Heart className="h-4 w-4" />
              Favorites
            </Link>
          </nav>
        </div>

        <div className="flex items-center gap-1 sm:gap-2 flex-shrink-0">
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
        </div>
      </div>

      {/* Mobile Navigation - Always visible */}
      <nav className="md:hidden border-t bg-background">
        <div className="container mx-auto flex flex-wrap gap-2 p-2 sm:p-3">
          <Link href="/about" className="flex items-center gap-1 text-xs font-medium transition-all cursor-pointer hover:text-primary px-2 py-1 rounded hover:bg-accent">
            <Info className="h-3 w-3" />
            About
          </Link>
          <Link href="/distros" className="text-xs font-medium transition-all cursor-pointer hover:text-primary px-2 py-1 rounded hover:bg-accent">
            Browse
          </Link>
          <Link href="/distros/quiz" className="text-xs font-medium transition-all cursor-pointer hover:text-primary px-2 py-1 rounded hover:bg-accent">
            🎯 Quiz
          </Link>
          <Link href="/submit" className="text-xs font-medium transition-all cursor-pointer hover:text-primary px-2 py-1 rounded hover:bg-accent">
            Submit
          </Link>
          <Link href="/favorites" className="flex items-center gap-1 text-xs font-medium transition-all cursor-pointer hover:text-primary px-2 py-1 rounded hover:bg-accent">
            <Heart className="h-3 w-3" />
            Favorites
          </Link>
        </div>
      </nav>
    </header>
  );
}
