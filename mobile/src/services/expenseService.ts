import {
  get,
  post,
  remove,
} from './api';

export type Expense = {
  _id: string;
  user: string;
  trip: string;

  description: string;
  amount: number;
  category: string;
  date: string;

  createdAt: string;
  updatedAt: string;
};

export type ExpenseData = {
  description: string;
  amount: number;
  category: string;
  date: string;
};

export async function getExpenses(
  tripId: string,
  token: string
): Promise<Expense[]> {
  return get<Expense[]>(
    `/api/trips/${tripId}/expenses`,
    token
  );
}

export async function createExpense(
  tripId: string,
  data: ExpenseData,
  token: string
): Promise<Expense> {
  return post<Expense>(
    `/api/trips/${tripId}/expenses`,
    data,
    token
  );
}

export async function deleteExpense(
  tripId: string,
  expenseId: string,
  token: string
): Promise<{ message: string }> {
  return remove<{ message: string }>(
    `/api/trips/${tripId}/expenses/${expenseId}`,
    token
  );
}