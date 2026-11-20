import { Router } from 'express';

import {
  createActivity,
  deleteActivity,
  getActivities,
  updateActivity,
} from '../controllers/activityController.js';

import { protect } from '../middleware/authMiddleware.js';

const router = Router();

router.use(protect);

router.get(
  '/:tripId/activities',
  getActivities
);

router.post(
  '/:tripId/activities',
  createActivity
);

router.delete(
  '/:tripId/activities/:activityId',
  deleteActivity
);

router.put(
  '/:tripId/activities/:activityId',
  updateActivity
);

export default router;