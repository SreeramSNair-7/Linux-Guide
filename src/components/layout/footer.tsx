// file: src/components/layout/footer.tsx
import Link from 'next/link';
import { Github, Twitter } from 'lucide-react';

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="grid gap-8 md:grid-cols-4">
          {/* About */}
          <div>
            <h3 className="mb-3 font-semibold">About</h3>
            <p className="text-sm text-muted-foreground">
              Comprehensive catalog of Linux distributions with verified ISOs, installation guides, and
              AI-powered recommendations.
            </p>
          </div>

          {/* Resources */}
          <div>
            <h3 className="mb-3 font-semibold">Resources</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/distros" className="text-muted-foreground hover:text-primary">
                  Browse Distros
                </Link>
              </li>
              <li>
                <Link href="/distros/compare" className="text-muted-foreground hover:text-primary">
                  Compare
                </Link>
              </li>
              <li>
                <Link href="/quiz" className="text-muted-foreground hover:text-primary">
                  Take Quiz
                </Link>
              </li>
              <li>
                <Link href="/submit" className="text-muted-foreground hover:text-primary">
                  Submit Distro
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="mb-3 font-semibold">Legal</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/privacy" className="text-muted-foreground hover:text-primary">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="text-muted-foreground hover:text-primary">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link href="/license" className="text-muted-foreground hover:text-primary">
                  License
                </Link>
              </li>
            </ul>
          </div>

          {/* Social */}
          <div>
            <h3 className="mb-3 font-semibold">Connect</h3>
            <div className="flex gap-4">
              <a
                href="https://github.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-primary"
                aria-label="GitHub"
              >
                <Github className="h-5 w-5" />
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-primary"
                aria-label="Twitter"
              >
                <Twitter className="h-5 w-5" />
              </a>
            </div>
          </div>
        </div>

        <div className="mt-8 border-t pt-8 text-center text-sm text-muted-foreground">
          <p>
            © {currentYear} Linux Distro Catalog. Open source project. Not affiliated with any Linux
            distribution.
          </p>
        </div>
      </div>
    </footer>
  );
}
