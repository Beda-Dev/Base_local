import { db, errorHandler, notFound, badRequest, successResponse, createdResponse, deletedResponse } from '@/lib/api-utils';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (id) {
      const otp = await db.oTP.findUnique({
        where: { id: parseInt(id) },
      });
      if (!otp) return notFound('OTP non trouvé');
      return successResponse(otp);
    }

    const otps = await db.oTP.findMany();
    return successResponse(otps);
  } catch (error) {
    return errorHandler(error instanceof Error ? error : new Error('Une erreur est survenue'));
  }
}

export async function POST(request: Request) {
  try {
    const data = await request.json();
    const otp = await db.oTP.create({
      data: {
        ...data,
        expiresAt: new Date(data.expiresAt),
        created_at: new Date(),
      },
    });
    return createdResponse(otp);
  } catch (error) {
    return errorHandler(error instanceof Error ? error : new Error('Une erreur est survenue'));
  }
}

export async function DELETE(request: Request) {
  try {
    const id = parseInt(new URL(request.url).searchParams.get('id') || '');
    if (!id) return badRequest('ID OTP requis');

    await db.oTP.delete({ where: { id: id } });
    return deletedResponse();
  } catch (error) {
    return errorHandler(error instanceof Error ? error : new Error('Une erreur est survenue'));
  }
}

