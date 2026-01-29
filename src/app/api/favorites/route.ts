import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getUserSession, getSessionId } from '@/lib/session';

// GET /api/favorites - Get all favorites for current user
export async function GET(request: NextRequest) {
  try {
    const userId = await getUserSession(request);
    
    const favorites = await prisma.favorite.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });

    const distroIds = favorites.map(f => f.distroId);
    const sessionId = await getSessionId(userId);

    const response = NextResponse.json({ distroIds });
    
    if (sessionId) {
      response.headers.set('Set-Cookie', `distro_session_id=${sessionId}; Path=/; HttpOnly; SameSite=Strict; Max-Age=${365 * 24 * 60 * 60}`);
    }

    return response;
  } catch (error) {
    console.error('Error fetching favorites:', error);
    return NextResponse.json(
      { error: 'Failed to fetch favorites' },
      { status: 500 }
    );
  }
}

// POST /api/favorites - Toggle favorite
export async function POST(request: NextRequest) {
  try {
    const userId = await getUserSession(request);
    const { distroId } = await request.json();

    if (!distroId || typeof distroId !== 'string') {
      return NextResponse.json(
        { error: 'Invalid distro ID' },
        { status: 400 }
      );
    }

    // Check if already favorited
    const existing = await prisma.favorite.findUnique({
      where: {
        userId_distroId: {
          userId,
          distroId,
        },
      },
    });

    if (existing) {
      // Remove favorite
      await prisma.favorite.delete({
        where: { id: existing.id },
      });
      
      const sessionId = await getSessionId(userId);
      const response = NextResponse.json({ isFavorite: false });
      
      if (sessionId) {
        response.headers.set('Set-Cookie', `distro_session_id=${sessionId}; Path=/; HttpOnly; SameSite=Strict; Max-Age=${365 * 24 * 60 * 60}`);
      }
      
      return response;
    } else {
      // Add favorite
      await prisma.favorite.create({
        data: {
          userId,
          distroId,
        },
      });
      
      const sessionId = await getSessionId(userId);
      const response = NextResponse.json({ isFavorite: true });
      
      if (sessionId) {
        response.headers.set('Set-Cookie', `distro_session_id=${sessionId}; Path=/; HttpOnly; SameSite=Strict; Max-Age=${365 * 24 * 60 * 60}`);
      }
      
      return response;
    }
  } catch (error) {
    console.error('Error toggling favorite:', error);
    return NextResponse.json(
      { error: 'Failed to toggle favorite' },
      { status: 500 }
    );
  }
}

// DELETE /api/favorites - Clear all favorites
export async function DELETE(request: NextRequest) {
  try {
    const userId = await getUserSession(request);
    
    await prisma.favorite.deleteMany({
      where: { userId },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error clearing favorites:', error);
    return NextResponse.json(
      { error: 'Failed to clear favorites' },
      { status: 500 }
    );
  }
}
