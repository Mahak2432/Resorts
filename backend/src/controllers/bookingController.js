import asyncHandler from 'express-async-handler';
import { getDataSource } from '../services/dataSource.js';
import { calculateStayQuote, nightsBetween, validateStayDates } from '../services/pricing.js';
import { assertPaymentSucceeded } from '../services/paymentGateway.js';

/**
 * POST /api/availability
 * Body: { checkIn, checkOut, guests? }
 * Returns rooms with no overlapping active booking + priced totals.
 */
export const checkAvailability = asyncHandler(async (req, res) => {
  const { checkIn, checkOut, guests = 2 } = req.body;
  validateStayDates(checkIn, checkOut);

  const ds = getDataSource();
  const rooms = (await ds.rooms.findAll())
    .filter(r => r.isAvailable !== false && (r.maxOccupancy || 2) >= guests);

  // For each candidate, check overlaps in parallel.
  const results = await Promise.all(rooms.map(async (room) => {
    const overlaps = await ds.bookings.findOverlapping(room._id, checkIn, checkOut);
    return overlaps.length === 0 ? room : null;
  }));

  const nights = nightsBetween(checkIn, checkOut);
  const available = results
    .filter(Boolean)
    .map(r => ({
      ...r,
      nights,
      pricePerNight: r.basePrice,
      totalPrice: r.basePrice * nights,
    }));

  res.json({ source: ds.kind, nights, count: available.length, rooms: available });
});

/**
 * POST /api/bookings
 * Body: { guestName, email, roomId, checkIn, checkOut, numGuests?, addOns? }
 */
export const createBooking = asyncHandler(async (req, res) => {
  const { guestName, email, roomId, checkIn, checkOut, numGuests = 2, paymentIntentId } = req.body;
  if (!guestName || !email || !roomId) {
    return res.status(400).json({ message: 'guestName, email and roomId are required' });
  }

  const ds = getDataSource();
  const quote = await calculateStayQuote(ds, req.body);
  const payment = assertPaymentSucceeded(paymentIntentId, quote.totalAmount);

  // Re-check availability at booking time (defends against TOCTOU).
  const conflicts = await ds.bookings.findOverlapping(roomId, checkIn, checkOut);
  if (conflicts.length) {
    return res.status(409).json({ message: 'Room no longer available for these dates' });
  }

  const booking = await ds.bookings.create({
    guestName,
    email: email.toLowerCase(),
    userId: req.user?.sub || null,
    roomId,
    checkIn,
    checkOut,
    numGuests,
    addOns: quote.bookedAddOns,
    totalAmount: quote.totalAmount,
    paymentStatus: 'PAID',
    paymentProvider: payment.provider,
    paymentIntentId: payment.id,
  });

  res.status(201).json({ source: ds.kind, booking });
});

/** GET /api/bookings/me  — guest's own bookings. */
export const myBookings = asyncHandler(async (req, res) => {
  const ds = getDataSource();
  const list = await ds.bookings.findByUserEmail(req.user.email);
  res.json({ source: ds.kind, count: list.length, bookings: list });
});

/** POST /api/bookings/:id/cancel */
export const cancelBooking = asyncHandler(async (req, res) => {
  const ds = getDataSource();
  const updated = await ds.bookings.cancel(req.params.id, req.user.email);
  if (!updated) return res.status(404).json({ message: 'Booking not found' });
  res.json(updated);
});

/** Admin — full list. */
export const allBookings = asyncHandler(async (_req, res) => {
  const ds = getDataSource();
  const list = await ds.bookings.findAll();
  res.json({ source: ds.kind, count: list.length, bookings: list });
});
