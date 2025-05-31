import { db, errorHandler, notFound, badRequest, successResponse, createdResponse, deletedResponse } from '@/lib/api-utils';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (id) {
      const matter = await db.matter.findUnique({
        where: { id: parseInt(id) },
      });
      if (!matter) return notFound('Matière non trouvée');
      return successResponse(matter);
    }

    const matters = await db.matter.findMany();
    return successResponse(matters);
  } catch (error) {
    return errorHandler(error);
  }
}

export async function POST(request: Request) {
  try {
    const data = await request.json();
    const matter = await db.matter.create({
      data: {
        ...data,
        created_at: new Date(),
        updated_at: new Date(),
      },
    });
    return createdResponse(matter);
  } catch (error) {
    return errorHandler(error);
  }
}

export async function PUT(request: Request) {
  try {
    const { id } = new URL(request.url).searchParams;
    if (!id) return badRequest('ID matière requis');

    const data = await request.json();
    const matter = await db.matter.update({
      where: { id: parseInt(id) },
      data: {
        ...data,
        updated_at: new Date(),
      },
    });
    return successResponse(matter);
  } catch (error) {
    return errorHandler(error);
  }
}

export async function DELETE(request: Request) {
  try {
    const { id } = new URL(request.url).searchParams;
    if (!id) return badRequest('ID matière requis');

    await db.matter.delete({ where: { id: parseInt(id) } });
    return deletedResponse();
  } catch (error) {
    return errorHandler(error);
  }
}

