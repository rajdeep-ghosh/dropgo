import { type NextRequest, NextResponse } from 'next/server';
import { dbConnect } from '@/lib/db';
import MFile from '@/lib/models/file';

type UploadPayloadProps = {
  filename: string;
  filesize: number;
};

export async function POST(req: NextRequest) {
  const body = (await req.json()) as UploadPayloadProps;

  const newFile = new MFile({
    filename: body.filename,
    filesize: body.filesize
  });

  try {
    await dbConnect();

    const savedFile = await newFile.save();
    return NextResponse.json(savedFile, { status: 201 });
  } catch (err) {
    if (err instanceof Error)
      return NextResponse.json(err.message, { status: 500 });
    return NextResponse.json('something went wrong', { status: 500 });
  }
}
