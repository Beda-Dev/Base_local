import { db, errorHandler, notFound, badRequest, successResponse, createdResponse, deletedResponse } from '@/lib/api-utils';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (id) {
      const paymentMethod = await db.paymentMethod.findUnique({
        where: { id: parseInt(id) },
        include: {
          payments: true,
        },
      });
      if (!paymentMethod) return notFound('Méthode de paiement non trouvée');
      return successResponse(paymentMethod);
    }

    const paymentMethods = await db.paymentMethod.findMany({
      include: {
        payments: true,
      },
    });
    return successResponse(paymentMethods);
  } catch (error) {
    return errorHandler(error instanceof Error ? error : new Error('Une erreur est survenue'));
  }
}

export async function POST(request: Request) {
  try {
    const data = await request.json();
    const paymentMethod = await db.paymentMethod.create({
      data: {
        ...data,
        created_at: new Date(),
        updated_at: new Date(),
      },
      include: {
        payments: true,
      },
    });
    return createdResponse(paymentMethod);
  } catch (error) {
    return errorHandler(error instanceof Error ? error : new Error('Une erreur est survenue'));
  }
}

export async function PUT(request: Request) {
  try {
    const id = parseInt(new URL(request.url).searchParams.get('id') || '');
    if (!id) return badRequest('ID méthode de paiement requis');

    const data = await request.json();
    const paymentMethod = await db.paymentMethod.update({
      where: { id: id },
      data: {
        ...data,
        updated_at: new Date(),
      },
      include: {
        payments: true,
      },
    });
    return successResponse(paymentMethod);
  } catch (error) {
    return errorHandler(error instanceof Error ? error : new Error('Une erreur est survenue'));
  }
}

export async function DELETE(request: Request) {
  try {
    const id = parseInt(new URL(request.url).searchParams.get('id') || '');
    if (!id) return badRequest('ID méthode de paiement requis');

    await db.paymentMethod.delete({ where: { id: id } });
    return deletedResponse();
  } catch (error) {
    return errorHandler(error instanceof Error ? error : new Error('Une erreur est survenue'));
  }
}

