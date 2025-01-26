import { NextResponse } from 'next/server';
import { eq, lt, or, sql } from 'drizzle-orm';

import db from '@/lib/db';
import { filesTable } from '@/lib/db/schema';

import type { NextRequest } from 'next/server';

// Allow this function to run for max 30 seconds
export const maxDuration = 30;

async function DELETE(req: NextRequest) {
  const authHeader = req.headers.get('authorization');
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json('Unauthorized', { status: 401 });
  }

  try {
    await db
      .delete(filesTable)
      .where(
        or(
          lt(filesTable.expiresAt, sql`now()`),
          eq(filesTable.uploadStatus, 'UPLOADING')
        )
      );

    return NextResponse.json('OK');
  } catch (err) {
    if (err instanceof Error) {
      return NextResponse.json(err.message, { status: 500 });
    }
    return NextResponse.json('Something went wrong', { status: 500 });
  }
}

export { DELETE };
