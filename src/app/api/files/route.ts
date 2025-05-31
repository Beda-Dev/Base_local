import { extname } from 'path';
import path from 'path';
import * as fs from 'fs';
import { promises as fsPromises } from 'fs';
import { NextResponse } from 'next/server';
import { pipeline as pipelineAsync } from 'stream/promises';

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
      await fsPromises.access(filePath, fs.constants.R_OK);
    } catch {
      return NextResponse.json({ error: 'Fichier non trouvé' }, { status: 404 });
    }

    // Read and serve the file
    const fileData = await fsPromises.readFile(filePath);
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

// Add POST route for file upload
export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    const type = formData.get('type') as string;
    const id = formData.get('id') as string;

    if (!file || !type || !id) {
      return NextResponse.json({ error: 'Fichier, type et ID sont requis' }, { status: 400 });
    }

    // Validate type
    if (!['student', 'user', 'document'].includes(type)) {
      return NextResponse.json({ error: 'Type invalide' }, { status: 400 });
    }

    // Get file extension
    const filename = file.name;
    const ext = extname(filename).toLowerCase();
    const mimeType = getMimeType(ext);

    if (!mimeType) {
      return NextResponse.json({ error: 'Type de fichier non supporté' }, { status: 400 });
    }

    // Create upload directory if it doesn't exist
    const uploadDir = path.join(process.cwd(), 'public', 'uploads', `${type}s`);
    await fsPromises.mkdir(uploadDir, { recursive: true });

    // Save file
    const filePath = path.join(uploadDir, filename);
    const fileStream = file.stream();
    
    // Convert Web API stream to Node.js stream
    const nodeStream = new (require('stream').Readable)();
    nodeStream._read = () => {};
    
    // Pipe Web API stream to Node.js stream
    fileStream.pipeThrough(new TransformStream()).pipeTo(nodeStream);
    
    // Write to file
    await pipelineAsync(nodeStream, fs.createWriteStream(filePath));

    return NextResponse.json({
      success: true,
      message: 'Fichier téléchargé avec succès',
      filename: filename,
      type: mimeType
    });
  } catch (error: unknown) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Une erreur est survenue' },
      { status: 500 }
    );
  }
}

// Helper function to get MIME type based on file extension
type FileExtension = keyof typeof mimeTypes;

const mimeTypes = {
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.png': 'image/png',
  '.gif': 'image/gif',
  '.pdf': 'application/pdf',
  '.doc': 'application/msword',
  '.docx': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  '.xls': 'application/vnd.ms-excel',
  '.xlsx': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  '.txt': 'text/plain',
  '.csv': 'text/csv',
  '.zip': 'application/zip',
  '.rar': 'application/x-rar-compressed'
} as const satisfies Record<string, string>;

function getMimeType(ext: string): string | null {
  const normalizedExt = ext.toLowerCase();
  const mime = mimeTypes[normalizedExt as keyof typeof mimeTypes];
  return mime || null;
}

