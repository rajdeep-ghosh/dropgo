import { NextResponse } from 'next/server';
import { lt, sql } from 'drizzle-orm';

import db from '@/lib/db';
import { filesTable } from '@/lib/db/schema';

import type { NextRequest } from 'next/server';

async function GET(req: NextRequest) {
  const authHeader = req.headers.get('authorization');
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json('Unauthorized', { status: 401 });
  }

  try {
    await db.delete(filesTable).where(lt(filesTable.expiresAt, sql`now()`));

    return NextResponse.json('OK');
  } catch (err) {
    if (err instanceof Error) {
      return NextResponse.json(err.message, { status: 500 });
    }
    return NextResponse.json('Something went wrong', { status: 500 });
  }
}

export { GET };
