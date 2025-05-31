import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const db = prisma;

export const errorHandler = (error: Error) => {
  console.error('API Error:', error);
  return NextResponse.json(
    { error: 'Une erreur est survenue lors du traitement de la requête' },
    { status: 500 }
  );
};

export const notFound = (message: string) =>
  NextResponse.json({ error: message }, { status: 404 });

export const badRequest = (message: string) =>
  NextResponse.json({ error: message }, { status: 400 });

export const successResponse = (data: any) =>
  NextResponse.json(data, { status: 200 });

export const createdResponse = (data: any) =>
  NextResponse.json(data, { status: 201 });

export const deletedResponse = () =>
  NextResponse.json({ message: 'Suppression réussie' }, { status: 200 });
