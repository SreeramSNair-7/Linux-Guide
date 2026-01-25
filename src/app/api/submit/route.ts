// file: src/app/api/submit/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { DistroSubmissionSchema } from '@/types/distro.schema';
import { rateLimit } from '@/lib/rate-limit';
import fs from 'fs/promises';
import path from 'path';

const SUBMISSIONS_DIR = path.join(process.cwd(), 'data', 'submissions');

export async function POST(request: NextRequest) {
  try {
    // Rate limiting
    const identifier = request.ip || 'anonymous';
    const { success } = await rateLimit(identifier);
    if (!success) {
      return NextResponse.json({ error: 'Too many requests' }, { status: 429 });
    }

    // Parse and validate submission
    const body = await request.json();
    const validated = DistroSubmissionSchema.parse(body);

    // Ensure submissions directory exists
    await fs.mkdir(SUBMISSIONS_DIR, { recursive: true });

    // Generate submission ID
    const submissionId = `submission-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
    const submissionPath = path.join(SUBMISSIONS_DIR, `${submissionId}.json`);

    // Save submission with metadata
    const submission = {
      ...validated,
      submission_id: submissionId,
      submitted_at: new Date().toISOString(),
      status: 'pending',
      ip_hash: hashIP(identifier), // Don't store raw IP
    };

    await fs.writeFile(submissionPath, JSON.stringify(submission, null, 2));

    return NextResponse.json({
      success: true,
      message: 'Thank you for your submission! It will be reviewed by moderators.',
      submission_id: submissionId,
    });
  } catch (error) {
    console.error('Submission error:', error);

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid submission', details: error.errors },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

function hashIP(ip: string): string {
  // Simple hash for privacy - in production use crypto.createHash
  return Buffer.from(ip).toString('base64').slice(0, 16);
}
