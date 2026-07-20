import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET() {
  return NextResponse.redirect(new URL('/SentinelX-AI-Documentation.docx', process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'), 302);
}
