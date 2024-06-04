import crypto from 'crypto';
import { type NextRequest, NextResponse } from 'next/server';
import FileModel from '@/lib/models/file';
import { dbConnect } from '@/lib/db';
import { putObject } from '@/lib/s3';
import type { UploadAPIReqPayload } from '@/types';

export async function POST(req: NextRequest) {
  const body = (await req.json()) as UploadAPIReqPayload;

  if (!body.name || !body.size || !body.type) {
    return NextResponse.json(
      { error: 'Missing request body parameters' },
      { status: 400 }
    );
  }

  const maxFileSize = 201 * 1024 * 1024; // 201 MB
  if (body.size > maxFileSize) {
    return NextResponse.json({ error: 'File too large' }, { status: 403 });
  }

  const key = `${crypto.randomBytes(8).toString('hex')}-${body.name.replace(/\s+/g, '_')}`;
  const newFile = new FileModel({
    name: body.name,
    size: body.size,
    type: body.type,
    key
  });

  try {
    await dbConnect();

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
