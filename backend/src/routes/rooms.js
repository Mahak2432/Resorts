import { Router } from 'express';
import { listRooms, getRoom, createRoom, updateRoom, dataSourceStatus } from '../controllers/roomController.js';
import { requireAuth, requireRole } from '../middleware/auth.js';

const router = Router();

router.get('/health', dataSourceStatus);
router.get('/rooms', listRooms);
router.get('/rooms/:id', getRoom);

router.post('/rooms', requireAuth, requireRole('ADMIN'), createRoom);
router.patch('/rooms/:id', requireAuth, requireRole('ADMIN'), updateRoom);

export default router;
