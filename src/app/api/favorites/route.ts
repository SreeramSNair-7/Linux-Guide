import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

// GET /api/favorites - Get all favorites for current user (stub)
export async function GET(_request: NextRequest) {
  return NextResponse.json({ distroIds: [] });
}

// POST /api/favorites - Toggle favorite (stub)
export async function POST(_request: NextRequest) {
  return NextResponse.json({ isFavorite: false });
}

// DELETE /api/favorites - Clear all favorites (stub)
export async function DELETE(_request: NextRequest) {
  return NextResponse.json({ success: true });
}
