import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const skillPath = path.join(process.cwd(), 'public', 'skills', id);

    // Check if directory exists
    try {
      await fs.access(skillPath);
    } catch {
      return NextResponse.json(
        { error: 'Skill folder not found' },
        { status: 404 }
      );
    }

    // Read all files in the directory recursively
    const files = await readDirectoryRecursive(skillPath, '');

    return NextResponse.json({ files });
  } catch (error) {
    console.error('Error reading skill files:', error);
    return NextResponse.json(
      { error: 'Failed to read skill files' },
      { status: 500 }
    );
  }
}

async function readDirectoryRecursive(
  dirPath: string,
  relativePath: string
): Promise<Array<{ path: string; name: string; content: string; isDirectory: boolean }>> {
  const items = await fs.readdir(dirPath, { withFileTypes: true });
  const files: Array<{ path: string; name: string; content: string; isDirectory: boolean }> = [];

  for (const item of items) {
    const itemPath = path.join(dirPath, item.name);
    const itemRelativePath = relativePath ? `${relativePath}/${item.name}` : item.name;

    if (item.isDirectory()) {
      // Add directory entry
      files.push({
        path: itemRelativePath,
        name: item.name,
        content: '',
        isDirectory: true,
      });
      // Recursively read subdirectory
      const subFiles = await readDirectoryRecursive(itemPath, itemRelativePath);
      files.push(...subFiles);
    } else {
      // Read file content
      try {
        const content = await fs.readFile(itemPath, 'utf-8');
        files.push({
          path: itemRelativePath,
          name: item.name,
          content,
          isDirectory: false,
        });
      } catch (error) {
        // If file can't be read as text (e.g., binary file), skip it or add with empty content
        console.log(`Skipping binary file: ${itemRelativePath}`);
        files.push({
          path: itemRelativePath,
          name: item.name,
          content: '[Binary file]',
          isDirectory: false,
        });
      }
    }
  }

  return files;
}

