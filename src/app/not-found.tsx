import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function NotFound() {
  return (
    <div className="relative isolate min-h-screen overflow-hidden bg-gradient-to-br from-slate-950 via-slate-900 to-slate-800 text-slate-50">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -left-24 top-10 h-72 w-72 rounded-full bg-emerald-500/25 blur-3xl" />
        <div className="absolute right-0 top-32 h-80 w-80 rounded-full bg-cyan-500/20 blur-3xl" />
        <div className="absolute bottom-0 left-1/2 h-64 w-64 -translate-x-1/2 rounded-full bg-purple-500/15 blur-3xl" />
      </div>

      <div className="container relative z-10 mx-auto flex min-h-screen flex-col items-center justify-center px-4 py-16">
        <div className="max-w-xl rounded-3xl border border-white/10 bg-white/5 p-10 text-center backdrop-blur-xl shadow-2xl shadow-emerald-500/10">
          <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.15em] text-emerald-100">
            <span className="h-2 w-2 rounded-full bg-emerald-400" /> Missing Page
          </div>
          <h1 className="mb-2 text-6xl font-black leading-tight text-white">404</h1>
          <h2 className="mb-4 text-2xl font-semibold text-emerald-50">Page Not Found</h2>
          <p className="mb-8 text-base text-slate-200/80">
            The page you&apos;re looking for doesn&apos;t exist or was moved. Let&apos;s get you back to the distro catalog.
          </p>
          <div className="flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Button asChild size="lg" className="shadow-lg shadow-emerald-500/25">
              <Link href="/">Back to Home</Link>
            </Button>
            <Button variant="ghost" asChild size="lg" className="text-slate-100 hover:bg-white/10">
              <Link href="/distros">Browse Distros</Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
