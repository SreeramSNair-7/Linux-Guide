import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getUserSession, getSessionId } from '@/lib/session';

// GET /api/compare-history - Get compare history
export async function GET(request: NextRequest) {
  try {
    const userId = await getUserSession(request);
    
    const history = await prisma.compareHistory.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      take: 10, // Last 10 comparisons
    });

    const sessionId = await getSessionId(userId);
    const response = NextResponse.json({
      history: history.map(h => ({
        distro1Id: h.distro1Id,
        distro2Id: h.distro2Id,
        timestamp: h.createdAt.toISOString(),
      })),
    });

    if (sessionId) {
      response.headers.set('Set-Cookie', `distro_session_id=${sessionId}; Path=/; HttpOnly; SameSite=Strict; Max-Age=${365 * 24 * 60 * 60}`);
    }

    return response;
  } catch (error) {
    console.error('Error fetching compare history:', error);
    return NextResponse.json(
      { error: 'Failed to fetch compare history' },
      { status: 500 }
    );
  }
}

// POST /api/compare-history - Add to compare history
export async function POST(request: NextRequest) {
  try {
    const userId = await getUserSession(request);
    const { distro1Id, distro2Id } = await request.json();

    if (!distro1Id || !distro2Id || typeof distro1Id !== 'string' || typeof distro2Id !== 'string') {
      return NextResponse.json(
        { error: 'Invalid distro IDs' },
        { status: 400 }
      );
    }

    // Add to history
    await prisma.compareHistory.create({
      data: {
        userId,
        distro1Id,
        distro2Id,
      },
    });

    const sessionId = await getSessionId(userId);
    const response = NextResponse.json({ success: true });

    if (sessionId) {
      response.headers.set('Set-Cookie', `distro_session_id=${sessionId}; Path=/; HttpOnly; SameSite=Strict; Max-Age=${365 * 24 * 60 * 60}`);
    }

    return response;
  } catch (error) {
    console.error('Error adding to compare history:', error);
    return NextResponse.json(
      { error: 'Failed to add to compare history' },
      { status: 500 }
    );
  }
}

// DELETE /api/compare-history - Clear compare history
export async function DELETE(request: NextRequest) {
  try {
    const userId = await getUserSession(request);
    
    await prisma.compareHistory.deleteMany({
      where: { userId },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error clearing compare history:', error);
    return NextResponse.json(
      { error: 'Failed to clear compare history' },
      { status: 500 }
    );
  }
}
