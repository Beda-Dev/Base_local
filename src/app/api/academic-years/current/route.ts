import { db, errorHandler, successResponse } from '@/lib/api-utils';

export async function PUT(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const academicYearId = parseInt(searchParams.get('id') || '');

    if (!academicYearId) {
      return errorHandler(new Error('ID de l\'année académique requis'));
    }

    // Désactiver toutes les années académiques courantes existantes
    await db.academicYear.updateMany({
      where: { isCurrent: 1 },
      data: { isCurrent: 0 }
    });

    // Mettre à jour l'année académique spécifiée
    const updatedYear = await db.academicYear.update({
      where: { id: academicYearId },
      data: {
        isCurrent: 1,
        updated_at: new Date()
      }
    });

    return successResponse(updatedYear);
  } catch (error: unknown) {
    return errorHandler(error instanceof Error ? error : new Error('Une erreur est survenue'));
  }
}
