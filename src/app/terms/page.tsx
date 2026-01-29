// file: src/app/terms/page.tsx
export const metadata = {
  title: 'Terms of Service - Linux Distro Catalog',
  description: 'Terms of service for the Linux Distro Catalog website.',
};

export default function TermsPage() {
  return (
    <main className="container mx-auto px-4 py-12">
      <div className="mx-auto max-w-3xl space-y-8">
        <header className="space-y-2">
          <h1 className="text-3xl font-bold">Terms of Service</h1>
          <p className="text-muted-foreground">
            By using this site, you agree to the terms below.
          </p>
        </header>

        <section className="space-y-3">
          <h2 className="text-xl font-semibold">Use of Content</h2>
          <p className="text-sm text-muted-foreground">
            Content is provided for informational purposes. Verify details with official distro
            documentation before making system changes.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-semibold">User Submissions</h2>
          <p className="text-sm text-muted-foreground">
            If you submit content, you grant permission to display it on the site. Do not submit
            sensitive data.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-semibold">AI Assistance</h2>
          <p className="text-sm text-muted-foreground">
            AI outputs may be inaccurate. Always review steps and commands before executing them.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-semibold">Disclaimer</h2>
          <p className="text-sm text-muted-foreground">
            The site is provided “as is” without warranties. You are responsible for any actions
            taken based on the information provided.
          </p>
        </section>
      </div>
    </main>
  );
}
