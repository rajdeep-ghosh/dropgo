import { NextResponse } from 'next/server';
import { eq, lt, or, sql } from 'drizzle-orm';
import { generateErrorMessage } from 'zod-error';

import {
  createFileReqSchema,
  getFileReqSchema,
  updateFileReqSchema
} from '@/lib/api/schema/drop';
import { generateFileKey } from '@/lib/utils';
import db from '@/lib/db';
import { filesTable } from '@/lib/db/schema';
import { getObject, putObject, ratelimit } from '@/lib/storage';

import type { NextRequest } from 'next/server';

export const runtime = 'edge';

async function POST(req: NextRequest) {
  const body = createFileReqSchema.safeParse(await req.json());

  if (!body.success) {
    const errMsg = generateErrorMessage(body.error.issues, {
      maxErrors: 1,
      delimiter: { component: ': ' },
      code: { enabled: false },
      path: { enabled: true, type: 'objectNotation', label: '' },
      message: { enabled: true, label: '' }
    });

    return NextResponse.json(
      { status: 'error', message: errMsg },
      { status: 400 }
    );
  }

  const ip = req.ip ?? '127.0.0.1';
  const { limit, remaining, reset } = await ratelimit.upload.create.limit(ip);
  const ratelimitHeaders = {
    'RateLimit-Limit': limit.toString(),
    'RateLimit-Remaining': remaining.toString(),
    'RateLimit-Reset': reset.toString()
  };

  if (remaining === 0) {
    return NextResponse.json(
      { status: 'error', message: 'Rate limit exceeded' },
      { status: 429, headers: ratelimitHeaders }
    );
  }

  try {
    const key = generateFileKey(body.data.name);

    const [newFile] = await db
      .insert(filesTable)
      .values({
        name: body.data.name,
        size: body.data.size,
        type: body.data.type,
        key
      })
      .returning({ id: filesTable.id });

    const uploadUrl = await putObject(
      key,
      body.data.type,
      body.data.size,
      newFile.id
    );

    return NextResponse.json(
      {
        status: 'success',
        data: { ...newFile, url: uploadUrl }
      },
      { status: 201, headers: ratelimitHeaders }
    );
  } catch (err) {
    if (err instanceof Error) {
      return NextResponse.json(
        { status: 'error', message: err.message },
        { status: 500, headers: ratelimitHeaders }
      );
    }
    return NextResponse.json(
      { status: 'error', message: 'Please try again' },
      { status: 500, headers: ratelimitHeaders }
    );
  }
}

async function PATCH(req: NextRequest) {
  const body = updateFileReqSchema.safeParse(await req.json());

  if (!body.success) {
    const errMsg = generateErrorMessage(body.error.issues, {
      maxErrors: 1,
      delimiter: { component: ': ' },
      code: { enabled: false },
      path: { enabled: true, type: 'objectNotation', label: '' },
      message: { enabled: true, label: '' }
    });

    return NextResponse.json(
      { status: 'error', message: errMsg },
      { status: 400 }
    );
  }

  const ip = req.ip ?? '127.0.0.1';
  const { limit, remaining, reset } = await ratelimit.upload.update.limit(ip);
  const ratelimitHeaders = {
    'RateLimit-Limit': limit.toString(),
    'RateLimit-Remaining': remaining.toString(),
    'RateLimit-Reset': reset.toString()
  };

  if (remaining === 0) {
    return NextResponse.json(
      { status: 'error', message: 'Rate limit exceeded' },
      { status: 429, headers: ratelimitHeaders }
    );
  }

  try {
    if (body.data.success) {
      await db
        .update(filesTable)
        .set({ uploadStatus: 'UPLOADED', updatedAt: sql`now()` })
        .where(eq(filesTable.id, body.data.id));

      return NextResponse.json('OK', { headers: ratelimitHeaders });
    } else {
      return NextResponse.json('Not OK', {
        status: 422,
        headers: ratelimitHeaders
      });
    }
  } catch (err) {
    if (err instanceof Error) {
      return NextResponse.json(
        { status: 'error', message: err.message },
        { status: 500, headers: ratelimitHeaders }
      );
    }
    return NextResponse.json(
      { status: 'error', message: 'Something went wrong' },
      { status: 500, headers: ratelimitHeaders }
    );
  }
}

async function GET(req: NextRequest) {
  const searchParams = req.nextUrl.searchParams;

  const id = getFileReqSchema.safeParse(searchParams.get('id'));

  if (!id.success) {
    const errMsg = generateErrorMessage(id.error.issues, {
      maxErrors: 1,
      delimiter: { component: ': ' },
      code: { enabled: false },
      path: { enabled: false },
      message: { enabled: true, label: '' }
    });

    return NextResponse.json(
      { status: 'error', message: errMsg },
      { status: 400 }
    );
  }

  const ip = req.ip ?? '127.0.0.1';
  const { limit, remaining, reset } = await ratelimit.download.limit(ip);
  const ratelimitHeaders = {
    'RateLimit-Limit': limit.toString(),
    'RateLimit-Remaining': remaining.toString(),
    'RateLimit-Reset': reset.toString()
  };

  if (remaining === 0) {
    return NextResponse.json(
      { status: 'error', message: 'Rate limit exceeded' },
      { status: 429, headers: ratelimitHeaders }
    );
  }

  try {
    const file = await db.query.filesTable.findFirst({
      where: eq(filesTable.id, id.data),
      columns: {
        createdAt: false,
        updatedAt: false
      }
    });

    if (!file || file.expiresAt.getTime() - Date.now() <= 0) {
      return NextResponse.json(
        { status: 'error', message: 'File not found' },
        { status: 404, headers: ratelimitHeaders }
      );
    }

    const downloadUrl = await getObject(file.key);

    return NextResponse.json(
      {
        status: 'success',
        data: { ...file, url: downloadUrl }
      },
      { headers: ratelimitHeaders }
    );
  } catch (err) {
    if (err instanceof Error) {
      return NextResponse.json(
        { status: 'error', message: err.message },
        { status: 500, headers: ratelimitHeaders }
      );
    }
    return NextResponse.json(
      { status: 'error', message: 'Please try again' },
      { status: 500, headers: ratelimitHeaders }
    );
  }
}

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

export { POST, PATCH, GET, DELETE };
