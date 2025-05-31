import { db, errorHandler, notFound, badRequest, successResponse, createdResponse, deletedResponse } from '@/lib/api-utils';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = parseInt(searchParams.get('id') || '');

    if (id) {
      const typeEvaluation = await db.typeEvaluation.findUnique({
        where: { id: id },
      });
      if (!typeEvaluation) return notFound('Type d\'évaluation non trouvé');
      return successResponse(typeEvaluation);
    }

    const typeEvaluations = await db.typeEvaluation.findMany();
    return successResponse(typeEvaluations);
  } catch (error) {
    return errorHandler(error instanceof Error ? error : new Error('Une erreur est survenue'));
  }
}

export async function POST(request: Request) {
  try {
    const data = await request.json();
    const typeEvaluation = await db.typeEvaluation.create({
      data: {
        ...data,
        created_at: new Date(),
        updated_at: new Date(),
      },
    });
    return createdResponse(typeEvaluation);
  } catch (error) {
    return errorHandler(error instanceof Error ? error : new Error('Une erreur est survenue'));
  }
}

export async function PUT(request: Request) {
  try {
    const id = parseInt(new URL(request.url).searchParams.get('id') || '');
    if (!id) return badRequest('ID type d\'évaluation requis');

    const data = await request.json();
    const typeEvaluation = await db.typeEvaluation.update({
      where: { id: id },
      data: {
        ...data,
        updated_at: new Date(),
      },
    });
    return successResponse(typeEvaluation);
  } catch (error) {
    return errorHandler(error instanceof Error ? error : new Error('Une erreur est survenue'));
  }
}

export async function DELETE(request: Request) {
  try {
    const id = parseInt(new URL(request.url).searchParams.get('id') || '');
    if (!id) return badRequest('ID type d\'évaluation requis');

    await db.typeEvaluation.delete({ where: { id: id } });
    return deletedResponse();
  } catch (error) {
    return errorHandler(error instanceof Error ? error : new Error('Une erreur est survenue'));
  }
}

