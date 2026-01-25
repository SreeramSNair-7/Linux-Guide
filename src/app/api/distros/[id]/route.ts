// file: src/app/api/distros/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { loadDistro } from '@/lib/distro-loader';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const distro = await loadDistro(params.id);

    if (!distro) {
      return NextResponse.json(
        { error: 'Distribution not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(distro);
  } catch (error) {
    console.error('Error loading distro:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
