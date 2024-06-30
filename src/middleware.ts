import { NextResponse, type NextRequest } from 'next/server';

export const config = {
  matcher: '/s'
};

export function middleware(req: NextRequest) {
  return NextResponse.redirect(new URL('/', req.url));
}
