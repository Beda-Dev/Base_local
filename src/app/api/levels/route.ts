import { NextResponse } from 'next/server';
import { db, errorHandler, notFound, badRequest, successResponse, createdResponse, deletedResponse } from '@/lib/api-utils';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (id) {
      const level = await db.level.findUnique({
        where: { id: parseInt(id) },
        include: {
          classes: true,
          pricings: true,
        },
      });
      if (!level) return notFound('Niveau non trouvé');
      return successResponse(level);
    }

    const levels = await db.level.findMany({
      include: {
        classes: true,
        pricings: true,
      },
    });
    return successResponse(levels);
  } catch (error) {
    return errorHandler(error);
  }
}

export async function POST(request: Request) {
  try {
    const data = await request.json();
    const level = await db.level.create({
      data: {
        ...data,
        created_at: new Date(),
        updated_at: new Date(),
      },
      include: {
        classes: true,
        pricings: true,
      },
    });
    return createdResponse(level);
  } catch (error) {
    return errorHandler(error);
  }
}

export async function PUT(request: Request) {
  try {
    const { id } = new URL(request.url).searchParams;
    if (!id) return badRequest('ID niveau requis');

    const data = await request.json();
    const level = await db.level.update({
      where: { id: parseInt(id) },
      data: {
        ...data,
        updated_at: new Date(),
      },
      include: {
        classes: true,
        pricings: true,
      },
    });
    return successResponse(level);
  } catch (error) {
    return errorHandler(error);
  }
}

export async function DELETE(request: Request) {
  try {
    const { id } = new URL(request.url).searchParams;
    if (!id) return badRequest('ID niveau requis');

    await db.level.delete({ where: { id: parseInt(id) } });
    return deletedResponse();
  } catch (error) {
    return errorHandler(error);
  }
}
