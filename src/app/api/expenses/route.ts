import { db, errorHandler, notFound, badRequest, successResponse, createdResponse, deletedResponse } from '@/lib/api-utils';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = parseInt(searchParams.get('id') || '');

    if (id) {
      const expense = await db.expense.findUnique({
        where: { id: id },
        include: {
          expense_type: true,
          cash_register: true,
          transaction: true,
          validations: true,
        },
      });
      if (!expense) return notFound('Dépense non trouvée');
      return successResponse(expense);
    }

    const expenses = await db.expense.findMany({
      include: {
        expense_type: true,
        cash_register: true,
        transaction: true,
        validations: true,
      },
    });
    return successResponse(expenses);
  } catch (error) {
    return errorHandler(error instanceof Error ? error : new Error('Une erreur est survenue'));
  }
}

export async function POST(request: Request) {
  try {
    const data = await request.json();
    const expense = await db.expense.create({
      data: {
        ...data,
        expense_date: new Date(data.expense_date),
        created_at: new Date(),
        updated_at: new Date(),
      },
      include: {
        expense_type: true,
        cash_register: true,
        transaction: true,
        validations: true,
      },
    });
    return createdResponse(expense);
  } catch (error) {
    return errorHandler(error instanceof Error ? error : new Error('Une erreur est survenue'));
  }
}

export async function PUT(request: Request) {
  try {
    const id = parseInt(new URL(request.url).searchParams.get('id') || '');
    if (!id) return badRequest('ID dépense requis');

    const data = await request.json();
    const expense = await db.expense.update({
      where: { id: id },
      data: {
        ...data,
        expense_date: data.expense_date ? new Date(data.expense_date) : undefined,
        updated_at: new Date(),
      },
      include: {
        expense_type: true,
        cash_register: true,
        transaction: true,
        validations: true,
      },
    });
    return successResponse(expense);
  } catch (error) {
    return errorHandler(error instanceof Error ? error : new Error('Une erreur est survenue'));
  }
}

export async function DELETE(request: Request) {
  try {
    const id = parseInt(new URL(request.url).searchParams.get('id') || '');
    if (!id) return badRequest('ID dépense requis');

    await db.expense.delete({ where: { id: id } });
    return deletedResponse();
  } catch (error) {
    return errorHandler(error instanceof Error ? error : new Error('Une erreur est survenue'));
  }
}

