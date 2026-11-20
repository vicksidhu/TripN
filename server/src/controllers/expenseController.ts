import type { Request, Response } from 'express';

import type { AuthRequest } from '../middleware/authMiddleware.js';
import Expense from '../models/Expense.js';
import Trip from '../models/Trip.js';

type TripParams = {
    tripId: string;
};

type ExpenseParams = {
    tripId: string;
    expenseId: string;
};

type TripRequest = AuthRequest & Request<TripParams>;

type ExpenseRequest =
    AuthRequest & Request<ExpenseParams>;

export async function getExpenses(
    req: TripRequest,
    res: Response
): Promise<void> {
    try {
        const { tripId } = req.params;

        const trip = await Trip.findOne({
            _id: tripId,
            user: req.userId,
        });

        if (!trip) {
            res.status(404).json({
                message: 'Trip not found.',
            });
            return;
        }

        const expenses = await Expense.find({
            trip: tripId,
            user: req.userId,
        }).sort({
            date: -1,
        });

        res.status(200).json(expenses);
    } catch (error) {
        console.error('Get expenses error:', error);

        res.status(500).json({
            message: 'Unable to load expenses.',
        });
    }
}

export async function createExpense(
    req: TripRequest,
    res: Response
): Promise<void> {
    try {
        const { tripId } = req.params;

        const {
            description,
            amount,
            category,
            date,
        } = req.body;

        if (
            !description ||
            amount === undefined ||
            !category ||
            !date
        ) {
            res.status(400).json({
                message:
                    'Description, amount, category, and date are required.',
            });
            return;
        }

        const numericAmount = Number(amount);

        if (
            Number.isNaN(numericAmount) ||
            numericAmount < 0
        ) {
            res.status(400).json({
                message: 'Please provide a valid expense amount.',
            });
            return;
        }

        const parsedDate = new Date(date);

        if (Number.isNaN(parsedDate.getTime())) {
            res.status(400).json({
                message: 'Please provide a valid expense date.',
            });
            return;
        }

        const trip = await Trip.findOne({
            _id: tripId,
            user: req.userId,
        });

        if (!trip) {
            res.status(404).json({
                message: 'Trip not found.',
            });
            return;
        }

        const expense = await Expense.create({
            user: req.userId,
            trip: tripId,
            description: description.trim(),
            amount: numericAmount,
            category: category.trim(),
            date: parsedDate,
        });

        res.status(201).json(expense);
    } catch (error) {
        console.error('Create expense error:', error);

        res.status(500).json({
            message: 'Unable to add expense.',
        });
    }
}

export async function deleteExpense(
    req: ExpenseRequest,
    res: Response
): Promise<void> {
    try {
        const { tripId, expenseId } = req.params;

        const expense = await Expense.findOneAndDelete({
            _id: expenseId,
            trip: tripId,
            user: req.userId,
        });

        if (!expense) {
            res.status(404).json({
                message: 'Expense not found.',
            });
            return;
        }

        res.status(200).json({
            message: 'Expense deleted successfully.',
        });
    } catch (error) {
        console.error('Delete expense error:', error);

        res.status(500).json({
            message: 'Unable to delete expense.',
        });
    }
}