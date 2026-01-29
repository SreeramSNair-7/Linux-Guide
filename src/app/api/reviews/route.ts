import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getUserSession, getSessionId } from '@/lib/session';

// GET /api/reviews?distroId=ubuntu - Get reviews for a distro
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const distroId = searchParams.get('distroId');

    if (!distroId) {
      return NextResponse.json(
        { error: 'distroId parameter required' },
        { status: 400 }
      );
    }

    const reviews = await prisma.review.findMany({
      where: { distroId },
      orderBy: { createdAt: 'desc' },
    });

    // Calculate rating summary
    const totalReviews = reviews.length;
    const averageRating = totalReviews > 0
      ? reviews.reduce((sum, r) => sum + r.rating, 0) / totalReviews
      : 0;

    const ratingCounts = {
      5: reviews.filter(r => r.rating === 5).length,
      4: reviews.filter(r => r.rating === 4).length,
      3: reviews.filter(r => r.rating === 3).length,
      2: reviews.filter(r => r.rating === 2).length,
      1: reviews.filter(r => r.rating === 1).length,
    };

    return NextResponse.json({
      reviews: reviews.map(r => ({
        id: r.id,
        rating: r.rating,
        title: r.title,
        body: r.body,
        userName: r.userName,
        createdAt: r.createdAt.toISOString(),
        updatedAt: r.updatedAt.toISOString(),
      })),
      summary: {
        totalReviews,
        averageRating,
        ratingCounts,
      },
    });
  } catch (error) {
    console.error('Error fetching reviews:', error);
    return NextResponse.json(
      { error: 'Failed to fetch reviews' },
      { status: 500 }
    );
  }
}

// POST /api/reviews - Add or update a review
export async function POST(request: NextRequest) {
  try {
    const userId = await getUserSession(request);
    const { distroId, rating, title, body, userName } = await request.json();

    // Validation
    if (!distroId || typeof distroId !== 'string') {
      return NextResponse.json(
        { error: 'Invalid distro ID' },
        { status: 400 }
      );
    }

    if (!rating || rating < 1 || rating > 5) {
      return NextResponse.json(
        { error: 'Rating must be between 1 and 5' },
        { status: 400 }
      );
    }

    if (!title || title.trim().length === 0) {
      return NextResponse.json(
        { error: 'Title is required' },
        { status: 400 }
      );
    }

    if (!body || body.trim().length === 0) {
      return NextResponse.json(
        { error: 'Review body is required' },
        { status: 400 }
      );
    }

    if (!userName || userName.trim().length === 0) {
      return NextResponse.json(
        { error: 'Name is required' },
        { status: 400 }
      );
    }

    // Check if user already reviewed this distro
    const existing = await prisma.review.findUnique({
      where: {
        userId_distroId: {
          userId,
          distroId,
        },
      },
    });

    let review;
    if (existing) {
      // Update existing review
      review = await prisma.review.update({
        where: { id: existing.id },
        data: {
          rating,
          title: title.trim(),
          body: body.trim(),
          userName: userName.trim(),
        },
      });
    } else {
      // Create new review
      review = await prisma.review.create({
        data: {
          userId,
          distroId,
          rating,
          title: title.trim(),
          body: body.trim(),
          userName: userName.trim(),
        },
      });
    }

    const sessionId = await getSessionId(userId);
    const response = NextResponse.json({
      review: {
        id: review.id,
        rating: review.rating,
        title: review.title,
        body: review.body,
        userName: review.userName,
        createdAt: review.createdAt.toISOString(),
        updatedAt: review.updatedAt.toISOString(),
      },
    });

    if (sessionId) {
      response.headers.set('Set-Cookie', `distro_session_id=${sessionId}; Path=/; HttpOnly; SameSite=Strict; Max-Age=${365 * 24 * 60 * 60}`);
    }

    return response;
  } catch (error) {
    console.error('Error saving review:', error);
    return NextResponse.json(
      { error: 'Failed to save review' },
      { status: 500 }
    );
  }
}
