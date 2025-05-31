import { NextResponse } from 'next/server';
import { db, errorHandler, notFound, badRequest, successResponse, createdResponse, deletedResponse } from '@/lib/api-utils';
import fs from 'fs';
import path from 'path';

// Gestion des requêtes OPTIONS et CORS
export async function OPTIONS() {
  return new Response(null, {
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  });
}

const ALLOWED_FILE_TYPES = [
  // Texte
  'text/plain',
  // PDF
  'application/pdf',
  // Documents Word
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  // Excel
  'application/vnd.ms-excel',
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  // PowerPoint
  'application/vnd.ms-powerpoint',
  'application/vnd.openxmlformats-officedocument.presentationml.presentation',
  // Images
  'image/jpeg',
  'image/png',
  'image/svg+xml'
];

export async function GET(request: Request) {
  try {
    const searchParams = new URL(request.url).searchParams;
    const id = searchParams.get('id');
    const action = searchParams.get('action');

    if (id && action === 'download') {
      const document = await db.document.findUnique({
        where: { id: parseInt(id) },
      });
      if (!document) return notFound('Document non trouvé');

      // Lire le fichier
      const fileStream = fs.createReadStream(document.file_path);
      const fileName = document.file_name;
      const fileType = document.file_type;

      // Convertir le ReadStream en ReadableStream
      const readableStream = new ReadableStream({
        async start(controller) {
          fileStream.on('data', (chunk) => {
            // Convert Buffer to Uint8Array
            const uint8Array = chunk instanceof Buffer ? new Uint8Array(chunk) : new Uint8Array(Buffer.from(chunk));
            controller.enqueue(uint8Array);
          });
          fileStream.on('end', () => {
            controller.close();
          });
          fileStream.on('error', (err) => {
            controller.error(err);
          });
        }
      });

      // Créer la réponse
      const response = new NextResponse(readableStream, {
        headers: {
          'Content-Type': fileType,
          'Content-Disposition': `attachment; filename="${fileName}"`,
        },
      });

      return response;
    }

    if (id) {
      const document = await db.document.findUnique({
        where: { id: parseInt(id) },
        include: {
          document_type: true,
          student: true,
        },
      });
      if (!document) return notFound('Document non trouvé');
      return successResponse(document);
    }

    const documents = await db.document.findMany({
      include: {
        document_type: true,
        student: true,
      },
    });
    return successResponse(documents);
  } catch (error: unknown) {
    return errorHandler(error instanceof Error ? error : new Error('Une erreur est survenue'));
  }
}

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    const data = JSON.parse(formData.get('data') as string);

    if (!file) {
      return badRequest('Fichier requis');
    }

    // Vérifier le type de fichier
    const fileType = file.type;
    if (!ALLOWED_FILE_TYPES.includes(fileType)) {
      return badRequest('Type de fichier non autorisé');
    }

    // Créer le dossier uploads s'il n'existe pas
    const uploadPath = 'public/uploads';
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }

    // Générer un nom de fichier unique
    const fileName = `${Date.now()}-${file.name}`;
    const filePath = path.join(uploadPath, fileName);

    // Sauvegarder le fichier
    const buffer = Buffer.from(await file.arrayBuffer());
    await fs.promises.writeFile(filePath, buffer);

    // Créer le document dans la base de données
    const document = await db.document.create({
      data: {
        ...data,
        file_path: filePath,
        file_name: fileName,
        file_type: fileType,
        file_size: file.size,
        created_at: new Date(),
        updated_at: new Date(),
      },
      include: {
        document_type: true,
        student: true,
      },
    });

    return createdResponse(document);
  } catch (error: unknown) {
    return errorHandler(error instanceof Error ? error : new Error('Une erreur est survenue'));
  }
}
export async function PUT(request: Request) {
  try {
    const id = new URL(request.url).searchParams.get('id');
    if (!id) return badRequest('ID document requis');

    const data = await request.json();
    const document = await db.document.update({
      where: { id: parseInt(id) },
      data: {
        ...data,
        updated_at: new Date(),
      },
      include: {
        document_type: true,
        student: true,
      },
    });
    return successResponse(document);
  } catch (error: unknown) {
    return errorHandler(error instanceof Error ? error : new Error('Une erreur est survenue'));
  }
}

export async function DELETE(request: Request) {
  try {
    const id = new URL(request.url).searchParams.get('id');
    if (!id) return badRequest('ID document requis');

    await db.document.delete({ where: { id: parseInt(id) } });
    return deletedResponse();
  } catch (error: unknown) {
    return errorHandler(error instanceof Error ? error : new Error('Une erreur est survenue'));
  }
}

