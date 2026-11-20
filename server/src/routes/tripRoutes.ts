import { Router } from 'express';

import {
  createTrip,
  deleteTrip,
  getTrip,
  getTrips,
  updateTrip,
} from '../controllers/tripController.js';

import { protect } from '../middleware/authMiddleware.js';

const router = Router();

router.use(protect);

router.get('/', getTrips);
router.post('/', createTrip);

router.get('/:id', getTrip);
router.put('/:id', updateTrip);
router.delete('/:id', deleteTrip);

export default router;