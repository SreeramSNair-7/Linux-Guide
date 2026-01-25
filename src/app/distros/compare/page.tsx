import { loadAllDistros } from '@/lib/distro-loader';
import { DistroComparator } from '@/components/distro-comparator';

export const metadata = {
  title: 'Compare Linux Distros - Find Your Perfect Match',
  description: 'Compare two Linux distributions side-by-side to find the best one for your needs',
};

export default async function ComparePage() {
  const distros = await loadAllDistros();

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="mb-2 text-4xl font-bold">Compare Linux Distros</h1>
        <p className="text-lg text-muted-foreground">
          Select two distros below to compare their features, performance, and specifications
        </p>
      </div>

      <DistroComparator distros={distros} />
    </div>
  );
}
