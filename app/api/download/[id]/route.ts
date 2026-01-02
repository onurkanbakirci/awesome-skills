import { NextRequest, NextResponse } from 'next/server';
import path from 'path';
import fs from 'fs';
import archiver from 'archiver';
import { Readable } from 'stream';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const skillDir = path.join(process.cwd(), 'public', 'skills', id);

    // Check if skill directory exists
    if (!fs.existsSync(skillDir)) {
      return NextResponse.json(
        { error: 'Skill not found' },
        { status: 404 }
      );
    }

    // Create a zip archive
    const archive = archiver('zip', {
      zlib: { level: 9 }
    });

    // Add all files from skill directory to the archive
    archive.directory(skillDir, false);
    
    // Finalize the archive
    await archive.finalize();

    // Convert archive to buffer
    const chunks: Buffer[] = [];
    for await (const chunk of archive) {
      chunks.push(chunk);
    }
    const buffer = Buffer.concat(chunks);

    // Return as downloadable file
    return new NextResponse(buffer, {
      headers: {
        'Content-Type': 'application/zip',
        'Content-Disposition': `attachment; filename="${id}.zip"`,
      },
    });
  } catch (error) {
    console.error('Error downloading skill:', error);
    return NextResponse.json(
      { error: 'Failed to download skill' },
      { status: 500 }
    );
  }
}

