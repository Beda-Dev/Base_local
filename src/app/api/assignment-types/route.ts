import { db, errorHandler, notFound, badRequest, successResponse, createdResponse, deletedResponse } from '@/lib/api-utils';

export async function GET(request: Request) {
  try {
    const searchParams = new URL(request.url).searchParams;
    const id = searchParams.get('id');

    if (id) {
      const assignmentType = await db.assignmentType.findUnique({
        where: { id: parseInt(id) },
        include: {
          students: true,
          pricings: true,
        },
      });
      if (!assignmentType) return notFound('Type d\'attribution non trouvé');
      return successResponse(assignmentType);
    }

    const assignmentTypes = await db.assignmentType.findMany({
      include: {
        students: true,
        pricings: true,
      },
    });
    return successResponse(assignmentTypes);
  } catch (error) {
    return errorHandler(error instanceof Error ? error : new Error('Une erreur est survenue'));
  }
}

export async function POST(request: Request) {
  try {
    const data = await request.json();
    const assignmentType = await db.assignmentType.create({
      data: {
        ...data,
        created_at: new Date(),
        updated_at: new Date(),
      },
      include: {
        students: true,
        pricings: true,
      },
    });
    return createdResponse(assignmentType);
  } catch (error) {
    return errorHandler(error instanceof Error ? error : new Error('Une erreur est survenue'));
  }
}

export async function PUT(request: Request) {
  try {
    const id = parseInt(new URL(request.url).searchParams.get('id') || '');
    if (!id) return badRequest('ID type d\'attribution requis');

    const data = await request.json();
    const assignmentType = await db.assignmentType.update({
      where: { id: id },
      data: {
        ...data,
        updated_at: new Date(),
      },
      include: {
        students: true,
        pricings: true,
      },
    });
    return successResponse(assignmentType);
  } catch (error) {
    return errorHandler(error instanceof Error ? error : new Error('Une erreur est survenue'));
  }
}

export async function DELETE(request: Request) {
  try {
    const id = parseInt(new URL(request.url).searchParams.get('id') || '');
    if (!id) return badRequest('ID type d\'attribution requis');

    await db.assignmentType.delete({ where: { id: id } });
    return deletedResponse();
  } catch (error) {
    return errorHandler(error instanceof Error ? error : new Error('Une erreur est survenue'));
  }
}

