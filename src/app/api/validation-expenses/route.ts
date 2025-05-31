import { db, errorHandler, notFound, badRequest, successResponse, createdResponse, deletedResponse } from '@/lib/api-utils';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = parseInt(searchParams.get('id') || '');

    if (id) {
      const validation = await db.validationExpense.findUnique({
        where: { id: id },
        include: {
          user: true,
          expense: true,
        },
      });
      if (!validation) return notFound('Validation non trouvée');
      return successResponse(validation);
    }

    const validations = await db.validationExpense.findMany({
      include: {
        user: true,
        expense: true,
      },
    });
    return successResponse(validations);
  } catch (error) {
    return errorHandler(error instanceof Error ? error : new Error('Une erreur est survenue'));
  }
}

export async function POST(request: Request) {
  try {
    const data = await request.json();
    const validation = await db.validationExpense.create({
      data: {
        ...data,
        validation_date: new Date(data.validation_date),
        created_at: new Date(),
        updated_at: new Date(),
      },
      include: {
        user: true,
        expense: true,
      },
    });
    return createdResponse(validation);
  } catch (error) {
    return errorHandler(error instanceof Error ? error : new Error('Une erreur est survenue'));
  }
}

export async function PUT(request: Request) {
  try {
    const id = parseInt(new URL(request.url).searchParams.get('id') || '');
    if (!id) return badRequest('ID validation requis');

    const data = await request.json();
    const validation = await db.validationExpense.update({
      where: { id: id },
      data: {
        ...data,
        validation_date: data.validation_date ? new Date(data.validation_date) : undefined,
        updated_at: new Date(),
      },
      include: {
        user: true,
        expense: true,
      },
    });
    return successResponse(validation);
  } catch (error) {
    return errorHandler(error instanceof Error ? error : new Error('Une erreur est survenue'));
  }
}

export async function DELETE(request: Request) {
  try {
    const id = parseInt(new URL(request.url).searchParams.get('id') || '');
    if (!id) return badRequest('ID validation requis');

    await db.validationExpense.delete({ where: { id: id } });
    return deletedResponse();
  } catch (error) {
    return errorHandler(error instanceof Error ? error : new Error('Une erreur est survenue'));
  }
}

