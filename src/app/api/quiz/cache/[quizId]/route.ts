// First file: cache endpoint
import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({ message: 'Cache endpoint' });
}