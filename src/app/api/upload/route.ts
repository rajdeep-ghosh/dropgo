import { type NextRequest, NextResponse } from 'next/server';
import FileModel from '@/lib/models/file';
import { dbConnect } from '@/lib/db';
import { putObject } from '@/lib/s3';

type UploadPayloadProps = {
  name: string;
  size: number;
  type: string;
};

export async function POST(req: NextRequest) {
  const body = (await req.json()) as UploadPayloadProps;

  if (!body.name || !body.size || !body.type) {
    return NextResponse.json('missing body parameters', { status: 400 });
  }

  const maxFileSize = 201 * 1024 * 1024; // 201 MB
  if (body.size > maxFileSize) {
    return NextResponse.json('too large file', { status: 403 });
  }

  const key = `${Date.now()}-${body.name.replace(/\s+/g, '_')}`;
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
      { ...savedFile.toJSON(), url: uploadUrl },
      { status: 201 }
    );
  } catch (err) {
    if (err instanceof Error)
      return NextResponse.json(err.message, { status: 500 });
    return NextResponse.json('something went wrong', { status: 500 });
  }
}
