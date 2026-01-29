// file: src/app/privacy/page.tsx
export const metadata = {
  title: 'Privacy Policy - Linux Distro Catalog',
  description: 'Privacy policy for the Linux Distro Catalog website.',
};

export default function PrivacyPage() {
  return (
    <main className="container mx-auto px-4 py-12">
      <div className="mx-auto max-w-3xl space-y-8">
        <header className="space-y-2">
          <h1 className="text-3xl font-bold">Privacy Policy</h1>
          <p className="text-muted-foreground">
            We respect your privacy. This page explains what data we collect and how we use it.
          </p>
        </header>

        <section className="space-y-3">
          <h2 className="text-xl font-semibold">Data We Collect</h2>
          <ul className="list-disc space-y-2 pl-6 text-sm text-muted-foreground">
            <li>Basic analytics (page views, device type, and referrers).</li>
            <li>Optional form submissions (e.g., distro submissions).</li>
            <li>Chat requests sent to configured AI providers.</li>
          </ul>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-semibold">How We Use Data</h2>
          <p className="text-sm text-muted-foreground">
            We use collected data to improve site performance, fix issues, and provide requested
            features. We do not sell your data.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-semibold">AI Requests</h2>
          <p className="text-sm text-muted-foreground">
            AI queries are sent to the provider you configured (e.g., Hugging Face or Ollama).
            Do not submit sensitive information.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-semibold">Contact</h2>
          <p className="text-sm text-muted-foreground">
            If you have questions about privacy, contact the project maintainer.
          </p>
        </section>
      </div>
    </main>
  );
}
