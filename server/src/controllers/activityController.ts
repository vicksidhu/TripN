import type { Request, Response } from 'express';

import type { AuthRequest } from '../middleware/authMiddleware.js';
import Activity from '../models/Activity.js';
import Trip from '../models/Trip.js';

type TripParams = {
  tripId: string;
};

type ActivityParams = {
  tripId: string;
  activityId: string;
};

type TripRequest = AuthRequest & Request<TripParams>;

type ActivityRequest = AuthRequest & Request<ActivityParams>;

export async function getActivities(
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

    const activities = await Activity.find({
      trip: tripId,
      user: req.userId,
    }).sort({
      date: 1,
      time: 1,
    });

    res.status(200).json(activities);
  } catch (error) {
    console.error('Get activities error:', error);

    res.status(500).json({
      message: 'Unable to load itinerary.',
    });
  }
}

export async function createActivity(
  req: TripRequest,
  res: Response
): Promise<void> {
  try {
    const { tripId } = req.params;

    const {
      title,
      date,
      time,
      location,
      notes,
    } = req.body;

    if (!title || !date) {
      res.status(400).json({
        message: 'Activity title and date are required.',
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

    const parsedDate = new Date(date);

    if (Number.isNaN(parsedDate.getTime())) {
      res.status(400).json({
        message: 'Please provide a valid activity date.',
      });
      return;
    }

    const activity = await Activity.create({
      user: req.userId,
      trip: tripId,
      title: title.trim(),
      date: parsedDate,
      time: time?.trim() || '',
      location: location?.trim() || '',
      notes: notes?.trim() || '',
    });

    res.status(201).json(activity);
  } catch (error) {
    console.error('Create activity error:', error);

    res.status(500).json({
      message: 'Unable to add activity.',
    });
  }
}

export async function deleteActivity(
  req: ActivityRequest,
  res: Response
): Promise<void> {
  try {
    const { tripId, activityId } = req.params;

    const activity = await Activity.findOneAndDelete({
      _id: activityId,
      trip: tripId,
      user: req.userId,
    });

    if (!activity) {
      res.status(404).json({
        message: 'Activity not found.',
      });
      return;
    }

    res.status(200).json({
      message: 'Activity deleted successfully.',
    });
  } catch (error) {
    console.error('Delete activity error:', error);

    res.status(500).json({
      message: 'Unable to delete activity.',
    });
  }
}

export async function updateActivity(
  req: ActivityRequest,
  res: Response
): Promise<void> {
  try {
    const { tripId, activityId } = req.params;

    const {
      title,
      date,
      time,
      location,
      notes,
    } = req.body;

    const activity = await Activity.findOne({
      _id: activityId,
      trip: tripId,
      user: req.userId,
    });

    if (!activity) {
      res.status(404).json({
        message: 'Activity not found.',
      });
      return;
    }

    if (title !== undefined) {
      activity.title = title.trim();
    }

    if (date !== undefined) {
      const parsedDate = new Date(date);

      if (Number.isNaN(parsedDate.getTime())) {
        res.status(400).json({
          message: 'Please provide a valid activity date.',
        });
        return;
      }

      activity.date = parsedDate;
    }

    if (time !== undefined) {
      activity.time = time.trim();
    }

    if (location !== undefined) {
      activity.location = location.trim();
    }

    if (notes !== undefined) {
      activity.notes = notes.trim();
    }

    await activity.save();

    res.status(200).json(activity);
  } catch (error) {
    console.error('Update activity error:', error);

    res.status(500).json({
      message: 'Unable to update activity.',
    });
  }
}