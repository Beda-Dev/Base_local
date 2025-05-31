import { NextResponse } from 'next/server';
import { db, errorHandler, notFound, badRequest, successResponse, createdResponse, deletedResponse } from '@/lib/api-utils';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (id) {
      const user = await db.user.findUnique({
        where: { id: parseInt(id) },
        include: {
          roles: true,
          permissions: true,
          superior: true,
          subordinates: true,
        },
      });
      if (!user) return notFound('Utilisateur non trouvé');
      return successResponse(user);
    }

    const users = await db.user.findMany({
      include: {
        roles: true,
        permissions: true,
        superior: true,
        subordinates: true,
      },
    });
    return successResponse(users);
  } catch (error: unknown) {
    return errorHandler(error instanceof Error ? error : new Error('Une erreur est survenue'));
  }
}

export async function POST(request: Request) {
  try {
    const data = await request.json();
    const user = await db.user.create({
      data: {
        ...data,
        email_verified_at: data.email_verified_at ? new Date(data.email_verified_at) : null,
        created_at: new Date(),
        updated_at: new Date(),
      },
      include: {
        roles: true,
        permissions: true,
        superior: true,
        subordinates: true,
      },
    });
    return createdResponse(user);
  } catch (error: unknown) {
    return errorHandler(error instanceof Error ? error : new Error('Une erreur est survenue'));
  }
}

export async function PUT(request: Request) {
  try {
    const id = new URL(request.url).searchParams.get('id');
    if (!id) return badRequest('ID utilisateur requis');

    const data = await request.json();
    const user = await db.user.update({
      where: { id: parseInt(id) },
      data: {
        ...data,
        email_verified_at: data.email_verified_at ? new Date(data.email_verified_at) : null,
        updated_at: new Date(),
      },
      include: {
        roles: true,
        permissions: true,
        superior: true,
        subordinates: true,
      },
    });
    return successResponse(user);
  } catch (error: unknown) {
    return errorHandler(error instanceof Error ? error : new Error('Une erreur est survenue'));
  }
}

export async function DELETE(request: Request) {
  try {
    const id = new URL(request.url).searchParams.get('id');
    if (!id) return badRequest('ID utilisateur requis');

    await db.user.delete({ where: { id: parseInt(id) } });
    return deletedResponse();
  } catch (error: unknown) {
    return errorHandler(error instanceof Error ? error : new Error('Une erreur est survenue'));
  }
}
