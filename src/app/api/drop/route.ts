import { NextResponse } from 'next/server';
import { eq } from 'drizzle-orm';
import { generateErrorMessage } from 'zod-error';

import { createFileReqSchema, getFileReqSchema } from '@/lib/api/schema/drop';
import { generateFileKey } from '@/lib/utils';
import db from '@/lib/db';
import { filesTable } from '@/lib/db/schema';
import { getObject, putObject } from '@/lib/storage';

import type { NextRequest } from 'next/server';

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
      { status: 201 }
    );
  } catch (err) {
    if (err instanceof Error) {
      return NextResponse.json(
        { status: 'error', message: err.message },
        { status: 500 }
      );
    }
    return NextResponse.json(
      { status: 'error', message: 'Please try again' },
      { status: 500 }
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
        { status: 404 }
      );
    }

    const downloadUrl = await getObject(file.key);

    return NextResponse.json({
      status: 'success',
      data: { ...file, url: downloadUrl }
    });
  } catch (err) {
    if (err instanceof Error) {
      return NextResponse.json(
        { status: 'error', message: err.message },
        { status: 500 }
      );
    }
    return NextResponse.json(
      { status: 'error', message: 'Please try again' },
      { status: 500 }
    );
  }
}

export { POST, GET };
