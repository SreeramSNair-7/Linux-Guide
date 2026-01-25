// file: src/app/layout.tsx
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { ThemeProvider } from '@/components/theme-provider';
import { Toaster } from '@/components/ui/toaster';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: {
    default: 'Linux Distro Catalog - Find Your Perfect Linux Distribution',
    template: '%s | Linux Distro Catalog',
  },
  description:
    'Comprehensive catalog of Linux distributions with AI-powered recommendations, installation guides, ISO downloads, and checksum verification.',
  keywords: [
    'Linux',
    'distributions',
    'Ubuntu',
    'Debian',
    'Arch',
    'Fedora',
    'distro',
    'open source',
    'operating system',
  ],
  authors: [{ name: 'Linux Distro Catalog Team' }],
  creator: 'Linux Distro Catalog',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: process.env.NEXT_PUBLIC_SITE_URL,
    title: 'Linux Distro Catalog',
    description: 'Find and compare Linux distributions with AI-powered recommendations',
    siteName: 'Linux Distro Catalog',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Linux Distro Catalog',
    description: 'Find and compare Linux distributions with AI-powered recommendations',
  },
  manifest: '/manifest.json',
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          <div className="flex min-h-screen flex-col">
            <Header />
            <main className="flex-1">{children}</main>
            <Footer />
          </div>
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
