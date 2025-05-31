import { db, errorHandler, notFound, badRequest, successResponse, createdResponse, deletedResponse } from '@/lib/api-utils';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (id) {
      const documentType = await db.documentType.findUnique({
        where: { id: parseInt(id) },
        include: {
          documents: true,
        },
      });
      if (!documentType) return notFound('Type de document non trouvé');
      return successResponse(documentType);
    }

    const documentTypes = await db.documentType.findMany({
      include: {
        documents: true,
      },
    });
    return successResponse(documentTypes);
  } catch (error) {
    return errorHandler(error);
  }
}

export async function POST(request: Request) {
  try {
    const data = await request.json();
    const documentType = await db.documentType.create({
      data: {
        ...data,
        created_at: new Date(),
        updated_at: new Date(),
      },
      include: {
        documents: true,
      },
    });
    return createdResponse(documentType);
  } catch (error) {
    return errorHandler(error);
  }
}

export async function PUT(request: Request) {
  try {
    const { id } = new URL(request.url).searchParams;
    if (!id) return badRequest('ID type de document requis');

    const data = await request.json();
    const documentType = await db.documentType.update({
      where: { id: parseInt(id) },
      data: {
        ...data,
        updated_at: new Date(),
      },
      include: {
        documents: true,
      },
    });
    return successResponse(documentType);
  } catch (error) {
    return errorHandler(error);
  }
}

export async function DELETE(request: Request) {
  try {
    const { id } = new URL(request.url).searchParams;
    if (!id) return badRequest('ID type de document requis');

    await db.documentType.delete({ where: { id: parseInt(id) } });
    return deletedResponse();
  } catch (error) {
    return errorHandler(error);
  }
}

