import type { Request, Response } from 'express';

import type { AuthRequest } from '../middleware/authMiddleware.js';
import Place from '../models/Place.js';

type PlaceParams = {
    placeId: string;
};

type PlaceRequest =
    AuthRequest & Request<PlaceParams>;

export async function getSavedPlaces(
    req: AuthRequest,
    res: Response
): Promise<void> {
    try {
        const places = await Place.find({
            user: req.userId,
        }).sort({
            createdAt: -1,
        });

        res.status(200).json(places);
    } catch (error) {
        console.error('Get saved places error:', error);

        res.status(500).json({
            message: 'Unable to load saved places.',
        });
    }
}

export async function savePlace(
    req: AuthRequest,
    res: Response
): Promise<void> {
    try {
        const {
            placeId,
            name,
            latitude,
            longitude,
            trip,
        } = req.body;

        if (
            !placeId ||
            !name ||
            latitude === undefined ||
            longitude === undefined
        ) {
            res.status(400).json({
                message: 'Place information is incomplete.',
            });
            return;
        }

        const existingPlace = await Place.findOne({
            user: req.userId,
            placeId,
        });

        if (existingPlace) {
            res.status(409).json({
                message: 'This place is already saved.',
            });
            return;
        }

        const place = await Place.create({
            user: req.userId,
            trip: trip || null,
            placeId,
            name: name.trim(),
            latitude,
            longitude,
        });

        res.status(201).json(place);
    } catch (error) {
        console.error('Save place error:', error);

        res.status(500).json({
            message: 'Unable to save place.',
        });
    }
}

export async function deleteSavedPlace(
    req: PlaceRequest,
    res: Response
): Promise<void> {
    try {
        const { placeId } = req.params;

        const place = await Place.findOneAndDelete({
            _id: placeId,
            user: req.userId,
        });

        if (!place) {
            res.status(404).json({
                message: 'Saved place not found.',
            });
            return;
        }

        res.status(200).json({
            message: 'Saved place removed.',
        });
    } catch (error) {
        console.error('Delete saved place error:', error);

        res.status(500).json({
            message: 'Unable to remove saved place.',
        });
    }
}