

import { db, errorHandler, notFound, badRequest, successResponse, createdResponse, deletedResponse } from '@/lib/api-utils';

export async function GET(request: Request) {
  try {
    const searchParams = new URL(request.url).searchParams;
    const id = searchParams.get('id');

    if (id) {
      const student = await db.student.findUnique({
        where: { id: parseInt(id) },
        include: {
          assignment_type: true,
          documents: true,
          payments: true,
          registrations: true,
          tutors: true,
        },
      });
      if (!student) return notFound('Étudiant non trouvé');
      return successResponse(student);
    }

    const students = await db.student.findMany({
      include: {
        assignment_type: true,
        documents: true,
        payments: true,
        registrations: true,
        tutors: true,
      },
    });
    return successResponse(students);
  } catch (error: unknown) {
    return errorHandler(error instanceof Error ? error : new Error('Une erreur est survenue'));
  }
}

export async function POST(request: Request) {
  try {
    const data = await request.json();
    const student = await db.student.create({
      data: {
        ...data,
        birth_date: new Date(data.birth_date),
        created_at: new Date(),
        updated_at: new Date(),
      },
      include: {
        assignment_type: true,
        documents: true,
        payments: true,
        registrations: true,
        tutors: true,
      },
    });
    return createdResponse(student);
  } catch (error: unknown) {
    return errorHandler(error instanceof Error ? error : new Error('Une erreur est survenue'));
  }
}

export async function PUT(request: Request) {
  try {
    const id = parseInt(new URL(request.url).searchParams.get('id') || '');
    if (!id) return badRequest('ID étudiant requis');

    const data = await request.json();
    const student = await db.student.update({
      where: { id: id },
      data: {
        ...data,
        birth_date: data.birth_date ? new Date(data.birth_date) : undefined,
        updated_at: new Date(),
      },
      include: {
        assignment_type: true,
        documents: true,
        payments: true,
        registrations: true,
        tutors: true,
      },
    });
    return successResponse(student);
  } catch (error: unknown) {
    return errorHandler(error instanceof Error ? error : new Error('Une erreur est survenue'));
  }
}

export async function DELETE(request: Request) {
  try {
    const id = parseInt(new URL(request.url).searchParams.get('id') || '');
    if (!id) return badRequest('ID étudiant requis');

    await db.student.delete({ where: { id: id } });
    return deletedResponse();
  } catch (error: unknown) {
    return errorHandler(error instanceof Error ? error : new Error('Une erreur est survenue'));
  }
}

