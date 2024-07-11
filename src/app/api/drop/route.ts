import crypto from 'node:crypto';
import { NextResponse } from 'next/server';
import { eq } from 'drizzle-orm';

import db from '@/lib/db';
import { files } from '@/lib/db/schema';
import { getObject, putObject } from '@/lib/storage';

import type { NextRequest } from 'next/server';
import type { PostAPIReqPayload } from '@/types';

async function POST(req: NextRequest) {
  const body = (await req.json()) as PostAPIReqPayload;

  if (!body.name || !body.size || !body.type) {
    return NextResponse.json(
      { error: 'File type not suppoted / Missing required parameters' },
      { status: 400 }
    );
  }

  const maxFileSize = 201 * 1024 * 1024; // 201 MB
  if (body.size > maxFileSize) {
    return NextResponse.json({ error: 'File too large' }, { status: 413 });
  }

  try {
    const key = `${crypto.randomBytes(8).toString('hex')}-${body.name.replace(/\s+/g, '_')}`;

    const [newFile] = await db
      .insert(files)
      .values({
        name: body.name,
        size: body.size,
        type: body.type,
        key
      })
      .returning({ id: files.id });

    const uploadUrl = await putObject(key, body.type, body.size);

    return NextResponse.json(
      { success: { ...newFile, url: uploadUrl } },
      { status: 201 }
    );
  } catch (err) {
    if (err instanceof Error) {
      return NextResponse.json({ error: err.message }, { status: 500 });
    }
    return NextResponse.json({ error: 'Please try again' }, { status: 500 });
  }
}

async function GET(req: NextRequest) {
  const searchParams = req.nextUrl.searchParams;
  const id = searchParams.get('id');

  if (!id) {
    return NextResponse.json(
      { error: 'Missing required parameters' },
      { status: 400 }
    );
  }

  try {
    const file = await db.query.files.findFirst({
      where: eq(files.id, id)
    });

    if (!file || file.expiresAt.getTime() - Date.now() <= 0) {
      return NextResponse.json({ error: 'File not found' }, { status: 404 });
    }

    const downloadUrl = await getObject(file.key);

    return NextResponse.json({ success: { ...file, url: downloadUrl } });
  } catch (err) {
    if (err instanceof Error) {
      return NextResponse.json({ error: err.message }, { status: 500 });
    }
    return NextResponse.json({ error: 'Please try again' }, { status: 500 });
  }
}

export { POST, GET };
