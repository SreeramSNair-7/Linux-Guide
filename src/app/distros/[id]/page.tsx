// file: src/app/distros/[id]/page.tsx
import { notFound } from 'next/navigation';
import { loadDistro, loadAllDistros } from '@/lib/distro-loader';
import { DistroDetail } from '@/components/distro-detail';
import { ChatWidget } from '@/components/chat-widget';
import type { Metadata } from 'next';

export const revalidate = 3600; // Revalidate every hour

interface DistroPageProps {
  params: {
    id: string;
  };
}

export async function generateStaticParams() {
  const distros = await loadAllDistros();
  return distros.map((distro) => ({
    id: distro.id,
  }));
}

export async function generateMetadata({ params }: DistroPageProps): Promise<Metadata> {
  const distro = await loadDistro(params.id);

  if (!distro) {
    return {
      title: 'Distribution Not Found',
    };
  }

  return {
    title: `${distro.name} - ${distro.latest_version}`,
    description: `Download and install ${distro.name}. ${distro.family}-based distribution for ${distro.target_users.join(', ')} users. Includes verified ISO checksums and installation guide.`,
    keywords: [distro.name, distro.family, ...distro.tags],
    openGraph: {
      title: `${distro.name} - ${distro.latest_version}`,
      description: `${distro.family}-based Linux distribution`,
      type: 'article',
      publishedTime: distro.release_date,
    },
  };
}

export default async function DistroPage({ params }: DistroPageProps) {
  const distro = await loadDistro(params.id);

  if (!distro) {
    notFound();
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <DistroDetail distro={distro} />
      
      {/* AI Chat Widget - fixed bottom-right */}
      <ChatWidget distro={distro} />
    </div>
  );
}
