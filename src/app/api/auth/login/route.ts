import { db, errorHandler, badRequest, successResponse } from '@/lib/api-utils';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

// Gestion des requêtes OPTIONS et CORS
export async function OPTIONS() {
  return new Response(null, {
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  });
}

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return badRequest('Email et mot de passe sont requis');
    }

    const user = await db.user.findUnique({
      where: { email },
      include: {
        roles: true,
        permissions: true,
      }
    });

    if (!user) {
      return badRequest('Email ou mot de passe incorrect');
    }

    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return badRequest('Email ou mot de passe incorrect');
    }

    const token = jwt.sign(
      { userId: user.id },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '24h' }
    );

    return successResponse({
      token,
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.roles,
        permissions: user.permissions
      }
    });
  } catch (error: unknown) {
    return errorHandler(error instanceof Error ? error : new Error('Une erreur est survenue'));
  }
}

