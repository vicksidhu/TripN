import mongoose, { Schema } from 'mongoose';

const expenseSchema = new Schema(
    {
        user: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true,
            index: true,
        },

        trip: {
            type: Schema.Types.ObjectId,
            ref: 'Trip',
            required: true,
            index: true,
        },

        description: {
            type: String,
            required: true,
            trim: true,
        },

        amount: {
            type: Number,
            required: true,
            min: 0,
        },

        category: {
            type: String,
            required: true,
            trim: true,
        },

        date: {
            type: Date,
            required: true,
        },
    },
    {
        timestamps: true,
    }
);

const Expense = mongoose.model(
    'Expense',
    expenseSchema
);

export default Expense;