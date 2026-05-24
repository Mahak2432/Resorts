import { Router } from 'express';
import { createIntent, confirmIntent } from '../controllers/paymentController.js';

const router = Router();

router.post('/payments/create-intent', createIntent);
router.post('/payments/confirm', confirmIntent);

export default router;