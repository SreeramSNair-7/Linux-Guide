import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

// GET /api/compare-history - Get compare history (stub)
export async function GET(_request: NextRequest) {
  return NextResponse.json({ history: [] });
}

// POST /api/compare-history - Add to compare history (stub)
export async function POST(_request: NextRequest) {
  return NextResponse.json({ success: true });
}

// DELETE /api/compare-history - Clear compare history (stub)
export async function DELETE(_request: NextRequest) {
  return NextResponse.json({ success: true });
}
