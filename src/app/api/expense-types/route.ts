import { db, errorHandler, notFound, badRequest, successResponse, createdResponse, deletedResponse } from '@/lib/api-utils';

export async function GET(request: Request) {
  try {
    const searchParams = new URL(request.url).searchParams;
    const id = parseInt(searchParams.get('id') || '');

    if (id) {
      const expenseType = await db.expenseType.findUnique({
        where: { id: id },
        include: {
          expenses: true,
        },
      });
      if (!expenseType) return notFound('Type de frais non trouvé');
      return successResponse(expenseType);
    }

    const expenseTypes = await db.expenseType.findMany({
      include: {
        expenses: true,
      },
    });
    return successResponse(expenseTypes);
  } catch (error) {
    return errorHandler(error instanceof Error ? error : new Error('Une erreur est survenue'));
  }
}

export async function POST(request: Request) {
  try {
    const data = await request.json();
    const expenseType = await db.expenseType.create({
      data: {
        ...data,
        created_at: new Date(),
        updated_at: new Date(),
      },
      include: {
        expenses: true,
      },
    });
    return createdResponse(expenseType);
  } catch (error) {
    return errorHandler(error instanceof Error ? error : new Error('Une erreur est survenue'));
  }
}

export async function PUT(request: Request) {
  try {
    const id = parseInt(new URL(request.url).searchParams.get('id') || '');
    if (!id) return badRequest('ID type de frais requis');

    const data = await request.json();
    const expenseType = await db.expenseType.update({
      where: { id: id },
      data: {
        ...data,
        updated_at: new Date(),
      },
      include: {
        expenses: true,
      },
    });
    return successResponse(expenseType);
  } catch (error) {
    return errorHandler(error instanceof Error ? error : new Error('Une erreur est survenue'));
  }
}

export async function DELETE(request: Request) {
  try {
    const id = parseInt(new URL(request.url).searchParams.get('id') || '');
    if (!id) return badRequest('ID type de frais requis');

    await db.expenseType.delete({ where: { id: id } });
    return deletedResponse();
  } catch (error) {
    return errorHandler(error instanceof Error ? error : new Error('Une erreur est survenue'));
  }
}

