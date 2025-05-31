import { db, errorHandler, notFound, badRequest, successResponse, createdResponse, deletedResponse } from '@/lib/api-utils';

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

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (id) {
      const feeType = await db.feeType.findUnique({
        where: { id: parseInt(id) },
        include: {
          pricings: true,
        },
      });
      if (!feeType) return notFound('Type de frais non trouvé');
      return successResponse(feeType);
    }

    const feeTypes = await db.feeType.findMany({
      include: {
        pricings: true,
      },
    });
    return successResponse(feeTypes);
  } catch (error) {
    return errorHandler(error instanceof Error ? error : new Error('Une erreur est survenue'));
  }
}

export async function POST(request: Request) {
  try {
    const data = await request.json();
    const feeType = await db.feeType.create({
      data: {
        ...data,
        created_at: new Date(),
        updated_at: new Date(),
      },
      include: {
        pricings: true,
      },
    });
    return createdResponse(feeType);
  } catch (error) {
    return errorHandler(error instanceof Error ? error : new Error('Une erreur est survenue'));
  }
}

export async function PUT(request: Request) {
  try {
    const id = parseInt(new URL(request.url).searchParams.get('id') || '');
    if (!id) return badRequest('ID type de frais requis');

    const data = await request.json();
    const feeType = await db.feeType.update({
      where: { id: id },
      data: {
        ...data,
        updated_at: new Date(),
      },
      include: {
        pricings: true,
      },
    });
    return successResponse(feeType);
  } catch (error) {
    return errorHandler(error instanceof Error ? error : new Error('Une erreur est survenue'));
  }
}

export async function DELETE(request: Request) {
  try {
    const id = parseInt(new URL(request.url).searchParams.get('id') || '');
    if (!id) return badRequest('ID type de frais requis');

    await db.feeType.delete({ where: { id: id } });
    return deletedResponse();
  } catch (error) {
    return errorHandler(error instanceof Error ? error : new Error('Une erreur est survenue'));
  }
}

