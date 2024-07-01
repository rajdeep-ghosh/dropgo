import crypto from 'crypto';
import { NextResponse } from 'next/server';

import FileModel from '@/lib/models/file';
import { connectDB } from '@/lib/db';
import { getObject, putObject } from '@/lib/storage';

import type { NextRequest } from 'next/server';
import type { UploadAPIReqPayload } from '@/types';

async function POST(req: NextRequest) {
  const body = (await req.json()) as UploadAPIReqPayload;

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

  const key = `${crypto.randomBytes(8).toString('hex')}-${body.name.replace(/\s+/g, '_')}`;
  const newFile = new FileModel({
    name: body.name,
    size: body.size,
    type: body.type,
    key
  });

  try {
    await connectDB();

    const uploadUrl = await putObject(key, body.type, body.size);
    const savedFile = await newFile.save();

    return NextResponse.json(
      {
        success: {
          ...savedFile.toJSON(),
          url: uploadUrl
        }
      },
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
  const { searchParams } = new URL(req.url);
  const id = searchParams.get('id');

  if (!id) {
    return NextResponse.json(
      { error: 'Missing required parameters' },
      { status: 400 }
    );
  }

  try {
    await connectDB();

    const file = await FileModel.findById(id);

    if (!file || file.toJSON().expires.getTime() - Date.now() <= 0) {
      return NextResponse.json({ error: 'File not found' }, { status: 404 });
    }

    const data = file.toJSON();
    const downloadUrl = await getObject(data.key);

    return NextResponse.json({ success: { ...data, url: downloadUrl } });
  } catch (err) {
    if (err instanceof Error) {
      return NextResponse.json({ error: err.message }, { status: 500 });
    }
    return NextResponse.json({ error: 'Please try again' }, { status: 500 });
  }
}

export { POST, GET };
