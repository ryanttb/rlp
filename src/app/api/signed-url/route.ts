import { NextRequest, NextResponse } from 'next/server';
import { getSignedUrl } from '@/lib/storage';

export async function POST(request: NextRequest) {
  try {
    const { filename, action = 'read', expiresIn = 3600 } = await request.json();

    if (!filename) {
      return NextResponse.json(
        { error: 'Filename is required' },
        { status: 400 }
      );
    }

    const signedUrl = await getSignedUrl(filename, action, expiresIn);

    return NextResponse.json({ signedUrl });
  } catch (error) {
    console.error('Error getting signed URL:', error);
    return NextResponse.json(
      { error: 'Failed to get signed URL' },
      { status: 500 }
    );
  }
}
