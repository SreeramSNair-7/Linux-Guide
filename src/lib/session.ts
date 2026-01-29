import { NextRequest } from 'next/server';
import { prisma } from './prisma';

const SESSION_COOKIE_NAME = 'distro_session_id';

/**
 * Get or create a user session from cookies
 */
export async function getUserSession(request: NextRequest): Promise<string> {
  // Try to get session ID from cookie
  let sessionId = request.cookies.get(SESSION_COOKIE_NAME)?.value;

  if (sessionId) {
    // Verify session exists in database
    const user = await prisma.user.findUnique({
      where: { sessionId },
    });

    if (user) {
      return user.id;
    }
  }

  // Create new session
  sessionId = crypto.randomUUID();
  const user = await prisma.user.create({
    data: { sessionId },
  });

  return user.id;
}

/**
 * Generate session cookie header
 */
export function generateSessionCookie(sessionId: string): string {
  const maxAge = 365 * 24 * 60 * 60; // 1 year
  return `${SESSION_COOKIE_NAME}=${sessionId}; Path=/; HttpOnly; SameSite=Strict; Max-Age=${maxAge}`;
}

/**
 * Get session ID from user ID
 */
export async function getSessionId(userId: string): Promise<string | null> {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { sessionId: true },
  });

  return user?.sessionId || null;
}
