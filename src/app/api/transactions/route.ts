import { NextResponse } from 'next/server';
import { db, errorHandler, notFound, badRequest, successResponse, createdResponse, deletedResponse } from '@/lib/api-utils';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (id) {
      const transaction = await db.transaction.findUnique({
        where: { id: parseInt(id) },
        include: {
          user: true,
          cash_register_session: true,
          payments: true,
          expenses: true,
        },
      });
      if (!transaction) return notFound('Transaction non trouvée');
      return successResponse(transaction);
    }

    const transactions = await db.transaction.findMany({
      include: {
        user: true,
        cash_register_session: true,
        payments: true,
        expenses: true,
      },
    });
    return successResponse(transactions);
  } catch (error) {
    return errorHandler(error);
  }
}

export async function POST(request: Request) {
  try {
    const data = await request.json();
    const transaction = await db.transaction.create({
      data: {
        ...data,
        transaction_date: new Date(data.transaction_date),
        created_at: new Date(),
        updated_at: new Date(),
      },
      include: {
        user: true,
        cash_register_session: true,
        payments: true,
        expenses: true,
      },
    });
    return createdResponse(transaction);
  } catch (error) {
    return errorHandler(error);
  }
}

export async function PUT(request: Request) {
  try {
    const { id } = new URL(request.url).searchParams;
    if (!id) return badRequest('ID transaction requis');

    const data = await request.json();
    const transaction = await db.transaction.update({
      where: { id: parseInt(id) },
      data: {
        ...data,
        transaction_date: data.transaction_date ? new Date(data.transaction_date) : undefined,
        updated_at: new Date(),
      },
      include: {
        user: true,
        cash_register_session: true,
        payments: true,
        expenses: true,
      },
    });
    return successResponse(transaction);
  } catch (error) {
    return errorHandler(error);
  }
}

export async function DELETE(request: Request) {
  try {
    const { id } = new URL(request.url).searchParams;
    if (!id) return badRequest('ID transaction requis');

    await db.transaction.delete({ where: { id: parseInt(id) } });
    return deletedResponse();
  } catch (error) {
    return errorHandler(error);
  }
}
