import { db, errorHandler, notFound, badRequest, successResponse, createdResponse, deletedResponse } from '@/lib/api-utils';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (id) {
      const session = await db.cashRegisterSession.findUnique({
        where: { id: parseInt(id) },
        include: {
          user: true,
          cash_register: true,
          transactions: true,
        },
      });
      if (!session) return notFound('Session de caisse non trouvée');
      return successResponse(session);
    }

    const sessions = await db.cashRegisterSession.findMany({
      include: {
        user: true,
        cash_register: true,
        transactions: true,
      },
    });
    return successResponse(sessions);
  } catch (error) {
    return errorHandler(error);
  }
}

export async function POST(request: Request) {
  try {
    const data = await request.json();
    const session = await db.cashRegisterSession.create({
      data: {
        ...data,
        opening_date: new Date(data.opening_date),
        closing_date: data.closing_date ? new Date(data.closing_date) : null,
        created_at: new Date(),
        updated_at: new Date(),
      },
      include: {
        user: true,
        cash_register: true,
        transactions: true,
      },
    });
    return createdResponse(session);
  } catch (error) {
    return errorHandler(error);
  }
}

export async function PUT(request: Request) {
  try {
    const { id } = new URL(request.url).searchParams;
    if (!id) return badRequest('ID session requis');

    const data = await request.json();
    const session = await db.cashRegisterSession.update({
      where: { id: parseInt(id) },
      data: {
        ...data,
        opening_date: data.opening_date ? new Date(data.opening_date) : undefined,
        closing_date: data.closing_date ? new Date(data.closing_date) : undefined,
        updated_at: new Date(),
      },
      include: {
        user: true,
        cash_register: true,
        transactions: true,
      },
    });
    return successResponse(session);
  } catch (error) {
    return errorHandler(error);
  }
}

export async function DELETE(request: Request) {
  try {
    const { id } = new URL(request.url).searchParams;
    if (!id) return badRequest('ID session requis');

    await db.cashRegisterSession.delete({ where: { id: parseInt(id) } });
    return deletedResponse();
  } catch (error) {
    return errorHandler(error);
  }
}

