// file: src/app/license/page.tsx
export const metadata = {
  title: 'License - Linux Distro Catalog',
  description: 'License information for the Linux Distro Catalog project.',
};

export default function LicensePage() {
  return (
    <main className="container mx-auto px-4 py-12">
      <div className="mx-auto max-w-3xl space-y-8">
        <header className="space-y-2">
          <h1 className="text-3xl font-bold">License</h1>
          <p className="text-muted-foreground">
            This project is open source. Review the license terms below.
          </p>
        </header>

        <section className="space-y-3">
          <h2 className="text-xl font-semibold">Open Source License</h2>
          <p className="text-sm text-muted-foreground">
            The Linux Distro Catalog is distributed under an open source license. See the repository
            for the full license text.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-semibold">Third-Party Content</h2>
          <p className="text-sm text-muted-foreground">
            Distribution names, logos, and trademarks belong to their respective owners.
          </p>
        </section>
      </div>
    </main>
  );
}
