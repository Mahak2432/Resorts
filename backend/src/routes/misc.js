import { Router } from 'express';
import { register, login, me } from '../controllers/authController.js';
import { listAddOns } from '../controllers/addOnController.js';
import { requireAuth } from '../middleware/auth.js';

const router = Router();

router.post('/auth/register', register);
router.post('/auth/login',    login);
router.get('/auth/me',        requireAuth, me);

router.get('/addons', listAddOns);

export default router;
