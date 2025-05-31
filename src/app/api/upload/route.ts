import { NextResponse } from 'next/server';
import { db, errorHandler, badRequest, successResponse } from '@/lib/api-utils';
import { join } from 'path';
import { writeFile, unlink } from 'fs/promises';

const UPLOAD_DIR = join(process.cwd(), 'public', 'uploads');

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    const type = formData.get('type') as string;
    
    if (!file || !type) {
      return badRequest('Les champs file et type sont requis');
    }

    // Créer le dossier s'il n'existe pas
    const buffer = await file.arrayBuffer();
    await writeFile(join(UPLOAD_DIR, file.name), new Uint8Array(buffer));

    return successResponse({
      url: `/uploads/${file.name}`,
      name: file.name,
      type: type,
    });
  } catch (error: unknown) {
    return errorHandler(error instanceof Error ? error : new Error('Une erreur est survenue'));
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const filename = searchParams.get('filename');

    if (!filename) {
      return badRequest('Le nom du fichier est requis');
    }

    // Supprimer le fichier
    const filePath = join(UPLOAD_DIR, filename);
    await unlink(filePath);

    return successResponse({ message: 'Fichier supprimé avec succès' });
  } catch (error: unknown) {
    return errorHandler(error instanceof Error ? error : new Error('Une erreur est survenue'));
  }
}
