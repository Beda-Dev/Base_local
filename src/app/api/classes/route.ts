import { db, errorHandler, notFound, badRequest, successResponse, createdResponse, deletedResponse } from '@/lib/api-utils';

export async function GET(request: Request) {
  try {
    const searchParams = new URL(request.url).searchParams;
    const id = searchParams.get('id');

    if (id) {
      const classe = await db.classe.findUnique({
        where: { id: parseInt(id) },
        include: {
          level: true,
          registrations: true,
        },
      });
      if (!classe) return notFound('Classe non trouvée');
      return successResponse(classe);
    }

    const classes = await db.classe.findMany({
      include: {
        level: true,
        registrations: true,
      },
    });
    return successResponse(classes);
  } catch (error: unknown) {
    return errorHandler(error instanceof Error ? error : new Error('Une erreur est survenue'));
  }
}

export async function POST(request: Request) {
  try {
    const data = await request.json();
    const classe = await db.classe.create({
      data: {
        ...data,
        created_at: new Date(),
        updated_at: new Date(),
      },
      include: {
        level: true,
        registrations: true,
      },
    });
    return createdResponse(classe);
  } catch (error: unknown) {
    return errorHandler(error instanceof Error ? error : new Error('Une erreur est survenue'));
  }
}

export async function PUT(request: Request) {
  try {
    const id = new URL(request.url).searchParams.get('id');
    if (!id) return badRequest('ID classe requis');

    const data = await request.json();
    const classe = await db.classe.update({
      where: { id: parseInt(id) },
      data: {
        ...data,
        updated_at: new Date(),
      },
      include: {
        level: true,
        registrations: true,
      },
    });
    return successResponse(classe);
  } catch (error: unknown) {
    return errorHandler(error instanceof Error ? error : new Error('Une erreur est survenue'));
  }
}

export async function DELETE(request: Request) {
  try {
    const id = new URL(request.url).searchParams.get('id');
    if (!id) return badRequest('ID classe requis');

    await db.classe.delete({ where: { id: parseInt(id) } });
    return deletedResponse();
  } catch (error: unknown) {
    return errorHandler(error instanceof Error ? error : new Error('Une erreur est survenue'));
  }
}

