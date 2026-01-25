// file: src/app/api/distros/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { loadAllDistros, filterDistros } from '@/lib/distro-loader';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const family = searchParams.get('family') || undefined;
    const targetUser = searchParams.get('target') || undefined;
    const tags = searchParams.get('tags')?.split(',') || undefined;

    let distros;
    if (family || targetUser || tags) {
      distros = await filterDistros({ family, targetUser, tags });
    } else {
      distros = await loadAllDistros();
    }

    return NextResponse.json(distros);
  } catch (error) {
    console.error('Error loading distros:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
