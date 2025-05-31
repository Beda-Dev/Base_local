import { db, errorHandler, notFound, badRequest, successResponse, createdResponse, deletedResponse } from '@/lib/api-utils';

export async function GET(request: Request) {
  try {
    const searchParams = new URL(request.url).searchParams;
    const id = parseInt(searchParams.get('id') || '');

    if (id) {
      const cashRegister = await db.cashRegister.findUnique({
        where: { id: id },
        include: {
          payments: true,
          expenses: true,
          sessions: true,
        },
      });
      if (!cashRegister) return notFound('Caisse non trouvée');
      return successResponse(cashRegister);
    }

    const cashRegisters = await db.cashRegister.findMany({
      include: {
        payments: true,
        expenses: true,
        sessions: true,
      },
    });
    return successResponse(cashRegisters);
  } catch (error) {
    return errorHandler(error instanceof Error ? error : new Error('Une erreur est survenue'));
  }
}

export async function POST(request: Request) {
  try {
    const data = await request.json();
    const cashRegister = await db.cashRegister.create({
      data: {
        ...data,
        created_at: new Date(),
        updated_at: new Date(),
      },
      include: {
        payments: true,
        expenses: true,
        sessions: true,
      },
    });
    return createdResponse(cashRegister);
  } catch (error) {
    return errorHandler(error instanceof Error ? error : new Error('Une erreur est survenue') );
  }
}

export async function PUT(request: Request) {
  try {
    const id = parseInt(new URL(request.url).searchParams.get('id') || '');
    if (!id) return badRequest('ID caisse requis');

    const data = await request.json();
    const cashRegister = await db.cashRegister.update({
      where: { id: id },
      data: {
        ...data,
        updated_at: new Date(),
      },
      include: {
        payments: true,
        expenses: true,
        sessions: true,
      },
    });
    return successResponse(cashRegister);
  } catch (error) {
    return errorHandler(error instanceof Error ? error : new Error('Une erreur est survenue'));
  }
}

export async function DELETE(request: Request) {
  try {
    const id = parseInt(new URL(request.url).searchParams.get('id') || '');
    if (!id) return badRequest('ID caisse requis');

    await db.cashRegister.delete({ where: { id: id } });
    return deletedResponse();
  } catch (error) {
    return errorHandler(error instanceof Error ? error : new Error('Une erreur est survenue'));
  }
}

