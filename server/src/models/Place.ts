import mongoose, { Schema } from 'mongoose';

const placeSchema = new Schema(
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
            default: null,
        },

        placeId: {
            type: String,
            required: true,
            trim: true,
        },

        name: {
            type: String,
            required: true,
            trim: true,
        },

        latitude: {
            type: Number,
            required: true,
        },

        longitude: {
            type: Number,
            required: true,
        },
    },
    {
        timestamps: true,
    }
);

const Place = mongoose.model('Place', placeSchema);

export default Place;