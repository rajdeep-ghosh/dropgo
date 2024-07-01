// import crypto from 'crypto';
import { NextResponse } from 'next/server';

import FileModel from '@/lib/models/file';
import { connectDB } from '@/lib/db';
import { getObject, putObject, ratelimit } from '@/lib/storage';

import type { NextRequest } from 'next/server';
import type { UploadAPIReqPayload } from '@/types';

export const runtime = 'edge';

async function POST(req: NextRequest) {
  const ip = req.ip ?? '127.0.0.1';

  console.log('POST', ip);
  console.log('request ip', req.ip);

  const { limit, remaining, reset } = await ratelimit.upload.limit(ip);

  const ratelimitHeaders = {
    'RateLimit-Limit': limit.toString(),
    'RateLimit-Remaining': remaining.toString(),
    'RateLimit-Reset': reset.toString()
  };

  if (remaining === 0) {
    return NextResponse.json(
      { error: 'Rate limit exceeded' },
      { status: 429, headers: ratelimitHeaders }
    );
  }

  const body = (await req.json()) as UploadAPIReqPayload;

  if (!body.name || !body.size || !body.type) {
    return NextResponse.json(
      { error: 'File type not suppoted / Missing required parameters' },
      { status: 400, headers: ratelimitHeaders }
    );
  }

  const maxFileSize = 201 * 1024 * 1024; // 201 MB
  if (body.size > maxFileSize) {
    return NextResponse.json(
      { error: 'File too large' },
      { status: 413, headers: ratelimitHeaders }
    );
  }

  // const key = `${crypto.randomBytes(8).toString('hex')}-${body.name.replace(/\s+/g, '_')}`;
  const key = `${crypto.randomUUID()}-${body.name.replace(/\s+/g, '_')}`;
  console.log(key);

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
      { status: 201, headers: ratelimitHeaders }
    );
  } catch (err) {
    if (err instanceof Error) {
      return NextResponse.json(
        { error: err.message },
        { status: 500, headers: ratelimitHeaders }
      );
    }
    return NextResponse.json(
      { error: 'Please try again' },
      { status: 500, headers: ratelimitHeaders }
    );
  }
}

async function GET(req: NextRequest) {
  const ip = req.ip ?? '127.0.0.1';

  console.log('GET', ip);
  console.log('request ip', req.ip);

  const { limit, remaining, reset } = await ratelimit.download.limit(ip);

  const ratelimitHeaders = {
    'RateLimit-Limit': limit.toString(),
    'RateLimit-Remaining': remaining.toString(),
    'RateLimit-Reset': reset.toString()
  };

  if (remaining === 0) {
    return NextResponse.json(
      { error: 'Rate limit exceeded' },
      { status: 429, headers: ratelimitHeaders }
    );
  }

  const { searchParams } = new URL(req.url);
  const id = searchParams.get('id');

  if (!id) {
    return NextResponse.json(
      { error: 'Missing required parameters' },
      { status: 400, headers: ratelimitHeaders }
    );
  }

  try {
    await connectDB();

    const file = await FileModel.findById(id);

    if (!file || file.toJSON().expires.getTime() - Date.now() <= 0) {
      return NextResponse.json(
        { error: 'File not found' },
        { status: 404, headers: ratelimitHeaders }
      );
    }

    const data = file.toJSON();
    const downloadUrl = await getObject(data.key);

    return NextResponse.json(
      { success: { ...data, url: downloadUrl } },
      { headers: ratelimitHeaders }
    );
  } catch (err) {
    if (err instanceof Error) {
      return NextResponse.json(
        { error: err.message },
        { status: 500, headers: ratelimitHeaders }
      );
    }
    return NextResponse.json(
      { error: 'Please try again' },
      { status: 500, headers: ratelimitHeaders }
    );
  }
}

export { POST, GET };
