import { NextResponse } from 'next/server';
import { db, errorHandler, notFound, badRequest, successResponse, createdResponse, deletedResponse } from '@/lib/api-utils';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (id) {
      const installment = await db.installment.findUnique({
        where: { id: parseInt(id) },
        include: {
          pricing: true,
          payments: true,
        },
      });
      if (!installment) return notFound('Échéance non trouvée');
      return successResponse(installment);
    }

    const installments = await db.installment.findMany({
      include: {
        pricing: true,
        payments: true,
      },
    });
    return successResponse(installments);
  } catch (error) {
    return errorHandler(error);
  }
}

export async function POST(request: Request) {
  try {
    const data = await request.json();
    const installment = await db.installment.create({
      data: {
        ...data,
        due_date: new Date(data.due_date),
        created_at: new Date(),
        updated_at: new Date(),
      },
      include: {
        pricing: true,
        payments: true,
      },
    });
    return createdResponse(installment);
  } catch (error) {
    return errorHandler(error);
  }
}

export async function PUT(request: Request) {
  try {
    const { id } = new URL(request.url).searchParams;
    if (!id) return badRequest('ID échéance requis');

    const data = await request.json();
    const installment = await db.installment.update({
      where: { id: parseInt(id) },
      data: {
        ...data,
        due_date: data.due_date ? new Date(data.due_date) : undefined,
        updated_at: new Date(),
      },
      include: {
        pricing: true,
        payments: true,
      },
    });
    return successResponse(installment);
  } catch (error) {
    return errorHandler(error);
  }
}

export async function DELETE(request: Request) {
  try {
    const { id } = new URL(request.url).searchParams;
    if (!id) return badRequest('ID échéance requis');

    await db.installment.delete({ where: { id: parseInt(id) } });
    return deletedResponse();
  } catch (error) {
    return errorHandler(error);
  }
}
