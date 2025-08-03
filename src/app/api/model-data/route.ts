import { NextRequest, NextResponse } from 'next/server';
import { ref, getBytes } from 'firebase/storage';
import { storage } from '@/lib/firebase';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const filePath = searchParams.get('path');
    
    if (!filePath) {
      return NextResponse.json({ error: 'File path is required' }, { status: 400 });
    }

    console.log('API: Fetching file data for path:', filePath);
    
    // Use Firebase SDK server-side (no CORS issues)
    const fileRef = ref(storage, filePath);
    const bytes = await getBytes(fileRef);
    
    console.log('API: Successfully got file data, size:', bytes.byteLength);
    
    // Return the file data as a binary response
    return new NextResponse(bytes, {
      headers: {
        'Content-Type': 'application/octet-stream',
        'Content-Length': bytes.byteLength.toString(),
      },
    });
  } catch (error) {
    console.error('API: Error fetching file data:', error);
    return NextResponse.json(
      { error: 'Failed to fetch file data' }, 
      { status: 500 }
    );
  }
} 