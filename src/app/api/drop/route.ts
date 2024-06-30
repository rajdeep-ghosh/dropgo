import { NextResponse, type NextRequest } from 'next/server';
import { connectDB } from '@/lib/db';
import FileModel from '@/lib/models/file';
import { getObject } from '@/lib/storage';

export async function POST(req: NextRequest) {
  const body = (await req.json()) as { id: string };

  if (!body.id) {
    return NextResponse.json(
      { error: 'Missing request body parameters' },
      { status: 400 }
    );
  }

  try {
    await connectDB();

    const file = await FileModel.findById(body.id);

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
