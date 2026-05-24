import { Router } from 'express';
import {
  checkAvailability,
  createBooking,
  myBookings,
  cancelBooking,
  allBookings,
} from '../controllers/bookingController.js';
import { requireAuth, requireRole } from '../middleware/auth.js';

const router = Router();

router.post('/availability', checkAvailability);

// Booking creation — public (guests booking without an account) but if a JWT
// is present we associate the booking with that user.
router.post('/bookings', (req, _res, next) => {
  const h = req.headers.authorization;
  if (h && h.startsWith('Bearer ')) return requireAuth(req, _res, next);
  next();
}, createBooking);

router.get('/bookings/me',          requireAuth, myBookings);
router.post('/bookings/:id/cancel', requireAuth, cancelBooking);
router.get('/bookings',             requireAuth, requireRole('ADMIN'), allBookings);

export default router;
