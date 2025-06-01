import { db, errorHandler, notFound, badRequest, successResponse, createdResponse, deletedResponse } from '@/lib/api-utils';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const student_id = searchParams.get('student_id');
    const class_id = searchParams.get('class_id');

    if (!student_id || !class_id) {
      return badRequest('student_id and class_id are required parameters');
    }

    const student = await db.student.findUnique({
      where: { id: parseInt(student_id) },
      include: {
        assignment_type: true,
        registrations: {
          where: { class_id: parseInt(class_id) },
          include: {
            classe: true
          }
        }
      }
    });

    if (!student) {
      return notFound('Étudiant non trouvé');
    }

    return successResponse(student);
  } catch (error) {
    return errorHandler(error instanceof Error ? error : new Error('Une erreur est survenue'));
  }
}

export async function POST(request: Request) {
  try {
    const { student_id, class_id } = await request.json();

    if (!student_id || !class_id) {
      return badRequest('ID étudiant et ID classe sont requis');
    }

    // Vérifier si l'étudiant existe
    const student = await db.student.findUnique({
      where: { id: parseInt(student_id) },
      include: {
        assignment_type: true
      }
    });
    if (!student) {
      return notFound('Étudiant non trouvé');
    }

    // Vérifier si la classe existe
    const classe = await db.classe.findUnique({
      where: { id: parseInt(class_id) }
    });
    if (!classe) {
      return notFound('Classe non trouvée');
    }

    // Vérifier si l'attribution existe déjà
    const existingRegistration = await db.registration.findFirst({
      where: {
        student_id: parseInt(student_id),
        class_id: parseInt(class_id)
      }
    });

    if (existingRegistration) {
      return badRequest('Cette attribution existe déjà');
    }

    // Récupérer l'année académique actuelle
    const currentAcademicYear = await db.academicYear.findFirst({
      where: {
        isCurrent: 1
      }
    });

    if (!currentAcademicYear) {
      return badRequest('Aucune année académique actuelle n\'est définie');
    }

    // Créer l'attribution
    const registration = await db.registration.create({
      data: {
        student_id: parseInt(student_id),
        class_id: parseInt(class_id),
        academic_year_id: currentAcademicYear.id,
        registration_date: new Date().toISOString(),
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      },
      include: {
        student: {
          include: {
            assignment_type: true
          },
          select: {
            id: true,
            registration_number: true,
            name: true,
            first_name: true,
            assignment_type: true
          }
        },
        classe: true
      }
    });

    return createdResponse({
      ...registration,
      student: {
        ...registration.student,
        registration_number: registration.student.registration_number,
        firstName: registration.student.first_name,
        lastName: registration.student.name,
        role: registration.student.assignment_type
      }
    });
  } catch (error: unknown) {
    return errorHandler(error instanceof Error ? error : new Error('Une erreur est survenue'));
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const student_id = searchParams.get('student_id');
    const class_id = searchParams.get('class_id');

    if (!student_id || !class_id) {
      return badRequest('ID étudiant et ID classe sont requis');
    }

    // Vérifier si l'attribution existe
    const registration = await db.registration.findFirst({
      where: {
        student_id: parseInt(student_id),
        class_id: parseInt(class_id)
      }
    });

    if (!registration) {
      return notFound('Affectation non trouvée');
    }

    // Supprimer l'attribution
    await db.registration.delete({
      where: {
        id: registration.id
      }
    });

    return deletedResponse();
  } catch (error: unknown) {
    return errorHandler(error instanceof Error ? error : new Error('Une erreur est survenue'));
  }
}

