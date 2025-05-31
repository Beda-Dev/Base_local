import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const db = prisma;

export const errorHandler = (error: Error) => {
  console.error('API Error:', error);
  return new Response(
    JSON.stringify({ error: 'Une erreur est survenue lors du traitement de la requête' }),
    { status: 500, headers: { 'Content-Type': 'application/json' } }
  );
};

export const notFound = (message: string) =>
  new Response(JSON.stringify({ error: message }), { status: 404, headers: { 'Content-Type': 'application/json' } });

export const badRequest = (message: string) =>
  new Response(JSON.stringify({ error: message }), { status: 400, headers: { 'Content-Type': 'application/json' } });

export const successResponse = (data: Record<string, unknown> | Array<Record<string, unknown>>) =>
  new Response(JSON.stringify(data), { status: 200, headers: { 'Content-Type': 'application/json' } });

export const createdResponse = (data: Record<string, unknown>) =>
  new Response(JSON.stringify(data), { status: 201, headers: { 'Content-Type': 'application/json' } });

export const deletedResponse = () =>
  new Response(JSON.stringify({ message: 'Suppression réussie' }), { status: 200, headers: { 'Content-Type': 'application/json' } });
