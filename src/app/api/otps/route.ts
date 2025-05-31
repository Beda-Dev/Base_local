import { NextResponse } from 'next/server';
import { db, errorHandler, notFound, badRequest, successResponse, createdResponse, deletedResponse } from '@/lib/api-utils';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (id) {
      const otp = await db.otp.findUnique({
        where: { id: parseInt(id) },
      });
      if (!otp) return notFound('OTP non trouvé');
      return successResponse(otp);
    }

    const otps = await db.otp.findMany();
    return successResponse(otps);
  } catch (error) {
    return errorHandler(error);
  }
}

export async function POST(request: Request) {
  try {
    const data = await request.json();
    const otp = await db.otp.create({
      data: {
        ...data,
        expiresAt: new Date(data.expiresAt),
        created_at: new Date(),
      },
    });
    return createdResponse(otp);
  } catch (error) {
    return errorHandler(error);
  }
}

export async function DELETE(request: Request) {
  try {
    const { id } = new URL(request.url).searchParams;
    if (!id) return badRequest('ID OTP requis');

    await db.otp.delete({ where: { id: parseInt(id) } });
    return deletedResponse();
  } catch (error) {
    return errorHandler(error);
  }
}
