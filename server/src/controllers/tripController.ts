import type { Response } from 'express';

import Trip from '../models/Trip.js';
import type { AuthRequest } from '../middleware/authMiddleware.js';

// GET /api/trips
export async function getTrips(
  req: AuthRequest,
  res: Response
): Promise<void> {
  try {
    const trips = await Trip.find({
      user: req.userId,
    }).sort({
      startDate: 1,
    });

    res.status(200).json(trips);
  } catch (error) {
    console.error('Get trips error:', error);

    res.status(500).json({
      message: 'Unable to load trips.',
    });
  }
}

// GET /api/trips/:id
export async function getTrip(
  req: AuthRequest,
  res: Response
): Promise<void> {
  try {
    const trip = await Trip.findOne({
      _id: req.params.id,
      user: req.userId,
    });

    if (!trip) {
      res.status(404).json({
        message: 'Trip not found.',
      });
      return;
    }

    res.status(200).json(trip);
  } catch (error) {
    console.error('Get trip error:', error);

    res.status(500).json({
      message: 'Unable to load trip.',
    });
  }
}

// POST /api/trips
export async function createTrip(
  req: AuthRequest,
  res: Response
): Promise<void> {
  try {
    const {
      name,
      destination,
      startDate,
      endDate,
      description,
      budget,
    } = req.body;

    if (!name || !destination || !startDate || !endDate) {
      res.status(400).json({
        message:
          'Name, destination, start date, and end date are required.',
      });
      return;
    }

    const parsedStartDate = new Date(startDate);
    const parsedEndDate = new Date(endDate);

    if (
      Number.isNaN(parsedStartDate.getTime()) ||
      Number.isNaN(parsedEndDate.getTime())
    ) {
      res.status(400).json({
        message: 'Please provide valid trip dates.',
      });
      return;
    }

    if (parsedEndDate < parsedStartDate) {
      res.status(400).json({
        message: 'End date cannot be before start date.',
      });
      return;
    }

    const trip = await Trip.create({
      user: req.userId,
      name: name.trim(),
      destination: destination.trim(),
      startDate: parsedStartDate,
      endDate: parsedEndDate,
      description: description?.trim() || '',
      budget: budget ?? 0,
    });

    res.status(201).json(trip);
  } catch (error) {
    console.error('Create trip error:', error);

    res.status(500).json({
      message: 'Unable to create trip.',
    });
  }
}

// PUT /api/trips/:id
export async function updateTrip(
  req: AuthRequest,
  res: Response
): Promise<void> {
  try {
    const {
      name,
      destination,
      startDate,
      endDate,
      description,
      budget,
    } = req.body;

    const trip = await Trip.findOne({
      _id: req.params.id,
      user: req.userId,
    });

    if (!trip) {
      res.status(404).json({
        message: 'Trip not found.',
      });
      return;
    }

    if (name !== undefined) {
      trip.name = name.trim();
    }

    if (destination !== undefined) {
      trip.destination = destination.trim();
    }

    if (startDate !== undefined) {
      const parsedStartDate = new Date(startDate);

      if (Number.isNaN(parsedStartDate.getTime())) {
        res.status(400).json({
          message: 'Please provide a valid start date.',
        });
        return;
      }

      trip.startDate = parsedStartDate;
    }

    if (endDate !== undefined) {
      const parsedEndDate = new Date(endDate);

      if (Number.isNaN(parsedEndDate.getTime())) {
        res.status(400).json({
          message: 'Please provide a valid end date.',
        });
        return;
      }

      trip.endDate = parsedEndDate;
    }

    if (trip.endDate < trip.startDate) {
      res.status(400).json({
        message: 'End date cannot be before start date.',
      });
      return;
    }

    if (description !== undefined) {
      trip.description = description.trim();
    }

    if (budget !== undefined) {
      trip.budget = budget;
    }

    await trip.save();

    res.status(200).json(trip);
  } catch (error) {
    console.error('Update trip error:', error);

    res.status(500).json({
      message: 'Unable to update trip.',
    });
  }
}

// DELETE /api/trips/:id
export async function deleteTrip(
  req: AuthRequest,
  res: Response
): Promise<void> {
  try {
    const trip = await Trip.findOneAndDelete({
      _id: req.params.id,
      user: req.userId,
    });

    if (!trip) {
      res.status(404).json({
        message: 'Trip not found.',
      });
      return;
    }

    res.status(200).json({
      message: 'Trip deleted successfully.',
    });
  } catch (error) {
    console.error('Delete trip error:', error);

    res.status(500).json({
      message: 'Unable to delete trip.',
    });
  }
}