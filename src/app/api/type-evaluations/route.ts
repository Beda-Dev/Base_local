import { db, errorHandler, notFound, badRequest, successResponse, createdResponse, deletedResponse } from '@/lib/api-utils';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (id) {
      const typeEvaluation = await db.typeEvaluation.findUnique({
        where: { id: parseInt(id) },
      });
      if (!typeEvaluation) return notFound('Type d\'évaluation non trouvé');
      return successResponse(typeEvaluation);
    }

    const typeEvaluations = await db.typeEvaluation.findMany();
    return successResponse(typeEvaluations);
  } catch (error) {
    return errorHandler(error);
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
    return errorHandler(error);
  }
}

export async function PUT(request: Request) {
  try {
    const { id } = new URL(request.url).searchParams;
    if (!id) return badRequest('ID type d\'évaluation requis');

    const data = await request.json();
    const typeEvaluation = await db.typeEvaluation.update({
      where: { id: parseInt(id) },
      data: {
        ...data,
        updated_at: new Date(),
      },
    });
    return successResponse(typeEvaluation);
  } catch (error) {
    return errorHandler(error);
  }
}

export async function DELETE(request: Request) {
  try {
    const { id } = new URL(request.url).searchParams;
    if (!id) return badRequest('ID type d\'évaluation requis');

    await db.typeEvaluation.delete({ where: { id: parseInt(id) } });
    return deletedResponse();
  } catch (error) {
    return errorHandler(error);
  }
}

