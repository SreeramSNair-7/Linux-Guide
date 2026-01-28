// file: src/app/api/submissions/route.ts
import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';

const SUBMISSIONS_DIR = path.join(process.cwd(), 'data', 'submissions');

export async function GET(_request: NextRequest) {
  try {
    // Ensure submissions directory exists
    await fs.mkdir(SUBMISSIONS_DIR, { recursive: true });

    // Read all submission files
    const files = await fs.readdir(SUBMISSIONS_DIR);
    const submissions = [];

    for (const file of files) {
      if (file.endsWith('.json')) {
        const filePath = path.join(SUBMISSIONS_DIR, file);
        const content = await fs.readFile(filePath, 'utf-8');
        const submission = JSON.parse(content);
        submissions.push(submission);
      }
    }

    // Sort by submitted_at in descending order (newest first)
    submissions.sort((a, b) => new Date(b.submitted_at).getTime() - new Date(a.submitted_at).getTime());

    return NextResponse.json({
      success: true,
      count: submissions.length,
      submissions,
    });
  } catch (error) {
    console.error('Error fetching submissions:', error);
    return NextResponse.json(
      { error: 'Failed to fetch submissions' },
      { status: 500 }
    );
  }
}
