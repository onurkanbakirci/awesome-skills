import { NextRequest, NextResponse } from 'next/server';
import path from 'path';
import fs from 'fs';
import archiver from 'archiver';
import { Readable } from 'stream';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const skillDir = path.join(process.cwd(), 'public', 'skills', id);

    // Check if skill directory exists
    if (!fs.existsSync(skillDir)) {
      return NextResponse.json(
        { error: 'Skill not found' },
        { status: 404 }
      );
    }

    // Load skills data to get owner and name
    const skillsData = JSON.parse(
      fs.readFileSync(path.join(process.cwd(), 'data', 'skills.json'), 'utf-8')
    );
    const skill = skillsData.find((s: any) => s.id === id);
    
    // Generate filename as owner-skillname.zip
    const filename = skill 
      ? `${skill.owner}-${skill.name}.zip`
      : `${id}.zip`;

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
        'Content-Disposition': `attachment; filename="${filename}"`,
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
