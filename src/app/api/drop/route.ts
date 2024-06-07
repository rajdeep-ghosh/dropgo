import { NextResponse, type NextRequest } from 'next/server';
import { dbConnect } from '@/lib/db';
import FileModel from '@/lib/models/file';
import { getObject } from '@/lib/s3';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get('id');

  if (!id) {
    return NextResponse.json(
      { error: 'Missing request body parameters' },
      { status: 400 }
    );
  }

  try {
    await dbConnect();

    const file = await FileModel.findById(id);

    if (!file || new Date().getDate() - file.toJSON().updatedAt.getDate() > 5) {
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
