import { NextResponse } from 'next/server';
import { db, errorHandler, notFound, badRequest, successResponse, createdResponse, deletedResponse } from '@/lib/api-utils';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (id) {
      const payment = await db.payment.findUnique({
        where: { id: parseInt(id) },
        include: {
          student: true,
          installment: true,
          cash_register: true,
          cashier: true,
          transaction: true,
          payment_methods: true,
        },
      });
      if (!payment) return notFound('Paiement non trouvé');
      return successResponse(payment);
    }

    const payments = await db.payment.findMany({
      include: {
        student: true,
        installment: true,
        cash_register: true,
        cashier: true,
        transaction: true,
        payment_methods: true,
      },
    });
    return successResponse(payments);
  } catch (error) {
    return errorHandler(error);
  }
}

export async function POST(request: Request) {
  try {
    const data = await request.json();
    const payment = await db.payment.create({
      data: {
        ...data,
        created_at: new Date(),
        updated_at: new Date(),
      },
      include: {
        student: true,
        installment: true,
        cash_register: true,
        cashier: true,
        transaction: true,
        payment_methods: true,
      },
    });
    return createdResponse(payment);
  } catch (error) {
    return errorHandler(error);
  }
}

export async function PUT(request: Request) {
  try {
    const { id } = new URL(request.url).searchParams;
    if (!id) return badRequest('ID paiement requis');

    const data = await request.json();
    const payment = await db.payment.update({
      where: { id: parseInt(id) },
      data: {
        ...data,
        updated_at: new Date(),
      },
      include: {
        student: true,
        installment: true,
        cash_register: true,
        cashier: true,
        transaction: true,
        payment_methods: true,
      },
    });
    return successResponse(payment);
  } catch (error) {
    return errorHandler(error);
  }
}

export async function DELETE(request: Request) {
  try {
    const { id } = new URL(request.url).searchParams;
    if (!id) return badRequest('ID paiement requis');

    await db.payment.delete({ where: { id: parseInt(id) } });
    return deletedResponse();
  } catch (error) {
    return errorHandler(error);
  }
}
