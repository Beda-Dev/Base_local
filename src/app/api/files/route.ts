import { NextResponse } from 'next/server';
import path from 'path';
import fs from 'fs/promises';

export async function GET(request: Request) {
  try {
    const searchParams = new URL(request.url).searchParams;
    const type = searchParams.get('type');
    const id = searchParams.get('id');

    if (!type || !id) {
      return NextResponse.json({ error: 'Type et ID sont requis' }, { status: 400 });
    }

    // Validate type
    if (!['student', 'user'].includes(type)) {
      return NextResponse.json({ error: 'Type invalide' }, { status: 400 });
    }

    // Construct file path
    const uploadDir = path.join(process.cwd(), 'public', 'upload');
    const filePath = path.join(uploadDir, `${type}s`, `${id}.jpg`);

    // Check if file exists
    try {
      await fs.access(filePath);
    } catch (error) {
      return NextResponse.json({ error: 'Fichier non trouvé' }, { status: 404 });
    }

    // Read and serve the file
    const fileData = await fs.readFile(filePath);
    return new NextResponse(fileData, {
      headers: {
        'Content-Type': 'image/jpeg',
        'Content-Disposition': `inline; filename="${id}.jpg"`
      }
    });
  } catch (error: unknown) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Une erreur est survenue' },
      { status: 500 }
    );
  }
}
