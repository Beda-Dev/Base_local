import { db, errorHandler, notFound, badRequest, successResponse, createdResponse, deletedResponse } from '@/lib/api-utils';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (id) {
      const academicYear = await db.academicYear.findUnique({
        where: { id: parseInt(id) },
        include: {
          registrations: true,
          pricings: true,
        },
      });
      if (!academicYear) return notFound('Année académique non trouvée');
      return successResponse(academicYear);
    }

    const academicYears = await db.academicYear.findMany({
      include: {
        registrations: true,
        pricings: true,
      },
    });
    return successResponse(academicYears);
  } catch (error: unknown) {
    return errorHandler(error instanceof Error ? error : new Error('Une erreur est survenue'));
  }
}

export async function POST(request: Request) {
  try {
    const data = await request.json();
    
    // Vérifier si une autre année est déjà courante
    if (data.isCurrent) {
      const currentYear = await db.academicYear.findFirst({
        where: { isCurrent: 1 }
      });
      if (currentYear) {
        return badRequest('Une année académique est déjà définie comme courante');
      }
    }

    const academicYear = await db.academicYear.create({
      data: {
        ...data,
        created_at: new Date(),
        updated_at: new Date(),
      },
      include: {
        registrations: true,
        pricings: true,
      },
    });
    return createdResponse(academicYear);
  } catch (error  : unknown) {
    return errorHandler(error instanceof Error ? error : new Error('Une erreur est survenue'));
  }
}

export async function PUT(request: Request) {
  try {
    const id = new URL(request.url).searchParams.get('id');
    if (!id) return badRequest('ID année académique requis');

    const data = await request.json();
    
    // Vérifier si une autre année est déjà courante
    if (data.isCurrent) {
      const currentYear = await db.academicYear.findFirst({
        where: {
          isCurrent: 1,
          id: { not: parseInt(id) }
        }
      });
      if (currentYear) {
        return badRequest('Une autre année académique est déjà définie comme courante');
      }
    }

    const academicYear = await db.academicYear.update({
      where: { id: parseInt(id) },
      data: {
        ...data,
        updated_at: new Date(),
      },
      include: {
        registrations: true,
        pricings: true,
      },
    });
    return successResponse(academicYear);
  } catch (error: unknown) {
    return errorHandler(error instanceof Error ? error : new Error('Une erreur est survenue'));
  }
}

export async function DELETE(request: Request) {
  try {
    const id = new URL(request.url).searchParams.get('id');
    if (!id) return badRequest('ID année académique requis');

    await db.academicYear.delete({ where: { id: parseInt(id) } });
    return deletedResponse();
  } catch (error: unknown) {
    return errorHandler(error instanceof Error ? error : new Error('Une erreur est survenue'));
  }
}

