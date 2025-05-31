import { NextResponse } from 'next/server';
import { db, errorHandler, notFound, badRequest, successResponse, createdResponse, deletedResponse } from '@/lib/api-utils';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    const classId = searchParams.get('classId');

    if (userId && classId) {
      const assignment = await db.assignment.findUnique({
        where: { userId_classId: { userId: parseInt(userId), classId: parseInt(classId) } },
        include: {
          user: true,
          class: true
        }
      });
      if (!assignment) return notFound('Affectation non trouvée');
      return successResponse(assignment);
    }

    const assignments = await db.assignment.findMany({
      include: {
        user: true,
        class: true
      }
    });
    return successResponse(assignments);
  } catch (error: unknown) {
    return errorHandler(error instanceof Error ? error : new Error('Une erreur est survenue'));
  }
}

export async function POST(request: Request) {
  try {
    const { userId, classId } = await request.json();

    if (!userId || !classId) {
      return badRequest('ID utilisateur et ID classe sont requis');
    }

    const existingAssignment = await db.assignment.findUnique({
      where: { userId_classId: { userId: parseInt(userId), classId: parseInt(classId) } }
    });

    if (existingAssignment) {
      return badRequest('Cette affectation existe déjà');
    }

    const assignment = await db.assignment.create({
      data: {
        userId: parseInt(userId),
        classId: parseInt(classId),
        createdAt: new Date(),
        updatedAt: new Date()
      },
      include: {
        user: true,
        class: true
      }
    });

    return createdResponse(assignment);
  } catch (error: unknown) {
    return errorHandler(error instanceof Error ? error : new Error('Une erreur est survenue'));
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    const classId = searchParams.get('classId');

    if (!userId || !classId) {
      return badRequest('ID utilisateur et ID classe sont requis');
    }

    await db.assignment.delete({
      where: { userId_classId: { userId: parseInt(userId), classId: parseInt(classId) } }
    });

    return deletedResponse();
  } catch (error: unknown) {
    return errorHandler(error instanceof Error ? error : new Error('Une erreur est survenue'));
  }
}
