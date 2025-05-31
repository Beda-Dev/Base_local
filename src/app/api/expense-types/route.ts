import { db, errorHandler, notFound, badRequest, successResponse, createdResponse, deletedResponse } from '@/lib/api-utils';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (id) {
      const expenseType = await db.expenseType.findUnique({
        where: { id: parseInt(id) },
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
    return errorHandler(error);
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
    return errorHandler(error);
  }
}

export async function PUT(request: Request) {
  try {
    const { id } = new URL(request.url).searchParams;
    if (!id) return badRequest('ID type de frais requis');

    const data = await request.json();
    const expenseType = await db.expenseType.update({
      where: { id: parseInt(id) },
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
    return errorHandler(error);
  }
}

export async function DELETE(request: Request) {
  try {
    const { id } = new URL(request.url).searchParams;
    if (!id) return badRequest('ID type de frais requis');

    await db.expenseType.delete({ where: { id: parseInt(id) } });
    return deletedResponse();
  } catch (error) {
    return errorHandler(error);
  }
}

