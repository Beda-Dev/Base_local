import { db, errorHandler, notFound, badRequest, successResponse, createdResponse, deletedResponse } from '@/lib/api-utils';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (id) {
      const pricing = await db.pricing.findUnique({
        where: { id: parseInt(id) },
        include: {
          assignment_type: true,
          academic_year: true,
          level: true,
          fee_type: true,
          installments: true,
        },
      });
      if (!pricing) return notFound('Prix non trouvé');
      return successResponse(pricing);
    }

    const pricings = await db.pricing.findMany({
      include: {
        assignment_type: true,
        academic_year: true,
        level: true,
        fee_type: true,
        installments: true,
      },
    });
    return successResponse(pricings);
  } catch (error) {
    return errorHandler(error instanceof Error ? error : new Error('Une erreur est survenue'));
  }
}

export async function POST(request: Request) {
  try {
    const data = await request.json();
    const pricing = await db.pricing.create({
      data: {
        ...data,
        created_at: new Date(),
        updated_at: new Date(),
      },
      include: {
        assignment_type: true,
        academic_year: true,
        level: true,
        fee_type: true,
        installments: true,
      },
    });
    return createdResponse(pricing);
  } catch (error) {
    return errorHandler(error instanceof Error ? error : new Error('Une erreur est survenue'));
  }
}

export async function PUT(request: Request) {
  try {
    const id = parseInt(new URL(request.url).searchParams.get('id') || '');
    if (!id) return badRequest('ID prix requis');

    const data = await request.json();
    const pricing = await db.pricing.update({
      where: { id: id },
      data: {
        ...data,
        updated_at: new Date(),
      },
      include: {
        assignment_type: true,
        academic_year: true,
        level: true,
        fee_type: true,
        installments: true,
      },
    });
    return successResponse(pricing);
  } catch (error) {
    return errorHandler(error instanceof Error ? error : new Error('Une erreur est survenue'));
  }
}

export async function DELETE(request: Request) {
  try {
    const id = parseInt(new URL(request.url).searchParams.get('id') || '');
    if (!id) return badRequest('ID prix requis');

    await db.pricing.delete({ where: { id: id } });
    return deletedResponse();
  } catch (error) {
    return errorHandler(error instanceof Error ? error : new Error('Une erreur est survenue'));
  }
}

