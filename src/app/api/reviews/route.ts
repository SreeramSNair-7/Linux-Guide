import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

// GET /api/reviews?distroId=ubuntu - Get reviews for a distro (stub)
export async function GET(_request: NextRequest) {
  return NextResponse.json({ reviews: [] });
}

// POST /api/reviews - Create a review (stub)
export async function POST(_request: NextRequest) {
  return NextResponse.json({ id: 'new-review-id', success: true });
}

// PUT /api/reviews/:id - Update a review (stub)
export async function PUT(_request: NextRequest) {
  return NextResponse.json({ success: true });
}

// DELETE /api/reviews/:id - Delete a review (stub)
export async function DELETE(_request: NextRequest) {
  return NextResponse.json({ success: true });
}
