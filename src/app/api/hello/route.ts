import { NextResponse } from 'next/server';

export function GET() {
  return NextResponse.json('world', { status: 200 });
}
