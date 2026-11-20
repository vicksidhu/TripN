import { Router } from 'express';

import {
    createExpense,
    deleteExpense,
    getExpenses,
} from '../controllers/expenseController.js';

import { protect } from '../middleware/authMiddleware.js';

const router = Router();

router.use(protect);

router.get(
    '/:tripId/expenses',
    getExpenses
);

router.post(
    '/:tripId/expenses',
    createExpense
);

router.delete(
    '/:tripId/expenses/:expenseId',
    deleteExpense
);

export default router;