import { Router } from 'express';

import {
  deleteSavedPlace,
  getSavedPlaces,
  savePlace,
} from '../controllers/placeController.js';

import { protect } from '../middleware/authMiddleware.js';

const router = Router();

router.use(protect);

router.get('/', getSavedPlaces);
router.post('/', savePlace);
router.delete('/:placeId', deleteSavedPlace);

export default router;